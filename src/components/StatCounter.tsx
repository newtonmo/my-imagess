import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useStatsData } from "@/hooks/useStatsData";
import AddStatForm from "./AddStatForm";
import EditStatForm from "./EditStatForm";
import { Stat } from "@/types/stats";

const PASSWORD = "1234";

interface StatProps {
  stat: Stat;
  duration?: number;
  onEdit: (statId: string, updatedStat: Omit<Stat, "id">) => void;
  onDelete: (statId: string) => void;
}

const StatItem = ({ stat, duration = 2000, onEdit, onDelete }: StatProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mode, setMode] = useState<"delete" | "edit" | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  const handleDeleteClick = () => {
    setMode("delete");
    setModalOpen(true);
  };

  const handleEditClick = () => {
    setMode("edit");
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (passwordInput === PASSWORD) {
      setPasswordError("");
      setPasswordInput("");
      setModalOpen(false);
      if (mode === "delete") {
        onDelete(stat.id);
      } else if (mode === "edit") {
        setShowEdit(true);
      }
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const step = Math.ceil(stat.value / 30);
    const interval = (stat.duration || duration) / 30;

    const counter = setInterval(() => {
      countRef.current = Math.min(countRef.current + step, stat.value);
      setCount(countRef.current);

      if (countRef.current >= stat.value) {
        clearInterval(counter);
      }
    }, interval);

    return () => clearInterval(counter);
  }, [isVisible, stat.value, stat.duration, duration]);

  return (
    <div ref={ref} className="content-card p-8 text-center group relative">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
        <Button
          data-lov-name="Edit"
          variant="outline"
          size="sm"
          onClick={handleEditClick}
          className="text-blue-600 hover:text-blue-800"
        >
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteClick}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center">
        <span className="animate-count-up">{isVisible ? count : 0}</span>
        <span className="text-primary">{stat.suffix}</span>
      </div>
      <p className="text-muted-foreground">{stat.label}</p>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg w-80 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Enter password to {mode}
            </h3>
            <input
              type="password"
              className="w-full p-2 border rounded mb-2"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <EditStatForm
          stat={stat}
          onUpdate={(id, data) => {
            onEdit(id, data);
            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
};

const StatCounter = () => {
  const { stats, loading, addStat, updateStat, deleteStat } = useStatsData();

  if (loading) {
    return (
      <section className="section-padding bg-secondary/20">
        <div className="container-custom">
          <div className="text-center">Loading statistics...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-secondary/20">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="heading-lg">Statistics</h2>
          <AddStatForm onAdd={addStat} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <StatItem
              key={stat.id}
              stat={stat}
              duration={stat.duration || 2000}
              onEdit={updateStat}
              onDelete={deleteStat}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatCounter;
