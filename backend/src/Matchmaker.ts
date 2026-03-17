import { Socket } from "socket.io";
import { randomUUID } from "crypto";
import { ServerToClientEvents, ClientToServerEvents } from "./types";

export class Matchmaker {
  private waitingUsers: Socket<ClientToServerEvents, ServerToClientEvents>[] = [];
  private rooms: Map<string, Socket[]> = new Map();

  // Add a user to the matchmaking queue
  joinQueue(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
    // If the queue is empty, or the user is already in the queue, just push or do nothing
    if (!this.waitingUsers.find((s) => s.id === socket.id)) {
      this.waitingUsers.push(socket);
      this.tryMatch();
    }
  }

  // Remove a user from the queue (e.g. if they disconnected while waiting)
  leaveQueue(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
    this.waitingUsers = this.waitingUsers.filter((s) => s.id !== socket.id);
  }

  // Try to pair the top two users
  private tryMatch() {
    console.log(`[MATCHMAKER] Checking queue. Length: ${this.waitingUsers.length}`);
    if (this.waitingUsers.length >= 2) {
      const user1 = this.waitingUsers.shift();
      const user2 = this.waitingUsers.shift();

      if (user1 && user2) {
        // Double check they are still connected
        if (!user1.connected) {
          if (user2.connected) this.waitingUsers.unshift(user2);
          this.tryMatch();
          return;
        }
        if (!user2.connected) {
          if (user1.connected) this.waitingUsers.unshift(user1);
          this.tryMatch();
          return;
        }

        const roomId = randomUUID();

        // Join both to the socket room
        user1.join(roomId);
        user2.join(roomId);

        this.rooms.set(roomId, [user1, user2]);

        const name1 = (user1 as any).user?.username || "Stranger";
        const name2 = (user2 as any).user?.username || "Stranger";

        console.log(`Pairing users: ${user1.id} (${name1}) with ${user2.id} (${name2})`);

        // Send 'user-paired' event
        user1.emit("user-paired", { 
          roomId, 
          isInitiator: true, 
          remoteUsername: name2 
        });
        user2.emit("user-paired", { 
          roomId, 
          isInitiator: false, 
          remoteUsername: name1 
        });
      }
    }
  }

  // Handle disconnection of a paired user
  handleDisconnect(socket: Socket) {
    this.leaveQueue(socket);
    
    // Find if the user was in a room
    for (const [roomId, users] of this.rooms.entries()) {
      if (users.find(u => u.id === socket.id)) {
        // Notify the other user
        socket.to(roomId).emit("user-disconnected");
        
        // Remove room from map, clear socket from room server-side
        const otherUser = users.find(u => u.id !== socket.id);
        if (otherUser) {
          otherUser.leave(roomId);
        }
        this.rooms.delete(roomId);
        break;
      }
    }
  }

  // "Next" functionally cleanly drops the room and optionally requeues them
  handleNext(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
    // Find their room and kill it
    for (const [roomId, users] of this.rooms.entries()) {
        if (users.find(u => u.id === socket.id)) {
          // Notify both users internally if needed, or simply the other one
          socket.to(roomId).emit("user-disconnected");
          
          users.forEach(u => u.leave(roomId));
          this.rooms.delete(roomId);
          break;
        }
    }
  }
}
