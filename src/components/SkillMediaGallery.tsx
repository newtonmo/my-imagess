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
import { Plus, Trash, Lock } from "lucide-react";
import { useSkillsData } from "@/hooks/useSkillsData";
import { SkillWork } from "@/types/skills";
import { isVideoUrl } from "@/utils/videoUtils";
import VideoPlayer from "./VideoPlayer";
import EditWorkForm from "./EditWorkForm";

interface SkillMediaGalleryProps {
  skillId: string;
  works: SkillWork[];
}

const PASSWORD = "1234";

const SkillMediaGallery = ({ skillId, works }: SkillMediaGalleryProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    video: ""
  });
  const { addWorkToSkill, deleteWorkFromSkill } = useSkillsData();

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authorizedAction, setAuthorizedAction] = useState<"add" | { type: "delete", id: string } | { type: "edit", id: string } | null>(null);

  const checkPassword = () => {
    if (passwordInput === PASSWORD) {
      if (authorizedAction === "add") {
        setOpen(true);
      }
      if (authorizedAction && typeof authorizedAction === "object" && authorizedAction.type === "delete") {
        deleteWorkFromSkill(skillId, authorizedAction.id);
      }
      // EditWorkForm could be protected similarly if needed
      setShowPasswordDialog(false);
      setPasswordInput("");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const requestAction = (action: typeof authorizedAction) => {
    setAuthorizedAction(action);
    setShowPasswordDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.image.trim()) return;

    const workData = {
      title: formData.title,
      description: formData.description,
      image: formData.image,
      ...(formData.video && { video: formData.video })
    };

    addWorkToSkill(skillId, workData);
    setFormData({ title: "", description: "", image: "", video: "" });
    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Media Gallery</h3>
        <Button onClick={() => requestAction("add")}> <Plus className="h-4 w-4 mr-2" /></Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Work</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" value={formData.image} onChange={(e) => handleInputChange("image", e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="video">Video URL (Optional)</Label>
              <Input id="video" value={formData.video} onChange={(e) => handleInputChange("video", e.target.value)} />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Add Work</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {works.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No work examples added yet.</p>
          <p className="text-sm mt-2">Click "Add Media" to showcase your work in this skill.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <div key={work.id} className="content-card group relative">
              <div className="absolute top-2 right-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <EditWorkForm skillId={skillId} work={work} />
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => requestAction({ type: "delete", id: work.id })}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                {work.video && isVideoUrl(work.video) ? (
                  <VideoPlayer src={work.video} poster={work.image} className="w-full h-full object-cover" controls muted />
                ) : (
                  <img src={work.image} alt={work.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                )}
              </div>

              <h4 className="text-lg font-semibold mb-2">{work.title}</h4>
              <p className="text-muted-foreground text-sm">{work.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={(open) => {
        if (!open) {
          setShowPasswordDialog(false);
          setPasswordInput("");
          setPasswordError("");
          setAuthorizedAction(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Password Required
            </DialogTitle>
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
              onKeyDown={(e) => e.key === "Enter" && checkPassword()}
            />
            {passwordError && <p className="text-destructive text-center">{passwordError}</p>}
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
              <Button onClick={checkPassword}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillMediaGallery;
