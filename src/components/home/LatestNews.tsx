
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RssItem } from "@/utils/rss-parser";
import NewsCard from "@/components/news/NewsCard";
import AdUnit from "@/components/ads/AdUnit";

interface LatestNewsProps {
  items: RssItem[];
  isLoading: boolean;
}

export function LatestNews({ items, isLoading }: LatestNewsProps) {
  // Create placeholder items for loading state
  const placeholderItems = Array(6).fill(null).map((_, i) => ({
    id: `placeholder-${i}`,
    title: "",
    link: "",
    description: "",
    pubDate: "",
    sourceId: "",
    sourceName: ""
  }) as RssItem);

  const displayItems = isLoading ? placeholderItems : items.slice(0, 6);

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Latest News</h2>
          <Link 
            to="/news" 
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center"
          >
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item, index) => (
            <div 
              key={item.id} 
              className="animate-fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <NewsCard item={item} isLoading={isLoading} />
            </div>
          ))}
        </div>
        
        {/* Ad placement */}
        <div className="mt-12 flex justify-center">
          <AdUnit placementId="in-content-1" sizes={['leaderboard']} />
        </div>
      </div>
    </section>
  );
}

export default LatestNews;
