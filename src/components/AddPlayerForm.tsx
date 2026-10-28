import type { PokerTable } from "@/models/table";

import { Check, UserPlus, Skull, Crown } from "lucide-react";
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

const addPlayerSchema = z.object({
  name: z.string().trim().min(1, "Ingresá un nombre").max(200, "El nombre es muy largo"),
  alias: z.string().trim().min(1, "Ingresá un alias").max(200, "El alias es muy largo"),
  amount: amountSchema.positive("El monto tiene que ser mayor a 0"),
});

function AddPlayerForm({
  table,
  player,
  balance,
}: {
  table: PokerTable;
  player?: string;
  balance?: number;
}) {
  const [open, setOpen] = useState(false);
  const form = useAppForm({
    ...defaultFormOptions,
    defaultValues: { name: player ?? "", alias: player ?? "", amount: 0 },
    validators: { onDynamic: addPlayerSchema },
    onSubmit: ({ value: { name, alias, amount } }) => {
      table.addPlayer(name, alias, amount);
      localStorage.setItem(name.toLowerCase(), alias);
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
        <Button aria-label="add player" size="icon" variant="outline">
          {!player ? (
            <UserPlus className="h-4 w-4" />
          ) : balance && balance >= 0 ? (
            <Crown className="h-4 w-4 text-amber-500" />
          ) : (
            <Skull className="h-4 w-4 text-violet-500" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {player ? `👋 ${player} vuelve a entrar` : "😎 Agregar jugador"}
          </DialogTitle>
          <DialogDescription>{player ? "Está seguro? 🤔" : "Quién se suma pa?"}</DialogDescription>
        </DialogHeader>
        <form.AppForm className="space-y-4" form={form}>
          <div className="grid gap-2">
            {!player ? (
              <>
                <form.AppField
                  children={(field) => (
                    <field.Input
                      label="Nombre"
                      onChange={(e) => {
                        const name = e.target.value;
                        const alias = localStorage.getItem(name.toLowerCase());

                        if (alias) {
                          form.setFieldValue("alias", alias);
                        }
                      }}
                    />
                  )}
                  name="name"
                />
                <form.AppField children={(field) => <field.Input label="Alias" />} name="alias" />
              </>
            ) : null}
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

export default AddPlayerForm;
