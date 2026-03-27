import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import guardianImageUrl from '../../images/guardian_image.png';
import lumaImageUrl from '../../images/luma_image.png';
import propeaseImageUrl from '../../images/propease_image.jpg';
import amoreImageUrl from '../../images/amore_image.png';
import otherImageUrl from '../../images/other_image.png';

// --- Data for the image accordion ---
const accordionItems = [
  {
    id: 1,
    title: 'Guardian',
    imageUrl: guardianImageUrl,
  },
  {
    id: 2,
    title: 'Luma',
    imageUrl: lumaImageUrl,
  },
  {
    id: 3,
    title: 'Amore Pet Food',
    imageUrl: amoreImageUrl,
  },
  {
    id: 4,
    title: 'PropEase',
    imageUrl: propeaseImageUrl,
  },
  {
    id: 5,
    title: 'Other',
    imageUrl: otherImageUrl,
  },
];

interface AccordionItemProps {
  item: typeof accordionItems[0];
  isActive: boolean;
  onMouseEnter: () => void;
}

// --- Accordion Item Component ---
const AccordionItem = ({ item, isActive, onMouseEnter, onClick }: AccordionItemProps & { onClick?: () => void }) => {
  return (
    <div
      className={`
        relative h-[450px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out border border-black/10
        ${isActive ? 'w-[400px]' : 'w-[60px]'}
      `}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
      />
      {/* Subtle dark overlay so the images remain visible */}
      {/* No tint overlay (ensures images are visible) */}
      <div className="absolute inset-0 bg-black/0 transition-opacity duration-700"></div>

      {/* Caption Text */}
      <span
        className={`
          absolute text-white font-bold whitespace-nowrap text-xl md:text-2xl drop-shadow-md
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0 opacity-100'
              : 'bottom-24 left-1/2 -translate-x-1/2 rotate-90 opacity-100'
          }
        `}
      >
        {item.title}
      </span>
    </div>
  );
};


// --- Main Component ---
export function LandingAccordionItem() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleItemHover = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans relative flex items-center overflow-hidden">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/")}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-black/50 hover:text-black transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/3 text-center lg:text-left space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter text-[#232731]">
              Explore Our Projects
            </h1>
            <p className="text-xl text-black/50 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Each one designed to solve real problems through clarity, function, and thoughtful execution.
            </p>
          </div>

          {/* Right Side: Image Accordion */}
          <div className="w-full lg:w-2/3">
            <div className="flex flex-row items-center justify-center gap-4 p-4 overflow-x-auto no-scrollbar">
              {accordionItems.map((item, index) => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => handleItemHover(index)}
                  onClick={() => navigate(`/projects/${item.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
