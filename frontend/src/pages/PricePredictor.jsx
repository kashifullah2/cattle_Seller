import React, { useState } from 'react';
import api from '../api';
import { Calculator, TrendingUp, Info, AlertTriangle, Scale, Palette, Calendar, FileText } from 'lucide-react';

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
      setError("Could not generate prediction. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold mb-4 shadow-sm">
          <Calculator size={16} /> Beta Version
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          AI Price <span className="text-green-600">Estimator</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Use our Machine Learning model to get an instant market value estimation. 
          <br/>
          <span className="font-semibold text-gray-800">Currently optimized for Cattle (Cows / Bulls) only.</span>
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
            <div className="bg-green-50 p-2.5 rounded-xl">
               <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
               <h2 className="text-xl font-bold text-gray-900">Enter Animal Details</h2>
               <p className="text-xs text-gray-400">Provide accurate data for best results</p>
            </div>
          </div>
          
          <form onSubmit={handlePredict} className="space-y-6">
            
            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3">
               <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
               <p className="text-sm text-yellow-800 leading-snug">
                 <strong>Note:</strong> This model is trained specifically for <strong>Cattle (Cows/Bulls)</strong>. Predictions for <strong>Goats or Sheep</strong> may be inaccurate. <strong>Support for additional animals will be added in future updates.</strong>
               </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Breed</label>
              <div className="relative">
                <FileText className="absolute top-3.5 left-4 text-gray-400" size={18} />
                <input 
                  type="text" 
                  name="breed" 
                  placeholder="e.g. Sahiwal, Cholistani" 
                  className="modern-input pl-12" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weight (kg)</label>
                <div className="relative">
                  <Scale className="absolute top-3.5 left-4 text-gray-400" size={18} />
                  <input 
                    type="number" 
                    name="weight" 
                    placeholder="e.g. 350" 
                    className="modern-input pl-12" 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Age</label>
                <div className="relative">
                  <Calendar className="absolute top-3.5 left-4 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    name="age" 
                    placeholder="e.g. 2 years" 
                    className="modern-input pl-12" 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color</label>
              <div className="relative">
                <Palette className="absolute top-3.5 left-4 text-gray-400" size={18} />
                <input 
                  type="text" 
                  name="color" 
                  placeholder="e.g. Black, White, Red" 
                  className="modern-input pl-12" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gradient w-full py-4 text-lg">
              {loading ? 'Calculating...' : 'Check Price'}
            </button>
          </form>
        </div>

        {/* Right Side: Result Area */}
        <div className="flex flex-col gap-6">
            
            {/* The Result Card */}
            <div className={`relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 ${prediction ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              
              <div className="p-10 text-center">
                 {prediction !== null ? (
                   <>
                     <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Estimated Market Price</p>
                     <div className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-2">
                       {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(prediction)}
                     </div>
                     <p className="text-green-600 font-medium bg-green-50 inline-block px-4 py-1 rounded-full text-sm mt-4">
                        Based on recent market data
                     </p>
                   </>
                 ) : (
                   <div className="py-10">
                     <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <Calculator size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-gray-400">No Prediction Yet</h3>
                     <p className="text-gray-400 mt-2 text-sm">Fill out the form to see the magic.</p>
                   </div>
                 )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-center text-sm font-medium animate-pulse">
                {error}
              </div>
            )}

            {/* Info Card */}
            <div className="bg-blue-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
               
               <div className="relative z-10 flex gap-4">
                 <div className="bg-white/20 p-3 rounded-xl h-fit">
                    <Info size={24} className="text-white" />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg mb-2">How it works?</h3>
                   <p className="text-blue-100 text-sm leading-relaxed">
                     Our AI analyzes thousands of recent cattle sales in Pakistan to estimate price based on breed, weight, and visual characteristics. 
                     <br/><br/>
                     <span className="opacity-70 text-xs">Accuracy depends on market fluctuations.</span>
                   </p>
                 </div>
               </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default PricePredictor;