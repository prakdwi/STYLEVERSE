'use client';
import type { FC } from 'react';

const Home: FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center px-8">
        <div className="mb-8">
          <div className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            styleVERSE
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Under Reconstruction
          </h1>
        </div>
        
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
          We're working hard to bring you an enhanced 3D texture generation experience. Our platform is temporarily down while we rebuild and improve.
        </p>
        
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4">Coming Soon</h2>
          <ul className="text-left text-gray-300 space-y-2 inline-block">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Advanced AI-powered texture generation
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Real-time 3D model customization
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
              Enhanced material library
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Improved performance and stability
            </li>
          </ul>
        </div>
        
        <div className="text-gray-400 text-sm">
          <p className="mb-2">Thank you for your patience!</p>
          <p>Check back soon for updates</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
