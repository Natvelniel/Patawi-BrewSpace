import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PackageWeight, GrindProfile } from '../../types';
import { X, Minus, Plus, ShoppingBag, Coffee, Sparkles } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductModal, setSelectedProductModal, addToCart } = useStore();

  const [selectedWeight, setSelectedWeight] = useState<PackageWeight>('200g');
  const [selectedGrind, setSelectedGrind] = useState<GrindProfile>('whole');
  const [quantity, setQuantity] = useState(1);
  const [customNotes, setCustomNotes] = useState('');

  if (!selectedProductModal) return null;

  const product = selectedProductModal;

  const weightMultipliers: Record<PackageWeight, number> = {
    '200g': 1.0,
    '500g': 2.3, // discount
    '1kg': 4.0,  // discount
  };

  const calculatedUnitPrice = Math.round(product.basePrice * weightMultipliers[selectedWeight]);
  const subtotal = calculatedUnitPrice * quantity;

  const grindOptions: {
    id: GrindProfile;
    title: string;
    description: string;
    recommended?: boolean;
  }[] = [
    {
      id: 'whole',
      title: 'Biji Utuh (Whole Bean)',
      description: 'Kesegaran maksimal, giling mandiri sebelum seduh.',
      recommended: true,
    },
    {
      id: 'coarse',
      title: 'Giling Kasar (Coarse)',
      description: 'French Press, Cold Brew, Cupping.',
    },
    {
      id: 'medium',
      title: 'Giling Sedang (Medium)',
      description: 'V60 Pour Over, Kalita Wave, Aeropress, Clever.',
    },
    {
      id: 'fine',
      title: 'Giling Halus (Fine)',
      description: 'Espresso Mesin, Moka Pot, Kopi Tubruk Tradisional.',
    },
  ];

  const handleAdd = () => {
    addToCart(product, selectedWeight, selectedGrind, quantity, customNotes.trim() || undefined);
    setSelectedProductModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in select-none">
      <div
        className="w-full max-w-[412px] bg-[#FAF7F2] rounded-t-[32px] max-h-[90vh] flex flex-col shadow-2xl border-t border-[#ECE4DA] overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1 bg-[#D9CEC5] rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 flex items-start gap-3 border-b border-[#ECE4DA] bg-white/70 backdrop-blur-xs">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F4EFE9] shrink-0 border border-[#ECE4DA]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-[#865225] tracking-wider uppercase">
              {product.region} • {product.altitude}
            </span>
            <h3 className="font-serif text-[18px] font-bold text-[#26160F] truncate leading-snug">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-serif text-[17px] font-bold text-[#26160F]">
                Rp {calculatedUnitPrice.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-[#75645C]">/{selectedWeight}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedProductModal(null)}
            className="w-8 h-8 rounded-full bg-[#EFE8E0] text-[#75645C] hover:text-[#26160F] hover:bg-[#E5DCD2] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
          {/* Cupping Score & Flavor Profile Card */}
          <div className="bg-white p-4 rounded-2xl border border-[#ECE4DA] shadow-2xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#F4EFE9]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#865225] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#C86826]" />
                Profil Rasa (Cupping Score {product.scores.cuppingScore || 86.5})
              </div>
              <span className="text-[11px] font-semibold text-[#75645C]">
                {product.roastDate}
              </span>
            </div>
            {/* Visual Bars */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-[#75645C]">Keasaman</span>
                  <span className="font-bold text-[#26160F]">{product.scores.acidity}</span>
                </div>
                <div className="w-full h-2 bg-[#F4EFE9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#E08A44] rounded-full w-[65%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-[#75645C]">Ketebalan</span>
                  <span className="font-bold text-[#26160F]">{product.scores.body}</span>
                </div>
                <div className="w-full h-2 bg-[#F4EFE9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#26160F] rounded-full w-[80%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1.5">
                  <span className="text-[#75645C]">Manis</span>
                  <span className="font-bold text-[#26160F]">{product.scores.sweetness}</span>
                </div>
                <div className="w-full h-2 bg-[#F4EFE9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#C86826] rounded-full w-[85%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#26160F]">
                Pilih Berat / Ukuran Kemasan
              </label>
              <span className="text-[11px] text-[#865225] font-semibold">
                Zipper Bag + Degassing Valve
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {(['200g', '500g', '1kg'] as PackageWeight[]).map((w) => {
                const isSelected = selectedWeight === w;
                const price = Math.round(product.basePrice * weightMultipliers[w]);
                const badge =
                  w === '200g' ? 'Favorit' : w === '500g' ? 'Hemat 8%' : 'Hemat 20%';

                return (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-[#26160F] text-white border-[#26160F] shadow-sm'
                        : 'bg-white text-[#26160F] border-[#ECE4DA] hover:bg-[#F4EFE9]'
                    }`}
                  >
                    <span className="text-sm font-bold">{w}</span>
                    <span
                      className={`text-xs mt-0.5 ${
                        isSelected ? 'text-[#FDB882]' : 'text-[#75645C]'
                      }`}
                    >
                      Rp {price.toLocaleString('id-ID')}
                    </span>
                    <span
                      className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#C86826] text-white'
                          : 'bg-[#F4EFE9] text-[#865225]'
                      }`}
                    >
                      {badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grind Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#26160F]">
                Pilih Profil Gilingan (Grind Size)
              </label>
              <span className="text-xs font-bold text-[#865225]">
                {selectedGrind === 'whole'
                  ? 'Biji Utuh'
                  : selectedGrind === 'coarse'
                  ? 'Giling Kasar'
                  : selectedGrind === 'medium'
                  ? 'Giling Sedang'
                  : 'Giling Halus'}
              </span>
            </div>
            <div className="space-y-2">
              {grindOptions.map((g) => {
                const isSelected = selectedGrind === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGrind(g.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer active:scale-98 ${
                      isSelected
                        ? 'bg-[#FDF6F0] border-[#C86826] shadow-2xs ring-1 ring-[#C86826]/30'
                        : 'bg-white border-[#ECE4DA] hover:bg-[#F4EFE9]'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isSelected
                          ? 'bg-[#26160F] text-[#FDB882]'
                          : 'bg-[#EFE8E0] text-[#75645C]'
                      }`}
                    >
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#26160F]">
                          {g.title}
                        </span>
                        {g.recommended && (
                          <span className="text-[10px] font-bold bg-[#FDB882] text-[#26160F] px-2 py-0.5 rounded-full">
                            Sangat Dianjurkan
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#75645C] mt-0.5 truncate">
                        {g.description}
                      </p>
                    </div>
                    {/* Radio circle */}
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#26160F] bg-[#26160F]'
                          : 'border-[#D9CEC5]'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Notes */}
          <div>
            <label className="text-xs font-semibold text-[#75645C] block mb-1">
              Catatan Khusus untuk Roaster / Barista (Opsional)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Contoh: Sangrai medium-dark, giling Aeropress fine..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#ECE4DA] bg-white text-xs text-[#26160F] placeholder-[#75645C] focus:outline-hidden focus:border-[#26160F]"
            />
          </div>
        </div>

        {/* Sticky Footer with Safe Area */}
        <div className="px-5 pt-3.5 pb-[max(1rem,env(safe-area-inset-bottom,16px))] bg-white border-t border-[#ECE4DA] flex items-center gap-3 shadow-[0_-4px_20px_rgba(38,22,15,0.04)]">
          <div>
            <span className="text-[11px] text-[#75645C] block leading-tight">
              Subtotal Pesanan
            </span>
            <span className="font-serif text-[18px] font-bold text-[#26160F] leading-tight">
              Rp {subtotal.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Quantity Counter */}
          <div className="flex items-center bg-[#EFE8E0] rounded-xl px-2 py-1.5 ml-auto">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 rounded-lg hover:bg-white text-[#26160F] transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-[#26160F]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 rounded-lg hover:bg-white text-[#26160F] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-1.5 bg-[#26160F] hover:bg-[#C86826] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#FDB882]" />
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
};
