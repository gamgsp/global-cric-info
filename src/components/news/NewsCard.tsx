
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { RssItem, formatPubDate, getExcerpt } from "@/utils/rss-parser";

interface NewsCardProps {
  item: RssItem;
  isLoading?: boolean;
  isFeature?: boolean;
}

export function NewsCard({ item, isLoading = false, isFeature = false }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);
  
  if (isLoading) {
    return (
      <Card className="news-card animate-pulse overflow-hidden">
        <div className="h-48 bg-gray-200 dark:bg-gray-800 w-full"></div>
        <CardHeader className="pb-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
        </CardFooter>
      </Card>
    );
  }

  // Safely handle potentially undefined item properties
  const safeItem = {
    ...item,
    title: item.title || 'No Title',
    description: item.description || 'No description available.',
    categories: item.categories || [],
    link: item.link || '#',
    imageUrl: item.imageUrl || '/placeholder.svg',
    pubDate: item.pubDate || new Date().toUTCString(),
    sourceName: item.sourceName || 'Unknown Source'
  };

  const renderCategoryTag = () => {
    if (!safeItem.categories || safeItem.categories.length === 0) return null;
    
    return (
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          {safeItem.categories[0]}
        </div>
      </div>
    );
  };

  const excerpt = getExcerpt(safeItem.description, isFeature ? 180 : 120);
  
  return (
    <Card className={`news-card news-card-hover group ${isFeature ? 'md:flex' : ''} h-full`}>
      {renderCategoryTag()}
      
      {/* Conditionally render the image only if it exists and hasn't errored */}
      {safeItem.imageUrl && !imageError ? (
        <div 
          className={`relative overflow-hidden ${isFeature ? 'md:w-2/5 h-56 md:h-auto' : 'h-48'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-0"></div>
          <img 
            src={safeItem.imageUrl} 
            alt={safeItem.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div 
          className={`relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-700 ${
            isFeature ? 'md:w-2/5 h-56 md:h-auto' : 'h-48'
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/lovable-uploads/71a86eef-5979-40e7-b83d-94104f319e76.png" 
              alt="Global Cric Info" 
              className="w-16 h-16 opacity-50"
            />
          </div>
        </div>
      )}
      
      <div className={`flex flex-col ${isFeature ? 'md:w-3/5' : ''}`}>
        <CardHeader className="pb-2">
          <a 
            href={safeItem.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-bold hover:text-primary transition-colors duration-300 line-clamp-2"
          >
            {safeItem.title}
          </a>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {excerpt}
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center text-xs text-muted-foreground pt-2">
          <div className="flex items-center space-x-1">
            <span>{formatPubDate(safeItem.pubDate)}</span>
          </div>
          <div className="text-xs font-medium px-2 py-1 rounded-full bg-secondary">
            {safeItem.sourceName}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

export default NewsCard;
