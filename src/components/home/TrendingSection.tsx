
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { RssItem, formatPubDate } from "@/utils/rss-parser";

interface TrendingSectionProps {
  items: RssItem[];
  isLoading: boolean;
}

export function TrendingSection({ items, isLoading }: TrendingSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Create placeholder items for loading state
  const placeholderItems = Array(5).fill(null).map((_, i) => ({
    id: `placeholder-${i}`,
    title: "",
    link: "",
    description: "",
    pubDate: "",
    sourceId: "",
    sourceName: ""
  }) as RssItem);

  const displayItems = isLoading ? placeholderItems : items.slice(0, 5);

  // Handle horizontal scroll with buttons
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = direction === 'left' ? -320 : 320;
    scrollContainerRef.current.scrollBy({ 
      left: scrollAmount, 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="py-12 overflow-hidden bg-cricket-navy text-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Trending Stories</h2>
          
          {/* Scroll controls */}
          <div className="flex space-x-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4 space-x-6 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayItems.map((item, index) => (
            <div 
              key={item.id}
              className="flex-shrink-0 w-80 animate-fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {isLoading ? (
                <div className="h-80 rounded-xl overflow-hidden bg-white/10 animate-pulse">
                  <div className="h-48 bg-white/5"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-3/4"></div>
                    <div className="h-4 bg-white/5 rounded w-1/2"></div>
                  </div>
                </div>
              ) : (
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block h-80 rounded-xl overflow-hidden group relative"
                >
                  {/* Background Image or Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cricket-navy via-cricket-navy/80 to-transparent z-10"></div>
                  
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-cricket-blue to-cricket-lightBlue flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/6b9bd336-611b-4538-abc8-ae02d6d58334.png" 
                        alt="Global Cric Info" 
                        className="w-16 h-16 opacity-50"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <div className="text-xs font-medium text-gray-300 mb-2">
                      {formatPubDate(item.pubDate)}
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:underline line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 inline-block">
                      {item.sourceName}
                    </div>
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingSection;
