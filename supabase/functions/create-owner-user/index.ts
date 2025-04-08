
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    ) as string;

    // Initialize Supabase client with service role key
    // This allows us to bypass RLS and perform admin actions
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get the email from the request
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate a random password (user will need to reset it)
    const tempPassword = crypto.randomUUID().replace(/-/g, "").substring(0, 12);

    // Create the user in auth.users
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm the email
    });

    if (userError) {
      throw userError;
    }

    // The user was created, now update their profile to set the level to "owner"
    if (userData.user) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ level: "owner" })
        .eq("id", userData.user.id);

      if (profileError) {
        throw profileError;
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Owner user created successfully", 
        user: userData.user 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating owner user:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to create owner user",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
