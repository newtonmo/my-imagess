import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit3, Lock } from "lucide-react";
import { useSkillsData } from "@/hooks/useSkillsData";
import { SkillWork } from "@/types/skills";

interface EditWorkFormProps {
  skillId: string;
  work: SkillWork;
}

const PASSWORD = "1234";

const EditWorkForm = ({ skillId, work }: EditWorkFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: work.title,
    description: work.description,
    image: work.image,
    video: work.video || ""
  });
  const { updateWorkInSkill } = useSkillsData();

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim() || !formData.image.trim()) {
      return;
    }

    const workData = {
      title: formData.title,
      description: formData.description,
      image: formData.image,
      ...(formData.video && { video: formData.video })
    };

    updateWorkInSkill(skillId, work.id, workData);
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => setShowPasswordDialog(true)}
      >
        <Edit3 className="h-4 w-4" />
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

      {/* Actual Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Work</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Work title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe this work..."
                required
              />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <Label htmlFor="video">Video URL (Optional)</Label>
              <Input
                id="video"
                value={formData.video}
                onChange={(e) => handleInputChange("video", e.target.value)}
                placeholder="https://youtube.com/watch?v=... or direct video URL"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Work</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditWorkForm;
