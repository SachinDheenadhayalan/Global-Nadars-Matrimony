'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';

const STEPS = [
  'Profile Photo',
  'Basic Information',
  'Location',
  'Education & Career',
  'Family Details',
  'Cultural Information',
  'Lifestyle',
  'Partner Preferences'
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Auth
    email: '',
    password: '',
    confirmPassword: '',

    // Step 2: Basic Information
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    height: 165,
    weight: 60,
    maritalStatus: '',

    // Step 3: Location
    country: 'India',
    state: '',
    city: '',
    customCity: '',

    // Step 4: Education & Career
    educationLevel: '',
    educationDetails: '',
    occupation: '',
    occupationDetails: '',
    annualIncome: '',

    // Step 5: Family Details
    familyType: '',
    fatherOccupation: '',
    motherOccupation: '',
    siblings: 0,

    // Step 6: Cultural Information
    religion: '',
    caste: 'Nadar',
    subCaste: '',
    motherTongue: '',
    dietaryPreference: '',

    // Step 7: Lifestyle
    drinking: '',
    smoking: '',
    hobbies: [] as string[],
    aboutMe: '',

    // Step 8: Partner Preferences
    preferredAgeMin: 25,
    preferredAgeMax: 35,
    preferredHeightMin: 150,
    preferredHeightMax: 180,
    preferredMaritalStatus: [] as string[],
    preferredDiet: '',
    preferredSmoking: '',
    preferredDrinking: '',
  });

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (field: string, value: string) => {
    setFormData(prev => {
      const current = prev[field as keyof typeof prev] as string[];
      const newValue = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: newValue };
    });
  };

  const handleNumberChange = (field: string, increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, (prev[field as keyof typeof prev] as number) + (increment ? 1 : -1))
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please provide email and password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userId = userCredential.user.uid;

      // Upload photo if provided
      let photoURL = '';
      if (photoFile) {
        const photoRef = ref(storage, `profile-photos/${userId}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      // Update profile
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
        photoURL: photoURL
      });

      // Calculate age
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      // Save to Firestore profiles collection
      await setDoc(doc(db, 'profiles', userId), {
        // Basic Info
        uid: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        age: age,
        height: formData.height,
        weight: formData.weight,
        maritalStatus: formData.maritalStatus,
        photoURL: photoURL,

        // Location
        country: formData.country,
        state: formData.state,
        city: formData.customCity || formData.city,

        // Education & Career
        educationLevel: formData.educationLevel,
        educationDetails: formData.educationDetails,
        occupation: formData.occupation,
        occupationDetails: formData.occupationDetails,
        annualIncome: formData.annualIncome,

        // Family
        familyType: formData.familyType,
        fatherOccupation: formData.fatherOccupation,
        motherOccupation: formData.motherOccupation,
        siblings: formData.siblings,

        // Cultural
        religion: formData.religion,
        caste: formData.caste,
        subCaste: formData.subCaste,
        motherTongue: formData.motherTongue,
        dietaryPreference: formData.dietaryPreference,

        // Lifestyle
        drinking: formData.drinking,
        smoking: formData.smoking,
        hobbies: formData.hobbies,
        aboutMe: formData.aboutMe,

        // Partner Preferences
        partnerPreferences: {
          ageRange: { min: formData.preferredAgeMin, max: formData.preferredAgeMax },
          heightRange: { min: formData.preferredHeightMin, max: formData.preferredHeightMax },
          maritalStatus: formData.preferredMaritalStatus,
          dietaryPreference: formData.preferredDiet,
          smoking: formData.preferredSmoking,
          drinking: formData.preferredDrinking,
        },

        // Metadata
        profileStatus: 'active',
        isActive: true,
        isPremium: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      alert('Registration successful! You can now log in.');
      router.push('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak.');
          break;
        default:
          setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Profile Photo
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Upload Your Photo</h2>
              <p className="text-gray-300">Add a clear photo of yourself. This helps others recognize you.</p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="w-full max-w-md aspect-square border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center bg-white/5">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="text-center">
                    <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-400">No photo selected</p>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
                id="photoInput"
              />

              <label htmlFor="photoInput" className="w-full max-w-md px-8 py-4 bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded-full font-semibold hover:bg-pink-500/30 transition-all cursor-pointer text-center">
                📷 Choose from Library
              </label>
            </div>
          </div>
        );

      case 1: // Basic Information
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Let's start with your basic information</h2>
              <p className="text-gray-300">This helps us find the right matches for you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2 font-medium">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Gender *</label>
              <div className="flex gap-4">
                {['Male', 'Female', 'Other'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      formData.gender === g
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2 font-medium">Height (cm) *</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleNumberChange('height', false)}
                    className="px-4 py-2 text-pink-400 text-2xl"
                  >−</button>
                  <div className="flex-1 text-center text-2xl font-bold text-white">
                    {formData.height} cm
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNumberChange('height', true)}
                    className="px-4 py-2 text-pink-400 text-2xl"
                  >+</button>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Weight (kg) *</label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleNumberChange('weight', false)}
                    className="px-4 py-2 text-pink-400 text-2xl"
                  >−</button>
                  <div className="flex-1 text-center text-2xl font-bold text-white">
                    {formData.weight} kg
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNumberChange('weight', true)}
                    className="px-4 py-2 text-pink-400 text-2xl"
                  >+</button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Marital Status *</label>
              <div className="flex gap-4 flex-wrap">
                {['Never Married', 'Divorced', 'Widowed'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, maritalStatus: status })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      formData.maritalStatus === status
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Email and Password */}
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Account Credentials</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2 font-medium">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2 font-medium">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Create password"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // I'll continue with the other steps in the next part...
      default:
        return <div>Step {currentStep + 1}</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Step {currentStep + 1} of {STEPS.length}</span>
              <span className="text-gray-400">{STEPS[currentStep]}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {renderStep()}

          {/* Navigation buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                disabled={loading}
                className="flex-1 px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-all disabled:opacity-50"
              >
                Back
              </button>
            )}

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-full font-semibold hover:opacity-90 transition-all enhanced-button disabled:opacity-50"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full font-semibold hover:opacity-90 transition-all enhanced-button disabled:opacity-50"
              >
                {loading ? 'Creating Profile...' : 'Complete Profile'}
              </button>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
