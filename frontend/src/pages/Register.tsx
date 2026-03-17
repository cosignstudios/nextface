import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [view, setView] = useState<"selection" | "email">("selection");
  const { login } = useAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(`${API_URL}/api/auth/google`, {
          credential: tokenResponse.access_token,
        });
        login(response.data.token, response.data.username);
        navigate("/");
      } catch (err: any) {
        console.error("Google signup backend error:", err);
        setError(err.response?.data?.error || "Google authentication failed");
      }
    },
    onError: () => setError("Google signup interrupted"),
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
      setSuccess("Account created! Please check your email to verify.");
      setError("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Registration failed");
      } else {
        setError("An unexpected error occurred");
      }
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brutal-bg p-6 font-body">
      <div className="w-full max-w-md card-brutal bg-[var(--surface-white)] !p-10">
        {view === "email" && (
          <button 
            onClick={() => setView("selection")}
            className="mb-6 flex items-center gap-2 text-xs font-black uppercase hover:text-brutal-pink transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Selection protocol
          </button>
        )}

        <Link to="/" className="flex justify-center mb-10 transform hover:rotate-3 transition-transform">
          <img src="/NextFace.svg" alt="NextFace Logo" className="w-24 h-24 object-contain" />
        </Link>
        
        <h2 className="text-3xl font-black text-[var(--text-color)] mb-10 text-center uppercase tracking-tighter italic">
          {view === "selection" ? "Creation" : "Standard"} <span className="bg-brutal-pink px-2 border-2 border-black inline-block transform rotate-2 shadow-brutal text-black">Protocol</span>
        </h2>

        {error && <div className="border-2 border-black bg-brutal-pink p-4 mb-6 font-bold uppercase text-sm shadow-brutal-sm text-black">{error}</div>}
        {success && <div className="border-2 border-black bg-brutal-green p-4 mb-6 font-bold uppercase text-sm shadow-brutal-sm text-black">{success}</div>}

        {view === "selection" ? (
          <div className="space-y-6">
            <button
              onClick={() => googleLogin()}
              className="w-full btn-brutal bg-white flex justify-center items-center gap-3 py-4 hover:bg-gray-50"
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

            <button
              onClick={() => setView("email")}
              className="w-full btn-brutal bg-brutal-pink text-sm font-black uppercase tracking-widest py-4"
            >
              Connect with Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-[var(--text-color)] text-xs font-black uppercase tracking-widest pl-1 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full input-brutal text-sm"
                placeholder="COOL_CHATTER_123"
                required
              />
            </div>
            <div>
              <label className="block text-[var(--text-color)] text-xs font-black uppercase tracking-widest pl-1 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full input-brutal text-sm"
                placeholder="YOU@EXAMPLE.COM"
                required
              />
            </div>
            <div>
              <label className="block text-[var(--text-color)] text-xs font-black uppercase tracking-widest pl-1 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full input-brutal text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full btn-brutal bg-brutal-pink text-lg"
            >
              Create Identity
            </button>
          </form>
        )}

        <div className="mt-10 pt-6 border-t-2 border-black text-center">
          <p className="font-bold uppercase text-[10px] tracking-tight text-gray-500">
            {view === "selection" ? "Already recorded?" : "Access protocol?"}{" "}
            <Link to="/login" className="underline decoration-brutal-blue decoration-2 underline-offset-4 hover:bg-brutal-blue px-1 transition-colors">
              Log In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
