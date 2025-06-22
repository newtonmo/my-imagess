import React, { useState } from "react";
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
import { FeaturedWork } from "@/hooks/useFeaturedWorks";
import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  description: z.string().optional(),
  image: z.string().url({
    message: "Please provide a valid image URL.",
  }),
  video: z.string().url().optional().or(z.literal("")),
  detailImage: z.string().url().optional().or(z.literal("")),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddFeaturedWorkFormProps {
  onSubmit: (data: Omit<FeaturedWork, "id">) => void;
  onCancel: () => void;
}

const PASSWORD = "1234";

const AddFeaturedWorkForm = ({ onSubmit, onCancel }: AddFeaturedWorkFormProps) => {
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "Development",
      description: "",
      image: "",
      video: "",
      detailImage: "",
      ctaLabel: "View Details",
      ctaUrl: "",
    },
  });

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
    const processedData: Omit<FeaturedWork, "id"> = {
      title: data.title,
      category: data.category,
      description: data.description || undefined,
      image: data.image,
      video: data.video || undefined,
      detailImage: data.detailImage || undefined,
      ctaLabel: data.ctaLabel || undefined,
      ctaUrl: data.ctaUrl || undefined,
    };

    onSubmit(processedData);
    form.reset();
  };

  return (
    <>
      <Dialog
        open={showPasswordDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowPasswordDialog(false);
            onCancel();
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
              Please enter the password to add a new featured work
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
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
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
              <Button onClick={handlePasswordSubmit} variant="default" className="px-6">
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                      <Input placeholder="E.g., E-Commerce Website" {...field} />
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
                          <option value="Development">Development</option>
                          <option value="Design">Design</option>
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
                  name="ctaLabel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTA Button Label</FormLabel>
                      <FormControl>
                        <Input placeholder="View Details" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the featured work..."
                        {...field}
                        className="min-h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="detailImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detail Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/detail.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="ctaUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Link (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="px-8">
                Add Featured Work
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default AddFeaturedWorkForm;
