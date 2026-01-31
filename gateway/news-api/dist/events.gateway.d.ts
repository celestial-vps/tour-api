import { Server } from 'socket.io';
export declare class EventsGateway {
    server: Server;
    handleConnection(client: any): void;
}
