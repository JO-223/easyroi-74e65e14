
import React from 'react';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useLegalTranslation } from '@/hooks/useLegalTranslation';

const TermsOfService = () => {
  const tLegal = useLegalTranslation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow mt-20 mb-16">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-easyroi-purple-900 mb-6">
              {tLegal('termsOfService')}
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">1. {tLegal('termsIntroduction')}</h2>
                <p className="text-gray-700">
                  {tLegal('termsIntroductionText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">2. {tLegal('termsUsage')}</h2>
                <p className="text-gray-700">
                  {tLegal('termsUsageText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">3. {tLegal('termsAccount')}</h2>
                <p className="text-gray-700">
                  {tLegal('termsAccountText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">4. {tLegal('termsIntellectualProperty')}</h2>
                <p className="text-gray-700">
                  {tLegal('termsIntellectualPropertyText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">5. {tLegal('termsLimitations')}</h2>
                <p className="text-gray-700">
                  {tLegal('termsLimitationsText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">6. {tLegal('termsTermination')}</h2>
                <p className="text-gray-700">
                  {tLegal('termsTerminationText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">7. {tLegal('termsGoverning')}</h2>
                <p className="text-gray-700">
                  {tLegal('termsGoverningText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">8. {tLegal('termsChanges')}</h2>
                <p className="text-gray-700">
                  {tLegal('termsChangesText')}
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-easyroi-purple-900 mb-4">9. {tLegal('termsContact')}</h2>
                <p className="text-gray-700">
                  {tLegal('termsContactText')}
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
