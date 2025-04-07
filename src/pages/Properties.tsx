import React, { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BadgeLevel } from "@/components/ui/badge-level";
import { ChevronDown, Globe, MapPin, Wifi, Tv, Car, Bath, Bed, Droplet } from "lucide-react";

// Sample properties data
const properties = [
  {
    id: 1,
    title: "Luxury Villa with Ocean View",
    location: "Portofino, Italy",
    price: "€2,500,000",
    roi: "7.5%",
    description: "Elegant villa with panoramic ocean views, private pool, and lush gardens in the exclusive Portofino area.",
    status: "Available",
    badges: ["Premium", "Sea View"],
    minInvestment: "€250,000",
    investorLevel: "silver",
    image: "/placeholder.svg",
    amenities: ["Pool", "Garden", "WiFi", "Parking", "Air Conditioning", "5 Beds", "4 Baths"],
    details: {
      size: "450 m²",
      bedrooms: 5,
      bathrooms: 4,
      builtYear: 2019,
      parking: 2,
    }
  },
  {
    id: 2,
    title: "Modern Penthouse in Downtown",
    location: "Milan, Italy",
    price: "€1,800,000",
    roi: "6.2%",
    description: "Stunning penthouse with modern design, spacious terrace and panoramic view of Milan skyline.",
    status: "Available",
    badges: ["Premium", "City View"],
    minInvestment: "€180,000",
    investorLevel: "bronze",
    image: "/placeholder.svg",
    amenities: ["Terrace", "Smart Home", "WiFi", "Parking", "Air Conditioning", "3 Beds", "2 Baths"],
    details: {
      size: "220 m²",
      bedrooms: 3,
      bathrooms: 2,
      builtYear: 2020,
      parking: 1,
    }
  },
  {
    id: 3,
    title: "Palm Jumeirah Beachfront Villa",
    location: "Dubai, UAE",
    price: "€5,900,000",
    roi: "8.3%",
    description: "Exclusive beachfront villa on Palm Jumeirah with private beach access, infinity pool and stunning architecture.",
    status: "Available",
    badges: ["Ultra Luxury", "Beachfront"],
    minInvestment: "€500,000",
    investorLevel: "gold",
    image: "/placeholder.svg",
    amenities: ["Private Beach", "Infinity Pool", "Smart Home", "Parking", "Home Theater", "6 Beds", "7 Baths"],
    details: {
      size: "780 m²",
      bedrooms: 6,
      bathrooms: 7,
      builtYear: 2021,
      parking: 4,
    }
  },
  {
    id: 4,
    title: "Historic Palazzo Apartment",
    location: "Florence, Italy",
    price: "€3,200,000",
    roi: "5.8%",
    description: "Elegant apartment in a renovated historic palazzo in the heart of Florence, featuring original frescoes and modern amenities.",
    status: "Available",
    badges: ["Historic", "City Center"],
    minInvestment: "€320,000",
    investorLevel: "platinum",
    image: "/placeholder.svg",
    amenities: ["Frescoes", "Elevator", "WiFi", "Air Conditioning", "Security", "4 Beds", "3 Baths"],
    details: {
      size: "320 m²",
      bedrooms: 4,
      bathrooms: 3,
      builtYear: 1780,
      renovated: 2018,
      parking: 0,
    }
  }
];

// Filter options
const locations = ["All Locations", "Italy", "Dubai", "Spain", "France"];
const priceRanges = ["All Prices", "Under €1M", "€1M - €3M", "€3M - €5M", "€5M+"];
const investorLevels = ["All Levels", "Bronze", "Silver", "Gold", "Platinum", "Diamond"];

export default function Properties() {
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");
  const [selectedInvestorLevel, setSelectedInvestorLevel] = useState("All Levels");
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-easyroi-purple-950 via-easyroi-purple-900 to-easyroi-purple-800 pb-20">
        <div className="container px-4 py-12 mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gradient-gold">
              Exclusive Properties
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Discover our handpicked selection of luxury real estate investments in premier locations around the world.
            </p>
          </div>

          {/* Filters section */}
          <div className="mb-12">
            <Collapsible
              open={filtersOpen}
              onOpenChange={setFiltersOpen}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 mb-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Filter Properties</h2>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:text-easyroi-gold">
                    <ChevronDown className={`h-5 w-5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                    <span className="ml-1">{filtersOpen ? 'Hide Filters' : 'Show Filters'}</span>
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="mt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Location filter */}
                  <div>
                    <h3 className="font-medium mb-2 text-white/90">Location</h3>
                    <div className="space-y-2">
                      {locations.map(location => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`location-${location}`} 
                            checked={selectedLocation === location}
                            onCheckedChange={() => setSelectedLocation(location)}
                            className="border-easyroi-gold data-[state=checked]:bg-easyroi-gold data-[state=checked]:text-easyroi-navy"
                          />
                          <label 
                            htmlFor={`location-${location}`}
                            className="text-sm text-white/80 cursor-pointer"
                          >
                            {location}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price range filter */}
                  <div>
                    <h3 className="font-medium mb-2 text-white/90">Price Range</h3>
                    <div className="space-y-2">
                      {priceRanges.map(range => (
                        <div key={range} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`price-${range}`} 
                            checked={selectedPriceRange === range}
                            onCheckedChange={() => setSelectedPriceRange(range)}
                            className="border-easyroi-gold data-[state=checked]:bg-easyroi-gold data-[state=checked]:text-easyroi-navy"
                          />
                          <label 
                            htmlFor={`price-${range}`}
                            className="text-sm text-white/80 cursor-pointer"
                          >
                            {range}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investor level filter */}
                  <div>
                    <h3 className="font-medium mb-2 text-white/90">Investor Level</h3>
                    <div className="space-y-2">
                      {investorLevels.map(level => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`level-${level}`} 
                            checked={selectedInvestorLevel === level}
                            onCheckedChange={() => setSelectedInvestorLevel(level)}
                            className="border-easyroi-gold data-[state=checked]:bg-easyroi-gold data-[state=checked]:text-easyroi-navy"
                          />
                          <label 
                            htmlFor={`level-${level}`}
                            className="text-sm text-white/80 cursor-pointer"
                          >
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Reset Filters
                  </Button>
                  <Button className="bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90">
                    Apply Filters
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Properties grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(property => (
              <Card key={property.id} className="luxury-card overflow-hidden backdrop-blur-md bg-white/5 border-white/10 text-white">
                <div className="aspect-video w-full overflow-hidden">
                  <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">{property.title}</CardTitle>
                    <BadgeLevel level={property.investorLevel as any} />
                  </div>
                  <div className="flex items-center text-sm text-white/70 mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <CardDescription className="text-white/70">{property.location}</CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-2">
                  <p className="text-sm text-white/80 mb-4">{property.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-white/70">Price</p>
                      <p className="font-bold text-easyroi-gold">{property.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Expected ROI</p>
                      <p className="font-bold text-easyroi-gold">{property.roi}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Min Investment</p>
                      <p className="font-bold text-white">{property.minInvestment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Status</p>
                      <p className="font-bold text-green-400">{property.status}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.amenities.slice(0, 4).map((amenity, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-white/10 rounded text-xs">
                        {amenity.includes("Pool") && <Droplet className="h-3 w-3 mr-1" />}
                        {amenity.includes("WiFi") && <Wifi className="h-3 w-3 mr-1" />}
                        {amenity.includes("Parking") && <Car className="h-3 w-3 mr-1" />}
                        {amenity.includes("Beds") && <Bed className="h-3 w-3 mr-1" />}
                        {amenity.includes("Baths") && <Bath className="h-3 w-3 mr-1" />}
                        {(!amenity.includes("Pool") && !amenity.includes("WiFi") && 
                          !amenity.includes("Parking") && !amenity.includes("Beds") && 
                          !amenity.includes("Baths")) && <Globe className="h-3 w-3 mr-1" />}
                        {amenity}
                      </span>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-easyroi-gold/90 to-easyroi-gold hover:from-easyroi-gold hover:to-easyroi-gold/90 text-easyroi-navy">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
