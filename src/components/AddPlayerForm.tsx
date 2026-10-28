import type { PokerTable } from "@/models/table";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { ActionSheet } from "@/components/ActionSheet";
import { chipAmounts } from "@/components/quickAmounts";
import { Button } from "@/components/ui/button";
import { amountSchema, defaultFormOptions, useAppForm } from "@/components/ui/form";

const addPlayerSchema = z.object({
  name: z.string().trim().min(1, "Ingresá un nombre").max(200, "El nombre es muy largo"),
  alias: z.string().trim().min(1, "Ingresá un alias").max(200, "El alias es muy largo"),
  amount: amountSchema.positive("El monto tiene que ser mayor a 0"),
});

/** Adds a new player, or lets one who already left buy in again when `player` is given. */
function AddPlayerForm({ table, player }: { table: PokerTable; player?: string }) {
  const [open, setOpen] = useState(false);
  const form = useAppForm({
    ...defaultFormOptions,
    defaultValues: {
      name: player ?? "",
      alias: player ?? "",
      amount: NaN,
    },
    validators: { onDynamic: addPlayerSchema },
    onSubmit: ({ value: { name, alias, amount } }) => {
      table.addPlayer(name, alias, amount);
      localStorage.setItem(name.toLowerCase(), alias);
      setOpen(false);
    },
  });

  return (
    <ActionSheet
      open={open}
      title={player ? `${player} vuelve a entrar` : "Sumar jugador"}
      trigger={
        player ? (
          <Button aria-label={`${player} vuelve a entrar`} variant="secondary">
            Vuelve
          </Button>
        ) : (
          <Button className="w-full" size="lg">
            <UserPlus className="size-5" />
            Sumar jugador
          </Button>
        )
      }
      onOpenChange={(value) => {
        setOpen(value);
        form.reset({
          name: player ?? "",
          alias: player ?? "",
          amount: NaN,
        });
      }}
    >
      <form.AppForm className="flex flex-col gap-4" form={form}>
        {!player ? (
          <div className="grid grid-cols-2 gap-3">
            <form.AppField
              children={(field) => (
                <field.Input
                  label="Nombre"
                  placeholder="Ej: Gabi"
                  onChange={(e) => {
                    const alias = localStorage.getItem(e.target.value.toLowerCase());

                    if (alias) {
                      form.setFieldValue("alias", alias);
                    }
                  }}
                />
              )}
              name="name"
            />
            <form.AppField
              children={(field) => (
                <field.Input label="Alias para transferir" placeholder="Ej: gabi.mp" />
              )}
              name="alias"
            />
          </div>
        ) : null}
        <form.AppField
          children={(field) => <field.Amount addAmounts={chipAmounts} label="¿Con cuánto entra?" />}
          name="amount"
        />
        <form.FormError />
        <form.SubmitButton>{player ? "Confirmar entrada" : "Sumar a la mesa"}</form.SubmitButton>
      </form.AppForm>
    </ActionSheet>
  );
}

export default AddPlayerForm;
