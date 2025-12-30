import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { UploadCloud, Calculator, Info, Tag, MapPin, DollarSign, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const PostAd = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  
  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  const [formData, setFormData] = useState({
    animal_type: 'Goat', breed: '', age: '', price: '', weight: '', color: '', city: '', description: ''
  });
  const [files, setFiles] = useState([]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles(e.target.files);

  const handlePredictPrice = async () => {
    if (!formData.weight || !formData.breed || !formData.color) {
      alert("Please fill in Weight, Breed, and Color to get an estimate.");
      return;
    }
    setPredicting(true);
    try {
        const data = new FormData();
        data.append('weight', formData.weight);
        data.append('age', formData.age || '2 years');
        data.append('breed', formData.breed);
        data.append('color', formData.color);
        const res = await api.post('/predict-price/', data);
        setFormData(prev => ({ ...prev, price: res.data.estimated_price }));
    } catch (error) { alert("Could not predict price."); } 
    finally { setPredicting(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    for (let i = 0; i < files.length; i++) data.append('files', files[i]);

    try {
      await api.post('/animals/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/');
    } catch (error) { alert('Failed to upload ad.'); } 
    finally { setLoading(false); }
  };

  if (authLoading) return null; 

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Post an Ad</h1>
          <p className="text-gray-500 mt-2">Reach thousands of buyers in seconds.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Tag size={20} className="text-green-600"/> Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select name="animal_type" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500">
                  <optgroup label="Livestock">
                    <option value="Goat">Goat</option>
                    <option value="Cow">Cow</option>
                    <option value="Buffalo">Buffalo</option>
                    <option value="Sheep">Sheep</option>
                    <option value="Camel">Camel</option>
                    <option value="Horse">Horse</option>
                  </optgroup>
                  <optgroup label="Pets">
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Rabbit">Rabbit</option>
                  </optgroup>
                  <optgroup label="Birds & Others">
                    <option value="Bird">Bird</option>
                    <option value="Hen">Hen</option>
                    <option value="Duck">Duck</option>
                    <option value="Fish">Fish</option>
                    <option value="Other">Other / Unknown</option>
                  </optgroup>
                </select>
              </div>

              {/* REMOVED NAME FIELD HERE */}

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                <input type="text" name="breed" placeholder="e.g. Sahiwal" required onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Info size={20} className="text-green-600"/> Physical Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input type="text" name="age" placeholder="e.g. 2 years" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input type="number" name="weight" placeholder="e.g. 250" required value={formData.weight} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input type="text" name="color" placeholder="e.g. Black" required value={formData.color} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <DollarSign size={20} className="text-green-600"/> Price & Location
            </h3>

            <div className="space-y-6">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Price (PKR)</label>
                 <div className="flex gap-2">
                    <input type="number" name="price" placeholder="Total Price" required value={formData.price} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500" />
                    <button type="button" onClick={handlePredictPrice} className="bg-blue-50 text-blue-600 border border-blue-200 px-4 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-blue-100 whitespace-nowrap" disabled={predicting}>
                      <Calculator size={18} /> {predicting ? "..." : "Get Estimate"}
                    </button>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City / Location</label>
                <div className="relative">
                  <MapPin className="absolute top-3.5 left-3 text-gray-400" size={18} />
                  <input type="text" name="city" placeholder="e.g. Lahore, Punjab" required onChange={handleChange} className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-green-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FileText size={20} className="text-green-600"/> Description & Media
            </h3>
            
            <div className="space-y-6">
              <textarea name="description" placeholder="Describe the animal's health, diet, history..." rows="4" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500"></textarea>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 p-3 rounded-full mb-3">
                    <UploadCloud className="text-green-600" size={24} />
                  </div>
                  <span className="text-gray-700 font-medium">Click to upload images</span>
                  <span className="text-sm text-gray-400 mt-1">
                    {files.length > 0 ? `${files.length} images selected` : "JPG, PNG, WEBP (Max 5)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition shadow-lg disabled:bg-gray-400">
            {loading ? 'Posting Ad...' : 'Publish Ad'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default PostAd;