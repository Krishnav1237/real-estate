import { useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
}

export default function AnimatedCard({ children }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
} 