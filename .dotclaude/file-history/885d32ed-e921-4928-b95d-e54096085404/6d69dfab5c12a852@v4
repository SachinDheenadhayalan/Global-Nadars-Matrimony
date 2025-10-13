'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Dummy profile data
const DUMMY_PROFILES = [
  {
    id: 'dummy1',
    fullName: 'Priya Sharma',
    age: 28,
    height: 165,
    city: 'Chennai',
    state: 'Tamil Nadu',
    occupation: 'Software Engineer',
    occupationDetails: 'TCS',
    photoURL: null
  },
  {
    id: 'dummy2',
    fullName: 'Rajesh Kumar',
    age: 30,
    height: 175,
    city: 'Bangalore',
    state: 'Karnataka',
    occupation: 'Doctor',
    occupationDetails: 'Apollo Hospitals',
    photoURL: null
  },
  {
    id: 'dummy3',
    fullName: 'Anjali Patel',
    age: 26,
    height: 160,
    city: 'Mumbai',
    state: 'Maharashtra',
    occupation: 'Teacher',
    occupationDetails: 'St. Mary School',
    photoURL: null
  },
  {
    id: 'dummy4',
    fullName: 'Vikram Reddy',
    age: 32,
    height: 180,
    city: 'Hyderabad',
    state: 'Telangana',
    occupation: 'Business Owner',
    occupationDetails: 'Reddy Enterprises',
    photoURL: null
  },
  {
    id: 'dummy5',
    fullName: 'Deepika Nair',
    age: 27,
    height: 162,
    city: 'Kochi',
    state: 'Kerala',
    occupation: 'Architect',
    occupationDetails: 'Design Studios',
    photoURL: null
  },
];

export default function MatchesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [matches] = useState(DUMMY_PROFILES);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
              <div className="text-2xl font-bold bg-gradient-to-br from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Vibecode
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard/matches" className="text-white font-semibold border-b-2 border-pink-500 pb-1">
                Matches
              </Link>
              <Link href="/dashboard/search" className="text-gray-300 hover:text-white transition-colors">
                Search
              </Link>
              <Link href="/dashboard/notifications" className="relative text-gray-300 hover:text-white transition-colors">
                <span className="flex items-center">
                  🔔
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
                </span>
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">👤</span>
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
        <div className="flex items-center mb-8">
          <Link href="/dashboard" className="text-white mr-4">
            ←
          </Link>
          <h1 className="text-3xl font-bold text-white">MATCHES</h1>
        </div>

        {/* Perfect Matches Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            ━━━ Perfect Matches ❤️ ━━━
          </h2>

          <div className="space-y-6">
            {matches.map((profile) => (
              <div key={profile.id} className="glass-card p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                      {profile.photoURL ? (
                        <img src={profile.photoURL} alt={profile.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-6xl">👤</div>
                      )}
                    </div>
                    <div className="text-center mt-2">
                      <div className="text-white font-bold text-lg">{profile.fullName || 'No Name'}</div>
                      <Link href={`/dashboard/profile/${profile.id}`} className="text-green-400 text-sm">view</Link>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                      <div>
                        <span className="text-gray-400">Age & Height:</span>
                        <span className="ml-2">{profile.age || 'N/A'} & {profile.height} cm</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Location:</span>
                        <span className="ml-2">{profile.city}, {profile.state}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Profession:</span>
                        <span className="ml-2">{profile.occupation || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Company:</span>
                        <span className="ml-2">{profile.occupationDetails || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Interest Buttons */}
                    <div className="mt-6 flex items-center gap-4">
                      <span className="text-white font-semibold">Interest</span>
                      <button className="px-8 py-2 bg-gradient-to-br from-blue-400 to-purple-500 hover:opacity-90 text-white rounded-lg font-semibold transition-all">
                        Yes
                      </button>
                      <button className="px-8 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all">
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button className="px-3 py-1 text-white">←</button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <button
                key={num}
                className={`px-3 py-1 rounded ${num === 1 ? 'bg-pink-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {num}
              </button>
            ))}
            <button className="px-3 py-1 text-white">→</button>
          </div>
        </div>

        {/* Featured Profiles Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            ━━━ Featured Profiles ❤️ ━━━
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {matches.slice(0, 4).map((profile) => (
              <div key={profile.id} className="glass-card p-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-white/10 flex items-center justify-center overflow-hidden mb-4">
                  {profile.photoURL ? (
                    <img src={profile.photoURL} alt={profile.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl">👤</div>
                  )}
                </div>
                <Link href={`/dashboard/profile/${profile.id}`} className="text-green-400 text-sm">view</Link>
                <div className="text-white font-bold text-lg mt-2">{profile.fullName || 'No Name'}</div>
                <div className="text-gray-300">{profile.age || 'N/A'}</div>
                <div className="text-gray-400 text-sm">{profile.city || 'N/A'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
