import { Link } from "react-router-dom";
import { Video, ShieldCheck, Zap, ArrowRight, MessageSquareWarning } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-brutal-bg text-[var(--text-color)] flex flex-col font-body">
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 text-center">

          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 md:mb-10 leading-[0.9] uppercase">
            Connect <br />
            <span className="bg-brutal-yellow px-2 md:px-4 border-2 border-black inline-block transform rotate-1 shadow-brutal text-black">Beyond</span> <br />
            The Algorithm
          </h1>
          
          <p className="text-xl md:text-2xl font-bold max-w-3xl mx-auto mb-16 leading-tight uppercase">
            Experience genuine human connection. <br />Direct P2P video match with <span className="underline decoration-4 decoration-brutal-pink">Zero algorithms.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <Link
              to={isAuthenticated ? "/chat" : "/register"}
              className="btn-brutal bg-brutal-blue text-lg"
            >
              Start Chatting Now
              <ArrowRight className="w-6 h-6" />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="btn-brutal bg-[var(--surface-white)] text-lg"
              >
                Log In
              </Link>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-brutal-yellow py-24 border-y-2 border-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-6 uppercase italic">Why NextFace?</h2>
              <p className="text-xl font-bold uppercase tracking-tight">Built for speed, safety, and authentic human noise.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="card-brutal bg-[var(--surface-white)] group hover:bg-brutal-blue transition-colors">
                <div className="w-16 h-16 border-2 border-black bg-brutal-blue flex items-center justify-center mb-8 shadow-brutal group-hover:bg-[var(--surface-white)] group-hover:-translate-y-1 transition-all">
                  <Video className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase">Video & Text</h3>
                <p className="font-bold leading-tight">High-quality, low-latency peer-to-peer connections. Direct and unfiltered.</p>
              </div>
              
              <div className="card-brutal bg-[var(--surface-white)] group hover:bg-brutal-green transition-colors">
                <div className="w-16 h-16 border-2 border-black bg-brutal-green flex items-center justify-center mb-8 shadow-brutal group-hover:bg-[var(--surface-white)] group-hover:-translate-y-1 transition-all">
                  <ShieldCheck className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-4xl font-black mb-4 uppercase">Secure</h3>
                <p className="font-bold leading-tight">Direct P2P streams. No server recordings. Total privacy for your face.</p>
              </div>
              
              <div className="card-brutal bg-[var(--surface-white)] group hover:bg-brutal-pink transition-colors">
                <div className="w-16 h-16 border-2 border-black bg-brutal-pink flex items-center justify-center mb-8 shadow-brutal group-hover:bg-[var(--surface-white)] group-hover:-translate-y-1 transition-all">
                  <Zap className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-3xl font-black mb-4 uppercase">Instant</h3>
                <p className="font-bold leading-tight">No swiping. No waiting. One click to connect with the world.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-6xl md:text-7xl font-black mb-24 uppercase tracking-tighter">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
              <div className="relative group">
                <div className="w-28 h-28 border-2 border-black bg-brutal-blue text-black flex items-center justify-center text-5xl font-black mb-10 mx-auto shadow-brutal-lg transform -rotate-3 transition-transform group-hover:rotate-0">
                  01
                </div>
                <h3 className="text-3xl font-black mb-6 uppercase">Sign Up</h3>
                <p className="font-bold text-lg uppercase tracking-tight">Create a free account. Prove you aren't a machine.</p>
              </div>
              
              <div className="relative group">
                <div className="w-28 h-28 border-2 border-black bg-brutal-pink text-black flex items-center justify-center text-5xl font-black mb-10 mx-auto shadow-brutal-lg transform rotate-6 transition-transform group-hover:rotate-0">
                  02
                </div>
                <h3 className="text-3xl font-black mb-6 uppercase">Match</h3>
                <p className="font-bold text-lg uppercase tracking-tight">Click start. Connect instantly with a human soul.</p>
              </div>
              
              <div className="relative group">
                <div className="w-28 h-28 border-2 border-black bg-brutal-green text-black flex items-center justify-center text-5xl font-black mb-10 mx-auto shadow-brutal-lg transform -rotate-12 transition-transform group-hover:rotate-0">
                  03
                </div>
                <h3 className="text-3xl font-black mb-6 uppercase">Chat</h3>
                <p className="font-bold text-lg uppercase tracking-tight">Speak. Listen. Be human. Or just press Next.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Community Guidelines Banner */}
        <section className="max-w-5xl mx-auto px-6 mb-24">
           <div className="border-2 border-black bg-black text-white p-10 shadow-brutal transform rotate-1 translate-y-2">
             <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="shrink-0 bg-brutal-yellow p-6 border-2 border-black -rotate-12 group hover:rotate-0 transition-transform">
                  <MessageSquareWarning className="h-16 w-16 text-black" />
                </div>
                <div>
                  <h3 className="text-4xl font-black uppercase mb-4 tracking-tighter">Human Guidelines</h3>
                  <p className="text-xl font-bold uppercase leading-none opacity-80">18+. No harassment. No bots. Be respectful or be gone.</p>
                </div>
             </div>
           </div>
        </section>

      </main>
    </div>
  );
};


export default LandingPage;
