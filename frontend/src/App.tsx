import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider, useSettings } from "./context/SettingsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiesPolicy from "./pages/CookiesPolicy";
import ContactUs from "./pages/ContactUs";

function AppContent() {
  const { bgTexture, fontFamily } = useSettings();
  
  return (
    <div className={`flex flex-col min-h-screen relative ${fontFamily}`}>
      {bgTexture !== 'none' && (
        <div className={`fixed inset-0 pointer-events-none z-[60] texture-${bgTexture} opacity-30`} />
      )}
      <div className="relative z-10 flex flex-col flex-grow">
        <Navbar />
        <main className={`flex-grow flex flex-col`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <SettingsProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;
