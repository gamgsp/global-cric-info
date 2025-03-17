
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

// Using a more reliable CORS proxy - we'll try multiple options
// The first option is AllOrigins which has high reliability
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://cors-anywhere.herokuapp.com/'
];

// This function fetches and parses an RSS feed
export async function fetchRssFeed(url: string, options: FetchOptions): Promise<ParsedRssFeed | null> {
  // Try each proxy in order until one works
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    try {
      const proxyUrl = `${CORS_PROXIES[i]}${encodeURIComponent(url)}`;
      console.log(`Trying proxy ${i+1}/${CORS_PROXIES.length} for ${options.sourceName}`);
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        console.warn(`Proxy ${i+1} failed with status ${response.status} for ${options.sourceName}`);
        continue; // Try the next proxy
      }

      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');
      
      // Check if the response is valid XML
      if (xml.querySelector('parsererror')) {
        console.warn(`Invalid XML from proxy ${i+1} for ${options.sourceName}`);
        continue; // Try the next proxy
      }
      
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
          description: item.querySelector('description')?.textContent || 'No description available.',
          pubDate: item.querySelector('pubDate')?.textContent || new Date().toUTCString(),
          creator: item.querySelector('dc\\:creator')?.textContent || 
                  item.querySelector('creator')?.textContent || 'Unknown',
          categories: Array.from(item.querySelectorAll('category'))
            .map(category => category.textContent || '')
            .filter(Boolean),
          content: item.querySelector('content\\:encoded')?.textContent || 
                  item.querySelector('encoded')?.textContent || '',
          enclosure: item.querySelector('enclosure') ? {
            url: item.querySelector('enclosure')?.getAttribute('url') || '',
            type: item.querySelector('enclosure')?.getAttribute('type') || '',
            length: parseInt(item.querySelector('enclosure')?.getAttribute('length') || '0')
          } : undefined,
          imageUrl: imageUrl || '/placeholder.svg',
          sourceId: options.sourceId,
          sourceName: options.sourceName
        };
      });
      
      console.log(`Successfully fetched ${options.sourceName} with proxy ${i+1}`);
      return {
        title: feedTitle,
        description: feedDescription,
        link: feedLink,
        items,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error(`Error with proxy ${i+1} for ${options.sourceName}:`, error);
      // Continue to the next proxy if available
      if (i === CORS_PROXIES.length - 1) {
        // We've tried all proxies, generate fallback data
        console.warn(`All proxies failed for ${options.sourceName}, using fallback data`);
        return {
          title: `${options.sourceName} (Offline)`,
          description: "Currently unavailable. Using fallback data.",
          link: "",
          items: generateFallbackItems(options),
          lastUpdated: new Date()
        };
      }
    }
  }
  
  // If we get here, all proxies failed
  return {
    title: `${options.sourceName} (Offline)`,
    description: "Currently unavailable. Using fallback data.",
    link: "",
    items: generateFallbackItems(options),
    lastUpdated: new Date()
  };
}

// Create fallback news items when feeds fail to load
function generateFallbackItems(options: FetchOptions): RssItem[] {
  const baseItems = [
    {
      title: "Cricket Australia announces upcoming series with India",
      description: "A thrilling five-match test series has been scheduled between Australia and India for the upcoming season."
    },
    {
      title: "England's new bowling strategy pays off in recent matches",
      description: "The England cricket team has shown remarkable improvement with their new bowling approach."
    },
    {
      title: "ICC announces changes to T20 World Cup format",
      description: "The International Cricket Council revealed modifications to the tournament structure for better competitive balance."
    },
    {
      title: "Rising star batsman breaks record in domestic league",
      description: "The 19-year-old prodigy scored a double century in his debut first-class match."
    },
    {
      title: "West Indies cricket board announces development program",
      description: "A new grassroots initiative aims to discover and nurture young cricket talent across the Caribbean."
    }
  ];
  
  return baseItems.map((item, index) => ({
    id: `fallback-${options.sourceId}-${index}`,
    title: item.title,
    link: "#",
    description: item.description,
    pubDate: new Date(Date.now() - index * 86400000).toUTCString(), // Stagger dates
    creator: options.sourceName,
    categories: ["Cricket", "News"],
    content: item.description,
    imageUrl: `/placeholder.svg`,
    sourceId: options.sourceId,
    sourceName: `${options.sourceName} (Offline)`
  }));
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
  if (!description) return "No description available.";
  
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
