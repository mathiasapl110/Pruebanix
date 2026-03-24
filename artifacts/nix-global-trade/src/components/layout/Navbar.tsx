import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Catálogo", href: "/#catalog" },
    { name: "Nosotros", href: "/#about" },
    { name: "Contacto", href: "/#contact" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
      isScrolled ? "bg-background/90 backdrop-blur-md border-border py-4 shadow-lg" : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-serif font-bold text-gradient-gold tracking-wider group-hover:opacity-80 transition-opacity">
            NIX GLOBAL
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-border pl-6">
            {isAuthenticated ? (
              <>
                <Link href="/my-orders" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Mis Pedidos
                </Link>
                {user?.isAdmin && (
                  <Link href="/admin" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Iniciar Sesión
                </Link>
                <Link href="/order">
                  <Button className="gold-glow">Hacer un Pedido</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-2xl p-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-foreground p-2 hover:bg-secondary rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="h-px bg-border w-full my-2" />
          {isAuthenticated ? (
            <>
              <Link href="/my-orders" className="text-lg font-medium text-foreground p-2 hover:bg-secondary rounded-md flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <User className="w-5 h-5 text-primary" /> Mis Pedidos
              </Link>
              {user?.isAdmin && (
                <Link href="/admin" className="text-lg font-medium text-primary p-2 hover:bg-secondary rounded-md flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <ShieldCheck className="w-5 h-5" /> Panel Admin
                </Link>
              )}
              <Button variant="outline" className="w-full justify-start mt-2 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                <LogOut className="w-5 h-5 mr-2" /> Cerrar Sesión
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link href="/auth">
                <Button variant="outline" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Iniciar Sesión</Button>
              </Link>
              <Link href="/order">
                <Button className="w-full gold-glow" onClick={() => setIsMobileMenuOpen(false)}>Hacer un Pedido</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
