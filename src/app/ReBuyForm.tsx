import type { PokerTable } from "@/models/table";

import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Check } from "lucide-react";
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

const reBuySchema = z.object({
  amount: z.coerce.number().positive(),
});

type ReBuySchema = z.infer<typeof reBuySchema>;

function ReBuyForm({ table, player }: { table: PokerTable; player: string }) {
  const [open, setOpen] = useState(false);
  const methods = useForm<ReBuySchema>({
    resolver: zodResolver(reBuySchema),
    defaultValues: { amount: 0 },
  });

  const handleReBuy = async ({ amount }: ReBuySchema) => {
    try {
      table.reBuy(player, amount);
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
        <Button aria-label="rebuy" className="text-green-600" size="icon" variant="outline">
          <DollarSign className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>💰 {player} quiere agregar</DialogTitle>
          <DialogDescription>Cuanto más va a perder? 📉</DialogDescription>
        </DialogHeader>
        <Form className="space-y-4" methods={methods} onSubmit={handleReBuy}>
          <div className="grid gap-2">
            <InputField<ReBuySchema> label="Monto" name="amount" type="number" />
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

export default ReBuyForm;
