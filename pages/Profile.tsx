import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';

export const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    
    const [profileData, setProfileData] = useState({
        name: 'Ahmet Yılmaz',
        department: 'Bilgisayar Mühendisliği, 3. Sınıf',
        email: 'ahmet.yilmaz@univ.edu.tr',
        university: 'İstanbul Teknik Üniversitesi',
        phone: '+90 555 123 45 67',
        about: 'Teknoloji ve tarım alanlarını birleştiren projeler üzerine çalışıyorum. IoT ve yapay zeka konularına ilgi duyuyorum. Takım çalışmasına yatkınım.'
    });

    const [editForm, setEditForm] = useState(profileData);

    const handleEditClick = () => {
        setEditForm(profileData);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm(profileData);
        showToast('Değişiklikler iptal edildi.', 'info');
    };

    const handleSave = () => {
        setProfileData(editForm);
        setIsEditing(false);
        showToast('Profil bilgileri güncellendi.', 'success');
    };

    const handleChange = (field: keyof typeof profileData, value: string) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="group flex items-center gap-2 px-3 py-2 rounded-full text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="font-bold text-sm">Geri</span>
                </button>
                <h1 className="text-2xl font-black text-gray-900">Profilim</h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Card */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent"></div>
                        
                        <div className="relative mb-4 mt-8">
                            <div className="size-32 rounded-full border-4 border-white shadow-xl bg-gray-200 bg-cover bg-center" style={{ backgroundImage: 'url(https://picsum.photos/200/200)' }}></div>
                            <button onClick={() => showToast("Fotoğraf yükleme özelliği yakında gelecek.", 'info')} className="absolute bottom-1 right-1 size-8 rounded-full bg-gray-900 text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer border-2 border-white shadow-md">
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                        </div>
                        
                        <h2 className="text-xl font-black text-gray-900">{profileData.name}</h2>
                        <p className="text-sm font-medium text-gray-500 mb-6">{profileData.department}</p>
                        
                        <div className="w-full flex gap-2 mb-6">
                            <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase">Proje</p>
                                <p className="text-lg font-black text-gray-900">2</p>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase">Takım</p>
                                <p className="text-lg font-black text-gray-900">1</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleEditClick}
                            className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition-colors shadow-lg shadow-gray-200 active:scale-95"
                        >
                            Profili Düzenle
                        </button>
                    </div>

                    <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400">workspace_premium</span>
                            Rozetler
                        </h3>
                        <div className="flex flex-wrap gap-2">
                             <div className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-bold border border-yellow-100">Erken Başvuru</div>
                             <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">Ekip Lideri</div>
                             <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-100">Araştırmacı</div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="lg:w-2/3 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6 h-8">
                            <h3 className="text-lg font-bold text-gray-900">Kişisel Bilgiler</h3>
                            {isEditing ? (
                                <div className="flex gap-3">
                                    <button onClick={handleCancel} className="text-sm font-bold text-gray-500 hover:text-gray-900">İptal</button>
                                    <button onClick={handleSave} className="text-sm font-bold text-primary hover:text-primary-dark bg-primary/10 px-3 py-1 rounded-full">Kaydet</button>
                                </div>
                            ) : (
                                <button onClick={handleEditClick} className="text-sm font-bold text-primary hover:underline">Düzenle</button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ad Soyad</label>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={editForm.name} 
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900">{profileData.name}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">E-posta</label>
                                {isEditing ? (
                                    <input 
                                        type="email" 
                                        value={editForm.email} 
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900">{profileData.email}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Üniversite</label>
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        value={editForm.university} 
                                        onChange={(e) => handleChange('university', e.target.value)}
                                        className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900">{profileData.university}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Telefon</label>
                                {isEditing ? (
                                    <input 
                                        type="tel" 
                                        value={editForm.phone} 
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900">{profileData.phone}</p>
                                )}
                            </div>
                             <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Hakkımda</label>
                                {isEditing ? (
                                    <textarea 
                                        rows={4}
                                        value={editForm.about} 
                                        onChange={(e) => handleChange('about', e.target.value)}
                                        className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {profileData.about}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
                         <h3 className="text-lg font-bold text-gray-900 mb-6">Akademik Geçmiş</h3>
                         <div className="space-y-6">
                             <div className="flex gap-4">
                                 <div className="flex flex-col items-center">
                                     <div className="size-3 rounded-full bg-primary ring-4 ring-primary/10"></div>
                                     <div className="w-0.5 h-full bg-gray-100 my-1"></div>
                                 </div>
                                 <div>
                                     <p className="font-bold text-gray-900">Lisans Eğitimi</p>
                                     <p className="text-sm text-gray-500">İstanbul Teknik Üniversitesi - Bilgisayar Mühendisliği</p>
                                     <p className="text-xs text-gray-400 mt-1">2021 - Devam Ediyor</p>
                                 </div>
                             </div>
                             <div className="flex gap-4">
                                 <div className="flex flex-col items-center">
                                     <div className="size-3 rounded-full bg-gray-300"></div>
                                 </div>
                                 <div>
                                     <p className="font-bold text-gray-900">Lise Eğitimi</p>
                                     <p className="text-sm text-gray-500">Ankara Fen Lisesi</p>
                                     <p className="text-xs text-gray-400 mt-1">2017 - 2021</p>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};