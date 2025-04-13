
import React from 'react';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLegalTranslation } from '@/hooks/useLegalTranslation';

const PrivacyPolicy = () => {
  const tLegal = useLegalTranslation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-20 mb-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-easyroi-purple-900 mb-6">
              {tLegal('privacyPolicy')}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">1. {tLegal('privacyIntroduction')}</h2>
                <p className="text-gray-700">
                  {tLegal('privacyIntroductionText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">2. {tLegal('privacyCollection')}</h2>
                <p className="text-gray-700">
                  {tLegal('privacyCollectionText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">3. {tLegal('privacyUse')}</h2>
                <p className="text-gray-700">
                  {tLegal('privacyUseText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">4. {tLegal('privacyDisclosure')}</h2>
                <p className="text-gray-700">
                  {tLegal('privacyDisclosureText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">5. {tLegal('privacySecurity')}</h2>
                <p className="text-gray-700">
                  {tLegal('privacySecurityText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">6. {tLegal('privacyCookies')}</h2>
                <p className="text-gray-700">
                  {tLegal('privacyCookiesText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">7. {tLegal('privacyRights')}</h2>
                <p className="text-gray-700">
                  {tLegal('privacyRightsText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">8. {tLegal('privacyChanges')}</h2>
                <p className="text-gray-700">
                  {tLegal('privacyChangesText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">9. {tLegal('privacyContact')}</h2>
                <p className="text-gray-700">
                  {tLegal('privacyContactText')}
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

export default PrivacyPolicy;
