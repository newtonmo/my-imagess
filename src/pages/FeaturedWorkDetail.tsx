import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight, Trash2, Edit, Plus, Video, Image, Lock } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VideoPlayer from "../components/VideoPlayer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFeaturedWorks } from "@/hooks/useFeaturedWorks";
import EditFeaturedWorkForm from "../components/EditFeaturedWorkForm";
import { getVideoInfo, isVideoUrl } from "@/utils/videoUtils";

const PASSWORD = "1234"; // الرمز السري الثابت

const FeaturedWorkDetail = () => {
  const { workId } = useParams();
  const navigate = useNavigate();
  const { works, loading, updateWork, deleteWork } = useFeaturedWorks();
  const [work, setWork] = useState<any | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddMediaDialog, setShowAddMediaDialog] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaType, setNewMediaType] = useState<"image" | "video">("image");
  const [showDeletePasswordDialog, setShowDeletePasswordDialog] = useState(false);
  const [showAddMediaPasswordDialog, setShowAddMediaPasswordDialog] = useState(false); // حالة جديدة للإضافة
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (workId && works.length > 0) {
      const foundWork = works.find(w => String(w.id) === String(workId));
      if (foundWork) {
        setWork(foundWork);
        // Set initial selected image
        const allMedia = getAllMedia(foundWork);
        if (allMedia.length > 0) {
          setSelectedImage(allMedia[0]);
        }
        window.scrollTo(0, 0);
      }
    }
  }, [workId, works]);

  const getAllMedia = (workData: any) => {
    const media = [];

    // Add main video if exists
    if (workData.video) {
      media.push(workData.video);
    }

    // Add detail image if different from main image
    if (workData.detailImage && workData.detailImage !== workData.image) {
      media.push(workData.detailImage);
    }

    // Add main image
    if (workData.image) {
      media.push(workData.image);
    }

    // Add gallery images/videos
    if (workData.galleryImages && Array.isArray(workData.galleryImages)) {
      workData.galleryImages.forEach(mediaItem => {
        // Avoid duplicates
        if (!media.includes(mediaItem)) {
          media.push(mediaItem);
        }
      });
    }

    return media;
  };

  const handleEditWork = () => {
    setShowEditDialog(true);
  };

  const handleUpdateWork = async (formData: any) => {
    if (work) {
      // Preserve existing gallery images and video when updating
      const updatedWorkData = {
        ...formData,
        galleryImages: work.galleryImages || [],
        video: work.video || ""
      };

      const updatedWork = updateWork(work.id, updatedWorkData);
      if (updatedWork) {
        setWork(updatedWork);
        setShowEditDialog(false);
      }
    }
  };

  const handleDeleteWork = () => {
    if (work) {
      deleteWork(work.id);
      navigate("/#featured-works");
    }
  };

  const handleAddMedia = () => {
    if (!newMediaUrl.trim() || !work) return;

    const currentGalleryImages = work.galleryImages || [];
    const updatedGalleryImages = [...currentGalleryImages];

    if (newMediaType === "video") {
      // For videos, update the main video field instead of adding to gallery
      const updatedWorkData = {
        ...work,
        video: newMediaUrl.trim(),
        galleryImages: currentGalleryImages
      };

      delete updatedWorkData.id;
      const result = updateWork(work.id, updatedWorkData);
      if (result) {
        setWork(result);
      }
    } else {
      // For images, add to gallery if not already present
      if (!updatedGalleryImages.includes(newMediaUrl.trim())) {
        updatedGalleryImages.push(newMediaUrl.trim());
      }

      const updatedWorkData = {
        ...work,
        galleryImages: updatedGalleryImages
      };

      delete updatedWorkData.id;
      const result = updateWork(work.id, updatedWorkData);
      if (result) {
        setWork(result);
      }
    }

    setNewMediaUrl("");
    setShowAddMediaDialog(false);

    // Update the gallery view to show the new media
    const allMedia = getAllMedia({...work, [newMediaType === "video" ? "video" : "galleryImages"]: newMediaType === "video" ? newMediaUrl.trim() : [...(work.galleryImages || []), newMediaUrl.trim()]});
    const newMediaIndex = allMedia.indexOf(newMediaUrl.trim());
    if (newMediaIndex !== -1) {
      setSelectedImage(newMediaUrl.trim());
      setCurrentGalleryIndex(newMediaIndex);
    }
  };

  const handleDeleteMedia = (mediaUrl: string) => {
    if (!work) return;

    const currentGalleryImages = work.galleryImages || [];
    let updatedWorkData = { ...work };

    // Check if it's the main video being deleted
    if (work.video === mediaUrl) {
      updatedWorkData.video = "";
    }

    // Check if it's a gallery image being deleted
    if (currentGalleryImages.includes(mediaUrl)) {
      updatedWorkData.galleryImages = currentGalleryImages.filter(img => img !== mediaUrl);
    }

    // If deleting the detail image, clear it
    if (work.detailImage === mediaUrl) {
      updatedWorkData.detailImage = "";
    }

    delete updatedWorkData.id;
    const result = updateWork(work.id, updatedWorkData);

    if (result) {
      setWork(result);

      // Update selected media if needed
      const allMedia = getAllMedia(result);
      if (allMedia.length > 0 && selectedImage === mediaUrl) {
        setSelectedImage(allMedia[0]);
        setCurrentGalleryIndex(0);
      } else if (selectedImage === mediaUrl) {
        setSelectedImage(null);
        setCurrentGalleryIndex(0);
      }
    }
  };

  // التحقق من الرمز السري للحذف
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

  // التحقق من الرمز السري للإضافة
  const checkAddMediaPassword = () => {
    if (passwordInput === PASSWORD) {
      setShowAddMediaPasswordDialog(false);
      setPasswordError("");
      setPasswordInput("");
      setShowAddMediaDialog(true); // افتح نافذة إضافة الوسائط بعد التحقق
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const allMedia = work ? getAllMedia(work) : [];

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
          <div className="text-center text-muted-foreground">Loading featured work...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Featured work not found</h2>
            <Link to="/#featured-works" className="btn-primary inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> الرجوع الى الافكار والتطلعات
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
          {work.video ? (
            <VideoPlayer
              src={work.video}
              autoPlay={true}
              loopCount={3}
              muted={true}
              playsInline
              controls={true}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={selectedImage || work.image}
              alt={work.title}
              className="w-full h-full object-cover"
            />
          )}
          {/* Only apply overlay to images, not videos */}
          {!work.video && (
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
          )}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="container-custom">
              <h1 className="heading-lg text-white mb-2">{work.title}</h1>
              <p className="text-white/90 text-lg max-w-2xl">{work.description}</p>
            </div>
          </div>
        </div>

        <div className="section-padding">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
              <Link to="/#featured-works" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> الرجوع الى الافكار والتطلعات
              </Link>

              <div className="flex gap-2">
                <Button onClick={handleEditWork} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Work
                </Button>

                <Button
                  onClick={() => setShowDeletePasswordDialog(true)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Work
                </Button>
              </div>
            </div>

            {/* Simplified single-column layout */}
            <div className="max-w-4xl mx-auto">
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="heading-md mb-4">Work Overview</h2>
                  <p className="text-muted-foreground mb-6">
                    {work.fullDescription || work.longDescription || work.description}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">What I Did</h3>
                    <div className="flex items-center mb-2">
                      <div className="w-24 font-medium">Timeline:</div>
                      <div>{work.timeline || "N/A"}</div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-24 font-medium">Role:</div>
                      <div>{work.category} Lead</div>
                    </div>
                  </div>

                  {work.challenges && (
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3">Challenges</h3>
                      <p className="text-muted-foreground">{work.challenges}</p>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold">Media Gallery</h3>
                      <Button onClick={() => setShowAddMediaPasswordDialog(true)} size="sm">
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
                              alt={`${work.title} gallery`}
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
                                      {getVideoInfo(media).type === 'direct' ? (
                                        <video
                                          src={media}
                                          className="w-full h-full object-cover"
                                          muted
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                          <Video className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                      )}
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

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMedia(media);
                                  }}
                                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                                  aria-label="Delete media"
                                >
                                  <Trash2 className="h-3 w-3" />
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
      <Footer />

      {/* Edit Featured Work Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {work && (
            <EditFeaturedWorkForm
              work={work}
              onSubmit={handleUpdateWork}
              onCancel={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Media Dialog */}
      <Dialog open={showAddMediaDialog} onOpenChange={setShowAddMediaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Media to Gallery</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="media-type">Media Type</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  type="button"
                  variant={newMediaType === "image" ? "default" : "outline"}
                  onClick={() => setNewMediaType("image")}
                  className="flex items-center gap-2"
                >
                  <Image className="h-4 w-4" />
                  Image
                </Button>
                <Button
                  type="button"
                  variant={newMediaType === "video" ? "default" : "outline"}
                  onClick={() => setNewMediaType("video")}
                  className="flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Video
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="media-url">
                {newMediaType === "video" ? "Video URL" : "Image URL"}
              </Label>
              <Input
                id="media-url"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                placeholder={
                  newMediaType === "video"
                    ? "Enter video URL (YouTube, Vimeo, or direct .mp4)..."
                    : "Enter image URL..."
                }
              />
              {newMediaType === "video" && (
                <p className="text-sm text-muted-foreground mt-1">
                  Supports YouTube, Vimeo, and direct video file links
                </p>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddMediaDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMedia} disabled={!newMediaUrl.trim()}>
                Add {newMediaType === "video" ? "Video" : "Image"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة طلب الرمز السري للحذف */}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Password Required
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Please enter the password to delete this featured work
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
              onKeyDown={(e) => e.key === 'Enter' && checkDeletePassword()}
            />
            {passwordError && (
              <p className="text-destructive text-center">{passwordError}</p>
            )}
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeletePasswordDialog(false);
                  setPasswordInput("");
                  setPasswordError("");
                }}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={checkDeletePassword}
                variant="default"
                className="px-6"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* نافذة طلب الرمز السري للإضافة */}
      <Dialog
        open={showAddMediaPasswordDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddMediaPasswordDialog(false);
            setPasswordInput("");
            setPasswordError("");
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Password Required
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Please enter the password to add media to this featured work
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
              onKeyDown={(e) => e.key === 'Enter' && checkAddMediaPassword()}
            />
            {passwordError && (
              <p className="text-destructive text-center">{passwordError}</p>
            )}
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddMediaPasswordDialog(false);
                  setPasswordInput("");
                  setPasswordError("");
                }}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={checkAddMediaPassword}
                variant="default"
                className="px-6"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeaturedWorkDetail;
