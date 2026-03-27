import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { MorphingCardStack, type CardData } from "./components/ui/morphing-card-stack";
import { AnimatedHeroSection } from "./components/ui/animated-hero-section";
import { DottedSurface } from "./components/ui/dotted-surface";
import { LandingAccordionItem } from "./components/ui/interactive-image-accordion";
import { InteractiveBentoGallery, MediaItemType } from "./components/ui/interactive-bento-gallery";
import { WavePath } from "./components/ui/wave-path";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import guardianImageUrl from "./images/guardian_image.png";
import lumaImageUrl from "./images/luma_image.png";
import propeaseImageUrl from "./images/propease_image.jpg";
import amoreImageUrl from "./images/amore_image.png";
import otherImageUrl from "./images/other_image.png";
import morpheLogoBigUrl from "./images/morphe_logo_big.png";
import morpheLogoIconUrl from "./images/morphe_logo_icon.png";
import iconProjectsUrl from "./images/icon_projects.svg";
import iconDesignApproachUrl from "./images/icon_design_approach.svg";
import iconContactUrl from "./images/icon_contact.svg";
import logoVideoUrl from "./images/logo_video.mp4";

/** Home card icons — loaded from src/images */
const HOME_ICON = {
  morphe: morpheLogoIconUrl,
  projects: iconProjectsUrl,
  designApproach: iconDesignApproachUrl,
  contact: iconContactUrl,
} as const;

// Auto-load Guardian detail images from `images/guardian_images/*`
// Files are sorted by name so you can control order via filenames.
const resolveGlobUrls = (modules: Record<string, unknown>) =>
  Object.entries(modules)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([, mod]) =>
      typeof mod === "string"
        ? mod
        : (mod as { default?: string })?.default ?? "",
    )
    .filter(Boolean);

const GUARDIAN_DETAIL_IMAGES = resolveGlobUrls(
  import.meta.glob("./images/guardian_images/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}", {
    eager: true,
  }) as Record<string, unknown>,
);

const LUMA_DETAIL_IMAGES = resolveGlobUrls(
  import.meta.glob("./images/luma_images/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}", {
    eager: true,
  }) as Record<string, unknown>,
);

const AMORE_DETAIL_IMAGES = resolveGlobUrls({
  ...(import.meta.glob("./images/amore_images/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}", {
    eager: true,
  }) as Record<string, unknown>),
  ...(import.meta.glob("./images/amore_pet_food_images/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}", {
    eager: true,
  }) as Record<string, unknown>),
});

const PROPEASE_DETAIL_IMAGES = resolveGlobUrls(
  import.meta.glob("./images/propease_images/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}", {
    eager: true,
  }) as Record<string, unknown>,
);

const OTHER_DETAIL_IMAGES = resolveGlobUrls(
  import.meta.glob("./images/other_images/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}", {
    eager: true,
  }) as Record<string, unknown>,
);

const guardianDetailImageAt = (index: number, fallbackUrl: string) =>
  GUARDIAN_DETAIL_IMAGES[index] ?? fallbackUrl;
const lumaDetailImageAt = (index: number, fallbackUrl: string) =>
  LUMA_DETAIL_IMAGES[index] ?? fallbackUrl;
const amoreDetailImageAt = (index: number, fallbackUrl: string) =>
  AMORE_DETAIL_IMAGES[index] ?? fallbackUrl;
const propeaseDetailImageAt = (index: number, fallbackUrl: string) =>
  PROPEASE_DETAIL_IMAGES[index] ?? fallbackUrl;
const otherDetailImageAt = (index: number, fallbackUrl: string) =>
  OTHER_DETAIL_IMAGES[index] ?? fallbackUrl;

const AMORE_DETAIL_ITEMS: MediaItemType[] = AMORE_DETAIL_IMAGES.map((url, index) => ({
  id: index + 1,
  type: "image",
  title: `amore_image_${index + 1}`,
  desc: `Amore image ${index + 1}`,
  url,
  span: "md:col-span-2 md:row-span-2",
}));

const LUMA_DETAIL_ITEMS: MediaItemType[] = LUMA_DETAIL_IMAGES.map((url, index) => ({
  id: index + 1,
  type: "image",
  title: `luma_image_${index + 1}`,
  desc: `Luma image ${index + 1}`,
  url,
  span: "md:col-span-2 md:row-span-2",
}));

const GUARDIAN_DETAIL_ITEMS: MediaItemType[] = GUARDIAN_DETAIL_IMAGES.map((url, index) => ({
  id: index + 1,
  type: "image",
  title: `guardian_image_${index + 1}`,
  desc: `Guardian image ${index + 1}`,
  url,
  span: "md:col-span-2 md:row-span-2",
}));

const PROPEASE_DETAIL_ITEMS: MediaItemType[] = PROPEASE_DETAIL_IMAGES.map((url, index) => ({
  id: index + 1,
  type: "image",
  title: `propease_image_${index + 1}`,
  desc: `PropEase image ${index + 1}`,
  url,
  span: "md:col-span-2 md:row-span-2",
}));

const OTHER_DETAIL_ITEMS: MediaItemType[] = OTHER_DETAIL_IMAGES.map((url, index) => ({
  id: index + 1,
  type: "image",
  title: `other_image_${index + 1}`,
  desc: `Other image ${index + 1}`,
  url,
  span: "md:col-span-2 md:row-span-2",
}));

interface ProjectMetric {
  label: string;
  value: string;
}

interface ProjectDetailData {
  title: string;
  subtitle: string;
  desc: string;
  category: string;
  year: string;
  client: string;
  role: string;
  proposalUrl: string;
  overview: string;
  challenge: string;
  solution: string;
  services: string[];
  deliverables: string[];
  metrics: ProjectMetric[];
  items: MediaItemType[];
}

const PROJECT_DETAILS: Record<string, ProjectDetailData> = {
  "1": {
    title: "Guardian",
    subtitle: "UX/UI Project",
    desc: "Guardian helps visually impaired individuals move safely and independently using real-time spatial awareness.",
    category: "Accessibility App",
    year: "2026",
    client: "School Project",
    role: "UX/UI designer",
    proposalUrl: "/proposals/Guardian_Proposal_Spread.pdf",
    overview: "Guardian addresses a critical gap in accessibility: most navigation tools are not designed to be usable without prior training. Visually impaired users often face steep learning curves, high cognitive load, and inconsistent interaction patterns. We reimagined the UX/UI from the ground up-introducing predictable interaction zones, clear feedback systems, and simplified flows. By combining spatial audio, haptics, and intuitive structure, Guardian transforms navigation into a more accessible and reliable experience.",
    challenge: "The brand felt premium in conversation but inconsistent in execution. Assets had no clear rhythm, typography lacked structure, and motion pieces did not feel connected to the static system.",
    solution: "We built a modular identity system with a tighter symbol architecture, a clearer color hierarchy, and a motion grammar that translated naturally from brand mark to campaign rollouts.",
    services: ["Brand audit", "Identity system", "Motion direction", "Guideline design"],
    deliverables: ["Logo suite", "Typography rules", "Social templates", "Brand guideline deck", "Launch motion kit"],
    metrics: [
      { label: "Timeline", value: "8 weeks" },
      { label: "Assets Delivered", value: "34" },
      { label: "Launch Uplift", value: "+28%" },
    ],
    items: GUARDIAN_DETAIL_ITEMS.length > 0 ? GUARDIAN_DETAIL_ITEMS : [
      { id: 1, type: "image", title: "guardian_image", desc: "Core symbol design", url: guardianDetailImageAt(0, guardianImageUrl), span: "md:col-span-2 md:row-span-4" },
      { id: 2, type: "video", title: "Motion Logo", desc: "Animated brand identity", url: "https://cdn.pixabay.com/video/2024/07/24/222837_large.mp4", span: "md:col-span-2 md:row-span-3" },
      { id: 3, type: "image", title: "Color Palette", desc: "Visual harmony", url: guardianDetailImageAt(1, "https://picsum.photos/400/400?random=2"), span: "md:col-span-1 md:row-span-2" },
      { id: 4, type: "image", title: "Typography", desc: "Custom font systems", url: guardianDetailImageAt(2, "https://picsum.photos/600/800?random=4"), span: "md:col-span-1 md:row-span-3" },
      { id: 5, type: "image", title: "Stationery", desc: "Physical brand touchpoints", url: guardianDetailImageAt(3, "https://picsum.photos/800/600?random=5"), span: "md:col-span-2 md:row-span-2" },
      { id: 6, type: "video", title: "Brand Film", desc: "Visual storytelling", url: "https://cdn.pixabay.com/video/2020/07/30/46026-447087782_large.mp4", span: "md:col-span-1 md:row-span-3" },
      { id: 7, type: "image", title: "Iconography", desc: "Systematic icon set", url: guardianDetailImageAt(4, "https://picsum.photos/400/400?random=7"), span: "md:col-span-1 md:row-span-2" },
      { id: 8, type: "image", title: "Digital Guidelines", desc: "Web & Mobile standards", url: guardianDetailImageAt(5, "https://picsum.photos/800/400?random=8"), span: "md:col-span-2 md:row-span-2" },
      { id: 9, type: "image", title: "Photography Style", desc: "Art direction for imagery", url: guardianDetailImageAt(6, "https://picsum.photos/600/600?random=9"), span: "md:col-span-1 md:row-span-2" },
    ]
  },
  "2": {
    title: "Luma",
    subtitle: "UX/UI Project",
    desc: "Luma transforms complex board games into accessible, step-by-step learning experiences while connecting users to real-world play.",
    category: "EdTech/Community Platform",
    year: "2024",
    client: "School Project",
    role: "UX/UI designer",
    proposalUrl: "/proposals/Luma%20Proposal.pdf",
    overview: "Luma addresses a common barrier in board gaming: complexity. Dense rulebooks, fragmented platforms, and fear of slowing others down prevent many users from engaging. We restructured the UX to reduce cognitive load-breaking down learning into interactive steps, simplifying navigation, and unifying events, tutorials, and game data into one system. This creates a more approachable and confidence-building experience for both new and returning players.",
    challenge: "The company had a solid retail footprint, but messaging was too broad and lacked a distinct strategic angle for new market segments.",
    solution: "We developed a clearer brand architecture, a sharper messaging ladder, and a launch narrative that aligned packaging, campaign copy, and investor-facing communication.",
    services: ["Research synthesis", "Positioning", "Messaging architecture", "Workshop facilitation"],
    deliverables: ["Strategy deck", "Audience map", "Messaging framework", "Campaign narrative"],
    metrics: [
      { label: "Workshops", value: "5" },
      { label: "Core Audiences", value: "3" },
      { label: "Retail Expansion", value: "12 markets" },
    ],
    items: LUMA_DETAIL_ITEMS.length > 0 ? LUMA_DETAIL_ITEMS : [
      { id: 1, type: "image", title: "luma_image", desc: "Strategic planning", url: lumaDetailImageAt(0, lumaImageUrl), span: "md:col-span-4 md:row-span-4" },
      { id: 2, type: "image", title: "Audience Mapping", desc: "Segment definition", url: lumaDetailImageAt(1, "https://picsum.photos/900/700?random=32"), span: "md:col-span-2 md:row-span-3" },
      { id: 3, type: "video", title: "Workshop Reel", desc: "Collaborative sprint moments", url: "https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4", span: "md:col-span-2 md:row-span-3" },
      { id: 4, type: "image", title: "Narrative Framework", desc: "Message system", url: lumaDetailImageAt(2, "https://picsum.photos/800/800?random=33"), span: "md:col-span-2 md:row-span-2" },
    ]
  },
  "3": {
    title: "Amore Pet Food",
    subtitle: "UX/UI Project",
    desc: "Designing interfaces that feel editorial, intuitive, and commercially sharp.",
    category: "E-commerce Website",
    year: "2026",
    client: "School Project",
    role: "UX/UI Designer",
    proposalUrl: "/proposals/Amore%20Pet%20Food.pdf",
    overview: "Amore Pet Food is a local, health-focused brand offering simple, high-quality nutrition for pets. Despite strong product value, the website suffered from high bounce rates and low conversion due to unclear structure and overwhelming visual noise. We redesigned the entire user experience-simplifying navigation, clarifying product information, and creating a clean, trustworthy interface. The result is a more intuitive journey that builds confidence and guides users naturally toward purchase.",
    challenge: "The previous interface had high bounce on landing pages and weak product storytelling, especially on mobile.",
    solution: "We redesigned the browsing and checkout flow around faster scanning, denser product narratives, and a more intentional motion system to support discovery.",
    services: ["UX audit", "Wireframing", "UI design", "Prototype direction"],
    deliverables: ["Design system", "Homepage redesign", "PDP templates", "Checkout flow", "Interaction specs"],
    metrics: [
      { label: "Conversion Lift", value: "+19%" },
      { label: "Bounce Reduction", value: "-24%" },
      { label: "Screens Designed", value: "42" },
    ],
    items: AMORE_DETAIL_ITEMS.length > 0 ? AMORE_DETAIL_ITEMS : [
      { id: 1, type: "image", title: "amore_image", desc: "Hero and collection storytelling", url: amoreDetailImageAt(0, amoreImageUrl), span: "md:col-span-2 md:row-span-4" },
      { id: 2, type: "video", title: "Interaction Prototype", desc: "Navigation and scroll behavior", url: "https://cdn.pixabay.com/video/2024/07/24/222837_large.mp4", span: "md:col-span-2 md:row-span-3" },
      { id: 3, type: "image", title: "Product Grid", desc: "Faster browsing patterns", url: amoreDetailImageAt(1, "https://picsum.photos/800/800?random=42"), span: "md:col-span-1 md:row-span-2" },
      { id: 4, type: "image", title: "Checkout Flow", desc: "Reduced friction purchase path", url: amoreDetailImageAt(2, "https://picsum.photos/900/1100?random=43"), span: "md:col-span-1 md:row-span-3" },
      { id: 5, type: "image", title: "Mobile Details", desc: "Responsive interface states", url: amoreDetailImageAt(3, "https://picsum.photos/900/700?random=44"), span: "md:col-span-2 md:row-span-2" },
    ],
  },
  "4": {
    title: "PropEase",
    subtitle: "UX/UI Project",
    desc: "ProEase is a property management platform designed to simplify and unify the entire rental lifecycle.",
    category: "B2B Management App",
    year: "2024",
    client: "School Project",
    role: "UX/UI Designer",
    proposalUrl: "/proposals/PropEase_Proposal.pdf",
    overview: "Managing a property often means navigating disconnected tools, manual processes, and constant back-and-forth communication. ProEase transforms this experience by bringing the entire rental lifecycle into one cohesive platform. We designed the UX/UI to streamline every stage-listing, tenant management, payments, and maintenance-through clear structure and intuitive flows. By reducing friction and increasing visibility, ProEase enables users to manage properties with confidence and ease.",
    challenge: "The client had strong static visuals but inconsistent animation styles across channels, making the brand feel fragmented in motion.",
    solution: "We established a timing system, transition vocabulary, and reusable motion scenes that scaled from teaser clips to full campaign films.",
    services: ["Motion concepting", "Storyboarding", "Animation system", "Template creation"],
    deliverables: ["Launch trailer", "Social loops", "Motion guidelines", "Edit-ready templates"],
    metrics: [
      { label: "Motion Templates", value: "18" },
      { label: "Campaign Views", value: "1.2M" },
      { label: "Turnaround", value: "6 weeks" },
    ],
    items: PROPEASE_DETAIL_ITEMS.length > 0 ? PROPEASE_DETAIL_ITEMS : [
      { id: 1, type: "image", title: "propease_image", desc: "Main campaign sequence", url: propeaseDetailImageAt(0, propeaseImageUrl), span: "md:col-span-2 md:row-span-4" },
      { id: 2, type: "image", title: "Storyboard Frames", desc: "Visual pacing and composition", url: propeaseDetailImageAt(1, "https://picsum.photos/1100/900?random=51"), span: "md:col-span-2 md:row-span-3" },
      { id: 3, type: "video", title: "Loop Variations", desc: "Short-form social cuts", url: "https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4", span: "md:col-span-1 md:row-span-2" },
      { id: 4, type: "image", title: "Motion Grid", desc: "Transition language", url: propeaseDetailImageAt(2, "https://picsum.photos/800/1000?random=52"), span: "md:col-span-1 md:row-span-3" },
      { id: 5, type: "image", title: "Title Frames", desc: "Typography in motion", url: propeaseDetailImageAt(3, "https://picsum.photos/900/700?random=53"), span: "md:col-span-2 md:row-span-2" },
    ],
  },
  "5": {
    title: "Other",
    subtitle: "Creative Portfolio",
    desc: "Illustration, 3D modeling and rendering, graphic design, and interior design.\n\nTools used: Adobe Illustrator, Adobe InDesign, Adobe Photoshop, ZBrush, Autodesk 3ds Max, Autodesk AutoCAD, Corona Renderer, V-Ray Renderer, and CorelDRAW.",
    category: "Packaging Systems",
    year: "2025",
    client: "Field Notes Lab",
    role: "Multidisciplinary Designer",
    proposalUrl: "/proposals/other-proposal.pdf",
    overview: "A packaging redesign for a premium goods line that needed stronger shelf recognition and a more unified extension system across SKUs.",
    challenge: "Each package variant had evolved independently, resulting in inconsistent labeling, color coding, and hierarchy.",
    solution: "We built a packaging grid with scalable label logic, tactile finishes, and a cleaner front-of-pack structure that balanced clarity with premium restraint.",
    services: ["Packaging audit", "SKU system", "Material direction", "Production-ready artworking"],
    deliverables: ["Primary pack design", "Variant system", "Print specifications", "Retail mockups"],
    metrics: [
      { label: "SKU Range", value: "16 variants" },
      { label: "Retail Readability", value: "+31%" },
      { label: "Production Cycles", value: "2 rounds" },
    ],
    items: OTHER_DETAIL_ITEMS.length > 0 ? OTHER_DETAIL_ITEMS : [
      { id: 1, type: "image", title: "other_image", desc: "Hero pack design", url: otherDetailImageAt(0, otherImageUrl), span: "md:col-span-2 md:row-span-4" },
      { id: 2, type: "image", title: "Variant System", desc: "Color and taxonomy structure", url: otherDetailImageAt(1, "https://picsum.photos/1200/900?random=62"), span: "md:col-span-2 md:row-span-3" },
      { id: 3, type: "video", title: "Shelf Mockup", desc: "Pack behavior in context", url: "https://cdn.pixabay.com/video/2024/07/24/222837_large.mp4", span: "md:col-span-1 md:row-span-2" },
      { id: 4, type: "image", title: "Material Study", desc: "Finish and substrate options", url: otherDetailImageAt(2, "https://picsum.photos/800/1000?random=63"), span: "md:col-span-1 md:row-span-3" },
      { id: 5, type: "image", title: "Retail Composition", desc: "Shelf-block consistency", url: otherDetailImageAt(3, "https://picsum.photos/900/700?random=64"), span: "md:col-span-2 md:row-span-2" },
    ],
  },
};

const cardData: Array<CardData & { path: string }> = [
  {
    id: "1",
    title: "Morphé Design Studio",
    description: "Get to know us",
    icon: <img src={HOME_ICON.morphe} alt="Morphé" className="h-full w-full object-contain" />,
    iconFill: true,
    path: "/about",
  },
  {
    id: "2",
    title: "Projects",
    description: "Check out our projects",
    icon: <img src={HOME_ICON.projects} alt="Projects" className="h-full w-full object-contain" />,
    iconFill: true,
    path: "/projects",
  },
  {
    id: "3",
    title: "Design Approach",
    description: "Learn more about our design systems",
    icon: <img src={HOME_ICON.designApproach} alt="Design approach" className="h-full w-full object-contain" />,
    iconFill: true,
    path: "/approach",
  },
  {
    id: "4",
    title: "Contact",
    description: "Reach out to us",
    icon: <img src={HOME_ICON.contact} alt="Contact" className="h-full w-full object-contain" />,
    iconFill: true,
    path: "/contact",
  },
];

function Home() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);

  const closeIntro = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    if (!showIntro || !introVideoRef.current) return;
    const video = introVideoRef.current;
    video.play().catch(() => {
      // If autoplay is blocked or source fails, don't trap user behind overlay.
      setTimeout(() => {
        setShowIntro(false);
      }, 1200);
    });
  }, [showIntro]);

  useEffect(() => {
    if (!showIntro) return;
    const fallbackTimeout = window.setTimeout(() => {
      if (!videoReady) setShowIntro(false);
    }, 2500);
    return () => window.clearTimeout(fallbackTimeout);
  }, [showIntro, videoReady]);

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden p-4"
      style={{
        // Home-only theme overrides
        // Brand dark: #232731 (hsl(225, 16%, 17%))
        ["--foreground" as any]: "225 16% 17%",
        ["--card-foreground" as any]: "225 16% 17%",
        ["--secondary-foreground" as any]: "225 16% 17%",
        ["--muted-foreground" as any]: "225 16% 17%",
        ["--primary" as any]: "225 16% 17%",
        ["--ring" as any]: "225 16% 17%",
      }}
    >
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-700" />
      <div className="w-full max-w-md relative z-10">
        <MorphingCardStack cards={cardData} onCardClick={(card) => navigate(card.path as string)} />
      </div>
      {showIntro && (
        <div
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
          onClick={() => {
            introVideoRef.current?.play().catch(() => {});
          }}
        >
          <video
            ref={introVideoRef}
            className="w-full h-full object-contain"
            src={logoVideoUrl}
            autoPlay
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setVideoReady(true)}
            onError={() => setShowIntro(false)}
            onEnded={closeIntro}
          />
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              closeIntro();
            }}
            className="absolute top-6 right-6 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 transition-colors"
          >
            Skip
          </button>
        </div>
      )}
    </main>
  );
}

const ProjectDetail = () => {
  const { id } = useParams();
  const project = PROJECT_DETAILS[id || "1"] || PROJECT_DETAILS["1"];
  const isLightDetail = true;
  const isOtherProject = (id || "1") === "5";

  return (
    <>
      <InteractiveBentoGallery title={project.title} description={project.desc} mediaItems={project.items} lightTheme={isLightDetail} />
      {isOtherProject && <div className="bg-white h-48 md:h-64" />}
      {!isOtherProject && (
        <>
          <div className={`relative z-10 px-4 pb-40 pt-10 ${isLightDetail ? "bg-white text-[#232731]" : "bg-black text-white"}`}>
            <div className="mx-auto flex max-w-6xl justify-center">
              <WavePath className={isLightDetail ? "text-[#232731]/20" : "text-white/20"} />
            </div>
          </div>
          <section className={`relative z-0 px-4 pb-24 pt-6 ${isLightDetail ? "bg-white text-[#232731]" : "bg-black text-white"}`}>
            <div className={`mx-auto max-w-6xl rounded-[2rem] p-6 backdrop-blur-sm md:p-10 ${isLightDetail ? "border border-[#232731]/10 bg-[#f6f7f9] shadow-[0_10px_28px_rgba(35,39,49,0.08)]" : "border border-white/10 bg-white/[0.03] shadow-[0_40px_120px_rgba(0,0,0,0.28)]"}`}>
              <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{project.title}</h2>
                  <p className="text-sm uppercase tracking-[0.24em] text-[#232731]/55">{project.subtitle}</p>
                  <p className="max-w-3xl text-base leading-8 text-[#232731]/75 md:text-lg">{project.overview}</p>
                </div>

                <aside className="space-y-5">
                  <div className="rounded-3xl border border-[#232731]/12 bg-white p-6">
                    <h3 className="text-sm uppercase tracking-[0.22em] text-[#232731]/50">Project Snapshot</h3>
                    <div className="mt-6 grid gap-4">
                      <div className="flex items-center justify-between border-b border-[#232731]/10 pb-3 text-sm">
                        <span className="text-[#232731]/55">Client</span>
                        <span className="font-medium text-[#232731]/90">{project.client}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-[#232731]/10 pb-3 text-sm">
                        <span className="text-[#232731]/55">Category</span>
                        <span className="font-medium text-[#232731]/90">{project.category}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-[#232731]/10 pb-3 text-sm">
                        <span className="text-[#232731]/55">Year</span>
                        <span className="font-medium text-[#232731]/90">{project.year}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#232731]/55">Role</span>
                        <span className="font-medium text-[#232731]/90">{project.role}</span>
                      </div>
                    </div>
                    <a
                      href={project.proposalUrl}
                      download
                      className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#232731] px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Download Proposal
                    </a>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

const About = () => (
  <section className="min-h-screen bg-white px-8 py-20 text-[#232731] md:px-16 lg:px-24">
    <div className="mx-auto max-w-2xl flex flex-col gap-20 md:gap-24">
      <img src={morpheLogoBigUrl} alt="Morphé logo" className="mx-auto w-full max-w-md" />
      <p className="text-lg leading-relaxed text-[#232731]/80 md:text-xl">
        Morphé is a multidisciplinary design studio where ideas take form through clarity, function, and craft.
        <br />
        <br />
        We bring together designers, developers, and marketers to create cohesive digital experiences from concept to execution. By working across disciplines, we eliminate gaps between strategy, design, and technology, ensuring every detail serves a purpose.
        <br />
        <br />
        Our approach is simple: design should be intuitive, adaptable, and meaningful. Whether we are building a product, shaping a brand, or refining an experience, we focus on solutions that are not only visually compelling, but also functional and scalable.
        <br />
        <br />
        At Morphé, we don’t just design outcomes, we design systems that evolve.
      </p>
    </div>
  </section>
);
const Projects = () => <LandingAccordionItem />;
const Approach = () => (
  <div className="h-screen overflow-y-auto bg-white text-[#232731] scroll-smooth">
    <AnimatedHeroSection />
    <section className="p-20 max-w-4xl mx-auto space-y-12">
      <h2 className="text-4xl font-bold tracking-tight">We design systems, not fixed interfaces.</h2>
      <p className="text-xl text-[#232731]/70 leading-relaxed">
        Every element is built from modular blocks that can be assembled, reduced, or reconfigured depending on context.
        <br />
        We keep things minimal to reduce cognitive load, functional to maintain clarity, and playful to create engagement. Nothing is decorative without purpose, and nothing is rigid without reason.
        <br />
        <br />
        We design to adapt.
        <br />
        We design to evolve.
        <br />
        We design for change.
        <br />
        <br />
        Because a good interface doesn’t just work once, it continues to work as everything else shifts around it.
      </p>
    </section>
  </div>
);

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      emailjs.init("7JRzB45E6b3PJWD0O");
      await emailjs.send("service_7ium8ro", "template_8so4ayd", { name: formData.name, email: formData.email, message: formData.message });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus('error');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-6 bg-white text-[#232731]">
      <DottedSurface theme="light" dotColor="#232731" className="opacity-70" />
      <button onClick={() => navigate("/")} className="fixed top-8 left-8 z-50 flex items-center gap-2 text-[#232731]/60 hover:text-[#232731] transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </button>
      <div className="w-full max-w-lg relative z-10 bg-white/70 backdrop-blur-xl border border-black/10 p-8 rounded-3xl shadow-2xl space-y-8">
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-green-400" />
            <h3 className="text-2xl font-semibold">Message Sent!</h3>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2"><label className="text-sm font-medium text-[#232731]/70">Name</label><input type="text" name="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required className="w-full bg-white/60 border border-black/10 rounded-xl px-4 py-3 text-[#232731] placeholder:text-[#232731]/40" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-[#232731]/70">Email</label><input type="email" name="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} required className="w-full bg-white/60 border border-black/10 rounded-xl px-4 py-3 text-[#232731] placeholder:text-[#232731]/40" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-[#232731]/70">Message</label><textarea name="message" value={formData.message} onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))} rows={4} required className="w-full bg-white/60 border border-black/10 rounded-xl px-4 py-3 text-[#232731] placeholder:text-[#232731]/40" /></div>
            <button type="submit" disabled={status === 'sending'} className="w-full bg-[#232731] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2">{status === 'sending' ? 'Sending...' : 'Send Message'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/approach" element={<Approach />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
