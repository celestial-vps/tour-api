package dtos

type FilterImageFileDto struct {
	FileName string `json:"fileName" validate:"omitempty"`
}

type CreateImageFileDto struct {
	FileName     string `json:"fileName"`
	FileUrl      string `json:"fileUrl"`
	FilePath     string `json:"filePath"`
	FileMime     string `json:"fileMime"`
	UserInserted string `json:"userInserted"`
}

type UpdateImageFileDto struct {
	Oid        string `json:"oid"`
	FileName   string `json:"fileName"`
	FileUrl    string `json:"fileUrl"`
	FilePath   string `json:"filePath"`
	FileMime   string `json:"fileMime"`
	LastUserId string `json:"lastUserId"`
}
