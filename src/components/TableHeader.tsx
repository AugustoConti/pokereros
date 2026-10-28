import { Link } from "@tanstack/react-router";
import { Check, CircleDotDashed, House, Link as LinkIcon, QrCode, Spade } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import ResetTableForm from "./ResetTableForm";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCopied } from "@/hooks/useCopied";

function GitHub() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
        fill="currentColor"
      />
    </svg>
  );
}

function ShareTable({ tableId }: { tableId: string }) {
  const { copied, copy } = useCopied();
  const tableUrl = `${window.location.origin}/${tableId}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button aria-label="Compartir mesa" size="icon" title="Compartir mesa" variant="ghost">
          <QrCode />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-3xl border-primary bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">Compartir mesa</DialogTitle>
          <DialogDescription>
            Quien abra el link ve la mesa en vivo, pero no puede cambiarla.
          </DialogDescription>
        </DialogHeader>
        <div className="mx-auto rounded-2xl bg-ivory p-3">
          <QRCodeSVG
            bgColor="#f4ebd0"
            fgColor="#062018"
            size={200}
            title="QR de la mesa"
            value={tableUrl}
          />
        </div>
        <Button className="w-full" size="lg" variant="outline" onClick={() => copy(tableUrl)}>
          {copied ? <Check /> : <LinkIcon />}
          {copied ? "Link copiado" : "Copiar link"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function HeaderActions({ tableId, resetTable }: { tableId: string; resetTable?: () => void }) {
  return (
    <nav aria-label="Acciones" className="flex items-center">
      <ShareTable tableId={tableId} />
      <Button asChild size="icon" variant="ghost">
        <Link aria-label="Contador de fichas" title="Contador de fichas" to="/fichas">
          <CircleDotDashed />
        </Link>
      </Button>
      <Button asChild size="icon" variant="ghost">
        <Link aria-label="Ranking de manos" title="Ranking de manos" to="/manos">
          <Spade />
        </Link>
      </Button>
      <Button asChild size="icon" variant="ghost">
        <a
          aria-label="Código en GitHub"
          href="https://github.com/AugustoConti/pokereros"
          title="Código en GitHub"
        >
          <GitHub />
        </a>
      </Button>
      {resetTable ? (
        <ResetTableForm resetTable={resetTable} />
      ) : (
        <Button asChild size="icon" variant="ghost">
          <Link aria-label="Ir a mi mesa" title="Ir a mi mesa" to="/">
            <House />
          </Link>
        </Button>
      )}
    </nav>
  );
}

export { HeaderActions };
