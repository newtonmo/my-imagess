import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // نستخدم Dialog مثل MySkills
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

interface EditFeaturedWorkFormProps {
  work: FeaturedWork;
  onSubmit: (data: Omit<FeaturedWork, "id">) => void;
  onCancel: () => void;
}

const EditFeaturedWorkForm = ({ work, onSubmit, onCancel }: EditFeaturedWorkFormProps) => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [password, setPassword] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: work.title || "",
      category: work.category || "Development",
      description: work.description || "",
      image: work.image || "",
      video: work.video || "",
      detailImage: work.detailImage || "",
      ctaLabel: work.ctaLabel || "",
      ctaUrl: work.ctaUrl || "",
    },
  });

  const handleAccess = () => {
    if (password === "1234") {
      setAccessGranted(true);
      setIsDialogOpen(false);
    } else {
      alert("❌ رمز غير صحيح");
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
  };

  const handleCancel = () => {
    setIsDialogOpen(true); // أعد فتح نافذة الرمز عند محاولة الإلغاء
  };

  return (
    <>
      {/* نافذة إدخال الرمز */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>🔒 أدخل الرمز للمتابعة</DialogTitle>
          </DialogHeader>
          <Input
            type="password"
            placeholder="أدخل الرمز السري"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end pt-2">
            <Button onClick={handleAccess}>تأكيد</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* النموذج يظهر فقط إذا تم إدخال الرمز الصحيح */}
      {accessGranted && (
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
                    <FormLabel>CTA URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/project/1 or https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Update Featured Work</Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default EditFeaturedWorkForm;
