import React, { useRef, useState } from 'react';
import { motion, PanInfo, useAnimation, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface SwipeableListItemProps {
  children: React.ReactNode;
  onDelete: () => Promise<void>;
}

export function SwipeableListItem({ children, onDelete }: SwipeableListItemProps) {
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -500) {
      await controls.start({ x: -200, height: 0, opacity: 0 });
      await onDelete();
    } else {
      controls.start({ x: 0 });
    }
    setIsDragging(false);
  };

  return (
    <motion.div
      initial={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden"
      ref={constraintsRef}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isDragging ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center"
      >
        <Trash2 className="text-white w-6 h-6" />
      </motion.div>
      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: -200 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        className={`bg-white cursor-grab active:cursor-grabbing ${isDragging ? 'z-10' : ''}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}