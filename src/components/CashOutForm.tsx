import type { PokerTable } from "@/models/table";

import { Check, LogOut } from "lucide-react";
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

const cashOutSchema = z.object({
  amount: amountSchema
    .int("El monto tiene que ser un número entero")
    .nonnegative("El monto no puede ser negativo"),
});

function CashOutForm({ table, player }: { table: PokerTable; player: string }) {
  const [open, setOpen] = useState(false);
  const form = useAppForm({
    ...defaultFormOptions,
    defaultValues: { amount: 0 },
    validators: { onDynamic: cashOutSchema },
    onSubmit: ({ value }) => {
      table.cashOut(player, value.amount);
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
        <Button aria-label="cashout" className="text-rose-600" size="icon" variant="outline">
          <LogOut className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{player} se las toma 😘</DialogTitle>
          <DialogDescription>Con cuanto se fué?</DialogDescription>
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

export default CashOutForm;
