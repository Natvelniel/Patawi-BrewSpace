import React from 'react';
import { useStore } from '../../context/StoreContext';
import { COFFEE_PRODUCTS } from '../../data/coffeeProducts';
import { Search, Plus, Star, Sparkles, Filter } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedOrigin,
    setSelectedOrigin,
    setSelectedProductModal,
    showToast,
  } = useStore();

  const origins = [
    'Semua Asal',
    'Aceh Gayo',
    'Toraja Sapan',
    'Bali Kintamani',
    'Flores Bajawa',
  ];

  const filtered = COFFEE_PRODUCTS.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.flavorNotes.some((n) => n.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (selectedOrigin !== 'Semua Asal') {
      if (selectedOrigin === 'Aceh Gayo' && !p.name.includes('Aceh')) return false;
      if (selectedOrigin === 'Toraja Sapan' && !p.name.includes('Toraja')) return false;
      if (selectedOrigin === 'Bali Kintamani' && !p.name.includes('Bali')) return false;
      if (selectedOrigin === 'Flores Bajawa' && !p.name.includes('Flores')) return false;
    }

    return true;
  });

  return (
    <div className="pb-16 pt-3 space-y-4 px-4 bg-[#FAF7F2] min-h-full">
      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-2xl px-4 py-2.5 border border-[#ECE4DA] shadow-xs focus-within:border-[#26160F] transition-colors">
        <Search className="w-4 h-4 text-[#75645C] mr-2.5 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari varietas, daerah asal, atau profil rasa..."
          className="w-full bg-transparent text-xs text-[#26160F] placeholder-[#75645C] focus:outline-hidden"
        />
      </div>

      {/* Status Info Row */}
      <div className="flex items-center justify-between text-xs pt-0.5">
        <span className="font-medium text-[#5C4D46]">
          Menampilkan <strong className="text-[#26160F] font-bold">{filtered.length} Varian</strong> Biji Kopi Sangrai
        </span>
        <div className="flex items-center gap-1.5 text-[#865225] font-bold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#865225]" />
          FRESH BATCH 3 HARI LALU
        </div>
      </div>

      {/* Horizontal Origin Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {origins.map((origin) => {
          const isSelected = selectedOrigin === origin;
          return (
            <button
              key={origin}
              onClick={() => setSelectedOrigin(origin)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-[#26160F] text-white shadow-xs'
                  : 'bg-white text-[#5C4D46] border border-[#ECE4DA] hover:bg-[#F4EFE9]'
              }`}
            >
              {origin}
            </button>
          );
        })}
      </div>

      {/* Quick Tag Selectors */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => showToast('Menampilkan seluruh profil sangrai')}
          className="shrink-0 flex items-center gap-1.5 bg-white text-[#5C4D46] px-3 py-1.5 rounded-xl border border-[#ECE4DA] text-[11px] font-semibold hover:bg-[#F4EFE9] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C86826]" />
          ROAST: SEMUA
        </button>
        <button
          onClick={() => showToast('Filter proses: Natural & Washed')}
          className="shrink-0 flex items-center gap-1.5 bg-white text-[#5C4D46] px-3 py-1.5 rounded-xl border border-[#ECE4DA] text-[11px] font-semibold hover:bg-[#F4EFE9] transition-colors"
        >
          <Filter className="w-3.5 h-3.5 text-[#865225]" />
          PROSES: NATURAL & WASHED
        </button>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProductModal(p)}
            className="bg-white rounded-3xl depth-card depth-card-hover rim-light p-3 flex flex-col justify-between cursor-pointer group"
          >
            {/* Image & Badges */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF7F2] mb-2.5">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Badge top-left */}
              <span className="absolute top-2 left-2 text-[10px] font-bold bg-[#26160F]/80 text-[#FDB882] px-2 py-0.5 rounded-md backdrop-blur-xs">
                {p.tag || p.process}
              </span>
              {/* Rating badge top-right */}
              <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold bg-[#E89B58] text-white px-2 py-0.5 rounded-md shadow-xs">
                <Star className="w-3 h-3 fill-white" />
                {p.rating}
              </span>
            </div>

            {/* Product Meta */}
            <div className="flex-1 flex flex-col">
              <span className="text-[11px] font-bold text-[#865225] uppercase tracking-wider">
                {p.region} • {p.altitude}
              </span>
              <h4 className="font-serif text-[15px] font-bold text-[#26160F] mt-0.5 line-clamp-1 leading-snug">
                {p.name}
              </h4>
              <p className="text-[11px] text-[#75645C] mt-0.5 truncate">
                {p.flavorNotes.join(', ')}
              </p>

              {/* Pills */}
              <div className="flex items-center gap-1.5 mt-2 mb-3">
                <span className="text-[10px] font-semibold bg-[#F4EFE9] text-[#865225] px-2 py-0.5 rounded-md">
                  {p.roastLevel}
                </span>
                <span className="text-[10px] font-semibold bg-[#F4EFE9] text-[#5C4D46] px-2 py-0.5 rounded-md">
                  {p.process}
                </span>
              </div>

              {/* Price & Add Icon */}
              <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#F4EFE9]">
                <div>
                  <span className="text-[10px] text-[#75645C] block leading-tight">
                    Mulai dari
                  </span>
                  <span className="font-serif text-[14px] font-bold text-[#26160F] leading-tight">
                    Rp {p.basePrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#26160F] text-[#FDB882] flex items-center justify-center group-hover:bg-[#C86826] group-hover:text-white transition-colors shadow-xs active:scale-95">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
