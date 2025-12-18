/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
// CORREÇÃO AQUI: Removi 'wrap' e 'useVelocity' dos imports para não dar conflito
import { 
  motion, 
  useScroll, 
  useTransform, 
  useMotionValue, 
  useAnimationFrame, 
  useSpring
} from 'framer-motion';
import { Menu, X, Mail, Linkedin, ChevronRight, ChevronLeft, ChevronDown, ArrowUp, PenTool, Clapperboard, Film } from 'lucide-react';

// --- Função Wrap Manual (Essencial para o Loop Infinito) ---
// Como removi a importação, esta é a única definição de 'wrap' agora. Sem conflitos.
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

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
const originalProjects = [
  {
    title: "Show Match",
    video: "/video show mat.mp4",
    image: "https://vimeo.com/manage/videos/1145659774",
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

// Duplicamos 4 vezes para garantir que a tela esteja sempre cheia e o loop funcione sem "buracos"
const projects = [...originalProjects, ...originalProjects, ...originalProjects, ...originalProjects];

const App = () => {
  const activeSectionRef = useRef(null);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  // --- INFINITE SCROLL LOGIC (Physics Based & Bulletproof) ---
  const baseX = useMotionValue(0);
  const scrollVelocity = useMotionValue(-0.5); // Velocidade base constante (lenta)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  
  // Lógica de Loop: Transforma o valor X linear em uma porcentagem que reseta (-25% a 0%)
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const directionFactor = useRef(1);
  
  // Controle de Blur baseado na velocidade (Impulso)
  // Mapeamos: Velocidade -15 (rápido esq) -> Blur 10 | Velocidade 0 -> Blur 0 | Velocidade 15 -> Blur 10
  const blurAmount = useTransform(smoothVelocity, [-15, 0, 15], [10, 0, 10]); 
  const blurFilter = useTransform(blurAmount, (v) => {
     // Pequena proteção para o blur não ser negativo
     const blur = Math.max(0, v); 
     return `blur(${blur}px)`;
  });

  useAnimationFrame((t, delta) => {
    // Calcula o movimento baseado no tempo (delta) para ser suave em qualquer tela (60hz/120hz)
    let moveBy = directionFactor.current * -0.5 * (delta / 1000) * 100; 
    
    // Se tivermos um impulso (velocidade alta no spring), usamos ela
    if (Math.abs(smoothVelocity.get()) > 0.5) {
       moveBy = directionFactor.current * smoothVelocity.get() * (delta / 1000) * 20; 
    }
    
    baseX.set(baseX.get() + moveBy);
  });

  // Função para dar o impulso (Burst)
  const handleBurst = (direction) => {
    // direction: 'left' (avança/flow normal) ou 'right' (volta/rebobina)
    
    // Define a direção do movimento
    directionFactor.current = direction === 'left' ? 1 : -1;
    
    // Injeta velocidade ALTA no sistema
    // Aumentei um pouco para 20 para garantir que avance bem
    scrollVelocity.set(direction === 'left' ? -20 : 20); 

    // Depois de um tempo, tira a "injeção" de velocidade para o atrito parar suavemente
    setTimeout(() => {
       scrollVelocity.set(-0.5); // Volta para a velocidade de cruzeiro
       directionFactor.current = 1; // Sempre volta a fluir para a esquerda (normal)
    }, 300); // Impulso curto e forte
  };

  // --- Scroll Logic ---
  const { scrollY } = useScroll();
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowScrollTop(latest > window.innerHeight * 0.5);
    });
  }, [scrollY]);

  const navBackground = useTransform(scrollY, [0, 100], ["rgba(13,13,13,0)", "rgba(13,13,13,0.6)"]);
  const navBackdropBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(8px)"]);
  const bgParallax = useTransform(scrollY, [0, 5000],
