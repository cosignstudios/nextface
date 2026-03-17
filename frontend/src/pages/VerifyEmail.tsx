import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Missing verification token.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message);
      } catch (err: unknown) {
        setStatus("error");
        if (axios.isAxiosError(err)) {
          setMessage(err.response?.data?.error || "Verification failed. The link may be invalid or expired.");
        } else {
          setMessage("An unexpected error occurred");
        }
      }
    };

    verify();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brutal-bg p-6">
      <div className="w-full max-w-md card-brutal bg-[var(--surface-white)] !p-12 text-center">
        <Link to="/" className="flex justify-center mb-10 transform hover:scale-110 transition-transform">
          <img src="/NextFace.svg" alt="NextFace Logo" className="w-28 h-28 object-contain" />
        </Link>
        <h2 className="text-4xl font-black text-[var(--text-color)] mb-10 uppercase tracking-tighter italic">
          Verification <br /> <span className="bg-brutal-green px-2 border-2 border-black inline-block transform -rotate-2 shadow-brutal text-black">Center</span>
        </h2>

        {status === "loading" && (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 border-4 border-black border-t-brutal-blue rounded-none animate-spin mb-6"></div>
            <p className="font-black uppercase tracking-widest text-sm">Synchronizing Identity...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-8 py-4">
            <div className="border-4 border-black bg-brutal-green p-8 shadow-brutal transform rotate-1 text-black">
               <p className="text-xl font-black uppercase leading-tight">Identity Confirmed. <br />Protocol Access Granted.</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full btn-brutal bg-black text-white"
            >
              Enter Login
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-8 py-4">
             <div className="border-4 border-black bg-brutal-pink p-8 shadow-brutal transform -rotate-1 text-black">
               <p className="text-xl font-black uppercase leading-tight">Nexus Error. <br />{message}</p>
             </div>
            <button
              onClick={() => navigate("/register")}
              className="w-full btn-brutal bg-brutal-pink"
            >
              Restart Protocol
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
