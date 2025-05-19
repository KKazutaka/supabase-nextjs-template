import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaSection({ productName }: { productName: string }) {
  return (
    <section className="py-24 bg-primary-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white">
          Ready to Transform Your Idea into Reality?
        </h2>
        <p className="mt-4 text-xl text-primary-100">
          Join thousands of developers building their SaaS with {productName}
        </p>
        <Link
          href="/auth/register"
          className="mt-8 inline-flex items-center px-6 py-3 rounded-lg bg-white text-primary-600 font-medium hover:bg-primary-50 transition-colors"
        >
          Get Started Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
} 