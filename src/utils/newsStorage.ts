
import { NewsItem } from "@/types/news";

const LOCAL_STORAGE_KEY = "news_data";

export const loadNewsFromStorage = (): NewsItem[] | null => {
  const savedNews = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedNews) {
    try {
      const parsedNews = JSON.parse(savedNews);
      console.log("Loading news data from local storage:", parsedNews);
      return parsedNews;
    } catch (e) {
      console.warn("Failed to parse news local storage data:", e);
      return null;
    }
  }
  return null;
};

export const saveNewsToStorage = (news: NewsItem[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(news));
};

export const getDefaultNews = (): NewsItem[] => {
  return [
    {
      id: "1",
      text: "Recently launched a new e-commerce platform for a client",
      date: "April 2025",
    },
    {
      id: "2",
      text: "Featured in Web Developer Monthly magazine",
      date: "March 2025",
    },
    {
      id: "3",
      text: "Gave a talk on Modern Web Development at TechConf 2025",
      date: "February 2025",
    },
    {
      id: "4",
      text: "Just released a new open-source UI component library",
      date: "January 2025",
    },
    {
      id: "5",
      text: "Started learning AI integration with web applications",
      date: "December 2024",
    },
  ];
};
