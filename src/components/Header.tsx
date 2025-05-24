
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, User, Menu, X } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usageCount] = useState(3); // Placeholder for usage tracking

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      {/* Ad Banner - Desktop */}
      <div className="hidden md:block bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        <div className="container mx-auto max-w-6xl px-4 py-2">
          <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
            Advertisement Space (728x90)
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MagicBrush
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">AI Photo Editor</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">Pricing</a>
            <a href="#help" className="text-gray-600 hover:text-purple-600 transition-colors">Help</a>
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {/* Usage Counter */}
            {!isLoggedIn && (
              <Badge variant="secondary" className="hidden sm:flex bg-purple-50 text-purple-700 border-purple-200">
                {5 - usageCount} free uses left
              </Badge>
            )}

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="hidden sm:flex">
                  {20 - usageCount}/20 today
                </Badge>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:block">Profile</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(true)}>
                  Login
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">Pricing</a>
              <a href="#help" className="text-gray-600 hover:text-purple-600 transition-colors">Help</a>
              {!isLoggedIn && (
                <Badge variant="secondary" className="w-fit bg-purple-50 text-purple-700 border-purple-200">
                  {5 - usageCount} free uses left today
                </Badge>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Mobile Ad Banner */}
      <div className="md:hidden bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-100">
        <div className="container mx-auto px-4 py-2">
          <div className="w-full h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-xs">
            Advertisement (320x50)
          </div>
        </div>
      </div>
    </header>
  );
};
