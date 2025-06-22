import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock } from "lucide-react";

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

interface EditProjectFormProps {
  project: PortfolioItem;
  onSubmit: (data: ProcessedFormData) => void;
  onCancel: () => void;
}

const PASSWORD = "1234"; // الرمز السري الثابت

const EditProjectForm = ({ project, onSubmit, onCancel }: EditProjectFormProps) => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project.title || "",
      description: project.description || "",
      image: project.image || "",
      category: project.category || "Design",
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : "",
      detailImage: project.detailImage || "",
      fullDescription: project.fullDescription || "",
      timeline: project.timeline || "",
      tools: Array.isArray(project.tools) ? project.tools.join(', ') : "",
      ctaLabel: project.ctaLabel || "",
      ctaUrl: project.ctaUrl || "",
      video: project.video || "",
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    // إعادة تعيين حالة التحقق عند فتح النموذج
    if (!isVerified) {
      setShowPasswordDialog(true);
      setPasswordInput("");
      setPasswordError("");
    }
  }, [isVerified]);

  const handlePasswordSubmit = () => {
    if (passwordInput === PASSWORD) {
      setIsVerified(true);
      setShowPasswordDialog(false);
      setPasswordError("");
      setPasswordInput("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleSubmit = (data: FormValues) => {
    console.log("Edit form data received:", data);

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

    console.log("Processed edit form data:", processedData);

    // Call the parent's onSubmit function
    onSubmit(processedData);

    toast({
      title: "Success!",
      description: `"${data.title}" has been updated successfully.`,
    });
  };

  return (
    <>
      {/* Password Dialog */}
      <Dialog
        open={showPasswordDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowPasswordDialog(false);
            onCancel(); // إغلاق النموذج بالكامل عند إغلاق نافذة الرمز
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Password Required
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Please enter the password to edit this project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError("");
              }}
              className={`w-full text-lg ${passwordError ? "border-destructive" : ""}`}
              placeholder="Enter password"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            {passwordError && (
              <p className="text-destructive text-center">{passwordError}</p>
            )}
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  onCancel();
                }}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                variant="default"
                className="px-6"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Form - Only shown after password verification */}
      {isVerified && (
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

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Update Project</Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default EditProjectForm;
