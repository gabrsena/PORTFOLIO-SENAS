/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Menu, X, Mail, Linkedin, ChevronRight, ChevronDown, ArrowUp, PenTool, Clapperboard, Film } from 'lucide-react';
import Marquee from 'react-fast-marquee';

// --- Helper Component for Scroll Animations ---
const RevealOnScroll = ({ children, delay = 0, className = "", zoom = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: zoom ? 0.9 : 1 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: false, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- Project Card Component ---
const ProjectCard = ({ project }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative flex-shrink-0 h-[50vh] md:h-[60vh] aspect-[9/16] mx-4 md:mx-6 bg-[#111] overflow-hidden shadow-2xl cursor-pointer group rounded-sm border border-white/5"
      onClick={() => window.open('https://vimeo.com/senascreative', '_blank')}
    >
      <div className="absolute inset-0 border border-white/10 pointer-events-none z-30 opacity-50" />

      <motion.div 
        style={{ transformStyle: "preserve-3d" }}
        className="relative z-10 w-full h-full"
      >
        <video 
          src={project.video} 
          autoPlay loop muted playsInline preload="metadata" 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-500 scale-100 group-hover:scale-110 transition-transform duration-700" 
        />
      </motion.div>
      
      <motion.div 
        style={{ transform: "translateZ(50px)" }}
        className="absolute inset-0 z-40 flex flex-col justify-end p-6 bg-gradient-to-t from-black/95 via-black/30 to-transparent"
      >
        <h3 className="text-3xl font-anton uppercase mb-1 text-[#F2F2F2] drop-shadow-lg">
          {project.title}
        </h3>
        <div className="mt-4 overflow-hidden">
          <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#B91C1C] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            View Project <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Service Card Component (CORRIGIDO: Z-INDEX + VISIBILIDADE) ---
const ServiceCard = ({ service }) => {
  return (
    <div className="group relative h-[360px] md:h-[420px] flex flex-col justify-between p-8 border border-[#F2F2F2]/10 hover:border-[#B91C1C] transition-all duration-500 overflow-hidden cursor-default bg-[#111]">
      
      {/* VÍDEO: 
         - z-0: Fica acima do fundo #111, mas abaixo do texto.
         - opacity-0: Invisível por padrão.
         - group-hover:opacity-100: Visível no hover.
      */}
      <video 
        src={service.videoUrl} 
        autoPlay 
        loop 
        muted 
        playsInline
        preload="auto" 
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" 
      />
      
      {/* Overlay Escuro para leitura (Aparece junto com o vídeo) */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
      
      {/* CONTEÚDO (Texto/Ícone): z-20 para ficar sempre no topo */}
      <div className="relative z-20 flex justify-center items-start pt-4">
        <div className="relative px-4 py-2">
          <div className="text-[#B91C1C]">
            {service.icon}
          </div>
        </div>
      </div>
      
      <div className="relative z-20 flex flex-col gap-4 items-center text-center">
        <h3 className="text-3xl font-anton uppercase text-[#F2F2F2] group-hover:text-[#B91C1C] transition-colors duration-500">
          {service.title}
        </h3>
        <p className="text-[#F2F2F2]/70 font-light text-sm md:text-base leading-relaxed group-hover:text-[#F2F2F2] transition-colors duration-500">
          {service.desc}
        </p>
      </div>
    </div>
  );
};

// --- Helper: Decrypted Text Effect ---
const DecryptedText = ({ text, className = "" }) => {
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

const projects = [
  { title: "Brand Films", video: "/video show mat.mp4" },
  { title: "Social Shorts", video: "/car.mp4" },
  { title: "Wedding Films", video: "https://i.imgur.com/BepzB9N.mp4" },
  { title: "Property Tours", video: "https://i.imgur.com/BepzB9N.mp4" },
  { title: "Corporate Films", video: "https://i.imgur.com/BepzB9N.mp4" }
];

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  
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
      intervalId = setInterval(tick, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isFastPhase, animatedWords.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFastPhase(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const { scrollY } = useScroll();
  
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowScrollTop(latest > window.innerHeight * 0.5);
    });
  }, [scrollY]);

  const bgParallax = useTransform(scrollY, [0, 5000], [0, -300]);
  const logoScale = useTransform(scrollY, [0, 300], [1, 0.9]);

  const scrollToSection = (id) => {
    if (id === 'about') {
      setShowAbout(true);
      setMenuOpen(false);
      return;
    }
    setShowAbout(false);
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
          if (entry.isIntersecting) setActiveSection(entry.target.id);
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
    <div className="bg-[#0D0D0D] text-[#F2F2F2] font-sans selection:bg-[#B91C1C] selection:text-white overflow-x-hidden w-full perspective-[1000px]">
      
      <motion.div className="fixed inset-0 z-0" style={{ y: bgParallax, scale: 1.25 }}>
        <video autoPlay loop muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover opacity-100" src="/portv5.mp4" />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      <motion.div 
        className="fixed top-8 left-8 z-[60] cursor-pointer" 
        onClick={() => scrollToSection('home')}
        style={{ scale: logoScale, originX: 0, originY: 0 }}
      >
         <img src="logo.png" alt="SENA" className="h-[2.48rem] lg:h-[3.03rem] w-auto object-contain transition-all duration-300" />
      </motion.div>

      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-4 px-8 h-[calc(2.48rem+2rem)] lg:h-[calc(3.03rem+2rem)]">
        <div className="flex-1" />
        <div className="z-[60]">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#F2F2F2] w-12 h-12 flex items-center justify-center relative focus:outline-none">
             <AnimatePresence mode="wait">
                {menuOpen ? (
                   <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} className="absolute">
                       <X className="w-8 h-8 md:w-10 md:h-10" />
                   </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} className="absolute">
                       <Menu className="w-8 h-8 md:w-10 md:h-10" />
                   </motion.div>
                )}
              </AnimatePresence>
          </button>
        </div>
      </nav>

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
                transition={{ delay: 0.1 + index * 0.1 }}
                onClick={() => scrollToSection(link.id)}
                className={`text-2xl md:text-5xl font-anton tracking-widest hover:text-[#B91C1C] transition-colors uppercase ${((activeSection === link.id && !showAbout) || (link.id === 'about' && showAbout)) ? 'text-[#B91C1C]' : 'text-[#F2F2F2]'}`}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center z-10 px-4">
        <motion.div className="relative z-20 flex flex-col items-center justify-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-4 font-anton text-4xl md:text-6xl lg:text-7xl uppercase whitespace-nowrap">
            <span className="text-[#F2F2F2]">LET ME COOK</span>
             <motion.span className="text-[#F2F2F2]" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>YOUR</motion.span>
            <div className="relative w-[150px] md:w-[250px] h-[1.4em] flex items-center justify-center">
               <AnimatePresence mode="wait">
                <motion.span key={wordIndex} initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }} transition={{ duration: isFastPhase ? 0.08 : 0.5 }} className="absolute text-[#B91C1C] text-[1.1em] md:text-[0.9em] font-anton uppercase">
                  {animatedWords[wordIndex].text}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        <motion.div className="absolute bottom-10 z-20 cursor-pointer" onClick={() => scrollToSection('work')} animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown className="w-8 h-8 text-[#B91C1C]" />
        </motion.div>
      </section>

      <motion.section id="work" className="relative z-10">
         <div className="min-h-screen flex flex-col items-center justify-center py-20 bg-[#0D0D0D]">
             <div className="w-full flex flex-col gap-12"> 
                <div className="max-w-7xl w-full mx-auto px-4 md:px-8 flex justify-between items-end">
                   <RevealOnScroll>
                    <h2 className="text-7xl md:text-9xl lg:text-[10rem] font-anton uppercase text-[#B91C1C] leading-none"><DecryptedText text="WORK" /></h2>
                  </RevealOnScroll>
                </div>

                <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center">
                  <Marquee 
                    gradient={false} 
                    speed={50} 
                    play={true} 
                    className="h-full items-center overflow-y-hidden"
                    pauseOnHover={false}
                  >
                    {projects.map((project, index) => (
                      <ProjectCard key={index} project={project} />
                    ))}
                  </Marquee>
                </div>
             </div>
         </div>

         <div className="min-h-screen flex flex-col items-center justify-center py-20 w-full bg-[#0D0D0D]">
            <div className="max-w-7xl w-full px-4 md:px-8 flex flex-col gap-16 md:gap-24">
                <RevealOnScroll>
                    <h2 className="text-7xl md:text-9xl lg:text-[10rem] font-anton uppercase text-[#B91C1C] leading-none"><DecryptedText text="WHAT I DO" /></h2>
                </RevealOnScroll>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[
                      { title: 'SCRIPTWRITING', desc: 'Building the foundation of the narrative. I craft stories that engage from the very first second.', icon: <PenTool size={32} />, videoUrl: '/2.mp4' },
                      { title: 'DIRECTION', desc: 'Translating concepts into visual reality. Leading crews and talent to capture the authentic emotion.', icon: <Clapperboard size={32} />, videoUrl: '/3.mp4' },
                      { title: 'EDITING', desc: 'The final rewrite. Mastering rhythm, pacing, and sound to deliver the maximum emotional impact.', icon: <Film size={32} />, videoUrl: '/1.mp4' }
                    ].map((service, index) => (
                        <RevealOnScroll key={index} delay={index * 0.15} zoom={true}>
                           <ServiceCard service={service} />
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
         </div>
      </motion.section>

      <section id="contact" className="relative min-h-screen flex items-center justify-center z-10 py-20 px-8">
        <div className="max-w-4xl w-full flex flex-col items-center text-center gap-12">
            <RevealOnScroll><h2 className="text-sm font-anton uppercase tracking-[0.2em] text-[#F2F2F2]/60">CONTACT</h2></RevealOnScroll>
            <RevealOnScroll delay={0.2}><h1 className="text-5xl md:text-7xl lg:text-8xl font-anton font-bold text-[#F2F2F2] leading-tight uppercase">Ready to get <br/><span className="text-[#B91C1C]">cooking?</span></h1></RevealOnScroll>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
                <a href="mailto:gabrsena@hotmail.com" className="p-4 rounded-full border border-[#F2F2F2]/10 hover:border-[#B91C1C] hover:bg-[#B91C1C]/10 text-[#F2F2F2] hover:text-[#B91C1C] transition-all duration-300"><Mail size={28} /></a>
                <a href="https://www.linkedin.com/in/gabrielsenas/" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full border border-[#F2F2F2]/10 hover:border-[#B91C1C] hover:bg-[#B91C1C]/10 text-[#F2F2F2] hover:text-[#B91C1C] transition-all duration-300"><Linkedin size={28} /></a>
                <a href="https://wa.me/5511973759325" target="_blank" rel="noopener noreferrer" className="p-4 rounded-full border border-[#F2F2F2]/10 hover:border-[#B91C1C] hover:bg-[#B91C1C]/10 text-[#F2F2F2] hover:text-[#B91C1C] transition-all duration-300"><MessageCircle size={28} /></a>
            </div>
            <p className="text-xl md:text-2xl font-anton uppercase text-[#F2F2F2]/80 mt-8">Based in Brazil, Cooking Worldwide</p>
        </div>
        <div className="absolute bottom-8 text-center w-full text-[#F2F2F2]/30 text-sm font-light">&copy; 2025 Sena. All rights reserved.</div>
      </section>

      <AnimatePresence>
        {showAbout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#0D0D0D] overflow-y-auto">
             <button onClick={() => setShowAbout(false)} className="fixed top-8 right-8 z-[110] text-[#F2F2F2] hover:text-[#B91C1C] transition-colors"><X size={40} /></button>
            <div className="min-h-screen flex items-center justify-center py-20 px-8">
               <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-8 items-center md:items-start">
                  <h2 className="text-7xl md:text-9xl lg:text-[10rem] font-anton uppercase text-[#B91C1C] mb-8 leading-none"><DecryptedText text="ABOUT" /></h2>
                  <div className="w-[50%] md:w-[70%] relative aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 group mx-auto">
                      <img src="/eu.png" alt="Gabriel Sena" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
                <div className="flex flex-col gap-6 text-lg md:text-xl font-light leading-relaxed text-[#F2F2F2]/80">
                  <p>Hey there, I'm Sena, Gabriel Sena. I'm from São Paulo, Brazil.</p>
                  <p>With a degree in Marketing, I've spent the last few years refining my vision as a Creative Director and Editor, blending sales strategy with cinematic emotion.</p>
                  <p>I believe a video shouldn’t just be watched, it should be felt.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollTop && !showAbout && (
           <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} onClick={() => scrollToSection('home')} className="fixed bottom-8 right-8 z-50 p-4 bg-[#F2F2F2]/5 backdrop-blur-sm border border-[#F2F2F2]/10 text-[#F2F2F2]/40 rounded-full hover:text-[#B91C1C] transition-all duration-300"><ArrowUp size={24} /></motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const MessageCircle = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

export default App;
