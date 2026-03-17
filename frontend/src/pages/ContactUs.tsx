import { Mail, MapPin } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-brutal-bg text-[var(--text-color)] py-32 transition-colors font-body">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">Contact <span className="bg-brutal-blue px-3 border-2 border-black inline-block transform -rotate-1 shadow-brutal text-black">Us</span></h1>
          <p className="text-xl font-bold uppercase tracking-tight max-w-2xl mx-auto opacity-80">Have a question, report, or feedback? Our team is dedicated to human connection.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="card-brutal bg-[var(--surface-white)] p-10">
              <h2 className="text-3xl font-black mb-10 uppercase tracking-tighter italic">Get in Touch</h2>
              
              <div className="flex items-start gap-8 mb-12 group">
                <div className="bg-brutal-blue p-5 border-2 border-black shadow-brutal group-hover:-translate-y-1 transition-transform duration-300">
                  <Mail className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Email Support</h3>
                  <p className="text-base font-bold uppercase leading-tight mb-4 opacity-70">For general inquiries, account issues, and to report abusive behavior.</p>
                  <a href="mailto:support@nextface.example.com" className="text-2xl font-black text-brutal-blue hover:bg-brutal-blue hover:text-white transition-colors underline decoration-4 underline-offset-8">
                    support@nextface.me
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-8 group">
                <div className="bg-brutal-green p-5 border-2 border-black shadow-brutal group-hover:-translate-y-1 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Remote First</h3>
                  <p className="text-base font-bold uppercase leading-tight opacity-70">NextFace is built by a globally distributed team. We don't have a physical retail office.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-brutal-pink p-10 border-2 border-black shadow-brutal transform rotate-1">
              <h3 className="text-2xl font-black mb-3 uppercase tracking-tighter text-black">Urgent Reports</h3>
              <p className="text-lg font-bold uppercase leading-tight text-black opacity-90">If you are reporting a serious violation of our community guidelines (e.g., illegal content), please include "URGENT REPORT" in the subject line of your email for prioritized review.</p>
            </div>
          </div>

          {/* Form */}
          <div className="card-brutal bg-[var(--surface-white)] p-10 relative overflow-visible">
            <div className="absolute -top-5 -right-5 bg-brutal-yellow px-5 py-2 border-2 border-black font-black text-xs transform rotate-6 shadow-brutal-sm uppercase tracking-widest text-black">
              Quick Message
            </div>
            <h2 className="text-2xl font-black mb-10 uppercase tracking-tighter italic">Send a Message</h2>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-3 pl-1">Your Name</label>
                <input type="text" className="input-brutal w-full" placeholder="JOHN DOE" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-3 pl-1">Email Address</label>
                <input type="email" className="input-brutal w-full" placeholder="JOHN@EXAMPLE.COM" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-3 pl-1">Message</label>
                <textarea rows={5} className="input-brutal w-full resize-none" placeholder="HOW CAN WE HELP YOU?"></textarea>
              </div>
              <button className="w-full btn-brutal bg-brutal-blue text-lg h-20">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ContactUs;
