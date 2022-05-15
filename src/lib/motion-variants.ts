export const FADE = {
  initial: { opacity: 0 },
  shown: { opacity: 1 },
  hidden: { opacity: 0 },
}

export const SLIDE = {
  initial: { opacity: 0, y: '4vh' },
  shown: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: '-2vh' },
}

export const listVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 1,
    },
  },
  shown: {
    transition: {
      delayChildren: 1,
      staggerChildren: 0.1,
    },
  },
  hidden: {
    transition: { staggerChildren: 0.05 },
  },
}
