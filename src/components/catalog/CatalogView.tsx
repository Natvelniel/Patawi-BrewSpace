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
    <div className="pb-28 pt-2 space-y-4 px-4 bg-[#FBF9F5] min-h-screen">
      {/* Search Bar */}
      <div className="flex items-center bg-[#F5F3EF] rounded-xl px-3.5 py-2.5 border border-[#EAE8E4] shadow-xs">
        <Search className="w-4 h-4 text-[#817470] mr-2 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari varietas, daerah asal, atau profil rasa..."
          className="w-full bg-transparent text-[13px] text-[#2B1810] placeholder-[#817470] focus:outline-hidden"
        />
      </div>

      {/* Status Info Row */}
      <div className="flex items-center justify-between text-[11px] pt-1">
        <span className="font-semibold text-[#4F4440]">
          Menampilkan <strong className="text-[#2B1810]">{filtered.length} Varian</strong> Biji Kopi Sangrai
        </span>
        <div className="flex items-center gap-1.5 text-[#865225] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#865225]" />
          FRESH BATCH 3 HARI LALU
        </div>
      </div>

      {/* Horizontal Origin Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {origins.map((origin) => {
          const isSelected = selectedOrigin === origin;
          return (
            <button
              key={origin}
              onClick={() => setSelectedOrigin(origin)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2B1810] text-white shadow-xs'
                  : 'bg-[#EFEEEA] text-[#4F4440] hover:bg-[#EAE8E4]'
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
          className="shrink-0 flex items-center gap-1.5 bg-white text-[#4F4440] px-3 py-1 rounded-lg border border-[#EAE8E4] text-[11px] font-semibold"
        >
          <Sparkles className="w-3 h-3 text-[#E08A44]" />
          ROAST: SEMUA
        </button>
        <button
          onClick={() => showToast('Filter proses: Natural & Washed')}
          className="shrink-0 flex items-center gap-1.5 bg-white text-[#4F4440] px-3 py-1 rounded-lg border border-[#EAE8E4] text-[11px] font-semibold"
        >
          <Filter className="w-3 h-3 text-[#865225]" />
          PROSES: NATURAL & WASHED
        </button>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProductModal(p)}
            className="bg-white rounded-2xl border border-[#EAE8E4] p-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all cursor-pointer group"
          >
            {/* Image & Badges */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#EFEEEA] mb-2.5">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Badge top-left */}
              <span className="absolute top-2 left-2 text-[10px] font-bold bg-[#2B1810]/80 text-[#FDB882] px-2 py-0.5 rounded-md backdrop-blur-xs">
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
              <span className="text-[10px] font-bold text-[#865225] uppercase tracking-wider">
                {p.region} • {p.altitude}
              </span>
              <h4 className="font-serif text-[15px] font-bold text-[#2B1810] mt-0.5 line-clamp-1">
                {p.name}
              </h4>
              <p className="text-[11px] text-[#817470] mt-0.5 truncate">
                {p.flavorNotes.join(', ')}
              </p>

              {/* Pills */}
              <div className="flex items-center gap-1 mt-2 mb-3">
                <span className="text-[9px] font-semibold bg-[#F5F3EF] text-[#865225] px-1.5 py-0.5 rounded">
                  {p.roastLevel}
                </span>
                <span className="text-[9px] font-semibold bg-[#F5F3EF] text-[#4F4440] px-1.5 py-0.5 rounded">
                  {p.process}
                </span>
              </div>

              {/* Price & Add Icon */}
              <div className="mt-auto flex items-center justify-between pt-1 border-t border-[#F5F3EF]">
                <div>
                  <span className="text-[10px] text-[#817470] block leading-tight">
                    Mulai dari
                  </span>
                  <span className="font-serif text-[14px] font-bold text-[#2B1810] leading-tight">
                    Rp {p.basePrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-[#2B1810] text-[#FDB882] flex items-center justify-center group-hover:bg-[#E08A44] group-hover:text-white transition-colors shadow-2xs">
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
