package repositories

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"github.com/feiin/ploto"
	"github.com/pdam-api/go-pdam-api/common"
	"github.com/pdam-api/go-pdam-api/dtos"
	"github.com/pdam-api/go-pdam-api/models"
)

type ImageFileRepository struct {
}

// Save implements IImageFileRepository.
func (i *ImageFileRepository) Save(ctx context.Context, tx *sql.Tx, imageFile models.ImageFile) models.ImageFile {
	SQL := `insert into image_files( created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at,
				oid, fileName, filePath, fileMime, fileUrl,) values (?,?,?,?,?,?,?,?,?)`
	_, err := tx.ExecContext(ctx, SQL, imageFile.TransactionRecord.CreatedBy, imageFile.TransactionRecord.CreatedAt,
		imageFile.TransactionRecord.LastModifiedBy, imageFile.TransactionRecord.UpdatedAt, imageFile.TransactionRecord.DeletedBy, imageFile.TransactionRecord.DeletedAt,
		imageFile.Oid, imageFile.FileName, imageFile.FilePath, imageFile.FileMime, imageFile.FileUrl)
	common.PanicIfError(err)
	return imageFile
}

// Update implements IImageFileRepository.
func (i *ImageFileRepository) Update(ctx context.Context, tx *sql.Tx, imageFile models.ImageFileDomain) models.ImageFileDomain {
	SQL := `update image_files set  last_modified_by = ?, updated_at = ?,
				fileName = ?,filePath = ?,fileMime = ?,fileUrl = ? where oid = ?`
	_, err := tx.ExecContext(ctx, SQL, imageFile.CreatedBy, imageFile.CreatedAt,
		imageFile.LastModifiedBy, imageFile.UpdatedAt, imageFile.DeletedBy, imageFile.DeletedAt,
		imageFile.FileName, imageFile.FilePath, imageFile.FileMime, imageFile.FileUrl, imageFile.Oid)
	common.PanicIfError(err)

	return imageFile
}

// Deleted implements IImageFileRepository.
func (i *ImageFileRepository) Deleted(ctx context.Context, tx *sql.Tx, oid string) {
	SQL := `delete from image_files where oid = ?`
	_, err := tx.ExecContext(ctx, SQL, oid)
	common.PanicIfError(err)
}

// FindAll implements IImageFileRepository.
func (i *ImageFileRepository) FindAll(ctx context.Context, tx *sql.Tx) []models.ImageFileDomain {
	SQL := `select oid, fileName, filePath, fileMime, fileUrl, created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at from image_files `
	rows, err := tx.QueryContext(ctx, SQL)
	common.PanicIfError(err)
	defer rows.Close()

	var imageFiles []models.ImageFileDomain
	for rows.Next() {
		imageFile := models.ImageFileDomain{}
		err := ploto.Scan(rows, &imageFile)
		common.PanicIfError(err)
		imageFiles = append(imageFiles, imageFile)
	}
	return imageFiles
}

// FindByCriteriaPage implements IImageFileRepository.
func (i *ImageFileRepository) FindByCriteriaPage(ctx context.Context, tx *sql.Tx, page int, pageSize int, condition dtos.FilterImageFileDto) ([]models.ImageFileDomain, error) {
	SQL := `SELECT oid, fileName, filePath, fileMime, fileUrl, created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
			FROM image_files`
	var queryParams []interface{}

	// Construct WHERE clause based on filter conditions
	var whereConditions []string
	if condition.FileName != "" {
		whereConditions = append(whereConditions, "fileName LIKE ?")
		queryParams = append(queryParams, fmt.Sprintf("%%%s%%", condition.FileName))
	}

	// Add WHERE clause if there are conditions
	if len(whereConditions) > 0 {
		SQL += " WHERE " + fmt.Sprintf("%s", whereConditions[0])
		for _, condition := range whereConditions[1:] {
			SQL += " AND " + condition
		}
	}

	rows, err := tx.QueryContext(ctx, SQL, queryParams...)
	common.PanicIfError(err)
	defer rows.Close()

	var imageFiles []models.ImageFileDomain
	for rows.Next() {
		imageFile := models.ImageFileDomain{}
		err := ploto.Scan(rows, &imageFile)
		common.PanicIfError(err)
		imageFiles = append(imageFiles, imageFile)
	}
	return imageFiles, err
}

// FindCountByCriteria implements IImageFileRepository.
func (i *ImageFileRepository) FindCountByCriteria(ctx context.Context, tx *sql.Tx, condition dtos.FilterImageFileDto) (int64, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	// Start building the SQL query
	queryBuilder.WriteString(`SELECT oid, fileName, filePath, fileMime, fileUrl, created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
			FROM image_files`)

	// Add WHERE clause if necessary
	var whereClauses []string
	if condition.FileName != "" {
		whereClauses = append(whereClauses, "fileName LIKE ?")
		args = append(args, "%"+condition.FileName+"%")
	}

	if len(whereClauses) > 0 {
		queryBuilder.WriteString(" WHERE ")
		queryBuilder.WriteString(strings.Join(whereClauses, " AND "))
	}

	SQL := queryBuilder.String()

	// Execute the query and get the count
	var count int64
	err := tx.QueryRowContext(ctx, SQL, args...).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("error executing query: %w", err)
	}

	return count, nil
}

// AdvanceFlter implements IImageFileRepository.
func (i *ImageFileRepository) AdvanceFlter(ctx context.Context, tx *sql.Tx, condition dtos.FilterImageFileDto) ([]models.ImageFileDomain, error) {
	var queryBuilder strings.Builder
	var args []interface{}

	// Start building the SQL query
	queryBuilder.WriteString(`SELECT oid, fileName, filePath, fileMime, fileUrl, created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at
			FROM image_files`)

	// Add WHERE clause if necessary
	var whereClauses []string
	if condition.FileName != "" {
		whereClauses = append(whereClauses, "fileName LIKE ?")
		args = append(args, "%"+condition.FileName+"%")
	}

	if len(whereClauses) > 0 {
		queryBuilder.WriteString(" WHERE ")
		queryBuilder.WriteString(strings.Join(whereClauses, " AND "))
	}

	SQL := queryBuilder.String()

	// Execute the query
	rows, err := tx.QueryContext(ctx, SQL, args...)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %w", err)
	}
	defer rows.Close()

	// Scan rows into models
	var imageFiles []models.ImageFileDomain
	for rows.Next() {
		imageFile := models.ImageFileDomain{}
		err := ploto.Scan(rows, &imageFile)
		common.PanicIfError(err)
		imageFiles = append(imageFiles, imageFile)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return imageFiles, nil
}

// FindById implements IImageFileRepository.
func (i *ImageFileRepository) FindById(ctx context.Context, tx *sql.Tx, oid string) (models.ImageFileDomain, error) {
	SQL := `select oid, fileName, filePath, fileMime, fileUrl, created_by, created_at, last_modified_by, updated_at, deleted_by, deleted_at from image_files where oid = ?`
	rows, err := tx.QueryContext(ctx, SQL, oid)
	common.PanicIfError(err)
	defer rows.Close()

	imageFile := models.ImageFileDomain{}
	if rows.Next() {
		err := ploto.Scan(rows, &imageFile)
		common.PanicIfError(err)
		return imageFile, nil
	} else {
		return imageFile, errors.New("Image File is not found")
	}
}

func NewImageFileRepository() IImageFileRepository {
	return &ImageFileRepository{}
}
