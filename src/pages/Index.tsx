import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import AnimationCanvas from '@/components/AnimationCanvas';
import PhraseCard from '@/components/PhraseCard';
import MainButton from '@/components/MainButton';
import CornerFlowers from '@/components/CornerFlowers';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { EffectManager } from '@/effects/canvasEffects';
import type { Phrase } from '@/data/phrases';

const HISTORY_SIZE = 12;

const Index = () => {
  const { t, i18n } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const managerRef = useRef<EffectManager | null>(null);
  const [phrase, setPhrase] = useState<Phrase>(() => ({
    id: 0,
    text: t('defaultPhrase'),
  }));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const historyRef = useRef<number[]>([]);
  const reducedMotion = useRef(false);

  const phrases = (t('phrases', { returnObjects: true }) || []) as Phrase[];

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canvasRef.current) {
      managerRef.current = new EffectManager(canvasRef.current);
    }
    return () => managerRef.current?.cleanup();
  }, []);

  useEffect(() => {
    setPhrase({ id: 0, text: t('defaultPhrase') });
    historyRef.current = [];
  }, [i18n.language, t]);

  const getRandomPhrase = useCallback(() => {
    if (!phrases.length) return { id: 0, text: t('defaultPhrase') };
    const available = phrases.filter((p) => !historyRef.current.includes(p.id));
    const pool = available.length ? available : phrases;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    historyRef.current.push(chosen.id);
    if (historyRef.current.length > HISTORY_SIZE) historyRef.current.shift();
    return chosen;
  }, [phrases, t]);

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
      toast(t('toast.copied'));
    }
  }, [phrase, t]);

  const handleShare = useCallback(async () => {
    if (phrase && phrase.id !== 0 && navigator.share) {
      try {
        await navigator.share({
          text: phrase.text + '\n\n💐 ' + t('shareSuffix'),
        });
      } catch {
        /* user cancelled */
      }
    }
  }, [phrase, t]);

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
              background:
                'radial-gradient(circle at center, rgba(255,230,200,0.7) 0%, rgba(200,255,220,0.5) 40%, rgba(255,200,220,0.3) 100%)',
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
          className="text-center mb-2 relative w-full flex flex-col items-center"
        >
          <div className="absolute top-0 right-2 md:right-4">
            <LanguageSwitcher />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground flex items-center justify-center gap-2">
            <span className="inline-block">🌷</span>
            {t('title')}
            <span className="inline-block">🌷</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mt-2">{t('subtitle')}</p>
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
        <span>{t('footer')}</span>
      </footer>
    </div>
  );
};

export default Index;
