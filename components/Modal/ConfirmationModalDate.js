import React from 'react';
import LoadingBtn from '../Buttons/LoadingBtn';

const ConfirmationModalDate = ({ confirmDeleteId, setConfirmDeleteId, confirmDelete, loading, placeholder,title,Error,value,onChange,salesvalue,salesonChange }) => {
  return (
    <>
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background blur and dark overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

          {/* Modal content */}
          <div className="relative z-10 bg-white text-black p-6 rounded shadow-lg w-80 ">
           <div>Dispatch date</div>
            <input
        type="date"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded mb-4 text-black"
      />
       <div>Sales Person</div>
            <input
        type="text"
        placeholder={placeholder}
        value={salesvalue}
        onChange={salesonChange}
        className="w-full border px-3 py-2 rounded mb-4 text-black"
      />
       {Error && (
        <div className="text-red-600 text-sm mb-2 -mt-4">{Error}</div>
      )}
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

export default ConfirmationModalDate;
