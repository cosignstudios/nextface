import { useEffect, useRef, useState, useCallback } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useAuth } from "../context/AuthContext";

import { supabase } from "../supabase";

const WORKER_URL = import.meta.env.VITE_CLOUDFLARE_WORKER_URL || "YOUR_CLOUDFLARE_WORKER_URL";

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
  const { username } = useAuth(); 
  const [userId] = useState(() => crypto.randomUUID());
  const localUsername = username || "Stranger";

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ConnectionState>("idle");

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const [remoteUsername, setRemoteUsername] = useState<string>("");
  const [onlineUsers] = useState<number>(0);
  const remoteUsernameRef = useRef<string>("");

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const currentRoomIdRef = useRef<string | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isMatchingRef = useRef<boolean>(false);

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
  }, []);

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

    if (localStreamRef.current) {
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
    }
    setIsScreenSharing(false);
  }, [isScreenSharing]);

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

        setLocalStream(stream);

        screenTrack.onended = () => stopScreenShare();
        setIsScreenSharing(true);
      } catch (err) {
        console.error("Error starting screen share:", err);
      }
    }
  }, [isScreenSharing, stopScreenShare]);

  const cleanupConnection = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setRemoteStream(null);
    setRemoteUsername("");
    remoteUsernameRef.current = "";
    currentRoomIdRef.current = null;
    isMatchingRef.current = false;
  }, []);

  const setupDataChannel = useCallback((channel: RTCDataChannel) => {
    channel.onopen = () => {
      console.log("Data channel opened! Disconnecting from Supabase Realtime to save resources.");
      // P2P Takeover: We drop the Supabase connection because we can now chat directly
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      // Send our username to the peer
      channel.send(JSON.stringify({ type: 'username', username: localUsername }));
    };

    channel.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat') {
        setMessages((prev) => [...prev, { sender: "stranger", text: data.message }]);
      } else if (data.type === 'username') {
        setRemoteUsername(data.username);
        remoteUsernameRef.current = data.username;
      } else if (data.type === 'disconnect') {
        handlePeerDisconnect();
      }
    };

    channel.onclose = () => {
      console.log("Data channel closed.");
      handlePeerDisconnect();
    };

    dataChannelRef.current = channel;
  }, [localUsername]);

  const handlePeerDisconnect = useCallback(() => {
    const name = remoteUsernameRef.current;
    cleanupConnection();
    setStatus("waiting");
    setMessages((prev) => [...prev, { sender: "stranger", text: `${name || 'Stranger'} has disconnected.` }]);
    // Optionally automatically start finding next match here
  }, [cleanupConnection]);

  const createPeerConnection = useCallback((roomId: string, isInitiator: boolean, stream: MediaStream, channel: RealtimeChannel) => {
    const pc = new RTCPeerConnection(STUN_SERVERS);
    peerConnectionRef.current = pc;
    currentRoomIdRef.current = roomId;

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // Setup Data Channel for Chat and Signaling (P2P takeover)
    if (isInitiator) {
      const dataChannel = pc.createDataChannel("chat");
      setupDataChannel(dataChannel);
    } else {
      pc.ondatachannel = (event) => {
        setupDataChannel(event.channel);
      };
    }

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        channel.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: { candidate: event.candidate, senderId: userId }
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        handlePeerDisconnect();
      }
    };

    if (isInitiator) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          channel.send({
            type: 'broadcast',
            event: 'offer',
            payload: { offer: pc.localDescription!, senderId: userId }
          });
        })
        .catch((e) => console.error("Error creating offer", e));
    }
  }, [userId, setupDataChannel, handlePeerDisconnect]);

  const connectToSupabaseRoom = useCallback(async (roomId: string, isInitiator: boolean) => {
    const stream = localStreamRef.current || await initializeMedia();
    if (!stream) return;

    const channel = supabase.channel(`room:${roomId}`);
    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'offer' }, async ({ payload }) => {
        if (payload.senderId === userId || !peerConnectionRef.current) return;
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.offer));
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          channel.send({
            type: 'broadcast',
            event: 'answer',
            payload: { answer, senderId: userId }
          });
        } catch (err) {
          console.error("Error handling offer", err);
        }
      })
      .on('broadcast', { event: 'answer' }, async ({ payload }) => {
        if (payload.senderId === userId || !peerConnectionRef.current) return;
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.answer));
        } catch (err) {
          console.error("Error handling answer", err);
        }
      })
      .on('broadcast', { event: 'ice-candidate' }, async ({ payload }) => {
        if (payload.senderId === userId || !peerConnectionRef.current) return;
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
        } catch (err) {
          console.error("Error handling ice candidate", err);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to Supabase Room ${roomId}`);
          createPeerConnection(roomId, isInitiator, stream, channel);
        }
      });
  }, [userId, initializeMedia, createPeerConnection]);

  const pollForMatch = useCallback(async () => {
    if (!isMatchingRef.current) return;
    
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      
      const data = await res.json();
      
      if (!isMatchingRef.current) return; // User stopped while waiting
      
      if (data.status === "matched") {
        setStatus("connected");
        setMessages([]);
        connectToSupabaseRoom(data.roomId, data.isInitiator);
      } else if (data.status === "waiting" || data.status === "retry") {
        // Long poll finished without a match, loop again
        setTimeout(pollForMatch, 1000);
      }
    } catch (err) {
      console.error("Error matching:", err);
      // Retry on failure
      setTimeout(pollForMatch, 3000);
    }
  }, [userId, connectToSupabaseRoom]);

  const start = async () => {
    await initializeMedia();
    setStatus("waiting");
    isMatchingRef.current = true;
    pollForMatch();
  };

  const next = () => {
    // Notify peer before closing
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      dataChannelRef.current.send(JSON.stringify({ type: 'disconnect' }));
    }
    cleanupConnection();
    setStatus("waiting");
    setMessages([]);
    isMatchingRef.current = true;
    pollForMatch();
  };

  const stop = () => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      dataChannelRef.current.send(JSON.stringify({ type: 'disconnect' }));
    }
    cleanupConnection();
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
    
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      dataChannelRef.current.send(JSON.stringify({ type: 'chat', message: text }));
    } else {
      console.warn("Data channel is not open, cannot send message.");
    }
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
