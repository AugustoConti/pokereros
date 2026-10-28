import type { PokerTable } from "@/models/table";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import { ActionSheet } from "@/components/ActionSheet";
import { Button } from "@/components/ui/button";

function DeleteMovementForm({
  table,
  index,
  description,
}: {
  table: PokerTable;
  index: number;
  description: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <ActionSheet
      description={description}
      open={open}
      title="¿Borrar este movimiento?"
      trigger={
        <Button aria-label={`Borrar: ${description}`} size="icon" variant="ghost">
          <Trash2 className="text-loss" />
        </Button>
      }
      onOpenChange={setOpen}
    >
      <Button
        className="w-full"
        size="lg"
        variant="destructive"
        onClick={() => {
          table.deleteMovement(index);
          setOpen(false);
        }}
      >
        Borrar movimiento
      </Button>
    </ActionSheet>
  );
}

export default DeleteMovementForm;
