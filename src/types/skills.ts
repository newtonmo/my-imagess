
export interface SkillWork {
  id: string;
  title: string;
  description: string;
  image: string;
  video?: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  icon: string;
  works: SkillWork[];
}
