import React, { useState } from 'react';
import FileUploader from '../shared/DrapAndDrop';

export const QuestionPredictionView: React.FC = () => {
  const [click, setClick] = useState(false);
  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className="text-2xl font-bold mb-4">Question Prediction</h1>
      <div className="space-y-4">
        <FileUploader />
        <p>Upload previous 3 or 5 or 10 years question papers of your exam,
          we will provide prediction of your next question paper.
        </p>
        </div>
        <div className='m-5'>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setClick(!click)}
        >
          {click ? 'Hide' : 'Show'} Prediction
          
        </button>
        </div>
        {click && (
            <div>
              <p>We are now working in this feature :D
                Sorry for Waiting... :(</p>
            </div>
          )}
      
    </div>
  );
};