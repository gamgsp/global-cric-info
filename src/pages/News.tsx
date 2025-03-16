
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { fetchRssFeed } from "@/utils/rss-parser";
import rssFeeds from "@/config/rss-feeds";
import { RssItem } from "@/utils/rss-parser";

// Import components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NewsList from "@/components/news/NewsList";
import NewsFilters from "@/components/news/NewsFilters";
import AdUnit from "@/components/ads/AdUnit";
import { Separator } from "@/components/ui/separator";

// Define the News page component
const News = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [newsItems, setNewsItems] = useState<RssItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || "all"
  );
  const [selectedSource, setSelectedSource] = useState<string>(
    searchParams.get("source") || "all"
  );

  // Fetch RSS feeds on component mount
  useEffect(() => {
    const fetchFeeds = async () => {
      setIsLoading(true);
      try {
        // Fetch from all configured RSS feeds
        const allPromises = rssFeeds.map((feed) =>
          fetchRssFeed(feed.url, {
            sourceId: feed.id,
            sourceName: feed.name,
          })
        );

        const results = await Promise.all(allPromises);

        // Combine all items from all feeds
        const allItems = results
          .filter(Boolean) // Remove null results
          .flatMap((result) => result?.items || []);

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
        toast({
          title: "Error",
          description: "Failed to load news feeds. Please try again later.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchFeeds();

    // Setup refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchFeeds, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Filter items based on selected category and source
  const filteredItems = newsItems.filter((item) => {
    // Filter by category
    const categoryMatches =
      selectedCategory === "all" ||
      (item.categories &&
        item.categories.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
        ));

    // Filter by source
    const sourceMatches =
      selectedSource === "all" || item.sourceId === selectedSource;

    return categoryMatches && sourceMatches;
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (selectedSource !== "all") {
      params.set("source", selectedSource);
    }
    setSearchParams(params);
  }, [selectedCategory, selectedSource, setSearchParams]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Cricket News</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar with filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <NewsFilters
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedSource={selectedSource}
                  setSelectedSource={setSelectedSource}
                  feeds={rssFeeds}
                />

                {/* Sidebar ads */}
                <div className="space-y-6 mt-8">
                  <AdUnit placementId="sidebar-top" sizes={["medium-rectangle"]} />
                  <AdUnit
                    placementId="sidebar-bottom"
                    sizes={["medium-rectangle", "half-page"]}
                  />
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3">
              {/* Top ad */}
              <div className="mb-8 flex justify-center">
                <AdUnit
                  placementId="in-content-1"
                  sizes={["leaderboard", "mobile-banner"]}
                  className="w-full max-w-full overflow-hidden"
                />
              </div>

              {/* News list */}
              <NewsList items={filteredItems} isLoading={isLoading} />

              {/* Bottom ad */}
              <div className="mt-12 flex justify-center">
                <AdUnit
                  placementId="in-content-2"
                  sizes={["leaderboard", "mobile-banner"]}
                  className="w-full max-w-full overflow-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default News;
