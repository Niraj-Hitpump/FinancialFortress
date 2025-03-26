import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MobileNavProps {
  visible: boolean;
  currentPath: string;
}

export default function MobileNav({ visible, currentPath }: MobileNavProps) {
  if (!visible) return null;
  
  return (
    <div className="md:hidden fade-in">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link 
          href="/" 
          className={`block px-3 py-2 rounded-md text-base font-medium ${
            currentPath === '/' 
              ? 'text-white bg-primary' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Dashboard
        </Link>
        <Link 
          href="/expenses" 
          className={`block px-3 py-2 rounded-md text-base font-medium ${
            currentPath === '/expenses' 
              ? 'text-white bg-primary' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Expenses
        </Link>
        <Link 
          href="/planning" 
          className={`block px-3 py-2 rounded-md text-base font-medium ${
            currentPath === '/planning' 
              ? 'text-white bg-primary' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Planning
        </Link>
        <Link 
          href="/accounts" 
          className={`block px-3 py-2 rounded-md text-base font-medium ${
            currentPath === '/accounts' 
              ? 'text-white bg-primary' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Accounts
        </Link>
      </div>
      <div className="pt-4 pb-3 border-t border-gray-200">
        <div className="flex items-center px-5">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-3">
            <div className="text-base font-medium text-gray-800">John Doe</div>
            <div className="text-sm font-medium text-gray-500">john@example.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
