import { useState } from "react";
import { Code, Image, Server, Edit, Video, Play, Trash2, Edit3, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useSkillsData } from "@/hooks/useSkillsData";
import AddSkillForm from "./AddSkillForm";
import EditSkillForm from "./EditSkillForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PASSWORD = "1234";

const SkillsGrid = () => {
  const { skills, loading, deleteSkill } = useSkillsData();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [pendingSkillId, setPendingSkillId] = useState<string | null>(null);
  const [pendingSkillTitle, setPendingSkillTitle] = useState<string>("");

  const getIconComponent = (iconType: string) => {
    if (iconType.startsWith("http") || iconType.startsWith("blob:")) {
      return (
        <img
          src={iconType}
          alt="Custom icon"
          className="h-12 w-12 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.nextElementSibling?.classList.remove("hidden");
          }}
        />
      );
    }
    switch (iconType) {
      case "code": return <Code className="h-12 w-12 text-primary" />;
      case "server": return <Server className="h-12 w-12 text-primary" />;
      case "edit": return <Edit className="h-12 w-12 text-primary" />;
      case "video": return <Video className="h-12 w-12 text-primary" />;
      case "play": return <Play className="h-12 w-12 text-primary" />;
      default: return <Image className="h-12 w-12 text-primary" />;
    }
  };

  const handleDeleteClick = (skillId: string, skillTitle: string) => {
    setPendingSkillId(skillId);
    setPendingSkillTitle(skillTitle);
    setShowPasswordDialog(true);
  };

  const confirmPasswordAndDelete = () => {
    if (passwordInput === PASSWORD && pendingSkillId) {
      deleteSkill(pendingSkillId);
      setShowPasswordDialog(false);
      setPasswordInput("");
      setPasswordError("");
      setPendingSkillId(null);
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  if (loading) {
    return (
      <section id="skills" className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center">
            <p>Loading skills...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">خبراتي</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            دمج الإبداع والخبرة التقنية والتصميمة لتقديم نتائج متميزة عبر مجموعة متنوعة من التخصصات
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <AddSkillForm />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="content-card relative group"
            >
              <div className="absolute top-2 right-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <EditSkillForm skill={skill} />
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDeleteClick(skill.id, skill.title)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Link
                to={`/skills/${skill.id}`}
                className="flex flex-col items-center text-center p-8 block"
              >
                <div className="mb-6 relative">
                  {getIconComponent(skill.icon)}
                  <Image className="h-12 w-12 text-primary hidden" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                <p className="text-muted-foreground text-sm">{skill.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Password Confirmation Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={(open) => {
        if (!open) {
          setShowPasswordDialog(false);
          setPasswordInput("");
          setPasswordError("");
          setPendingSkillId(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Please enter the password to delete "{pendingSkillTitle}".
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
              onKeyDown={(e) => e.key === 'Enter' && confirmPasswordAndDelete()}
            />
            {passwordError && <p className="text-destructive text-center">{passwordError}</p>}
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmPasswordAndDelete} variant="destructive">
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SkillsGrid;
