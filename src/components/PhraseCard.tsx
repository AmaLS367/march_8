import { motion } from 'framer-motion';
import { Copy, Share2 } from 'lucide-react';
import type { Phrase } from '@/data/phrases';
import DecorativeFrame from './DecorativeFrame';

interface Props {
  phrase: Phrase;
  onCopy: () => void;
  onShare: () => void;
}

const PhraseCard = ({ phrase, onCopy, onShare }: Props) => {
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className="card-solid rounded-2xl p-6 md:p-8 max-w-md mx-auto text-center relative overflow-hidden"
    >
      <DecorativeFrame />
      <p className="text-lg md:text-xl text-foreground leading-relaxed font-medium relative z-10">
        {phrase.text}
      </p>
      <div className="flex gap-3 justify-center mt-4 relative z-10">
        <button
          onClick={(e) => { e.stopPropagation(); onCopy(); }}
          className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          title="Скопировать"
        >
          <Copy size={16} />
        </button>
        {canShare && (
          <button
            onClick={(e) => { e.stopPropagation(); onShare(); }}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            title="Поделиться"
          >
            <Share2 size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default PhraseCard;
