
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLegalTranslation } from '@/hooks/useLegalTranslation';

export function Footer() {
  const { t } = useLanguage();
  const tLegal = useLegalTranslation();
  
  return (
    <footer className="bg-easyroi-navy text-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <div>
            <div className="mb-4 md:mb-6">
              <img src="/lovable-uploads/a00c1972-b881-489c-90f7-bf7f1f6ac87a.png" alt="EasyROI Logo" className="h-10" />
            </div>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              {t('footerDescription')}
            </p>
            <div className="flex space-x-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-easyroi-gold">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 border-b border-easyroi-gold pb-2">{t('quickLinks')}</h2>
            <ul className="space-y-1 md:space-y-2">
              <li><Link to="/" className="hover:text-easyroi-gold transition-colors text-sm md:text-base">{t('home')}</Link></li>
              <li><Link to="/contact" className="hover:text-easyroi-gold transition-colors text-sm md:text-base">{t('contact')}</Link></li>
              <li><Link to="/about" className="hover:text-easyroi-gold transition-colors text-sm md:text-base">{t('aboutUs')}</Link></li>
              <li><Link to="/login" className="hover:text-easyroi-gold transition-colors text-sm md:text-base">{t('login')}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 border-b border-easyroi-gold pb-2">{t('contactUs')}</h2>
            <ul className="space-y-2 md:space-y-4">
              <li className="flex">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 text-easyroi-gold flex-shrink-0" />
                <span className="text-sm md:text-base">Viale Certosa 218, 20156 Milano (MI)</span>
              </li>
              <li className="flex">
                <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2 text-easyroi-gold flex-shrink-0" />
                <span className="text-sm md:text-base">+39 3792381805</span>
              </li>
              <li className="flex">
                <CreditCard className="h-4 w-4 md:h-5 md:w-5 mr-2 text-easyroi-gold flex-shrink-0" />
                <span className="text-sm md:text-base">P. IVA: 13888170969</span>
              </li>
              <li className="flex">
                <Mail className="h-4 w-4 md:h-5 md:w-5 mr-2 text-easyroi-gold flex-shrink-0" />
                <span className="text-sm md:text-base">eroi.srl@pec.it</span>
              </li>
              <li className="flex">
                <Mail className="h-4 w-4 md:h-5 md:w-5 mr-2 text-easyroi-gold flex-shrink-0" />
                <span className="text-sm md:text-base">info@easyroi.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Legal Links Section */}
        <div className="mt-8 md:mt-10 pt-4 md:pt-6 border-t border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-gray-400">
              <Link to="/terms-of-service" className="hover:text-easyroi-gold transition-colors">
                {tLegal('termsOfService')}
              </Link>
              <Link to="/privacy-policy" className="hover:text-easyroi-gold transition-colors">
                {tLegal('privacyPolicy')}
              </Link>
              <Link to="/sitemap" className="hover:text-easyroi-gold transition-colors">
                {tLegal('sitemap')}
              </Link>
              <Link to="/cookie-policy" className="hover:text-easyroi-gold transition-colors">
                {tLegal('cookiePolicy')}
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-300 text-xs md:text-sm">&copy; {new Date().getFullYear()} EasyROI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
