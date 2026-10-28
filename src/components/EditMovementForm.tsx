import type { PokerTable } from "@/models/table";

import { Check, Pen } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

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
import { amountSchema, defaultFormOptions, useAppForm } from "@/components/ui/form";

const editMovementSchema = z.object({
  amount: amountSchema.positive("El monto tiene que ser mayor a 0"),
});

function EditMovementForm({
  table,
  index,
  player,
  amount,
  description,
}: {
  table: PokerTable;
  index: number;
  player: string;
  amount: number;
  description: string;
}) {
  const [open, setOpen] = useState(false);
  const form = useAppForm({
    ...defaultFormOptions,
    defaultValues: { amount: Math.abs(amount) },
    validators: { onDynamic: editMovementSchema },
    onSubmit: ({ value }) => {
      table.editMovement(index, value.amount);
      setOpen(false);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button aria-label="edit movement" className="text-blue-500" size="icon" variant="outline">
          <Pen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modificar movimiento de {player}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form.AppForm className="space-y-4" form={form}>
          <div className="grid gap-2">
            <form.AppField children={(field) => <field.Number label="Monto" />} name="amount" />
          </div>
          <form.FormError />
          <DialogFooter>
            <Button aria-label="submit" size="icon" type="submit">
              <Check className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}

export default EditMovementForm;
