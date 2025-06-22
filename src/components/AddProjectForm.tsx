
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { PortfolioItem } from "@/hooks/usePortfolioData";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  image: z.string().url({
    message: "Please provide a valid image URL.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  tags: z.string().min(1, {
    message: "Please provide at least one tag.",
  }),
  detailImage: z.string().url({
    message: "Please provide a valid detail image URL.",
  }).optional().or(z.literal('')),
  fullDescription: z.string().optional(),
  timeline: z.string().optional(),
  tools: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().url().optional().or(z.literal('')),
  video: z.string().url().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface ProcessedFormData extends Omit<PortfolioItem, 'id'> {}

interface AddProjectFormProps {
  onSubmit: (data: ProcessedFormData) => void;
}

const AddProjectForm = ({ onSubmit }: AddProjectFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      category: "Design",
      tags: "",
      detailImage: "",
      fullDescription: "",
      timeline: "",
      tools: "",
      ctaLabel: "",
      ctaUrl: "",
      video: "",
    },
  });
  const { toast } = useToast();

  const handleSubmit = (data: FormValues) => {
    console.log("Form data received:", data);

    // Transform the form data to match PortfolioItem interface
    const processedData: ProcessedFormData = {
      title: data.title,
      description: data.description,
      image: data.image,
      category: data.category,
      tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      tools: data.tools ? data.tools.split(',').map(tool => tool.trim()).filter(Boolean) : [],
      detailImage: data.detailImage || undefined,
      fullDescription: data.fullDescription || undefined,
      timeline: data.timeline || undefined,
      ctaLabel: data.ctaLabel || undefined,
      ctaUrl: data.ctaUrl || undefined,
      video: data.video || undefined,
    };

    console.log("Processed form data:", processedData);

    // Call the parent's onSubmit function
    onSubmit(processedData);

    // Reset the form after successful submission
    form.reset();

    toast({
      title: "Success!",
      description: `"${data.title}" has been added to your portfolio.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title*</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., UI Design for Web App" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description*</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of your project..."
                    {...field}
                    className="min-h-20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category*</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 h-10 text-sm"
                      {...field}
                    >
                      <option value="Design">Design</option>
                      <option value="Development">Development</option>
                      <option value="Branding">Branding</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)*</FormLabel>
                  <FormControl>
                    <Input placeholder="UI/UX, Mobile, Web" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail Image URL*</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-3">Optional Details</h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="detailImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detail Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/detail-image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/video.mp4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the project..."
                        {...field}
                        className="min-h-32"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeline</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., 3 months" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tools"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tools Used (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="Figma, Photoshop, React" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ctaLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Button Label</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., View Live Site" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ctaUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit">Add Project</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddProjectForm;
