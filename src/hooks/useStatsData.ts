
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Stat } from "@/types/stats";
import { loadStatsFromStorage, saveStatsToStorage, getDefaultStats } from "@/utils/statsStorage";

export function useStatsData() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStatsData();
  }, []);

  const loadStatsData = () => {
    setLoading(true);
    
    const savedStats = loadStatsFromStorage();
    if (savedStats) {
      setStats(savedStats);
    } else {
      const defaultStats = getDefaultStats();
      setStats(defaultStats);
      saveStatsToStorage(defaultStats);
    }
    
    setLoading(false);
  };

  const addStat = (stat: Omit<Stat, "id">) => {
    const newId = `stat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newStat: Stat = {
      ...stat,
      id: newId
    };
    
    const updatedStats = [...stats, newStat];
    setStats(updatedStats);
    saveStatsToStorage(updatedStats);
    
    toast({
      title: "Statistic added",
      description: `"${stat.label}" has been added.`,
    });

    return newStat;
  };

  const updateStat = (statId: string, updatedStat: Omit<Stat, "id">) => {
    const statIndex = stats.findIndex(stat => stat.id === statId);
    if (statIndex === -1) return null;

    const updatedStats = [...stats];
    updatedStats[statIndex] = {
      ...updatedStats[statIndex],
      ...updatedStat
    };
    
    setStats(updatedStats);
    saveStatsToStorage(updatedStats);
    
    toast({
      title: "Statistic updated",
      description: `"${updatedStat.label}" has been updated successfully.`,
    });

    return updatedStats[statIndex];
  };

  const deleteStat = (statId: string) => {
    const statToDelete = stats.find(stat => stat.id === statId);
    const updatedStats = stats.filter(stat => stat.id !== statId);
    
    setStats(updatedStats);
    saveStatsToStorage(updatedStats);
    
    toast({
      title: "Statistic deleted",
      description: `"${statToDelete?.label || 'Statistic'}" has been removed.`,
    });

    return updatedStats;
  };

  return {
    stats,
    loading,
    addStat,
    updateStat,
    deleteStat,
    refreshData: loadStatsData
  };
}
