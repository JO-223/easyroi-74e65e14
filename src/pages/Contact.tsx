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
  const {
    t
  } = useLanguage();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form handling would go here
  };
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-easyroi-purple-900 mb-4">{t('contactUs')}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('contactDescription')}</p>
          </div>
          
          {/* Company Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Italy Office */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Building className="h-6 w-6 text-easyroi-gold mr-3" />
                <h2 className="text-2xl font-semibold text-easyroi-purple-900">EROI S.R.L.</h2>
              </div>
              <Separator className="mb-6" />
              
              <ul className="space-y-4">
                <li className="flex">
                  <FileText className="h-5 w-5 mr-3 text-easyroi-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-easyroi-navy">Codice Fiscale e Partita IVA:</h3>
                    <p className="text-gray-600">13888170969</p>
                  </div>
                </li>
                <li className="flex">
                  <FileText className="h-5 w-5 mr-3 text-easyroi-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-easyroi-navy">SDI:</h3>
                    <p className="text-gray-600">KRRH6B9</p>
                  </div>
                </li>
                <li className="flex">
                  <MapPin className="h-5 w-5 mr-3 text-easyroi-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-easyroi-navy">Sede legale:</h3>
                    <p className="text-gray-600">Viale Certosa 218, 20156 Milano (MI)</p>
                  </div>
                </li>
                <li className="flex">
                  <Mail className="h-5 w-5 mr-3 text-easyroi-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-easyroi-navy">Domicilio digitale (PEC):</h3>
                    <p className="text-gray-600">eroi.srl@pec.it</p>
                  </div>
                </li>
                <li className="flex">
                  <Mail className="h-5 w-5 mr-3 text-easyroi-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-easyroi-navy">Email:</h3>
                    <p className="text-gray-600">info@easyroi.com</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Dubai Office */}
            
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            
            
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-6">{t('sendMessage')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
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
                  <Textarea id="message" placeholder={t('messagePlaceholder')} rows={5} className="resize-none" />
                </div>
                
                <Button type="submit" className="w-full bg-easyroi-gold hover:bg-easyroi-gold/90 text-easyroi-navy">
                  {t('sendMessage')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default Contact;