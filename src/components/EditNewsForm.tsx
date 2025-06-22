import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Lock } from "lucide-react";
import { NewsItem } from "@/types/news";

interface EditNewsFormProps {
  newsItem: NewsItem;
  onUpdate: (newsId: string, updatedNewsItem: Omit<NewsItem, "id">) => void;
}

const PASSWORD = "1234";

const EditNewsForm = ({ newsItem, onUpdate }: EditNewsFormProps) => {
  const [open, setOpen] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<NewsItem, "id">>({
    defaultValues: {
      text: newsItem.text,
      date: newsItem.date
    }
  });

  const onSubmit = (data: Omit<NewsItem, "id">) => {
    onUpdate(newsItem.id, data);
    setOpen(false);
  };

  React.useEffect(() => {
    if (open) {
      reset({
        text: newsItem.text,
        date: newsItem.date
      });
    }
  }, [open, newsItem, reset]);

  const handleCheckPassword = () => {
    if (passwordInput === PASSWORD) {
      setShowPasswordDialog(false);
      setPasswordError("");
      setPasswordInput("");
      setOpen(true);
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setShowPasswordDialog(true)}>
        <Edit className="h-4 w-4" />
      </Button>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={(open) => {
        if (!open) {
          setShowPasswordDialog(false);
          setPasswordInput("");
          setPasswordError("");
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" /> Password Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              autoFocus
              className={`w-full ${passwordError ? "border-destructive" : ""}`}
              onKeyDown={(e) => e.key === "Enter" && handleCheckPassword()}
            />
            {passwordError && <p className="text-destructive text-sm text-center">{passwordError}</p>}
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
              <Button onClick={handleCheckPassword}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit News Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">News Text</Label>
              <Textarea
                id="text"
                {...register("text", { required: "News text is required" })}
                placeholder="e.g., Featured in Tech Magazine"
                rows={3}
              />
              {errors.text && (
                <p className="text-sm text-destructive">{errors.text.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                {...register("date", { required: "Date is required" })}
                placeholder="e.g., January 2025"
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update News Item</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditNewsForm;
