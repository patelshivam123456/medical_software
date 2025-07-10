import { BackwardIcon, ForwardIcon } from '@heroicons/react/24/outline'
import React from 'react'

const Pagination
 = ({totalPages,setCurrentPage,currentPage}) => {
  return (
    <div>
        {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                className="px-1 cursor-pointer py-1  disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <BackwardIcon className="w-5 h-6 text-blue-500" />
              </button>
              <span className="text-sm font-medium">
                Page <span className="text-orange-600"> {currentPage}</span> of{" "}
                {totalPages}
              </span>
              <button
                className="px-1 py-1 cursor-pointer disabled:opacity-50"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ForwardIcon className="w-5 h-5 text-blue-500" />
              </button>
            </div>
          )}
    </div>
  )
}

export default Pagination
