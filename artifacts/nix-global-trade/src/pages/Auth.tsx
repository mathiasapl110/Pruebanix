import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { useLoginUser, useRegisterUser } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const registerSchema = z.object({
  firstName: z.string().min(2, "Requerido"),
  lastName: z.string().min(2, "Requerido"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  phone: z.string().min(6, "Requerido"),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const loginMutation = useLoginUser();
  const registerMutation = useRegisterUser();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation.mutate({ data }, {
      onSuccess: (res) => {
        login(res.user, res.token);
        toast({ title: "Bienvenido", description: "Has iniciado sesión correctamente." });
        setLocation("/order");
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Error", description: err.error || "Credenciales inválidas" });
      }
    });
  };

  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    registerMutation.mutate({ data }, {
      onSuccess: (res) => {
        login(res.user, res.token);
        toast({ title: "Cuenta creada", description: "Te has registrado correctamente." });
        setLocation("/order");
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Error", description: err.error || "No se pudo registrar" });
      }
    });
  };

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-20 px-4 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
        
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden relative z-10">
          <div className="flex border-b border-border">
            <button
              className={`flex-1 py-4 text-sm font-medium transition-colors ${isLogin ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setIsLogin(true)}
            >
              Iniciar Sesión
            </button>
            <button
              className={`flex-1 py-4 text-sm font-medium transition-colors ${!isLogin ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setIsLogin(false)}
            >
              Registrarse
            </button>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-serif font-bold text-center mb-6">
              {isLogin ? "Bienvenido de vuelta" : "Únete a Nix Global"}
            </h2>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <Input placeholder="Correo Electrónico" type="email" {...loginForm.register("email")} />
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-destructive mt-1">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Input placeholder="Contraseña" type="password" {...loginForm.register("password")} />
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-destructive mt-1">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full gold-glow mt-4" isLoading={loginMutation.isPending}>
                    Ingresar
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input placeholder="Nombre" {...registerForm.register("firstName")} />
                      {registerForm.formState.errors.firstName && (
                        <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Input placeholder="Apellido" {...registerForm.register("lastName")} />
                      {registerForm.formState.errors.lastName && (
                        <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Input placeholder="Correo Electrónico" type="email" {...registerForm.register("email")} />
                    {registerForm.formState.errors.email && (
                      <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Input placeholder="Teléfono" type="tel" {...registerForm.register("phone")} />
                    {registerForm.formState.errors.phone && (
                      <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <Input placeholder="Contraseña" type="password" {...registerForm.register("password")} />
                    {registerForm.formState.errors.password && (
                      <p className="text-xs text-destructive mt-1">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full gold-glow mt-4" isLoading={registerMutation.isPending}>
                    Crear Cuenta
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
