
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/types/property";

export function AdminActions() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Errore",
        description: "Inserisci un indirizzo email valido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Verifica se l'utente esiste già
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id, email, level')
        .eq('email', email)
        .single();
        
      if (existingUser) {
        // Aggiorna il livello dell'utente esistente a "owner"
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ level: 'owner' as UserRole })
          .eq('id', existingUser.id);
          
        if (updateError) throw updateError;
        
        toast({
          title: "Utente aggiornato",
          description: `L'utente ${email} è stato aggiornato al livello owner`,
        });
      } else {
        // Questa operazione richiede un'edge function o gestione backend specifica
        // per creare l'utente in auth e poi nel profilo
        const { error } = await supabase.functions.invoke('create-owner-user', {
          body: { email }
        });
        
        if (error) throw error;
        
        toast({
          title: "Utente creato",
          description: `Un nuovo utente owner con email ${email} è stato creato`,
        });
      }
      
      setEmail("");
    } catch (error: any) {
      console.error("Errore nella creazione dell'utente owner:", error);
      toast({
        title: "Operazione fallita",
        description: error.message || "Non è stato possibile creare l'utente owner",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Azioni amministrative</CardTitle>
        <CardDescription>
          Gestione degli utenti con privilegi elevati
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleCreateOwner} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="owner-email" className="text-sm font-medium mb-1 block">
              Email utente owner
            </label>
            <div className="flex space-x-2">
              <Input
                id="owner-email"
                type="email"
                placeholder="email@esempio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                {isLoading ? "In corso..." : "Crea Owner"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="text-sm text-gray-500">
        L'utente riceverà i privilegi di owner e avrà accesso a tutte le funzionalità.
      </CardFooter>
    </Card>
  );
}
