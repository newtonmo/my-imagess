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
import { Plus, Upload, Link, Image } from "lucide-react";
import { useSkillsData } from "@/hooks/useSkillsData";

const AddSkillForm = () => {
  const [open, setOpen] = useState(false);            // نافذة الإضافة
  const [authOpen, setAuthOpen] = useState(false);    // نافذة الرمز السري
  const [password, setPassword] = useState("");       // حقل الرمز السري
  const secretCode = "1234";                          // الرمز السري

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "image",
    iconType: "preset" as "preset" | "upload" | "url",
    customIconUrl: "",
    customIconFile: null as File | null
  });
  const { addSkill } = useSkillsData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    let finalIcon = formData.icon;

    if (formData.iconType === "url" && formData.customIconUrl.trim()) {
      finalIcon = formData.customIconUrl;
    } else if (formData.iconType === "upload" && formData.customIconFile) {
      finalIcon = URL.createObjectURL(formData.customIconFile);
    }

    addSkill({
      ...formData,
      icon: finalIcon
    });

    setFormData({
      title: "",
      description: "",
      icon: "image",
      iconType: "preset",
      customIconUrl: "",
      customIconFile: null
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
      {/* زر الإضافة */}
      <Button className="mb-6" onClick={() => setAuthOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
      </Button>

      {/* نافذة إدخال الرمز السري */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>أدخل الرمز السري</DialogTitle>
          </DialogHeader>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز الدخول"
          />
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => {
              setAuthOpen(false);
              setPassword("");
            }}>
              إلغاء
            </Button>
            <Button onClick={() => {
              if (password === secretCode) {
                setAuthOpen(false);
                setPassword("");
                setOpen(true);
              } else {
                alert("رمز خاطئ");
              }
            }}>
              دخول
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة إضافة المهارة */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
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
                  <Select value={formData.icon} onValueChange={(value) => handleInputChange("icon", value)}>
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
              <Button type="submit">Add Skill</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddSkillForm;
