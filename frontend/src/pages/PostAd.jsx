import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';
import { UploadCloud, Calculator } from 'lucide-react'; // Added Calculator icon
import { AuthContext } from '../context/AuthContext';

const PostAd = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false); // New state for prediction
  
  // PROTECT THE ROUTE
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const [formData, setFormData] = useState({
    animal_type: 'Goat', // This acts as 'Breed' roughly, or add specific breed field
    breed: '',           // New Field for ML
    age: '',             // New Field for ML
    price: '',
    weight: '',
    color: '',
    city: '',
    description: ''
  });
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // --- NEW FUNCTION: Get Prediction ---
  const handlePredictPrice = async () => {
    if (!formData.weight || !formData.breed || !formData.color) {
      alert("Please fill in Weight, Breed, and Color to get an estimate.");
      return;
    }

    setPredicting(true);
    try {
        const data = new FormData();
        data.append('weight', formData.weight);
        data.append('age', formData.age || '2 years'); // Default if empty
        data.append('breed', formData.breed);
        data.append('color', formData.color);

        const res = await api.post('/predict-price/', data);
        
        // Update the price field with the prediction
        setFormData(prev => ({ ...prev, price: res.data.estimated_price }));
    } catch (error) {
        console.error("Prediction failed", error);
        alert("Could not predict price.");
    } finally {
        setPredicting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    for (let i = 0; i < files.length; i++) {
      data.append('files', files[i]);
    }

    try {
      await api.post('/animals/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload ad. Please login again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null; 

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Sell Your Animal</h1>
            <p className="text-gray-500">Posting as <strong>{user?.name}</strong></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Animal Info */}
            <div className="space-y-4">
               <h3 className="font-semibold text-gray-800">Animal Details</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 
                 {/* Type Selection */}
                 <select name="animal_type" onChange={handleChange} className="w-full p-2 border rounded">
                   <option value="Goat">Goat</option>
                   <option value="Cow">Cow</option>
                   <option value="Buffalo">Buffalo</option>
                   <option value="Sheep">Sheep</option>
                   <option value="Camel">Camel</option>
                 </select>

                 {/* New Fields for ML */}
                 <input type="text" name="breed" placeholder="Breed (e.g. Red Chittagong)" required onChange={handleChange} className="w-full p-2 border rounded" />
                 <input type="text" name="age" placeholder="Age (e.g. 2.5 years)" onChange={handleChange} className="w-full p-2 border rounded" />
                 
                 <input type="number" name="weight" placeholder="Weight (kg)" required value={formData.weight} onChange={handleChange} className="w-full p-2 border rounded" />
                 <input type="text" name="color" placeholder="Color" required value={formData.color} onChange={handleChange} className="w-full p-2 border rounded" />
                 <input type="text" name="city" placeholder="City" required onChange={handleChange} className="w-full p-2 border rounded" />
               </div>

               {/* Price Prediction Section */}
               <div className="flex gap-2 items-center">
                   <input 
                    type="number" 
                    name="price" 
                    placeholder="Price (PKR)" 
                    required 
                    value={formData.price} 
                    onChange={handleChange} 
                    className="flex-grow p-2 border rounded border-green-200" 
                   />
                   <button 
                    type="button"
                    onClick={handlePredictPrice}
                    className="bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-1 text-sm hover:bg-blue-700"
                    disabled={predicting}
                   >
                    <Calculator size={16} />
                    {predicting ? "..." : "Suggest Price"}
                   </button>
               </div>

               <textarea name="description" placeholder="Additional details..." rows="3" onChange={handleChange} className="w-full p-2 border rounded"></textarea>
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" required />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload photos</span>
                <span className="text-xs text-gray-400 mt-1">{files.length > 0 ? `${files.length} files selected` : "Supported: JPG, PNG"}</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md disabled:bg-gray-400"
            >
              {loading ? 'Posting...' : 'Post Ad Now'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PostAd;