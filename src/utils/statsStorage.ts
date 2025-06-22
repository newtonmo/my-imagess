
import { Stat } from "@/types/stats";

const LOCAL_STORAGE_KEY = "stats_data";

export const loadStatsFromStorage = (): Stat[] | null => {
  const savedStats = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedStats) {
    try {
      const parsedStats = JSON.parse(savedStats);
      console.log("Loading stats data from local storage:", parsedStats);
      return parsedStats;
    } catch (e) {
      console.warn("Failed to parse stats local storage data:", e);
      return null;
    }
  }
  return null;
};

export const saveStatsToStorage = (stats: Stat[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
};

export const getDefaultStats = (): Stat[] => {
  return [
    { id: "1", value: 10, suffix: "+", label: "Completed Projects", duration: 2000 },
    { id: "2", value: 5, suffix: "", label: "Years of Experience", duration: 2000 },
    { id: "3", value: 20, suffix: "+", label: "Happy Clients", duration: 2000 },
  ];
};
