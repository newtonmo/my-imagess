
import { Skill } from "@/types/skills";

const LOCAL_STORAGE_KEY = "skills_data";

export const loadSkillsFromStorage = (): Skill[] | null => {
  const savedSkills = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedSkills) {
    try {
      const parsedSkills = JSON.parse(savedSkills);
      console.log("Loading skills data from local storage:", parsedSkills);
      return parsedSkills;
    } catch (e) {
      console.warn("Failed to parse local storage data:", e);
      return null;
    }
  }
  return null;
};

export const saveSkillsToStorage = (skills: Skill[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(skills));
};

export const getDefaultSkills = (): Skill[] => {
  return [
    {
      id: "powerpoint",
      title: "PowerPoint",
      icon: "image",
      description: "Expert in creating professional presentations and slide decks",
      works: []
    },
    {
      id: "photoshop",
      title: "Photoshop",
      icon: "image",
      description: "Proficient in image editing, manipulation and design creation",
      works: []
    },
    {
      id: "frontend",
      title: "Frontend Development",
      icon: "code",
      description: "Building responsive, user-friendly interfaces with modern frameworks",
      works: []
    },
    {
      id: "backend",
      title: "Backend Development",
      icon: "server",
      description: "Creating robust server-side applications and APIs",
      works: []
    }
  ];
};
