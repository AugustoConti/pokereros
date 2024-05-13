import type { PokerTable } from "@/models/table";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LogOut } from "lucide-react";
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

const cashOutSchema = z.object({
  amount: z.coerce.number().int(),
});

type CashOutSchema = z.infer<typeof cashOutSchema>;

function CashOutForm({ table, player }: { table: PokerTable; player: string }) {
  const [open, setOpen] = useState(false);
  const methods = useForm<CashOutSchema>({
    resolver: zodResolver(cashOutSchema),
    defaultValues: { amount: 0 },
  });

  const handleCashOut = async ({ amount }: CashOutSchema) => {
    try {
      table.cashOut(player, amount);
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
        <Button aria-label="cashout" className="text-rose-600" size="icon" variant="outline">
          <LogOut className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{player} se las toma 😘</DialogTitle>
          <DialogDescription>Con cuanto se fué?</DialogDescription>
        </DialogHeader>
        <Form className="space-y-4" methods={methods} onSubmit={handleCashOut}>
          <div className="grid gap-2">
            <InputField<CashOutSchema> label="Monto" name="amount" type="number" />
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

export default CashOutForm;
