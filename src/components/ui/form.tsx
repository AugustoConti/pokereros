import type * as LabelPrimitive from "@radix-ui/react-label";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  type BaseSyntheticEvent,
  type ChangeEventHandler,
  type ComponentPropsWithoutRef,
  createContext,
  type ElementRef,
  forwardRef,
  type HTMLAttributes,
  type HTMLInputTypeAttribute,
  type ReactNode,
  useContext,
  useId,
} from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
  type UseFormReturn,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormProps<T extends FieldValues = FieldValues> = {
  className?: string;
  children: ReactNode;
  methods: UseFormReturn<T>;
  onSubmit: (data: T, event?: BaseSyntheticEvent) => Promise<void>;
};

function Form<T extends FieldValues>({ className, children, methods, onSubmit }: FormProps<T>) {
  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form
        className={className}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </FormProvider>
  );
}

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-1", className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);

FormItem.displayName = "FormItem";

const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});

FormLabel.displayName = "FormLabel";

const FormControl = forwardRef<ElementRef<typeof Slot>, ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <Slot
        ref={ref}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        id={formItemId}
        {...props}
      />
    );
  },
);

FormControl.displayName = "FormControl";

const FormDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
      <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        id={formDescriptionId}
        {...props}
      />
    );
  },
);

FormDescription.displayName = "FormDescription";

const FormMessage = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        className={cn("text-sm font-medium text-destructive", className)}
        id={formMessageId}
        {...props}
      >
        {body}
      </p>
    );
  },
);

FormMessage.displayName = "FormMessage";

function InputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  name,
  type,
  onChange,
}: {
  label: string;
  name: TName;
  type?: HTMLInputTypeAttribute | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  const methods = useFormContext<TFieldValues>();

  return (
    <FormField
      control={methods.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-4 items-center gap-4 space-y-1">
            <FormLabel className="text-right">{label}</FormLabel>
            <FormControl>
              <Input
                className="col-span-3"
                type={type}
                {...field}
                onChange={(e) => {
                  onChange?.(e);
                  field.onChange(e);
                }}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div aria-live="polite" className="text-sm text-rose-500">
      <p>{message}</p>
    </div>
  );
}

export {
  Form,
  // FormControl,
  // FormDescription,
  FormError,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
  InputField,
  // useFormField,
};
