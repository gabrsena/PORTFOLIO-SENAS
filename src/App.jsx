/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, Variants } from 'framer-motion';
import { Menu, X, Mail, Linkedin, ChevronRight, ChevronLeft, ChevronDown, ArrowUp, PenTool, Clapperboard, Film } from 'lucide-react';

// --- Helper Component for Scroll Animations ---
interface RevealOnScrollProps {
  children?: React.ReactNode;
  delay?: number;
  className?: string;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, delay = 0, className = "" }) => (
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
const DecryptedText = ({ text, className }: { text: string, className?: string }) => {
  const [displayText, setDisplayText] = useState('');
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
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

// --- Projects Data (Static) ---
const projects = [
  {
    title: "Show Match",
    video: "https://i.imgur.com/clPJmlG.mp4",
    image: "https://i.imgur.com/clPJmlG.mp4",
  },
  {
    title: "Showreel",
    video: "https://i.imgur.com/clPJmlG.mp4",
    image: "https://i.imgur.com/clPJmlG.mp4",
  },
  { 
    title: "Botanica AI", 
    video: "https://i.imgur.com/BepzB9N.mp4",
    image: "https://placehold.co/800x1000/292524/F2F2F2/png?text=Botanica+AI",
  },
  { 
    title: "Essência", 
    video: "https://i.imgur.com/BepzB9N.mp4",
    image: "https://placehold.co/800x1000/1c1917/F2F2F2/png?text=Essencia",
  },
  { 
    title: "Lumière", 
    video: "https://i.imgur.com/BepzB9N.mp4",
    image: "https://placehold.co/800x1000/B91C1C/0D0D0D/png?text=Lumiere",
  },
  { 
    title: "Terra", 
    video: "https://i.imgur.com/BepzB9N.mp4",
    image: "https://placehold.co/800x1000/333333/F2F2F2/png?text=Terra",
  },
  { 
    title: "Vanguard", 
    video: "https://i.imgur.com/BepzB9N.mp4",
    image: "https://placehold.co/800x1000/292524/F2F2F2/png?text=Vanguard",
  }
];

const App: React.FC = () => {
  const activeSectionRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // New state for About Modal
  const [showAbout, setShowAbout] = useState(false);
  
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
    let intervalId: ReturnType<typeof setInterval>;

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // Hover pause
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false); // Interaction pause
  const [isAnimating, setIsAnimating] = useState(false); // Lock for animation
  const autoPlayPauseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleInteraction = () => {
    setIsAutoPlayPaused(true);
    if (autoPlayPauseTimeout.current) clearTimeout(autoPlayPauseTimeout.current);
    autoPlayPauseTimeout.current = setTimeout(() => {
      setIsAutoPlayPaused(false);
    }, 5000);
  };

  const nextProject = (manual = false) => {
    if (isAnimating) return; // Prevent spam clicking
    if (manual) handleInteraction();
    setIsAnimating(true);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = (manual = false) => {
    if (isAnimating) return; // Prevent spam clicking
    if (manual) handleInteraction();
    setIsAnimating(true);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  useEffect(() => {
    if (isPaused || isAutoPlayPaused) return; 
    
    const interval = setInterval(() => {
      nextProject();
    }, 3000);
    return () => clearInterval(interval);
  }, [visibleItems, isPaused, isAutoPlayPaused, isAnimating]);

  // Derived visible projects for the infinite loop effect
  const visibleProjects = [];
  for (let i = 0; i < visibleItems; i++) {
    const index = (currentIndex + i) % projects.length;
    visibleProjects.push(projects[index]);
  }

  // Carousel Animation Variants - SIMPLIFIED FOR FLUIDITY
  // We use pure X translation without layout props to avoid jitter.
  const carouselVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  // --- Scroll Logic ---
  const { scrollY } = useScroll();
  
  // Update ShowScrollTop state based on scroll position
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      // Show button if scrolled down more than 50% of the screen height
      setShowScrollTop(latest > window.innerHeight * 0.5);
    });
  }, [scrollY]);

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
  
  // Parallax for Background Video - Subtle movement to add depth
  const bgParallax = useTransform(scrollY, [0, 5000], [0, -300]);

  const scrollToSection = (id: string) => {
    // If About is clicked, toggle the modal
    if (id === 'about') {
      setShowAbout(true);
      setMenuOpen(false);
      return;
    }

    // Otherwise close about and scroll
    setShowAbout(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setMenuOpen(false);
    }
  };

  // Intersection Observer to detect active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
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
      
      {/* Background Video (Visible Everywhere with Parallax) */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: bgParallax, scale: 1.25 }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata" // Optimize: Load only metadata initially
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          src="https://i.imgur.com/BepzB9N.mp4"
        />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Logo Container (Fixed) - Moved outside Nav to persist on Mobile Home */}
      <div 
        className="fixed top-8 left-8 z-[60] cursor-pointer"
        onClick={() => scrollToSection('home')}
      >
         <img 
          src="https://i.imgur.com/K3bVnGL.png"
          alt="SENA" 
          className="h-[4.42rem] lg:h-[8.84rem] w-auto object-contain transition-all duration-300"
          loading="eager" // Important logo, load immediately
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        style={{ 
          backgroundColor: navBackground,
          backdropFilter: navBackdropBlur,
          borderBottom: 'none'
        }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-4 px-8 h-[calc(4.42rem+2rem)] lg:h-[calc(8.84rem+2rem)]`}
        initial={{ y: 0, opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        
        <div className="flex-1" /> {/* Spacer */}

        {/* Menu Button (Unified for Mobile & Desktop) - Always Visible */}
        <div className="z-[60]">
          <motion.div
             initial={{ opacity: 1 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.3 }}
          >
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#F2F2F2] w-12 h-12 flex items-center justify-center relative focus:outline-none">
               <AnimatePresence mode="wait">
                  {menuOpen ? (
                     <motion.div
                        key="close"
                        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute"
                     >
                       <X className="w-8 h-8 md:w-10 md:h-10" />
                     </motion.div>
                  ) : (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute"
                     >
                       <Menu className="w-8 h-8 md:w-10 md:h-10" />
                     </motion.div>
                  )}
                </AnimatePresence>
            </button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-[#0D0D0D] flex flex-col justify-center items-center gap-8"
          >
            {navLinks.map((link, index) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.5, ease: "easeOut" }}
                onClick={() => scrollToSection(link.id)}
                className={`text-2xl md:text-5xl font-anton tracking-widest hover:text-[#B91C1C] transition-colors uppercase ${((activeSection === link.id && !showAbout) || (link.id === 'about' && showAbout)) ? 'text-[#B91C1C]' : 'text-[#F2F2F2]'}`}
              >
                {link.label}
              </motion.button>
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
          {/* Main Title Container - Flex Layout */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-4 font-anton text-4xl md:text-6xl lg:text-7xl uppercase whitespace-nowrap">
            
            {/* 1. Static LEFT: "LET ME COOK" */}
            <span className="text-[#F2F2F2]">
              LET ME COOK
            </span>

            {/* 2. Center: "YOUR" - Animates in */}
             <motion.span 
              className="text-[#F2F2F2]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              YOUR
            </motion.span>
            
            {/* 3. Right: Red Animated Word */}
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

        {/* Scroll Down Indicator */}
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
        className="relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
         {/* Solid Background to Hide Parallax Video in this section */}
         <motion.div 
           className="absolute inset-0 bg-[#0D0D0D] -z-10" 
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           transition={{ duration: 1 }}
        />

         {/* --- Part 1: Projects Carousel (NEW INFINITE LOOP) --- */}
         <div className="min-h-screen flex flex-col items-center justify-center py-20">
             <div className="max-w-7xl w-full px-4 md:px-8 flex flex-col gap-12">
                
                <div className="flex justify-between items-end px-2">
                   <RevealOnScroll>
                    <h2 className="text-4xl md:text-5xl font-anton uppercase text-[#B91C1C]">
                       <DecryptedText text="WORK" />
                    </h2>
                  </RevealOnScroll>
                </div>

                {/* Carousel Track */}
                <div 
                  className="relative w-full overflow-hidden h-[70vh]" 
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
                    if(e.key === 'ArrowLeft') prevProject(true);
                    if(e.key === 'ArrowRight') nextProject(true);
                  }}
                >
                  {/* Navigation Arrows */}
                  <button 
                    onClick={() => prevProject(true)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 text-[#F2F2F2]/50 hover:text-[#B91C1C] transition-colors bg-black/20 backdrop-blur-sm rounded-r-xl"
                    aria-label="Previous project"
                  >
                    <ChevronLeft size={40} />
                  </button>

                  <button 
                    onClick={() => nextProject(true)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 text-[#F2F2F2]/50 hover:text-[#B91C1C] transition-colors bg-black/20 backdrop-blur-sm rounded-l-xl"
                    aria-label="Next project"
                  >
                    <ChevronRight size={40} />
                  </button>
                  
                  {/* Container for Cards - Relative for Positioning */}
                  <div className="relative w-full h-full">
                    <AnimatePresence initial={false} custom={direction}>
                      {visibleProjects.map((project, index) => (
                        <motion.div 
                          key={project.title}
                          custom={direction}
                          variants={carouselVariants}
                          initial="enter"
                          animate={{ x: 0, opacity: 1, left: `${index * (100 / visibleItems)}%` }}
                          exit="exit"
                          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }} // smooth quart ease
                          onAnimationComplete={() => setIsAnimating(false)}
                          className="absolute top-0 bottom-0 px-2 sm:px-4 flex items-center justify-center group"
                          style={{ 
                            width: `${100 / visibleItems}%`,
                            left: `${index * (100 / visibleItems)}%`
                          }} 
                        >
                           <div 
                              className="relative h-full max-h-full aspect-[9/16] w-auto bg-[#161616] overflow-hidden shadow-2xl cursor-pointer group"
                              onClick={() => window.open('https://vimeo.com/senascreative', '_blank')}
                           >
                             {/* Content: Video or Image */}
                             {project.video ? (
                                <video 
                                  src={project.video}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  preload="none"
                                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-100 group-hover:scale-105 transition-transform duration-700"
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
                             
                             {/* Overlay Info */}
                             <div className={`absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100`}>
                                <h3 className="text-3xl font-anton uppercase mb-1 text-[#F2F2F2] drop-shadow-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300">{project.title}</h3>
                                
                                {/* View Project Button */}
                                 <div className="mt-4 overflow-hidden">
                                    <button 
                                      className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#B91C1C] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 focus:opacity-100 focus:translate-y-0 focus:outline-none hover:scale-110 hover:text-[#ff4d4d] origin-left"
                                      aria-label={`View project: ${project.title}`}
                                      title="View Project"
                                    >
                                      View Project <ChevronRight size={16} />
                                    </button>
                                 </div>
                             </div>
                           </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Screen Reader Live Region */}
                <div className="sr-only" aria-live="polite">
                   Showing projects starting from {currentIndex + 1}
                </div>

             </div>
         </div>

         {/* --- Part 2: Services (What I Do) --- */}
         <div className="min-h-screen flex flex-col items-center justify-center py-20 w-full bg-[#0D0D0D]">
            <div className="max-w-7xl w-full px-4 md:px-8 flex flex-col gap-16 md:gap-24">
                
                {/* Header */}
                <div className="w-full flex flex-col md:flex-row justify-start items-end gap-6 pb-8">
                  <RevealOnScroll>
                     <h2 className="text-4xl md:text-5xl font-anton uppercase text-[#B91C1C]">
                        <DecryptedText text="WHAT I DO" />
                     </h2>
                  </RevealOnScroll>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[
                      {
                        id: '01',
                        title: 'SCRIPTWRITING',
                        desc: 'Building the foundation of the narrative. I craft stories that engage from the very first second.',
                        icon: <PenTool size={32} />,
                        videoUrl: 'https://i.imgur.com/dS4mJxJ.mp4'
                      },
                      {
                        id: '02',
                        title: 'DIRECTION',
                        desc: 'Translating concepts into visual reality. Leading crews and talent to capture the authentic emotion.',
                        icon: <Clapperboard size={32} />,
                        videoUrl: 'https://i.imgur.com/tKm4l0u.mp4'
                      },
                      {
                        id: '03',
                        title: 'EDITING',
                        desc: 'The final rewrite. Mastering rhythm, pacing, and sound to deliver the maximum emotional impact.',
                        icon: <Film size={32} />,
                        videoUrl: 'https://i.imgur.com/XrPfbWK.mp4'
                      }
                    ].map((service, index) => (
                        <RevealOnScroll key={index} delay={index * 0.1}>
                           <div className="group relative h-[360px] md:h-[420px] flex flex-col justify-between p-8 border border-[#F2F2F2]/10 hover:border-[#B91C1C] transition-all duration-500 overflow-hidden hover:-translate-y-2">
                               {/* Background Video */}
                               <video 
                                  src={service.videoUrl} 
                                  autoPlay 
                                  loop 
                                  muted 
                                  playsInline 
                                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 -z-10"
                               />
                               
                               {/* Dark Overlay for readability */}
                               <div className="absolute inset-0 bg-black/70 group-hover:bg-black/50 transition-colors duration-700 -z-10" />
                               
                               {/* Hover Gradient Background */}
                               <div className="absolute inset-0 bg-gradient-to-b from-[#B91C1C]/0 via-[#B91C1C]/5 to-[#B91C1C]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                               
                               <div className="relative z-10 flex justify-center items-start pt-4">
                                  <div className="text-[#F2F2F2]/40 group-hover:text-[#F2F2F2] transition-colors duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                                    {service.icon}
                                  </div>
                               </div>

                               <div className="relative z-10 flex flex-col gap-4 items-center text-center">
                                   <h3 className="text-3xl font-anton uppercase text-[#F2F2F2] group-hover:text-[#B91C1C] transition-colors duration-500 shadow-black drop-shadow-lg">
                                       {service.title}
                                   </h3>
                                   <p className="text-[#F2F2F2]/70 font-light leading-relaxed group-hover:text-[#F2F2F2] transition-colors duration-500 text-sm md:text-base drop-shadow-md">
                                      {service.desc}
                                   </p>
                               </div>
                           </div>
                        </RevealOnScroll>
                    ))}
                </div>

            </div>
         </div>
      </motion.section>

      {/* About Section Removed from Flow */}

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
                 {/* Email */}
                 <a 
                   href="mailto:gabrsena@hotmail.com" 
                   className="p-4 rounded-full border border-[#F2F2F2]/10 hover:border-[#B91C1C] hover:bg-[#B91C1C]/10 text-[#F2F2F2] hover:text-[#B91C1C] transition-all duration-300"
                   aria-label="Email"
                 >
                   <Mail size={28} />
                 </a>
                 
                 {/* LinkedIn */}
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
                   href="https://wa.me/5511973759325" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="p-4 rounded-full border border-[#F2F2F2]/10 hover:border-[#B91C1C] hover:bg-[#B91C1C]/10 text-[#F2F2F2] hover:text-[#B91C1C] transition-all duration-300"
                   aria-label="WhatsApp"
                 >
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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

        {/* Footer Copyright */}
        <div className="absolute bottom-8 text-center w-full text-[#F2F2F2]/30 text-sm font-light">
          &copy; 2025 Sena. All rights reserved.
        </div>
      </motion.section>

      {/* --- ABOUT MODAL (Only visible on click) --- */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-[#0D0D0D] overflow-y-auto"
          >
             {/* Close Button */}
             <button 
                onClick={() => setShowAbout(false)}
                className="fixed top-8 right-8 z-[110] text-[#F2F2F2] hover:text-[#B91C1C] transition-colors"
                aria-label="Close About Section"
             >
                <X size={40} />
             </button>

            <div className="min-h-screen flex items-center justify-center py-20 px-8">
               <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* Left Column: Title & Photo */}
                <div className="flex flex-col gap-8 items-center md:items-start">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-4xl md:text-5xl font-anton uppercase text-[#B91C1C] mb-8">
                      <DecryptedText text="ABOUT" />
                    </h2>
                  </motion.div>

                  <motion.div 
                     className="w-[50%] md:w-[70%]"
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ delay: 0.4 }}
                  >
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
                  </motion.div>
                </div>

                {/* Right Column: Bio Text */}
                <div className="flex flex-col gap-6 text-lg md:text-xl font-light leading-relaxed text-[#F2F2F2]/80">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="group transition-all duration-500 hover:opacity-100 opacity-50"
                  >
                    <p>
                      Hey there, I'm Sena, Gabriel Sena. I'm from São Paulo, Brazil.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="group transition-all duration-500 hover:opacity-100 opacity-50"
                  >
                    <p>
                      With a degree in Marketing, I've spent the last few years refining my vision as a Creative Director and Editor, blending sales strategy with cinematic emotion.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="group transition-all duration-500 hover:opacity-100 opacity-50"
                  >
                    <p>
                      My skillset goes beyond traditional editing: I leverage my marketing background to craft viewer-centric narratives, increasing creative efficiency.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="group transition-all duration-500 hover:opacity-100 opacity-50"
                  >
                    <p>
                      I believe a video shouldn’t just be watched, it should be felt.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- BACK TO HOME BUTTON --- */}
      <AnimatePresence>
        {showScrollTop && !showAbout && (
           <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => scrollToSection('home')}
              className="fixed bottom-8 right-8 z-50 p-4 bg-[#F2F2F2]/5 backdrop-blur-sm border border-[#F2F2F2]/10 text-[#F2F2F2]/40 rounded-full shadow-lg hover:text-[#B91C1C] hover:border-[#B91C1C]/50 hover:bg-[#B91C1C]/10 hover:scale-110 transition-all duration-300 focus:outline-none"
              aria-label="Back to Home"
           >
              <ArrowUp size={24} />
           </motion.button>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default App;
