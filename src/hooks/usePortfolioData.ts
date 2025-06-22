import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Replace with your external JSON URL (Google Sheet JSON, Airtable API, or a public gist):
// Example: "https://gist.githubusercontent.com/username/gistid/raw/portfolio.json"
// Or get JSON output from Google Sheets: https://github.com/benborgers/google-sheets-public
export const PORTFOLIO_JSON_URL = "https://raw.githubusercontent.com/sonnylazuardi/nextjs-portfolio/main/public/data/projects.json"; // Example! Change as needed

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  video?: string;
  tags: string[];
  detailImage?: string;
  fullDescription?: string;
  timeline?: string;
  tools?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
}

const LOCAL_STORAGE_KEY = "portfolio_items";

export function usePortfolioData() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Load initial data
  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // Function to fetch portfolio data
  const fetchPortfolioData = async () => {
    setLoading(true);
    
    // First, try to load from localStorage
    const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          console.log("Loading portfolio data from local storage:", parsedItems);
          setItems(parsedItems);
          setError(null);
          setLoading(false);
          
          // Still try to fetch from remote but don't block the UI
          tryFetchRemoteData(parsedItems);
          return parsedItems;
        }
      } catch (e) {
        console.warn("Failed to parse local storage data:", e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    
    // Try to fetch from remote
    const remoteData = await tryFetchRemoteData([]);
    if (remoteData.length === 0) {
      // If no remote data and no local data, start with empty array
      console.log("No portfolio data found, starting with empty array");
      setItems([]);
      setError(null);
    }
    
    setLoading(false);
    return remoteData;
  };

  // Helper function to try fetching remote data
  const tryFetchRemoteData = async (fallbackItems: PortfolioItem[]) => {
    try {
      const res = await fetch(PORTFOLIO_JSON_URL);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Could not fetch portfolio data`);
      }
      
      const data = await res.json();
      const portfolioItems = Array.isArray(data) ? data : (data.projects || []);
      
      // Only update if we got valid data and it's different from current
      if (portfolioItems.length > 0) {
        // Save to localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(portfolioItems));
        
        console.log("Remote portfolio data fetched successfully:", portfolioItems);
        setItems(portfolioItems);
        setError(null);
        return portfolioItems;
      }
    } catch (e: any) {
      console.warn("Could not fetch remote portfolio data:", e.message);
      // Don't show error toast for remote fetch failures if we have local data
      if (fallbackItems.length === 0) {
        setError("Remote data unavailable - using local storage");
      }
    }
    
    return fallbackItems;
  };

  // Function to add a new portfolio item
  const addItem = (item: Omit<PortfolioItem, "id">) => {
    console.log("usePortfolioData: Adding item:", item);
    
    // Generate a new id (highest id + 1, or 1 if no items)
    const newId = items.length > 0 
      ? Math.max(...items.map(item => item.id)) + 1
      : 1;
    
    // Ensure tags and tools are arrays
    const processedItem: PortfolioItem = {
      ...item,
      id: newId,
      tags: Array.isArray(item.tags) ? item.tags : [],
      tools: Array.isArray(item.tools) ? item.tools : []
    };
    
    console.log("usePortfolioData: Processed item:", processedItem);
    
    // Add to local state immediately for instant feedback
    const updatedItems = [...items, processedItem];
    console.log("usePortfolioData: Updated items array:", updatedItems);
    
    setItems(updatedItems);
    
    // Save to localStorage for persistence
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
    console.log("usePortfolioData: Saved to localStorage");
    
    // Show success toast
    toast({
      title: "Project added",
      description: `"${item.title}" has been added to your portfolio.`,
    });

    return processedItem;
  };

  // Function to update an existing portfolio item
  const updateItem = (itemId: number, updatedItem: Omit<PortfolioItem, "id">) => {
    console.log("usePortfolioData: Updating item with ID:", itemId, "Data:", updatedItem);
    
    // Find the item to update
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      console.error("usePortfolioData: Item not found for update");
      return null;
    }

    // Ensure tags and tools are arrays
    const processedItem: PortfolioItem = {
      ...updatedItem,
      id: itemId,
      tags: Array.isArray(updatedItem.tags) ? updatedItem.tags : [],
      tools: Array.isArray(updatedItem.tools) ? updatedItem.tools : []
    };
    
    console.log("usePortfolioData: Processed updated item:", processedItem);
    
    // Update the item in local state
    const updatedItems = [...items];
    updatedItems[itemIndex] = processedItem;
    console.log("usePortfolioData: Updated items array:", updatedItems);
    
    setItems(updatedItems);
    
    // Save to localStorage for persistence
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
    console.log("usePortfolioData: Saved to localStorage after update");
    
    // Show success toast
    toast({
      title: "Project updated",
      description: `"${updatedItem.title}" has been updated successfully.`,
    });

    return processedItem;
  };

  // Function to delete a portfolio item
  const deleteItem = (itemId: number) => {
    console.log("usePortfolioData: Deleting item with ID:", itemId);
    
    // Find the item to get its title for the toast
    const itemToDelete = items.find(item => item.id === itemId);
    
    // Remove from local state
    const updatedItems = items.filter(item => item.id !== itemId);
    console.log("usePortfolioData: Updated items array after deletion:", updatedItems);
    
    setItems(updatedItems);
    
    // Save to localStorage for persistence
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
    console.log("usePortfolioData: Saved to localStorage after deletion");
    
    // Show success toast
    toast({
      title: "Project deleted",
      description: `"${itemToDelete?.title || 'Project'}" has been removed from your portfolio.`,
    });

    return updatedItems;
  };

  // Function to refresh data (force reload)
  const refreshData = () => {
    console.log("Refreshing portfolio data...");
    return fetchPortfolioData();
  };

  console.log("usePortfolioData: Current items state:", items);

  return { 
    items, 
    loading, 
    error,
    addItem,
    updateItem,
    deleteItem,
    fetchPortfolioData,
    refreshData
  };
}
