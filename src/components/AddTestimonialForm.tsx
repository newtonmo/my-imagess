import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Testimonial } from "@/types/testimonials";
import { Lock } from "lucide-react";

interface AddTestimonialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (testimonial: Omit<Testimonial, "id">) => void;
}

const PASSWORD = "1234"; // الرمز السري الثابت

const AddTestimonialForm = ({ isOpen, onClose, onAdd }: AddTestimonialFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    avatar: "",
    rating: 5
  });
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // عند فتح النموذج، نعرض نافذة كلمة المرور أولاً
      setShowPasswordDialog(true);
      setIsVerified(false);
      setPasswordInput("");
      setPasswordError("");
    }
  }, [isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) return;

    onAdd(formData);
    
    // Reset form
    setFormData({
      name: "",
      role: "",
      content: "",
      avatar: "",
      rating: 5
    });
    onClose();
  };

  const StarRating = ({ rating, onChange }: { rating: number; onChange: (rating: number) => void }) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className={`h-6 w-6 ${i < rating ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition-colors`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={(open) => {
        if (!open) {
          setShowPasswordDialog(false);
          onClose(); // Close the entire form if password dialog is closed
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Password Required
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Please enter the password to add a new testimonial
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
                  onClose();
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

      {/* Testimonial Form Dialog - Only shown after password verification */}
      <Dialog open={isOpen && isVerified} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Testimonial</DialogTitle>
            <DialogDescription>
              Add a new client testimonial to showcase your work.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Client Name*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter client name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="role">Client Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Marketing Director"
              />
            </div>
            
            <div>
              <Label htmlFor="content">Testimonial Text*</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter the testimonial text"
                rows={4}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="avatar">Client Photo URL</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            
            <div>
              <Label>Star Rating</Label>
              <StarRating 
                rating={formData.rating} 
                onChange={(rating) => setFormData({ ...formData, rating })} 
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Add </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddTestimonialForm;