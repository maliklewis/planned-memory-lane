import React, { useEffect, useState, useRef } from 'react';
import { Memory } from '../models/Memory';


const MemoriesList: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isGridLayout, setIsGridLayout] = useState(true);
  const toggleDropdown = (id: number) => {
    setShowDropdown(showDropdown === id ? null : id);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(null); 
    }
  };

  const handleShare = async (memoryId: number) => {
    const url = `${window.location.origin}/${memoryId}`;
    await navigator.clipboard.writeText(url);
    setShowDropdown(null)
  };

  const handleDelete = async (memoryId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:4001/memories/${memoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.error(response.statusText);
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const toggleLayout = () => {
    setIsGridLayout(!isGridLayout);
  };

  useEffect(() => {
      fetch('http://localhost:4001/memories')
      .then(response => response.json())
      .then(data => setMemories(data.memories));

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!memories.length) {
    return <div>No memories created</div>;
  }

  return (
    <div className="py-4">
      <button onClick={toggleLayout} className="mx-4 bg-black text-white py-2 px-4 rounded mr-4">
        Switch Layout
      </button>
      {isGridLayout ? (
        <div className="grid grid-cols-1 gap-4">
          {memories.map((memory) => (
            <div key={memory.id} className="bg-white p-4 rounded shadow">
              {memory.image && (
                <div className="mb-4">
                  <img src={memory.image} alt={`${memory.name}`} className="w-16 h-16 rounded-full" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold mb-2">{memory.name}</h2>
                <p className="mb-2">{memory.description}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(memory.timestamp).toLocaleDateString()}
                </p>
              </div>
              <button className="text-xl justify-between" onClick={() => toggleDropdown(memory.id)}>
                &#8942; {/* Hamburger icon */}
              </button>
              {showDropdown === memory.id && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <a
                      href={`/memory/${memory.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Details
                    </a>
                    <a
                      href={`/memory/edit/${memory.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Edit
                    </a>
                    <button
                      onClick={() => handleShare(memory.id)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Copy link to clipboard
                    </button>
                    <button
                      onClick={() => handleDelete(memory.id)}
                      className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memories.map((memory) => (
            <div key={memory.id} className="bg-white p-4 rounded-lg shadow-lg">
              <div className="mt-4 relative justify-between">
                <button className="text-xl" onClick={() => toggleDropdown(memory.id)}>
                  &#8942; {/* Hamburger icon */}
                </button>
                {showDropdown === memory.id && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <a href={`/memory/${memory.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Details
                      </a>
                      <a
                        href={`/memory/edit/${memory.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleShare(memory.id)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Copy link to clipboard
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center mb-4">
              {memory.image && (
                <img src={memory.image} alt={`${memory.name}`} className="w-32 h-32 object-cover rounded-lg" />
              )}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">{memory.name}</h2>
                <p className="mb-2">{memory.description}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(memory.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoriesList;

