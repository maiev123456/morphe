'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
    theme?: 'dark' | 'light';
    dotColor?: string;
};

export function DottedSurface({ className, theme = 'dark', dotColor, ...props }: DottedSurfaceProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const requestRef = useRef<number>(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		const SEPARATION = 150;
		const AMOUNTX = 40;
		const AMOUNTY = 60;

		// Renderer setup - Daha hafif ayarlar
		const renderer = new THREE.WebGLRenderer({ 
			canvas: canvasRef.current,
			alpha: false,
			antialias: false // Performans için kapatıldı
		});
		renderer.setClearColor(theme === 'dark' ? 0x000000 : 0xffffff, 1);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)); // En düşük güvenli oran
		renderer.setSize(window.innerWidth, window.innerHeight);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.set(0, 355, 1220);

		// Particles initialization
		const numParticles = AMOUNTX * AMOUNTY;
		const positions = new Float32Array(numParticles * 3);
		
		let i = 0;
		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				positions[i * 3] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				positions[i * 3 + 1] = 0;
				positions[i * 3 + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
				i++;
			}
		}

		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		const resolvedColor = dotColor ?? (theme === 'dark' ? '#ffffff' : '#000000');

		const material = new THREE.ShaderMaterial({
			uniforms: {
				uColor: { value: new THREE.Color(resolvedColor) },
				uTime: { value: 0 },
			},
			vertexShader: `
				uniform float uTime;
				void main() {
					vec3 p = position;
					p.y = (sin((p.x / 150.0 + uTime) * 0.3) * 50.0) +
						  (sin((p.z / 150.0 + uTime) * 0.5) * 50.0);
					vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
					gl_PointSize = 6.0 * (1000.0 / -mvPosition.z);
					gl_Position = projectionMatrix * mvPosition;
				}
			`,
			fragmentShader: `
				uniform vec3 uColor;
				void main() {
					if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
					gl_FragColor = vec4(uColor, 0.6);
				}
			`,
			transparent: true,
			depthWrite: false,
		});

		const particles = new THREE.Points(geometry, material);
		scene.add(particles);

		const animate = (time: number) => {
			material.uniforms.uTime.value = time * 0.0005; // Daha yavaş akış
			renderer.render(scene, camera);
			requestRef.current = requestAnimationFrame(animate);
		};

		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', handleResize);
		requestRef.current = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('resize', handleResize);
			if (requestRef.current) cancelAnimationFrame(requestRef.current);
			geometry.dispose();
			material.dispose();
			renderer.dispose();
		};
	}, [theme, dotColor]);

	return (
		<div
			ref={containerRef}
			className={cn('fixed inset-0 z-0 overflow-hidden pointer-events-none', className)}
			{...props}
		>
			<canvas ref={canvasRef} className="w-full h-full" />
		</div>
	);
}
