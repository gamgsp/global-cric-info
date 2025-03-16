
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { RssItem } from "@/utils/rss-parser";
import NewsCard from "@/components/news/NewsCard";

interface CategoryNewsProps {
  allItems: RssItem[];
  isLoading: boolean;
}

export function CategoryNews({ allItems, isLoading }: CategoryNewsProps) {
  // Define categories
  const categories = [
    { id: "all", name: "All" },
    { id: "international", name: "International" },
    { id: "t20", name: "T20" },
    { id: "test", name: "Test" },
    { id: "odi", name: "ODI" },
  ];
  
  // Filter items by category
  const filterByCategory = (categoryId: string) => {
    if (categoryId === "all") return allItems.slice(0, 6);
    
    // In a real app, you would use the actual categories from the RSS feed
    // For demo, we'll randomly assign items to categories
    return allItems
      .filter((_, index) => index % categories.length === categories.findIndex(c => c.id === categoryId))
      .slice(0, 6);
  };
  
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

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Browse by Category</h2>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading
                  ? placeholderItems.map((item, index) => (
                      <div key={`${category.id}-loading-${index}`} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <NewsCard item={item} isLoading={true} />
                      </div>
                    ))
                  : filterByCategory(category.id).map((item, index) => (
                      <div key={`${category.id}-${item.id}`} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <NewsCard item={item} isLoading={false} />
                      </div>
                    ))}
              </div>
              
              {/* View more link */}
              <div className="mt-8 text-center">
                <Link
                  to={`/category/${category.id}`}
                  className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
                >
                  View more in {category.name}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default CategoryNews;
