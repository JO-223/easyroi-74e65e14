
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Get request body
    const { source, data } = await req.json();
    
    if (!source || !data || !Array.isArray(data)) {
      return new Response(
        JSON.stringify({ error: "Invalid request body. Must include source and data array." }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create an import record
    const { data: importRecord, error: importError } = await supabase
      .from('data_imports')
      .insert([{ source, status: 'processing' }])
      .select('id')
      .single();
    
    if (importError) throw importError;
    
    // Process properties
    let created = 0;
    let updated = 0;
    let failed = 0;
    const errors = [];
    
    for (const property of data) {
      try {
        // First, ensure we have a location
        let locationId;
        
        // Check if location exists
        const { data: existingLocations } = await supabase
          .from('property_locations')
          .select('id')
          .eq('address', property.address)
          .eq('zone', property.zone)
          .eq('city', property.city)
          .eq('country', property.country || 'Italy') // Default to Italy if not specified
          .limit(1);
        
        if (existingLocations && existingLocations.length > 0) {
          locationId = existingLocations[0].id;
        } else {
          // Create new location
          const { data: newLocation, error: locationError } = await supabase
            .from('property_locations')
            .insert([{
              address: property.address,
              zone: property.zone,
              city: property.city,
              country: property.country || 'Italy'
            }])
            .select('id')
            .single();
          
          if (locationError) throw locationError;
          locationId = newLocation.id;
        }
        
        // Ensure we have a property type
        let typeId;
        
        // Check if type exists
        const { data: existingTypes } = await supabase
          .from('property_types')
          .select('id')
          .eq('name', property.type)
          .limit(1);
        
        if (existingTypes && existingTypes.length > 0) {
          typeId = existingTypes[0].id;
        } else {
          // Create new type
          const { data: newType, error: typeError } = await supabase
            .from('property_types')
            .insert([{
              name: property.type,
              description: `Properties of type ${property.type}`
            }])
            .select('id')
            .single();
          
          if (typeError) throw typeError;
          typeId = newType.id;
        }
        
        // Check if property with this source_id exists
        let propertyId;
        let isNew = true;
        
        if (property.source_id) {
          const { data: existingProperty } = await supabase
            .from('properties')
            .select('id')
            .eq('source_id', property.source_id)
            .eq('data_source', source)
            .limit(1);
          
          if (existingProperty && existingProperty.length > 0) {
            propertyId = existingProperty[0].id;
            isNew = false;
          }
        }
        
        // Prepare property data
        const propertyData = {
          name: property.name,
          price: property.price,
          size_sqm: property.size_sqm,
          occupation_status: property.occupation_status,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          type_id: typeId,
          location_id: locationId,
          status: property.status || 'available',
          service_charges: property.service_charges,
          roi_percentage: property.roi_percentage,
          min_investment: property.min_investment,
          investor_level: property.investor_level || 'bronze',
          data_source: source,
          source_id: property.source_id
        };
        
        // Create or update property
        let upsertResult;
        if (isNew) {
          upsertResult = await supabase
            .from('properties')
            .insert([propertyData])
            .select('id')
            .single();
          
          if (upsertResult.error) throw upsertResult.error;
          propertyId = upsertResult.data.id;
          created++;
        } else {
          upsertResult = await supabase
            .from('properties')
            .update(propertyData)
            .eq('id', propertyId)
            .select('id')
            .single();
          
          if (upsertResult.error) throw upsertResult.error;
          updated++;
        }
        
        // Handle amenities if provided
        if (property.amenities && Array.isArray(property.amenities)) {
          // Remove existing amenities for this property
          await supabase
            .from('property_amenities')
            .delete()
            .eq('property_id', propertyId);
          
          // Add new amenities
          for (const amenityName of property.amenities) {
            // Check if amenity exists
            const { data: existingAmenity } = await supabase
              .from('amenities')
              .select('id')
              .eq('name', amenityName)
              .limit(1);
            
            let amenityId;
            if (existingAmenity && existingAmenity.length > 0) {
              amenityId = existingAmenity[0].id;
            } else {
              // Create new amenity
              const { data: newAmenity, error: amenityError } = await supabase
                .from('amenities')
                .insert([{
                  name: amenityName
                }])
                .select('id')
                .single();
              
              if (amenityError) throw amenityError;
              amenityId = newAmenity.id;
            }
            
            // Link amenity to property
            await supabase
              .from('property_amenities')
              .insert([{
                property_id: propertyId,
                amenity_id: amenityId
              }]);
          }
        }
        
        // Handle pros and cons if provided
        if (property.pros && Array.isArray(property.pros)) {
          // Remove existing pros for this property
          await supabase
            .from('property_pros_cons')
            .delete()
            .eq('property_id', propertyId)
            .eq('is_pro', true);
          
          // Add new pros
          for (const proDesc of property.pros) {
            await supabase
              .from('property_pros_cons')
              .insert([{
                property_id: propertyId,
                is_pro: true,
                description: proDesc
              }]);
          }
        }
        
        if (property.cons && Array.isArray(property.cons)) {
          // Remove existing cons for this property
          await supabase
            .from('property_pros_cons')
            .delete()
            .eq('property_id', propertyId)
            .eq('is_pro', false);
          
          // Add new cons
          for (const conDesc of property.cons) {
            await supabase
              .from('property_pros_cons')
              .insert([{
                property_id: propertyId,
                is_pro: false,
                description: conDesc
              }]);
          }
        }
        
        // Handle images if provided
        if (property.images && Array.isArray(property.images)) {
          // Remove existing images for this property
          await supabase
            .from('property_images')
            .delete()
            .eq('property_id', propertyId);
          
          // Add new images
          for (const [index, imageUrl] of property.images.entries()) {
            await supabase
              .from('property_images')
              .insert([{
                property_id: propertyId,
                url: imageUrl,
                is_primary: index === 0 // First image is primary
              }]);
          }
        }
      } catch (error) {
        console.error('Error processing property:', property, error);
        failed++;
        errors.push({
          property: property.name || 'Unknown property',
          error: error.message
        });
      }
    }
    
    // Update import record
    await supabase
      .from('data_imports')
      .update({
        status: 'completed',
        records_processed: data.length,
        records_created: created,
        records_updated: updated,
        records_failed: failed,
        error_details: failed > 0 ? JSON.stringify(errors) : null,
        completed_at: new Date().toISOString()
      })
      .eq('id', importRecord.id);
    
    return new Response(
      JSON.stringify({
        success: true,
        importId: importRecord.id,
        processed: data.length,
        created,
        updated,
        failed
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in import-properties function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
