"use client"
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, Plus, Minus, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface MediaItemType {
    id: number;
    type: string;
    title: string;
    desc: string;
    url: string;
    span: string;
}

const VIDEO_SPAN = "sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-2";
const IMAGE_SPANS = [
    "sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-2",
    "sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2",
] as const;

const getTileSpan = (item: MediaItemType, index: number) => {
    if (item.type === "video") return VIDEO_SPAN;
    return IMAGE_SPANS[(item.id + index) % IMAGE_SPANS.length];
};

const MediaItem = ({ item, className, onClick }: { item: MediaItemType, className?: string, onClick?: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null); 
    const [isInView, setIsInView] = useState(false);
    const [isBuffering, setIsBuffering] = useState(true);

    useEffect(() => {
        const options = { root: null, rootMargin: '50px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => setIsInView(entry.isIntersecting));
        }, options);
        if (videoRef.current) observer.observe(videoRef.current);
        return () => { if (videoRef.current) observer.unobserve(videoRef.current); };
    }, []);

    useEffect(() => {
        let mounted = true;
        const handleVideoPlay = async () => {
            if (!videoRef.current || !isInView || !mounted) return;
            try {
                if (videoRef.current.readyState >= 3) {
                    setIsBuffering(false);
                    await videoRef.current.play();
                } else {
                    setIsBuffering(true);
                    await new Promise((resolve) => { if (videoRef.current) videoRef.current.oncanplay = resolve; });
                    if (mounted) { setIsBuffering(false); await videoRef.current.play(); }
                }
            } catch (error) { console.warn("Video playback failed:", error); }
        };
        if (isInView) handleVideoPlay(); else if (videoRef.current) videoRef.current.pause();
        return () => { 
            mounted = false; 
            if (videoRef.current) { videoRef.current.pause(); videoRef.current.removeAttribute('src'); videoRef.current.load(); }
        };
    }, [isInView]);

    if (item.type === 'video') {
        return (
            <div className={cn(className, "relative overflow-hidden bg-black/10 cursor-pointer select-none touch-none")}>
                <video ref={videoRef} className="w-full h-full object-cover pointer-events-none" onClick={onClick} playsInline muted loop preload="auto">
                    <source src={item.url} type="video/mp4" />
                </video>
                {isBuffering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                )}
            </div>
        );
    }
    return (
        <img
            src={item.url}
            alt={item.title}
            className={cn("object-cover cursor-pointer select-none touch-none", className)}
            onClick={onClick}
            loading="lazy"
            decoding="async"
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
        />
    );
};

const GalleryModal = ({ selectedItem, isOpen, onClose, setSelectedItem, mediaItems, lightTheme = false }: {
    selectedItem: MediaItemType;
    isOpen: boolean;
    onClose: () => void;
    setSelectedItem: (item: MediaItemType | null) => void;
    mediaItems: MediaItemType[];
    lightTheme?: boolean;
}) => {
    const [zoom, setZoom] = useState(1);
    const isImage = selectedItem.type !== "video";

    useEffect(() => {
        setZoom(1);
    }, [selectedItem.id, isOpen]);

    const zoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4));
    const zoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
    const resetZoom = () => setZoom(1);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className={cn("absolute inset-0 backdrop-blur-md", lightTheme ? "bg-white/90" : "bg-black/90")} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={cn("relative w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-[0_8px_20px_rgba(35,39,49,0.12)] z-10 overflow-auto", lightTheme ? "bg-white text-[#232731] border border-[#232731]/20" : "bg-black text-white")}>
                {isImage && (
                    <div className="absolute top-4 right-16 z-20 flex items-center gap-2">
                        <button
                            type="button"
                            aria-label="Zoom out"
                            onClick={zoomOut}
                            className={cn("p-2 rounded-full transition-colors", lightTheme ? "bg-[#232731]/10 text-[#232731] hover:bg-[#232731]/20" : "bg-white/10 text-white hover:bg-white/20")}
                        >
                            <Minus className='w-5 h-5' />
                        </button>
                        <button
                            type="button"
                            aria-label="Zoom in"
                            onClick={zoomIn}
                            className={cn("p-2 rounded-full transition-colors", lightTheme ? "bg-[#232731]/10 text-[#232731] hover:bg-[#232731]/20" : "bg-white/10 text-white hover:bg-white/20")}
                        >
                            <Plus className='w-5 h-5' />
                        </button>
                        <button
                            type="button"
                            aria-label="Reset zoom"
                            onClick={resetZoom}
                            className={cn("p-2 rounded-full transition-colors", lightTheme ? "bg-[#232731]/10 text-[#232731] hover:bg-[#232731]/20" : "bg-white/10 text-white hover:bg-white/20")}
                        >
                            <RotateCcw className='w-5 h-5' />
                        </button>
                    </div>
                )}
                <div className="min-h-[60vh] flex items-center justify-center p-4">
                    {selectedItem.type === "video" ? (
                        <video className="max-w-full max-h-[82vh] h-auto object-contain" controls playsInline>
                            <source src={selectedItem.url} type="video/mp4" />
                        </video>
                    ) : (
                        <img
                            src={selectedItem.url}
                            alt={selectedItem.title}
                            className="max-w-full max-h-[82vh] h-auto object-contain"
                            style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
                        />
                    )}
                </div>
                <button className={cn("absolute top-4 right-4 p-2 rounded-full transition-colors", lightTheme ? "bg-[#232731]/10 text-[#232731] hover:bg-[#232731]/20" : "bg-white/10 text-white hover:bg-white/20")} onClick={onClose}><X className='w-6 h-6' /></button>
            </motion.div>
            <motion.div drag dragMomentum={false} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110]">
                <div className={cn("backdrop-blur-xl p-2 rounded-2xl flex gap-2 cursor-grab active:cursor-grabbing", lightTheme ? "bg-white/90 border border-[#232731]/20" : "bg-white/10 border border-white/10")}>
                    {mediaItems.map((item) => (
                        <motion.div key={item.id} onClick={() => setSelectedItem(item)} className={cn("w-12 h-12 rounded-lg overflow-hidden cursor-pointer transition-all", selectedItem.id === item.id ? (lightTheme ? "ring-2 ring-[#232731] scale-110" : "ring-2 ring-white scale-110") : "opacity-50 hover:opacity-100")}>
                            <MediaItem item={item} className="w-full h-full" />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export function InteractiveBentoGallery({ mediaItems, title, description, lightTheme = false }: {
    mediaItems: MediaItemType[]
    title: string
    description: string
    lightTheme?: boolean
}) {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState<MediaItemType | null>(null);
    const [items, setItems] = useState(mediaItems);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        setItems(mediaItems);
    }, [mediaItems]);

    const moveItem = (activeId: number, direction: -1 | 1) => {
        setItems((currentItems) => {
            const fromIndex = currentItems.findIndex((entry) => entry.id === activeId);
            if (fromIndex === -1) return currentItems;

            const toIndex = Math.max(0, Math.min(currentItems.length - 1, fromIndex + direction));
            if (fromIndex === toIndex) return currentItems;

            const nextItems = [...currentItems];
            const [movedItem] = nextItems.splice(fromIndex, 1);
            nextItems.splice(toIndex, 0, movedItem);
            return nextItems;
        });
    };

    return (
        <div className={cn("px-4 pb-6 pt-20", lightTheme ? "bg-white text-[#232731]" : "bg-black text-white")}>
            <button onClick={() => navigate("/projects")} className={cn("fixed top-8 left-8 z-50 flex items-center gap-2 transition-colors group", lightTheme ? "text-[#232731]/60 hover:text-[#232731]" : "text-white/50 hover:text-white")}>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Projects</span>
            </button>

            <div className="mx-auto max-w-6xl space-y-10">
                <div className="text-center space-y-4">
                    <motion.h1 className="text-4xl md:text-6xl font-bold tracking-tighter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>{title}</motion.h1>
                    <motion.p className={cn("text-lg max-w-2xl mx-auto whitespace-pre-line", lightTheme ? "text-[#232731]/60" : "text-white/50")} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>{description}</motion.p>
                </div>

                <motion.div
                    className="grid grid-cols-1 grid-flow-dense sm:grid-cols-3 md:grid-cols-4 gap-3 auto-rows-[72px]"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layoutId={`media-${item.id}`}
                            layout
                            className={cn(
                                "relative overflow-hidden rounded-xl cursor-move",
                                getTileSpan(item, index),
                                lightTheme && "shadow-[0_3px_10px_rgba(35,39,49,0.08)]",
                            )}
                            onClick={() => !isDragging && setSelectedItem(item)}
                            drag
                            dragDirectionLock
                            dragConstraints={{ left: -56, right: 56, top: -56, bottom: 56 }}
                            dragMomentum={false}
                            dragElastic={0}
                            dragSnapToOrigin
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={(_, info) => {
                                setIsDragging(false);
                                const horizontalOffset = info.offset.x;
                                const verticalOffset = info.offset.y;
                                const dominantOffset = Math.abs(horizontalOffset) > Math.abs(verticalOffset)
                                    ? horizontalOffset
                                    : verticalOffset;

                                if (Math.abs(dominantOffset) < 80) return;

                                const currentIndex = items.findIndex((entry) => entry.id === item.id);
                                if (currentIndex === -1) return;

                                const direction: -1 | 1 = dominantOffset > 0 ? 1 : -1;
                                const nextIndex = currentIndex + direction;
                                if (nextIndex < 0 || nextIndex >= items.length) return;

                                moveItem(item.id, direction);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileDrag={{
                                zIndex: 20,
                                scale: 0.99,
                                boxShadow: lightTheme
                                    ? "0 6px 14px rgba(35, 39, 49, 0.14)"
                                    : "0 6px 14px rgba(0, 0, 0, 0.2)",
                            }}
                            transition={{
                                layout: {
                                    type: "spring",
                                    stiffness: 320,
                                    damping: 28
                                }
                            }}
                        >
                            <MediaItem
                                item={item}
                                className="absolute inset-0 w-full h-full"
                                onClick={() => !isDragging && setSelectedItem(item)}
                            />
                            {/* Intentionally no text/overlay on gallery tiles */}
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <AnimatePresence>
                {selectedItem && (
                    <GalleryModal selectedItem={selectedItem} isOpen={true} onClose={() => setSelectedItem(null)} setSelectedItem={setSelectedItem} mediaItems={items} lightTheme={lightTheme} />
                )}
            </AnimatePresence>
        </div>
    );
};
