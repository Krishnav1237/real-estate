import { Box, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: -1,
        background: '#030712',
      }}
    >
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${alpha(theme.palette.secondary.main, 0.2)} 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Grid pattern overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(${alpha(theme.palette.background.default, 0.1)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha(theme.palette.background.default, 0.1)} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.3,
        }}
      />

      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: ['0vh', '100vh'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            width: '2px',
            height: '2px',
            background: theme.palette.primary.main,
            boxShadow: `0 0 10px ${theme.palette.primary.main}`,
            borderRadius: '50%',
          }}
        />
      ))}
    </Box>
  );
};

export default AnimatedBackground; 