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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit3, Upload, Link, Image } from "lucide-react";
import { useSkillsData } from "@/hooks/useSkillsData";
import { Skill } from "@/types/skills";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

interface EditSkillFormProps {
  skill: Skill;
}

const EditSkillForm = ({ skill }: EditSkillFormProps) => {
  const [open, setOpen] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [formData, setFormData] = useState({
    title: skill.title,
    description: skill.description,
    icon: skill.icon,
    iconType: (skill.icon.startsWith('http') || skill.icon.startsWith('https') || skill.icon.startsWith('blob:')) ? "url" : "preset" as "preset" | "upload" | "url",
    customIconUrl: (skill.icon.startsWith('http') || skill.icon.startsWith('https')) ? skill.icon : "",
    customIconFile: null as File | null
  });

  const { updateSkill } = useSkillsData();

  const correctPassword = "1234"; // يمكنك تغييره لاحقًا

  const handleCheckPassword = () => {
    if (passwordInput === correctPassword) {
      setIsAuthorized(true);
      setShowPasswordDialog(false);
      setOpen(true);
    } else {
      alert("رمز سري خاطئ");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    let finalIcon = formData.icon;

    if (formData.iconType === "url" && formData.customIconUrl.trim()) {
      finalIcon = formData.customIconUrl;
    } else if (formData.iconType === "upload" && formData.customIconFile) {
      finalIcon = URL.createObjectURL(formData.customIconFile);
    }

    updateSkill(skill.id, {
      title: formData.title,
      description: formData.description,
      icon: finalIcon
    });

    setOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        customIconFile: file
      }));
    }
  };

  return (
    <>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setShowPasswordDialog(true)}>
        <Edit3 className="h-4 w-4" />
      </Button>

      <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Password Required</AlertDialogTitle>
            <AlertDialogDescription>Please enter the password to add a new testimonial</AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            type="password"
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <AlertDialogFooter>
            <Button onClick={() => setShowPasswordDialog(false)} variant="outline">Cancel</Button>
            <Button onClick={handleCheckPassword}>Submit</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Skill Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Video Monitoring, 3D Modeling"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your expertise in this skill..."
                required
              />
            </div>

            <div>
              <Label>Icon</Label>
              <Tabs value={formData.iconType} onValueChange={(value) => handleInputChange("iconType", value)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preset">Preset Icons</TabsTrigger>
                  <TabsTrigger value="url">Icon URL</TabsTrigger>
                  <TabsTrigger value="upload">Upload Icon</TabsTrigger>
                </TabsList>

                <TabsContent value="preset" className="space-y-2">
                  <Select value={formData.iconType === "preset" ? formData.icon : "image"} onValueChange={(value) => handleInputChange("icon", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="play">Play</SelectItem>
                      <SelectItem value="code">Code</SelectItem>
                      <SelectItem value="server">Server</SelectItem>
                    </SelectContent>
                  </Select>
                </TabsContent>

                <TabsContent value="url" className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Link className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="https://example.com/icon.png or FontAwesome URL"
                      value={formData.customIconUrl}
                      onChange={(e) => handleInputChange("customIconUrl", e.target.value)}
                    />
                  </div>
                  {formData.customIconUrl && (
                    <div className="flex items-center space-x-2 p-2 border rounded">
                      <img
                        src={formData.customIconUrl}
                        alt="Icon preview"
                        className="h-8 w-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <span className="text-sm text-muted-foreground">Icon Preview</span>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upload" className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </div>
                  {formData.customIconFile && (
                    <div className="flex items-center space-x-2 p-2 border rounded">
                      <img
                        src={URL.createObjectURL(formData.customIconFile)}
                        alt="Upload preview"
                        className="h-8 w-8 object-contain"
                      />
                      <span className="text-sm text-muted-foreground">{formData.customIconFile.name}</span>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Skill</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditSkillForm;
