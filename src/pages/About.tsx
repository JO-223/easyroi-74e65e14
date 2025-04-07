
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, TrendingUp, Users } from "lucide-react";

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-20">
        {/* Hero Section */}
        <section className="relative bg-easyroi-navy text-white py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">{t('aboutUsTitle')}</h1>
              <p className="text-xl text-gray-300 mb-8">{t('aboutUsSubtitle')}</p>
              <Link to="/contact">
                <Button className="bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy">
                  {t('contactUs')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-easyroi-purple-900 mb-6">{t('ourStory')}</h2>
              <p className="text-lg text-gray-600">
                {t('ourStoryText1')}
              </p>
              <p className="text-lg text-gray-600 mt-4">
                {t('ourStoryText2')}
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-easyroi-purple-900 mb-6">{t('ourValues')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-easyroi-gold/10 text-easyroi-gold mb-6">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-easyroi-purple-900 mb-3">{t('excellenceValue')}</h3>
                <p className="text-gray-600">{t('excellenceText')}</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-easyroi-gold/10 text-easyroi-gold mb-6">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-easyroi-purple-900 mb-3">{t('integrityValue')}</h3>
                <p className="text-gray-600">{t('integrityText')}</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-easyroi-gold/10 text-easyroi-gold mb-6">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-easyroi-purple-900 mb-3">{t('exclusivityValue')}</h3>
                <p className="text-gray-600">{t('exclusivityText')}</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join Us CTA */}
        <section className="py-16 md:py-24 bg-easyroi-purple-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">{t('joinOurCommunity')}</h2>
              <p className="text-lg text-gray-300 mb-8">{t('joinOurCommunityText')}</p>
              <Link to="/login">
                <Button className="bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy">
                  {t('loginCta')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
