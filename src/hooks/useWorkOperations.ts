
import { useToast } from "@/hooks/use-toast";
import { Skill, SkillWork } from "@/types/skills";
import { saveSkillsToStorage } from "@/utils/skillsStorage";

export function useWorkOperations(skills: Skill[], setSkills: (skills: Skill[]) => void) {
  const { toast } = useToast();

  const addWorkToSkill = (skillId: string, work: Omit<SkillWork, "id">) => {
    const skillIndex = skills.findIndex(skill => skill.id === skillId);
    if (skillIndex === -1) return null;

    const newId = `work-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newWork: SkillWork = {
      ...work,
      id: newId
    };

    const updatedSkills = [...skills];
    updatedSkills[skillIndex] = {
      ...updatedSkills[skillIndex],
      works: [...updatedSkills[skillIndex].works, newWork]
    };
    
    setSkills(updatedSkills);
    saveSkillsToStorage(updatedSkills);
    
    toast({
      title: "Work added",
      description: `"${work.title}" has been added to ${updatedSkills[skillIndex].title}.`,
    });

    return newWork;
  };

  const updateWorkInSkill = (skillId: string, workId: string, updatedWork: Omit<SkillWork, "id">) => {
    const skillIndex = skills.findIndex(skill => skill.id === skillId);
    if (skillIndex === -1) return null;

    const workIndex = skills[skillIndex].works.findIndex(work => work.id === workId);
    if (workIndex === -1) return null;

    const updatedSkills = [...skills];
    updatedSkills[skillIndex] = {
      ...updatedSkills[skillIndex],
      works: updatedSkills[skillIndex].works.map(work => 
        work.id === workId ? { ...work, ...updatedWork } : work
      )
    };
    
    setSkills(updatedSkills);
    saveSkillsToStorage(updatedSkills);
    
    toast({
      title: "Work updated",
      description: `"${updatedWork.title}" has been updated successfully.`,
    });

    return updatedSkills[skillIndex].works[workIndex];
  };

  const deleteWorkFromSkill = (skillId: string, workId: string) => {
    const skillIndex = skills.findIndex(skill => skill.id === skillId);
    if (skillIndex === -1) return null;

    const updatedSkills = [...skills];
    const workToDelete = updatedSkills[skillIndex].works.find(work => work.id === workId);
    updatedSkills[skillIndex] = {
      ...updatedSkills[skillIndex],
      works: updatedSkills[skillIndex].works.filter(work => work.id !== workId)
    };
    
    setSkills(updatedSkills);
    saveSkillsToStorage(updatedSkills);
    
    toast({
      title: "Work deleted",
      description: `"${workToDelete?.title || 'Work'}" has been removed.`,
    });

    return updatedSkills[skillIndex];
  };

  return {
    addWorkToSkill,
    updateWorkInSkill,
    deleteWorkFromSkill
  };
}
