

const FAQ = () => {
  const faqs = [
    {
      question: "Is NextFace completely free to use?",
      answer: "Yes, currently NextFace is 100% free to use. You can match with random people and use video/text chat without any hidden fees."
    },
    {
      question: "Do I need an account to chat?",
      answer: "Yes. Unlike older platforms, we require all users to create an account and verify their email address. This drastically reduces bots and makes the platform safer for everyone."
    },
    {
      question: "Are my video calls recorded?",
      answer: "No. All video and audio streams are routed directly peer-to-peer (P2P) between you and your match using WebRTC. We do not intercept, record, or store your video streams on our servers."
    },
    {
      question: "What happens if someone violates the rules?",
      answer: "We have zero tolerance for nudity, harassment, or illegal conduct. If a user is reported and found violating our community guidelines, their account and email will be permanently banned from the platform."
    },
    {
      question: "Can I choose who I match with?",
      answer: "NextFace is designed for spontaneous connections. You will be matched with a random verified user who is also looking to chat. If the vibe isn't right, simply click 'Next' to immediately find someone else."
    }
  ];

  return (
    <div className="min-h-screen bg-brutal-bg text-[var(--text-color)] py-32 transition-colors font-body">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter uppercase italic">Frequently Asked <span className="text-brutal-yellow">Questions</span></h1>
        <p className="text-xl font-bold uppercase mb-16 opacity-80 leading-tight">Everything you need to know about using NextFace safely and effectively.</p>
        
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="card-brutal bg-[var(--surface-white)] p-6 sm:p-10 group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200">
              <h3 className="text-xl font-black mb-4 flex gap-4 items-start tracking-tighter uppercase">
                <span className="bg-brutal-yellow px-2 border-2 border-black text-black">Q.</span> 
                {faq.question}
              </h3>
              <div className="flex gap-4 items-start pl-10">
                <span className="italic opacity-40 shrink-0 uppercase tracking-tighter font-black text-sm pt-1">Ans.</span>
                <p className="text-lg font-bold uppercase leading-tight">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default FAQ;
