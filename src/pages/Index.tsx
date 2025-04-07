
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { RotatingShape } from '@/components/RotatingShape';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ArrowDown, MapPin, Building2, BarChart3, Shield } from 'lucide-react';

const Index = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section - Minimalist */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/c6fb964a-ed49-478a-88c3-5d395e52f920.png" 
            alt="Luxury Dubai Apartment View" 
            className="w-full h-full object-cover object-center"
            style={{
              filter: 'brightness(0.85)',
              transform: `scale(1.1) translateY(${scrollPosition * 0.1}px)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-easyroi-purple-950/70 via-easyroi-purple-900/60 to-transparent z-10"></div>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-20">
          <div className="max-w-2xl">
            <AnimatedSection delay={300}>
              <h1 className="minimal-title text-white">
                Premium Real Estate 
                <span className="block text-easyroi-gold font-normal"> Exceptional Returns</span>
              </h1>
            </AnimatedSection>
            
            <AnimatedSection delay={600}>
              <p className="minimal-subtitle text-gray-200 mt-6">
                Exclusive access to high-yield international real estate investments.
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={900} className="mt-12">
              <div className="flex gap-6">
                <Link to="/register">
                  <Button className="bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy font-normal px-8 py-6 text-lg rounded-none button-hover-scale">
                    Start Investing
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <span className="text-sm text-easyroi-gold/80 mb-2 tracking-widest">SCROLL</span>
          <div className="scroll-indicator-line"></div>
        </div>
      </section>
      
      {/* Minimalist Features Section with Luxury Image */}
      <section className="minimal-section bg-white">
        <div className="minimal-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <AnimatedSection>
              <h2 className="minimal-title text-easyroi-purple-900">Luxury portfolio carefully curated</h2>
              <p className="minimal-subtitle">
                Access to exclusive real estate opportunities not available on the open market.
              </p>
            </AnimatedSection>
            
            <div className="relative">
              <AnimatedSection className="absolute right-0 top-0">
                <RotatingShape className="ml-auto" />
              </AnimatedSection>
            </div>
          </div>
          
          <div className="minimal-cards-container mt-24">
            <AnimatedSection delay={100} className="minimal-card">
              <Building2 className="h-6 w-6 text-easyroi-gold mb-4" />
              <h3 className="minimal-card-title">Premium Properties</h3>
              <p className="minimal-card-text">Access exclusive real estate in Italy, Dubai, and other luxury markets.</p>
            </AnimatedSection>
            
            <AnimatedSection delay={200} className="minimal-card">
              <BarChart3 className="h-6 w-6 text-easyroi-gold mb-4" />
              <h3 className="minimal-card-title">Portfolio Analytics</h3>
              <p className="minimal-card-text">Track investments with comprehensive real-time data analysis.</p>
            </AnimatedSection>
            
            <AnimatedSection delay={300} className="minimal-card">
              <Shield className="h-6 w-6 text-easyroi-gold mb-4" />
              <h3 className="minimal-card-title">Secure Platform</h3>
              <p className="minimal-card-text">Enterprise-grade security for your investments and data.</p>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      {/* Locations Section - Minimal with Luxury Images */}
      <section className="minimal-section bg-white">
        <div className="minimal-container">
          <AnimatedSection>
            <h2 className="minimal-title text-easyroi-purple-900 mb-24">Featured Locations</h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {['Milan, Italy', 'Rome, Italy', 'Dubai, UAE'].map((location, index) => (
              <AnimatedSection key={location} delay={index * 100} className="relative h-96 group overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt={location} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 flex flex-col justify-end p-8">
                  <div className="flex items-center text-white mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-easyroi-gold" />
                    <span className="text-sm tracking-wide">{location}</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section - Minimal */}
      <section className="minimal-section bg-white">
        <div className="minimal-container">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-gray-200 pt-12">
              <h2 className="minimal-title text-easyroi-purple-900 max-w-xl">Ready to maximize your investment potential?</h2>
              
              <div className="mt-8 md:mt-0">
                <Link to="/register">
                  <Button className="bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy font-normal px-8 py-6 text-lg rounded-none button-hover-scale">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
