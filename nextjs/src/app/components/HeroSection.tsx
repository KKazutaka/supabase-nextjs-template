export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Bootstrap Your SaaS
            <span className="block text-primary-600">In 5 minutes</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Launch your SaaS product in days, not months. Complete with authentication and enterprise-grade security built right in.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            {/* 認証ボタンなど */}
          </div>
        </div>
      </div>
    </section>
  );
} 