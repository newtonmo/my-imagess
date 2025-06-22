import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Lock } from "lucide-react";
import { useNewsData } from "@/hooks/useNewsData";
import AddNewsForm from "./AddNewsForm";
import EditNewsForm from "./EditNewsForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const PASSWORD = "1234";

const NewsCarousel = () => {
  const { newsItems, loading, addNewsItem, updateNewsItem, deleteNewsItem } = useNewsData();
  const containerRef = useRef<HTMLDivElement>(null);

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container || newsItems.length === 0) return;

    const cloneItems = () => {
      const items = container.querySelectorAll(".news-item");
      items.forEach((item) => {
        const clone = item.cloneNode(true);
        container.appendChild(clone);
      });
    };

    cloneItems();
  }, [newsItems]);

  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowPasswordDialog(true);
  };

  const handlePasswordConfirm = () => {
    if (passwordInput === PASSWORD && pendingDeleteId) {
      deleteNewsItem(pendingDeleteId);
      setPendingDeleteId(null);
      setShowPasswordDialog(false);
      setPasswordInput("");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  if (loading) {
    return (
      <section id="news" className="py-8 bg-secondary/50">
        <div className="container-custom">
          <div className="text-center">Loading news...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="news" className="py-8 bg-secondary/50">
      <div className="container-custom mb-4">
        <div className="flex justify-between items-center">
          <h2 className="heading-md">اخر الاخبار والاعمال</h2>
          <div className="flex space-x-2">
            <AddNewsForm onAdd={addNewsItem} />
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <div ref={containerRef} className="flex whitespace-nowrap animate-slide">
          {newsItems.map((item) => (
            <div key={item.id} className="news-item inline-flex items-center px-8 group">
              <div className="flex items-center">
                <span className="rounded-full w-3 h-3 bg-primary mr-4"></span>
                <span className="font-medium mr-2">{item.text}</span>
                <span className="text-muted-foreground text-sm mr-4">{item.date}</span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                  <EditNewsForm newsItem={item} onUpdate={updateNewsItem} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => requestDelete(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={(open) => {
        if (!open) {
          setShowPasswordDialog(false);
          setPendingDeleteId(null);
          setPasswordInput("");
          setPasswordError("");
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Enter password to delete this news item
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
              onKeyDown={(e) => e.key === "Enter" && handlePasswordConfirm()}
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
              >
                Cancel
              </Button>
              <Button onClick={handlePasswordConfirm} variant="destructive">
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NewsCarousel;
