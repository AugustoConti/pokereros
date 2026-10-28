import {
  type AnyFieldMeta,
  type AnyFormApi,
  createFormHook,
  createFormHookContexts,
  formOptions,
  revalidateLogic,
  useSelector,
} from "@tanstack/react-form";
import { type ChangeEventHandler, type ReactNode, useId } from "react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <p className="text-sm font-medium text-destructive" id={id}>
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
    <div className="space-y-1">
      <div className="grid grid-cols-4 items-center gap-4 space-y-1">
        <Label className="justify-end" htmlFor={id}>
          {label}
        </Label>
        {children({
          id,
          "aria-invalid": !field.state.meta.isValid,
          "aria-describedby": errorId,
        })}
      </div>
      <FieldErrors id={errorId} meta={field.state.meta} />
    </div>
  );
}

function InputField({
  label,
  onChange,
}: {
  label: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  const field = useFieldContext<string>();

  return (
    <Field label={label}>
      {(props) => (
        <Input
          {...props}
          className="col-span-3"
          name={field.name}
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

function NumberField({ label }: { label: string }) {
  const field = useFieldContext<number>();

  return (
    <Field label={label}>
      {(props) => (
        <Input
          {...props}
          className="col-span-3"
          name={field.name}
          type="number"
          value={Number.isNaN(field.state.value) ? "" : field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value === "" ? NaN : e.target.valueAsNumber)}
        />
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
    <div aria-live="polite" className="text-sm text-rose-500">
      <p>{message}</p>
    </div>
  );
}

// Number inputs hold NaN while empty, which zod reports as a type error.
const amountSchema = z.number({ error: "Ingresá un monto" });

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: InputField,
    Number: NumberField,
  },
  formComponents: {
    AppForm,
    FormError,
  },
  fieldContext,
  formContext,
});

const defaultFormOptions = formOptions({
  validationLogic: revalidateLogic({ mode: "submit", modeAfterSubmission: "change" }),
});

export { amountSchema, defaultFormOptions, useAppForm };
