import type { PokerTable } from "@/models/table";

import { useState } from "react";
import { z } from "zod";

import { ActionSheet } from "@/components/ActionSheet";
import { chipAmounts } from "@/components/quickAmounts";
import { Button } from "@/components/ui/button";
import { amountSchema, defaultFormOptions, useAppForm } from "@/components/ui/form";

const reBuySchema = z.object({
  amount: amountSchema.positive("El monto tiene que ser mayor a 0"),
});

function ReBuyForm({ table, player }: { table: PokerTable; player: string }) {
  const [open, setOpen] = useState(false);
  const form = useAppForm({
    ...defaultFormOptions,
    defaultValues: { amount: NaN },
    validators: { onDynamic: reBuySchema },
    onSubmit: ({ value }) => {
      table.reBuy(player, value.amount);
      setOpen(false);
    },
  });

  return (
    <ActionSheet
      open={open}
      title={`Recompra de ${player}`}
      trigger={
        <Button aria-label={`Recompra de ${player}`} variant="outline">
          Recompra
        </Button>
      }
      onOpenChange={(value) => {
        setOpen(value);
        form.reset();
      }}
    >
      <form.AppForm className="flex flex-col gap-4" form={form}>
        <form.AppField
          children={(field) => <field.Amount addAmounts={chipAmounts} label="¿Cuánto agrega?" />}
          name="amount"
        />
        <form.FormError />
        <form.SubmitButton>Confirmar recompra</form.SubmitButton>
      </form.AppForm>
    </ActionSheet>
  );
}

export default ReBuyForm;
