import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { Sun, Moon, Palette } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { themeMode, updateSetting } = useSettings();
  const location = useLocation();


  // Don't render Navbar on the chat interface to keep it immersive
  if (location.pathname === "/chat") return null;

  return (
    <nav className="fixed top-6 left-6 right-6 z-50">
      <div className="max-w-7xl mx-auto card-brutal !py-4 !px-8 flex justify-between items-center bg-[var(--surface-white)]">
        <Link to="/" className="flex items-center gap-3 transition-transform hover:rotate-1 hover:scale-105">
          <img src="/NextFace.svg" alt="NextFace Logo" className="w-11 h-11 object-contain" />

          <span className="text-3xl font-black tracking-tighter text-[var(--text-color)] uppercase">
            Next<span className="text-brutal-blue drop-shadow-[3px_3px_0_#000]">Face</span>
          </span>
        </Link>


        <div className="flex items-center gap-6">
          <button 
            onClick={() => updateSetting('themeMode', themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'gray' : 'light')}
            className="p-2 border-2 border-black bg-white shadow-[calc(var(--dynamic-shadow)/2)_calc(var(--dynamic-shadow)/2)_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all text-black"
             title={`Switch theme: ${themeMode === 'light' ? 'Dark' : themeMode === 'dark' ? 'Classic Gray' : 'Light'} Mode`}
          >
            {themeMode === 'light' && <Sun className="w-5 h-5" />}
            {themeMode === 'dark' && <Moon className="w-5 h-5" />}
            {themeMode === 'gray' && <Palette className="w-5 h-5" />}
          </button>

          {isAuthenticated ? (
            <Link
              to="/chat"
              className="btn-brutal bg-brutal-yellow"
            >
              Go to Chat
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-black uppercase tracking-widest hover:underline decoration-4 decoration-brutal-pink underline-offset-4"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="btn-brutal bg-brutal-pink hidden sm:flex"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );

};

export default Navbar;

