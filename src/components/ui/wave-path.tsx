'use client';

import { useEffect, useRef, type ComponentProps, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';

type WavePathProps = ComponentProps<'div'>;

export function WavePath({ className, ...props }: WavePathProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const path = useRef<SVGPathElement>(null);
	const progress = useRef(0);
	const x = useRef(0.2);
	const time = useRef(Math.PI / 2);
	const reqId = useRef<number | null>(null);

	useEffect(() => {
		setPath(progress.current);

		return () => {
			if (reqId.current) {
				cancelAnimationFrame(reqId.current);
			}
		};
	}, []);

	const setPath = (nextProgress: number) => {
		const width = containerRef.current?.getBoundingClientRect().width ?? 0;
		if (path.current) {
			path.current.setAttributeNS(
				null,
				'd',
				`M0 100 Q${width * x.current} ${100 + nextProgress * 0.6}, ${width} 100`,
			);
		}
	};

	const lerp = (start: number, end: number, amount: number) => start * (1 - amount) + end * amount;

	const resetAnimation = () => {
		time.current = Math.PI / 2;
		progress.current = 0;
	};

	const animateOut = () => {
		const newProgress = progress.current * Math.sin(time.current);
		progress.current = lerp(progress.current, 0, 0.025);
		time.current += 0.2;
		setPath(newProgress);

		if (Math.abs(progress.current) > 0.75) {
			reqId.current = requestAnimationFrame(animateOut);
		} else {
			resetAnimation();
			reqId.current = null;
		}
	};

	const manageMouseEnter = () => {
		if (reqId.current) {
			cancelAnimationFrame(reqId.current);
			reqId.current = null;
			resetAnimation();
		}
	};

	const manageMouseMove = (event: MouseEvent) => {
		const { movementY, clientX } = event;

		if (path.current) {
			const pathBound = path.current.getBoundingClientRect();
			x.current = (clientX - pathBound.left) / pathBound.width;
			progress.current += movementY;
			setPath(progress.current);
		}
	};

	const manageMouseLeave = () => {
		animateOut();
	};

	return (
		<div ref={containerRef} className={cn('relative h-24 w-full', className)} {...props}>
			<div
				onMouseEnter={manageMouseEnter}
				onMouseMove={manageMouseMove}
				onMouseLeave={manageMouseLeave}
				className="absolute inset-x-0 top-1/2 z-10 h-24 -translate-y-[15%]"
			/>
			<svg className="absolute inset-x-0 top-1/2 h-24 w-full -translate-y-1/2 overflow-visible">
				<path ref={path} className="fill-none stroke-current" strokeWidth={2} />
			</svg>
		</div>
	);
}
