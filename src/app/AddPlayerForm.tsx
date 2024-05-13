import type { PokerTable } from "@/models/table";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, UserPlus, Skull } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Form, FormError, InputField } from "@/components/ui/form";

const addPlayerSchema = z.object({
  name: z.string().min(1).max(200),
  alias: z.string().min(1).max(200),
  amount: z.coerce.number().positive(),
});

type AddPlayerSchema = z.infer<typeof addPlayerSchema>;

function AddPlayerForm({ table, player }: { table: PokerTable; player?: string }) {
  const [open, setOpen] = useState(false);
  const methods = useForm<AddPlayerSchema>({
    resolver: zodResolver(addPlayerSchema),
    defaultValues: { name: player ?? "", alias: player ?? "", amount: 0 },
  });

  const handleAddPlayer = async ({ name, alias, amount }: AddPlayerSchema) => {
    try {
      table.addPlayer(name, alias, amount);
      setOpen(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Ocurrió un error inesperado.";

      methods.setError("root", { type: "custom", message });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        methods.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          aria-label="add player"
          className={player ? "text-violet-500" : ""}
          size="icon"
          variant="outline"
        >
          {player ? <Skull className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {player ? `👋 ${player} vuelve a entrar` : "😎 Agregar jugador"}
          </DialogTitle>
          <DialogDescription>{player ? "Está seguro? 🤔" : "Quién se suma pa?"}</DialogDescription>
        </DialogHeader>
        <Form className="space-y-4" methods={methods} onSubmit={handleAddPlayer}>
          <div className="grid gap-2">
            {!player ? (
              <>
                <InputField<AddPlayerSchema> label="Nombre" name="name" />
                <InputField<AddPlayerSchema> label="Alias" name="alias" />
              </>
            ) : null}
            <InputField<AddPlayerSchema> label="Monto" name="amount" type="number" />
          </div>
          <FormError message={methods.formState.errors.root?.message} />
          <DialogFooter>
            <Button aria-label="submit" size="icon" type="submit">
              <Check className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddPlayerForm;
