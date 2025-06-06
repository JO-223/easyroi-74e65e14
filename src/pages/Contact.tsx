
import React from 'react';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Clock, Building, FileText } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const Contact = () => {
  const { t } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form handling would go here
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-16 md:mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-easyroi-purple-900 mb-3 md:mb-4">{t('contactUs')}</h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">{t('contactDescription')}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Contact Form */}
            <div className="bg-white p-4 md:p-8 rounded-lg shadow-md order-2 lg:order-1">
              <h2 className="text-xl md:text-2xl font-semibold text-easyroi-purple-900 mb-4 md:mb-6">{t('sendMessage')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('fullName')}
                    </label>
                    <Input id="name" placeholder={t('fullNamePlaceholder')} />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('email')}
                    </label>
                    <Input id="email" type="email" placeholder={t('emailPlaceholder')} />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('subject')}
                  </label>
                  <Input id="subject" placeholder={t('subjectPlaceholder')} />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('message')}
                  </label>
                  <Textarea id="message" placeholder={t('messagePlaceholder')} rows={4} className="resize-none" />
                </div>
                
                <Button type="submit" className="w-full bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy">
                  {t('sendMessage')}
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="bg-gradient-to-br from-easyroi-navy to-easyroi-purple-900 text-white p-4 md:p-8 rounded-lg shadow-md order-1 lg:order-2">
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">{t('contactInfo')}</h2>
              <ul className="space-y-4 md:space-y-6">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 mr-3 md:mr-4 text-easyroi-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-base md:text-lg text-easyroi-gold mb-1">{t('visitUs')}</h3>
                    <p className="text-sm md:text-base">Viale Certosa 218</p>
                    <p className="text-sm md:text-base">20156 Milano (MI), Italia</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <Mail className="h-5 w-5 md:h-6 md:w-6 mr-3 md:mr-4 text-easyroi-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-base md:text-lg text-easyroi-gold mb-1">{t('emailUs')}</h3>
                    <p className="text-sm md:text-base break-all">info@easyroi.com</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <Phone className="h-5 w-5 md:h-6 md:w-6 mr-3 md:mr-4 text-easyroi-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-base md:text-lg text-easyroi-gold mb-1">{t('callUs')}</h3>
                    <p className="text-sm md:text-base">+39 3792381805</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 mr-3 md:mr-4 text-easyroi-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-base md:text-lg text-easyroi-gold mb-1">{t('businessHours')}</h3>
                    <p className="text-sm md:text-base">{t('mondayToFriday')}: 9:00 - 18:00</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
