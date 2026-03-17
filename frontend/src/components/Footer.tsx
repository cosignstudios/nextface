import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  // Hide footer on the chat interface and auth pages to maintain focus
  if (["/chat", "/login", "/register", "/verify"].includes(location.pathname)) return null;

  return (
    <footer className="bg-brutal-bg py-24 px-6 border-t-2 border-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-8 transition-transform hover:scale-105">
              <img src="/NextFace.svg" alt="NextFace Logo" className="w-11 h-11 object-contain" />
              <span className="text-2xl font-black tracking-tighter text-[var(--text-color)] uppercase">
                Next<span className="text-brutal-pink drop-shadow-[2px_2px_0_#000]">Face</span>
              </span>
            </Link>

            <p className="text-lg font-bold leading-tight uppercase tracking-tight">
              Connect <br /> Beyond the <br /> <span className="bg-brutal-yellow px-1">Algorithm.</span>
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-black mb-6 border-b-2 border-black inline-block">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="font-bold hover:bg-brutal-pink px-1 transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="font-bold hover:bg-brutal-green px-1 transition-colors">Safety FAQ</Link></li>
              <li><Link to="/contact" className="font-bold hover:bg-brutal-blue px-1 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black mb-6 border-b-2 border-black inline-block">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="font-bold hover:bg-brutal-pink px-1 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="font-bold hover:bg-brutal-yellow px-1 transition-colors">Cookies Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black mb-6 border-b-2 border-black inline-block">Stay Human</h4>
            <p className="text-sm font-medium mb-6">Join our community of verified chatters.</p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 card-brutal !p-0 flex items-center justify-center hover:bg-brutal-blue">
                <span className="font-black">X</span>
              </a>
              <a href="#" className="w-12 h-12 card-brutal !p-0 flex items-center justify-center hover:bg-brutal-pink">
                <span className="font-black">IG</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t-2 border-black flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-black uppercase tracking-widest">© 2024 NextFace Protocol. All Rights Reserved.</p>
          <div className="flex gap-8">
             <span className="text-xs font-black uppercase tracking-tighter bg-black text-white px-2 py-1">EN-US</span>
             <span className="text-xs font-black uppercase tracking-tighter bg-brutal-green px-2 py-1">System Global</span>
          </div>
        </div>
      </div>
    </footer>
  );

};

export default Footer;
