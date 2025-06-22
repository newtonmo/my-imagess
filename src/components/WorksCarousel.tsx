import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Plus, Edit, Trash2, Lock } from "lucide-react";
import ProjectThumbnail from "./ProjectThumbnail";
import AddFeaturedWorkForm from "./AddFeaturedWorkForm";
import EditFeaturedWorkForm from "./EditFeaturedWorkForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFeaturedWorks } from "@/hooks/useFeaturedWorks";
import { useCarousel as useCustomCarousel } from "@/hooks/use-carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";

// ضع كلمة المرور هنا
const PASSWORD = "1234";

const WorksCarousel = () => {
  const isMobile = useIsMobile();
  const { works, loading, addWork, updateWork, deleteWork } = useFeaturedWorks();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingWork, setEditingWork] = useState<number | null>(null);
  const [deletingWork, setDeletingWork] = useState<number | null>(null);
  const [showDeletePasswordDialog, setShowDeletePasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const {
    api,
    setApi,
    currentIndex,
    pause,
    resume
  } = useCustomCarousel({
    autoplayInterval: 5000,
    pauseOnHover: true
  });

  const handleAddWork = (workData: Omit<typeof works[0], 'id'>) => {
    addWork(workData);
    setShowAddDialog(false);
  };

  const handleEditWork = (workData: Omit<typeof works[0], 'id'>) => {
    if (editingWork !== null) {
      updateWork(editingWork, workData);
      setEditingWork(null);
    }
  };

  const handleDeleteWork = () => {
    if (deletingWork !== null) {
      deleteWork(deletingWork);
      setDeletingWork(null);
    }
  };

  const checkDeletePassword = () => {
    if (passwordInput === PASSWORD) {
      setShowDeletePasswordDialog(false);
      setPasswordError("");
      setPasswordInput("");
      handleDeleteWork();
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleEditClick = (workId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingWork(workId);
  };

  const handleDeleteClick = (workId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingWork(workId);
    setShowDeletePasswordDialog(true);
  };

  const editingWorkData = editingWork !== null ? works.find(w => w.id === editingWork) : null;
  const deletingWorkData = deletingWork !== null ? works.find(w => w.id === deletingWork) : null;

  if (loading) {
    return (
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-pulse">تحميل الافكار و التطلعات ...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background" id="featured-works">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-3">
            <h2 className="heading-lg">الافكار و التطلعات</h2>
            <Button
              onClick={() => setShowAddDialog(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            ألق نظرة على بعض افكاري
          </p>
        </div>

        <div className="mx-auto max-w-5xl px-4">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {works.map((work) => (
                <CarouselItem
                  key={work.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-full md:basis-4/5 lg:basis-3/4"
                >
                  <Link to={`/featured-work/${work.id}`} className="block group relative h-full overflow-hidden border border-border shadow-lg bg-card rounded-xl">
                    <div className="h-48 sm:h-64 md:h-80">
                      <ProjectThumbnail
                        image={work.image}
                        video={work.video}
                        alt={work.title}
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => handleEditClick(work.id, e)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={(e) => handleDeleteClick(work.id, e)}
                        variant="destructive"
                        size="sm"
                        className="flex gap-1 items-center px-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="absolute inset-0">
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <div className="mb-2">
                          <span className="text-xs font-medium px-3 py-1 bg-primary/20 backdrop-blur-sm text-primary rounded-full">
                            {work.category}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-4">
                          {work.title}
                        </h3>
                        {work.description && (
                          <p className="text-sm text-muted-foreground mb-2 sm:mb-4 line-clamp-2">
                            {work.description}
                          </p>
                        )}
                        <div className="inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                          View Details
                          <ExternalLink className="ml-1 h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
              <CarouselPrevious className="static translate-y-0 mx-1" />
              <div className="flex gap-1.5">
                {works.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${index === currentIndex ? "bg-primary" : "bg-primary/30"}`}
                    onClick={() => api?.scrollTo(index)}
                  />
                ))}
              </div>
              <CarouselNext className="static translate-y-0 mx-1" />
            </div>
          </Carousel>
        </div>
      </div>

      {/* Add Featured Work Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Featured Work</DialogTitle>
          </DialogHeader>
          <AddFeaturedWorkForm
            onSubmit={handleAddWork}
            onCancel={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Featured Work Dialog */}
      <Dialog open={editingWork !== null} onOpenChange={(open) => !open && setEditingWork(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {editingWorkData && (
            <EditFeaturedWorkForm
              work={editingWorkData}
              onSubmit={handleEditWork}
              onCancel={() => setEditingWork(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Password Dialog */}
      <Dialog
        open={showDeletePasswordDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowDeletePasswordDialog(false);
            setPasswordInput("");
            setPasswordError("");
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" /> Enter Password
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-3 py-2 border rounded text-sm"
            />
            {passwordError && <p className="text-destructive text-sm">{passwordError}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowDeletePasswordDialog(false)}>Cancel</Button>
              <Button onClick={checkDeletePassword}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog (optional, if you still want to show) */}
      {/* يمكنك حذفه إن كنت تعتمد على نافذة كلمة المرور فقط */}
    </section>
  );
};

export default WorksCarousel;
