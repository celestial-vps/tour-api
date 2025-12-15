Setup dan Model Definisi
import (
  "gorm.io/gorm"
  "gorm.io/driver/mysql"
  "time"
)

type User struct {
  ID        uint           `gorm:"primaryKey"`
  Name      string
  Email     string         `gorm:"uniqueIndex"`
  Age       int
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt gorm.DeletedAt `gorm:"index"`  // Soft delete
}

2. CRUD dan Query Filter
// Create
db.Create(&User{Name: "Budi", Email: "budi@example.com", Age: 25})

// Read
var users []User
db.Where("age >= ?", 18).Find(&users)

// Filter OR
db.Where("name = ? OR email = ?", "Budi", "budi@example.com").Find(&users)

// Filter IN
db.Where("age IN ?", []int{20,25,30}).Find(&users)

// Filter NOT
db.Not("age", 30).Find(&users)

// Filter LIKE
db.Where("name LIKE ?", "%bud%").Find(&users)

3. Relasi dan Join
type Post struct {
  ID        uint
  UserID    uint
  Title     string
  Content   string
  CreatedAt time.Time
}

// Belongs To
type User struct {
  ID    uint
  Name  string
  Posts []Post `gorm:"foreignKey:UserID"` // hasMany
}

// Preload = eager loading (join)
db.Preload("Posts").Find(&users)

4. Join Manual (Raw SQL Join)
var results []struct {
  UserName string
  PostTitle string
}

db.Table("users").
  Select("users.name as user_name, posts.title as post_title").
  Joins("left join posts on posts.user_id = users.id").
  Scan(&results)

5. Scopes (Reusable Query Conditions)
func ActiveUsers(db *gorm.DB) *gorm.DB {
  return db.Where("deleted_at IS NULL")
}

db.Scopes(ActiveUsers).Find(&users)

6. Hooks (Callbacks)
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
  if u.Name == "" {
    return errors.New("name is required")
  }
  return nil
}

7. Migration Otomatis
db.AutoMigrate(&User{}, &Post{})

8. Soft Delete dan Timestamp Otomatis

GORM otomatis mengelola CreatedAt, UpdatedAt.

Tambahkan DeletedAt gorm.DeletedAt untuk soft delete.

9. Transaction
err := db.Transaction(func(tx *gorm.DB) error {
  if err := tx.Create(&user).Error; err != nil {
    return err
  }
  if err := tx.Create(&post).Error; err != nil {
    return err
  }
  return nil
})

10. Index dan Constraint
type User struct {
  ID    uint
  Email string `gorm:"uniqueIndex"`
  Name  string `gorm:"index:idx_name_age,priority:1"`
  Age   int    `gorm:"index:idx_name_age,priority:2"`
}

11. Virtual Field / Custom Getter

GORM gak support virtual field secara native, tapi kamu bisa buat method di struct:

func (u User) FullName() string {
  return u.Name + " (user)"
}

12. Pagination
db.Limit(10).Offset(20).Find(&users)

13. Raw SQL Query
db.Raw("SELECT * FROM users WHERE age > ?", 18).Scan(&users)

14. Composite Primary Key

GORM v2 mendukung composite primary key lewat plugin, tapi biasanya lebih umum bikin primary key tunggal (ID) dan unique composite index:

type Enrollment struct {
  UserID   uint `gorm:"primaryKey"`
  CourseID uint `gorm:"primaryKey"`
}

15. Many-to-Many Relation
type User struct {
  ID      uint
  Name    string
  Languages []Language `gorm:"many2many:user_languages;"`
}

type Language struct {
  ID   uint
  Name string
}

1. Filter Complex (AND, OR, NOT, XOR)

GORM menggunakan Where, Or, dan juga Not untuk filter. Untuk XOR, kita bisa gabungkan dengan kondisi OR + NOT AND.

// AND
db.Where("age >= ? AND is_active = ?", 18, true).Find(&users)

// OR
db.Where("name = ?", "Budi").Or("email = ?", "budi@example.com").Find(&users)

// NOT
db.Not("age", 30).Find(&users)

// XOR (contoh: (A OR B) AND NOT (A AND B))
db.Where("(name = ? OR email = ?) AND NOT (name = ? AND email = ?)", "Budi", "budi@example.com", "Budi", "budi@example.com").Find(&users)

2. Join (Inner Join, Left Join, Right Join)

GORM Joins defaultnya INNER JOIN

Untuk LEFT JOIN, tambahkan keyword "LEFT JOIN ..."

// INNER JOIN users & posts
db.Table("users").
  Select("users.name, posts.title").
  Joins("inner join posts on posts.user_id = users.id").
  Scan(&results)

// LEFT JOIN
db.Table("users").
  Select("users.name, posts.title").
  Joins("left join posts on posts.user_id = users.id").
  Scan(&results)

// RIGHT JOIN (MySQL support, tapi tidak di semua DB)
db.Table("users").
  Select("users.name, posts.title").
  Joins("right join posts on posts.user_id = users.id").
  Scan(&results)

3. Group By, Count, Sum
type Result struct {
  UserID uint
  Total  int64
}

db.Model(&Order{}).
  Select("user_id, COUNT(*) as total").
  Group("user_id").
  Having("total > ?", 5).
  Scan(&results)

// Sum example
db.Model(&Order{}).
  Select("user_id, SUM(amount) as total_amount").
  Group("user_id").
  Scan(&results)

4. Composite Unique Index (2 Field Tidak Boleh Sama)
type Enrollment struct {
  UserID   uint `gorm:"primaryKey"`
  CourseID uint `gorm:"primaryKey"`
}

db.SetupJoinTable(&User{}, "Courses", &Enrollment{})

// Atau definisi index unik composite explicit:
type Vote struct {
  UserID uint
  PostID uint
}

func (Vote) TableName() string {
  return "votes"
}

db.Migrator().CreateConstraint(&Vote{}, "unique_vote")
db.Migrator().CreateIndex(&Vote{}, "idx_user_post")

// Di model struct, pakai tag index:
type Vote struct {
  UserID uint `gorm:"index:idx_user_post,unique"`
  PostID uint `gorm:"index:idx_user_post,unique"`
}

5. Soft Delete dan Timestamps Otomatis
type User struct {
  ID        uint
  Name      string
  DeletedAt gorm.DeletedAt `gorm:"index"`
  CreatedAt time.Time
  UpdatedAt time.Time
}


DeletedAt otomatis membuat soft delete dan query exclude data yang sudah dihapus.

6. Hooks (BeforeCreate, AfterUpdate, dll)
func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
  if u.Name == "" {
    return errors.New("name cannot be empty")
  }
  return
}

7. Scopes (Reusable Query)
func Active(db *gorm.DB) *gorm.DB {
  return db.Where("deleted_at IS NULL")
}

db.Scopes(Active).Find(&users)

8. Migration Otomatis
db.AutoMigrate(&User{}, &Post{}, &Enrollment{})

9. Transaction
err := db.Transaction(func(tx *gorm.DB) error {
  if err := tx.Create(&user).Error; err != nil {
    return err
  }
  if err := tx.Create(&post).Error; err != nil {
    return err
  }
  return nil
})

10. Virtual Field (Custom Getter)

GORM tidak punya virtual field bawaan, tapi kamu bisa buat method di struct:

func (u User) FullName() string {
  return u.Name + " (user)"
}

11. Pagination
db.Limit(10).Offset(20).Find(&users)

12. Many-to-Many
type User struct {
  ID        uint
  Languages []Language `gorm:"many2many:user_languages"`
}

type Language struct {
  ID   uint
  Name string
}