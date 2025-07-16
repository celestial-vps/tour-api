package mappings

import "github.com/pdam-api/go-pdam-api/models"

type ImageFileVm struct {
	Oid      string  `json:"oid"`
	FileUrl  *string `json:"fileUrl"`
	FileName *string `json:"fileName"`
}

func ToImageFileResponse(imageFile models.ImageFileDomain) ImageFileVm {
	return ImageFileVm{
		Oid:      imageFile.Oid.String(),
		FileUrl:  imageFile.FileUrl,
		FileName: imageFile.FileName,
	}
}

func ToImageFileResponses(imageFiles []models.ImageFileDomain) []ImageFileVm {
	var imageFileResponses []ImageFileVm
	for _, imageFile := range imageFiles {
		imageFileResponses = append(imageFileResponses, ToImageFileResponse(imageFile))
	}
	return imageFileResponses
}
