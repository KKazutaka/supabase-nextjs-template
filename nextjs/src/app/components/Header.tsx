import Link from 'next/link';
import AuthAwareButtons from '@/components/AuthAwareButtons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSPASassClient } from '@/lib/supabase/client';

export default function Header({ productName }: { productName: string }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = await createSPASassClient();
        const { data: { user } } = await supabase.getSupabaseClient().auth.getUser();
        setIsAuthenticated(!!user);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    const supabase = await createSPASassClient();
    await supabase.logout();
    router.push('/');
  };

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
            {!loading && (
              isAuthenticated ? (
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-600 border border-gray-300 px-4 py-2 rounded-lg transition-colors">Sign Out</button>
              ) : (
                <AuthAwareButtons variant="nav" />
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 