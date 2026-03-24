import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(price);
}

export function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    purchased: "Comprado en eBay",
    shipped: "Enviado",
    in_transit: "En Tránsito",
    customs: "En Aduana",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: "bg-muted text-muted-foreground",
    confirmed: "bg-blue-500/20 text-blue-400",
    purchased: "bg-purple-500/20 text-purple-400",
    shipped: "bg-yellow-500/20 text-yellow-400",
    in_transit: "bg-orange-500/20 text-orange-400",
    customs: "bg-red-500/20 text-red-400",
    delivered: "bg-primary/20 text-primary",
    cancelled: "bg-destructive/20 text-destructive",
  };
  return colors[status] || "bg-muted text-muted-foreground";
}
