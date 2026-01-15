"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
// 使用原生 <img>，避免 next/image 优化管线对重定向/签名链接的干扰
import { useMemo } from "react";

export const polaroidVariants = {
	"1x1": "w-20 h-24",
	"4x5": "w-20 h-28",
	"4x3": "w-20 h-20",
	"9x16": "w-20 h-36",
	"5x4": "w-20 h-20",
	"16x9": "w-20 h-14",
};

const Polaroid = ({
	src,
	variant,
	onClick,
	fullscreen,
	index = 0,
	total = 0,
	isVisible,
}: {
	src: string;
	index?: number;
	total?: number;
	isVisible?: boolean;
	variant: keyof typeof polaroidVariants;
	onClick?: () => void;
	fullscreen?: boolean;
}) => {
	const variantClasses = polaroidVariants[variant] || polaroidVariants["1x1"];
	const randomRotation = useMemo(() => Math.random() * 30 - 15, []);

	return (
		<motion.div
			onClick={onClick}
			variants={{
				hidden: { scale: 0, rotate: 0, zIndex: total - index, opacity: 0 },
				show: {
					scale: 1,
					rotate: fullscreen ? 0 : randomRotation,
					opacity: 1,
					y: 0,
				},
			}}
			initial={"hidden"}
			animate={isVisible ? "show" : "hidden"}
			whileInView="visible"
			viewport={{ once: true }}
			transition={{
				delay: index * 0.1,
				duration: 0.6,
				type: "spring",
				stiffness: 260,
				damping: 20,
			}}
			whileHover={{
				rotate: 0,
				scale: 1.2,
				y: -12,
				zIndex: total + 10,
				cursor: "zoom-in",
				transition: {
					duration: 0.3,
					type: "spring",
					stiffness: 300,
					damping: 20,
				},
			}}
			whileTap={{
				scale: 0.95,
				transition: { duration: 0.1 },
			}}
			className={cn(
				"w-20 h-auto shadow-polaroid z-10 absolute group",
				fullscreen && "w-full h-full",
			)}
			style={{
				left: `${index * 25}px`,
				top: `${index % 2 === 0 ? 15 : 35}px`,
				zIndex: total - index,
			}}
		>
			<motion.div
				className={cn(
					"relative overflow-hidden",
					fullscreen ? "w-auto h-auto min-w-72" : variantClasses,
				)}
			>
				{/* Polaroid paper background */}
				<div className="absolute inset-0 bg-linear-to-br from-white via-gray-50 to-gray-100 rounded-sm" />

				{/* Image container with better styling */}
				<div className="relative bg-white p-1 rounded-sm h-full flex items-center justify-center">
					<img
						width={480}
						height={640}
						className="object-contain rounded-sm transition-all duration-300 group-hover:scale-105 max-w-full max-h-full"
						src={src}
						alt=""
						loading="lazy"
						decoding="async"
					/>

					{/* Subtle overlay for better visual depth */}
					<div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent rounded-sm pointer-events-none" />
				</div>

				{/* Polaroid border effect */}
				<div className="absolute inset-0 border border-gray-200/50 rounded-sm pointer-events-none" />
			</motion.div>

			{/* Enhanced shadow on hover */}
			<motion.div
				className="absolute inset-0 shadow-polaroid-hover opacity-0 rounded-sm pointer-events-none"
				whileHover={{ opacity: 1 }}
				transition={{ duration: 0.2 }}
			/>
		</motion.div>
	);
};

export default Polaroid;
