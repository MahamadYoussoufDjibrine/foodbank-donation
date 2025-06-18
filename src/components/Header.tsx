import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Settings, Truck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FoodBank</span>
            <div className="flex items-center space-x-2 ml-4">
              <span className="text-gray-400">×</span>
              <img 
                src="/logo.png" 
                alt="Powered by Bolt" 
                className="h-8 w-8 rounded-full border border-gray-200"
              />
              <span className="text-sm text-gray-600 font-medium">Powered by Bolt</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
            <a href="#impact" className="text-gray-600 hover:text-gray-900 transition-colors">Impact</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <Link 
              to="/volunteer"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Truck className="h-4 w-4" />
              <span>Volunteer Portal</span>
            </Link>
            <Link 
              to="/admin"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;