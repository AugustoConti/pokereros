import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsDesktop } from "@/hooks/useIsDesktop";

/**
 * Where every table action is filled in: a panel that slides up from the bottom on a phone,
 * and a centered dialog on a wide screen.
 */
function ActionSheet({
  trigger,
  title,
  description,
  open,
  onOpenChange,
  children,
}: {
  trigger: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-md rounded-3xl border-[1.5px] border-primary bg-card p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-extrabold">{title}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="rounded-t-3xl border-t-[1.5px] border-primary bg-card data-[vaul-drawer-direction=bottom]:max-h-[92dvh]">
        <div className="mx-auto w-full max-w-md overflow-y-auto">
          <DrawerHeader className="px-5 pt-5 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left">
            <DrawerTitle className="text-xl font-extrabold">{title}</DrawerTitle>
            {description ? <DrawerDescription>{description}</DrawerDescription> : null}
          </DrawerHeader>
          <div className="px-5 pb-6">{children}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export { ActionSheet };
