'use client';

import { useState } from 'react';

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - in real app, this would come from Firebase
  const members = [
    { id: 1, name: 'Member 1', age: 28, profession: 'Software Engineer', location: 'Chennai' },
    { id: 2, name: 'Member 2', age: 26, profession: 'Doctor', location: 'Bangalore' },
    { id: 3, name: 'Member 3', age: 30, profession: 'Business Owner', location: 'Mumbai' },
    { id: 4, name: 'Member 4', age: 27, profession: 'Teacher', location: 'Delhi' },
    { id: 5, name: 'Member 5', age: 29, profession: 'Accountant', location: 'Hyderabad' },
    { id: 6, name: 'Member 6', age: 25, profession: 'Designer', location: 'Pune' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="glass-card p-12">
        <h1 className="text-5xl font-bold text-white mb-4 text-center">Members</h1>
        <p className="text-xl text-gray-300 mb-8 text-center max-w-3xl mx-auto">
          Browse profiles of verified members in our community
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, profession, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
            />
            <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id} className="glass-card p-6 hover:scale-105 transition-transform">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                  <p className="text-gray-400">{member.age} years</p>
                </div>
              </div>
              <div className="space-y-2 text-gray-300">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {member.profession}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {member.location}
                </p>
              </div>
              <button className="w-full mt-4 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors">
                View Profile
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Please login to view detailed profiles</p>
          <a href="/login" className="inline-block px-8 py-3 bg-purple-500 text-white rounded-full font-semibold hover:bg-purple-600 transition-colors">
            Login to View More
          </a>
        </div>
      </div>
    </div>
  );
}
