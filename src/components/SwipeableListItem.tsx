import React, { useRef, useState } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface SwipeableListItemProps {
  children: React.ReactNode;
  onDelete: () => void;
}

export function SwipeableListItem({ children, onDelete }: SwipeableListItemProps) {
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef(null);

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -100 || velocity < -500) {
      await controls.start({ x: -200 });
      onDelete();
    } else {
      controls.start({ x: 0 });
    }
    setIsDragging(false);
  };

  return (
    <div ref={constraintsRef} className="relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center">
        <Trash2 className="text-white w-6 h-6" />
      </div>
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
    </div>
  );
}