import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { useGetMyOrders } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { formatPrice, getStatusColor, getStatusLabel } from "@/lib/utils";
import { PackageOpen, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyOrders() {
  const { isAuthenticated, token } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/auth");
    }
  }, [isAuthenticated, setLocation]);

  const { data: orders, isLoading } = useGetMyOrders(
    { request: { headers: { Authorization: `Bearer ${token}` } } },
  );

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 lg:py-24 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Mis Pedidos</h1>
            <p className="text-muted-foreground">Revisa el historial y estado de tus compras.</p>
          </div>
          <Link href="/order">
            <Button className="gold-glow">Nuevo Pedido</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border hover:border-primary/30 rounded-xl p-6 shadow-md transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center shrink-0 border border-white/5">
                    <PackageOpen className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{order.productName || "Dispositivo Apple"}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> 
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>Tracking: <span className="font-mono text-foreground">{order.ebayTracking}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3 border-t md:border-t-0 border-border pt-4 md:pt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="w-full md:w-auto group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                      Ver Seguimiento <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl py-24 px-4 text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No tienes pedidos aún</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Cuando realices la solicitud de importación de un equipo, podrás hacerle seguimiento desde aquí.
            </p>
            <Link href="/order">
              <Button className="gold-glow">Comenzar mi primer pedido</Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
