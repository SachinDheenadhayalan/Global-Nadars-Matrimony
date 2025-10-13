// TypeScript interfaces for the matrimony application

export interface UserProfile {
  uid: string;
  email: string;
  mobile: string;

  // Personal Information
  fullName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  age: number;
  height: string;
  weight: string;
  maritalStatus: 'never_married' | 'divorced' | 'widowed';
  physicalStatus: string;

  // Education & Career
  education: string;
  educationDetails: string;
  occupation: string;
  occupationDetails: string;
  annualIncome: string;

  // Family Details
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  familyType: 'nuclear' | 'joint';
  familyStatus: 'middle_class' | 'upper_middle_class' | 'rich';

  // Location
  country: string;
  state: string;
  city: string;
  residencyStatus: string;

  // About
  about: string;
  hobbies: string[];

  // Partner Preferences
  partnerPreferences: {
    ageRange: { min: number; max: number };
    heightRange: { min: string; max: string };
    maritalStatus: string[];
    education: string[];
    occupation: string[];
    location: string[];
    annualIncome: string;
  };

  // Profile Status
  profilePicture: string;
  profileStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  isPremium: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationFormData {
  // Basic Info
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  gender: 'male' | 'female';
  dateOfBirth: string;

  // These will be collected in extended registration form
  height?: string;
  weight?: string;
  maritalStatus?: string;
  physicalStatus?: string;
  education?: string;
  educationDetails?: string;
  occupation?: string;
  occupationDetails?: string;
  annualIncome?: string;
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  siblings?: string;
  familyType?: string;
  familyStatus?: string;
  country?: string;
  state?: string;
  city?: string;
  about?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}
