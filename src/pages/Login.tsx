
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

const DEMO_EMAIL = 'demo@easyroi.com';
const DEMO_PASSWORD = 'demo123456';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAuthError(null);
    
    try {
      let email = values.email;
      let password = values.password;
      
      // Gestione login demo
      if (email.toLowerCase() === DEMO_EMAIL) {
        // Per l'account demo, accetta qualsiasi password o usa la password predefinita
        if (!password || password.trim() === '') {
          password = DEMO_PASSWORD;
        }
        
        console.log("Tentativo di accesso con account demo");
        
        // Prova a effettuare il login
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: DEMO_PASSWORD // Usa sempre la password demo predefinita per l'account demo
        });
        
        // Se il login fallisce perché l'account non esiste, registralo automaticamente
        if (signInError && signInError.message.includes('Invalid login credentials')) {
          console.log("Account demo non trovato, creazione in corso...");
          
          // Registra l'account demo
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: DEMO_EMAIL,
            password: DEMO_PASSWORD,
            options: {
              data: {
                first_name: 'Demo',
                last_name: 'User',
              }
            }
          });
          
          if (signUpError) {
            setAuthError(signUpError.message);
            toast({
              title: t('registrationFailedTitle'),
              description: signUpError.message,
              variant: "destructive",
            });
          } else {
            // Dopo la registrazione, prova a effettuare il login
            const { data, error } = await supabase.auth.signInWithPassword({
              email: DEMO_EMAIL,
              password: DEMO_PASSWORD
            });
            
            if (error) {
              setAuthError(error.message);
              toast({
                title: t('loginFailedTitle'),
                description: error.message,
                variant: "destructive",
              });
            } else if (data.session) {
              toast({
                title: t('loginSuccessTitle'),
                description: t('loginSuccessMsg'),
              });
              navigate("/dashboard");
            }
          }
        } else if (signInError) {
          // Se c'è un altro tipo di errore durante il login
          setAuthError(signInError.message);
          toast({
            title: t('loginFailedTitle'),
            description: signInError.message,
            variant: "destructive",
          });
        } else if (signInData.session) {
          // Login riuscito
          toast({
            title: t('loginSuccessTitle'),
            description: t('loginSuccessMsg'),
          });
          navigate("/dashboard");
        }
      } else {
        // Login per account non demo
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          setAuthError(error.message);
          toast({
            title: t('loginFailedTitle'),
            description: error.message,
            variant: "destructive",
          });
        } else if (data.session) {
          toast({
            title: t('loginSuccessTitle'),
            description: t('loginSuccessMsg'),
          });
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: t('loginFailedTitle'),
        description: t('loginErrorMsg'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-easyroi-purple-800">{t('investorPortal')}</h1>
            <p className="mt-2 text-gray-600">{t('investorPortalDesc')}</p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                {t('privatePortalAlert')}
              </AlertDescription>
            </Alert>
            
            {authError && (
              <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription>
                  {authError}
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input placeholder="demo@easyroi.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm font-medium text-easyroi-purple-800 hover:text-easyroi-purple-800/80">
                    {t('forgotPassword')}
                  </Link>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-easyroi-navy hover:bg-easyroi-navy/90"
                  disabled={loading}
                >
                  {loading ? t('signingIn') : t('signIn')}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('needAssistance')}
              </p>
            </div>
            
            <div className="mt-8 text-center">
              <Link to="/dashboard">
                <Button 
                  className="bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy shadow-md transition-all duration-300 flex items-center"
                >
                  {t('scheduleMeeting')}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 text-center border-t pt-4">
              <p className="text-xs text-gray-500">
                Per il demo utilizza: <strong>demo@easyroi.com</strong> e password <strong>demo123</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
