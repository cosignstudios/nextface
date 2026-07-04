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
  Palette
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
    <div className="flex flex-col h-screen bg-brutal-bg text-[var(--text-color)] font-body overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 bg-[var(--surface-white)] border-b-2 border-black px-4 md:px-8 flex justify-between items-center shrink-0 z-50">
        <Link to="/" className="flex items-center gap-3 transition-transform hover:rotate-1 hover:scale-105">
          <img src="/NextFace.svg" alt="NextFace Logo" className="w-8 h-8 md:w-11 md:h-11 object-contain" />
          <h1 className="text-xl md:text-2xl font-fancy tracking-wider text-[var(--text-color)]">
            Next<span className="text-brutal-accent drop-shadow-[2px_2px_0_#000]">Face</span>
          </h1>
        </Link>


        <div className="flex items-center gap-4">
          {/* User Tags Display in Header */}
          <div className="hidden md:flex gap-2 mr-4">
            {userTags.map((tag, i) => (
              <div 
                key={i} 
                className="bg-brutal-accent text-black border-2 border-black px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter transform -rotate-2 shadow-[2px_2px_0px_0px_#000]"
              >
                {tag}
              </div>
            ))}
          </div>

          <button 
            onClick={() => updateSetting('themeMode', themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'gray' : 'light')}
            className="p-2 border-2 border-black bg-white shadow-[var(--dynamic-shadow)_var(--dynamic-shadow)_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all mr-2 text-black"
             title={`Switch theme: ${themeMode === 'light' ? 'Dark' : themeMode === 'dark' ? 'Classic Gray' : 'Light'} Mode`}
          >
            {themeMode === 'light' && <Sun className="w-4 h-4" />}
            {themeMode === 'dark' && <Moon className="w-4 h-4" />}
            {themeMode === 'gray' && <Palette className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 btn-brutal !p-0 bg-brutal-accent group"
            title="Console Settings"
          >
            <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </header>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
      />


      {/* Main Content Area */}
      <main className="relative flex flex-col lg:flex-row flex-1 min-h-0 w-full overflow-hidden p-0 lg:p-6 gap-0 lg:gap-6 bg-black lg:bg-transparent">

        {/* Left Column: The Stage */}
        <section className="absolute lg:relative inset-0 lg:inset-auto flex-grow flex flex-col gap-0 lg:gap-6 min-w-0 z-0 lg:z-auto">
          <div className="flex-grow lg:card-brutal !p-0 bg-black relative group flex items-center justify-center overflow-hidden">
            {!remoteStream && (
                <div className="flex flex-col items-center gap-6 text-center px-10 z-10 relative">
                  <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-black bg-brutal-yellow flex items-center justify-center shadow-brutal animate-bounce mb-2 md:mb-4 rotate-3">
                     <VideoIcon className="w-8 h-8 md:w-12 md:h-12 text-black" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
                    {status === "idle" ? "Ready to begin?" : status === "waiting" ? "Searching for Peer..." : "Syncing Phase..."}
                  </h2>
                  <p className="font-bold uppercase text-xs tracking-tight text-white/70">
                    {status === "idle" ? "Engage protocol to find a direct handshake." : status === "waiting" ? "Pinging Nexus. Awaiting an available node..." : "Establishing peer-to-peer tunnel..."}
                  </p>
                  {status === "waiting" && (
                    <div className="flex flex-col gap-4">
                      <div className="mt-4 p-4 border-2 border-black bg-brutal-blue/20 text-[10px] font-black uppercase tracking-widest text-white transform -rotate-1">
                        Pro Tip: Open an incognito window to test with yourself!
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 animate-pulse">
                        Searching for handshakes: <span className="text-brutal-green font-black">{onlineUsers}</span> ACTIVE NODE(S)
                      </div>
                    </div>
                  )}
                </div>
            )}
            
            <video
              ref={remoteVideoRef}
              className={`absolute inset-0 w-full h-full object-cover select-none ${remoteStream ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
              autoPlay
              playsInline
              onLoadedMetadata={(e) => e.currentTarget.play().catch(() => {})}
            />
            {remoteStream && (
              <div className="absolute top-8 left-8 z-10 flex items-center gap-3 bg-brutal-yellow border-2 border-black px-5 py-2 shadow-brutal transform -rotate-1">
                <div className="w-2 h-2 bg-black animate-pulse"></div>
                <span className="text-xs font-black uppercase tracking-widest text-black">
                   Protocol: <span className="underline">{remoteUsername || "Stranger"}</span> ACTIVE
                </span>
              </div>
            )}
          </div>

          {/* Controls Dashboard */}
          <div className="absolute lg:relative bottom-0 left-0 right-0 h-auto lg:h-24 py-6 lg:py-0 lg:card-brutal bg-gradient-to-t from-black/90 via-black/50 to-transparent lg:bg-none lg:bg-[var(--surface-white)] flex flex-wrap items-center justify-center lg:justify-between gap-4 px-4 lg:px-10 shrink-0 z-50 pointer-events-auto">
            <div className="flex gap-2 md:gap-4">
              <button
                onClick={toggleMic}
                className={`w-12 h-12 md:w-14 md:h-14 btn-brutal !p-0 ${isMicOn ? 'bg-white' : 'bg-brutal-pink translate-x-[2px] md:translate-x-[4px] translate-y-[2px] md:translate-y-[4px] shadow-none'}`}
                title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                {isMicOn ? <Mic className="w-6 h-6 md:w-7 md:h-7" /> : <MicOff className="w-6 h-6 md:w-7 md:h-7" />}
              </button>
              <button
                onClick={toggleCamera}
                className={`w-12 h-12 md:w-14 md:h-14 btn-brutal !p-0 ${isCameraOn ? 'bg-white' : 'bg-brutal-pink translate-x-[2px] md:translate-x-[4px] translate-y-[2px] md:translate-y-[4px] shadow-none'}`}
                title={isCameraOn ? "Disable Camera" : "Enable Camera"}
              >
                {isCameraOn ? <VideoIcon className="w-6 h-6 md:w-7 md:h-7" /> : <VideoOff className="w-6 h-6 md:w-7 md:h-7" />}
              </button>
              <button
                onClick={toggleScreenShare}
                className={`w-12 h-12 md:w-14 md:h-14 btn-brutal hidden sm:flex !p-0 ${!isScreenSharing ? 'bg-white' : 'bg-brutal-green translate-x-[2px] md:translate-x-[4px] translate-y-[2px] md:translate-y-[4px] shadow-none'}`}
                title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
              >
                {isScreenSharing ? <MonitorOff className="w-6 h-6 md:w-7 md:h-7" /> : <MonitorUp className="w-6 h-6 md:w-7 md:h-7" />}
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
              {status === "idle" ? (
                <button 
                  onClick={start} 
                  className="btn-brutal bg-brutal-accent px-8 md:px-16 py-3 md:py-4 text-sm md:text-base"
                >
                  <Play className="w-5 h-5 md:w-6 md:h-6 fill-black" />
                  <span>Execute Start</span>
                </button>
              ) : (
                <>
                  <button 
                    onClick={next} 
                    className="btn-brutal bg-brutal-green px-8 md:px-16 py-3 md:py-4 text-sm md:text-base"
                  >
                    <SkipForward className="w-5 h-5 md:w-6 md:h-6 fill-black" />
                    <span>Next Match</span>
                  </button>
                  <button 
                    onClick={stop} 
                    className="w-12 h-12 md:w-16 md:h-16 btn-brutal bg-[var(--surface-white)] !p-0"
                    title="Stop Session"
                  >
                    <Square className="w-6 h-6 md:w-7 md:h-7 fill-black" />
                  </button>
                </>
              )}
            </div>
            
            <div className="w-32 hidden md:block"></div>
          </div>
        </section>

        {/* Right Column: Unified Immersive Sidebar */}
        <aside className="absolute lg:relative inset-0 lg:inset-auto pointer-events-none lg:pointer-events-auto w-full lg:w-80 xl:w-96 shrink-0 h-full overflow-hidden z-10 lg:z-auto">
          <div className="h-full lg:card-brutal !p-0 bg-transparent lg:bg-black relative flex flex-col group overflow-hidden">
            
            {/* Local Feed */}
            <div className="absolute top-4 right-4 lg:inset-0 w-24 h-36 md:w-32 md:h-48 lg:w-full lg:h-full rounded-xl lg:rounded-none overflow-hidden shadow-2xl lg:shadow-none pointer-events-auto border border-white/30 lg:border-none z-50 bg-black">
              <video
                ref={localVideoRef}
                className={`absolute inset-0 w-full h-full object-cover ${!isScreenSharing ? "-scale-x-100" : ""} ${localStream && (isCameraOn || isScreenSharing) ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}
                autoPlay
                playsInline
                muted
              />
              
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <VideoOff className="w-8 h-8 lg:w-16 lg:h-16 text-white/20" />
                </div>
              )}

              {/* Floating Top Label */}
              <div className="absolute top-1 right-1 lg:top-4 lg:right-4 z-10 px-1.5 py-0.5 lg:px-3 lg:py-1 bg-black/50 backdrop-blur-md border border-white/20 text-[7px] lg:text-[10px] font-black uppercase tracking-widest text-white transition-all duration-300">
                Local
              </div>
            </div>

            {/* Minimalist Message History Overlay */}
            <div className="absolute inset-x-4 bottom-40 lg:bottom-20 z-20 flex flex-col gap-2 min-h-0 max-h-[40%] lg:max-h-[60%] pointer-events-none">
              <div className="flex-grow overflow-y-auto p-2 flex flex-col gap-2 no-scrollbar pointer-events-auto">
                {messages.length === 0 ? (
                  <div className="my-auto text-center px-4 py-8">
                     <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 leading-tight">
                       Awaiting Handshake...
                     </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col ${msg.sender === "you" ? "items-end" : "items-start"}`}
                    >
                      <div 
                        className={`max-w-[90%] px-3 py-2 text-[13px] font-medium leading-snug rounded-md shadow-lg backdrop-blur-md border border-black/10 ${
                          msg.sender === "you" ? "rounded-tr-none" : 
                          msg.sender === "stranger" && msg.text.endsWith("has disconnected.") ? "w-full text-center bg-brutal-pink/70 text-black italic" : 
                          "bg-black/30 text-white rounded-tl-none border-white/5"
                        }`}
                        style={msg.sender === "you" ? { backgroundColor: `${chatBubbleColor}cc`, color: '#000' } : {}}
                      >
                         {msg.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatBottomRef} />
              </div>
            </div>

            {/* Floating Input Area */}
            <div className="absolute inset-x-4 bottom-24 lg:bottom-4 z-20 flex gap-2 bg-black/40 backdrop-blur-2xl p-2 border border-white/10 rounded-xl shadow-2xl pointer-events-auto">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="ENCRYPT SIGNAL..."
                  disabled={status !== "connected"}
                  className="flex-grow bg-transparent border-none text-white px-3 py-2 text-xs uppercase font-bold focus:outline-none placeholder:text-white/20"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={status !== "connected" || !chatMessage.trim()}
                  className="w-10 h-10 flex items-center justify-center bg-brutal-yellow text-black border-2 border-black shadow-brutal-sm active:translate-y-0.5 hover:bg-white transition-all rounded-lg disabled:opacity-20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
        </aside>
      </main>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Destroy Identity?"
        message="This will wipe your presence from the nexus permanently. Handshake terminated?"
        confirmText="Confirm Destruction"
        type="danger"
      />
    </div>
  );

};

export default Chat;



