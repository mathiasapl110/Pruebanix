import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGetProducts, useCreateOrder } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Truck, ShieldCheck } from "lucide-react";

const orderSchema = z.object({
  productId: z.coerce.number().min(1, "Debes seleccionar un producto"),
  firstName: z.string().min(2, "Requerido"),
  lastName: z.string().min(2, "Requerido"),
  dni: z.string().min(8, "DNI inválido"),
  phone: z.string().min(6, "Requerido"),
  ebayTracking: z.string().min(1, "El tracking de eBay es requerido"),
  quantity: z.coerce.number().min(1).default(1),
  comments: z.string().optional(),
});

export default function OrderForm() {
  const { isAuthenticated, token, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: products } = useGetProducts();
  const createOrderMutation = useCreateOrder({
    request: { headers: { Authorization: `Bearer ${token}` } }
  });

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      quantity: 1,
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({ title: "Inicia sesión", description: "Debes iniciar sesión para realizar un pedido." });
      setLocation("/auth");
    }
  }, [isAuthenticated, setLocation, toast]);

  const onSubmit = (data: z.infer<typeof orderSchema>) => {
    createOrderMutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "¡Pedido Creado!", description: "Tu solicitud ha sido registrada con éxito." });
        setLocation("/my-orders");
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Error", description: err.error || "Hubo un error al procesar el pedido." });
      }
    });
  };

  const selectedProductId = form.watch("productId");
  const selectedProduct = products?.find(p => p.id === selectedProductId);

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">Inicia tu Pedido</h1>
            <p className="text-muted-foreground">Rellena el formulario con tus datos y el tracking de tu compra.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-serif border-b border-border pb-2">Selección de Producto</h3>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Equipo a importar</label>
                    <Select onValueChange={(val) => form.setValue("productId", parseInt(val))}>
                      <SelectTrigger className="h-14">
                        <SelectValue placeholder="Selecciona un iPhone del catálogo" />
                      </SelectTrigger>
                      <SelectContent>
                        {products?.map(p => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name} - {formatPrice(p.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.productId && (
                      <p className="text-xs text-destructive mt-1">{form.formState.errors.productId.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Tracking de eBay / Tienda</label>
                      <Input placeholder="Ej. 1Z9999999999999999" {...form.register("ebayTracking")} />
                      {form.formState.errors.ebayTracking && (
                        <p className="text-xs text-destructive mt-1">{form.formState.errors.ebayTracking.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Cantidad</label>
                      <Input type="number" min="1" {...form.register("quantity")} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-serif border-b border-border pb-2 mt-8">Datos Personales</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nombres</label>
                      <Input {...form.register("firstName")} />
                      {form.formState.errors.firstName && <p className="text-xs text-destructive mt-1">{form.formState.errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Apellidos</label>
                      <Input {...form.register("lastName")} />
                      {form.formState.errors.lastName && <p className="text-xs text-destructive mt-1">{form.formState.errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">DNI o CE</label>
                      <Input {...form.register("dni")} />
                      {form.formState.errors.dni && <p className="text-xs text-destructive mt-1">{form.formState.errors.dni.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Teléfono de contacto</label>
                      <Input {...form.register("phone")} />
                      {form.formState.errors.phone && <p className="text-xs text-destructive mt-1">{form.formState.errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Comentarios adicionales (Opcional)</label>
                    <Textarea placeholder="Indica el color, capacidad u otra instrucción..." {...form.register("comments")} />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gold-glow mt-8 text-lg h-14" isLoading={createOrderMutation.isPending}>
                  Confirmar Envío
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-secondary rounded-2xl p-6 border border-border">
                <h3 className="font-serif font-bold text-lg mb-4">Resumen del Pedido</h3>
                {selectedProduct ? (
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 bg-card rounded-md flex items-center justify-center p-2">
                         {/* stock image fallback for product */}
                        <img src={selectedProduct.imageUrl || `https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=150&auto=format&fit=crop&q=80`} className="w-full h-full object-contain" alt="iPhone" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedProduct.name}</p>
                        <p className="text-sm text-primary">{formatPrice(selectedProduct.price)}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border flex justify-between text-sm">
                      <span className="text-muted-foreground">Cantidad</span>
                      <span>{form.watch("quantity") || 1}</span>
                    </div>
                    <div className="pt-4 border-t border-border flex justify-between font-bold">
                      <span>Total Estimado</span>
                      <span className="text-primary text-xl">{formatPrice(selectedProduct.price * (form.watch("quantity") || 1))}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Selecciona un equipo para ver el resumen
                  </div>
                )}
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Compra Segura</h4>
                    <p className="text-xs text-muted-foreground mt-1">Garantizamos el traslado seguro de tu equipo hasta tus manos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Empaque Premium</h4>
                    <p className="text-xs text-muted-foreground mt-1">Manejo especializado para artículos de alto valor.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Tracking en Tiempo Real</h4>
                    <p className="text-xs text-muted-foreground mt-1">Podrás ver el estado de tu pedido desde nuestra web.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
