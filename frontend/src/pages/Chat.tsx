import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import { useWebRTC } from "../hooks/useWebRTC";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import SettingsModal from "../components/SettingsModal";
import Modal from "../components/Modal";
import {
  Play,
  SkipForward,
  Square,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Send,
  Settings,
  MonitorUp,
  MonitorOff,
  Sun,
  Moon,
  Palette,
  PhoneOff
} from "lucide-react";

const Chat = () => {
  const { deleteAccount } = useAuth();
  const { 
    themeMode, 
    updateSetting, 
    chatBubbleColor,
    userTags 
  } = useSettings();
  const { 
    localStream, 
    remoteStream, 
    messages, 
    status, 
    start, 
    next, 
    stop, 
    sendMessage,
    remoteUsername,
    isMicOn,
    isCameraOn,
    toggleMic,
    toggleCamera,
    isScreenSharing,
    toggleScreenShare,
    onlineUsers
  } = useWebRTC();

  const [chatMessage, setChatMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      alert("Your account has been successfully deleted.");
    } catch {
      alert("Failed to delete account. Please try again later.");
    }
  };

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      
      const handleTrackUpdate = () => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      remoteStream.addEventListener("addtrack", handleTrackUpdate);
      remoteStream.addEventListener("removetrack", handleTrackUpdate);

      return () => {
        remoteStream.removeEventListener("addtrack", handleTrackUpdate);
        remoteStream.removeEventListener("removetrack", handleTrackUpdate);
      };
    }
  }, [remoteStream]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      sendMessage(chatMessage);
      setChatMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-black text-white font-body overflow-hidden relative">
      {/* Top Navbar */}
      <header className="absolute top-0 inset-x-0 h-20 z-50 px-4 md:px-8 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
        <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <img src="/NextFace.svg" alt="NextFace Logo" className="w-8 h-8 md:w-11 md:h-11 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
          <h1 className="text-xl md:text-2xl font-fancy tracking-wider text-white drop-shadow-lg">
            Next<span className="text-brutal-accent">Face</span>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
      />

      {/* Main Remote Video Background */}
      <div className="absolute inset-0 z-0 bg-zinc-900 flex items-center justify-center">
        {!remoteStream && (
            <div className="flex flex-col items-center gap-4 text-center px-6 z-10">
              <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/10 animate-pulse mb-2">
                 <VideoIcon className="w-8 h-8 text-white/80" />
              </div>
              <h2 className="text-xl md:text-3xl font-semibold text-white tracking-tight drop-shadow-md">
                {status === "idle" ? "Ready to connect" : status === "waiting" ? "Searching for someone..." : "Connecting..."}
              </h2>
              {status === "waiting" && (
                <div className="text-sm font-medium text-white/50 animate-pulse bg-black/20 px-4 py-1.5 rounded-full mt-2">
                  {onlineUsers} people online
                </div>
              )}
            </div>
        )}
        
        <video
          ref={remoteVideoRef}
          className={`absolute inset-0 w-full h-full object-cover select-none ${remoteStream ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}
          autoPlay
          playsInline
          onLoadedMetadata={(e) => e.currentTarget.play().catch(() => {})}
        />
        {remoteStream && remoteUsername && (
          <div className="absolute top-24 left-4 md:left-6 z-10 px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-xs font-semibold text-white drop-shadow-md">
             Talking to {remoteUsername}
          </div>
        )}
      </div>

      {/* Local Video PiP */}
      <div className={`absolute top-24 right-4 md:top-24 md:right-8 w-28 h-40 md:w-48 md:h-72 z-20 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black transition-all duration-500 ${localStream ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <video
          ref={localVideoRef}
          className={`absolute inset-0 w-full h-full object-cover ${!isScreenSharing ? "-scale-x-100" : ""} ${localStream && (isCameraOn || isScreenSharing) ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
          autoPlay
          playsInline
          muted
        />
        {!isCameraOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
            <VideoOff className="w-8 h-8 md:w-12 md:h-12 text-white/30" />
          </div>
        )}
      </div>

      {/* Floating Chat Overlay (Bottom Left) */}
      <div className="absolute bottom-28 md:bottom-32 left-4 right-4 md:left-8 md:right-auto md:w-[400px] z-20 flex flex-col justify-end gap-3 max-h-[35vh] md:max-h-[50vh] pointer-events-none">
        <div className="flex-grow overflow-y-auto flex flex-col gap-2 no-scrollbar pointer-events-auto pb-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-2 text-sm rounded-2xl shadow-md backdrop-blur-md ${
                msg.sender === "you" 
                  ? "bg-blue-600/90 text-white rounded-br-sm" 
                  : msg.text.endsWith("has disconnected.") 
                    ? "w-full text-center bg-red-500/80 text-white text-xs py-1.5 rounded-full font-medium my-1" 
                    : "bg-black/50 text-white rounded-bl-sm border border-white/10"
              }`}>
                 {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Input */}
        <div className="relative flex items-center pointer-events-auto">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Message..."
              disabled={status !== "connected"}
              className="w-full bg-black/50 backdrop-blur-xl border border-white/20 text-white pl-5 pr-12 py-3.5 rounded-full text-sm focus:outline-none focus:border-white/40 placeholder:text-white/50 shadow-lg disabled:opacity-50 transition-all"
            />
            <button
              onClick={handleSendMessage}
              disabled={status !== "connected" || !chatMessage.trim()}
              className="absolute right-2 w-9 h-9 flex items-center justify-center bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-400 transition-colors disabled:opacity-20"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
        </div>
      </div>

      {/* Floating Controls Dashboard (Bottom Center) */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-black/60 backdrop-blur-2xl px-6 md:px-8 py-3.5 md:py-4 rounded-full border border-white/10 shadow-2xl pointer-events-auto">
          {status === "idle" ? (
            <button onClick={start} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg active:scale-95">
              <Play className="w-5 h-5 fill-white" />
              <span>Start</span>
            </button>
          ) : (
            <>
              <button
                onClick={toggleMic}
                className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-all active:scale-90 ${isMicOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]'}`}
              >
                {isMicOn ? <Mic className="w-5 h-5 md:w-6 md:h-6" /> : <MicOff className="w-5 h-5 md:w-6 md:h-6" />}
              </button>
              
              <button
                onClick={toggleCamera}
                className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-all active:scale-90 ${isCameraOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]'}`}
              >
                {isCameraOn ? <VideoIcon className="w-5 h-5 md:w-6 md:h-6" /> : <VideoOff className="w-5 h-5 md:w-6 md:h-6" />}
              </button>

              <button 
                onClick={stop} 
                className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-red-500 hover:bg-red-400 text-white rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:scale-105 active:scale-95 mx-2"
              >
                 <PhoneOff className="w-6 h-6 md:w-7 md:h-7 fill-white/20" />
              </button>

              <button 
                onClick={next} 
                className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all hover:scale-105 active:scale-90"
              >
                <SkipForward className="w-5 h-5 md:w-6 md:h-6 fill-white" />
              </button>
            </>
          )}
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        message="This action is permanent and cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );

};

export default Chat;



