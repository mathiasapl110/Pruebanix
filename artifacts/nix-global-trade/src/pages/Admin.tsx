import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { useGetAllOrders, useUpdateOrderTracking } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { formatPrice, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Search, FileEdit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const STATUSES = ['pending', 'confirmed', 'purchased', 'shipped', 'in_transit', 'customs', 'delivered', 'cancelled'] as const;

export default function Admin() {
  const { isAuthenticated, user, token } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<any>("");
  const [trackingNote, setTrackingNote] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      setLocation("/");
    }
  }, [isAuthenticated, user, setLocation]);

  const { data: orders, refetch } = useGetAllOrders({
    request: { headers: { Authorization: `Bearer ${token}` } }
  });

  const updateMutation = useUpdateOrderTracking({
    request: { headers: { Authorization: `Bearer ${token}` } }
  });

  const handleUpdateStatus = () => {
    if (!selectedOrder || !newStatus) return;
    
    updateMutation.mutate({
      id: selectedOrder.id,
      data: { status: newStatus, trackingNote }
    }, {
      onSuccess: () => {
        toast({ title: "Actualizado", description: "El estado del pedido fue actualizado." });
        setSelectedOrder(null);
        setNewStatus("");
        setTrackingNote("");
        refetch();
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Error", description: err.error || "No se pudo actualizar." });
      }
    });
  };

  const filteredOrders = orders?.filter(o => 
    o.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.ebayTracking.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated || !user?.isAdmin) return null;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-serif font-bold">Panel de Administración</h1>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Buscar por cliente o tracking..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 border-b border-border text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Cliente</th>
                  <th className="px-6 py-4 font-semibold">Producto</th>
                  <th className="px-6 py-4 font-semibold">Tracking Origen</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders?.map(order => (
                  <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-mono">#{order.id}</td>
                    <td className="px-6 py-4 font-medium">{order.firstName} {order.lastName}</td>
                    <td className="px-6 py-4">{order.productName} (x{order.quantity})</td>
                    <td className="px-6 py-4 font-mono text-xs">{order.ebayTracking}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Dialog open={selectedOrder?.id === order.id} onOpenChange={(open) => {
                        if (!open) setSelectedOrder(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setSelectedOrder(order);
                              setNewStatus(order.status);
                            }}
                          >
                            <FileEdit className="w-4 h-4 mr-2" />
                            Actualizar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-serif">Actualizar Pedido #{order.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 py-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Estado Actual</label>
                              <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un estado" />
                                </SelectTrigger>
                                <SelectContent>
                                  {STATUSES.map(s => (
                                    <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Nota de Tracking (Opcional)</label>
                              <Input 
                                placeholder="Ej: Vuelo arribado a Lima" 
                                value={trackingNote}
                                onChange={(e) => setTrackingNote(e.target.value)}
                              />
                            </div>
                            <Button 
                              className="w-full gold-glow" 
                              onClick={handleUpdateStatus}
                              isLoading={updateMutation.isPending}
                            >
                              Guardar Cambios
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
                {filteredOrders?.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No se encontraron pedidos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
