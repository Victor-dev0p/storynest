"use client"
import { useState } from "react";


export default function StoriesDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 ml-50"
      >
        Stories
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-1">
            {["Fiction", "Drama", "Action", "Romance", "Adventure"].map((genre) => (
              <li key={genre}>
                <button className="block px-4 py-2 w-full text-left hover:bg-gray-100">
                  {genre}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

