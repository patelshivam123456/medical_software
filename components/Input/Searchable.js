import { useState } from "react";

const Searchable=({ clientNames, onSelect,setInputValue,inputValue,showOptions,setShowOptions })=> {
  
  const filteredOptions = clientNames.filter((c) =>
    c.clientName.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowOptions(true);
          onSelect(e.target.value);
        }}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)} // Delay to allow click
        className="border p-2 w-full bg-white text-black outline-none rounded-sm"
        placeholder="Search client..."
        required
      />
      {showOptions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-[25%] max-h-40 overflow-y-auto bg-white text-black border border-gray-300 rounded shadow-md mt-1">
          {filteredOptions.map((c, i) => (
            <li
              key={i}
              onMouseDown={() => {
                setInputValue(c.clientName);
                onSelect(c.clientName);
                setShowOptions(false);
              }}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
            >
              {c.clientName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Searchable
