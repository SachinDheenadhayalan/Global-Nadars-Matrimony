'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function SearchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'regular' | 'keyword'>('regular');

  const [searchParams, setSearchParams] = useState({
    age: '',
    height: '',
    religion: '',
    motherTongue: '',
    subcaste: '',
    star: '',
    education: '',
    income: '',
    keyword: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const handleSearch = () => {
    console.log('Search params:', searchParams);
    // Implement search logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-2xl border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/dashboard/matches" className="flex items-center space-x-3">
              <div className="text-2xl font-bold brand-gradient-text">
                Vibecode
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard/matches" className="text-gray-300 hover:text-white transition-colors">
                Matches
              </Link>
              <Link href="/dashboard/search" className="text-white font-semibold border-b-2 border-pink-500 pb-1">
                Search
              </Link>
              <Link href="/dashboard/notifications" className="relative text-gray-300 hover:text-white transition-colors">
                <span className="flex items-center">
                  🔔
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
                </span>
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-[#c6c2ff]">👤</span>
                <span className="text-white font-semibold">{user?.displayName || user?.email}</span>
              </div>
              <button onClick={handleLogout} className="text-gray-300 hover:text-white transition-colors">
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">
          ━━━ Search Here ❤️ ━━━
        </h1>

        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex mb-8">
            <button
              onClick={() => setActiveTab('regular')}
              className={`flex-1 py-3 font-semibold transition-all ${
                activeTab === 'regular'
                  ? 'bg-white text-black'
                  : 'bg-red-900 text-white hover:bg-red-800'
              }`}
            >
              Regular Search
            </button>
            <button
              onClick={() => setActiveTab('keyword')}
              className={`flex-1 py-3 font-semibold transition-all ${
                activeTab === 'keyword'
                  ? 'bg-white text-black'
                  : 'bg-red-900 text-white hover:bg-red-800'
              }`}
            >
              Keyword Search
            </button>
          </div>

          {/* Search Form */}
          <div className="glass-card p-8">
            {activeTab === 'regular' ? (
              <div className="space-y-6">
                {/* Age */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-white font-semibold">Age</label>
                  <select
                    value={searchParams.age}
                    onChange={(e) => setSearchParams({...searchParams, age: e.target.value})}
                    className="col-span-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c6c2ff]"
                  >
                    <option value="">Select</option>
                    <option value="18-25">18-25</option>
                    <option value="26-30">26-30</option>
                    <option value="31-35">31-35</option>
                    <option value="36-40">36-40</option>
                    <option value="41+">41+</option>
                  </select>
                </div>

                {/* Height */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-white font-semibold">Height</label>
                  <select
                    value={searchParams.height}
                    onChange={(e) => setSearchParams({...searchParams, height: e.target.value})}
                    className="col-span-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c6c2ff]"
                  >
                    <option value="">Select</option>
                    <option value="150-160">150-160 cm</option>
                    <option value="161-170">161-170 cm</option>
                    <option value="171-180">171-180 cm</option>
                    <option value="181-190">181-190 cm</option>
                    <option value="191+">191+ cm</option>
                  </select>
                </div>

                {/* Religion */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-white font-semibold">Religion</label>
                  <div className="col-span-2 flex gap-4">
                    {['Hindu', 'Christian'].map(religion => (
                      <label key={religion} className="flex items-center text-white">
                        <input
                          type="radio"
                          name="religion"
                          value={religion}
                          checked={searchParams.religion === religion}
                          onChange={(e) => setSearchParams({...searchParams, religion: e.target.value})}
                          className="mr-2"
                        />
                        {religion}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mother Tongue */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-white font-semibold">Mother Tongue</label>
                  <div className="col-span-2 flex gap-4">
                    {['Tamil', 'Malayalam'].map(tongue => (
                      <label key={tongue} className="flex items-center text-white">
                        <input
                          type="radio"
                          name="motherTongue"
                          value={tongue}
                          checked={searchParams.motherTongue === tongue}
                          onChange={(e) => setSearchParams({...searchParams, motherTongue: e.target.value})}
                          className="mr-2"
                        />
                        {tongue}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subcaste */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-white font-semibold">Subcaste</label>
                  <select
                    value={searchParams.subcaste}
                    onChange={(e) => setSearchParams({...searchParams, subcaste: e.target.value})}
                    className="col-span-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c6c2ff]"
                  >
                    <option value="">Select</option>
                    <option value="Nadar">Nadar</option>
                    <option value="Shanar">Shanar</option>
                    <option value="Nelamaikkarars">Nelamaikkarars</option>
                    <option value="Gramathu Nadar">Gramathu Nadar</option>
                    <option value="Mara Nadar">Mara Nadar</option>
                  </select>
                </div>

                {/* Star */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-white font-semibold">Star</label>
                  <select
                    value={searchParams.star}
                    onChange={(e) => setSearchParams({...searchParams, star: e.target.value})}
                    className="col-span-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c6c2ff]"
                  >
                    <option value="">Select Star</option>
                    <option value="Ashwini">Ashwini</option>
                    <option value="Bharani">Bharani</option>
                    <option value="Krittika">Krittika</option>
                  </select>
                </div>

                {/* Educational Qualification */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-white font-semibold">Educational Qualification</label>
                  <select
                    value={searchParams.education}
                    onChange={(e) => setSearchParams({...searchParams, education: e.target.value})}
                    className="col-span-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c6c2ff]"
                  >
                    <option value="">Select Education</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                    <option value="Master's Degree">Master&apos;s Degree</option>
                    <option value="Doctorate/PhD">Doctorate/PhD</option>
                  </select>
                </div>

                {/* Monthly Income */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-white font-semibold">Monthly Income</label>
                  <select
                    value={searchParams.income}
                    onChange={(e) => setSearchParams({...searchParams, income: e.target.value})}
                    className="col-span-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c6c2ff]"
                  >
                    <option value="">Select</option>
                    <option value="Below ₹2 Lakhs">Below ₹2 Lakhs</option>
                    <option value="₹2-5 Lakhs">₹2-5 Lakhs</option>
                    <option value="₹5-10 Lakhs">₹5-10 Lakhs</option>
                    <option value="₹10-20 Lakhs">₹10-20 Lakhs</option>
                    <option value="Above ₹20 Lakhs">Above ₹20 Lakhs</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Age */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-white font-semibold">Age</label>
                  <select
                    value={searchParams.age}
                    onChange={(e) => setSearchParams({...searchParams, age: e.target.value})}
                    className="col-span-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c6c2ff]"
                  >
                    <option value="">Select</option>
                    <option value="18-25">18-25</option>
                    <option value="26-30">26-30</option>
                    <option value="31-35">31-35</option>
                  </select>
                </div>

                {/* Height */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-white font-semibold">Height</label>
                  <select
                    value={searchParams.height}
                    onChange={(e) => setSearchParams({...searchParams, height: e.target.value})}
                    className="col-span-2 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#c6c2ff]"
                  >
                    <option value="">Select</option>
                    <option value="150-160">150-160 cm</option>
                    <option value="161-170">161-170 cm</option>
                    <option value="171-180">171-180 cm</option>
                  </select>
                </div>

                {/* Keyword */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <label className="text-white font-semibold">Keyword</label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={searchParams.keyword}
                      onChange={(e) => setSearchParams({...searchParams, keyword: e.target.value})}
                      placeholder="Eg: TamilNadu, Chennai, Egmore, Sumathi, Developer."
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#c6c2ff]"
                    />
                    <p className="text-gray-400 text-sm mt-2">
                      Eg: TamilNadu, Chennai, Egmore, Sumathi, Developer.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Search Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleSearch}
                className="px-12 py-3 bg-red-900 hover:bg-red-800 text-white rounded-lg font-semibold transition-all"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Featured Profiles Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            ━━━ Featured Profiles ❤️ ━━━
          </h2>
          <div className="flex justify-center">
            <p className="text-gray-400">Search to see profiles...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
