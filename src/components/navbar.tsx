
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('contact'), href: '/contact' },
    { name: t('aboutUs'), href: '/about' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  useEffect(() => {
    // Get current auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/a00c1972-b881-489c-90f7-bf7f1f6ac87a.png" alt="EasyROI Logo" className="h-12" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-easyroi-purple-800 relative px-3 py-2 text-sm font-medium transition-all duration-300 
                after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 
                after:bottom-0 after:left-0 after:bg-easyroi-gold after:origin-bottom-right after:transition-transform 
                after:duration-300 hover:text-easyroi-gold hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {item.name}
            </Link>
          ))}
          
          <LanguageSwitcher className="ml-2" />
          
          <div className="ml-2">
            {user ? (
              <Button 
                onClick={handleLogout}
                className="bg-easyroi-navy text-white hover:bg-easyroi-navy/90 transform hover:scale-105 transition-all duration-300 shadow-sm"
              >
                {t('logout')}
              </Button>
            ) : (
              <Link to="/login">
                <Button className="bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90 transform hover:scale-105 transition-all duration-300 shadow-sm">
                  {t('login')}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <LanguageSwitcher variant="minimal" />
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-easyroi-purple-800 hover:bg-easyroi-purple-50/30">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 backdrop-blur-xl border-none shadow-xl p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                    <img src="/lovable-uploads/a00c1972-b881-489c-90f7-bf7f1f6ac87a.png" alt="EasyROI Logo" className="h-10" />
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-easyroi-purple-800 hover:text-easyroi-gold hover:bg-easyroi-purple-50/20">
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex flex-col justify-between h-full">
                  <div className="p-6 space-y-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block text-easyroi-purple-800 text-lg font-light relative overflow-hidden
                          after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px 
                          after:bottom-0 after:left-0 after:bg-easyroi-gold after:origin-bottom-right 
                          after:transition-transform after:duration-300 hover:text-easyroi-gold 
                          hover:after:scale-x-100 hover:after:origin-bottom-left"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="p-6 border-t border-gray-100">
                    {user ? (
                      <Button 
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="w-full bg-easyroi-navy text-white hover:bg-easyroi-navy/90 shadow-sm"
                      >
                        {t('logout')}
                      </Button>
                    ) : (
                      <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full">
                        <Button className="w-full bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90 shadow-sm">
                          {t('login')}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
