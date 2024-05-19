import { Check, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function ResetTableForm({ resetTable }: { resetTable: () => void }) {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    resetTable();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="delete movement"
          className="text-rose-600"
          size="icon"
          variant="outline"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resetear la mesa ⚠️</DialogTitle>
          <DialogDescription>Arrancar una mesa nueva</DialogDescription>
        </DialogHeader>
        <p className="text-center text-gray-400">Estás seguro pa? 🤔</p>
        <DialogFooter>
          <Button aria-label="submit" size="icon" variant="destructive" onClick={handleReset}>
            <Check className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResetTableForm;
