

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-brutal-bg text-[var(--text-color)] py-32 transition-colors font-body">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl md:text-6xl font-black mb-10 tracking-tighter uppercase italic">About <span className="bg-brutal-blue px-3 border-2 border-black inline-block transform -rotate-1 shadow-brutal text-black">NextFace</span></h1>
        
        <div className="space-y-10 text-lg md:text-xl font-bold uppercase leading-tight">
          <p>
            In a world dominated by algorithms, passive scrolling, and filtered realities, genuine human connection has become increasingly rare. NextFace was built to change that.
          </p>
          
          <h2 className="text-4xl font-black mt-20 mb-8 uppercase tracking-tighter">Our Mission</h2>
          <p>
            Our mission is simple: to connect people beyond the algorithm. We believe that the most meaningful interactions often happen spontaneously, between people who might never cross paths in the real world or in curated social media echo chambers.
          </p>
          
          <h2 className="text-4xl font-black mt-20 mb-8 uppercase tracking-tighter">Why We Built This</h2>
          <p>
            We noticed that existing random chat platforms were plagued by bots, inappropriate content, and poor user experiences. We wanted to build a platform that felt premium, prioritized privacy, and actually required users to prove they were human before joining the conversation.
          </p>
          
          <div className="card-brutal bg-[var(--surface-white)] p-10 mt-16">
            <h3 className="text-2xl font-black mb-6 uppercase tracking-tighter italic">Core Values:</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-5"><strong className="bg-brutal-yellow px-2 border-2 border-black text-black shrink-0 uppercase tracking-wider text-sm">Authenticity:</strong> <span>Real people, real-time, real conversations.</span></li>
              <li className="flex items-start gap-5"><strong className="bg-brutal-pink px-2 border-2 border-black text-black shrink-0 uppercase tracking-wider text-sm">Privacy First:</strong> <span>Your peer-to-peer video streams are never recorded or stored on our servers.</span></li>
              <li className="flex items-start gap-5"><strong className="bg-brutal-green px-2 border-2 border-black text-black shrink-0 uppercase tracking-wider text-sm">Safety:</strong> <span>Through email verification and community guidelines, we strive to keep the bad actors out.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
