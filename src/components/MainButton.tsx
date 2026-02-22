import { motion } from 'framer-motion';

interface Props {
  onClick: () => void;
}

const MainButton = ({ onClick }: Props) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.92, y: 2 }}
    whileHover={{ scale: 1.08 }}
    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
    className="px-10 py-4 md:px-14 md:py-5 rounded-full bg-primary text-primary-foreground text-lg md:text-xl font-semibold btn-spring cursor-pointer select-none hover:shadow-[0_0_24px_rgba(236,72,153,0.35)]"
  >
    Сделать красиво ✨
  </motion.button>
);

export default MainButton;
