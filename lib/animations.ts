import { Variants } from 'framer-motion';

// Fade up animation variant
export const fadeUpVariant: Variants = {
	hidden: {
		opacity: 0,
		y: 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: 'spring',
			damping: 15,
			stiffness: 100,
		},
	},
};

// Fade in animation variant
export const fadeInVariant: Variants = {
	hidden: {
		opacity: 0,
	},
	visible: {
		opacity: 1,
		transition: {
			duration: 0.5,
		},
	},
};

// Scale up animation variant
export const scaleUpVariant: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.8,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			type: 'spring',
			damping: 15,
			stiffness: 100,
		},
	},
};

// Stagger children animation variant
export const staggerContainerVariant: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.3,
		},
	},
};

// Slide in from left variant
export const slideInLeftVariant: Variants = {
	hidden: {
		opacity: 0,
		x: -50,
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			type: 'spring',
			damping: 20,
			stiffness: 100,
		},
	},
};

// Slide in from right variant
export const slideInRightVariant: Variants = {
	hidden: {
		opacity: 0,
		x: 50,
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			type: 'spring',
			damping: 20,
			stiffness: 100,
		},
	},
};

// Pop up variant
export const popUpVariant: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.5,
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			type: 'spring',
			damping: 10,
			stiffness: 100,
		},
	},
};

// Hover scale variant
export const hoverScaleVariant = {
	hover: {
		scale: 1.05,
		transition: {
			type: 'spring',
			damping: 10,
			stiffness: 100,
		},
	},
	tap: {
		scale: 0.95,
	},
};

// Rotate and scale variant
export const rotateScaleVariant: Variants = {
	hidden: {
		opacity: 0,
		scale: 0,
		rotate: -180,
	},
	visible: {
		opacity: 1,
		scale: 1,
		rotate: 0,
		transition: {
			type: 'spring',
			damping: 15,
			stiffness: 100,
		},
	},
};

// List item animation variant
export const listItemVariant: Variants = {
	hidden: {
		opacity: 0,
		x: -20,
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			type: 'spring',
			damping: 15,
			stiffness: 100,
		},
	},
};
