
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserCreationData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

serve(async (req) => {
  // Gestione richieste CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Estrazione dati dalla richiesta
    const { email, password, firstName, lastName } = await req.json() as UserCreationData;
    
    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: "Email and password are required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    console.log(`Creating new user with email: ${email}`);

    // Creazione dell'utente in auth.users
    const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-conferma l'email
      user_metadata: {
        first_name: firstName || "",
        last_name: lastName || ""
      }
    });

    if (createUserError) {
      console.error("Error creating user:", createUserError);
      return new Response(
        JSON.stringify({ success: false, message: createUserError.message }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    // Aggiornamento del livello a 'owner' nella tabella profiles
    const { error: updateProfileError } = await supabaseAdmin
      .from('profiles')
      .update({ level: 'owner' })
      .eq('id', userData.user.id);

    if (updateProfileError) {
      console.error("Error updating profile level:", updateProfileError);
      return new Response(
        JSON.stringify({ success: false, message: updateProfileError.message }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500 
        }
      );
    }

    // Risposta con i dati dell'utente
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "User created successfully", 
        user: {
          id: userData.user.id,
          email: userData.user.email
        }
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
