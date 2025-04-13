
import React from 'react';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLanguage } from '@/contexts/LanguageContext';

const CookiePolicy = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-20 mb-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-easyroi-purple-900 mb-6">
              {t('cookiePolicy')}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">1. {t('cookieIntroduction')}</h2>
                <p className="text-gray-700">
                  {t('cookieIntroductionText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">2. {t('whatAreCookies')}</h2>
                <p className="text-gray-700">
                  {t('whatAreCookiesText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">3. {t('cookieTypes')}</h2>
                <p className="text-gray-700">
                  {t('cookieTypesText')}
                </p>
                <ul className="list-disc pl-6 mt-3 text-gray-700">
                  <li className="mb-2">{t('cookieTypeEssential')}: {t('cookieTypeEssentialDesc')}</li>
                  <li className="mb-2">{t('cookieTypePreference')}: {t('cookieTypePreferenceDesc')}</li>
                  <li className="mb-2">{t('cookieTypeStatistics')}: {t('cookieTypeStatisticsDesc')}</li>
                  <li className="mb-2">{t('cookieTypeMarketing')}: {t('cookieTypeMarketingDesc')}</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">4. {t('cookieControl')}</h2>
                <p className="text-gray-700">
                  {t('cookieControlText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">5. {t('thirdPartyCookies')}</h2>
                <p className="text-gray-700">
                  {t('thirdPartyCookiesText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">6. {t('cookieChanges')}</h2>
                <p className="text-gray-700">
                  {t('cookieChangesText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">7. {t('cookieContact')}</h2>
                <p className="text-gray-700">
                  {t('cookieContactText')}
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

export default CookiePolicy;
