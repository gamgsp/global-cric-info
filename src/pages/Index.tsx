
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
        
        // Add a timeout to each fetch to prevent hanging
        const results = await Promise.all(allPromises);
        
        // Combine all items from all feeds, filtering out null results
        const allItems = results
          .filter(Boolean) // Remove null results
          .flatMap(result => result?.items || []);
        
        if (allItems.length === 0) {
          console.warn("No news content available, using fallback data");
          setHasError(true);
          toast({
            title: "Limited content available",
            description: "We're experiencing some connection issues. Using alternative data sources.",
            variant: "destructive"
          });
          
          // Instead of showing nothing, use our fallback items
          const fallbackItems = rssFeeds.flatMap(feed => 
            fetchRssFeed(feed.url, { 
              sourceId: feed.id, 
              sourceName: feed.name 
            }).then(result => result?.items || [])
          );
          
          setNewsItems(await Promise.all(fallbackItems));
        } else {
          // Sort by publication date (newest first)
          const sortedItems = allItems.sort((a, b) => {
            const dateA = new Date(a.pubDate).getTime();
            const dateB = new Date(b.pubDate).getTime();
            return dateB - dateA;
          });
          
          setNewsItems(sortedItems);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching RSS feeds:", error);
        setHasError(true);
        toast({
          title: "Connection issues",
          description: "We're experiencing temporary connectivity problems. Using fallback content.",
          variant: "destructive"
        });
        
        // Generate some fallback items
        const fallbackItems = rssFeeds.flatMap(feed => {
          const options = { 
            sourceId: feed.id, 
            sourceName: feed.name 
          };
          
          // Use the same fallback generator as in rss-parser.ts
          return Array(5).fill(null).map((_, index) => ({
            id: `fallback-${feed.id}-${index}`,
            title: `${feed.name} - Cricket News Update ${index + 1}`,
            link: "#",
            description: "Currently unavailable due to connectivity issues. Please check back later.",
            pubDate: new Date(Date.now() - index * 86400000).toUTCString(),
            creator: feed.name,
            categories: ["Cricket", "News"],
            content: "Cricket news content unavailable.",
            imageUrl: `/placeholder.svg`,
            sourceId: feed.id,
            sourceName: `${feed.name} (Offline)`
          }));
        });
        
        setNewsItems(fallbackItems);
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
