'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';

const STEPS = [
  'Account Setup',
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
    // Auth (moved to step 0)
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
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const validateCurrentStep = () => {
    setError('');

    switch (currentStep) {
      case 0: // Account Setup
        if (!formData.email) {
          setError('Please enter your email');
          return false;
        }
        if (!formData.password) {
          setError('Please enter a password');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        if (!formData.confirmPassword) {
          setError('Please confirm your password');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        return true;

      case 1: // Profile Photo
        if (!photoFile) {
          setError('Please upload a profile photo');
          return false;
        }
        return true;

      case 2: // Basic Information
        if (!formData.firstName) {
          setError('Please enter your first name');
          return false;
        }
        if (!formData.lastName) {
          setError('Please enter your last name');
          return false;
        }
        if (!formData.gender) {
          setError('Please select your gender');
          return false;
        }
        if (!formData.dateOfBirth) {
          setError('Please enter your date of birth');
          return false;
        }
        if (!formData.maritalStatus) {
          setError('Please select your marital status');
          return false;
        }
        return true;

      case 3: // Location
        if (!formData.state) {
          setError('Please select your state');
          return false;
        }
        if (!formData.city) {
          setError('Please select your city');
          return false;
        }
        if (formData.city === 'Other' && !formData.customCity) {
          setError('Please enter your city name');
          return false;
        }
        return true;

      case 4: // Education & Career
        if (!formData.educationLevel) {
          setError('Please select your education level');
          return false;
        }
        if (!formData.occupation) {
          setError('Please select your occupation');
          return false;
        }
        if (!formData.annualIncome) {
          setError('Please select your annual income');
          return false;
        }
        return true;

      case 5: // Family Details
        if (!formData.familyType) {
          setError('Please select your family type');
          return false;
        }
        return true;

      case 6: // Cultural Information
        if (!formData.religion) {
          setError('Please select your religion');
          return false;
        }
        if (!formData.motherTongue) {
          setError('Please select your mother tongue');
          return false;
        }
        return true;

      case 7: // Lifestyle (all optional)
        return true;

      case 8: // Partner Preferences (all optional)
        return true;

      default:
        return true;
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

      // Registration successful - redirect to dashboard
      router.push('/dashboard/matches');
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const firebaseError = error as { code?: string };
      switch (firebaseError.code) {
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
      case 0: // Account Setup
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Your Account</h2>
              <p className="text-gray-300">Let&apos;s get started with your email and password</p>
            </div>

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
                placeholder="Create password (minimum 6 characters)"
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
                placeholder="Confirm your password"
              />
            </div>
          </div>
        );

      case 1: // Profile Photo
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Upload Your Photo</h2>
              <p className="text-gray-300">Add a clear photo of yourself. This helps others recognize you.</p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="w-full max-w-md aspect-square border-2 border-dashed border-white/20 rounded-2xl flex items-center justify-center bg-white/5 relative overflow-hidden">
                {photoPreview ? (
                  <Image src={photoPreview} alt="Preview" fill className="object-cover rounded-2xl" />
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

      case 2: // Basic Information
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Let&apos;s start with your basic information</h2>
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
          </div>
        );

      case 3: // Location
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Where are you from?</h2>
              <p className="text-gray-300">Tell us about your location</p>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Country *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="India" className="bg-gray-800">India</option>
                <option value="USA" className="bg-gray-800">USA</option>
                <option value="UK" className="bg-gray-800">UK</option>
                <option value="Canada" className="bg-gray-800">Canada</option>
                <option value="Australia" className="bg-gray-800">Australia</option>
                <option value="Other" className="bg-gray-800">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">State *</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="" className="bg-gray-800">Select State</option>
                <option value="Tamil Nadu" className="bg-gray-800">Tamil Nadu</option>
                <option value="Kerala" className="bg-gray-800">Kerala</option>
                <option value="Karnataka" className="bg-gray-800">Karnataka</option>
                <option value="Andhra Pradesh" className="bg-gray-800">Andhra Pradesh</option>
                <option value="Telangana" className="bg-gray-800">Telangana</option>
                <option value="Maharashtra" className="bg-gray-800">Maharashtra</option>
                <option value="Gujarat" className="bg-gray-800">Gujarat</option>
                <option value="Delhi" className="bg-gray-800">Delhi</option>
                <option value="West Bengal" className="bg-gray-800">West Bengal</option>
                <option value="Rajasthan" className="bg-gray-800">Rajasthan</option>
                <option value="Uttar Pradesh" className="bg-gray-800">Uttar Pradesh</option>
                <option value="Madhya Pradesh" className="bg-gray-800">Madhya Pradesh</option>
                <option value="Other" className="bg-gray-800">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">City *</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="" className="bg-gray-800">Select City</option>
                <option value="Chennai" className="bg-gray-800">Chennai</option>
                <option value="Bangalore" className="bg-gray-800">Bangalore</option>
                <option value="Mumbai" className="bg-gray-800">Mumbai</option>
                <option value="Delhi" className="bg-gray-800">Delhi</option>
                <option value="Hyderabad" className="bg-gray-800">Hyderabad</option>
                <option value="Pune" className="bg-gray-800">Pune</option>
                <option value="Kolkata" className="bg-gray-800">Kolkata</option>
                <option value="Ahmedabad" className="bg-gray-800">Ahmedabad</option>
                <option value="Surat" className="bg-gray-800">Surat</option>
                <option value="Coimbatore" className="bg-gray-800">Coimbatore</option>
                <option value="Madurai" className="bg-gray-800">Madurai</option>
                <option value="Trichy" className="bg-gray-800">Trichy</option>
                <option value="Salem" className="bg-gray-800">Salem</option>
                <option value="Other" className="bg-gray-800">Other</option>
              </select>
            </div>

            {formData.city === 'Other' && (
              <div>
                <label className="block text-white mb-2 font-medium">Enter City Name *</label>
                <input
                  type="text"
                  name="customCity"
                  value={formData.customCity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="Enter your city"
                />
              </div>
            )}
          </div>
        );

      case 4: // Education & Career
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Education & Career</h2>
              <p className="text-gray-300">Tell us about your professional background</p>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Education Level *</label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="" className="bg-gray-800">Select Education Level</option>
                <option value="High School" className="bg-gray-800">High School</option>
                <option value="Diploma" className="bg-gray-800">Diploma</option>
                <option value="Bachelor's Degree" className="bg-gray-800">Bachelor&apos;s Degree</option>
                <option value="Master's Degree" className="bg-gray-800">Master&apos;s Degree</option>
                <option value="Doctorate/PhD" className="bg-gray-800">Doctorate/PhD</option>
                <option value="Professional Degree" className="bg-gray-800">Professional Degree</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Education Details</label>
              <input
                type="text"
                name="educationDetails"
                value={formData.educationDetails}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                placeholder="e.g., B.Tech Computer Science, MBA Finance"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Occupation *</label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="" className="bg-gray-800">Select Occupation</option>
                <option value="Software Engineer" className="bg-gray-800">Software Engineer</option>
                <option value="Doctor" className="bg-gray-800">Doctor</option>
                <option value="Teacher" className="bg-gray-800">Teacher</option>
                <option value="Business Owner" className="bg-gray-800">Business Owner</option>
                <option value="Government Employee" className="bg-gray-800">Government Employee</option>
                <option value="Lawyer" className="bg-gray-800">Lawyer</option>
                <option value="Engineer" className="bg-gray-800">Engineer</option>
                <option value="Accountant" className="bg-gray-800">Accountant</option>
                <option value="Consultant" className="bg-gray-800">Consultant</option>
                <option value="Student" className="bg-gray-800">Student</option>
                <option value="Homemaker" className="bg-gray-800">Homemaker</option>
                <option value="Other" className="bg-gray-800">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Occupation Details</label>
              <input
                type="text"
                name="occupationDetails"
                value={formData.occupationDetails}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                placeholder="e.g., Company name, Specialization"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Annual Income *</label>
              <select
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="" className="bg-gray-800">Select Income Range</option>
                <option value="Below ₹2 Lakhs" className="bg-gray-800">Below ₹2 Lakhs</option>
                <option value="₹2-5 Lakhs" className="bg-gray-800">₹2-5 Lakhs</option>
                <option value="₹5-10 Lakhs" className="bg-gray-800">₹5-10 Lakhs</option>
                <option value="₹10-20 Lakhs" className="bg-gray-800">₹10-20 Lakhs</option>
                <option value="₹20-50 Lakhs" className="bg-gray-800">₹20-50 Lakhs</option>
                <option value="Above ₹50 Lakhs" className="bg-gray-800">Above ₹50 Lakhs</option>
                <option value="Prefer not to say" className="bg-gray-800">Prefer not to say</option>
              </select>
            </div>
          </div>
        );

      case 5: // Family Details
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Family Details</h2>
              <p className="text-gray-300">Tell us about your family background</p>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Family Type *</label>
              <div className="flex gap-4">
                {['Nuclear Family', 'Joint Family'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, familyType: type })}
                    className={`flex-1 px-6 py-3 rounded-full font-semibold transition-all ${
                      formData.familyType === type
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Father&apos;s Occupation</label>
              <input
                type="text"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                placeholder="Enter father&apos;s occupation"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Mother&apos;s Occupation</label>
              <input
                type="text"
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                placeholder="Enter mother&apos;s occupation"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Number of Siblings</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleNumberChange('siblings', false)}
                  className="px-4 py-2 text-pink-400 text-2xl"
                >−</button>
                <div className="flex-1 text-center text-2xl font-bold text-white">
                  {formData.siblings}
                </div>
                <button
                  type="button"
                  onClick={() => handleNumberChange('siblings', true)}
                  className="px-4 py-2 text-pink-400 text-2xl"
                >+</button>
              </div>
            </div>
          </div>
        );

      case 6: // Cultural Information
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Cultural Information</h2>
              <p className="text-gray-300">Share your cultural background</p>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Religion *</label>
              <div className="flex gap-4 flex-wrap">
                {['Hindu', 'Christian', 'Muslim', 'Other'].map(religion => (
                  <button
                    key={religion}
                    type="button"
                    onClick={() => setFormData({ ...formData, religion })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      formData.religion === religion
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {religion}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Caste/Community</label>
              <input
                type="text"
                name="caste"
                value={formData.caste}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                placeholder="Nadar"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Sub-Caste</label>
              <select
                name="subCaste"
                value={formData.subCaste}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="" className="bg-gray-800">Select Sub-Caste</option>
                <option value="Nadar" className="bg-gray-800">Nadar</option>
                <option value="Shanar" className="bg-gray-800">Shanar</option>
                <option value="Nelamaikkarars" className="bg-gray-800">Nelamaikkarars</option>
                <option value="Gramathu Nadar" className="bg-gray-800">Gramathu Nadar</option>
                <option value="Mara Nadar" className="bg-gray-800">Mara Nadar</option>
                <option value="Other" className="bg-gray-800">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Mother Tongue *</label>
              <select
                name="motherTongue"
                value={formData.motherTongue}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="" className="bg-gray-800">Select Mother Tongue</option>
                <option value="Tamil" className="bg-gray-800">Tamil</option>
                <option value="Telugu" className="bg-gray-800">Telugu</option>
                <option value="Kannada" className="bg-gray-800">Kannada</option>
                <option value="Malayalam" className="bg-gray-800">Malayalam</option>
                <option value="Hindi" className="bg-gray-800">Hindi</option>
                <option value="English" className="bg-gray-800">English</option>
                <option value="Marathi" className="bg-gray-800">Marathi</option>
                <option value="Gujarati" className="bg-gray-800">Gujarati</option>
                <option value="Bengali" className="bg-gray-800">Bengali</option>
                <option value="Punjabi" className="bg-gray-800">Punjabi</option>
                <option value="Other" className="bg-gray-800">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Dietary Preference (Optional)</label>
              <div className="flex gap-4 flex-wrap">
                {['Vegetarian', 'Non-Vegetarian', 'Eggetarian'].map(diet => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setFormData({ ...formData, dietaryPreference: diet })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      formData.dietaryPreference === diet
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 7: // Lifestyle
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Lifestyle & Interests</h2>
              <p className="text-gray-300">Tell us about your lifestyle and hobbies</p>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Drinking</label>
              <div className="flex gap-4 flex-wrap">
                {['Never', 'Occasionally', 'Regularly'].map(drink => (
                  <button
                    key={drink}
                    type="button"
                    onClick={() => setFormData({ ...formData, drinking: drink })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      formData.drinking === drink
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {drink}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Smoking (Optional)</label>
              <div className="flex gap-4 flex-wrap">
                {['Never', 'Occasionally', 'Regularly'].map(smoke => (
                  <button
                    key={smoke}
                    type="button"
                    onClick={() => setFormData({ ...formData, smoking: smoke })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      formData.smoking === smoke
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {smoke}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Hobbies & Interests (Select multiple)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Reading', 'Music', 'Cooking', 'Traveling', 'Sports', 'Dancing', 'Gardening', 'Photography', 'Painting', 'Writing', 'Yoga', 'Fitness', 'Movies', 'Gaming'].map(hobby => (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => handleMultiSelect('hobbies', hobby)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                      formData.hobbies.includes(hobby)
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">About Me (Optional)</label>
              <textarea
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                placeholder="Tell us something about yourself..."
              />
            </div>
          </div>
        );

      case 8: // Partner Preferences
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Partner Preferences</h2>
              <p className="text-gray-300">Help us find your perfect match</p>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Age Range (years)</label>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-2">From</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleNumberChange('preferredAgeMin', false)}
                      className="px-4 py-2 text-pink-400 text-2xl"
                    >−</button>
                    <div className="flex-1 text-center text-2xl font-bold text-white">
                      {formData.preferredAgeMin}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNumberChange('preferredAgeMin', true)}
                      className="px-4 py-2 text-pink-400 text-2xl"
                    >+</button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">To</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleNumberChange('preferredAgeMax', false)}
                      className="px-4 py-2 text-pink-400 text-2xl"
                    >−</button>
                    <div className="flex-1 text-center text-2xl font-bold text-white">
                      {formData.preferredAgeMax}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNumberChange('preferredAgeMax', true)}
                      className="px-4 py-2 text-pink-400 text-2xl"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Height Range (cm)</label>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-2">From</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleNumberChange('preferredHeightMin', false)}
                      className="px-4 py-2 text-pink-400 text-2xl"
                    >−</button>
                    <div className="flex-1 text-center text-xl font-bold text-white">
                      {formData.preferredHeightMin} cm
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNumberChange('preferredHeightMin', true)}
                      className="px-4 py-2 text-pink-400 text-2xl"
                    >+</button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">To</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleNumberChange('preferredHeightMax', false)}
                      className="px-4 py-2 text-pink-400 text-2xl"
                    >−</button>
                    <div className="flex-1 text-center text-xl font-bold text-white">
                      {formData.preferredHeightMax} cm
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNumberChange('preferredHeightMax', true)}
                      className="px-4 py-2 text-pink-400 text-2xl"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Marital Status</label>
              <div className="flex gap-4 flex-wrap">
                {['Never Married', 'Divorced', 'Widowed'].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleMultiSelect('preferredMaritalStatus', status)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      formData.preferredMaritalStatus.includes(status)
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Dietary Preference (Optional)</label>
              <div className="flex gap-4 flex-wrap">
                {['Vegetarian', 'Non-Vegetarian', 'Eggetarian'].map(diet => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredDiet: diet })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      formData.preferredDiet === diet
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Smoking (Optional)</label>
              <div className="flex gap-4 flex-wrap">
                {['Never', 'Occasionally', 'Regularly'].map(smoke => (
                  <button
                    key={smoke}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredSmoking: smoke })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      formData.preferredSmoking === smoke
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {smoke}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2 font-medium">Drinking (Optional)</label>
              <div className="flex gap-4 flex-wrap">
                {['Never', 'Occasionally', 'Regularly'].map(drink => (
                  <button
                    key={drink}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredDrinking: drink })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all ${
                      formData.preferredDrinking === drink
                        ? 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {drink}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

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
                className="flex-1 px-8 py-4 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all enhanced-button disabled:opacity-50"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-br from-blue-400 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all enhanced-button disabled:opacity-50"
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
