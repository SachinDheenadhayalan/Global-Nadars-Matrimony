'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

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

type TabType = 'matches' | 'search' | 'notifications';
type NotificationTabType = 'contact' | 'photo' | 'liked';

export default function MatchesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('matches');
  const [notificationTab, setNotificationTab] = useState<NotificationTabType>('contact');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [ageFilter, setAgeFilter] = useState({ min: 18, max: 50 });
  const [heightFilter, setHeightFilter] = useState({ min: 150, max: 190 });

  const [matches, setMatches] = useState(DUMMY_PROFILES);

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

  useEffect(() => {
    // Filter profiles based on age and height
    const filtered = DUMMY_PROFILES.filter(profile =>
      profile.age >= ageFilter.min &&
      profile.age <= ageFilter.max &&
      profile.height >= heightFilter.min &&
      profile.height <= heightFilter.max
    );
    setMatches(filtered);
  }, [ageFilter, heightFilter]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filtered = DUMMY_PROFILES.filter(profile =>
        profile.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setMatches(filtered);
    } else {
      setMatches(DUMMY_PROFILES);
    }
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
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'matches'
                ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'notifications'
                ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            🔔
          </button>
        </div>

        {/* Content Area */}
        <div className="flex gap-8">
          {/* Matches Tab */}
          {activeTab === 'matches' && (
            <>
              {/* Left Sidebar - Filters */}
              <div className="w-64 flex-shrink-0">
                <div className="glass-card p-6 sticky top-32">
                  <h3 className="text-xl font-bold text-white mb-6">Filters</h3>

                  {/* Age Filter */}
                  <div className="mb-6">
                    <label className="block text-white mb-2 font-medium">Age Range</label>
                    <div className="space-y-2">
                      <div>
                        <label className="text-gray-400 text-sm">Min: {ageFilter.min}</label>
                        <input
                          type="range"
                          min="18"
                          max="50"
                          value={ageFilter.min}
                          onChange={(e) => setAgeFilter({ ...ageFilter, min: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Max: {ageFilter.max}</label>
                        <input
                          type="range"
                          min="18"
                          max="50"
                          value={ageFilter.max}
                          onChange={(e) => setAgeFilter({ ...ageFilter, max: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Height Filter */}
                  <div className="mb-6">
                    <label className="block text-white mb-2 font-medium">Height Range (cm)</label>
                    <div className="space-y-2">
                      <div>
                        <label className="text-gray-400 text-sm">Min: {heightFilter.min} cm</label>
                        <input
                          type="range"
                          min="150"
                          max="190"
                          value={heightFilter.min}
                          onChange={(e) => setHeightFilter({ ...heightFilter, min: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Max: {heightFilter.max} cm</label>
                        <input
                          type="range"
                          min="150"
                          max="190"
                          value={heightFilter.max}
                          onChange={(e) => setHeightFilter({ ...heightFilter, max: parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAgeFilter({ min: 18, max: 50 });
                      setHeightFilter({ min: 150, max: 190 });
                    }}
                    className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {/* Main Content - Matches */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-center mb-8 text-white">
                  ━━━ Perfect Matches ❤️ ━━━
                </h2>

                <div className="space-y-6">
                  {matches.map((profile) => (
                    <div key={profile.id} className="glass-card p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Profile Image */}
                        <div className="flex-shrink-0">
                          <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center overflow-hidden relative">
                            {profile.photoURL ? (
                              <Image src={profile.photoURL} alt={profile.fullName} fill className="object-cover" />
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

                {matches.length === 0 && (
                  <div className="text-center text-gray-400 py-12">
                    No matches found. Try adjusting your filters.
                  </div>
                )}
              </div>
            </>
          )}

          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-center mb-8 text-white">
                ━━━ Search by Name ━━━
              </h2>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by name..."
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-8 py-3 bg-gradient-to-br from-pink-500 to-pink-600 hover:opacity-90 text-white rounded-lg font-semibold transition-all"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="space-y-6">
                {matches.map((profile) => (
                  <div key={profile.id} className="glass-card p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center overflow-hidden relative">
                          {profile.photoURL ? (
                            <Image src={profile.photoURL} alt={profile.fullName} fill className="object-cover" />
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

              {matches.length === 0 && searchQuery && (
                <div className="text-center text-gray-400 py-12">
                  No profiles found matching &quot;{searchQuery}&quot;.
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <>
              {/* Left Sidebar - Notification Tabs */}
              <div className="w-64 flex-shrink-0">
                <div className="glass-card p-4 sticky top-32">
                  <h3 className="text-xl font-bold text-white mb-4">Notifications</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setNotificationTab('contact')}
                      className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left ${
                        notificationTab === 'contact'
                          ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      Contact Requests
                    </button>
                    <button
                      onClick={() => setNotificationTab('photo')}
                      className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left ${
                        notificationTab === 'photo'
                          ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      Photo Requests
                    </button>
                    <button
                      onClick={() => setNotificationTab('liked')}
                      className={`w-full px-4 py-3 rounded-lg font-semibold transition-all text-left ${
                        notificationTab === 'liked'
                          ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      Liked Profiles
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content - Notifications */}
              <div className="flex-1">
                <div className="text-center text-gray-400 py-12">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {notificationTab === 'contact' && 'Contact Requests'}
                    {notificationTab === 'photo' && 'Photo Requests'}
                    {notificationTab === 'liked' && 'Liked Profiles'}
                  </h3>
                  <p>No notifications yet.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
