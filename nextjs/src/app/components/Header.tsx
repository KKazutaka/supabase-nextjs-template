import Link from 'next/link';
import AuthAwareButtons from '@/components/AuthAwareButtons';

export default function Header({ productName }: { productName: string }) {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              {productName}
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/app" className="text-gray-600 hover:text-gray-900">
              GoTo Dashboard
            </Link>
            <Link href="/app/stable-diffusion" className="text-gray-600 hover:text-gray-900">
              Use StableDiffusion
            </Link>
            <AuthAwareButtons variant="nav" />
          </div>
        </div>
      </div>
    </nav>
  );
} 