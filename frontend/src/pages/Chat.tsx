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
  ArrowLeft,
  Eraser,
  Maximize,
  Minimize,
  SwitchCamera
} from "lucide-react";

const aspectRatios = [
  { label: '16:9', class: 'lg:aspect-video' },
  { label: '1:1', class: 'lg:aspect-square' },
  { label: '9:16', class: 'lg:aspect-[9/16]' },
  { label: '3:2', class: 'lg:aspect-[3/2]' }
];

const Chat = () => {
  const { deleteAccount } = useAuth();
  const [activeRatioIndex, setActiveRatioIndex] = useState(0);
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
    isMicOn,
    isCameraOn,
    toggleMic,
    toggleCamera,
    isScreenSharing,
    toggleScreenShare,

    clearMessages,
    remoteMicOn,
    remoteCameraOn,
    flipCamera
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
  const remoteContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      mainRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };
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
      <header className="hidden lg:flex h-16 bg-[var(--surface-white)] border-b-2 border-black px-4 md:px-8 justify-between items-center shrink-0 z-50">
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
      <main ref={mainRef} className={`relative flex flex-col lg:flex-row flex-1 min-h-0 w-full overflow-hidden p-0 lg:p-6 gap-0 lg:gap-6 bg-black lg:bg-transparent ${isFullScreen ? 'lg:!bg-[var(--surface-white)] lg:!p-0 lg:!gap-0' : ''}`}>

        {/* Mobile Back Button (Floating) */}
        <Link 
          to="/" 
          className="absolute top-4 left-4 z-50 flex items-center justify-center w-10 h-10 bg-black/40 backdrop-blur-md rounded-full text-white lg:hidden border border-white/20 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>

        {/* Left Column: The Stage */}
        <section className="absolute lg:relative inset-0 lg:inset-auto flex-grow flex flex-col gap-0 lg:gap-6 min-w-0 z-0 lg:z-auto items-center justify-center">
          <div 
            ref={remoteContainerRef} 
            className={`w-full flex-grow lg:flex-none lg:w-auto lg:h-[calc(100vh-240px)] ${isFullScreen ? 'flex items-center justify-center bg-[var(--surface-white)] w-screen h-screen' : aspectRatios[activeRatioIndex].class + ' lg:card-brutal shrink-0'} !p-0 relative group overflow-hidden ${!isFullScreen ? 'bg-black' : ''}`}
          >
            <div 
              className={`relative flex-none bg-black overflow-hidden ${isFullScreen ? aspectRatios[activeRatioIndex].class : 'w-full h-full'}`}
              style={isFullScreen ? {
                width: '100%',
                height: '100%',
                maxWidth: aspectRatios[activeRatioIndex].label === '16:9' ? 'calc(100vh * 16 / 9)' : 
                          aspectRatios[activeRatioIndex].label === '1:1' ? '100vh' : 
                          aspectRatios[activeRatioIndex].label === '9:16' ? 'calc(100vh * 9 / 16)' : 
                          'calc(100vh * 3 / 2)',
                maxHeight: aspectRatios[activeRatioIndex].label === '16:9' ? 'calc(100vw * 9 / 16)' : 
                           aspectRatios[activeRatioIndex].label === '1:1' ? '100vw' : 
                           aspectRatios[activeRatioIndex].label === '9:16' ? 'calc(100vw * 16 / 9)' : 
                           'calc(100vw * 2 / 3)'
              } : {}}
            >
              {/* Aspect Ratio Selector (Desktop Only) */}
            <div className="absolute top-4 left-4 z-20 hidden lg:flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 border border-white/10 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {aspectRatios.map((ratio, idx) => (
                <button
                  key={ratio.label}
                  onClick={() => setActiveRatioIndex(idx)}
                  className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded transition-all ${
                    activeRatioIndex === idx 
                      ? 'bg-white text-black shadow-sm' 
                      : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
            
            {/* Fullscreen Toggle */}
            <div className="absolute top-4 right-4 z-20 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={toggleFullScreen}
                className="p-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                title="Toggle Fullscreen"
              >
                {isFullScreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>

            {!remoteStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-10 z-10">
                  <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-black bg-brutal-yellow flex items-center justify-center shadow-brutal animate-bounce mb-2 md:mb-4 rotate-3">
                     <VideoIcon className="w-8 h-8 md:w-12 md:h-12 text-black" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase italic">
                    {status === "idle" ? "Ready to begin?" : status === "waiting" ? "Searching for Peer..." : "Syncing Phase..."}
                  </h2>
                  <p className="font-bold uppercase text-xs tracking-tight text-white/70">
                    {status === "idle" ? "" : status === "waiting" ? "" : "Establishing peer-to-peer tunnel..."}
                  </p>

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
              <>

                {(!remoteMicOn || !remoteCameraOn) && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                     <div className="flex gap-6 lg:gap-8 text-white drop-shadow-2xl">
                        {!remoteCameraOn && <VideoOff className="w-16 h-16 lg:w-24 lg:h-24 opacity-80" />}
                        {!remoteMicOn && <MicOff className="w-16 h-16 lg:w-24 lg:h-24 opacity-80" />}
                     </div>
                  </div>
                )}
              </>
            )}
            </div>
          </div>

          {/* Controls Dashboard */}
          <div className={`absolute lg:relative bottom-0 left-0 right-0 h-auto lg:h-24 py-6 lg:py-0 lg:card-brutal bg-gradient-to-t from-black/90 via-black/50 to-transparent lg:bg-none lg:bg-[var(--surface-white)] flex flex-nowrap lg:flex-wrap items-center justify-center lg:justify-between gap-2 lg:gap-4 px-2 lg:px-10 shrink-0 z-50 pointer-events-auto ${isFullScreen ? 'lg:!absolute lg:!bottom-12 lg:!left-1/2 lg:!-translate-x-1/2 lg:!w-auto lg:!bg-transparent lg:!border-none lg:!shadow-none lg:!p-0 lg:!gap-8 lg:!z-[60] lg:!rounded-full lg:!backdrop-blur-none' : ''}`}>
            <div className="flex gap-2 lg:gap-4 shrink-0">
              <button
                onClick={toggleMic}
                className={`w-10 h-10 md:w-14 md:h-14 btn-brutal !p-0 shrink-0 ${isMicOn ? 'bg-white' : 'bg-brutal-pink translate-x-[2px] md:translate-x-[4px] translate-y-[2px] md:translate-y-[4px] shadow-none'}`}
                title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                {isMicOn ? <Mic className="w-5 h-5 md:w-7 md:h-7" /> : <MicOff className="w-5 h-5 md:w-7 md:h-7" />}
              </button>
              <button
                onClick={toggleCamera}
                className={`w-10 h-10 md:w-14 md:h-14 btn-brutal !p-0 shrink-0 ${isCameraOn ? 'bg-white' : 'bg-brutal-pink translate-x-[2px] md:translate-x-[4px] translate-y-[2px] md:translate-y-[4px] shadow-none'}`}
                title={isCameraOn ? "Disable Camera" : "Enable Camera"}
              >
                {isCameraOn ? <VideoIcon className="w-5 h-5 md:w-7 md:h-7" /> : <VideoOff className="w-5 h-5 md:w-7 md:h-7" />}
              </button>
              <button
                onClick={flipCamera}
                className="w-10 h-10 md:w-14 md:h-14 btn-brutal !p-0 shrink-0 bg-white lg:hidden"
                title="Flip Camera"
              >
                <SwitchCamera className="w-5 h-5 md:w-7 md:h-7" />
              </button>
              <button
                onClick={toggleScreenShare}
                className={`w-10 h-10 md:w-14 md:h-14 btn-brutal hidden sm:flex !p-0 shrink-0 ${!isScreenSharing ? 'bg-white' : 'bg-brutal-green translate-x-[2px] md:translate-x-[4px] translate-y-[2px] md:translate-y-[4px] shadow-none'}`}
                title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
              >
                {isScreenSharing ? <MonitorOff className="w-5 h-5 md:w-7 md:h-7" /> : <MonitorUp className="w-5 h-5 md:w-7 md:h-7" />}
              </button>
            </div>

            <div className="flex items-center gap-2 lg:gap-6 shrink-0">
              {status === "idle" ? (
                <button 
                  onClick={start} 
                  className="btn-brutal bg-brutal-accent px-4 md:px-16 py-2.5 md:py-4 text-xs md:text-base whitespace-nowrap shrink-0"
                >
                  <Play className="w-4 h-4 md:w-6 md:h-6 fill-black" />
                  <span>Execute Start</span>
                </button>
              ) : (
                <>
                  <button 
                    onClick={next} 
                    className="btn-brutal bg-brutal-green px-4 md:px-16 py-2.5 md:py-4 text-xs md:text-base whitespace-nowrap shrink-0"
                  >
                    <SkipForward className="w-4 h-4 md:w-6 md:h-6 fill-black" />
                    <span>Next Face</span>
                  </button>
                  <button 
                    onClick={stop} 
                    className="w-10 h-10 md:w-16 md:h-16 btn-brutal bg-[var(--surface-white)] !p-0 shrink-0"
                    title="Stop Session"
                  >
                    <Square className="w-4 h-4 md:w-7 md:h-7 fill-black" />
                  </button>
                </>
              )}
            </div>
            
            <div className="w-32 hidden lg:block"></div>
          </div>
        </section>

        {/* Right Column: Unified Immersive Sidebar */}
        <aside className={`absolute lg:relative inset-0 lg:inset-auto pointer-events-none lg:pointer-events-auto w-full lg:w-80 xl:w-96 shrink-0 h-full overflow-hidden z-10 lg:z-auto ${isFullScreen ? 'lg:!absolute lg:!inset-0 lg:!w-full lg:!h-full lg:!z-50 lg:!overflow-visible lg:!pointer-events-none' : ''}`}>
          <div className={`h-full lg:card-brutal !p-0 bg-transparent lg:bg-black relative flex flex-col group overflow-hidden ${isFullScreen ? 'lg:!bg-transparent lg:!border-none lg:!shadow-none' : ''}`}>
            
            {/* Local Feed */}
            <div className={`absolute top-4 right-4 lg:inset-0 w-24 h-36 md:w-32 md:h-48 lg:w-full lg:h-full rounded-xl lg:rounded-none overflow-hidden shadow-2xl lg:shadow-none pointer-events-auto border border-white/30 lg:border-none z-50 lg:z-0 bg-black ${isFullScreen ? 'lg:!absolute lg:!bottom-6 lg:!right-6 lg:!top-auto lg:!left-auto lg:!w-64 lg:!h-48 lg:!rounded-xl lg:!shadow-2xl lg:!border lg:!border-white/20 lg:!pointer-events-auto' : ''}`}>
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
              <div className="absolute top-2 right-2 lg:top-4 lg:right-4 z-10 px-2 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-md text-[9px] lg:text-xs font-black uppercase tracking-widest text-white transition-all duration-300 pointer-events-none">
                Me
              </div>

            </div>

            {/* Minimalist Message History Overlay */}
            <div className={`absolute inset-x-4 bottom-40 lg:bottom-20 z-20 flex flex-col gap-2 min-h-0 max-h-[40%] lg:max-h-[60%] pointer-events-none ${isFullScreen ? 'lg:!inset-auto lg:!bottom-24 lg:!left-6 lg:!w-[300px] lg:!max-h-[50%]' : ''}`}>
              <div className="flex-grow overflow-y-auto p-2 flex flex-col gap-2 no-scrollbar pointer-events-auto">
                {messages.length === 0 ? (
                  <div className="my-auto text-center px-4 py-8">
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
            <div className={`absolute inset-x-4 bottom-24 lg:bottom-4 z-20 flex gap-2 bg-black/40 backdrop-blur-2xl p-2 border border-white/10 rounded-xl shadow-2xl pointer-events-auto ${isFullScreen ? 'lg:!inset-auto lg:!bottom-6 lg:!left-6 lg:!w-[300px]' : ''}`}>
                <button
                  onClick={clearMessages}
                  disabled={messages.length === 0}
                  className="w-10 h-10 flex shrink-0 items-center justify-center bg-black/40 text-white border-2 border-white/20 active:scale-95 hover:bg-white hover:text-black transition-all rounded-lg disabled:opacity-20"
                  title="Clear Chat History"
                >
                  <Eraser className="w-5 h-5" />
                </button>
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



