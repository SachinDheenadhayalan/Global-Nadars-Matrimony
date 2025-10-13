'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

type NotificationType = 'contact' | 'photo' | 'liked';

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<NotificationType>('contact');

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const mockNotifications = {
    contact: [
      {
        id: '1',
        name: 'BGTESTING',
        profileId: 'GNM84746',
        age: 26,
        height: '5.2 feet/62.4 inches/158.496 cm',
        religion: 'Hindu',
        education: 'Not Mentioned',
        occupation: 'Private',
        aboutMe: 'BG Testing',
        mobileNumberSent: true
      }
    ],
    photo: [
      {
        id: '2',
        name: 'PIRAIMATHI',
        profileId: 'Profile ID not available',
        age: 0,
        height: '4.2 feet/50.4 inches/128.016 cm',
        religion: 'Hindu',
        education: 'Not Mentioned',
        occupation: 'Private',
        aboutMe: 'Piraimathi Testing'
      }
    ],
    liked: [
      {
        id: '3',
        name: 'PIRAIMATHI',
        profileId: 'Profile ID not available',
        age: 0,
        height: '4.2 feet/50.4 inches/128.016 cm',
        location: 'Chellasamy Complex, 1st Floor East Wing, Sivagurunathapuram, Surandai, Tamil Nadu 627859',
        profession: 'Private',
        company: 'Brokenglass Designs'
      }
    ]
  };

  const renderNotifications = () => {
    const notifications = mockNotifications[activeTab];

    if (notifications.length === 0) {
      return (
        <div className="text-center text-gray-400 py-12">
          No notifications yet
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {notifications.map((notification) => (
          <div key={notification.id} className="glass-card p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="text-6xl">👤</div>
                </div>
                <div className="text-center mt-2">
                  <div className="text-white font-bold text-lg">{notification.name}</div>
                  <Link href={`/dashboard/profile/${notification.id}`} className="text-green-400 text-sm">view</Link>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="space-y-2 text-white">
                  {activeTab === 'contact' && (
                    <>
                      <div>
                        <span className="text-gray-400">Age & Height:</span>
                        <span className="ml-2">{notification.age} & {notification.height}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Religion:</span>
                        <span className="ml-2">{notification.religion}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Education:</span>
                        <span className="ml-2">{notification.education}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Occupation:</span>
                        <span className="ml-2">{notification.occupation}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">About me:</span>
                        <span className="ml-2">{notification.aboutMe}</span>
                      </div>
                      {'mobileNumberSent' in notification && notification.mobileNumberSent && (
                        <div className="text-green-400 font-semibold">
                          Mobile Number sent!
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'photo' && (
                    <>
                      <div>
                        <span className="text-gray-400">Age & Height:</span>
                        <span className="ml-2">{notification.age} & {notification.height}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Religion:</span>
                        <span className="ml-2">{notification.religion}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Education:</span>
                        <span className="ml-2">{notification.education}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Occupation:</span>
                        <span className="ml-2">{notification.occupation}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">About me:</span>
                        <span className="ml-2">{notification.aboutMe}</span>
                      </div>
                      <button className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all">
                        Accept
                      </button>
                    </>
                  )}

                  {activeTab === 'liked' && 'location' in notification && (
                    <>
                      <div>
                        <span className="text-gray-400">Age:</span>
                        <span className="ml-2">{notification.age}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Height:</span>
                        <span className="ml-2">{notification.height}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Location:</span>
                        <span className="ml-2">{notification.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Profession:</span>
                        <span className="ml-2">{notification.profession}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Company:</span>
                        <span className="ml-2">{notification.company}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
              <Link href="/dashboard/matches" className="text-gray-300 hover:text-white transition-colors">
                Matches
              </Link>
              <Link href="/dashboard/search" className="text-gray-300 hover:text-white transition-colors">
                Search
              </Link>
              <Link href="/dashboard/notifications" className="relative text-white font-semibold border-b-2 border-pink-500 pb-1">
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
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="flex items-center mb-8">
              <Link href="/dashboard/matches" className="text-white mr-4">
                ←
              </Link>
              <h1 className="text-2xl font-bold text-white">NOTIFICATION</h1>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setActiveTab('contact')}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'contact'
                    ? 'bg-pink-900 text-white'
                    : 'bg-red-900 text-white hover:bg-red-800'
                }`}
              >
                Contact Request
              </button>
              <button
                onClick={() => setActiveTab('photo')}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'photo'
                    ? 'bg-pink-900 text-white'
                    : 'bg-red-900 text-white hover:bg-red-800'
                }`}
              >
                Photo Request
              </button>
              <button
                onClick={() => setActiveTab('liked')}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === 'liked'
                    ? 'bg-pink-900 text-white'
                    : 'bg-red-900 text-white hover:bg-red-800'
                }`}
              >
                Liked Profile
              </button>
            </div>
          </div>

          {/* Notifications Content */}
          <div className="flex-1">
            <div className="glass-card p-6 mb-6">
              <h2 className="text-xl font-bold text-white">
                {activeTab === 'contact' && 'Request for My Contact'}
                {activeTab === 'photo' && 'Request for Photo View'}
                {activeTab === 'liked' && 'Favorited My Profile'}
              </h2>
            </div>

            {renderNotifications()}
          </div>
        </div>
      </div>
    </div>
  );
}
