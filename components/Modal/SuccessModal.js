import React from 'react';
import LoadingBtn from '../Buttons/LoadingBtn';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';

const SuccessModal = ({ confirmDeleteId, setConfirmDeleteId, confirmDelete, loading, title }) => {
  return (
    <>
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background blur and dark overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

          {/* Modal content */}
          <div className="relative z-10 bg-white text-black p-6 rounded shadow-lg mx-4 w-full lg:w-[40%] text-center">
            <div className='flex justify-center mb-4'><CheckBadgeIcon className='w-12 h-12 text-green-800'/></div>
            <div className='text-lg font-semibold text-red-700'>Congratulation!!</div>
            <p className="mb-4 text-lg">{title }</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDeleteId(false)}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              >
                Cancel
              </button>
              {/* {loading ? (
                <LoadingBtn />
              ) : (
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
                >
                  Confirm
                </button>
              )} */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessModal;
