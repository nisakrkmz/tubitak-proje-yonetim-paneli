import React, { useState } from 'react';
import { generateProjectDraft, improveText, evaluateProposal } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import { AIAnalysisResult } from '../types';

export const Draft: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [title, setTitle] = useState('IoT Tabanlı Akıllı Sera Sulama Otomasyonu');
    const [summary, setSummary] = useState('Bu projenin temel amacı, küçük ölçekli sera işletmeleri için maliyet etkin ve enerji verimli bir sulama sistemi geliştirmektir. Mevcut sistemlerin aksine, önerilen yapı toprak nem sensörleri ve yerel hava durumu verilerini birleştirerek su tüketimini %40 oranında azaltmayı hedeflemektedir. Ayrıca sistem, çiftçilere mobil uygulama üzerinden anlık veri takibi imkanı sunacaktır. Proje, sürdürülebilir tarım uygulamalarına teknolojik bir katkı sunmayı amaçlar.');
    const [method, setMethod] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [activeField, setActiveField] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
    const [isEditingMethod, setIsEditingMethod] = useState(false);

    const handleAIFill = async () => {
        setLoadingAI(true);
        try {
            const data = await generateProjectDraft("Akıllı Sera Sulama");
            setTitle(data.title);
            setSummary(data.summary);
            setMethod(data.method);
            showToast('Taslak yapay zeka tarafından oluşturuldu.', 'success');
        } catch (e) {
            showToast("AI servisi şu an kullanılamıyor.", 'error');
        } finally {
            setLoadingAI(false);
        }
    };

    const handleImprove = async (field: 'summary' | 'method') => {
        setLoadingAI(true);
        setActiveField(field);
        try {
            const current = field === 'summary' ? summary : method;
            const improved = await improveText(current, "TÜBİTAK 2209-A Proje Başvurusu");
            if(field === 'summary') setSummary(improved);
            else setMethod(improved);
            showToast('Metin akademik dille iyileştirildi.', 'success');
        } catch(e) {
            console.error(e);
            showToast("İyileştirme sırasında bir hata oluştu.", 'error');
        } finally {
            setLoadingAI(false);
            setActiveField(null);
        }
    };

    const handleSubmit = async () => {
        if (!title || !summary || !method) {
            showToast("Lütfen tüm alanları doldurunuz.", "error");
            return;
        }

        setLoadingAI(true);
        setActiveField('submit');
        try {
            const result = await evaluateProposal(title, summary, method);
            setAnalysisResult(result);
        } catch (error) {
            showToast("Analiz sırasında bir hata oluştu.", "error");
        } finally {
            setLoadingAI(false);
            setActiveField(null);
        }
    };

    const handleCloseAnalysis = () => {
        setAnalysisResult(null);
        navigate('/applications');
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col gap-4">
                 <button onClick={() => navigate(-1)} className="group flex items-center gap-2 px-3 py-2 rounded-full w-fit text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="font-bold text-sm">Geri</span>
                </button>
                <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                         <span>Başvurular</span>
                         <span className="material-symbols-outlined text-xs">chevron_right</span>
                         <span>Yeni Başvuru</span>
                     </div>
                     <div className="flex flex-wrap items-end justify-between gap-4">
                         <div>
                             <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Proje Başvuru Taslağı</h1>
                             <p className="text-gray-500 mt-1">2024/1 Dönemi • Son Başvuru: 25 Kasım</p>
                         </div>
                         <span className="px-3 py-1 bg-red-100 text-primary rounded-full text-xs font-bold tracking-wide border border-red-200">DÜZENLEME MODU</span>
                     </div>
                </div>
            </div>

            {/* AI Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-8 text-white shadow-xl group border border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-0"></div>
                <div className="absolute right-0 top-0 -mt-10 -mr-10 size-64 rounded-full bg-primary blur-[100px] opacity-30 group-hover:opacity-40 transition-opacity"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-red-400">
                            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Yapay Zeka Hazır</span>
                        </div>
                        <h3 className="text-xl font-bold">Veriler Analiz Edildi</h3>
                        <p className="text-gray-300 max-w-xl text-sm leading-relaxed">Ekip bilgileri, proje alanı ve temel fikir sistemde kayıtlı. AI, bu verileri kullanarak saniyeler içinde taslak bir TÜBİTAK 2209-A formu oluşturabilir.</p>
                    </div>
                    <button 
                        onClick={handleAIFill}
                        disabled={loadingAI}
                        className="group flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(227,0,27,0.4)] hover:shadow-[0_0_30px_rgba(227,0,27,0.6)] border border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingAI && !activeField ? (
                            <span className="material-symbols-outlined animate-spin">sync</span>
                        ) : (
                            <span className="material-symbols-outlined transition-transform group-hover:rotate-12">magic_button</span>
                        )}
                        <span>{loadingAI && !activeField ? 'Oluşturuluyor...' : 'Yapay Zeka ile Doldur'}</span>
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-8 rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Proje Adı</label>
                    <div className="relative group">
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-900 font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg" 
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setTitle("Akıllı Sulama Sistemi")} className="rounded-lg p-2 text-gray-400 hover:text-primary hover:bg-white transition-colors">
                                <span className="material-symbols-outlined text-[20px]">refresh</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100 w-full"></div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Projenin Amacı</label>
                        <button 
                            onClick={() => handleImprove('summary')}
                            disabled={loadingAI}
                            className="flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/20 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                        >
                            {loadingAI && activeField === 'summary' ? (
                                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                            ) : (
                                <span className="material-symbols-outlined text-[16px]">auto_fix</span>
                            )}
                            <span className="hidden sm:inline">AI İyileştir</span>
                        </button>
                    </div>
                    <div className="relative w-full rounded-xl border border-gray-200 bg-gray-50 p-1 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                        <textarea 
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={6}
                            className="w-full bg-transparent border-none focus:ring-0 p-4 text-gray-800 leading-relaxed resize-none"
                        ></textarea>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Yöntem</label>
                        <button 
                             onClick={() => handleImprove('method')}
                             disabled={loadingAI}
                             className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
                        >
                             {loadingAI && activeField === 'method' ? (
                                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                            ) : (
                                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                            )}
                            <span className="hidden sm:inline">AI ile Üret</span>
                        </button>
                    </div>
                    {method || isEditingMethod ? (
                         <div className="relative w-full rounded-xl border border-gray-200 bg-gray-50 p-1 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                            <textarea 
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                                rows={6}
                                placeholder="Projenin yöntemini, kullanılacak materyalleri ve izlenecek adımları detaylıca açıklayınız..."
                                className="w-full bg-transparent border-none focus:ring-0 p-4 text-gray-800 leading-relaxed resize-none"
                            ></textarea>
                        </div>
                    ) : (
                        <div className="relative min-h-[120px] w-full rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-white hover:border-gray-400 transition-all">
                            <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-2xl">edit_note</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Yöntem bölümü henüz boş</p>
                                <p className="text-xs text-gray-500 mt-1">İçeriği kendiniz yazabilir veya yapay zeka ile oluşturabilirsiniz.</p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsEditingMethod(true)}
                                    className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                    Kendim Yazacağım
                                </button>
                                <button 
                                    onClick={() => handleImprove('method')}
                                    disabled={loadingAI}
                                    className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-xs font-bold text-primary hover:bg-primary/20 transition-all flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                                    AI Taslak Oluştur
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                     {/* Calendar Widget (Static) */}
                     <div className="flex flex-col gap-4">
                         <div className="flex items-center justify-between">
                             <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Çalışma Takvimi</label>
                             <button onClick={() => showToast("Takvim düzenleyici açılıyor...", 'info')} className="text-xs font-bold text-primary flex items-center gap-1 hover:text-primary-dark transition-colors"><span className="material-symbols-outlined text-[14px]">add_circle</span> Oluştur</button>
                         </div>
                         <div className="rounded-xl border border-gray-200 bg-gray-50 p-1 overflow-hidden">
                             <div onClick={() => showToast("Görev: Literatür Taraması (Tamamlandı)", 'info')} className="p-3 hover:bg-white rounded-lg transition-colors cursor-pointer flex items-center gap-4">
                                 <div className="flex flex-col items-center justify-center rounded-lg bg-white border border-gray-200 p-2 shadow-sm min-w-[56px]">
                                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">EKM</span>
                                     <span className="text-xl font-black text-gray-900">15</span>
                                 </div>
                                 <div className="flex-1">
                                     <p className="text-sm font-bold text-gray-900">Literatür Taraması</p>
                                     <div className="flex items-center gap-2 mt-1"><span className="size-2 rounded-full bg-green-500"></span><p className="text-xs text-gray-500">Tamamlandı</p></div>
                                 </div>
                             </div>
                             <div className="h-px bg-gray-200 mx-3 my-1"></div>
                             <div onClick={() => showToast("Görev: Sistem Tasarımı (Devam Ediyor)", 'info')} className="p-3 hover:bg-white rounded-lg transition-colors cursor-pointer flex items-center gap-4">
                                 <div className="flex flex-col items-center justify-center rounded-lg bg-primary/10 border border-primary/20 p-2 min-w-[56px]">
                                     <span className="text-[10px] font-bold text-primary uppercase tracking-widest">KAS</span>
                                     <span className="text-xl font-black text-gray-900">01</span>
                                 </div>
                                 <div className="flex-1">
                                     <p className="text-sm font-bold text-gray-900">Sistem Tasarımı</p>
                                     <div className="flex items-center gap-2 mt-1"><span className="size-2 rounded-full bg-primary animate-pulse"></span><p className="text-xs text-primary font-bold">Devam Ediyor</p></div>
                                 </div>
                             </div>
                         </div>
                     </div>

                     {/* Team Widget (Static) */}
                     <div className="flex flex-col gap-4">
                         <div className="flex items-center justify-between">
                             <label className="text-sm font-bold text-gray-900 uppercase tracking-wider">Ekip Durumu</label>
                             <button onClick={() => showToast("Ekip düzenleme sayfası açılıyor...", 'info')} className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 transition-colors"><span className="material-symbols-outlined text-[14px]">edit</span> Düzenle</button>
                         </div>
                         <div className="flex flex-col gap-3">
                             <div className="flex items-center justify-between rounded-xl bg-white border border-gray-200 p-3 shadow-sm hover:border-primary/50 transition-colors cursor-pointer">
                                 <div className="flex items-center gap-3">
                                     <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs ring-2 ring-blue-100">AY</div>
                                     <div className="flex flex-col"><span className="text-sm font-bold text-gray-900">Ali Yılmaz</span><span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Proje Yürütücüsü</span></div>
                                 </div>
                                 <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                             </div>
                             <div className="flex items-center justify-between rounded-xl bg-white border border-gray-200 p-3 shadow-sm hover:border-primary/50 transition-colors cursor-pointer">
                                 <div className="flex items-center gap-3">
                                     <div className="size-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-black text-xs ring-2 ring-purple-100">ZK</div>
                                     <div className="flex flex-col"><span className="text-sm font-bold text-gray-900">Zeynep Kaya</span><span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Araştırmacı</span></div>
                                 </div>
                                 <span className="material-symbols-outlined text-green-500 text-[20px]">check_circle</span>
                             </div>
                         </div>
                     </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="sticky bottom-6 flex w-full items-center justify-between bg-white/90 backdrop-blur-xl px-6 py-4 shadow-lg border border-gray-100 rounded-2xl z-40">
                <div className="hidden md:flex items-center gap-3">
                    <span className="flex size-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                    <span className="text-xs font-bold text-gray-500">Taslak kaydedildi (14:32)</span>
                </div>
                <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3">
                    <button onClick={() => showToast("Taslak başarıyla kaydedildi.", 'success')} className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95">Taslağı Kaydet</button>
                    <div className="flex gap-3">
                        <button onClick={() => showToast("PDF önizleme oluşturuluyor...", 'info')} className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                            <span className="hidden sm:inline">Önizleme</span>
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={loadingAI}
                            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:bg-primary-dark transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loadingAI && activeField === 'submit' ? (
                                <>
                                    <span>AI İnceliyor...</span>
                                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                                </>
                            ) : (
                                <>
                                    <span>Onaya Sun</span>
                                    <span className="material-symbols-outlined text-[18px]">send</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Analysis Result Modal */}
            {analysisResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={handleCloseAnalysis}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-slide-in">
                        <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">psychology</span>
                                AI Ön Değerlendirme Raporu
                            </h2>
                            <button onClick={handleCloseAnalysis} className="size-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
                                <div className="relative size-40 shrink-0">
                                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                        <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                        <path className="text-primary transition-all duration-1000 ease-out" strokeDasharray={`${analysisResult.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-primary">
                                        <span className="text-4xl font-black">%{analysisResult.score}</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">Başarı Şansı</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-gray-900 text-lg">Genel Analiz</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">{analysisResult.analysis}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                                    <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined">thumb_up</span>
                                        Güçlü Yönler
                                    </h4>
                                    <ul className="space-y-2">
                                        {analysisResult.strengths.map((s, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                                                <span className="mt-1 size-1.5 rounded-full bg-green-500 shrink-0"></span>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                                    <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined">warning</span>
                                        Geliştirilmesi Gerekenler
                                    </h4>
                                    <ul className="space-y-2">
                                        {analysisResult.weaknesses.map((w, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                                                <span className="mt-1 size-1.5 rounded-full bg-red-500 shrink-0"></span>
                                                {w}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                            <button 
                                onClick={handleCloseAnalysis} 
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center gap-2"
                            >
                                Anlaşıldı, Başvurularıma Git
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};