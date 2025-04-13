import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
const About = () => {
  const {
    t
  } = useLanguage();
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-20">
        {/* Hero Section con sfondo immagine */}
        <section className="relative bg-easyroi-navy py-24 md:py-32 overflow-hidden">
          {/* Immagine di sfondo con overlay */}
          <div className="absolute inset-0 z-0 opacity-30" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1483058712412-4245e9b90334')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} />
          
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-r from-easyroi-navy/30 via-easyroi-navy/20 to-easyroi-navy/10 z-10"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">{t('aboutUsTitle')}</h1>
              <p className="text-xl text-gray-300 mb-8">{t('aboutUsSubtitle')}</p>
              <Link to="/contact">
                <Button className="bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy">
                  {t('contactUs')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Sezione "La nostra storia" migliorata */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-easyroi-purple-900 mb-4">{t('ourStory')}</h2>
                <div className="w-20 h-1 bg-easyroi-gold mx-auto mb-6"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Card className="overflow-hidden border-0 shadow-lg">
                    <img src="https://images.unsplash.com/photo-1493397212122-2b85dda8106b" alt="Team EasyROI" className="w-full h-auto object-cover aspect-[4/3]" />
                  </Card>
                </div>
                <div>
                  <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    {t('ourStoryText1')}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {t('ourStoryText2')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-easyroi-purple-900 mb-4">{t('ourValues')}</h2>
              <div className="w-20 h-1 bg-easyroi-gold mx-auto mb-6"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-easyroi-gold/10 text-easyroi-gold mb-6">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-easyroi-purple-900 mb-3">{t('excellenceValue')}</h3>
                  <p className="text-gray-600">{t('excellenceText')}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-easyroi-gold/10 text-easyroi-gold mb-6">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-easyroi-purple-900 mb-3">{t('integrityValue')}</h3>
                  <p className="text-gray-600">{t('integrityText')}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-easyroi-gold/10 text-easyroi-gold mb-6">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-easyroi-purple-900 mb-3">{t('exclusivityValue')}</h3>
                  <p className="text-gray-600">{t('exclusivityText')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Join Us CTA */}
        <section className="py-16 md:py-24 bg-easyroi-purple-900 text-white relative overflow-hidden">
          {/* Pattern di sfondo decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-y-0 left-0 w-1/3 bg-easyroi-gold/20 transform -skew-x-12"></div>
            <div className="absolute inset-y-0 right-0 w-1/3 bg-easyroi-gold/20 transform skew-x-12"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">{t('joinOurCommunity')}</h2>
              <p className="text-lg text-gray-300 mb-8">{t('joinOurCommunityText')}</p>
              <Link to="/login">
                <Button className="bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy button-hover-glow">
                  {t('loginCta')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default About;