import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Camera, Save, User, Phone, ShieldCheck, LayoutDashboard, LogOut } from 'lucide-react';
import api from '../api';

const Profile = () => {
  const { user, updateUserImage, updateUser, logout } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  
  // Edit Form State
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [stats, setStats] = useState({ ads: 0, views: 0 });

  useEffect(() => {
    if (user) {
      // Initialize form with current user data
      // Note: We might need to fetch phone from API if not in context, 
      // but for now let's assume user context has name. 
      // We will fetch fresh data.
      fetchUserData();
      fetchUserStats();
    }
  }, [user]);

  const fetchUserData = async () => {
    // We reuse the animals endpoint to get seller info implicitly or add a specific GET /users/me endpoint later
    // For now, we pre-fill what we have.
    setFormData({ name: user.name, phone: '' }); 
    // Ideally, backend should send phone in /login response to store in context.
    // Since we didn't store phone in context, user has to re-enter it or we fetch it.
  };

  const fetchUserStats = async () => {
    try {
      const res = await api.get('/users/me/animals');
      const adsCount = res.data.length;
      const viewsCount = res.data.reduce((acc, curr) => acc + (curr.views || 0), 0);
      setStats({ ads: adsCount, views: viewsCount });
    } catch (e) { console.error(e); }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleImageUpload = async () => {
    if (!file) return;
    setLoadingImg(true);
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await api.put('/users/me/image', data);
      updateUserImage(res.data.image_url);
      setFile(null);
      alert("Profile picture updated!");
    } catch (err) { alert("Failed to upload image."); }
    finally { setLoadingImg(false); }
  };

  const handleInfoUpdate = async (e) => {
    e.preventDefault();
    setLoadingInfo(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('phone', formData.phone);
    
    try {
      await api.put('/users/me', data);
      updateUser(formData.name, formData.phone);
      alert("Profile details updated successfully!");
    } catch (error) {
      alert("Failed to update details. Phone number might be taken.");
    } finally {
      setLoadingInfo(false);
    }
  };

  if (!user) return <div className="text-center py-20">Please Login first.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* Header Background */}
      <div className="bg-green-700 h-48 w-full relative">
         <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative -mt-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
              
              {/* Image Upload */}
              <div className="relative w-32 h-32 mx-auto mb-4 group">
                <img 
                  src={preview || user.image || "https://via.placeholder.com/150"} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                />
                <label htmlFor="p-upload" className="absolute bottom-0 right-0 bg-green-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-green-700 shadow-lg transition transform hover:scale-105">
                  <Camera size={18} />
                </label>
                <input type="file" id="p-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              {file && (
                <button 
                  onClick={handleImageUpload} 
                  disabled={loadingImg}
                  className="mb-4 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold"
                >
                  {loadingImg ? "Saving..." : "Click to Save New Pic"}
                </button>
              )}

              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm mb-6">Member since 2024</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 border-t pt-4 mb-6">
                 <div className="text-center">
                    <span className="block font-bold text-xl text-gray-800">{stats.ads}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Active Ads</span>
                 </div>
                 <div className="text-center border-l">
                    <span className="block font-bold text-xl text-gray-800">{stats.views}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Total Views</span>
                 </div>
              </div>

              <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-red-600 font-medium py-2 hover:bg-red-50 rounded-lg transition">
                 <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <User size={20} className="text-green-600"/> Edit Personal Details
                  </h3>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1">
                    <ShieldCheck size={12}/> Verified Account
                  </span>
               </div>
               
               <div className="p-6 sm:p-8">
                 <form onSubmit={handleInfoUpdate} className="space-y-6">
                    
                    <div className="grid grid-cols-1 gap-6">
                       <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                          <div className="relative">
                            <User className="absolute top-3.5 left-3 text-gray-400" size={18} />
                            <input 
                              type="text" 
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 transition"
                              placeholder="Your Name"
                            />
                          </div>
                       </div>

                       <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute top-3.5 left-3 text-gray-400" size={18} />
                            <input 
                              type="text" 
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full pl-10 p-3 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500 transition"
                              placeholder="Update Phone Number"
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-2">Note: Changing your phone number will require verification next time.</p>
                       </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                       <button 
                         type="submit" 
                         disabled={loadingInfo}
                         className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-green-800 transition flex items-center gap-2 disabled:bg-gray-400"
                       >
                         {loadingInfo ? 'Updating...' : <><Save size={18} /> Save Changes</>}
                       </button>
                    </div>

                 </form>
               </div>
            </div>

            {/* Additional Options Card (Placeholder for future) */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                <div>
                   <h4 className="font-bold text-gray-800">Manage Listings</h4>
                   <p className="text-sm text-gray-500">View, edit, or delete your active animal ads.</p>
                </div>
                <a href="/dashboard" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800">
                   <LayoutDashboard size={16}/> Go to Dashboard
                </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;