'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Extended dummy profiles with full information
const DUMMY_PROFILES_FULL = {
  'dummy1': {
    id: 'dummy1',
    fullName: 'Priya Sharma',
    age: 28,
    gender: 'Female',
    dateOfBirth: '1996-05-15',
    height: 165,
    weight: 55,
    maritalStatus: 'Never Married',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    occupation: 'Software Engineer',
    occupationDetails: 'TCS',
    educationLevel: "Bachelor's Degree",
    educationDetails: 'B.Tech in Computer Science',
    annualIncome: '₹10-20 Lakhs',
    familyType: 'Nuclear Family',
    fatherOccupation: 'Business Owner',
    motherOccupation: 'Homemaker',
    siblings: 1,
    religion: 'Hindu',
    caste: 'Nadar',
    subCaste: 'Nadar',
    motherTongue: 'Tamil',
    dietaryPreference: 'Vegetarian',
    drinking: 'Never',
    smoking: 'Never',
    hobbies: ['Reading', 'Traveling', 'Cooking'],
    aboutMe: 'I am a software engineer passionate about technology and innovation. I enjoy reading, traveling, and cooking in my free time.',
    photoURL: null
  },
  'dummy2': {
    id: 'dummy2',
    fullName: 'Rajesh Kumar',
    age: 30,
    gender: 'Male',
    dateOfBirth: '1994-08-22',
    height: 175,
    weight: 70,
    maritalStatus: 'Never Married',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    occupation: 'Doctor',
    occupationDetails: 'Apollo Hospitals',
    educationLevel: "Master's Degree",
    educationDetails: 'MBBS, MD in General Medicine',
    annualIncome: '₹20-50 Lakhs',
    familyType: 'Joint Family',
    fatherOccupation: 'Doctor',
    motherOccupation: 'Teacher',
    siblings: 2,
    religion: 'Hindu',
    caste: 'Nadar',
    subCaste: 'Shanar',
    motherTongue: 'Kannada',
    dietaryPreference: 'Non-Vegetarian',
    drinking: 'Occasionally',
    smoking: 'Never',
    hobbies: ['Sports', 'Music', 'Fitness'],
    aboutMe: 'A dedicated doctor with a passion for helping people. I believe in maintaining a healthy work-life balance.',
    photoURL: null
  },
  'dummy3': {
    id: 'dummy3',
    fullName: 'Anjali Patel',
    age: 26,
    gender: 'Female',
    dateOfBirth: '1998-12-10',
    height: 160,
    weight: 52,
    maritalStatus: 'Never Married',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    occupation: 'Teacher',
    occupationDetails: 'St. Mary School',
    educationLevel: "Bachelor's Degree",
    educationDetails: 'B.Ed in English',
    annualIncome: '₹5-10 Lakhs',
    familyType: 'Nuclear Family',
    fatherOccupation: 'Engineer',
    motherOccupation: 'Teacher',
    siblings: 0,
    religion: 'Hindu',
    caste: 'Nadar',
    subCaste: 'Nadar',
    motherTongue: 'Gujarati',
    dietaryPreference: 'Vegetarian',
    drinking: 'Never',
    smoking: 'Never',
    hobbies: ['Dancing', 'Painting', 'Writing'],
    aboutMe: 'I am a passionate teacher who loves working with children. I enjoy arts, dancing, and creative writing.',
    photoURL: null
  },
  'dummy4': {
    id: 'dummy4',
    fullName: 'Vikram Reddy',
    age: 32,
    gender: 'Male',
    dateOfBirth: '1992-03-18',
    height: 180,
    weight: 78,
    maritalStatus: 'Divorced',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    occupation: 'Business Owner',
    occupationDetails: 'Reddy Enterprises',
    educationLevel: "Master's Degree",
    educationDetails: 'MBA in Finance',
    annualIncome: 'Above ₹50 Lakhs',
    familyType: 'Joint Family',
    fatherOccupation: 'Business Owner',
    motherOccupation: 'Homemaker',
    siblings: 3,
    religion: 'Hindu',
    caste: 'Nadar',
    subCaste: 'Gramathu Nadar',
    motherTongue: 'Telugu',
    dietaryPreference: 'Non-Vegetarian',
    drinking: 'Occasionally',
    smoking: 'Never',
    hobbies: ['Traveling', 'Photography', 'Golf'],
    aboutMe: 'Entrepreneur with a vision to grow my family business. I love traveling and photography.',
    photoURL: null
  },
  'dummy5': {
    id: 'dummy5',
    fullName: 'Deepika Nair',
    age: 27,
    gender: 'Female',
    dateOfBirth: '1997-07-25',
    height: 162,
    weight: 54,
    maritalStatus: 'Never Married',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    occupation: 'Architect',
    occupationDetails: 'Design Studios',
    educationLevel: "Bachelor's Degree",
    educationDetails: 'B.Arch',
    annualIncome: '₹10-20 Lakhs',
    familyType: 'Nuclear Family',
    fatherOccupation: 'Government Employee',
    motherOccupation: 'Homemaker',
    siblings: 1,
    religion: 'Hindu',
    caste: 'Nadar',
    subCaste: 'Mara Nadar',
    motherTongue: 'Malayalam',
    dietaryPreference: 'Vegetarian',
    drinking: 'Never',
    smoking: 'Never',
    hobbies: ['Gardening', 'Yoga', 'Music'],
    aboutMe: 'Creative architect with an eye for detail. I love gardening and practicing yoga for a peaceful life.',
    photoURL: null
  },
};

export default function ProfileViewPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<typeof DUMMY_PROFILES_FULL[keyof typeof DUMMY_PROFILES_FULL] | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Load profile data
      const profileId = params.id as string;
      const profileData = DUMMY_PROFILES_FULL[profileId as keyof typeof DUMMY_PROFILES_FULL];
      setProfile(profileData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, params.id]);

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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Profile not found</div>
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
        <div className="mb-8">
          <Link href="/dashboard/matches" className="text-[#c6c2ff] hover:text-[#f7a8d9]">
            ← Back to Matches
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="glass-card p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  {profile.photoURL ? (
                    <Image src={profile.photoURL} alt={profile.fullName} width={192} height={192} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-8xl">👤</div>
                  )}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">{profile.fullName}</h1>
                <div className="text-xl text-gray-300 mb-4">
                  {profile.age} years • {profile.gender} • {profile.city}, {profile.state}
                </div>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button className="px-6 py-3 brand-gradient hover:opacity-90 text-white rounded-lg font-semibold transition-all">
                    Express Interest
                  </button>
                  <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="glass-card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/10">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-gray-400 text-sm mb-1">Age</div>
                <div className="text-white text-lg">{profile.age} years</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Date of Birth</div>
                <div className="text-white text-lg">{new Date(profile.dateOfBirth).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Height</div>
                <div className="text-white text-lg">{profile.height} cm ({(profile.height / 30.48).toFixed(2)} feet)</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Weight</div>
                <div className="text-white text-lg">{profile.weight} kg</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Marital Status</div>
                <div className="text-white text-lg">{profile.maritalStatus}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Gender</div>
                <div className="text-white text-lg">{profile.gender}</div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="glass-card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/10">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-gray-400 text-sm mb-1">Occupation</div>
                <div className="text-white text-lg">{profile.occupation}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Company/Organization</div>
                <div className="text-white text-lg">{profile.occupationDetails}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Education Level</div>
                <div className="text-white text-lg">{profile.educationLevel}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Education Details</div>
                <div className="text-white text-lg">{profile.educationDetails}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Annual Income</div>
                <div className="text-white text-lg">{profile.annualIncome}</div>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="glass-card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/10">Family Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-gray-400 text-sm mb-1">Family Type</div>
                <div className="text-white text-lg">{profile.familyType}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Number of Siblings</div>
                <div className="text-white text-lg">{profile.siblings}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Father&apos;s Occupation</div>
                <div className="text-white text-lg">{profile.fatherOccupation}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Mother&apos;s Occupation</div>
                <div className="text-white text-lg">{profile.motherOccupation}</div>
              </div>
            </div>
          </div>

          {/* Cultural Information */}
          <div className="glass-card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/10">Cultural Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-gray-400 text-sm mb-1">Religion</div>
                <div className="text-white text-lg">{profile.religion}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Caste/Community</div>
                <div className="text-white text-lg">{profile.caste}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Sub-Caste</div>
                <div className="text-white text-lg">{profile.subCaste}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Mother Tongue</div>
                <div className="text-white text-lg">{profile.motherTongue}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Dietary Preference</div>
                <div className="text-white text-lg">{profile.dietaryPreference}</div>
              </div>
            </div>
          </div>

          {/* Lifestyle & Interests */}
          <div className="glass-card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/10">Lifestyle & Interests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-gray-400 text-sm mb-1">Drinking</div>
                <div className="text-white text-lg">{profile.drinking}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm mb-1">Smoking</div>
                <div className="text-white text-lg">{profile.smoking}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-gray-400 text-sm mb-2">Hobbies & Interests</div>
                <div className="flex flex-wrap gap-2">
                  {profile.hobbies.map((hobby: string) => (
                    <span key={hobby} className="px-4 py-2 bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-500/30 text-pink-300 rounded-full text-sm">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* About Me */}
          {profile.aboutMe && (
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4 pb-3 border-b border-white/10">About Me</h2>
              <p className="text-white text-lg leading-relaxed">{profile.aboutMe}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
