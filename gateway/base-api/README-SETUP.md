# CREATE PROJECT
create file go.mod & main.go

file base-api/go.mod
module base-api

go 1.21

require (
    github.com/kamva/mgm/v3 v3.0.0
    github.com/gin-gonic/gin v1.10.0
) 

# SETUP 
go get -u github.com/gin-gonic/gin
go get github.com/kamva/mgm/v3


go mod tidy
go run main.go
