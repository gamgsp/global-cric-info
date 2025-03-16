
import { useState, useEffect, useRef } from "react";
import { 
  AdPlacement, 
  AdSize, 
  getAdTag, 
  getRecommendedSizes, 
  getAdSizeDimensions 
} from "@/config/ad-config";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface AdUnitProps {
  placementId: string;
  className?: string;
  sizes?: string[];
  responsive?: boolean;
  sticky?: boolean;
}

export function AdUnit({ 
  placementId, 
  className = "", 
  sizes: propSizes, 
  responsive = true,
  sticky = false
}: AdUnitProps) {
  const [adTag, setAdTag] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [adSize, setAdSize] = useState<{ width: number, height: number }>({ width: 300, height: 250 });
  const { toast } = useToast();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Get the ad tag for this placement
      const tag = getAdTag(placementId);
      setAdTag(tag);
      
      // Choose the appropriate size
      const sizes = propSizes || getRecommendedSizes(placementId);
      
      // For responsive ads, choose size based on viewport width
      if (responsive) {
        const handleResize = () => {
          const viewportWidth = window.innerWidth;
          let selectedSizeId: string;
          
          if (viewportWidth < 768) {
            // Mobile: prefer mobile banner or medium rectangle
            selectedSizeId = sizes.find(s => s.includes('mobile')) || 'medium-rectangle';
          } else if (viewportWidth < 1024) {
            // Tablet: prefer medium rectangle or leaderboard
            selectedSizeId = sizes.find(s => s === 'medium-rectangle' || s === 'leaderboard') || sizes[0];
          } else {
            // Desktop: prefer largest available size
            selectedSizeId = sizes.find(s => s === 'billboard' || s === 'leaderboard') || 
                             sizes.find(s => s === 'half-page') || 
                             sizes[0];
          }
          
          setAdSize(getAdSizeDimensions(selectedSizeId));
        };
        
        handleResize(); // Initialize size
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      } else {
        // Not responsive, just pick a random size from available sizes
        const randomIndex = Math.floor(Math.random() * sizes.length);
        const sizeId = sizes[randomIndex];
        setAdSize(getAdSizeDimensions(sizeId));
      }
      
      // Simulate ad loading (replace with actual ad loading logic)
      const timeout = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      
      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Error loading ad:", error);
      setIsError(true);
      toast({
        title: "Ad Error",
        description: "There was a problem loading the advertisement.",
        variant: "destructive"
      });
    }
  }, [placementId, propSizes, responsive, toast]);

  // Intersection Observer for lazy loading ads
  useEffect(() => {
    if (!adRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoaded) {
          // Load ad when it becomes visible
          setIsLoaded(true);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(adRef.current);
    
    return () => {
      if (adRef.current) {
        observer.unobserve(adRef.current);
      }
    };
  }, [adRef, isLoaded]);

  const containerClasses = cn(
    "ad-container relative bg-background/5 rounded transition-all duration-300",
    {
      "animate-pulse": !isLoaded,
      "fixed bottom-0 left-0 right-0 z-50": sticky,
      "mx-auto": !sticky
    },
    className
  );

  return (
    <div 
      ref={adRef}
      className={containerClasses}
      style={{ 
        width: responsive ? '100%' : `${adSize.width}px`, 
        height: `${adSize.height}px`,
        maxWidth: '100%'
      }}
    >
      {isError ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          Ad could not be loaded
        </div>
      ) : !isLoaded ? (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center">
          <div className="text-xs text-gray-500 animate-pulse">Loading Ad...</div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
          Ad Space ({adSize.width}x{adSize.height})
          <div dangerouslySetInnerHTML={{ __html: adTag }} />
        </div>
      )}
      <div className="absolute top-1 right-1 text-[10px] text-gray-400 bg-background/80 px-1 rounded">Ad</div>
    </div>
  );
}

export default AdUnit;
