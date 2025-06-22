import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Plus, Trash2, Edit, Lock } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import ProjectThumbnail from "./ProjectThumbnail";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import AddProjectForm from "./AddProjectForm";
import EditProjectForm from "./EditProjectForm";

const FILTERS = ["All", "Design", "Development"];
const PASSWORD = "1234"; // الرمز السري الثابت

const PortfolioSection = () => {
  const { items, loading, error, addItem, updateItem, deleteItem, refreshData } = usePortfolioData();
  const [filter, setFilter] = useState("All");
  const [isVisible, setIsVisible] = useState(false);
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeletePasswordDialog, setShowDeletePasswordDialog] = useState(false); // حالة جديدة للحذف
  const [passwordInput, setPasswordInput] = useState("");
  const [deletePasswordInput, setDeletePasswordInput] = useState(""); // رمز الحذف
  const [passwordError, setPasswordError] = useState("");
  const [deletePasswordError, setDeletePasswordError] = useState(""); // خطأ رمز الحذف
  const [editingProject, setEditingProject] = useState<any>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    projectId: number | null;
    projectTitle: string;
  }>({
    isOpen: false,
    projectId: null,
    projectTitle: ""
  });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredProjects =
    filter === "All"
      ? items
      : items.filter((project) => project.category === filter);

  // التحقق من صحة الرمز السري
  const checkPassword = () => {
    if (passwordInput === PASSWORD) {
      setShowPasswordDialog(false);
      setShowAddProjectDialog(true);
      setPasswordError("");
      setPasswordInput("");
    } else {
      setPasswordError("الرمز السري غير صحيح. حاول مرة أخرى.");
    }
  };

  // التحقق من صحة الرمز السري للحذف
  const checkDeletePassword = () => {
    if (deletePasswordInput === PASSWORD) {
      setShowDeletePasswordDialog(false);
      setDeletePasswordError("");
      setDeletePasswordInput("");
      confirmDelete();
    } else {
      setDeletePasswordError("الرمز السري غير صحيح. حاول مرة أخرى.");
    }
  };

  // فتح نافذة إدخال الرمز السري
  const handleAddProjectClick = () => {
    setShowPasswordDialog(true);
  };

  const handleAddProject = async (formData: any) => {
    try {
      await addItem(formData);
      setShowAddProjectDialog(false);
      setTimeout(() => {
        refreshData();
      }, 100);
    } catch (error) {
      console.error("PortfolioSection: Error adding project:", error);
    }
  };

  const handleEditProject = (project: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setEditingProject(project);
  };

  const handleUpdateProject = async (formData: any) => {
    if (!editingProject) return;
    
    try {
      await updateItem(editingProject.id, formData);
      setEditingProject(null);
      setTimeout(() => {
        refreshData();
      }, 100);
    } catch (error) {
      console.error("PortfolioSection: Error updating project:", error);
    }
  };

  const handleDeleteClick = (projectId: number, projectTitle: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // بدلاً من فتح تأكيد الحذف مباشرة، نفتح نافذة الرمز السري للحذف
    setShowDeletePasswordDialog(true);
    setDeleteConfirmation({
      isOpen: false,
      projectId,
      projectTitle
    });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.projectId) {
      deleteItem(deleteConfirmation.projectId);
      setDeleteConfirmation({
        isOpen: false,
        projectId: null,
        projectTitle: ""
      });
    }
  };

  const cancelDelete = () => {
    setShowDeletePasswordDialog(false);
    setDeleteConfirmation({
      isOpen: false,
      projectId: null,
      projectTitle: ""
    });
  };

  return (
    <section id="portfolio" className="section-padding" ref={sectionRef}>
      <div className="container-custom">
        <div className="text-center mb-10 relative">
          <div className="absolute right-0 top-0">
            <Button 
              onClick={handleAddProjectClick} 
              size="sm" 
              className="rounded-full" 
              variant="default"
              aria-label="Add new project"
            >
              <Lock className="h-4 w-4 mr-1" />
              <Plus className="h-5 w-5" />
              <span className="ml-1 hidden sm:inline-block"></span>
            </Button>
          </div>
          <h2 className="heading-lg mb-2">معرض أعمالي</h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            تصفح بعض أعمالي الأخيرة في مختلف التخصصات
          </p>
        </div>

        <div className="flex justify-center mb-8 gap-3 flex-wrap">
          {FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full border transition-all font-medium text-base 
                ${
                  filter === cat
                    ? "bg-primary text-primary-foreground shadow"
                    : "bg-background/60 text-foreground border-border hover:bg-secondary/60"
                }
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
              aria-pressed={filter === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-muted-foreground">جاري تحميل المعرض...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <p className="text-muted-foreground">
              {error ? `${error}. ` : ""}سيتم عرض الاعمال المستقبلية هنا
            </p>
            <Button 
              onClick={handleAddProjectClick} 
              variant="default"
              className="mt-2"
            >
              <Lock className="h-4 w-4 mr-2" />
              <Plus className="h-5 w-5 mr-2" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8">
            {filteredProjects.map((project, idx) => (
              <div
                key={`${project.id}-${project.title}`}
                className={`content-card group flex flex-col hover:shadow-2xl transition-shadow duration-200 overflow-hidden relative
                  ${isVisible ? "animate-fade-in" : "opacity-0"}
                `}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    onClick={(e) => handleEditProject(project, e)}
                    size="icon"
                    variant="secondary"
                    className="w-8 h-8"
                    aria-label={`Edit ${project.title}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={(e) => handleDeleteClick(project.id, project.title, e)}
                    size="icon"
                    variant="destructive"
                    className="w-8 h-8"
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <Link
                  to={`/project/${project.id}`}
                  className="flex flex-col flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  tabIndex={0}
                >
                  <ProjectThumbnail 
                    image={project.image} 
                    video={project.video} 
                    alt={project.title + " preview"} 
                  />
                  <h3 className="heading-md mb-1 mt-4 text-lg sm:text-xl">{project.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-2">{project.description}</p>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-primary">
                      {project.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tags && project.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-block text-xs sm:text-sm bg-secondary/60 px-2 py-1 rounded font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                    تفاصيل المشروع <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </div>
                </Link>
              </div>
            ))}
            {filteredProjects.length === 0 && items.length > 0 && (
              <div className="col-span-full text-center text-muted-foreground py-16">
                لا توجد مشاريع في هذا التصنيف.
              </div>
            )}
          </div>
        )}
      </div>

      {/* نافذة إدخال الرمز السري للإضافة */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              التحقق بالرمز السري
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              الرجاء إدخال الرمز السري لإضافة مشروع جديد
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPasswordError("");
              }}
              className={`w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-primary ${
                passwordError ? "border-destructive" : "border-border"
              }`}
              placeholder="أدخل الرمز السري"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
            />
            {passwordError && (
              <p className="text-destructive text-center">{passwordError}</p>
            )}
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setPasswordInput("");
                  setPasswordError("");
                }}
                className="px-6"
              >
                إلغاء
              </Button>
              <Button
                onClick={checkPassword}
                variant="default"
                className="px-6"
              >
                تأكيد
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة إدخال الرمز السري للحذف */}
      <Dialog open={showDeletePasswordDialog} onOpenChange={setShowDeletePasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              التحقق بالرمز السري
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              الرجاء إدخال الرمز السري لحذف المشروع
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <input
              type="password"
              value={deletePasswordInput}
              onChange={(e) => {
                setDeletePasswordInput(e.target.value);
                setDeletePasswordError("");
              }}
              className={`w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-primary ${
                deletePasswordError ? "border-destructive" : "border-border"
              }`}
              placeholder="أدخل الرمز السري"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && checkDeletePassword()}
            />
            {deletePasswordError && (
              <p className="text-destructive text-center">{deletePasswordError}</p>
            )}
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="px-6"
              >
                إلغاء
              </Button>
              <Button
                onClick={checkDeletePassword}
                variant="destructive"
                className="px-6"
              >
                حذف
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Project Dialog */}
      <Dialog open={showAddProjectDialog} onOpenChange={setShowAddProjectDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">إضافة مشروع جديد</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              املأ التفاصيل أدناه لإضافة مشروع جديد إلى معرض أعمالك
            </DialogDescription>
          </DialogHeader>
          <AddProjectForm onSubmit={handleAddProject} />
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">تعديل المشروع</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              قم بتحديث تفاصيل مشروعك أدناه
            </DialogDescription>
          </DialogHeader>
          {editingProject && (
            <EditProjectForm 
              project={editingProject}
              onSubmit={handleUpdateProject}
              onCancel={() => setEditingProject(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - لم تعد تستخدم مباشرة */}
    </section>
  );
};

export default PortfolioSection;