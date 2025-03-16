
import { toast } from "@/components/ui/use-toast";

export interface RssItem {
  id: string; 
  title: string;
  link: string;
  description: string;
  pubDate: string;
  creator?: string;
  categories?: string[];
  content?: string;
  enclosure?: {
    url: string;
    type: string;
    length?: number;
  };
  imageUrl?: string;
  sourceId: string;
  sourceName: string;
}

export interface ParsedRssFeed {
  title: string;
  description?: string;
  link: string;
  items: RssItem[];
  lastUpdated: Date;
}

export interface FetchOptions {
  sourceId: string;
  sourceName: string;
}

// CORS proxy to bypass CORS issues with RSS feeds
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// This function fetches and parses an RSS feed
export async function fetchRssFeed(url: string, options: FetchOptions): Promise<ParsedRssFeed | null> {
  try {
    // Use a CORS proxy if needed - uncomment if you face CORS issues
    // const proxyUrl = `${CORS_PROXY}${url}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const text = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    
    // Parse the RSS feed
    const channel = xml.querySelector('channel');
    
    if (!channel) {
      throw new Error('Invalid RSS format: channel element not found');
    }

    const feedTitle = channel.querySelector('title')?.textContent || 'Unknown Feed';
    const feedDescription = channel.querySelector('description')?.textContent;
    const feedLink = channel.querySelector('link')?.textContent || '';
    
    const itemElements = Array.from(xml.querySelectorAll('item'));
    
    const items: RssItem[] = itemElements.map((item, index) => {
      // Extract image URL from various possible locations
      let imageUrl = item.querySelector('enclosure[type^="image"]')?.getAttribute('url') || '';
      
      // If no enclosure, try to find image in content or description
      if (!imageUrl) {
        const content = item.querySelector('encoded')?.textContent || 
                        item.querySelector('content\\:encoded')?.textContent || 
                        item.querySelector('content')?.textContent;
        
        if (content) {
          const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch && imgMatch[1]) {
            imageUrl = imgMatch[1];
          }
        }
      }
      
      // Try to get image from media:content
      if (!imageUrl) {
        const mediaContent = item.querySelector('media\\:content[type^="image"]');
        if (mediaContent) {
          imageUrl = mediaContent.getAttribute('url') || '';
        }
      }
      
      // Generate a unique ID for each item
      const id = item.querySelector('guid')?.textContent || 
                 `${options.sourceId}-${index}-${Date.now()}`;
                
      return {
        id,
        title: item.querySelector('title')?.textContent || 'No Title',
        link: item.querySelector('link')?.textContent || '',
        description: item.querySelector('description')?.textContent || '',
        pubDate: item.querySelector('pubDate')?.textContent || '',
        creator: item.querySelector('dc\\:creator')?.textContent || 
                item.querySelector('creator')?.textContent,
        categories: Array.from(item.querySelectorAll('category'))
          .map(category => category.textContent || '')
          .filter(Boolean),
        content: item.querySelector('content\\:encoded')?.textContent || 
                 item.querySelector('encoded')?.textContent,
        enclosure: item.querySelector('enclosure') ? {
          url: item.querySelector('enclosure')?.getAttribute('url') || '',
          type: item.querySelector('enclosure')?.getAttribute('type') || '',
          length: parseInt(item.querySelector('enclosure')?.getAttribute('length') || '0')
        } : undefined,
        imageUrl,
        sourceId: options.sourceId,
        sourceName: options.sourceName
      };
    });
    
    return {
      title: feedTitle,
      description: feedDescription,
      link: feedLink,
      items,
      lastUpdated: new Date()
    };
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    toast({
      title: "Error fetching feed",
      description: `Could not fetch feed from ${url}. Please try again later.`,
      variant: "destructive"
    });
    return null;
  }
}

// This function formats a pubDate string to a more readable format
export function formatPubDate(pubDate: string): string {
  try {
    const date = new Date(pubDate);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return pubDate; // Return the original string if parsing fails
    }
    
    // Format the date
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return pubDate;
  }
}

// This function extracts a short excerpt from the description
export function getExcerpt(description: string, maxLength: number = 150): string {
  // Remove HTML tags
  const text = description.replace(/<\/?[^>]+(>|$)/g, '');
  
  // Truncate to maxLength
  if (text.length <= maxLength) {
    return text;
  }
  
  // Find the last space before maxLength
  const lastSpace = text.lastIndexOf(' ', maxLength);
  if (lastSpace === -1) {
    return text.substring(0, maxLength) + '...';
  }
  
  return text.substring(0, lastSpace) + '...';
}
