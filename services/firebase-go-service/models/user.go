package models

import "github.com/Kamva/mgm/v3"

type User struct {
	mgm.DefaultModel `bson:",inline"`
	Name             string `json:"name" bson:"name"`
	Email            string `json:"email" bson:"email"`
	Password         string `json:"password" bson:"password"`
	RoleOid          string `json:"roleOid" bson:"roleOid"`
}
