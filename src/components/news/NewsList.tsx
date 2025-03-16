
import { RssItem } from "@/utils/rss-parser";
import NewsCard from "@/components/news/NewsCard";
import { Separator } from "@/components/ui/separator";

interface NewsListProps {
  items: RssItem[];
  isLoading: boolean;
}

export function NewsList({ items, isLoading }: NewsListProps) {
  // Create placeholder items for loading state
  const placeholderItems = Array(10)
    .fill(null)
    .map((_, i) => ({
      id: `placeholder-${i}`,
      title: "",
      link: "",
      description: "",
      pubDate: "",
      sourceId: "",
      sourceName: "",
    })) as RssItem[];

  const displayItems = isLoading ? placeholderItems : items;

  // Display message when no items match the current filters
  if (!isLoading && displayItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No news found</h3>
        <p className="text-muted-foreground">
          Try changing your filter criteria to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayItems.map((item, index) => (
        <div
          key={item.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <NewsCard item={item} isLoading={isLoading} />
          {index < displayItems.length - 1 && (
            <Separator className="my-6" />
          )}
        </div>
      ))}
    </div>
  );
}

export default NewsList;
