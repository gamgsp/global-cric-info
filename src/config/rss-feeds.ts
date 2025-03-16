
// This file contains all the RSS feeds that will be used to fetch news
// You can add or modify the feeds as needed

export interface RssFeed {
  id: string;
  name: string;
  url: string;
  category: 'news' | 'match-updates' | 'player-profiles' | 'analysis' | 'general';
  refreshInterval: number; // in minutes
}

const rssFeeds: RssFeed[] = [
  {
    id: 'espncricinfo-latest',
    name: 'ESPNCricinfo Latest',
    url: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml',
    category: 'news',
    refreshInterval: 30,
  },
  {
    id: 'cricbuzz-latest',
    name: 'CricBuzz Latest',
    url: 'https://www.cricbuzz.com/rss/cricket-news',
    category: 'news',
    refreshInterval: 30,
  },
  {
    id: 'icc-news',
    name: 'ICC News',
    url: 'https://www.icc-cricket.com/news/all/rss.xml',
    category: 'news',
    refreshInterval: 60,
  },
  {
    id: 'sky-sports-cricket',
    name: 'Sky Sports Cricket',
    url: 'https://www.skysports.com/rss/12040',
    category: 'news',
    refreshInterval: 45,
  },
  {
    id: 'cricket-australia',
    name: 'Cricket Australia',
    url: 'https://www.cricket.com.au/news/rss',
    category: 'news',
    refreshInterval: 60,
  },
];

export default rssFeeds;
