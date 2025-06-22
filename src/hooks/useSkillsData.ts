
import { useState, useEffect } from "react";
import { Skill } from "@/types/skills";
import { loadSkillsFromStorage, saveSkillsToStorage, getDefaultSkills } from "@/utils/skillsStorage";
import { useSkillOperations } from "@/hooks/useSkillOperations";
import { useWorkOperations } from "@/hooks/useWorkOperations";

export function useSkillsData() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadSkillsData();
  }, []);

  const loadSkillsData = () => {
    setLoading(true);

    // Load from localStorage or set default skills
    const savedSkills = loadSkillsFromStorage();
    if (savedSkills) {
      setSkills(savedSkills);
    } else {
      const defaultSkills = getDefaultSkills();
      setSkills(defaultSkills);
      saveSkillsToStorage(defaultSkills);
    }

    setLoading(false);
  };

  const skillOperations = useSkillOperations(skills, setSkills);
  const workOperations = useWorkOperations(skills, setSkills);

  return {
    skills,
    loading,
    ...skillOperations,
    ...workOperations,
    refreshData: loadSkillsData
  };
}

// Re-export types for backward compatibility
export type { Skill, SkillWork } from "@/types/skills";
