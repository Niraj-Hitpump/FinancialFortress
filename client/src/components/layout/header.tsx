import { useState } from "react";
import { Link, useLocation } from "wouter";
import { HomeIcon, Menu, BellIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MobileNav from "./mobile-nav";

interface HeaderProps {
  userId: number;
}

export default function Header({ userId }: HeaderProps) {
  const [location] = useLocation();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="flex items-center">
              <HomeIcon className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-800">HitpumpTrack</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            <Link 
              href="/" 
              className={`text-base font-medium ${location === '/' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Dashboard
            </Link>
            <Link 
              href="/expenses" 
              className={`text-base font-medium ${location === '/expenses' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Expenses
            </Link>
            <Link 
              href="/planning" 
              className={`text-base font-medium ${location === '/planning' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Planning
            </Link>
            <Link 
              href="/accounts" 
              className={`text-base font-medium ${location === '/accounts' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Accounts
            </Link>
          </nav>
          
          <div className="flex items-center justify-end md:flex-1 lg:w-0">
            <div className="relative mr-4">
              <button 
                type="button" 
                className="bg-gray-100 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">John Doe</span>
            </div>
          </div>
          
          <div className="-mr-2 -my-2 md:hidden">
            <button 
              type="button" 
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileNav visible={mobileMenuVisible} currentPath={location} />
    </header>
  );
}
