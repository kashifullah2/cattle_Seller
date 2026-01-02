import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // <--- 1. Import this
import api from '../api';
import { Camera, User, Lock, LogOut, LayoutDashboard, Settings } from 'lucide-react';

const Profile = () => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate(); // <--- 2. Initialize Hook
  
  // States for Image Upload
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // States for Info Update
  const [formData, setFormData] = useState({ name: '', phone: '' });

  // States for Password Change
  const [passData, setPassData] = useState({ old_password: '', new_password: '' });
  const [passMsg, setPassMsg] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState({ ads: 0, views: 0 });

  useEffect(() => {
    if (user) {
        setFormData({ name: user.name, phone: user.phone || '' });
        setPreview(user.image);
        fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
      try {
        const res = await api.get('/users/me/animals');
        const ads = res.data;
        const views = ads.reduce((acc, curr) => acc + (curr.views || 0), 0);
        setStats({ ads: ads.length, views });
      } catch (e) { console.error(e); }
  };

  // --- 3. THE LOGOUT FIX ---
  const handleLogout = () => {
      logout(); // Clear data
      navigate('/login'); // Force redirect
  };

  // 1. Handle Image Upload
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const saveImage = async () => {
      if(!file) return;
      setUploading(true);
      const data = new FormData();
      data.append('file', file);
      try {
          const res = await api.put('/users/me/image', data);
          updateUser({ ...user, image: res.data.image_url });
          setFile(null);
          alert("Profile photo updated!");
          window.location.reload(); // Fixes white screen issue
      } catch(err) { 
          alert("Failed to upload"); 
      }
      finally { setUploading(false); }
  };

  // 2. Handle Info Update
  const saveInfo = async (e) => {
      e.preventDefault();
      alert("Feature coming soon: Update Name/Phone");
  };

  // 3. Handle Password Change
  const handlePassChange = async (e) => {
      e.preventDefault();
      setPassLoading(true);
      setPassMsg('');
      try {
          await api.post('/users/change-password', passData);
          setPassMsg("Success: Password updated successfully!");
          setPassData({ old_password: '', new_password: '' });
      } catch (err) {
          setPassMsg("Error: Incorrect old password or server error.");
      } finally {
          setPassLoading(false);
      }
  };

  if (!user) return <div className="h-screen flex items-center justify-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      
      {/* Header Background */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 h-60 w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative -mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: Profile Card & Stats --- */}
          <div className="lg:col-span-1 space-y-6">
             
             {/* Profile Card */}
             <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 text-center border border-gray-100">
                <div className="relative w-32 h-32 mx-auto mb-4">
                    <img src={preview || "https://via.placeholder.com/150"} className="w-full h-full rounded-full object-cover border-4 border-white shadow-md" alt="User" />
                    <label className="absolute bottom-1 right-1 bg-gray-900 text-white p-2 rounded-full cursor-pointer hover:bg-black transition shadow-sm">
                        <Camera size={16} />
                        <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>
                
                {file && (
                    <button onClick={saveImage} disabled={uploading} className="text-xs bg-green-600 text-white px-3 py-1 rounded-full mb-4 hover:bg-green-700 transition">
                        {uploading ? "Saving..." : "Save Photo"}
                    </button>
                )}

                <h2 className="text-2xl font-extrabold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm mb-6">{user.email}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <p className="text-2xl font-bold text-gray-900">{stats.ads}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Active Ads</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                        <p className="text-2xl font-bold text-gray-900">{stats.views}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Views</p>
                    </div>
                </div>

                {/* LOGOUT BUTTON - Updated to use handleLogout */}
                <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center gap-2 text-red-600 font-bold py-3 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100"
                >
                    <LogOut size={18} /> Sign Out
                </button>
             </div>
          </div>

          {/* --- RIGHT COLUMN: Edit Forms --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Edit Personal Info */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><User size={20}/></div>
                  <h3 className="font-bold text-gray-800 text-lg">Personal Details</h3>
               </div>
               <div className="p-8">
                  <form onSubmit={saveInfo} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                            <input type="text" className="modern-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                            <input type="text" className="modern-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} disabled />
                            <p className="text-[10px] text-gray-400 mt-1">Contact admin to change phone number</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button disabled className="bg-gray-200 text-gray-400 px-6 py-3 rounded-xl font-bold cursor-not-allowed">
                             Save Changes
                        </button>
                      </div>
                  </form>
               </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="bg-gray-50/50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600"><Lock size={20}/></div>
                  <h3 className="font-bold text-gray-800 text-lg">Security</h3>
               </div>
               <div className="p-8">
                  <h4 className="font-bold text-gray-900 mb-1">Change Password</h4>
                  <p className="text-gray-500 text-sm mb-6">Ensure your account is using a long, random password to stay secure.</p>
                  
                  {passMsg && (
                      <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${passMsg.includes("Success") ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                          {passMsg}
                      </div>
                  )}

                  <form onSubmit={handlePassChange} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                            <input type="password" required className="modern-input" value={passData.old_password} onChange={e => setPassData({...passData, old_password: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                            <input type="password" required className="modern-input" value={passData.new_password} onChange={e => setPassData({...passData, new_password: e.target.value})} />
                        </div>
                      </div>
                      <div className="flex justify-end">
                          <button disabled={passLoading} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg shadow-gray-900/10">
                              {passLoading ? "Updating..." : "Update Password"}
                          </button>
                      </div>
                  </form>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;