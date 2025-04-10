
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { user_id, name, location, value, roi, status } = await req.json();
    
    // Validate input
    if (!user_id || !name || !location || !value || roi === undefined || !status) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Initialize Supabase client using Deno runtime environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Create Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract country from location
    const country = location.includes(',') 
      ? location.split(',')[1].trim() 
      : location.trim();

    // Step 1: Check if user exists
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select()
      .eq('id', user_id)
      .single();
      
    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Step 2: Insert property location or get existing
    let location_id;
    const locationParts = location.split(',').map(part => part.trim());
    const city = locationParts[0];
    
    // Check if location already exists
    const { data: existingLocation } = await supabase
      .from('property_locations')
      .select('id')
      .eq('city', city)
      .eq('country', country)
      .maybeSingle();

    if (existingLocation) {
      location_id = existingLocation.id;
    } else {
      // Insert new location
      const { data: newLocation, error: locationError } = await supabase
        .from('property_locations')
        .insert({
          city: city,
          country: country,
          address: location,
          zone: city // Default zone to city if not provided
        })
        .select()
        .single();

      if (locationError) {
        console.error("Error creating location:", locationError);
        return new Response(
          JSON.stringify({ error: "Failed to create property location" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      location_id = newLocation.id;
    }

    // Step 3: Insert property
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .insert({
        name: name,
        user_id: user_id,
        price: value,
        roi_percentage: roi * 100, // Convert decimal to percentage
        status: status,
        location_id: location_id,
        bedrooms: 1, // Default values for required fields
        bathrooms: 1, // Default values for required fields
        size_sqm: 100, // Default values for required fields
        occupation_status: status === 'active' ? 'occupied' : 'vacant'
      })
      .select()
      .single();

    if (propertyError) {
      console.error("Error creating property:", propertyError);
      return new Response(
        JSON.stringify({ error: "Failed to create property" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Step 4: Update user_properties count
    const { data: userPropertiesData, error: userPropertiesError } = await supabase
      .from('user_properties')
      .select()
      .eq('user_id', user_id)
      .maybeSingle();

    if (userPropertiesData) {
      // Update existing record
      const newCount = userPropertiesData.count + 1;
      const change = newCount - userPropertiesData.count;
      
      await supabase
        .from('user_properties')
        .update({ 
          count: newCount,
          change: change,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id);
    } else {
      // Insert new record
      await supabase
        .from('user_properties')
        .insert({
          user_id: user_id,
          count: 1,
          change: 1
        });
    }

    // Step 5: Calculate and update user_roi
    // Get all properties for this user
    const { data: userProperties } = await supabase
      .from('properties')
      .select('roi_percentage')
      .eq('user_id', user_id);

    if (userProperties && userProperties.length > 0) {
      const totalRoi = userProperties.reduce((sum, prop) => sum + Number(prop.roi_percentage || 0), 0);
      const averageRoi = totalRoi / userProperties.length;
      
      // Get current ROI
      const { data: currentRoi } = await supabase
        .from('user_roi')
        .select('average_roi')
        .eq('user_id', user_id)
        .maybeSingle();
        
      const roiChange = currentRoi ? averageRoi - Number(currentRoi.average_roi) : 0;
      
      await supabase
        .from('user_roi')
        .upsert({
          user_id: user_id,
          average_roi: averageRoi,
          roi_change: roiChange,
          updated_at: new Date().toISOString()
        });
    }

    // Step 6: Update user investment
    const { data: userInvestmentData } = await supabase
      .from('user_investments')
      .select('total_investment')
      .eq('user_id', user_id)
      .maybeSingle();
      
    const previousInvestment = userInvestmentData ? Number(userInvestmentData.total_investment) : 0;
    const newInvestment = previousInvestment + Number(value);
    
    // Calculate percentage change
    const investmentChangePercentage = previousInvestment === 0 
      ? 100 
      : ((newInvestment - previousInvestment) / previousInvestment) * 100;

    await supabase
      .from('user_investments')
      .upsert({
        user_id: user_id,
        total_investment: newInvestment,
        investment_change_percentage: investmentChangePercentage,
        updated_at: new Date().toISOString()
      });

    // Step 7: Update portfolio allocation
    // Get all properties for this user
    const { data: allProperties } = await supabase
      .from('properties')
      .select('price, location_id')
      .eq('user_id', user_id);
      
    if (allProperties && allProperties.length > 0) {
      // Get all locations
      const locationIds = allProperties.map(p => p.location_id);
      
      const { data: locations } = await supabase
        .from('property_locations')
        .select('id, country')
        .in('id', locationIds);
        
      // Map location IDs to countries
      const locationMap = {};
      if (locations) {
        locations.forEach(loc => {
          locationMap[loc.id] = loc.country;
        });
      }
      
      // Calculate allocation by country
      const totalInvestment = allProperties.reduce((sum, prop) => sum + Number(prop.price || 0), 0);
      const allocationByCountry = {};
      
      allProperties.forEach(prop => {
        const country = locationMap[prop.location_id] || 'Unknown';
        if (!allocationByCountry[country]) {
          allocationByCountry[country] = 0;
        }
        allocationByCountry[country] += Number(prop.price || 0);
      });
      
      // Convert to percentages and update database
      for (const [country, investment] of Object.entries(allocationByCountry)) {
        const percentage = (Number(investment) / totalInvestment) * 100;
        
        await supabase
          .from('user_portfolio_allocation')
          .upsert({
            user_id: user_id,
            location: country,
            percentage: percentage
          }, {
            onConflict: 'user_id,location'
          });
      }
    }

    // Step 8: Update investment growth
    const currentYear = new Date().getFullYear();
    const months = [
      { name: 'Jan', index: 0 },
      { name: 'Feb', index: 1 },
      { name: 'Mar', index: 2 },
      { name: 'Apr', index: 3 },
      { name: 'May', index: 4 },
      { name: 'Jun', index: 5 },
      { name: 'Jul', index: 6 },
      { name: 'Aug', index: 7 },
      { name: 'Sep', index: 8 },
      { name: 'Oct', index: 9 },
      { name: 'Nov', index: 10 },
      { name: 'Dec', index: 11 }
    ];
    
    // Get current month index
    const currentMonthIndex = new Date().getMonth();
    
    // For all months up to current month, update investment growth
    for (let i = 0; i <= currentMonthIndex; i++) {
      const month = months[i];
      
      const { data: existingMonth } = await supabase
        .from('user_investment_growth')
        .select('value')
        .eq('user_id', user_id)
        .eq('year', currentYear)
        .eq('month', month.name)
        .maybeSingle();
        
      if (existingMonth) {
        await supabase
          .from('user_investment_growth')
          .update({
            value: i < currentMonthIndex ? existingMonth.value : newInvestment
          })
          .eq('user_id', user_id)
          .eq('year', currentYear)
          .eq('month', month.name);
      } else {
        await supabase
          .from('user_investment_growth')
          .insert({
            user_id: user_id,
            year: currentYear,
            month: month.name,
            month_index: month.index,
            value: i < currentMonthIndex ? previousInvestment : newInvestment
          });
      }
    }

    return new Response(
      JSON.stringify({ success: true, property_id: property.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
