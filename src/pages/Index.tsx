
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { RotatingShape } from '@/components/RotatingShape';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ArrowDown, MapPin, Building2, BarChart3, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { t } = useLanguage();
  
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
      
      {/* Hero Section - Minimalist with optimized image */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/lovable-uploads/8f62e7e7-e2ac-4ee6-bfee-3019052700d0.png" 
            alt="Luxury Dubai Skyline" 
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(0.9)',
              transform: `scale(1.01) translateY(${scrollPosition * 0.01}px)`,
              objectPosition: 'center 75%' // Modificato per mostrare più della parte inferiore
            }}
            loading="eager"
            fetchPriority="high" // Priorità alta per caricare subito questa immagine
          />
          <div className="absolute inset-0 bg-gradient-to-r from-easyroi-purple-950/70 via-easyroi-purple-900/60 to-transparent z-10"></div>
        </div>
        
        <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-20">
          <div className="max-w-2xl">
            <AnimatedSection delay={300}>
              <h1 className="minimal-title text-white">
                {t('premiumRealEstate')}
                <span className="block text-easyroi-gold font-normal">{t('exceptionalReturns')}</span>
              </h1>
            </AnimatedSection>
            
            <AnimatedSection delay={600}>
              <p className="minimal-subtitle text-gray-200 mt-6">
                {t('exclusiveAccess')}
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={900} className="mt-12">
              <div className="flex gap-6">
                <Link to="/">
                  <Button className="bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy font-normal px-8 py-6 text-lg rounded-none button-hover-scale">
                    {t('scheduleMeeting')}
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <span className="text-sm text-easyroi-gold/80 mb-2 tracking-widest">{t('scroll')}</span>
          <div className="scroll-indicator-line"></div>
        </div>
      </section>
      
      {/* Minimalist Features Section with Luxury Image */}
      <section className="minimal-section bg-white">
        <div className="minimal-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <AnimatedSection>
              <h2 className="minimal-title text-easyroi-purple-900">{t('curated')}</h2>
              <p className="minimal-subtitle">
                {t('curatedDesc')}
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
              <h3 className="minimal-card-title">{t('premiumProperties')}</h3>
              <p className="minimal-card-text">{t('premiumPropertiesDesc')}</p>
            </AnimatedSection>
            
            <AnimatedSection delay={200} className="minimal-card">
              <BarChart3 className="h-6 w-6 text-easyroi-gold mb-4" />
              <h3 className="minimal-card-title">{t('portfolioAnalytics')}</h3>
              <p className="minimal-card-text">{t('portfolioAnalyticsDesc')}</p>
            </AnimatedSection>
            
            <AnimatedSection delay={300} className="minimal-card">
              <Shield className="h-6 w-6 text-easyroi-gold mb-4" />
              <h3 className="minimal-card-title">{t('securePlatform')}</h3>
              <p className="minimal-card-text">{t('securePlatformDesc')}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      {/* Locations Section - Minimal with Luxury Images */}
      <section className="minimal-section bg-white">
        <div className="minimal-container">
          <AnimatedSection>
            <h2 className="minimal-title text-easyroi-purple-900 mb-24">{t('featuredLocations')}</h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              { 
                name: 'Milan, Italy', 
                img: 'https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?q=80&w=1000&auto=format&fit=crop'
              },
              { 
                name: 'Rome, Italy', 
                img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000&auto=format&fit=crop' 
              },
              { 
                name: 'Dubai, UAE', 
                img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop'
              }
            ].map((location, index) => (
              <AnimatedSection key={location.name} delay={index * 100} className="relative h-96 group overflow-hidden">
                <img 
                  src={location.img}
                  alt={location.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 flex flex-col justify-end p-8">
                  <div className="flex items-center text-white mb-4">
                    <MapPin className="h-4 w-4 mr-2 text-easyroi-gold" />
                    <span className="text-sm tracking-wide">{location.name}</span>
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
              <h2 className="minimal-title text-easyroi-purple-900 max-w-xl">{t('readyToMaximize')}</h2>
              
              <div className="mt-8 md:mt-0">
                <Link to="/register">
                  <Button className="bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy font-normal px-8 py-6 text-lg rounded-none button-hover-scale">
                    {t('scheduleMeeting')}
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
