
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-transparent backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-easyroi-gold font-bold text-xl">Easy<span className="text-white">ROI</span></span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-white relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 
                after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 
                after:left-0 after:bg-easyroi-gold after:origin-bottom-right after:transition-transform 
                after:duration-300 hover:text-easyroi-gold hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {item.name}
            </Link>
          ))}
          <div className="ml-4 flex items-center">
            <Link to="/login">
              <Button variant="outline" className="mr-2 border-easyroi-gold text-easyroi-gold hover:bg-easyroi-gold/20 transition-all duration-300">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90 transform hover:scale-105 transition-all duration-300">
                Register
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-easyroi-navy/95 backdrop-blur-md text-white border-easyroi-navy">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                  <span className="text-easyroi-gold font-bold text-xl">Easy<span className="text-white">ROI</span></span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:text-easyroi-gold">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-white relative overflow-hidden px-3 py-2 text-base font-medium
                      after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 
                      after:bottom-0 after:left-0 after:bg-easyroi-gold after:origin-bottom-right 
                      after:transition-transform after:duration-300 hover:text-easyroi-gold 
                      hover:after:scale-x-100 hover:after:origin-bottom-left"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 flex flex-col space-y-2">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-easyroi-gold text-easyroi-gold hover:bg-easyroi-gold/20">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90 transform hover:scale-105 transition-all duration-300">
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
