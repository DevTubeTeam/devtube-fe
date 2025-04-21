import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import styles from './Loader.module.css';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <AnimatePresence>
      <motion.div
        className={styles.loaderOverlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={styles.loaderContainer}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
          <div className={styles.spinnerContainer}>
            {/* Video player themed loader animation */}
            <motion.div
              className={styles.spinnerOuter}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                ease: 'linear',
                repeat: Infinity,
              }}
            >
              <motion.div className={styles.spinnerInner}>
                <motion.div
                  className={styles.playButton}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          {message && (
            <motion.p
              className={styles.message}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;
