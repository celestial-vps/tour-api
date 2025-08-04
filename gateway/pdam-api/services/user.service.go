package services

import (
	"context"
	"database/sql"
	"log"
	"os"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/mappings"
	"github.com/pdam-api/go-pdam-api/middleware"
	"github.com/pdam-api/go-pdam-api/misc"
	"github.com/pdam-api/go-pdam-api/models"
	"github.com/pdam-api/go-pdam-api/repositories"
)

type UserService struct {
	UserRepository repositories.IUserRepository
	DB             *sql.DB
	Validate       *validator.Validate
}

func NewUserService(userRepository repositories.IUserRepository, DB *sql.DB, validate *validator.Validate) IUserService {
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

	if err != nil {
		common.PanicIfError(err)
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
	hash, _ := misc.HashPassword(request.Password)

	user.Oid = uuid.New()
	user.Email = request.Email
	user.Password = hash

	user.AndroidToken = &request.AndroidToken
	user.IsActive = request.IsActive

	user.RoleOid = RoleId
	user.CreatedBy = &createdBy
	user.CreatedAt = time.Now()

	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	user = service.UserRepository.Save(ctx, tx, user)
	// return mappings.ToUserResponse(user)
	messageVm := mappings.MessageVm{
		Value: user.Oid.String(),
		Name:  user.Email,
	}
	return messageVm
}

func (service *UserService) Register(ctx context.Context, request dtos.RegisterDto) mappings.UserRegisterVm {
	roleOidStr := os.Getenv("RoleId")
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

	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	user = service.UserRepository.Save(ctx, tx, user)
	return mappings.ToUserRegisterResponse(user)
}

func (service *UserService) Login(ctx context.Context, request dtos.LoginDto) mappings.UserLoginVm {
	user := models.User{
		Email:    request.Email,
		Password: request.Password,
	}
	userDto := dtos.FilterUserDto{
		Email: request.Email,
	}

	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	userMap, err := service.UserRepository.AdvanceFlter(ctx, tx, userDto)

	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	// Check if userMap.Oid is of type uuid.UUID
	if len(userMap) == 0 {
		panic(common.NewNotFoundError("Data not found"))
	}
	if request.Platform == "android" {
		userMap[0].AndroidToken = &request.AndroidToken
	} else if request.Platform == "ios" {
		userMap[0].TokenIos = &request.TokenIos
	} else if request.Platform == "web" {
		userMap[0].TokenWeb = &request.TokenWeb
	} else if request.Platform == "desktop" {
		userMap[0].TokenDesktop = &request.DesktopToken
	}

	_ = service.UserRepository.Update(ctx, tx, userMap[0])

	// Convert uuid.UUID to string
	Oid := userMap[0].Oid.String()

	marker, _ := middleware.NewJwt()
	token, _ := marker.CreateToken(Oid, user.Email)
	err = misc.CheckPassword(user.Password, userMap[0].Password)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	return mappings.ToUserTokenResponse(userMap[0], token, "", "")
}

// func (service *UserService) GetUserRole(ctx context.Context, email string) mappings.UserLoginVm {
// 	userMap, err := service.UserRepository.FindUserRole(ctx, tx, email)

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

	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	user, err := service.UserRepository.FindByMiniId(ctx, tx, oid)
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
	user = service.UserRepository.Update(ctx, tx, user)

	// return mappings.ToUserResponse(user)
	messageVm := mappings.MessageVm{
		Value: user.Oid.String(),
		Name:  user.Email,
	}
	return messageVm
}

func (service *UserService) Deleted(ctx context.Context, oid string, userOid string) mappings.MessageVm {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	user, err := service.UserRepository.FindById(ctx, tx, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	service.UserRepository.Deleted(ctx, tx, oid)
	messageVm := mappings.MessageVm{
		Value: user.Oid.String(),
		Name:  user.Name,
	}
	return messageVm
}

func (service *UserService) FindAll(ctx context.Context) []mappings.UserVm {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	users := service.UserRepository.FindAll(ctx, tx)

	return mappings.ToUserResponses(users)
}

func (service *UserService) FindPage(ctx context.Context, condition dtos.FilterUserDto, page, pageSize int) ([]mappings.UserVm, int64) {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	count, err := service.UserRepository.FindCountByCriteria(ctx, tx, condition)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	users, err := service.UserRepository.FindByCriteriaPage(ctx, tx, page, pageSize, condition)

	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	return mappings.ToUserJoinUserRoleResponses(users), count
}

func (service *UserService) FindByEmail(ctx context.Context, email string) mappings.UserVm {
	userDto := dtos.FilterUserDto{
		Email: email,
	}
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	user, err := service.UserRepository.AdvanceFlter(ctx, tx, userDto)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}
	if len(user) == 0 {
		panic(common.NewNotFoundError("Data not found"))
	}

	return mappings.ToUserResponse(user[0])
}

func (service *UserService) FindById(ctx context.Context, oid string) mappings.UserVm {
	tx, err := service.DB.Begin()
	common.PanicIfError(err)
	defer common.CommitOrRollback(tx)

	user, err := service.UserRepository.FindById(ctx, tx, oid)
	if err != nil {
		panic(common.NewNotFoundError(err.Error()))
	}

	return mappings.ToUserJoinUserRoleResponse(user)
}
