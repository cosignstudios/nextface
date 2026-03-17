

const CookiesPolicy = () => {
  return (
    <div className="min-h-screen bg-brutal-bg text-[var(--text-color)] py-32 transition-colors font-body">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-6xl font-black mb-10 tracking-tighter uppercase italic">Cookies <span className="bg-brutal-green px-3 border-2 border-black inline-block transform -rotate-1 shadow-brutal text-black">Policy</span></h1>
        
        <div className="card-brutal bg-[var(--surface-white)] p-8 sm:p-16 space-y-16 text-lg font-bold uppercase leading-tight">
          <p className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Last Updated: October 2023</p>
          
          <section>
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">What are Cookies?</h2>
            <p>
              Cookies are small text files stored on your local device by your web browser. They are widely used to make websites work, or work more efficiently, as well as to keep you logged into secure areas.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">How We Use Data</h2>
            <p className="mb-4">
              NextFace relies minimally on cookies. Instead, we heavily utilize your browser's <strong>Local Storage</strong> and <strong>Session Storage</strong> for performance and security reasons.
            </p>
            <ul className="list-disc pl-5 space-y-4">
              <li>
                <strong className="underline decoration-brutal-blue decoration-4">Authentication Tokens:</strong> When you log in, we store a secure JWT in your local storage. This is strictly necessary to keep you logged in.
              </li>
              <li>
                <strong className="underline decoration-brutal-pink decoration-4">Zero Tracking:</strong> We do not use third-party tracking cookies (like Google Analytics or Facebook Pixels).
              </li>
              <li>
                <strong className="underline decoration-brutal-green decoration-4">Theme Preferences:</strong> Your selected visual theme (Light, Dark, or Gray) is stored locally.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">Your Choices</h2>
            <p>
              If you wish to remove these files, you can simply click the "Log out" button, which will instantly clear your authentication token. You can also clear your browser's cache and local storage at any time through your browser's settings. Please note that blocking local storage will prevent you from logging into NextFace.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy;
