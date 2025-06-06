
import { useState, useEffect } from 'react';
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
import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from '@/contexts/LanguageContext';
import { loginUser, loginDemoPlatinumUser } from "@/services/auth/authService";
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { session } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    try {
      // Use our auth service for login
      const success = await loginUser(values.email, values.password);
      
      if (success) {
        toast({
          title: t('loginSuccessTitle') || "Login Successful",
          description: t('loginSuccessMsg') || "Welcome to your dashboard",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login Error",
          description: "Invalid credentials. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true);
    
    try {
      const result = await loginDemoPlatinumUser();
      
      if (result.success) {
        toast({
          title: "Demo Login Successful",
          description: "Welcome to your EasyROI dashboard",
        });
        navigate("/dashboard");
      } else {
        // Show the specific error message from Supabase
        let errorMessage = "Please ensure the demo account is properly configured in Supabase.";
        
        // Customize error message based on the error type
        if (result.error) {
          if (result.error.includes("Invalid login credentials")) {
            errorMessage = "Invalid credentials for demo account. The password may have been changed.";
          } else if (result.error.includes("User not found")) {
            errorMessage = "Demo user not found in Supabase. Please create the account.";
          } else if (result.error.includes("Email not confirmed")) {
            errorMessage = "Demo account email is not verified in Supabase.";
          } else {
            errorMessage = `Demo login error: ${result.error}`;
          }
        }
        
        console.error("Demo login error:", result.error);
        
        toast({
          title: "Demo Login Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Demo login exception:", error);
      toast({
        title: "Demo Login Error",
        description: "There was an unexpected issue logging in with the demo account.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
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
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('signingIn')}
                    </>
                  ) : (
                    t('signIn')
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Use Demo Platinum Account"
                )}
              </Button>
            </div>
            
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
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
