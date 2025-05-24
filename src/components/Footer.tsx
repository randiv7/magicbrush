
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Heart, Coffee } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-50 to-purple-50 border-t border-gray-200 mt-16">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  MagicBrush
                </h3>
                <p className="text-xs text-gray-500">AI Photo Editor</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Professional background removal and replacement powered by AI technology.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#features" className="hover:text-purple-600 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-purple-600 transition-colors">Pricing</a></li>
              <li><a href="#api" className="hover:text-purple-600 transition-colors">API</a></li>
              <li><a href="#updates" className="hover:text-purple-600 transition-colors">Updates</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#help" className="hover:text-purple-600 transition-colors">Help Center</a></li>
              <li><a href="#tutorials" className="hover:text-purple-600 transition-colors">Tutorials</a></li>
              <li><a href="#contact" className="hover:text-purple-600 transition-colors">Contact Us</a></li>
              <li><a href="#feedback" className="hover:text-purple-600 transition-colors">Feedback</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#privacy" className="hover:text-purple-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-purple-600 transition-colors">Terms of Service</a></li>
              <li><a href="#cookies" className="hover:text-purple-600 transition-colors">Cookie Policy</a></li>
              <li><a href="#gdpr" className="hover:text-purple-600 transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>© 2024 MagicBrush. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>and</span>
              <Coffee className="w-4 h-4 text-amber-600" />
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Powered by AI</span>
              <span>•</span>
              <span>Privacy First</span>
              <span>•</span>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Banner */}
      <div className="bg-white border-t border-gray-200">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
            Footer Advertisement Space (728x90)
          </div>
        </div>
      </div>
    </footer>
  );
};
