
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { NewsItem } from "@/types/news";
import { loadNewsFromStorage, saveNewsToStorage, getDefaultNews } from "@/utils/newsStorage";

export function useNewsData() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadNewsData();
  }, []);

  const loadNewsData = () => {
    setLoading(true);

    const savedNews = loadNewsFromStorage();
    if (savedNews) {
      setNewsItems(savedNews);
    } else {
      const defaultNews = getDefaultNews();
      setNewsItems(defaultNews);
      saveNewsToStorage(defaultNews);
    }

    setLoading(false);
  };

  const addNewsItem = (newsItem: Omit<NewsItem, "id">) => {
    const newId = `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNewsItem: NewsItem = {
      ...newsItem,
      id: newId
    };

    const updatedNews = [...newsItems, newNewsItem];
    setNewsItems(updatedNews);
    saveNewsToStorage(updatedNews);

    toast({
      title: "News item added",
      description: "Your news item has been added successfully.",
    });

    return newNewsItem;
  };

  const updateNewsItem = (newsId: string, updatedNewsItem: Omit<NewsItem, "id">) => {
    const newsIndex = newsItems.findIndex(item => item.id === newsId);
    if (newsIndex === -1) return null;

    const updatedNews = [...newsItems];
    updatedNews[newsIndex] = {
      ...updatedNews[newsIndex],
      ...updatedNewsItem
    };

    setNewsItems(updatedNews);
    saveNewsToStorage(updatedNews);

    toast({
      title: "News item updated",
      description: "Your news item has been updated successfully.",
    });

    return updatedNews[newsIndex];
  };

  const deleteNewsItem = (newsId: string) => {
    const updatedNews = newsItems.filter(item => item.id !== newsId);

    setNewsItems(updatedNews);
    saveNewsToStorage(updatedNews);

    toast({
      title: "News item deleted",
      description: "Your news item has been removed.",
    });

    return updatedNews;
  };

  return {
    newsItems,
    loading,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    refreshData: loadNewsData
  };
}
