'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

type NotificationType = 'contact' | 'photo' | 'liked';

const DASHBOARD_LINKS = [
  { id: 'matches' as const, href: '/dashboard/matches', label: 'Matches', icon: '💞' },
  { id: 'search' as const, href: '/dashboard/search', label: 'Search', icon: '🔍' },
  { id: 'notifications' as const, href: '/dashboard/notifications', label: 'Notifications', icon: '🔔', badge: 3 },
];

const NOTIFICATION_TABS: Array<{ id: NotificationType; label: string; icon: string; badge?: number }> = [
  { id: 'contact', label: 'Contact Requests', icon: '📥', badge: 1 },
  { id: 'photo', label: 'Photo Unlocks', icon: '📸', badge: 2 },
  { id: 'liked', label: 'Favorited You', icon: '💖' },
];

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
                  <Link href={`/dashboard/profile/${notification.id}`} className="text-[#c6c2ff] text-sm hover:text-[#f7a8d9] transition-colors">view</Link>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="space-y-2 text-white">
                  {activeTab === 'contact' && 'religion' in notification && (
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
                        <div className="text-[#f7a8d9] font-semibold">
                          Mobile Number sent!
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'photo' && 'religion' in notification && (
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
                      <button type="button" className="mt-4 nav-chip nav-chip-active justify-center w-full sm:w-auto">
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
              <div className="text-2xl font-bold brand-gradient-text">
                Vibecode
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-3">
              {DASHBOARD_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`nav-chip ${link.id === 'notifications' ? 'nav-chip-active' : ''}`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                  {link.badge ? <span className="nav-chip-badge">{link.badge}</span> : null}
                </Link>
              ))}
              <div className="nav-chip pointer-events-none">
                <span className="text-lg">👤</span>
                <span className="text-sm font-medium">
                  {user?.displayName || user?.email}
                </span>
              </div>
              <button type="button" onClick={handleLogout} className="nav-chip transition-none">
                <span className="text-sm font-semibold">Logout</span>
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
            <div className="flex items-center gap-3 mb-8">
              <Link href="/dashboard/matches" className="nav-chip">
                <span className="text-sm">← Back</span>
              </Link>
              <h1 className="text-2xl font-bold text-white tracking-wide">Notifications</h1>
            </div>

            <div className="space-y-3">
              {NOTIFICATION_TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-chip w-full justify-between ${activeTab === tab.id ? 'nav-chip-active' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                  {tab.badge ? (
                    <span className="nav-chip-badge">{tab.badge}</span>
                  ) : (
                    <span className="text-white/60 text-xs tracking-widest">→</span>
                  )}
                </button>
              ))}
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
