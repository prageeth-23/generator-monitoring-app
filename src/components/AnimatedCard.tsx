import { motion } from "framer-motion";

interface AnimatedCardProps {
  index: number;
  children: React.ReactNode;
  className?: string;
}

export const AnimatedCard = ({ index, children, className }: AnimatedCardProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: false, amount: 0.3 }}
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
  >
    {children}
  </motion.div>
);
