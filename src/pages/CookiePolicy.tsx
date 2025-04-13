
import React from 'react';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLegalTranslation } from '@/hooks/useLegalTranslation';

const CookiePolicy = () => {
  const tLegal = useLegalTranslation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-20 mb-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-easyroi-purple-900 mb-6">
              {tLegal('cookiePolicy')}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">1. {tLegal('cookieIntroduction')}</h2>
                <p className="text-gray-700">
                  {tLegal('cookieIntroductionText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">2. {tLegal('whatAreCookies')}</h2>
                <p className="text-gray-700">
                  {tLegal('whatAreCookiesText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">3. {tLegal('cookieTypes')}</h2>
                <p className="text-gray-700">
                  {tLegal('cookieTypesText')}
                </p>
                <ul className="list-disc pl-6 mt-3 text-gray-700">
                  <li className="mb-2">{tLegal('cookieTypeEssential')}: {tLegal('cookieTypeEssentialDesc')}</li>
                  <li className="mb-2">{tLegal('cookieTypePreference')}: {tLegal('cookieTypePreferenceDesc')}</li>
                  <li className="mb-2">{tLegal('cookieTypeStatistics')}: {tLegal('cookieTypeStatisticsDesc')}</li>
                  <li className="mb-2">{tLegal('cookieTypeMarketing')}: {tLegal('cookieTypeMarketingDesc')}</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">4. {tLegal('cookieControl')}</h2>
                <p className="text-gray-700">
                  {tLegal('cookieControlText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">5. {tLegal('thirdPartyCookies')}</h2>
                <p className="text-gray-700">
                  {tLegal('thirdPartyCookiesText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">6. {tLegal('cookieChanges')}</h2>
                <p className="text-gray-700">
                  {tLegal('cookieChangesText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">7. {tLegal('cookieContact')}</h2>
                <p className="text-gray-700">
                  {tLegal('cookieContactText')}
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
