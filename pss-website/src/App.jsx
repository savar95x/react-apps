import React, { useState, useEffect, useRef } from 'react';
import { 
  FlaskConical, 
  ArrowRight, 
  Film, 
  Mic2, 
  FolderOpen, 
  ArrowUpRight, 
  Shirt, 
  Youtube, 
  Share2, 
  Quote, 
  Sparkles,
  Menu,
  X,
  Mail,
  ChevronRight,
  ShoppingBag,
  Tag
} from 'lucide-react';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;400;500;700;800&display=swap');
  
  :root {
    --bg-main: #09090b; /* Zinc 950 */
    --bg-card: #18181b; /* Zinc 900 */
    --accent: #3b82f6;  /* Blue 500 */
    --text-muted: #a1a1aa; /* Zinc 400 */
  }

  body {
    font-family: 'Manrope', sans-serif;
    background-color: var(--bg-main);
    color: #ffffff;
    overflow-x: hidden;
  }

  .text-huge {
    font-size: clamp(3rem, 12vw, 8rem);
    line-height: 0.9;
    letter-spacing: -0.04em;
  }

  /* Consistent Card Styling */
  .bento-card {
    background: var(--bg-card);
    border-radius: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .bento-card:hover {
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.5);
    /* Border color is handled via utility classes on individual cards to allow for custom colors */
  }

  /* Grain Texture */
  .bg-grain {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 50;
    opacity: 0.02;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-scroll {
    animation: scroll 40s linear infinite;
  }
  
  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--bg-main); 
  }
  ::-webkit-scrollbar-thumb {
    background: #27272a; 
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #3f3f46; 
  }
`;

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'bg-zinc-950/95 backdrop-blur-lg shadow-2xl py-3 md:py-4' : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <a href="/" className="font-bold text-xl tracking-tighter flex items-center gap-4 group text-white z-50 relative">
	  {/*
          <img src="public/logo2.png" width="30px" />
          <img src="public/logo.png" width="30px" />
	  */}
	  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(-45 12 12)"/>
          </svg>
          PSS
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#work" className="hover:text-white transition-colors">Initiatives</a>
          <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
          <a href="#merch" className="hover:text-white transition-colors">Merch</a>
          <a href="#future" className="hover:text-white transition-colors">Future</a>
        </div>

        {/* Desktop CTA - Explicitly hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#join" className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-600 hover:text-white transition-all">
            Join Society <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden z-50 relative">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - FIXED: Added invisible and opacity-0 to completely hide it when closed */}
      <div 
        className={`fixed inset-0 bg-zinc-950/98 backdrop-blur-xl z-40 transition-all duration-300 md:hidden flex flex-col justify-center items-center gap-8 
        ${isOpen ? 'translate-y-0 opacity-100 visible pointer-events-auto' : '-translate-y-full opacity-0 invisible pointer-events-none'}`}
      >
        <a href="#work" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-blue-500 transition-colors">Initiatives</a>
        <a href="#gallery" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-blue-500 transition-colors">Gallery</a>
        <a href="#merch" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-blue-500 transition-colors">Merch</a>
        <a href="#future" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-blue-500 transition-colors">Future Plans</a>
        <div className="w-12 h-px bg-white/10 my-4"></div>
        <a href="#join" onClick={() => setIsOpen(false)} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-bold">
          Join Society <ChevronRight className="w-5 h-5" />
        </a>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="min-h-[90vh] flex flex-col justify-center px-4 md:px-12 relative overflow-hidden pt-24 bg-zinc-950">
    <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

    <div className="max-w-7xl mx-auto w-full z-10">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <span className="inline-block py-1 px-3 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] md:text-xs font-bold tracking-widest uppercase">
          IIT Madras
        </span>
        <span className="h-px w-8 bg-blue-500/30"></span>
        <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-zinc-500">Est. 2024</span>
      </div>
      
      <h1 className="text-huge font-extrabold text-white mb-6 md:mb-8 leading-[0.95] tracking-tight">
        Physics <br />
        <span className="text-zinc-600">Student Society.</span>
      </h1>
      
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 md:gap-12 mt-8 md:mt-12 border-t border-white/5 pt-10 md:pt-12">
        <p className="max-w-md text-base md:text-lg text-zinc-400 leading-relaxed">
          We are the catalyst for curiosity. Curating experiments, lectures, and cultural collisions for the physicists of tomorrow.
        </p>
        
        {/* Stats Grid */}
        <div className="flex flex-row gap-8 w-full md:w-auto overflow-x-auto pb-2">
          <div className="flex-shrink-0">
            <div className="text-2xl md:text-3xl font-bold text-white">50+</div>
            <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mt-1 md:mt-2">Events</div>
          </div>
          <div className="w-px h-10 bg-white/10 self-center"></div>
          <div className="flex-shrink-0">
            <div className="text-2xl md:text-3xl font-bold text-white">1k+</div>
            <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mt-1 md:mt-2">Community</div>
          </div>
          <div className="w-px h-10 bg-white/10 self-center"></div>
          <div className="flex-shrink-0">
              <div className="text-2xl md:text-3xl font-bold text-white">∞</div>
            <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest mt-1 md:mt-2">Curiosity</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const BentoGrid = () => (
  <section id="work" className="py-16 md:py-24 px-4 md:px-8 bg-zinc-950 relative z-10">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 px-1 md:px-2 gap-4">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">Our <span className="text-blue-500">Universe</span></h2>
        <p className="text-zinc-500 max-w-xs text-left md:text-right text-sm md:text-base">A collection of initiatives we've launched to explore the unknown.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[300px]">
        {/* SpecLab */}
        <div className="bento-card md:col-span-2 md:row-span-2 p-6 md:p-8 flex flex-col justify-between group bg-zinc-900/50 hover:border-blue-500/30 min-h-[280px]">
          <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
          <div className="w-full h-full absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
          
          <div className="relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-blue-500 mb-6 border border-white/5 group-hover:border-blue-500/50 transition-colors">
              <FlaskConical className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">SpecLab</h3>
            <p className="text-zinc-400 text-sm md:text-base max-w-sm">Our flagship specialized laboratory initiative. We provide the equipment; you bring the hypothesis.</p>
          </div>
          <div className="relative z-10 mt-6 md:mt-8 flex gap-2">
            <span className="px-3 py-1 bg-zinc-800 rounded-lg text-[10px] md:text-xs text-zinc-300 border border-white/5">Quantum</span>
            <span className="px-3 py-1 bg-zinc-800 rounded-lg text-[10px] md:text-xs text-zinc-300 border border-white/5">Optics</span>
          </div>
        </div>

        {/* Freshie Nights */}
        <div className="bento-card md:col-span-2 relative overflow-hidden group bg-zinc-900/50 hover:border-blue-500/30 min-h-[240px]">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
          
          <div className="relative h-full p-6 md:p-8 flex flex-col justify-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Freshie Nights</h3>
            <p className="text-zinc-400 text-sm md:text-base mb-6">The initiation. Breaking ice with liquid nitrogen and warm welcomes.</p>
            <button className="w-fit flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-wider text-blue-500 group-hover:text-white transition-colors">
              See Photos <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Movie Screening */}
        <div className="bento-card md:row-span-2 group bg-zinc-900/50 hover:border-blue-500/30 min-h-[220px]">
          <div className="h-32 md:h-1/2 bg-zinc-950 relative overflow-hidden border-b border-white/5">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Film className="w-16 h-16 md:w-24 md:h-24 text-zinc-500 transform rotate-12" />
	{/*
		<img src="public/logo.png" />
		*/}
            </div>
          </div>
          <div className="p-6 h-auto md:h-1/2 flex flex-col justify-end">
            <h3 className="text-xl md:text-2xl font-bold text-white">Cinema & Science</h3>
            <p className="text-sm text-zinc-400 mt-2">Screening Interstellar, Primer, and documentaries followed by debunking sessions.</p>
          </div>
        </div>

        {/* Lecture Series */}
        <div className="bento-card p-6 flex flex-col justify-between group hover:bg-zinc-800 transition-colors bg-zinc-900/50 hover:border-blue-500/30 min-h-[200px]">
          <div className="flex justify-between items-start mb-4">
            <Mic2 className="w-8 h-8 text-zinc-600 group-hover:text-blue-500 transition-colors" />
            <span className="text-3xl md:text-4xl font-bold text-zinc-800 group-hover:text-zinc-700">01</span>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white">Lectures</h3>
            <p className="text-xs text-zinc-500 mt-1 group-hover:text-zinc-400">Industry experts & Alumni</p>
          </div>
        </div>

        {/* Senior Discussions */}
        <div className="bento-card md:col-span-2 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between bg-zinc-900/50 hover:border-blue-500/30 gap-4 min-h-[180px]">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white">Senior Discussions</h3>
            <p className="text-zinc-400 text-sm mt-1">Guidance on Internships, PhDs, and survival.</p>
          </div>
          <div className="flex -space-x-3 md:-space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-800 border-2 border-zinc-900"></div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-700 border-2 border-zinc-900"></div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-zinc-600 border-2 border-zinc-900 flex items-center justify-center text-xs font-bold text-white">+20</div>
          </div>
        </div>

        {/* Experiments Demo */}
        <div className="bento-card md:col-span-1 bg-blue-600 p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-blue-500 border-blue-500 min-h-[180px]">
          <FolderOpen className="w-8 h-8 md:w-10 md:h-10 text-white mb-4" />
          <h3 className="text-lg font-bold text-white">Demo Archive</h3>
          <p className="text-blue-100 text-xs mt-2 mb-4">Photos & Videos for external outreach</p>
          <span className="bg-white text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold">Access Drive</span>
        </div>
      </div>
    </div>
  </section>
);

const InfiniteGallery = () => {
  const items = [
    { title: "SpecLab Open", width: "w-64" },
    { title: "Liquid Nitrogen", width: "w-80" },
    { title: "Freshie Night '23", width: "w-64" },
    { title: "Open House", width: "w-96" },
    { title: "Lecture Series", width: "w-64" }
  ];

  const GalleryItem = ({ title, width }) => (
    <div className={`${width} h-40 md:h-48 bg-zinc-900/80 rounded-2xl flex-shrink-0 relative overflow-hidden group border border-white/5 hover:border-blue-500/30 transition-colors`}>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <span className="absolute bottom-4 left-4 text-xs font-bold text-white z-10 uppercase tracking-wider">{title}</span>
    </div>
  );

  return (
    <section id="gallery" className="py-12 border-y border-white/5 bg-zinc-950 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Life at PSS</h2>
          <p className="text-zinc-500 text-sm mt-1">From experiments to freshie nights.</p>
        </div>
        <a href="#gallery" className="text-blue-500 text-sm font-bold hover:text-white transition-colors flex items-center gap-1">
          View Full Archive <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      
      <div className="flex animate-scroll w-max gap-4 hover:[animation-play-state:paused]">
        <div className="flex gap-4">
          {items.map((item, idx) => (
            <GalleryItem key={`g1-${idx}`} {...item} />
          ))}
        </div>
        <div className="flex gap-4">
          {items.map((item, idx) => (
            <GalleryItem key={`g2-${idx}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Newsletter = () => (
  <section id="newsletter" className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto bg-zinc-950 relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="order-2 md:order-1">
        <span className="text-blue-500 font-bold tracking-widest uppercase text-xs mb-4 block">Publications</span>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">The PSS Monthly.</h2>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          We don't just do events; we write about them too. From dissecting the latest Nobel Prize to simple physics puzzles, our newsletter keeps the department connected.
        </p>
        <div className="flex flex-col gap-4">
          <div className="p-4 border border-white/10 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 transition-colors cursor-pointer group hover:border-blue-500/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-blue-400 font-bold">LATEST EDITION • OCT 2024</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-bold text-lg text-white">The Quantum Leap: IITM's New Research</h4>
          </div>
          <div className="p-4 border border-white/5 rounded-xl bg-transparent hover:bg-white/5 transition-colors cursor-pointer group hover:border-white/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-zinc-500 font-bold">SEPT 2024</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-bold text-lg text-white">Freshie Night Highlights & Photo Dump</h4>
          </div>
        </div>
      </div>
      
      <div className="order-1 md:order-2 relative h-[320px] md:h-[500px] w-full bg-zinc-900 rounded-2xl border border-white/5 p-4 md:p-6 rotate-2 md:rotate-3 hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-black hover:border-blue-500/30">
        <div className="w-full h-full bg-white text-zinc-950 p-5 md:p-8 rounded-lg overflow-hidden relative">
          <div className="flex justify-between border-b-2 border-zinc-950 pb-3 md:pb-4 mb-4 md:mb-6">
            <h3 className="font-serif text-2xl md:text-3xl font-bold leading-none self-end">PSS Chronicle</h3>
            <div className="text-right">
              <p className="text-[10px] md:text-xs font-bold">VOL. 24</p>
              <p className="text-[8px] md:text-[10px] text-zinc-500 uppercase">IIT MADRAS</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="col-span-2 h-24 md:h-40 bg-zinc-200 mb-2 md:mb-4 grayscale flex items-center justify-center text-zinc-400 text-[10px] md:text-xs tracking-wider">[FEATURE IMAGE]</div>
            <div className="text-[6px] md:text-[10px] leading-tight font-serif text-justify col-span-1 text-zinc-800">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
            </div>
            <div className="text-[6px] md:text-[10px] leading-tight font-serif text-justify col-span-1 text-zinc-800">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 md:h-32 bg-gradient-to-t from-white to-transparent"></div>
        </div>
      </div>
    </div>
  </section>
);

const MerchDrop = () => (
  <section id="merch" className="py-16 md:py-24 border-t border-white/5 bg-zinc-950 relative z-10">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
        
        {/* Visual Side */}
        <div className="w-full md:w-1/2 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          {/* Reduced height for mobile optimization */}
          <div className="relative h-[320px] md:h-[500px] w-full bg-zinc-900 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent"></div>
            
            {/* T-Shirt Visual */}
            <div className="relative transform group-hover:scale-105 transition-transform duration-500">
              <Shirt className="w-40 h-40 md:w-64 md:h-64 text-zinc-800 fill-zinc-900 drop-shadow-2xl" strokeWidth={1} />
              {/* Graphic on Shirt - Generic Logo Placeholder */}
              <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 flex flex-col items-center justify-center opacity-80">
                 <div className="w-10 h-10 md:w-12 md:h-12 border border-blue-500/30 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500/20 rounded-full"></div>
                 </div>
              </div>
            </div>

            {/* Floating Tags */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-zinc-800 border border-zinc-700 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              OFFICIAL GEAR
            </div>
          </div>
        </div>

        {/* Details Side */}
        <div className="w-full md:w-1/2 md:pl-8">
          <div className="flex items-center gap-2 mb-4 text-blue-500 font-bold tracking-widest text-xs uppercase">
            <Tag className="w-4 h-4" />
            PSS Collection
          </div>
          <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Wear Your <br/><span className="text-zinc-600">Passion.</span>
          </h2>
          <p className="text-base md:text-lg text-zinc-400 mb-6 md:mb-8 leading-relaxed">
            Exclusive apparel designed by the Physics Student Society. High-quality prints featuring iconic physics concepts, department inside jokes, and minimalist aesthetics.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs">✓</div>
              Premium Cotton
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs">✓</div>
              Unisex Fit
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs">✓</div>
              Student Pricing
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
            <button className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3">
              <ShoppingBag className="w-5 h-5" />
              View Collection
            </button>
            <span className="text-sm font-bold text-zinc-500 text-center sm:text-left w-full sm:w-auto">
              New drops every semester
            </span>
          </div>
        </div>

      </div>
    </div>
  </section>
);

const FuturePlans = () => (
  <section id="future" className="py-16 md:py-24 border-t border-white/5 bg-zinc-950 relative z-10">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
        <span className="text-blue-500 font-bold tracking-widest uppercase text-xs mb-4 block">Roadmap</span>
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Next on the Horizon</h2>
        <p className="text-zinc-400 text-sm md:text-base">We are expanding our reach beyond the campus.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { icon: Shirt, title: "Official Merch", desc: "Our first drop is now live! Check out the Maxwell Edition above. More designs coming Winter 2024.", color: "group-hover:text-blue-500", border: "hover:border-blue-500/50" },
          { icon: Youtube, title: "YouTube Content", desc: "High-quality concept explainers, lab tours, and interviews with IITM faculty.", color: "group-hover:text-red-500", border: "hover:border-red-500/50" },
          { icon: Share2, title: "Inter-IIT Collabs", desc: "Expanding the network. Joint hackathons and meetups with physics societies across India.", color: "group-hover:text-purple-500", border: "hover:border-purple-500/50" }
        ].map((item, idx) => (
          <div key={idx} className={`bento-card p-1 group bg-zinc-900/50 ${item.border}`}>
            <div className="h-40 md:h-48 bg-zinc-900 rounded-[1.2rem] mb-4 overflow-hidden relative">
               <div className="absolute inset-0 flex items-center justify-center">
                  <item.icon className={`w-12 h-12 md:w-16 md:h-16 text-zinc-700 ${item.color} transition-colors duration-500`} />
              </div>
            </div>
            <div className="px-6 pb-8">
              <h4 className="text-lg md:text-xl font-bold text-white mb-2">{item.title}</h4>
              <p className="text-xs md:text-sm text-zinc-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Philosophy = () => (
  <section className="py-24 md:py-32 bg-zinc-950 relative overflow-hidden flex flex-col items-center justify-center text-center px-4 z-10">
    <div className="relative z-10 max-w-4xl">
      <Sparkles className="w-6 h-6 text-blue-500 mx-auto mb-6 opacity-80" />
      <h2 className="text-3xl md:text-5xl font-medium text-white leading-tight tracking-tight mb-6">
        "Somewhere, something incredible is waiting to be known."
      </h2>
      <cite className="text-sm font-bold tracking-widest uppercase text-zinc-500 not-italic">
        — Carl Sagan
      </cite>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-zinc-950 border-t border-white/5 pt-12 md:pt-16 pb-8 relative z-10">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 md:mb-16">
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                  <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 12 12)"/>
                  <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(-45 12 12)"/>
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">PSS IIT Madras</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-sm">
              The official student body of the Department of Physics. We bridge the gap between classroom theory and real-world application.
            </p>
            
            <div className="max-w-xs">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Join our Mailing List</label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="email" 
                    placeholder="smail id preferred" 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                  />
                </div>
                <button className="bg-white text-black font-bold p-2.5 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 md:col-start-7">
          <h4 className="text-white font-bold mb-4 md:mb-6">Sitemap</h4>
          <ul className="space-y-3 text-sm text-zinc-500">
            <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
            <li><a href="#work" className="hover:text-blue-400 transition-colors">Initiatives</a></li>
            <li><a href="#gallery" className="hover:text-blue-400 transition-colors">Gallery</a></li>
            <li><a href="#future" className="hover:text-blue-400 transition-colors">Future Plans</a></li>
            <li><a href="#join" className="hover:text-blue-400 transition-colors">Join Us</a></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-white font-bold mb-4 md:mb-6">Resources</h4>
          <ul className="space-y-3 text-sm text-zinc-500">
            <li><a href="https://physics.iitm.ac.in/" className="hover:text-blue-400 transition-colors">Dept. Website</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Faculty Directory</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Student Portal</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Constitution</a></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-white font-bold mb-4 md:mb-6">Connect</h4>
          <ul className="space-y-3 text-sm text-zinc-500">
            <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">Instagram <ArrowUpRight className="w-3 h-3" /></a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">LinkedIn <ArrowUpRight className="w-3 h-3" /></a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2">YouTube <ArrowUpRight className="w-3 h-3" /></a></li>
            <li><a href="mailto:contact@pss-iitm.org" className="hover:text-blue-400 transition-colors">Email Us</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-600 text-xs text-center md:text-left">
          &copy; 2024 Physics Student Society, IIT Madras.
        </p>
        <div className="flex gap-6 text-xs text-zinc-600 font-medium">
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <div className="bg-grain"></div>
      <div className="relative z-10">
        <Nav />
        <div id="home">
          <Hero />
        </div>
        <BentoGrid />
        <InfiniteGallery />
        <Newsletter />
        <MerchDrop />
        <FuturePlans />
        <Philosophy />
        <Footer />
      </div>
    </>
  );
}
