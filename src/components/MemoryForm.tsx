import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const MemoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { memoryId } = useParams<{ memoryId?: string }>();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  useEffect(() => {
    if (memoryId) {
      fetch(`http://localhost:4001/memories/${memoryId}`)
        .then(response => response.json())
        .then(data => setFormData(data.memory))
        .catch(error => {
          console.error('Error fetching memory:', error);
          navigate('/');
        });
    }
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (formData.description.trim() === '' || formData.name.trim() === '' || formData.image.trim() === '') {
      return;
    }


    const payload = {
      ...formData,
      timestamp: new Date()
    };

    const url = memoryId ? `http://127.0.0.1:4001/memories/${memoryId}` : 'http://127.0.0.1:4001/memories';

    try {
      const response = await fetch(url, {
        method: memoryId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = `Failed to ${memoryId ? 'update' : 'create'} memory: ${response.statusText}`;
        console.error(errorMessage);
      } else {
        if (!memoryId) {
          navigate('/');
        } else {
          navigate('/memory/' + memoryId);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  return (
    <div className="p-4 bg-white text-black">
      <h1 className="my-8 text-4xl text-center">Create Memory</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-black border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {formSubmitted && formData.name.trim() === '' && (
            <p className="text-red-500">Name is required.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-black border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={4}
          />
          {formSubmitted && formData.description.trim() === '' && (
            <p className="text-red-500">Description is required.</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="image">
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-black border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {formSubmitted && formData.image.trim() === '' && (
            <p className="text-red-500">Image is required.</p>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-black rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemoryForm;

