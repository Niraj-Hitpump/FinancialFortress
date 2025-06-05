import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link href="#" className="text-gray-500 hover:text-gray-700">
              <span className="sr-only">Privacy Policy</span>
              <span className="text-sm">Privacy Policy</span>
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-700">
              <span className="sr-only">Terms of Service</span>
              <span className="text-sm">Terms of Service</span>
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-700">
              <span className="sr-only">Help Center</span>
              <span className="text-sm">Help Center</span>
            </Link>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} HitpumpTrack. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
