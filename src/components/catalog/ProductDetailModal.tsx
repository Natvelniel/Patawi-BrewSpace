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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="w-full max-w-[480px] bg-[#FBF9F5] rounded-t-[28px] max-h-[92vh] flex flex-col shadow-2xl border-t border-[#EAE8E4] overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-[#D3C3BE] rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 flex items-start gap-3 border-b border-[#EAE8E4]">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#EFEEEA] shrink-0 border border-[#EAE8E4]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-[#865225] tracking-wider uppercase">
              {product.region} • {product.altitude}
            </span>
            <h3 className="font-serif text-[17px] font-bold text-[#2B1810] truncate leading-snug">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-[16px] font-bold text-[#2B1810]">
                Rp {calculatedUnitPrice.toLocaleString('id-ID')}
              </span>
              <span className="text-[12px] text-[#817470]">/{selectedWeight}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedProductModal(null)}
            className="p-1.5 rounded-full bg-[#EFEEEA] text-[#817470] hover:text-[#2B1810] hover:bg-[#EAE8E4] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
          {/* Cupping Score & Flavor Profile Card */}
          <div className="bg-white p-3.5 rounded-xl border border-[#EAE8E4] shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#F5F3EF]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#865225] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#E08A44]" />
                Profil Rasa (Cupping Score {product.scores.cuppingScore || 86.5})
              </div>
              <span className="text-[11px] font-medium text-[#817470]">
                {product.roastDate}
              </span>
            </div>
            {/* Visual Bars */}
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#817470]">Keasaman</span>
                  <span className="font-semibold text-[#2B1810]">{product.scores.acidity}</span>
                </div>
                <div className="w-full h-1.5 bg-[#EFEEEA] rounded-full overflow-hidden">
                  <div className="h-full bg-[#E08A44] rounded-full w-[65%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#817470]">Ketebalan</span>
                  <span className="font-semibold text-[#2B1810]">{product.scores.body}</span>
                </div>
                <div className="w-full h-1.5 bg-[#EFEEEA] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2B1810] rounded-full w-[80%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#817470]">Manis</span>
                  <span className="font-semibold text-[#2B1810]">{product.scores.sweetness}</span>
                </div>
                <div className="w-full h-1.5 bg-[#EFEEEA] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D47A33] rounded-full w-[85%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[13px] font-bold text-[#2B1810]">
                Pilih Berat / Ukuran Kemasan
              </label>
              <span className="text-[11px] text-[#865225] font-medium">
                Zipper Bag + Valve Kedap Udara
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
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2B1810] text-white border-[#2B1810] shadow-sm'
                        : 'bg-white text-[#2B1810] border-[#EAE8E4] hover:bg-[#F5F3EF]'
                    }`}
                  >
                    <span className="text-[14px] font-bold">{w}</span>
                    <span
                      className={`text-[12px] mt-0.5 ${
                        isSelected ? 'text-[#FDB882]' : 'text-[#817470]'
                      }`}
                    >
                      Rp {price.toLocaleString('id-ID')}
                    </span>
                    <span
                      className={`mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-[#E08A44] text-white'
                          : 'bg-[#F5F3EF] text-[#865225]'
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
              <label className="text-[13px] font-bold text-[#2B1810]">
                Pilih Profil Gilingan (Grind Size)
              </label>
              <span className="text-[11px] font-semibold text-[#865225]">
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
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FDF6F0] border-[#E08A44] shadow-2xs ring-1 ring-[#E08A44]/30'
                        : 'bg-white border-[#EAE8E4] hover:bg-[#F5F3EF]'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-[#2B1810] text-[#FDB882]'
                          : 'bg-[#EFEEEA] text-[#817470]'
                      }`}
                    >
                      <Coffee className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[#2B1810]">
                          {g.title}
                        </span>
                        {g.recommended && (
                          <span className="text-[9px] font-bold bg-[#FDB882] text-[#2B1810] px-1.5 py-0.2 rounded-full">
                            Sangat Dianjurkan
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#817470] mt-0.5 truncate">
                        {g.description}
                      </p>
                    </div>
                    {/* Radio circle */}
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-[#2B1810] bg-[#2B1810]'
                          : 'border-[#D3C3BE]'
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
            <label className="text-[12px] font-semibold text-[#817470] block mb-1">
              Catatan Khusus untuk Roaster / Barista (Opsional)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Contoh: Sangrai medium-dark, giling Aeropress fine..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE8E4] bg-white text-[13px] text-[#2B1810] placeholder-[#817470] focus:outline-hidden focus:border-[#2B1810]"
            />
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="px-5 py-3.5 bg-white border-t border-[#EAE8E4] flex items-center gap-3">
          <div>
            <span className="text-[11px] text-[#817470] block leading-tight">
              Subtotal Pesanan
            </span>
            <span className="font-serif text-[18px] font-bold text-[#2B1810] leading-tight">
              Rp {subtotal.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Quantity Counter */}
          <div className="flex items-center bg-[#EFEEEA] rounded-xl px-2 py-1.5 ml-auto">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 rounded-lg hover:bg-white text-[#2B1810] transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-[13px] font-bold text-[#2B1810]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 rounded-lg hover:bg-white text-[#2B1810] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-1.5 bg-[#2B1810] hover:bg-[#1B1C1A] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] shadow-sm transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#FDB882]" />
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
};
