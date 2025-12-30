import React, { useState } from 'react';
import api from '../api'; // Removed Navbar import
import { Calculator, TrendingUp, Info } from 'lucide-react';

const PricePredictor = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    weight: '',
    age: '',
    breed: '',
    color: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    if (!formData.weight || !formData.breed || !formData.color) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('weight', formData.weight);
      data.append('age', formData.age);
      data.append('breed', formData.breed);
      data.append('color', formData.color);

      const res = await api.post('/predict-price/', data);
      setPrediction(res.data.estimated_price);
    } catch (err) {
      console.error(err);
      setError("Could not generate prediction. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Removed from here */}
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-green-800 flex justify-center items-center gap-3">
            <Calculator size={32} />
            AI Price Estimator
          </h1>
          <p className="text-gray-600 mt-2">
            Use our Machine Learning model to check the estimated market value of your animal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Form Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Enter Animal Details</h2>
            
            <form onSubmit={handlePredict} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                <input type="text" name="breed" placeholder="e.g. Red Chittagong" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input type="number" name="weight" placeholder="217" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input type="text" name="age" placeholder="2.5 years" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" onChange={handleChange} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input type="text" name="color" placeholder="Red" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" onChange={handleChange} required />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-green-700 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-800 transition shadow-md disabled:bg-gray-400">
                {loading ? 'Calculating...' : 'Check Price'}
              </button>
            </form>
          </div>

          {/* Result Section */}
          <div className="flex flex-col justify-center">
            {prediction !== null ? (
              <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-green-500 text-center">
                <h3 className="text-gray-500 font-medium uppercase tracking-wider text-sm">Estimated Market Price</h3>
                <div className="text-5xl font-extrabold text-green-700 my-4">
                  {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(prediction)}
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-2 rounded-lg">
                  <TrendingUp size={20} />
                  <span className="font-semibold">Based on AI Model</span>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 p-8 rounded-xl border border-blue-200 text-center opacity-80">
                 <Info className="mx-auto text-blue-500 mb-3" size={40} />
                 <h3 className="text-lg font-semibold text-blue-800">How it works</h3>
                 <p className="text-blue-600 mt-2 text-sm">Enter details to get an AI prediction.</p>
              </div>
            )}
            {error && <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-center">{error}</div>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PricePredictor;