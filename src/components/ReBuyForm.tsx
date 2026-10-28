import type { PokerTable } from "@/models/table";

import { DollarSign, Check } from "lucide-react";
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

const reBuySchema = z.object({
  amount: amountSchema.positive("El monto tiene que ser mayor a 0"),
});

function ReBuyForm({ table, player }: { table: PokerTable; player: string }) {
  const [open, setOpen] = useState(false);
  const form = useAppForm({
    ...defaultFormOptions,
    defaultValues: { amount: 0 },
    validators: { onDynamic: reBuySchema },
    onSubmit: ({ value }) => {
      table.reBuy(player, value.amount);
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
        <Button aria-label="rebuy" className="text-green-600" size="icon" variant="outline">
          <DollarSign className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>💰 {player} quiere agregar</DialogTitle>
          <DialogDescription>Cuanto más va a perder? 📉</DialogDescription>
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

export default ReBuyForm;
