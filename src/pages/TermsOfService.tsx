
import React from 'react';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from '@/contexts/LanguageContext';

const TermsOfService = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-20 mb-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-easyroi-purple-900 mb-6">
              {t('termsOfService')}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">1. {t('termsIntroduction')}</h2>
                <p className="text-gray-700">
                  {t('termsIntroductionText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">2. {t('termsUsage')}</h2>
                <p className="text-gray-700">
                  {t('termsUsageText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">3. {t('termsAccount')}</h2>
                <p className="text-gray-700">
                  {t('termsAccountText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">4. {t('termsIntellectualProperty')}</h2>
                <p className="text-gray-700">
                  {t('termsIntellectualPropertyText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">5. {t('termsLimitations')}</h2>
                <p className="text-gray-700">
                  {t('termsLimitationsText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">6. {t('termsTermination')}</h2>
                <p className="text-gray-700">
                  {t('termsTerminationText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">7. {t('termsGoverning')}</h2>
                <p className="text-gray-700">
                  {t('termsGoverningText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">8. {t('termsChanges')}</h2>
                <p className="text-gray-700">
                  {t('termsChangesText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">9. {t('termsContact')}</h2>
                <p className="text-gray-700">
                  {t('termsContactText')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
