import type { PokerTable } from "@/models/table";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Pen } from "lucide-react";
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

const editMovementSchema = z.object({
  amount: z.coerce.number().positive(),
});

type EditMovementSchema = z.infer<typeof editMovementSchema>;

function EditMovementForm({
  table,
  index,
  movement,
}: {
  table: PokerTable;
  index: number;
  movement: string;
}) {
  const [open, setOpen] = useState(false);
  const methods = useForm<EditMovementSchema>({
    resolver: zodResolver(editMovementSchema),
    defaultValues: { amount: 0 },
  });

  const handleEditMovement = async ({ amount }: EditMovementSchema) => {
    try {
      table.editMovement(index, amount);
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
        <Button aria-label="edit movement" className="text-blue-500" size="icon" variant="outline">
          <Pen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modificar movimiento</DialogTitle>
          <DialogDescription>{movement}</DialogDescription>
        </DialogHeader>
        <Form className="space-y-4" methods={methods} onSubmit={handleEditMovement}>
          <div className="grid gap-2">
            <InputField<EditMovementSchema> label="Monto" name="amount" type="number" />
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

export default EditMovementForm;
