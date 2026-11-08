import React from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Coffee, Flame, Droplets, Gauge, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-[420px] w-full p-5 shadow-2xl border border-[#ECE4DA] max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#ECE4DA]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#26160F] text-[#FDB882] flex items-center justify-center shadow-xs shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-[18px] font-bold text-[#26160F] leading-tight">
                Panduan Profil Gilingan
              </h3>
              <p className="text-xs text-[#75645C] mt-0.5">
                Patawi Roastery Senopati
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGrindGuide(false)}
            className="w-8 h-8 rounded-full bg-[#EFE8E0] text-[#75645C] hover:text-[#26160F] hover:bg-[#E5DCD2] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            title="Tutup Panduan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {guides.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all ${
                  g.recommended
                    ? 'bg-[#FAF5EF] border-2 border-[#C86826] shadow-xs ring-1 ring-[#C86826]/20'
                    : 'bg-white border border-[#ECE4DA] depth-card hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        g.recommended
                          ? 'bg-[#26160F] text-[#FDB882]'
                          : 'bg-[#EFE8E0] text-[#865225]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-[13.5px] font-bold text-[#26160F] leading-tight whitespace-nowrap">
                      {g.title}
                    </h4>
                  </div>
                  {g.recommended && (
                    <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold bg-[#FDB882] text-[#26160F] px-2.5 py-0.5 rounded-full border border-[#C86826]/30 shadow-2xs shrink-0">
                      <Sparkles className="w-3 h-3 text-[#C86826]" />
                      Sangat Dianjurkan
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5C4D46] mt-2 leading-relaxed">
                  {g.desc}
                </p>
                <div className="mt-2.5 flex items-start gap-1.5 text-[11px] bg-[#F4EFE9] border border-[#ECE4DA] px-2.5 py-1.5 rounded-xl">
                  <span className="text-[#C86826] shrink-0 mt-0.5">⚡</span>
                  <div className="min-w-0 flex-1 leading-snug">
                    <span className="text-[#75645C]">Cocok untuk: </span>
                    <strong className="text-[#26160F]">{g.gear}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3.5 border-t border-[#ECE4DA]">
          <button
            onClick={() => setShowGrindGuide(false)}
            className="w-full bg-[#26160F] hover:bg-[#3E2419] text-[#FDB882] py-3 rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
          >
            Mengerti, Lanjutkan Belanja
          </button>
        </div>
      </div>
    </div>
  );
};
