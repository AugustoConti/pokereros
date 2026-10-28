import type { PokerTable } from "@/models/table";

import { Pen } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { ActionSheet } from "@/components/ActionSheet";
import { chipAmounts } from "@/components/quickAmounts";
import { Button } from "@/components/ui/button";
import { amountSchema, defaultFormOptions, useAppForm } from "@/components/ui/form";

const editMovementSchema = z.object({
  amount: amountSchema.positive("El monto tiene que ser mayor a 0"),
});

function EditMovementForm({
  table,
  index,
  amount,
  description,
}: {
  table: PokerTable;
  index: number;
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
    <ActionSheet
      description={description}
      open={open}
      title="Corregir movimiento"
      trigger={
        <Button aria-label={`Corregir: ${description}`} size="icon" variant="ghost">
          <Pen className="text-brass-light" />
        </Button>
      }
      onOpenChange={(value) => {
        setOpen(value);
        form.reset();
      }}
    >
      <form.AppForm className="flex flex-col gap-4" form={form}>
        <form.AppField
          children={(field) => <field.Amount addAmounts={chipAmounts} label="Monto correcto" />}
          name="amount"
        />
        <form.FormError />
        <form.SubmitButton>Guardar cambio</form.SubmitButton>
      </form.AppForm>
    </ActionSheet>
  );
}

export default EditMovementForm;
