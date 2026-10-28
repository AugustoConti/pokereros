import type { PokerTable } from "@/models/table";

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

function DeleteMovementForm({
  table,
  index,
  player,
  amount: _,
  description,
}: {
  table: PokerTable;
  index: number;
  player: string;
  amount: number;
  description: string;
}) {
  const [open, setOpen] = useState(false);

  const handleDeleteMovement = () => {
    table.deleteMovement(index);
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
          <DialogTitle>⚠️ Borrar movimiento de {player}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <p className="text-center text-gray-400">Estás seguro pa? 🤔</p>
        <DialogFooter>
          <Button
            aria-label="submit"
            size="icon"
            variant="destructive"
            onClick={handleDeleteMovement}
          >
            <Check className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteMovementForm;
