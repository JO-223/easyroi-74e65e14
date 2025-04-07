
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
    <header className="bg-easyroi-navy text-white sticky top-0 z-50">
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
              className="text-white hover:text-easyroi-gold px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <div className="ml-4 flex items-center">
            <Link to="/login">
              <Button variant="outline" className="mr-2 border-easyroi-gold text-easyroi-gold hover:bg-easyroi-gold hover:text-easyroi-navy">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90">
                Register
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-easyroi-navy/50">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-easyroi-navy text-white">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                  <span className="text-easyroi-gold font-bold text-xl">Easy<span className="text-white">ROI</span></span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-white hover:text-easyroi-gold px-3 py-2 text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 flex flex-col space-y-2">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-easyroi-gold text-easyroi-gold hover:bg-easyroi-gold hover:text-easyroi-navy">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-easyroi-gold text-easyroi-navy hover:bg-easyroi-gold/90">
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
