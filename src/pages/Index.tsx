
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { fetchRssFeed } from "@/utils/rss-parser";
import rssFeeds from "@/config/rss-feeds";

// Import components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedNews from "@/components/home/FeaturedNews";
import LatestNews from "@/components/home/LatestNews";
import TrendingSection from "@/components/home/TrendingSection";
import CategoryNews from "@/components/home/CategoryNews";
import AdUnit from "@/components/ads/AdUnit";

// Define the main component
const Index = () => {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fetch RSS feeds on component mount
  useEffect(() => {
    const fetchFeeds = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        // Fetch from all configured RSS feeds
        const allPromises = rssFeeds.map(feed => 
          fetchRssFeed(feed.url, { 
            sourceId: feed.id, 
            sourceName: feed.name 
          })
        );
        
        const results = await Promise.all(allPromises);
        
        // Combine all items from all feeds
        const allItems = results
          .filter(Boolean) // Remove null results
          .flatMap(result => result?.items || []);
        
        if (allItems.length === 0) {
          setHasError(true);
          toast({
            title: "No news content available",
            description: "We couldn't load any news content. Using fallback data.",
            variant: "destructive"
          });
        }
        
        // Sort by publication date (newest first)
        const sortedItems = allItems.sort((a, b) => {
          const dateA = new Date(a.pubDate).getTime();
          const dateB = new Date(b.pubDate).getTime();
          return dateB - dateA;
        });
        
        setNewsItems(sortedItems);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching RSS feeds:", error);
        setHasError(true);
        toast({
          title: "Error",
          description: "Failed to load news feeds. Using fallback data.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchFeeds();
    
    // Setup refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchFeeds, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured News */}
        <FeaturedNews items={newsItems} isLoading={isLoading} />
        
        {/* Trending Section */}
        <TrendingSection items={newsItems} isLoading={isLoading} />
        
        {/* Latest News */}
        <LatestNews items={newsItems} isLoading={isLoading} />
        
        {/* Category News Section */}
        <CategoryNews allItems={newsItems} isLoading={isLoading} />
        
        {/* Ad placement before footer */}
        <div className="py-12 flex justify-center">
          <AdUnit placementId="footer" sizes={['leaderboard', 'billboard']} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
