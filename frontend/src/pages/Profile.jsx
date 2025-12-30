import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Camera, Save } from 'lucide-react';
import api from '../api';

const Profile = () => {
  const { user, updateUserImage } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="text-center py-20">Please Login first.</div>;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.put('/users/me/image', formData);
      updateUserImage(res.data.image_url);
      alert("Profile image updated successfully!");
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar Removed */}
      
      <div className="flex-grow max-w-2xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

          <div className="relative w-32 h-32 mx-auto mb-6 group">
            <img 
              src={preview || user.image || "https://via.placeholder.com/150"} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover border-4 border-green-100"
            />
            <label htmlFor="p-upload" className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 shadow-md">
              <Camera size={18} />
            </label>
            <input type="file" id="p-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500 mb-6">User ID: {user.id}</p>

          {file && (
            <button 
              onClick={handleUpload} 
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-green-700 transition"
            >
              {loading ? "Uploading..." : <><Save size={18}/> Save New Picture</>}
            </button>
          )}

        </div>
      </div>
      
      {/* Footer Removed */}
    </div>
  );
};

export default Profile;