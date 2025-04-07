
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { BadgeLevel } from '@/components/ui/badge-level';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, BarChart3, Calendar, MapPin, TrendingUp, Lock, Users } from 'lucide-react';

const Index = () => {
  const features = [
    {
      name: 'Real-time Analytics',
      description: 'Track your investment performance with comprehensive analytics and real-time data.',
      icon: BarChart3,
    },
    {
      name: 'Global Properties',
      description: 'Access exclusive real estate opportunities in Italy, Dubai, and other premium markets.',
      icon: Building2,
    },
    {
      name: 'Exclusive Events',
      description: 'Get invited to high-end networking events and investment opportunities.',
      icon: Calendar,
    },
    {
      name: 'Secure Platform',
      description: 'Your investments and personal data are protected with enterprise-grade security.',
      icon: Lock,
    },
  ];
  
  const locations = [
    { name: 'Milan, Italy', image: '/placeholder.svg' },
    { name: 'Rome, Italy', image: '/placeholder.svg' },
    { name: 'Dubai, UAE', image: '/placeholder.svg' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-easyroi-navy text-white">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-easyroi-navy to-black opacity-90"></div>
        <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Premium Real Estate Investments with <span className="text-easyroi-gold">Exceptional Returns</span>
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              EasyROI provides exclusive access to high-yield international real estate investments and a powerful platform to track your portfolio performance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button className="bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy font-semibold px-8 py-6 text-lg">
                  Start Investing
                </Button>
              </Link>
              <Link to="/properties">
                <Button variant="outline" className="border-easyroi-gold text-easyroi-gold hover:bg-easyroi-gold/10 px-8 py-6 text-lg">
                  View Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-easyroi-navy">Why Choose EasyROI</h2>
            <p className="text-gray-600 text-lg">Our platform offers unparalleled access to premium real estate investments and comprehensive portfolio management.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.name} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="mb-4 w-12 h-12 rounded-full bg-easyroi-navy/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-easyroi-navy" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-easyroi-navy">{feature.name}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Locations Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-easyroi-navy">Featured Locations</h2>
            <p className="text-gray-600 text-lg">Explore our premium real estate opportunities in these exclusive markets.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {locations.map((location) => (
              <div key={location.name} className="relative rounded-lg overflow-hidden h-80 group">
                <img 
                  src={location.image} 
                  alt={location.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center text-white mb-1">
                    <MapPin className="h-5 w-5 mr-2 text-easyroi-gold" />
                    <span className="font-medium">{location.name}</span>
                  </div>
                  <Link to="/properties">
                    <Button variant="link" className="text-easyroi-gold p-0 hover:text-white">
                      View Properties →
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Investor Levels Section */}
      <section className="py-16 md:py-24 bg-easyroi-navy text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Investor Levels</h2>
            <p className="text-gray-300 text-lg">
              Unlock exclusive benefits and opportunities as you progress through our investor tiers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {['bronze', 'silver', 'gold', 'platinum', 'diamond'].map((level) => (
              <Card key={level} className={`border-none bg-gradient-to-br shadow-lg ${
                level === 'bronze' ? 'from-easyroi-bronze/80 to-easyroi-bronze' :
                level === 'silver' ? 'from-easyroi-silver/80 to-easyroi-silver' :
                level === 'gold' ? 'from-easyroi-gold/80 to-easyroi-gold' :
                level === 'platinum' ? 'from-easyroi-platinum/80 to-easyroi-platinum' :
                'from-easyroi-diamond/80 to-easyroi-diamond'
              }`}>
                <CardContent className="pt-6 text-center">
                  <BadgeLevel level={level as 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'} className="mb-2" />
                  <h3 className={`text-xl font-bold mb-2 ${
                    level === 'bronze' ? 'text-white' : 'text-easyroi-navy'
                  }`}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </h3>
                  <p className={level === 'bronze' ? 'text-gray-200' : 'text-gray-700'}>
                    {level === 'bronze' && 'Entry level benefits'}
                    {level === 'silver' && 'Enhanced access'}
                    {level === 'gold' && 'Premium privileges'}
                    {level === 'platinum' && 'Elite opportunities'}
                    {level === 'diamond' && 'Exclusive concierge'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/register">
              <Button className="bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy font-semibold">
                Join Our Investor Community
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-easyroi-navy to-easyroi-navy/90 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="md:flex items-center justify-between">
              <div className="mb-6 md:mb-0 md:max-w-lg">
                <h2 className="text-3xl font-bold mb-4 text-white">Ready to Maximize Your ROI?</h2>
                <p className="text-gray-300">
                  Join EasyROI today and gain access to exclusive real estate investment opportunities in premium markets.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button className="bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy font-semibold">
                    Create Account
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
