package dtos

type RegisterDto struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginDto struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponseDto struct {
	ID               string `json:"id"`
	Email            string `json:"email"`
	Name             string `json:"name,omitempty"`
	AccessToken      string `json:"accessToken"`
	RefreshToken     string `json:"refreshToken"`
	AccessExpiresAt  int64  `json:"accessExpiresAt"`
	RefreshExpiresAt int64  `json:"refreshExpiresAt"`
}
