import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Trash2, Edit, Plus, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VideoPlayer from "../components/VideoPlayer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import EditProjectForm from "../components/EditProjectForm";
import { getVideoInfo } from "@/utils/videoUtils";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { items, loading, error, updateItem, deleteItem } = usePortfolioData();
  const [project, setProject] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [showAddMediaDialog, setShowAddMediaDialog] = useState(false);

  // حالات جديدة للرمز السري ورسالة الخطأ
  const [mediaPassword, setMediaPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (projectId && items.length > 0) {
      const foundProject = items.find(p => String(p.id) === String(projectId));
      if (foundProject) {
        setProject(foundProject);
        // Set initial selected image
        const allMedia = getAllMedia(foundProject);
        if (allMedia.length > 0) {
          setSelectedImage(allMedia[0]);
        }
        window.scrollTo(0, 0);
      }
    }
  }, [projectId, items]);

  const getAllMedia = (projectData: any) => {
    const media = [];
    
    // Add main video if exists
    if (projectData.video) {
      media.push(projectData.video);
    }
    
    // Add detail image if different from main image
    if (projectData.detailImage && projectData.detailImage !== projectData.image) {
      media.push(projectData.detailImage);
    }
    
    // Add main image
    if (projectData.image) {
      media.push(projectData.image);
    }
    
    // Add gallery images/videos
    if (projectData.galleryImages && Array.isArray(projectData.galleryImages)) {
      projectData.galleryImages.forEach(mediaItem => {
        // Avoid duplicates
        if (!media.includes(mediaItem)) {
          media.push(mediaItem);
        }
      });
    }
    
    return media;
  };

  const isVideoUrl = (url: string) => {
    const videoInfo = getVideoInfo(url);
    return videoInfo.type !== 'direct' || /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  const handleEditProject = () => {
    setShowEditDialog(true);
  };

  const handleUpdateProject = async (formData: any) => {
    if (project) {
      const updatedProject = updateItem(project.id, formData);
      if (updatedProject) {
        setProject(updatedProject);
        setShowEditDialog(false);
      }
    }
  };

  const handleDeleteProject = () => {
    if (project) {
      deleteItem(project.id);
      navigate("/#portfolio");
    }
  };

  const handleAddMedia = () => {
    // الرمز السري الصحيح - يجب تغييره بكلمة مرورك الخاصة
    const CORRECT_PASSWORD = "1234"; // <--- غيّر هذا!

    if (!newMediaUrl.trim()) return;

    if (mediaPassword !== CORRECT_PASSWORD) {
        setPasswordError("Incorrect password. Please try again.");
        return; // توقف العملية إذا كانت كلمة المرور غير صحيحة
    }

    // إذا كانت كلمة المرور صحيحة، أفرغ رسالة الخطأ
    setPasswordError("");

    const currentGalleryImages = project.galleryImages || [];
    const updatedGalleryImages = [...currentGalleryImages];
    
    // Add new media if not already present
    if (!updatedGalleryImages.includes(newMediaUrl.trim())) {
      updatedGalleryImages.push(newMediaUrl.trim());
    }

    const updatedProjectData = {
      ...project,
      galleryImages: updatedGalleryImages
    };

    delete updatedProjectData.id;
    const updatedProject = updateItem(project.id, updatedProjectData);
    
    if (updatedProject) {
      setProject(updatedProject);
      setNewMediaUrl("");
      setMediaPassword(""); // إفراغ حقل كلمة المرور بعد الإضافة
      setShowAddMediaDialog(false);
      
      // Update the gallery view to show the new media
      const allMedia = getAllMedia(updatedProject);
      const newMediaIndex = allMedia.indexOf(newMediaUrl.trim());
      if (newMediaIndex !== -1) {
        setSelectedImage(newMediaUrl.trim());
        setCurrentGalleryIndex(newMediaIndex);
      }
    }
  };

  const handleDeleteMedia = (mediaUrl: string) => {
    if (!project) return;

    const currentGalleryImages = project.galleryImages || [];
    const updatedGalleryImages = currentGalleryImages.filter(img => img !== mediaUrl);

    let updatedProjectData = {
      ...project,
      galleryImages: updatedGalleryImages
    };

    // If deleting the detail image, clear it
    if (project.detailImage === mediaUrl) {
      updatedProjectData.detailImage = "";
    }

    delete updatedProjectData.id;
    const updatedProject = updateItem(project.id, updatedProjectData);
    
    if (updatedProject) {
      setProject(updatedProject);
      
      // Update selected media if needed
      const allMedia = getAllMedia(updatedProject);
      if (allMedia.length > 0 && selectedImage === mediaUrl) {
        setSelectedImage(allMedia[0]);
        setCurrentGalleryIndex(0);
      } else if (selectedImage === mediaUrl) {
        setSelectedImage(null);
        setCurrentGalleryIndex(0);
      }
    }
  };

  const allMedia = project ? getAllMedia(project) : [];

  const nextGalleryImage = () => {
    if (allMedia && allMedia.length > 0) {
      const nextIndex = currentGalleryIndex === allMedia.length - 1 ? 0 : currentGalleryIndex + 1;
      setCurrentGalleryIndex(nextIndex);
      setSelectedImage(allMedia[nextIndex]);
    }
  };

  const prevGalleryImage = () => {
    if (allMedia && allMedia.length > 0) {
      const prevIndex = currentGalleryIndex === 0 ? allMedia.length - 1 : currentGalleryIndex - 1;
      setCurrentGalleryIndex(prevIndex);
      setSelectedImage(allMedia[prevIndex]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">Loading project...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-destructive">Failed to load project: {error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Project not found</h2>
            <Link to="/#portfolio" className="btn-primary inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="w-full h-[50vh] md:h-[70vh] relative overflow-hidden">
          {project.video ? (
            <VideoPlayer 
              src={project.video} 
              autoPlay={true}
              loopCount={3}
              muted={true}
              playsInline
              controls={true}
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={selectedImage || project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="container-custom">
              <h1 className="heading-lg text-white mb-2">{project.title}</h1>
              <p className="text-white/90 text-lg max-w-2xl">{project.description}</p>
            </div>
          </div>
        </div>

        <div className="section-padding">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
              <Link to="/#portfolio" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
              </Link>
              
              <div className="flex gap-2">
                <Button onClick={handleEditProject} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    {/* زر الحذف مع أيقونة Trash2 */}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Project</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{project?.title}"? This action cannot be undone and you will be redirected back to the portfolio.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="heading-md mb-4">Project Overview</h2>
                  <p className="text-muted-foreground mb-6">
                    {project.fullDescription || project.longDescription || project.description}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">What I Did</h3>
                    <div className="flex items-center mb-2">
                      <div className="w-24 font-medium">Timeline:</div>
                      <div>{project.timeline || "N/A"}</div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-24 font-medium">Role:</div>
                      <div>{project.category} Lead</div>
                    </div>
                  </div>

                  {project.challenges && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3">Challenges</h3>
                      <p className="text-muted-foreground">{project.challenges}</p>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold">Media Gallery</h3>
                      {/* زر إضافة الوسائط (Add Media) */}
                      <Button onClick={() => {
                        setShowAddMediaDialog(true);
                        setMediaPassword(""); // مسح كلمة المرور عند فتح النافذة
                        setPasswordError(""); // مسح رسالة الخطأ عند فتح النافذة
                      }} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Media
                      </Button>
                    </div>
                    
                    {allMedia.length > 0 ? (
                      <div className="relative">
                        <div className="rounded-lg overflow-hidden aspect-video bg-muted mb-3">
                          {selectedImage && isVideoUrl(selectedImage) ? (
                            <VideoPlayer
                              src={selectedImage}
                              controls={true}
                              muted={false}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img 
                              src={selectedImage || allMedia[0]} 
                              alt={`${project.title} gallery`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        {allMedia.length > 1 && (
                          <>
                            <button
                              onClick={prevGalleryImage}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-border transform transition-transform hover:scale-110"
                              aria-label="Previous media"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>

                            <button
                              onClick={nextGalleryImage}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-border transform transition-transform hover:scale-110"
                              aria-label="Next media"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </>
                        )}

                        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                          {allMedia.map((media, i) => {
                            const isVideo = isVideoUrl(media);
                            return (
                              <div key={`${media}-${i}`} className="relative flex-shrink-0">
                                <button
                                  onClick={() => {
                                    setSelectedImage(media);
                                    setCurrentGalleryIndex(i);
                                  }}
                                  className={`border-2 rounded overflow-hidden transition-all ${
                                    selectedImage === media ? 'border-primary' : 'border-transparent hover:border-primary/50'
                                  }`}
                                >
                                  {isVideo ? (
                                    <div className="w-20 h-14 bg-muted flex items-center justify-center relative">
                                      <VideoPlayer
                                        src={media}
                                        muted={true}
                                        className="w-full h-full object-cover"
                                        controls={false}
                                      />
                                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <span className="text-white text-xs font-medium">▶</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <img
                                      src={media}
                                      alt={`Thumbnail ${i + 1}`}
                                      className="w-20 h-14 object-cover"
                                      loading="lazy"
                                    />
                                  )}
                                </button>
                                
                                {/* زر الحذف الخاص بالصور المرفقة (Trash2) */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMedia(media);
                                  }}
                                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                                  aria-label="Delete media"
                                >
                                  <X className="h-3 w-3" /> {/* أيقونة الحذف X */}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No media added yet. Click "Add Media" to get started.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update your project details and information.
            </DialogDescription>
          </DialogHeader>
          {project && (
            <EditProjectForm
              project={project}
              onSubmit={handleUpdateProject}
              onCancel={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddMediaDialog} onOpenChange={setShowAddMediaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Media</DialogTitle>
            <DialogDescription>
              Add an image or video URL to your project gallery.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="media-url" className="block text-sm font-medium mb-2">
                Image or Video URL
              </label>
              <Input
                id="media-url"
                placeholder="https://example.com/image.jpg or video.mp4"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
              />
            </div>
            {/* إضافة حقل كلمة المرور */}
            <div>
              <label htmlFor="media-password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="media-password"
                type="password"
                placeholder="Enter password"
                value={mediaPassword}
                onChange={(e) => {
                  setMediaPassword(e.target.value);
                  setPasswordError(""); // مسح الخطأ عند بدء الكتابة
                }}
              />
              {passwordError && <p className="text-destructive text-sm mt-1">{passwordError}</p>}
            </div>
            {/* نهاية إضافة حقل كلمة المرور */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddMediaDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMedia} disabled={!newMediaUrl.trim() || !mediaPassword.trim()}>
                Add Media
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ProjectDetail;