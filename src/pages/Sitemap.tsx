
import React from 'react';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Sitemap = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-20 mb-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-easyroi-purple-900 mb-8">
              {t('sitemap')}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Main Pages */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-easyroi-purple-900 mb-4 border-b border-easyroi-gold pb-2">
                  {t('mainPages')}
                </h2>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('home')}</Link></li>
                  <li><Link to="/about" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('aboutUs')}</Link></li>
                  <li><Link to="/contact" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('contact')}</Link></li>
                  <li><Link to="/login" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('login')}</Link></li>
                </ul>
              </div>
              
              {/* Dashboard Pages */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-easyroi-purple-900 mb-4 border-b border-easyroi-gold pb-2">
                  {t('dashboard')}
                </h2>
                <ul className="space-y-2">
                  <li><Link to="/dashboard" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('dashboard')}</Link></li>
                  <li><Link to="/dashboard/properties" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('properties')}</Link></li>
                  <li><Link to="/dashboard/development" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('development')}</Link></li>
                  <li><Link to="/dashboard/analytics" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('analytics')}</Link></li>
                  <li><Link to="/dashboard/events" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('events')}</Link></li>
                  <li><Link to="/dashboard/network" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('network')}</Link></li>
                  <li><Link to="/dashboard/profile" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('profile')}</Link></li>
                  <li><Link to="/dashboard/settings" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('settings')}</Link></li>
                </ul>
              </div>
              
              {/* Legal Pages */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-easyroi-purple-900 mb-4 border-b border-easyroi-gold pb-2">
                  {t('legalPages')}
                </h2>
                <ul className="space-y-2">
                  <li><Link to="/terms-of-service" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('termsOfService')}</Link></li>
                  <li><Link to="/privacy-policy" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('privacyPolicy')}</Link></li>
                  <li><Link to="/cookie-policy" className="text-easyroi-navy hover:text-easyroi-gold transition-colors">{t('cookiePolicy')}</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sitemap;
