import {
  type AnyFieldMeta,
  type AnyFormApi,
  createFormHook,
  createFormHookContexts,
  formOptions,
  revalidateLogic,
  useSelector,
} from "@tanstack/react-form";
import { X } from "lucide-react";
import { type ChangeEventHandler, type ReactNode, useId } from "react";
import { z } from "zod";

import { Chip, type ChipColor, chipColorAt } from "@/components/Chip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/utils";

const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts();

function FieldErrors({ id, meta }: { id: string; meta: AnyFieldMeta }) {
  if (meta.isValid) return null;

  const messages = meta.errors.flatMap((error: unknown) =>
    typeof error === "string"
      ? [error]
      : typeof error === "object" && error !== null && "message" in error
        ? [String(error.message)]
        : [],
  );

  return (
    <p className="text-sm font-semibold text-loss" id={id}>
      {messages.join(", ")}
    </p>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string;
  }) => ReactNode;
}) {
  const field = useFieldContext();
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[13px] font-bold text-muted-foreground" htmlFor={id}>
        {label}
      </Label>
      {children({
        id,
        "aria-invalid": !field.state.meta.isValid,
        "aria-describedby": errorId,
      })}
      <FieldErrors id={errorId} meta={field.state.meta} />
    </div>
  );
}

function InputField({
  label,
  placeholder,
  onChange,
}: {
  label: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  const field = useFieldContext<string>();

  return (
    <Field label={label}>
      {(props) => (
        <Input
          {...props}
          autoComplete="off"
          className="h-12 rounded-xl border-[1.5px] bg-background text-base font-semibold"
          name={field.name}
          placeholder={placeholder}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => {
            onChange?.(e);
            field.handleChange(e.target.value);
          }}
        />
      )}
    </Field>
  );
}

type QuickAmount = { label: string; value: number; description?: string };

function ChipButton({
  quick,
  color,
  onPick,
}: {
  quick: QuickAmount;
  color: ChipColor;
  onPick: () => void;
}) {
  return (
    <button
      aria-label={quick.description ?? formatMoney(quick.value)}
      className="group rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
      type="button"
      onClick={onPick}
    >
      <Chip
        className="size-[60px] text-[15px] leading-none transition-transform group-active:translate-y-1"
        color={color}
      >
        {quick.label}
      </Chip>
    </button>
  );
}

/**
 * A big amount input for the phone's numeric keypad. `addAmounts` chips add up on every tap,
 * `setAmounts` chips replace the amount (like leaving with everything that's left).
 */
function AmountField({
  label,
  addAmounts = [],
  setAmounts = [],
}: {
  label: string;
  addAmounts?: Array<QuickAmount>;
  setAmounts?: Array<QuickAmount>;
}) {
  const field = useFieldContext<number>();
  const value = field.state.value;
  const hasValue = !Number.isNaN(value);

  return (
    <Field label={label}>
      {(props) => (
        <div className="flex flex-col gap-4">
          <div className="flex h-16 items-center gap-1.5 rounded-xl border-[1.5px] border-primary bg-background pr-2 pl-4 focus-within:ring-[3px] focus-within:ring-ring/60">
            <span
              aria-hidden="true"
              className="font-display text-[34px] font-extrabold text-primary"
            >
              $
            </span>
            <input
              {...props}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent font-display text-[38px] font-extrabold text-ivory tabular-nums outline-none placeholder:text-muted-foreground/50"
              inputMode="numeric"
              name={field.name}
              placeholder="0"
              type="text"
              value={hasValue ? value.toLocaleString("es-AR") : ""}
              onBlur={field.handleBlur}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/gu, "").slice(0, 9);

                field.handleChange(digits === "" ? NaN : Number(digits));
              }}
            />
            {hasValue ? (
              <Button
                aria-label="Borrar monto"
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => field.handleChange(NaN)}
              >
                <X className="size-5" />
              </Button>
            ) : null}
          </div>
          {addAmounts.length + setAmounts.length > 0 ? (
            <div className="flex justify-between gap-2">
              {addAmounts.map((quick, index) => (
                <ChipButton
                  key={quick.label}
                  color={chipColorAt([3, 0, 1, 2][index] ?? index)}
                  quick={quick}
                  onPick={() => field.handleChange((hasValue ? value : 0) + quick.value)}
                />
              ))}
              {setAmounts.map((quick) => (
                <ChipButton
                  key={quick.label}
                  color={chipColorAt(4)}
                  quick={quick}
                  onPick={() => field.handleChange(quick.value)}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </Field>
  );
}

function AppForm({
  className,
  children,
  form,
}: {
  className?: string;
  children: ReactNode;
  form: AnyFormApi;
}) {
  return (
    <formContext.Provider value={form}>
      <form
        noValidate
        className={className}
        id={form.formId}
        onSubmit={(e) => {
          e.preventDefault();
          // TanStack Form rethrows whatever `onSubmit` throws without storing it. Keeping it as an
          // `onServer` error shows it until the next change, blur or submit, which clear it.
          form.handleSubmit().catch((error: unknown) => {
            form.setErrorMap({ onServer: errorMessage(error) });
          });
        }}
      >
        {children}
      </form>
    </formContext.Provider>
  );
}

/** Shows what the form's `onSubmit` threw. */
function FormError() {
  const form = useFormContext();
  const message = useSelector(form.store, (state): unknown => state.errorMap.onServer);

  if (typeof message !== "string") return null;

  return (
    <div aria-live="polite" className="text-sm font-semibold text-loss">
      <p>{message}</p>
    </div>
  );
}

function SubmitButton({ children }: { children: ReactNode }) {
  const form = useFormContext();
  const isSubmitting = useSelector(form.store, (state): boolean => state.isSubmitting);

  return (
    <Button className="w-full" disabled={isSubmitting} form={form.formId} size="lg" type="submit">
      {children}
    </Button>
  );
}

// The amount input holds NaN while empty, which zod reports as a type error.
const amountSchema = z.number({ error: "Ingresá un monto" });

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: InputField,
    Amount: AmountField,
  },
  formComponents: {
    AppForm,
    FormError,
    SubmitButton,
  },
  fieldContext,
  formContext,
});

const defaultFormOptions = formOptions({
  validationLogic: revalidateLogic({ mode: "submit", modeAfterSubmission: "change" }),
});

export { amountSchema, defaultFormOptions, type QuickAmount, useAppForm };
