import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Zap, Package } from "lucide-react";
import { useGetProducts, useGetReviews } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";

// Mock products if API fails or is empty for preview
const MOCK_PRODUCTS = [
  { id: 1, name: "iPhone 15 Pro Max", price: 5499, description: "Titanio forjado. Chip A17 Pro. Botón de acción.", category: "iPhone", imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80", features: ["256GB / 512GB / 1TB", "Cámara 48MP", "Pantalla 6.7\""] },
  { id: 2, name: "iPhone 15 Pro", price: 4699, description: "Diseño en titanio de calidad aeroespacial.", category: "iPhone", imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&auto=format&fit=crop&q=80", features: ["128GB / 256GB / 512GB", "Cámara 48MP", "Pantalla 6.1\""] },
  { id: 3, name: "iPhone 15", price: 3899, description: "Dynamic Island. Nueva cámara principal de 48 MP.", category: "iPhone", imageUrl: "https://images.unsplash.com/photo-1695048064977-1c448bbdb947?w=800&auto=format&fit=crop&q=80", features: ["128GB / 256GB / 512GB", "USB-C", "Pantalla 6.1\""] },
];

export default function Home() {
  const { data: productsData } = useGetProducts();
  const products = productsData?.length ? productsData : MOCK_PRODUCTS;

  return (
    <AppLayout>
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Hero background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground mb-6 leading-tight">
              EXCLUSIVIDAD EN <br /> <span className="text-gradient-gold">CADA DETALLE</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              NIX GLOBAL TRADE te trae la tecnología Apple más exclusiva directo desde USA a Perú. Tu próximo iPhone te espera.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/order">
                <Button size="lg" className="gold-glow w-full sm:w-auto text-lg px-8">
                  Rellena el Formulario
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#catalog">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 border-white/20 text-white hover:bg-white/10">
                  Ver Catálogo
                </Button>
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Descubre más</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">El Estándar NIX GLOBAL</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Somos expertos en importación de dispositivos móviles premium. Nos encargamos de todo el proceso logístico para que recibas tu equipo Apple con la máxima seguridad, garantía y en tiempo récord.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Equipos 100% Originales con Garantía</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Importación Rápida y Segura</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Tracking Paso a Paso de tu Pedido</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl blur-2xl"></div>
              <img 
                src={`${import.meta.env.BASE_URL}images/about-iphone.png`}
                alt="Premium iPhone Presentation" 
                className="relative rounded-2xl w-full h-auto object-cover border border-white/10 shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATALOG SECTION */}
      <section id="catalog" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Nuestro Catálogo</h2>
            <p className="text-muted-foreground">
              Selecciona el equipo perfecto para ti. Todos nuestros productos incluyen envío asegurado e impuestos aduaneros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_hsla(46,65%,52%,0.2)]"
              >
                <div className="aspect-[4/3] bg-secondary relative overflow-hidden flex items-center justify-center p-8">
                  {/* Stock photo for products to look realistic */}
                  <img 
                    src={product.imageUrl || `https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80`} 
                    alt={product.name}
                    className="object-contain w-full h-full drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur border border-border px-3 py-1 rounded-full text-xs font-medium text-primary">
                    Stock Disponible
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold font-serif">{product.name}</h3>
                    <span className="text-lg font-medium text-gradient-gold">{formatPrice(product.price)}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 h-10 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {product.features && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.features.slice(0,3).map(f => (
                        <span key={f} className="text-xs bg-secondary px-2 py-1 rounded-md text-muted-foreground">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/order?product=${product.id}`}>
                    <Button className="w-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors border border-border group-hover:border-primary">
                      Solicitar Pedido
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="py-20 relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">¿Dudas sobre el proceso?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Nuestro equipo de asesores está listo para ayudarte con tu compra. Escríbenos directamente y recibe atención personalizada.
          </p>
          <Button size="lg" className="gold-glow">
            Contactar por WhatsApp
          </Button>
        </div>
      </section>
    </AppLayout>
  );
}
