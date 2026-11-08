import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Coffee, Flame, Droplets, Gauge } from 'lucide-react';

export const GrindGuideModal: React.FC = () => {
  const { showGrindGuide, setShowGrindGuide } = useStore();

  if (!showGrindGuide) return null;

  const guides = [
    {
      title: 'Biji Utuh (Whole Bean)',
      icon: Coffee,
      desc: 'Sangat disarankan jika Anda memiliki grinder sendiri. Menjaga kesegaran maksimal, aroma, dan cita rasa hingga 2 bulan setelah resting.',
      gear: 'Manual Grinder / Electric Conical Burr',
      recommended: true,
    },
    {
      title: 'Giling Kasar (Coarse)',
      icon: Droplets,
      desc: 'Ukuran seperti garam kasar laut. Ekstraksi lambat untuk metode perendaman dingin atau steeping tanpa rasa pahit berlebih.',
      gear: 'Cold Brew, French Press, Cupping Bowl',
      recommended: false,
    },
    {
      title: 'Giling Sedang (Medium)',
      icon: Flame,
      desc: 'Ukuran mirip pasir pantai. Sangat ideal untuk seduhan pour-over filter kertas agar air mengalir dengan laju ekstraksi seimbang.',
      gear: 'V60, Aeropress, Kalita Wave, Clever Dripper',
      recommended: false,
    },
    {
      title: 'Giling Halus (Fine)',
      icon: Gauge,
      desc: 'Butiran halus seperti bubuk gula halus. Diperlukan tekanan tinggi untuk mengekstrak crema tebal dan rasa pekat.',
      gear: 'Mesin Espresso, Moka Pot, Kopi Tubruk Tradisional',
      recommended: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FBF9F5] rounded-2xl max-w-[420px] w-full p-6 shadow-2xl border border-[#EAE8E4] max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E4]">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#2B1810] text-[#FDB882] rounded-xl">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-[18px] font-bold text-[#2B1810]">
                Panduan Profil Gilingan
              </h3>
              <p className="text-[12px] text-[#817470]">
                Patawi Roastery Senopati
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGrindGuide(false)}
            className="p-1.5 rounded-full text-[#817470] hover:bg-[#EFEEEA] hover:text-[#2B1810] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 mt-4">
          {guides.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  g.recommended
                    ? 'bg-[#FDF3EB] border-[#E08A44]/40 ring-1 ring-[#E08A44]/20'
                    : 'bg-white border-[#EAE8E4]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#865225]" />
                    <h4 className="text-[14px] font-bold text-[#2B1810]">{g.title}</h4>
                  </div>
                  {g.recommended && (
                    <span className="text-[10px] font-bold bg-[#E08A44] text-white px-2 py-0.5 rounded-full">
                      Sangat Dianjurkan
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#4F4440] mt-1.5 leading-relaxed">
                  {g.desc}
                </p>
                <div className="mt-2 text-[11px] font-medium text-[#865225] bg-[#F5F3EF] px-2.5 py-1 rounded-md inline-block">
                  ⚡ Cocok untuk: {g.gear}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-[#EAE8E4]">
          <button
            onClick={() => setShowGrindGuide(false)}
            className="w-full bg-[#2B1810] text-white py-2.5 rounded-xl font-semibold text-[14px] hover:bg-[#1B1C1A] transition-colors cursor-pointer"
          >
            Mengerti, Lanjutkan Belanja
          </button>
        </div>
      </div>
    </div>
  );
};
