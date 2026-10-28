import type { PokerTable } from "@/models/table";

import { useState } from "react";
import { z } from "zod";

import { ActionSheet } from "@/components/ActionSheet";
import { chipAmounts, wholePot } from "@/components/quickAmounts";
import { Button } from "@/components/ui/button";
import { amountSchema, defaultFormOptions, useAppForm } from "@/components/ui/form";

// An empty amount means the player leaves with nothing.
const cashOutSchema = z.object({
  amount: amountSchema
    .int("El monto tiene que ser un número entero")
    .nonnegative("El monto no puede ser negativo")
    .or(z.nan()),
});

function CashOutForm({ table, player }: { table: PokerTable; player: string }) {
  const [open, setOpen] = useState(false);
  const form = useAppForm({
    ...defaultFormOptions,
    defaultValues: { amount: NaN },
    validators: { onDynamic: cashOutSchema },
    onSubmit: ({ value }) => {
      table.cashOut(player, Number.isNaN(value.amount) ? 0 : value.amount);
      setOpen(false);
    },
  });

  return (
    <ActionSheet
      open={open}
      title={`${player} se va`}
      trigger={
        <Button aria-label={`${player} se va`} variant="secondary">
          Se va
        </Button>
      }
      onOpenChange={(value) => {
        setOpen(value);
        form.reset();
      }}
    >
      <form.AppForm className="flex flex-col gap-4" form={form}>
        <form.AppField
          children={(field) => (
            <field.Amount
              addAmounts={chipAmounts}
              label="¿Con cuánto se va?"
              setAmounts={wholePot(table)}
            />
          )}
          name="amount"
        />
        <form.FormError />
        <form.SubmitButton>Confirmar salida</form.SubmitButton>
      </form.AppForm>
    </ActionSheet>
  );
}

export default CashOutForm;
