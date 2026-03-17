

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-brutal-bg text-[var(--text-color)] py-32 transition-colors font-body">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-6xl font-black mb-10 tracking-tighter uppercase italic">Privacy <span className="bg-brutal-pink px-3 border-2 border-black inline-block transform rotate-1 shadow-brutal text-black">Policy</span></h1>
        
        <div className="card-brutal bg-[var(--surface-white)] p-8 sm:p-16 space-y-16 text-lg font-bold uppercase leading-tight">
          <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Last Updated: March 2024</p>
          
          <section>
            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter italic">1. Information We Collect</h2>
            <p className="mb-8">When you register for NextFace, we collect minimal information necessary to provide our service:</p>
            <ul className="space-y-6">
              <li className="flex items-start gap-4"><span className="bg-brutal-blue w-2 h-6 border-2 border-black inline-block"></span> <div><strong className="underline underline-offset-4 decoration-2 decoration-brutal-blue">Email Address:</strong> Used strictly for account verification and critical service updates.</div></li>
              <li className="flex items-start gap-4"><span className="bg-brutal-pink w-2 h-6 border-2 border-black inline-block"></span> <div><strong className="underline underline-offset-4 decoration-2 decoration-brutal-pink">Username:</strong> Your public identifier on the platform.</div></li>
              <li className="flex items-start gap-4"><span className="bg-brutal-green w-2 h-6 border-2 border-black inline-block"></span> <div><strong className="underline underline-offset-4 decoration-2 decoration-brutal-green">Password:</strong> Securely hashed and salted; we never store plain-text passwords.</div></li>
            </ul>
          </section>
          
          <section className="bg-black text-white p-10 border-2 border-black shadow-brutal relative overflow-hidden transform rotate-1">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter italic text-brutal-yellow">2. Video and Audio Data</h2>
            <p className="text-xl leading-tight font-black uppercase">
              Your video and audio streams are <span className="underline decoration-brutal-yellow decoration-4">NEVER</span> recorded, intercepted, or stored on our servers. NextFace uses WebRTC technology to establish direct peer-to-peer (P2P) connections.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter italic">3. Usage</h2>
            <p className="mb-6 italic opacity-70">We use your data solely to:</p>
            <ul className="space-y-4">
              <li className="flex items-center gap-4"><div className="w-3 h-3 bg-brutal-yellow border-2 border-black"></div> Authenticate your account.</li>
              <li className="flex items-center gap-4"><div className="w-3 h-3 bg-brutal-pink border-2 border-black"></div> Enforce our community guidelines.</li>
              <li className="flex items-center gap-4"><div className="w-3 h-3 bg-brutal-green border-2 border-black"></div> Prevent bot spam through email verification.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter italic">4. Data Sharing</h2>
            <p className="text-lg font-light">
              We do not sell, rent, or share your personal data with third-party advertisers. We will only disclose information if legally required to do so by law enforcement to prevent harm.
            </p>
          </section>
          
          <section>
            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter italic">5. Deletion</h2>
            <p className="text-lg font-light">
              You have the right to delete your account at any time. Using the 'Delete Account' button within the app will permanently wipe your email, username, and authentication records from our active database.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};


export default PrivacyPolicy;
