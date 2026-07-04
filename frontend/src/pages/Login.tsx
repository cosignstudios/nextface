import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

const Login = () => {
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brutal-bg p-6">
      <div className="w-full max-w-md card-brutal bg-[var(--surface-white)] !p-10">
        <Link to="/" className="flex justify-center mb-10 transform hover:-rotate-3 transition-transform">
          <img src="/NextFace.svg" alt="NextFace Logo" className="w-24 h-24 object-contain" />
        </Link>
        
        <h2 className="text-3xl font-black text-[var(--text-color)] mb-8 text-center uppercase tracking-tighter italic">
          Entry <span className="bg-brutal-blue px-2 border-2 border-black inline-block transform -rotate-1 text-black">Protocol</span>
        </h2>

        {error && (
          <div className="border-2 border-black bg-brutal-pink p-4 mb-8 font-bold uppercase text-sm shadow-brutal-sm text-black">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full btn-brutal bg-white flex justify-center items-center gap-3 py-4 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
              <path fill="#FBBC05" d="M16.04 18.013c-1.09.613-2.346.959-3.682.959-3.46 0-6.425-2.298-7.465-5.464L.86 16.623C2.81 20.579 6.89 23.28 12 23.28c3.055 0 5.782-1.127 7.91-2.982l-3.87-2.285Z" />
              <path fill="#4285F4" d="M19.91 3C17.782 1.145 15.055 0 12 0c-4.632 0-8.54 2.227-10.76 5.61l.013.04L5.275 9.77A7.05 7.05 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3Z" opacity=".1" />
              <path fill="#4285F4" d="M23.52 12.277c0-.822-.066-1.613-.19-2.382H12v4.509h6.464a5.53 5.53 0 0 1-2.4 3.618l3.87 2.285c2.263-2.091 3.586-5.168 3.586-8.03Z" />
              <path fill="#34A853" d="M12 23.28c3.055 0 5.782-1.127 7.91-2.982l-3.87-2.285a7.03 7.03 0 0 1-7.14 0l-4.032 3.115A11.96 11.96 0 0 0 12 23.28Z" />
            </svg>
            <span className="text-sm font-black uppercase tracking-widest">Connect with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
