
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { Stat } from "@/types/stats";

interface EditStatFormProps {
  stat: Stat;
  onUpdate: (statId: string, updatedStat: Omit<Stat, "id">) => void;
}

const EditStatForm = ({ stat, onUpdate }: EditStatFormProps) => {
  const [open, setOpen] = React.useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Stat, "id">>({
    defaultValues: {
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix,
      duration: stat.duration || 2000
    }
  });

  const onSubmit = (data: Omit<Stat, "id">) => {
    onUpdate(stat.id, {
      ...data,
      value: Number(data.value),
      duration: Number(data.duration) || 2000
    });
    setOpen(false);
  };

  React.useEffect(() => {
    if (open) {
      reset({
        label: stat.label,
        value: stat.value,
        suffix: stat.suffix,
        duration: stat.duration || 2000
      });
    }
  }, [open, stat, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Statistic</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              {...register("label", { required: "Label is required" })}
              placeholder="e.g., Completed Projects"
            />
            {errors.label && (
              <p className="text-sm text-destructive">{errors.label.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              {...register("value", {
                required: "Value is required",
                min: { value: 0, message: "Value must be positive" }
              })}
              placeholder="e.g., 50"
            />
            {errors.value && (
              <p className="text-sm text-destructive">{errors.value.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="suffix">Suffix</Label>
            <Input
              id="suffix"
              {...register("suffix")}
              placeholder="e.g., + or % (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Animation Duration (ms)</Label>
            <Input
              id="duration"
              type="number"
              {...register("duration")}
              placeholder="2000"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Statistic</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStatForm;
