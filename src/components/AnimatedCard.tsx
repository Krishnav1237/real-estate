import { ReactNode, useRef, useEffect } from 'react';
import { Paper, useTheme, alpha } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface AnimatedCardProps {
  children: ReactNode;
}

const AnimatedCard = ({ children }: AnimatedCardProps) => {
  const theme = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth movement
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });
  const scale = useSpring(1, {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((event.clientX - centerX) / (rect.width / 2));
    mouseY.set((event.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseEnter = () => {
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        scale,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.background.paper, 0.8)} 0%, 
            ${alpha(theme.palette.background.paper, 0.6)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 3,
          p: 3,
          transition: 'all 0.3s ease-in-out',
          transformStyle: 'preserve-3d',
          '&:hover': {
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            '&:before': {
              transform: 'translateX(-50%) translateY(-50%) rotate(45deg) scale(2)',
              opacity: 0.2,
            },
            '&:after': {
              opacity: 0.4,
            },
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '200%',
            height: '200%',
            background: `linear-gradient(45deg, 
              transparent 0%, 
              ${alpha(theme.palette.primary.main, 0.03)} 30%, 
              ${alpha(theme.palette.secondary.main, 0.03)} 70%, 
              transparent 100%)`,
            transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
            transition: 'transform 0.6s ease-in-out, opacity 0.6s ease-in-out',
            opacity: 0,
            zIndex: 0,
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
              ${alpha(theme.palette.primary.main, 0.1)} 0%,
              transparent 60%)`,
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: 'none',
            zIndex: 1,
          },
          '& > *': {
            position: 'relative',
            zIndex: 2,
          },
        }}
      >
        {children}
      </Paper>
    </motion.div>
  );
};

export default AnimatedCard; 