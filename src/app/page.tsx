import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="glass-card p-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 floating-element">
            Welcome to Global Nadars Matrimony
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Find your perfect life partner within the Global Nadars community.
            Join thousands of members who have found their match through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="enhanced-button px-8 py-4 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full text-lg font-semibold hover:opacity-90 transition-all"
            >
              Register Now
            </Link>
            <Link
              href="/login"
              className="enhanced-button px-8 py-4 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full text-lg font-semibold hover:opacity-90 transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white text-center mb-4">
              Verified Profiles
            </h3>
            <p className="text-gray-300 text-center">
              All profiles are thoroughly verified to ensure authenticity and security for our members.
            </p>
          </div>

          <div className="glass-card p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white text-center mb-4">
              Advanced Search
            </h3>
            <p className="text-gray-300 text-center">
              Find matches based on specific criteria including education, profession, location, and more.
            </p>
          </div>

          <div className="glass-card p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white text-center mb-4">
              Privacy & Security
            </h3>
            <p className="text-gray-300 text-center">
              Your personal information is protected with advanced security measures and complete privacy control.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mb-16">
        <div className="glass-card p-12">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Our Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">#</div>
              <div className="text-gray-300">Registered Members</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">#</div>
              <div className="text-gray-300">Success Stories</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">#</div>
              <div className="text-gray-300">Weddings This Year</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">#</div>
              <div className="text-gray-300">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="glass-card p-12 text-center gradient-bg-purple">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community today and start your journey towards a happy married life.
          </p>
          <Link
            href="/register"
            className="enhanced-button inline-block px-10 py-5 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full text-lg font-bold hover:opacity-90 transition-all"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
