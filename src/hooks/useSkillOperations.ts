
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skill } from "@/types/skills";
import { saveSkillsToStorage } from "@/utils/skillsStorage";

export function useSkillOperations(skills: Skill[], setSkills: (skills: Skill[]) => void) {
  const { toast } = useToast();

  const addSkill = (skill: Omit<Skill, "id" | "works">) => {
    const newId = skill.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newSkill: Skill = {
      ...skill,
      id: newId,
      works: []
    };

    const updatedSkills = [...skills, newSkill];
    setSkills(updatedSkills);
    saveSkillsToStorage(updatedSkills);

    toast({
      title: "Skill added",
      description: `"${skill.title}" has been added to your skills.`,
    });

    return newSkill;
  };

  const updateSkill = (skillId: string, updatedSkill: Omit<Skill, "id" | "works">) => {
    const skillIndex = skills.findIndex(skill => skill.id === skillId);
    if (skillIndex === -1) return null;

    const updatedSkills = [...skills];
    updatedSkills[skillIndex] = {
      ...updatedSkills[skillIndex],
      ...updatedSkill
    };

    setSkills(updatedSkills);
    saveSkillsToStorage(updatedSkills);

    toast({
      title: "Skill updated",
      description: `"${updatedSkill.title}" has been updated successfully.`,
    });

    return updatedSkills[skillIndex];
  };

  const deleteSkill = (skillId: string) => {
    const skillToDelete = skills.find(skill => skill.id === skillId);
    const updatedSkills = skills.filter(skill => skill.id !== skillId);

    setSkills(updatedSkills);
    saveSkillsToStorage(updatedSkills);

    toast({
      title: "Skill deleted",
      description: `"${skillToDelete?.title || 'Skill'}" has been removed.`,
    });

    return updatedSkills;
  };

  return {
    addSkill,
    updateSkill,
    deleteSkill
  };
}
