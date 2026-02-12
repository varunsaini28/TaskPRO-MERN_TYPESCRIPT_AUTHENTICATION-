import React from 'react';
import Dashnav from '../../components/Layout/Dashnav';

const Work = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 pt-20 pb-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Work Tasks</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Projects</h2>
            <p className="text-gray-600">Track your work projects and meetings.</p>
          </div>
        </div>
      </div>
      <Dashnav />
    </div>
  );
};

export default Work;