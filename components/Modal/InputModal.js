import React from 'react'

const InputModal = (props) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-sm">
      <h3 className="text-lg font-bold mb-4 text-black">{props.label}</h3>
      <input
        type="text"
        placeholder="Company Name"
        value={props.value}
        onChange={props.onChange}
        className="w-full border px-3 py-2 rounded mb-4 text-black"
      />
       {props.Error && (
        <div className="text-red-600 text-sm mb-2 -mt-4">{props.Error}</div>
      )}
      <div className="flex justify-end gap-2">
        <button onClick={props.onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
        <button onClick={props.onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
      </div>
    </div>
  </div>
  )
}

export default InputModal