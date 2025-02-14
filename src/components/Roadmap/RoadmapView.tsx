import React, { useState } from 'react';
import { SearchBar } from '../shared/SearchBar';
import { CustomButton } from '../shared/CustomButton';

export const RoadmapView: React.FC = () => {
  const [click, setClick] = useState(false);
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className="text-2xl font-bold mb-4">Learning Roadmap & Resources</h1>
      <div className="w-full max-w-xl mx-auto space-y-4">
          <SearchBar
              onSearch={() => setClick(!click)}
              placeholder="Search for roadmaps and resources"
              centered={true}
              className="bg-gray-900/80"
          />
          </div>
          <div className="max-w-2xl mx-auto px-6 py-8">
            <p className="text-lg leading-relaxed text-gray-300 text-center">
              Discover your learning path with our comprehensive roadmaps. Whether you're 
              interested in blockchain, web3, or other technologies, we provide detailed, 
              step-by-step guidance along with curated free and paid learning resources 
              to help you achieve your goals.
            </p>
          </div>
          <div>
            <CustomButton onClick={() => {setClick(!click)}}>
              Search
            </CustomButton>
          </div>
          
          <div className="max-w-2xl mx-auto px-6 py-8">
        {click && <p className="text-lg leading-relaxed text-gray-300 text-center"> We are also working for this features, stay tuned to be first user...</p>}
        </div>
    </div>
  );
};