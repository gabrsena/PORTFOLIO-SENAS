import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Mail, Linkedin, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';

// --- Helper Component for Scroll Animations ---
const RevealOnScroll = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- Helper: Decrypted Text Effect (Matrix/Tech Vibe) ---
const DecryptedText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState('');
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((_, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}</span>;
};

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // --- Dynamic Title Animation State (Home) ---
  const [wordIndex, setWordIndex] = useState(0);
  const [isFastPhase, setIsFastPhase] = useState(true);

  const animatedWords = [
    { text: "IDEAS" },
    { text: "STORY" },
    { text: "ART" },
    { text: "VISION" },
  ];

  useEffect(() => {
    let intervalId;

    const tick = () => {
      setWordIndex((prev) => (prev + 1) % animatedWords.length);
    };

    if (isFastPhase) {
      intervalId = setInterval(tick, 80);
    } else {
      intervalId = setInterval(tick, 1000); // 1s per word after fast phase
    }

    return () => clearInterval(intervalId);
  }, [isFastPhase]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFastPhase(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- Carousel State & Logic ---
  const [currentProject, setCurrentProject] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const projects = [
    {
      title: "Show Match",
      year: "2025",
      video: "https://i.imgur.com/clPJmlG.mp4",
      image: "https://i.imgur.com/clPJmlG.mp4",
      textColor: "text-[#F2F2F2]",
      overlay: "bg-black/20"
    },
    {
      title: "Showreel",
      year: "2025",
      video: "https://i.imgur.com/clPJmlG.mp4",
      image: "https://i.imgur.com/clPJmlG.mp4",
      textColor: "text-[#F2F2F2]",
      overlay: "bg-black/20"
    },
    { 
      title: "Botanica AI", 
      year: "2024", 
      video: "https://i.imgur.com/BepzB9N.mp4",
      image: "https://placehold.co/800x1000/292524/F2F2F2/png?text=Botanica+AI",
      textColor: "text-[#F2F2F2]/40 group-hover:text-[#F2F2F2]/80",
      overlay: "bg-stone-800"
    },
    { 
      title: "Essência", 
      year: "2023", 
      video: "https://i.imgur.com/BepzB9N.mp4",
      image: "https://placehold.co/800x1000/1c1917/F2F2F2/png?text=Essencia",
      textColor: "text-[#F2F2F2]/40 group-hover:text-[#F2F2F2]/80",
      overlay: "bg-stone-900"
    },
    { 
      title: "Lumière", 
      year: "2023", 
      video: "https://i.imgur.com/BepzB9N.mp4",
      image: "https://placehold.co/800x1000/B91C1C/0D0D0D/png?text=Lumiere",
      textColor: "text-[#0D0D0D]",
      overlay: "bg-[#B91C1C]"
    },
    { 
      title: "Terra", 
      year: "2022", 
      video: "https://i.imgur.com/BepzB9N.mp4",
      image: "https://placehold.co/800x1000/333333/F2F2F2/png?text=Terra",
      textColor: "text-[#F2F2F2]/40",
      overlay: "bg-[#333333]"
    },
    { 
      title: "Vanguard", 
      year: "2022", 
      video: "https://i.imgur.com/BepzB9N.mp4",
      image: "https://placehold.co/800x1000/292524/F2F2F2/png?text=Vanguard",
      textColor: "text-[#F2F2F2]/40 group-hover:text-[#F2F2F2]/80",
      overlay: "bg-stone-800"
    }
  ];

  const displayProjects = projects.slice(0, 7);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setVisibleItems(3);
      else if (window.innerWidth >= 768) setVisibleItems(2);
      else setVisibleItems(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextProject = () => {
    const maxIndex = displayProjects.length - visibleItems;
    setCurrentProject((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevProject = () => {
    const maxIndex = displayProjects.length - visibleItems;
    setCurrentProject((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      nextProject();
    }, 3000);
    return () => clearInterval(interval);
  }, [visibleItems, isPaused, displayProjects.length]);

  const { scrollY } = useScroll();
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(13,13,13,0)", "rgba(13,13,13,0.6)"]
  );
  const navBackdropBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(8px)"]
  );
  
  const bgParallax = useTransform(scrollY, [0, 5000], [0, 200]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'work', label: 'WORK' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <div className="bg-[#0D0D0D] text-[#F2F2F2] font-sans selection:bg-[#B91C1C] selection:text-white overflow-x-hidden w-full">
      
      {/* Background Video */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: bgParallax, scale: 1.1 }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          src="https://i.imgur.com/BepzB9N.mp4"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Logo Container */}
      <div 
        className="fixed top-8 left-8 z-[60] cursor-pointer"
        onClick={() => scrollToSection('home')}
      >
          <img 
          src="https://i.imgur.com/K3bVnGL.png"
          alt="SENA" 
          className="h-[4.42rem] lg:h-[8.84rem] w-auto object-contain transition-all duration-300"
          loading="eager"
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        style={{ 
          backgroundColor: isMobile ? '#0D0D0D' : navBackground,
          backdropFilter: isMobile ? 'none' : navBackdropBlur,
          borderBottom: isMobile ? '1px solid rgba(255,255,255,0.05)' : 'none'
        }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-4 px-8 h-[calc(4.42rem+2rem)] lg:h-[calc(8.84rem+2rem)]`}
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          opacity: (activeSection === 'home' && isMobile) ? 0 : 1 
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`text-sm font-anton tracking-widest hover:text-[#B91C1C] transition-colors uppercase ${activeSection === link.id ? 'text-[#B91C1C]' : 'text-[#F2F2F2]'}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="md:hidden z-[60]">
          <motion.div
             initial={{ opacity: 1 }}
             animate={{ opacity: activeSection === 'home' && isMobile ? 0 : 1 }}
             transition={{ duration: 0.3 }}
          >
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#F2F2F2]">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-[#0D0D0D] flex flex-col justify-center items-center gap-8 md:hidden"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-2xl font-anton tracking-widest hover:text-[#B91C1C] transition-colors uppercase ${activeSection === link.id ? 'text-[#B91C1C]' : 'text-[#F2F2F2]'}`}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HOME SECTION --- */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center z-10 px-4">
        <motion.div 
          className="relative z-20 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-4 font-anton text-4xl md:text-6xl lg:text-7xl uppercase whitespace-nowrap">
            
            <span className="text-[#F2F2F2]">
              LET ME COOK
            </span>

             <motion.span 
              className="text-[#F2F2F2]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              YOUR
            </motion.span>
            
            <div className="relative w-[120px] md:w-[200px] h-[1.4em] flex items-center justify-center">
               <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)', scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(8px)', scale: 0.9 }}
                  transition={{ duration: isFastPhase ? 0.08 : 0.5, ease: "easeOut" }}
                  className="absolute text-[#B91C1C] text-[1.35em] md:text-[1em] font-anton uppercase" 
                >
                  {animatedWords[wordIndex].text}
                </motion.span>
              </AnimatePresence>
            </div>

          </div>
        </motion.div>

        <motion.div 
          className="absolute bottom-10 z-20 cursor-pointer"
          onClick={() => scrollToSection('work')}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8 text-[#B91C1C]" />
        </motion.div>
      </section>

      {/* --- WORK SECTION --- */}
      <motion.section 
        id="work" 
        className="relative min-h-screen flex flex-col items-center justify-center z-10 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
         <motion.div 
           className="absolute inset-0 bg-[#0D0D0D]/70 -z-10"
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           transition={{ duration: 1 }}
        />

         <div className="max-w-7xl w-full px-4 md:px-8 flex flex-col gap-12">
            
            <div className="flex justify-between items-end px-2">
               <RevealOnScroll>
                <h2 className="text-4xl md:text-5xl font-anton uppercase text-[#B91C1C]">
                   <DecryptedText text="WORK" />
                </h2>
              </RevealOnScroll>
            </div>

            <div 
              className="relative w-full overflow-hidden group" 
              tabIndex={0}
              role="region"
              aria-label="Projects Carousel"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setIsPaused(false);
                }
              }}
              onKeyDown={(e) => {
                if(e.key === 'ArrowLeft') prevProject();
                if(e.key === 'ArrowRight') nextProject();
              }}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  prevProject();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-3 bg-[#0D0D0D]/50 hover:bg-[#B91C1C] text-[#F2F2F2] rounded-full backdrop-blur-sm transition-all duration-300"
                aria-label="Previous Project"
              >
                <ChevronLeft size={24} />
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  nextProject();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-3 bg-[#0D0D0D]/50 hover:bg-[#B91C1C] text-[#F2F2F2] rounded-full backdrop-blur-sm transition-all duration-300"
                aria-label="Next Project"
              >
                <ChevronRight size={24} />
              </button>

              <motion.div 
                className="flex"
                animate={{ x: `-${currentProject * (100 / displayProjects.length)}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ width: `${displayProjects.length * (100 / visibleItems)}%` }} 
              >
                {displayProjects.map((project, index) => (
                  <motion.div 
                    key={index}
                    className="relative px-2 outline-none group"
                    style={{ width: `${100 / displayProjects.length}%` }} 
                    onFocus={() => setCurrentProject(index)}
                  >
                    <div className="relative w-full max-w-[320px] mx-auto aspect-[9/16] bg-[#161616] overflow-hidden">
                       {project.video ? (
                          <video 
                            src={project.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="none"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                          />
                       ) : (
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                            loading="lazy"
                            decoding="async"
                          />
                       )}
                       
                       <div className={`absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 to-transparent opacity-100 transition-opacity duration-500`}>
                          <h3 className={`text-3xl font-anton uppercase mb-1 ${project.textColor}`}>{project.title}</h3>
                          <p className="text-sm font-mono text-[#F2F2F2]/60">{project.year}</p>
                          
                           <div className="mt-4 overflow-hidden">
                              <button 
                                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#B91C1C] translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:translate-y-0 focus:outline-none"
                                aria-label={`View project: ${project.title}`}
                              >
                                View Project <ChevronRight size={16} />
                              </button>
                           </div>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <div className="sr-only" aria-live="polite">
               Showing project {currentProject + 1} of {displayProjects.length}: {displayProjects[currentProject]?.title}
            </div>

         </div>
      </motion.section>

      {/* --- ABOUT SECTION --- */}
      <motion.section 
        id="about" 
        className="relative min-h-screen flex items-center justify-center z-10 py-20 px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
           className="absolute inset-0 bg-[#0D0D0D]/90 backdrop-blur-sm -z-10"
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           transition={{ duration: 1 }}
        />
        
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col gap-8 items-center md:items-start">
            <RevealOnScroll>
              <h2 className="text-4xl md:text-5xl font-anton uppercase text-[#B91C1C] mb-8">
                <DecryptedText text="ABOUT" />
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2} className="w-[42%] md:w-[60%]">
               <div className="relative w-full aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 ease-in-out group mx-auto">
                  <img 
                    src="https://i.imgur.com/ovtRA8O.jpeg" 
                    alt="Gabriel Sena" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 ring-1 ring-[#B91C1C]/20 pointer-events-none" />
               </div>
            </RevealOnScroll>
          </div>

          <div className="flex flex-col gap-6 text-lg md:text-xl font-light leading-relaxed text-[#F2F2F2]/80">
            <RevealOnScroll delay={0.4}>
              <div className="group transition-all duration-500 hover:opacity-100 opacity-50">
                <p>
                   Hey there, I'm Sena, Gabriel Sena. I'm from São Paulo, Brazil.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.5}>
              <div className="group transition-all duration-500 hover:opacity-100 opacity-50">
                <p>
                  With a degree in Marketing, I've spent the last few years refining my vision as a Creative Director and Editor, blending sales strategy with cinematic emotion.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.6}>
              <div className="group transition-all duration-500 hover:opacity-100 opacity-50">
                 <p>
                   My skillset goes beyond traditional editing: I leverage my marketing background to craft viewer-centric narratives, increasing creative efficiency.
                </p>
              </div>
            </RevealOnScroll>

             <RevealOnScroll delay={0.7}>
              <div className="group transition-all duration-500 hover:opacity-100 opacity-50">
                 <p>
                   I believe a video shouldn’t just be watched, it should be felt.
                 </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </motion.section>

      {/* --- CONTACT SECTION --- */}
      <motion.section 
        id="contact" 
        className="relative min-h-screen flex items-center justify-center z-10 py-20 px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
         <motion.div 
           className="absolute inset-0 bg-[#0D0D0D]/90 backdrop-blur-md -z-10"
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           transition={{ duration: 1 }}
        />

        <div className="max-w-4xl w-full flex flex-col items-center text-center gap-12">
            <RevealOnScroll>
              <h2 className="text-sm font-anton uppercase tracking-[0.2em] text-[#F2F2F2]/60">
                CONTACT
              </h2>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
               <h1 className="text-5xl md:text-7xl lg:text-8xl font-anton font-bold text-[#F2F2F2] leading-tight uppercase">
                 Ready to get <br/>
                 <span className="text-[#B91C1C] font-anton">cooking?</span>
               </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={0.4}>
              <div className="flex flex-wrap justify-center gap-8 mt-8">
                 <a 
                   href="mailto:gabrsena@hotmail.com" 
                   className="p-4 rounded-full border border-[#F2F2F2]/10 hover:border-[#B91C1C] hover:bg-[#B91C1C]/10 text-[#F2F2F2] hover:text-[#B91C1C] transition-all duration-300"
                   aria-label="Email"
                 >
                   <Mail size={28} />
                 </a>
                 
                 <a 
                   href="https://www.linkedin.com/in/gabrielsenas/" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-4 rounded-full border border-[#F2F2F2]/10 hover:border-[#B91C1C] hover:bg-[#B91C1C]/10 text-[#F2F2F2] hover:text-[#B91C1C] transition-all duration-300"
                   aria-label="LinkedIn"
                 >
                   <Linkedin size={28} />
                 </a>

                 <a 
                   href="https://www.behance.net/gabrielsenas" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-4 rounded-full border border-[#F2F2F2]/10 hover:border-[#B91C1C] hover:bg-[#B91C1C]/10 text-[#F2F2F2] hover:text-[#B91C1C] transition-all duration-300"
                   aria-label="Behance"
                 >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.78 6.55H10.9V7.93H7.78V6.55ZM5.48 6.55H7.2V11.23H5.48V6.55ZM7.78 12.63H10.9V14H7.78V12.63ZM5.48 12.63H7.2V17.33H5.48V12.63ZM12.75 6.55H20.25V7.93H12.75V6.55ZM12.75 9.33H18.5V10.7H14.48V13.18H18.5V14.55H12.75V9.33ZM14.48 16.03H20.25V17.4H14.48V16.03Z" fillOpacity="0"/>
                      <path d="M15.5 12.5C15.5 12.5 19 12.5 19 10.5C19 8.5 15.5 8.5 15.5 8.5H11V16.5H15.5C15.5 16.5 19.5 16.5 19.5 14C19.5 12.5 17.5 12.5 17.5 12.5C17.5 12.5 15.5 12.5 15.5 12.5ZM13 10H15.5C16.5 10 16.5 11 16.5 11C16.5 11 16.5 11.5 15.5 11.5H13V10ZM13 15V13H15.5C17 13 17 14 17 14C17 14 17 15 15.5 15H13ZM19.5 6H13V7H19.5V6ZM6.5 12H3.5V13.5H5.5C5.5 13.5 5.5 15 4.5 15C3.5 15 3.5 13.5 3.5 13.5H2C2 13.5 2 16.5 4.5 16.5C7 16.5 7 13.5 7 13.5C7 13.5 7 12 6.5 12ZM4.5 9C6.5 9 6.5 11 6.5 11H2.5C2.5 11 2.5 9 4.5 9Z" />
                    </svg>
                 </a>

                 <a 
                   href="https://wa.me/5511973759325" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-4 rounded-full border border-[#F2F2F2]/10 hover:border-[#B91C1C] hover:bg-[#B91C1C]/10 text-[#F2F2F2] hover:text-[#B91C1C] transition-all duration-300"
                   aria-label="WhatsApp"
                 >
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.03 12.03 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                   </svg>
                 </a>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.6}>
               <p className="text-xl md:text-2xl font-anton uppercase text-[#F2F2F2]/80 mt-8">
                 Based in Brazil, Cooking Worldwide
               </p>
            </RevealOnScroll>
        </div>

        <div className="absolute bottom-8 text-center w-full text-[#F2F2F2]/30 text-sm font-light">
          &copy; 2025 Sena. All rights reserved.
        </div>
      </motion.section>
      
    </div>
  );
};

export default App;
