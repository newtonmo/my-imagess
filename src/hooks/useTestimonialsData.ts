
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Testimonial } from "@/types/testimonials";
import { loadTestimonialsFromStorage, saveTestimonialsToStorage, getDefaultTestimonials } from "@/utils/testimonialsStorage";

export function useTestimonialsData() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadTestimonialsData();
  }, []);

  const loadTestimonialsData = () => {
    setLoading(true);

    // Load from localStorage or set default testimonials
    const savedTestimonials = loadTestimonialsFromStorage();
    if (savedTestimonials) {
      setTestimonials(savedTestimonials);
    } else {
      const defaultTestimonials = getDefaultTestimonials();
      setTestimonials(defaultTestimonials);
      saveTestimonialsToStorage(defaultTestimonials);
    }

    setLoading(false);
  };

  const addTestimonial = (testimonial: Omit<Testimonial, "id">) => {
    const newId = `testimonial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: newId
    };

    const updatedTestimonials = [...testimonials, newTestimonial];
    setTestimonials(updatedTestimonials);
    saveTestimonialsToStorage(updatedTestimonials);

    toast({
      title: "Testimonial added",
      description: `Testimonial from "${testimonial.name}" has been added.`,
    });

    return newTestimonial;
  };

  const updateTestimonial = (testimonialId: string, updatedTestimonial: Omit<Testimonial, "id">) => {
    const testimonialIndex = testimonials.findIndex(testimonial => testimonial.id === testimonialId);
    if (testimonialIndex === -1) return null;

    const updatedTestimonials = [...testimonials];
    updatedTestimonials[testimonialIndex] = {
      ...updatedTestimonials[testimonialIndex],
      ...updatedTestimonial
    };

    setTestimonials(updatedTestimonials);
    saveTestimonialsToStorage(updatedTestimonials);

    toast({
      title: "Testimonial updated",
      description: `Testimonial from "${updatedTestimonial.name}" has been updated successfully.`,
    });

    return updatedTestimonials[testimonialIndex];
  };

  const deleteTestimonial = (testimonialId: string) => {
    const testimonialToDelete = testimonials.find(testimonial => testimonial.id === testimonialId);
    const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== testimonialId);

    setTestimonials(updatedTestimonials);
    saveTestimonialsToStorage(updatedTestimonials);

    toast({
      title: "Testimonial deleted",
      description: `Testimonial from "${testimonialToDelete?.name || 'Client'}" has been removed.`,
    });

    return updatedTestimonials;
  };

  return {
    testimonials,
    loading,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    refreshData: loadTestimonialsData
  };
}
