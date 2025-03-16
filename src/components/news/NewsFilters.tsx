
import { RssFeed } from "@/config/rss-feeds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface NewsFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSource: string;
  setSelectedSource: (source: string) => void;
  feeds: RssFeed[];
}

export function NewsFilters({
  selectedCategory,
  setSelectedCategory,
  selectedSource,
  setSelectedSource,
  feeds,
}: NewsFiltersProps) {
  // Get unique categories from feeds
  const categories = ["all", ...new Set(feeds.map((feed) => feed.category))];

  // Get sources from feeds
  const sources = [
    { id: "all", name: "All Sources" },
    ...feeds.map((feed) => ({ id: feed.id, name: feed.name })),
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filters</CardTitle>
        <CardDescription>
          Filter news by category or source
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer text-transform capitalize"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Source filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Sources</h3>
          <div className="space-y-2">
            {sources.map((source) => (
              <Button
                key={source.id}
                variant={selectedSource === source.id ? "default" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => setSelectedSource(source.id)}
              >
                {source.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default NewsFilters;
