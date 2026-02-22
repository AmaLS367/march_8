import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import AnimationCanvas from '@/components/AnimationCanvas';
import PhraseCard from '@/components/PhraseCard';
import MainButton from '@/components/MainButton';
import CornerFlowers from '@/components/CornerFlowers';
import { EffectManager } from '@/effects/canvasEffects';
import { phrases, type Phrase } from '@/data/phrases';

const HISTORY_SIZE = 12;

const defaultPhrase: Phrase = {
  id: 0,
  text: 'Нажми кнопку — и получи тёплое пожелание с весенней анимацией 💐',
};

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<EffectManager | null>(null);
  const [phrase, setPhrase] = useState<Phrase>(defaultPhrase);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const historyRef = useRef<number[]>([]);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canvasRef.current) {
      managerRef.current = new EffectManager(canvasRef.current);
    }
    return () => managerRef.current?.cleanup();
  }, []);

  const getRandomPhrase = useCallback(() => {
    const available = phrases.filter(p => !historyRef.current.includes(p.id));
    const chosen = available[Math.floor(Math.random() * available.length)];
    historyRef.current.push(chosen.id);
    if (historyRef.current.length > HISTORY_SIZE) historyRef.current.shift();
    return chosen;
  }, []);

  const handleClick = useCallback(() => {
    if (reducedMotion.current) {
      setPhrase(getRandomPhrase());
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setPhrase(getRandomPhrase());
      managerRef.current?.startRandom();
      setTimeout(() => setIsTransitioning(false), 120);
    }, 140);
  }, [getRandomPhrase]);

  const handleCopy = useCallback(async () => {
    if (phrase && phrase.id !== 0) {
      await navigator.clipboard.writeText(phrase.text);
      toast('Скопировано! ✨');
    }
  }, [phrase]);

  const handleShare = useCallback(async () => {
    if (phrase && phrase.id !== 0 && navigator.share) {
      try {
        await navigator.share({ text: phrase.text + '\n\n💐 С 8 марта!' });
      } catch { /* user cancelled */ }
    }
  }, [phrase]);

  return (
    <div className="min-h-screen bg-spring-gradient bg-spring-pattern relative overflow-hidden">
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="transition-overlay"
            className="fixed inset-0 z-30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              background: 'radial-gradient(circle at center, rgba(255,230,200,0.7) 0%, rgba(200,255,220,0.5) 40%, rgba(255,200,220,0.3) 100%)',
            }}
            aria-hidden
          />
        )}
      </AnimatePresence>
      <AnimationCanvas ref={canvasRef} />
      <CornerFlowers />

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-5">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-center mb-2"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground flex items-center justify-center gap-2">
            <span className="inline-block">🌷</span>
            С 8 марта!
            <span className="inline-block">🌷</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mt-2">
            Каждый клик — новое пожелание и анимация
          </p>
        </motion.header>

        {/* Phrase card — always visible */}
        <AnimatePresence mode="wait">
          <PhraseCard
            key={phrase.id}
            phrase={phrase}
            onCopy={handleCopy}
            onShare={handleShare}
          />
        </AnimatePresence>

        <MainButton onClick={handleClick} />
      </div>

      <footer className="fixed bottom-3 w-full text-center text-xs text-muted-foreground z-20 pointer-events-none flex items-center justify-center gap-1">
        <span>С 8 марта 🌷 Пусть эта весна будет тёплой</span>
      </footer>
    </div>
  );
};

export default Index;
