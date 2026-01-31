package main

import (
	"context"
	"log"
	"net"

	"tunaiq/greeter"

	"google.golang.org/grpc"
)

type greeterServer struct {
	greeter.UnimplementedGreeterServer
}

func (s *greeterServer) SayHello(ctx context.Context, req *greeter.HelloRequest) (*greeter.HelloReply, error) {
	return &greeter.HelloReply{Message: "Hello, " + req.Name + "!"}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	greeter.RegisterGreeterServer(s, &greeterServer{})

	log.Println("Server listening on port 50051...")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
