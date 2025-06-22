import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTestimonialsData } from "@/hooks/useTestimonialsData";
import AddTestimonialForm from "./AddTestimonialForm";
import EditTestimonialForm from "./EditTestimonialForm";
import { Testimonial } from "@/types/testimonials";

const Testimonials = () => {
  const { testimonials, loading, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonialsData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // حالات جديدة لحماية كلمة المرور
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [actionType, setActionType] = useState<"edit" | "delete" | null>(null);
  const [targetTestimonial, setTargetTestimonial] = useState<Testimonial | null>(null);
  const [targetTestimonialId, setTargetTestimonialId] = useState<string | null>(null);

  const CORRECT_PASSWORD = "1234"; //  <-- الرمز السري هنا، قم بتغييره!

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleEditClick = (testimonial: Testimonial) => {
    setActionType("edit");
    setTargetTestimonial(testimonial);
    setIsPasswordDialogOpen(true);
    setPasswordInput("");
    setPasswordError("");
  };

  const handleDeleteClick = (testimonialId: string) => {
    setActionType("delete");
    setTargetTestimonialId(testimonialId);
    setIsPasswordDialogOpen(true);
    setPasswordInput("");
    setPasswordError("");
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === CORRECT_PASSWORD) {
      setPasswordError("");
      setIsPasswordDialogOpen(false);

      if (actionType === "edit" && targetTestimonial) {
        setEditingTestimonial(targetTestimonial);
        setIsEditFormOpen(true);
      } else if (actionType === "delete" && targetTestimonialId) {
        setDeleteConfirmId(targetTestimonialId);
      }
      setActionType(null);
      setTargetTestimonial(null);
      setTargetTestimonialId(null);
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleDelete = (testimonialId: string) => {
    deleteTestimonial(testimonialId);
    setDeleteConfirmId(null);
    if (activeIndex >= testimonials.length - 1) {
      setActiveIndex(Math.max(0, testimonials.length - 2));
    }
  };

  const StarDisplay = ({ rating }: { rating: number }) => (
    <div className="inline-flex items-center justify-center text-primary">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${i < rating ? 'fill-current' : 'fill-muted-foreground'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  if (loading) {
    return (
      <section id="testimonials" className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-pulse">Loading testimonials...</div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4">تعليقات  العملاء</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              ماذا يقول الناس عن العمل معي
            </p>
            <Button onClick={() => setIsAddFormOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Testimonial
            </Button>
          </div>
        </div>

        <AddTestimonialForm
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          onAdd={addTestimonial}
        />
      </section>
    );
  }

  return (
    <section id="testimonials" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">تعليقات  العملاء</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            ماذا يقول الناس عن العمل معي
          </p>
          <Button onClick={() => setIsAddFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="content-card text-center p-8 md:p-12 relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(testimonial)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(testimonial.id)}
                        className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mb-6">
                      <StarDisplay rating={testimonial.rating} />
                    </div>
                    <blockquote className="text-lg mb-8">
                      "{testimonial.content}"
                    </blockquote>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary/20">
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-lg font-semibold">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-background text-foreground hover:text-primary p-2 rounded-full shadow-lg border border-border transform transition-transform hover:scale-110"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-background text-foreground hover:text-primary p-2 rounded-full shadow-lg border border-border transform transition-transform hover:scale-110"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="flex justify-center mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full mx-1 transition-colors ${
                      index === activeIndex
                        ? "bg-primary"
                        : "bg-border hover:bg-muted-foreground"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <AddTestimonialForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAdd={addTestimonial}
      />

      <EditTestimonialForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setEditingTestimonial(null);
        }}
        onUpdate={updateTestimonial}
        testimonial={editingTestimonial}
      />

      {/* نافذة تأكيد كلمة المرور الجديدة */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
              Please enter the password to proceed with this action.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="auth-password"
                type="password"
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
              />
              {passwordError && <p className="text-destructive text-sm mt-1">{passwordError}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasswordSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد الحذف الفعلية (بعد تأكيد كلمة المرور) */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default Testimonials;
