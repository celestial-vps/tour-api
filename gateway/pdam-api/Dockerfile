# ========================
# Stage 1: Build
# ========================
FROM golang:1.24-alpine AS builder


WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o app .

# ========================
# Stage 2: Runtime
# ========================
FROM alpine:latest
RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app
COPY --from=builder /app/app .
COPY .env.dev .env.dev

EXPOSE 5301

CMD ["./app"]
