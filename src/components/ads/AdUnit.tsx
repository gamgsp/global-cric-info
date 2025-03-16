
import { useState, useEffect } from "react";
import { AdPlacement, AdSize, getAdTag } from "@/config/ad-config";

interface AdUnitProps {
  placementId: string;
  className?: string;
  sizes?: string[];
}

export function AdUnit({ placementId, className = "", sizes }: AdUnitProps) {
  const [adTag, setAdTag] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    try {
      // Get the ad tag for this placement
      const tag = getAdTag(placementId);
      setAdTag(tag);
      
      // Simulate ad loading (replace with actual ad loading logic)
      const timeout = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      
      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Error loading ad:", error);
      setIsError(true);
    }
  }, [placementId]);

  // Choose a random size from available sizes if not specified
  const getAdSize = () => {
    if (!sizes || sizes.length === 0) {
      return { width: 300, height: 250 }; // Default size
    }
    
    const randomIndex = Math.floor(Math.random() * sizes.length);
    const sizeId = sizes[randomIndex];
    
    // Map to width and height (this is simplistic, you would integrate with your ad system)
    switch (sizeId) {
      case 'leaderboard':
        return { width: 728, height: 90 };
      case 'billboard':
        return { width: 970, height: 250 };
      case 'half-page':
        return { width: 300, height: 600 };
      case 'large-rectangle':
        return { width: 336, height: 280 };
      default:
        return { width: 300, height: 250 }; // Medium rectangle as default
    }
  };

  const { width, height } = getAdSize();

  // For demonstration purposes, we're showing a placeholder
  return (
    <div 
      className={`ad-container relative ${className} transition-all duration-300`}
      style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
    >
      {isError ? (
        <div className="text-sm text-gray-500">Ad could not be loaded</div>
      ) : !isLoaded ? (
        <div className="animate-pulse w-full h-full bg-gray-200 dark:bg-gray-800 rounded-md"></div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
          Ad Space ({width}x{height})
          <div dangerouslySetInnerHTML={{ __html: adTag }} />
        </div>
      )}
      <div className="absolute top-1 right-1 text-[10px] text-gray-400">Ad</div>
    </div>
  );
}

export default AdUnit;
