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
import { Plus } from "lucide-react";
import { NewsItem } from "@/types/news";

interface AddNewsFormProps {
  onAdd: (newsItem: Omit<NewsItem, "id">) => void;
}

const AddNewsForm = ({ onAdd }: AddNewsFormProps) => {
  const [open, setOpen] = useState(false);
  const [passwordStep, setPasswordStep] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const correctPassword = "1234"; // <-- يمكنك تغييره هنا

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<NewsItem, "id">>();

  const onSubmit = (data: Omit<NewsItem, "id">) => {
    onAdd(data);
    reset();
    setOpen(false);
    setPasswordStep(true);
    setPasswordInput("");
  };

  const handlePasswordCheck = () => {
    if (passwordInput === correctPassword) {
      setPasswordStep(false);
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(state) => {
      setOpen(state);
      setPasswordStep(true);
      setPasswordInput("");
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {passwordStep ? "Enter Password" : "Add News Item"}
          </DialogTitle>
        </DialogHeader>

        {passwordStep ? (
          <div className="space-y-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter admin password"
            />
            <div className="flex justify-end">
              <Button onClick={handlePasswordCheck}>Submit</Button>
            </div>
          </div>
        ) : (
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
              <Button type="submit">Add News Item</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddNewsForm;
