
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-easyroi-navy text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="text-easyroi-gold font-bold text-2xl mb-4">Easy<span className="text-white">ROI</span></div>
            <p className="text-gray-300 mb-4">
              {t('footerDescription')}
            </p>
            <div className="flex space-x-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-easyroi-gold">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-easyroi-gold pb-2">{t('quickLinks')}</h2>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-easyroi-gold transition-colors">{t('home')}</Link></li>
              <li><Link to="/contact" className="hover:text-easyroi-gold transition-colors">{t('contact')}</Link></li>
              <li><Link to="/about" className="hover:text-easyroi-gold transition-colors">{t('aboutUs')}</Link></li>
              <li><Link to="/login" className="hover:text-easyroi-gold transition-colors">{t('login')}</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-easyroi-gold pb-2">{t('contactUs')}</h2>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-2 text-easyroi-gold flex-shrink-0" />
                <span>Viale Certosa 218, 20156 Milano (MI)</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-2 text-easyroi-gold flex-shrink-0" />
                <span>+39 3792381805</span>
              </li>
              <li className="flex">
                <CreditCard className="h-5 w-5 mr-2 text-easyroi-gold flex-shrink-0" />
                <span>P. IVA: 13888170969</span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-2 text-easyroi-gold flex-shrink-0" />
                <span>eroi.srl@pec.it</span>
              </li>
               <li className="flex">
                <Mail className="h-5 w-5 mr-2 text-easyroi-gold flex-shrink-0" />
                <span>info@easyroi.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-300">&copy; {new Date().getFullYear()} EasyROI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
