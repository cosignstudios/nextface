import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "../types";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = "http://localhost:3001";
const STUN_SERVERS = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
};

export interface ChatMessage {
  sender: "you" | "stranger";
  text: string;
}

export type ConnectionState = "idle" | "waiting" | "connected";

export const useWebRTC = () => {
  const { token } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ConnectionState>("idle");

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const [remoteUsername, setRemoteUsername] = useState<string>("");
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const remoteUsernameRef = useRef<string>("");

  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const currentRoomIdRef = useRef<string | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null); // For event closures
  const screenStreamRef = useRef<MediaStream | null>(null);

  const initializeMedia = useCallback(async () => {
    try {
      if (!localStreamRef.current) {
         const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
         });
         setLocalStream(stream);
         localStreamRef.current = stream;
         return stream;
      }
      return localStreamRef.current;
    } catch (error) {
      console.error("Error accessing media devices.", error);
      return null;
    }
  }, []); // Stable initialization

  // Independent track syncing
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => (t.enabled = isMicOn));
    }
  }, [isMicOn, localStream]);

  useEffect(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach(t => (t.enabled = isCameraOn));
    }
  }, [isCameraOn, localStream]);

  const stopScreenShare = useCallback(async () => {
    if (!isScreenSharing || !screenStreamRef.current) return;

    screenStreamRef.current.getTracks().forEach(track => track.stop());
    screenStreamRef.current = null;

    if (peerConnectionRef.current && localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
      if (sender && videoTrack) {
        await sender.replaceTrack(videoTrack);
      }
    }

    // Revert local stream view
    if (localStreamRef.current) {
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
    }

    setIsScreenSharing(false);
  }, [isScreenSharing]);

  // Handle screen share cleanup when connection drops
  useEffect(() => {
    if (status !== "connected" && isScreenSharing) {
        stopScreenShare();
    }
  }, [status, isScreenSharing, stopScreenShare]);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      await stopScreenShare();
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = stream;
        const screenTrack = stream.getVideoTracks()[0];

        if (peerConnectionRef.current) {
          const sender = peerConnectionRef.current.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            await sender.replaceTrack(screenTrack);
          }
        }

        // Update local view
        setLocalStream(stream);

        screenTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error("Error starting screen share:", err);
      }
    }
  }, [isScreenSharing, stopScreenShare]);

  const cleanupConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setRemoteStream(null);
    setRemoteUsername("");
    remoteUsernameRef.current = ""; // Clear ref as well
    currentRoomIdRef.current = null;
  }, []);

  const createPeerConnection = useCallback((roomId: string, isInitiator: boolean, stream: MediaStream) => {
    const pc = new RTCPeerConnection(STUN_SERVERS);
    peerConnectionRef.current = pc;
    currentRoomIdRef.current = roomId;

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      console.log("Track received!", event.streams[0]);
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("send-ice-candidate", { roomId, candidate: event.candidate });
      }
    };

    if (isInitiator) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          socketRef.current?.emit("send-offer", { roomId, offer: pc.localDescription! });
        })
        .catch((e) => console.error("Error creating offer", e));
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
      auth: { token },
    });
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      console.log("[SOCKET] Connected to backend signaling server:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("[SOCKET] Connection error:", err.message);
    });

    newSocket.on("user-paired", async ({ roomId, isInitiator, remoteUsername }) => {
      console.log("Match found! Remote user:", remoteUsername, "Room:", roomId);
      setStatus("connected");
      setRemoteUsername(remoteUsername);
      remoteUsernameRef.current = remoteUsername;
      setMessages([]); // clear chat on new connection
      
      const stream = localStreamRef.current || await initializeMedia();
      if (stream) {
          createPeerConnection(roomId, isInitiator, stream);
      }
    });

    newSocket.on("user-disconnected", () => {
      const name = remoteUsernameRef.current;
      cleanupConnection();
      setStatus("waiting");
      setMessages((prev) => [...prev, { sender: "stranger", text: `${name || 'Stranger'} has disconnected.` }]);
    });

    newSocket.on("receive-offer", async ({ offer, roomId }) => {
      if (!peerConnectionRef.current) return;
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        newSocket.emit("send-answer", { roomId, answer });
      } catch (err) {
        console.error("Error handling offer", err);
      }
    });

    newSocket.on("receive-answer", async ({ answer }) => {
      if (!peerConnectionRef.current) return;
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) {
        console.error("Error handling answer", err);
      }
    });

    newSocket.on("receive-ice-candidate", async ({ candidate }) => {
      if (!peerConnectionRef.current) return;
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error handling ice candidate", err);
      }
    });

    newSocket.on("receive-chat-message", ({ message }) => {
      setMessages((prev) => [...prev, { sender: "stranger", text: message }]);
    });

    newSocket.on("online-users-count", ({ count }) => {
      setOnlineUsers(count);
    });

    // Auto-initialize media on mount
    initializeMedia();

    return () => {
      cleanupConnection();
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
        screenStreamRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      newSocket.disconnect();
    };
  }, [token]); // token is the only dependency that should restart everything

  const start = async () => {
    await initializeMedia();
    setStatus("waiting");
    socketRef.current?.emit("join-queue");
  };

  const next = () => {
    cleanupConnection();
    setStatus("waiting");
    setMessages([]); // Clear chat explicitly when moving to next
    socketRef.current?.emit("next-user");
  };

  const stop = () => {
    cleanupConnection();
    socketRef.current?.emit("leave-queue");
    setStatus("idle");
    setMessages([]);
    if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        setLocalStream(null);
        localStreamRef.current = null;
    }
  };

  const toggleMic = () => {
    setIsMicOn(prev => !prev);
  };

  const toggleCamera = () => {
    setIsCameraOn(prev => !prev);
  };

  const sendMessage = (text: string) => {
    if (text.trim() === "" || !currentRoomIdRef.current) return;
    setMessages((prev) => [...prev, { sender: "you", text }]);
    socketRef.current?.emit("send-chat-message", { roomId: currentRoomIdRef.current, message: text });
  };

  return { 
    localStream, 
    remoteStream, 
    messages, 
    status, 
    start, 
    next, 
    stop, 
    sendMessage,
    isMicOn,
    isCameraOn,
    toggleMic,
    toggleCamera,
    isScreenSharing,
    toggleScreenShare,
    remoteUsername,
    initializeMedia,
    onlineUsers
  };

};

export default useWebRTC;
