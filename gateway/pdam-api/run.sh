#!/bin/bash

# Ambil argumen pertama sebagai ENV, default ke 'dev' kalau kosong
ENV=${1:-dev}

# Set GO_ENV dan jalankan program Go
GO_ENV=$ENV go run main.go
