
import { Testimonial } from "@/types/testimonials";

const LOCAL_STORAGE_KEY = "testimonials_data";

export const loadTestimonialsFromStorage = (): Testimonial[] | null => {
  const savedTestimonials = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedTestimonials) {
    try {
      const parsedTestimonials = JSON.parse(savedTestimonials);
      console.log("Loading testimonials data from local storage:", parsedTestimonials);
      return parsedTestimonials;
    } catch (e) {
      console.warn("Failed to parse testimonials local storage data:", e);
      return null;
    }
  }
  return null;
};

export const saveTestimonialsToStorage = (testimonials: Testimonial[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(testimonials));
};

export const getDefaultTestimonials = (): Testimonial[] => {
  return [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Marketing Director",
      content: "Mohammed created an exceptional website for our company. His attention to detail and creative approach helped us stand out in a competitive market.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format",
      rating: 5
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Startup Founder",
      content: "Working with Mohammed was a game-changer for our startup. He delivered a robust platform that exceeded our expectations and helped us secure additional funding.",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format",
      rating: 5
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      role: "Art Director",
      content: "Mohammed's design skills are truly impressive. He was able to translate our brand vision into stunning visuals that perfectly capture our company's essence.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format",
      rating: 5
    }
  ];
};
