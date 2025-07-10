import React from 'react';
import LoadingBtn from '../Buttons/LoadingBtn';

const ConfirmationModal = ({ confirmDeleteId, setConfirmDeleteId, confirmDelete, loading, title }) => {
  return (
    <>
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background blur and dark overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

          {/* Modal content */}
          <div className="relative z-10 bg-white text-black p-6 rounded shadow-lg w-80 text-center">
            <p className="mb-4 text-lg">{title || "Are you sure you want to delete this user?"}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              >
                Cancel
              </button>
              {loading ? (
                <LoadingBtn />
              ) : (
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmationModal;
