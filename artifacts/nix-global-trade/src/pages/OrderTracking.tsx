import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { useGetOrder } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { getStatusLabel, getStatusColor } from "@/lib/utils";
import { CheckCircle2, Circle, Truck, Package, Plane, ShieldCheck, MapPin } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function OrderTracking() {
  const { token } = useAuth();
  const [, params] = useRoute("/orders/:id");
  const orderId = params?.id ? parseInt(params.id) : 0;

  const { data: order, isLoading, isError } = useGetOrder(orderId, {
    request: { headers: { Authorization: `Bearer ${token}` } }
  });

  if (isLoading) return <AppLayout><div className="flex justify-center items-center h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div></AppLayout>;
  
  if (isError || !order) return <AppLayout><div className="container mx-auto py-20 text-center"><h1 className="text-2xl font-bold">Pedido no encontrado</h1></div></AppLayout>;

  // Ensure steps exist or generate defaults based on standard flow
  const defaultSteps = [
    { id: 1, status: 'pending', title: 'Pedido Recibido', icon: Package },
    { id: 2, status: 'confirmed', title: 'Confirmado', icon: ShieldCheck },
    { id: 3, status: 'purchased', title: 'Comprado en eBay', icon: CheckCircle2 },
    { id: 4, status: 'shipped', title: 'Enviado a Miami', icon: Truck },
    { id: 5, status: 'in_transit', title: 'Vuelo a Perú', icon: Plane },
    { id: 6, status: 'customs', title: 'Aduanas', icon: ShieldCheck },
    { id: 7, status: 'delivered', title: 'Entregado', icon: MapPin },
  ];

  // Helper to determine if a step is completed based on current order status
  const statuses = ['pending', 'confirmed', 'purchased', 'shipped', 'in_transit', 'customs', 'delivered'];
  const currentIndex = statuses.indexOf(order.status);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 lg:py-20 max-w-4xl">
        
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-border">
            <div>
              <h1 className="text-2xl font-serif font-bold mb-1">Seguimiento de Pedido #{order.id}</h1>
              <p className="text-muted-foreground">{order.productName || "Dispositivo Apple"}</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Comprador</p>
              <p className="font-semibold">{order.firstName} {order.lastName}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Tracking eBay/Origen</p>
              <p className="font-mono bg-secondary px-2 py-1 rounded inline-block">{order.ebayTracking}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Fecha de Solicitud</p>
              <p className="font-medium">{format(new Date(order.createdAt), "dd MMM, yyyy", { locale: es })}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-serif font-bold mb-8 px-2">Línea de Tiempo</h2>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-lg relative">
          
          <div className="absolute left-[39px] md:left-[55px] top-10 bottom-10 w-0.5 bg-border z-0 hidden sm:block"></div>

          <div className="space-y-8 relative z-10">
            {defaultSteps.map((step, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;
              const StepIcon = step.icon;
              
              // Find matching real step if it exists in DB
              const realStep = order.trackingSteps?.find(s => s.status === step.status);
              
              return (
                <div key={step.id} className={`flex gap-4 sm:gap-8 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                  
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-card relative z-10 transition-colors duration-500
                      ${isCurrent ? 'bg-primary text-primary-foreground shadow-[0_0_15px_hsla(46,65%,52%,0.5)] scale-110' : 
                        isCompleted ? 'bg-primary/20 text-primary border-primary/20' : 'bg-secondary text-muted-foreground'}`}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    {/* Mobile vertical line */}
                    {index !== defaultSteps.length - 1 && (
                      <div className={`w-0.5 h-full mt-2 sm:hidden ${isCompleted && !isCurrent ? 'bg-primary/50' : 'bg-border'}`}></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8 sm:pb-0 pt-2">
                    <h3 className={`text-lg font-bold ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {realStep?.description || (isCurrent ? 'Procesando este paso actualmente.' : isCompleted ? 'Completado exitosamente.' : 'Pendiente')}
                    </p>
                    {realStep?.completedAt && isCompleted && (
                      <p className="text-xs text-muted-foreground mt-2 font-mono bg-secondary inline-block px-2 py-1 rounded">
                        {format(new Date(realStep.completedAt), "dd MMM yyyy, HH:mm", { locale: es })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
