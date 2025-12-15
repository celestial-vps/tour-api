package services

import (
	"context"
	"database/sql"
	"log"
	"os"
	"time"

	"shipping-api/common"
	"shipping-api/dtos"
	"shipping-api/mappings"
	"shipping-api/middleware"
	"shipping-api/misc"
	"shipping-api/models"
	"shipping-api/repositories"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserService struct {
	UserRepository repositories.IUserRepository
	DB             *gorm.DB
	Validate       *validator.Validate
}

func NewUserService(userRepository repositories.IUserRepository, DB *gorm.DB, validate *validator.Validate) IUserService {
	return &UserService{
		UserRepository: userRepository,
		DB:             DB,
		Validate:       validate,
	}
}

func (service *UserService) Create(ctx context.Context, request dtos.CreateUserDto, userOid string) mappings.MessageVm {
	var user models.User
	createdBy, err := uuid.Parse(userOid)
	if err != nil {
		common.PanicIfError(err)
	}
	RoleId := uuid.MustParse(request.RoleOid)
	if request.ActivatedAt != "" {
		parsedTime, err := time.Parse("2006-01-02", request.ActivatedAt)
		if err != nil {
			common.PanicIfError(err)
		}
		user.ActivatedAt = sql.NullTime{Time: parsedTime, Valid: true}
	} else {
		user.ActivatedAt = sql.NullTime{Valid: false} // Set as invalid if not provided
	}

	user.Oid = uuid.New()
	user.Email = request.Email
	user.Password = request.Password
	user.AndroidToken = &request.AndroidToken
	user.IsActive = request.IsActive

	user.RoleOid = RoleId
	user.CreatedBy = &createdBy
	user.CreatedAt = time.Now()

	user = service.UserRepository.Save(ctx, service.DB, user)
	// return mappings.ToUserResponse(user)
	messageVm := mappings.MessageVm{
		Value: user.Oid.String(),
		Name:  user.Email,
	}
	return messageVm
}

func (service *UserService) Register(ctx context.Context, request dtos.RegisterDto) mappings.UserRegisterVm {
	roleOidStr := os.Getenv("ROLEID")
	if roleOidStr == "" {
		log.Fatal("RoleId environment variable not set")
	}
	roleId, err := uuid.Parse(roleOidStr)
	common.PanicIfError(err)

	if err != nil {
		log.Fatalf("Failed to parse RoleId UUID: %v", err)
	}
	hash, _ := misc.HashPassword(request.Password)

	user := models.User{
		Oid:       uuid.New(),
		Email:     request.Email,
		Password:  hash,
		RoleOid:   roleId,
		CreatedAt: time.Now(),
	}
	user = service.UserRepository.Save(ctx, service.DB, user)
	return mappings.ToUserRegisterResponse(user)
}

func (service *UserService) Login(ctx context.Context, request dtos.LoginDto) mappings.UserLoginVm {
	user := models.User{
		// ID:        uuid.New(),
		Email:    request.Email,
		Password: request.Password,
		// CreatedAt: time.Now(),
	}
	userDto := dtos.FilterUserDto{
		Email: request.Email,
	}
	userMap, err := service.UserRepository.AdvanceFlter(ctx, service.DB, userDto)

	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	// Check if userMap.Oid is of type uuid.UUID
	if len(userMap) == 0 {
		panic(common.NewNotFoundError("Data not found"))
	}

	err = misc.CheckPassword(user.Password, userMap[0].Password)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	// Convert uuid.UUID to string
	Oid := userMap[0].Oid.String()

	marker, _ := middleware.NewJwt()
	token, _ := marker.CreateToken(Oid, user.Email, userMap[0].Role.RoleName)
	// refreshToken, _ := marker.CreateRefreshToken(Oid, user.Email)

	return mappings.ToUserTokenResponse(userMap[0], token, "refreshToken", "")
}

// RefreshToken implements IUserService.
func (service *UserService) RefreshToken(ctx context.Context, oid string, email string) mappings.UserLoginVm {

	// user := models.User{
	// 	// ID:        uuid.New(),
	// 	Email:    request.Email,
	// 	Password: request.Password,
	// 	// CreatedAt: time.Now(),
	// }
	userDto := dtos.FilterUserDto{
		Email: email,
	}
	userMap, err := service.UserRepository.AdvanceFlter(ctx, service.DB, userDto)

	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	// // Check if userMap.Oid is of type uuid.UUID
	// if len(userMap) == 0 {
	// 	panic(common.NewNotFoundError("Data not found"))
	// }

	// err = misc.CheckPassword(password, userMap[0].Password)
	// if err != nil {
	// 	panic(common.NewNotFoundError(err.Error()))
	// }

	// Convert uuid.UUID to string
	// Oid := userMap[0].Oid.String()

	marker, _ := middleware.NewJwt()
	token, _ := marker.CreateToken(oid, email, userMap[0].Role.RoleName)
	// refreshToken, _ := marker.CreateRefreshToken(oid, email)

	return mappings.ToUserTokenResponse(userMap[0], token, "refreshToken", "")
}

// func (service *UserService) GetUserRole(ctx context.Context, email string) mappings.UserLoginVm {
// 	userMap, err := service.UserRepository.FindUserRole(ctx, service.DB, email)

// 	if err != nil {
// 		panic(common.NewNotFoundError(err.Error()))
// 	}

// 	return mappings.ToUserTokenResponse(*userMap, "", "", "")
// }

func (service *UserService) Update(ctx context.Context, request dtos.UpdateUserDto, oid string, userOid string) mappings.MessageVm {
	err := service.Validate.Struct(request)
	common.PanicIfError(err)

	lastModifiedBy, err := uuid.Parse(userOid)
	if err != nil {
		common.PanicIfError(err)
	}

	user, err := service.UserRepository.FindById(ctx, service.DB, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	if request.ActivatedAt != "" {
		parsedTime, err := time.Parse("2006-01-02", request.ActivatedAt)
		if err != nil {
			common.PanicIfError(err)
		}
		user.ActivatedAt = sql.NullTime{Time: parsedTime, Valid: true}
	} else {
		user.ActivatedAt = sql.NullTime{Valid: false} // Set as invalid if not provided
	}

	now := time.Now()
	user.Email = request.Email
	user.LastModifiedBy = lastModifiedBy
	user.UpdatedAt = &now
	user = service.UserRepository.Update(ctx, service.DB, user)

	// return mappings.ToUserResponse(user)
	messageVm := mappings.MessageVm{
		Value: user.Oid.String(),
		Name:  user.Email,
	}
	return messageVm
}

func (service *UserService) Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm {

	user, err := service.UserRepository.FindById(ctx, service.DB, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	service.UserRepository.Deleted(ctx, service.DB, oid)
	messageVm := mappings.MessageVm{
		Value: user.Oid.String(),
		Name:  user.Email,
	}
	return messageVm
}

func (service *UserService) FindAll(ctx context.Context) []mappings.UserVm {
	users := service.UserRepository.FindAll(ctx, service.DB)

	return mappings.ToUserResponses(users)
}

func (service *UserService) FindPage(ctx context.Context, condition dtos.FilterUserDto, page, pageSize int) ([]mappings.UserVm, int64) {
	count, err := service.UserRepository.FindCountByCriteria(ctx, service.DB, condition)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	users, err := service.UserRepository.FindByCriteriaPage(ctx, service.DB, page, pageSize, condition)

	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	return mappings.ToUserResponses(users), count
}

func (service *UserService) FindByEmail(ctx context.Context, email string) mappings.UserVm {
	userDto := dtos.FilterUserDto{
		Email: email,
	}
	user, err := service.UserRepository.AdvanceFlter(ctx, service.DB, userDto)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	if len(user) == 0 {
		panic(common.NewNotFoundError("Data not found"))
	}

	return mappings.ToUserResponse(user[0])
}

func (service *UserService) FindById(ctx context.Context, oid string) mappings.UserVm {

	user, err := service.UserRepository.FindById(ctx, service.DB, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	return mappings.ToUserResponse(user)
}
