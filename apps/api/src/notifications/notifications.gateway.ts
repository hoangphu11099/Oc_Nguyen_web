import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class NotificationsGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  afterInit() {
    console.log("Notification Gateway đã sẵn sàng");
  }

  sendToAdmin(notification: unknown) {
    this.server.emit("admin_notification", notification);
  }
}
