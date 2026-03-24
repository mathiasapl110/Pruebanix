import { Instagram, Facebook, Smartphone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-gradient-gold">NIX GLOBAL</h3>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Tu proveedor premium de productos Apple en Perú. Calidad, garantía y exclusividad en cada dispositivo.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-foreground">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="/#catalog" className="text-muted-foreground hover:text-primary transition-colors">Catálogo</a></li>
              <li><a href="/#about" className="text-muted-foreground hover:text-primary transition-colors">Nosotros</a></li>
              <li><Link href="/order" className="text-muted-foreground hover:text-primary transition-colors">Realizar Pedido</Link></li>
              <li><Link href="/auth" className="text-muted-foreground hover:text-primary transition-colors">Mi Cuenta</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-foreground">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Lima, Perú<br/>Envíos a todo el país</span>
              </li>
              <li className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground">+51 987 654 321</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-muted-foreground">contacto@nixglobal.pe</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NIX GLOBAL TRADE. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-primary transition-colors">Políticas de Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
