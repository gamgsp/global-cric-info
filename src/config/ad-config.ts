
// This file contains all the ad configuration
// You can customize ad sizes, placements, and other properties here

export interface AdSize {
  id: string;
  name: string;
  width: number;
  height: number;
}

export interface AdPlacement {
  id: string;
  name: string;
  location: 'header' | 'sidebar' | 'in-content' | 'footer' | 'popup';
  description: string;
  recommendedSizes: string[];
}

// Standard ad sizes
export const adSizes: AdSize[] = [
  { id: 'leaderboard', name: 'Leaderboard', width: 728, height: 90 },
  { id: 'medium-rectangle', name: 'Medium Rectangle', width: 300, height: 250 },
  { id: 'large-rectangle', name: 'Large Rectangle', width: 336, height: 280 },
  { id: 'half-page', name: 'Half Page', width: 300, height: 600 },
  { id: 'mobile-banner', name: 'Mobile Banner', width: 320, height: 50 },
  { id: 'large-mobile-banner', name: 'Large Mobile Banner', width: 320, height: 100 },
  { id: 'billboard', name: 'Billboard', width: 970, height: 250 },
  { id: 'skyscraper', name: 'Skyscraper', width: 160, height: 600 },
  { id: 'wide-skyscraper', name: 'Wide Skyscraper', width: 300, height: 600 },
];

// Ad placements throughout the site
export const adPlacements: AdPlacement[] = [
  {
    id: 'header-top',
    name: 'Header Top',
    location: 'header',
    description: 'Displayed at the top of the page above the navigation',
    recommendedSizes: ['leaderboard', 'billboard'],
  },
  {
    id: 'sidebar-top',
    name: 'Sidebar Top',
    location: 'sidebar',
    description: 'Displayed at the top of the sidebar',
    recommendedSizes: ['medium-rectangle', 'large-rectangle'],
  },
  {
    id: 'sidebar-bottom',
    name: 'Sidebar Bottom',
    location: 'sidebar',
    description: 'Displayed at the bottom of the sidebar',
    recommendedSizes: ['medium-rectangle', 'half-page'],
  },
  {
    id: 'in-content-1',
    name: 'In Content 1',
    location: 'in-content',
    description: 'Displayed after the first few paragraphs of content',
    recommendedSizes: ['medium-rectangle', 'large-rectangle', 'leaderboard'],
  },
  {
    id: 'in-content-2',
    name: 'In Content 2',
    location: 'in-content',
    description: 'Displayed in the middle of the content',
    recommendedSizes: ['medium-rectangle', 'large-rectangle', 'leaderboard'],
  },
  {
    id: 'in-content-3',
    name: 'In Content 3',
    location: 'in-content',
    description: 'Displayed near the end of the content',
    recommendedSizes: ['medium-rectangle', 'large-rectangle', 'leaderboard'],
  },
  {
    id: 'in-feed',
    name: 'In Feed',
    location: 'in-content',
    description: 'Displayed between news items in feeds',
    recommendedSizes: ['medium-rectangle', 'large-rectangle'],
  },
  {
    id: 'footer',
    name: 'Footer',
    location: 'footer',
    description: 'Displayed in the footer section',
    recommendedSizes: ['leaderboard', 'billboard'],
  },
  {
    id: 'sticky-bottom',
    name: 'Sticky Bottom',
    location: 'footer',
    description: 'Sticky ad at the bottom of the viewport',
    recommendedSizes: ['leaderboard', 'mobile-banner'],
  },
];

// Add your ad tags here 
// These are placeholders - replace them with your actual ad tags
export const adTags: Record<string, string> = {
  'header-top': '<!-- Header Top Ad Tag -->',
  'sidebar-top': '<!-- Sidebar Top Ad Tag -->',
  'sidebar-bottom': '<!-- Sidebar Bottom Ad Tag -->',
  'in-content-1': '<!-- In Content 1 Ad Tag -->',
  'in-content-2': '<!-- In Content 2 Ad Tag -->',
  'in-content-3': '<!-- In Content 3 Ad Tag -->',
  'in-feed': '<!-- In Feed Ad Tag -->',
  'footer': '<!-- Footer Ad Tag -->',
  'sticky-bottom': '<!-- Sticky Bottom Ad Tag -->',
};

// Function to get ad tag by placement ID
export function getAdTag(placementId: string): string {
  return adTags[placementId] || '';
}

// Function to get recommended sizes for a placement
export function getRecommendedSizes(placementId: string): string[] {
  const placement = adPlacements.find(p => p.id === placementId);
  return placement ? placement.recommendedSizes : ['medium-rectangle'];
}

// Function to get ad size dimensions
export function getAdSizeDimensions(sizeId: string): { width: number, height: number } {
  const size = adSizes.find(s => s.id === sizeId);
  return size 
    ? { width: size.width, height: size.height }
    : { width: 300, height: 250 }; // Default to medium rectangle
}
