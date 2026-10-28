import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { ActionSheet } from "@/components/ActionSheet";
import { Button } from "@/components/ui/button";

function ResetTableForm({ resetTable }: { resetTable: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <ActionSheet
      description="Se borran los jugadores y los movimientos de esta mesa. El link que compartiste deja de actualizarse."
      open={open}
      title="¿Empezar una mesa nueva?"
      trigger={
        <Button aria-label="Mesa nueva" size="icon" title="Mesa nueva" variant="ghost">
          <RotateCcw />
        </Button>
      }
      onOpenChange={setOpen}
    >
      <Button
        className="w-full"
        size="lg"
        variant="destructive"
        onClick={() => {
          resetTable();
          setOpen(false);
        }}
      >
        Empezar mesa nueva
      </Button>
    </ActionSheet>
  );
}

export default ResetTableForm;
