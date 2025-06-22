import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface FeaturedWork {
  id: number;
  title: string;
  category: string;
  description?: string;
  fullDescription?: string;
  longDescription?: string;
  image: string;
  video?: string;
  detailImage?: string;
  galleryImages?: string[];
  timeline?: string;
  challenges?: string;
  tools?: string[];
  tags?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
}

const LOCAL_STORAGE_KEY = "featured_works";

// Default featured works data
const DEFAULT_WORKS: FeaturedWork[] = [
  {
    id: 1,
    title: "E-Commerce Website",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=600&q=30",
    category: "Development",
    description: "A modern e-commerce platform with advanced features",
    fullDescription: "This comprehensive e-commerce solution features a responsive design, advanced product filtering, secure payment integration, and real-time inventory management. Built with modern web technologies to ensure optimal performance and user experience.",
    timeline: "3 months",
    tools: ["React", "Node.js", "MongoDB", "Stripe"],
    ctaLabel: "View Details",
    ctaUrl: "/featured-work/1"
  },
  {
    id: 2,
    title: "Brand Identity Design",
    image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=600&q=30",
    video: "https://assets.mixkit.co/videos/preview/mixkit-graphic-designer-working-on-a-project-1799-large.mp4",
    category: "Design",
    description: "Complete brand identity system for a tech startup",
    fullDescription: "Developed a comprehensive brand identity including logo design, color palette, typography, and brand guidelines. The project involved extensive research and multiple design iterations to create a memorable and effective brand presence.",
    timeline: "2 months",
    tools: ["Adobe Illustrator", "Photoshop", "Figma"],
    ctaLabel: "View Details",
    ctaUrl: "/featured-work/2"
  },
  {
    id: 3,
    title: "Mobile Banking App",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=30",
    video: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-and-touching-the-screen-4838-large.mp4",
    category: "Development",
    description: "Secure mobile banking application with advanced features",
    fullDescription: "A secure and user-friendly mobile banking application featuring biometric authentication, real-time transactions, budget tracking, and investment management. Designed with a focus on security and ease of use.",
    timeline: "6 months",
    tools: ["React Native", "Node.js", "PostgreSQL", "AWS"],
    ctaLabel: "View Details",
    ctaUrl: "/featured-work/3"
  },
  {
    id: 4,
    title: "Product Packaging",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&q=30",
    category: "Design",
    description: "Creative packaging design for premium products",
    fullDescription: "Designed innovative packaging solutions that combine functionality with aesthetic appeal. The project focused on sustainable materials and eye-catching designs that stand out on retail shelves.",
    timeline: "1 month",
    tools: ["Adobe Illustrator", "InDesign", "3D Modeling"],
    ctaLabel: "View Details",
    ctaUrl: "/featured-work/4"
  },
  {
    id: 5,
    title: "Real Estate Platform",
    image: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=600&q=30",
    category: "Development",
    description: "Comprehensive real estate management platform",
    fullDescription: "A full-featured real estate platform with property listings, virtual tours, mortgage calculators, and agent management. Includes advanced search capabilities and mobile-responsive design.",
    timeline: "4 months",
    tools: ["Vue.js", "Laravel", "MySQL", "Google Maps API"],
    ctaLabel: "View Details",
    ctaUrl: "/featured-work/5"
  }
];

export function useFeaturedWorks() {
  const [works, setWorks] = useState<FeaturedWork[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load data from localStorage or use defaults
  useEffect(() => {
    const savedWorks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedWorks) {
      try {
        const parsedWorks = JSON.parse(savedWorks);
        setWorks(Array.isArray(parsedWorks) ? parsedWorks : DEFAULT_WORKS);
      } catch (e) {
        console.warn("Failed to parse saved works data:", e);
        setWorks(DEFAULT_WORKS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_WORKS));
      }
    } else {
      setWorks(DEFAULT_WORKS);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_WORKS));
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever works change
  const saveToStorage = (updatedWorks: FeaturedWork[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedWorks));
  };

  // Add new featured work
  const addWork = (workData: Omit<FeaturedWork, "id">) => {
    const newId = works.length > 0 ? Math.max(...works.map(w => w.id)) + 1 : 1;
    const newWork: FeaturedWork = {
      ...workData,
      id: newId,
    };

    const updatedWorks = [...works, newWork];
    setWorks(updatedWorks);
    saveToStorage(updatedWorks);

    toast({
      title: "Featured work added",
      description: `"${workData.title}" has been added to featured works.`,
    });

    return newWork;
  };

  // Update existing featured work
  const updateWork = (workId: number, workData: Omit<FeaturedWork, "id">) => {
    const workIndex = works.findIndex(w => w.id === workId);
    if (workIndex === -1) {
      console.error("Featured work not found for update");
      return null;
    }

    const updatedWork: FeaturedWork = {
      ...workData,
      id: workId,
    };

    const updatedWorks = [...works];
    updatedWorks[workIndex] = updatedWork;
    setWorks(updatedWorks);
    saveToStorage(updatedWorks);

    toast({
      title: "Featured work updated",
      description: `"${workData.title}" has been updated successfully.`,
    });

    return updatedWork;
  };

  // Delete featured work
  const deleteWork = (workId: number) => {
    const workToDelete = works.find(w => w.id === workId);
    const updatedWorks = works.filter(w => w.id !== workId);
    setWorks(updatedWorks);
    saveToStorage(updatedWorks);

    toast({
      title: "Featured work deleted",
      description: `"${workToDelete?.title || 'Work'}" has been removed from featured works.`,
    });

    return updatedWorks;
  };

  return {
    works,
    loading,
    addWork,
    updateWork,
    deleteWork,
  };
}
