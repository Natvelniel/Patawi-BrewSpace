import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { COFFEE_PRODUCTS } from '../../data/coffeeProducts';
import { Search, Plus, Star, SlidersHorizontal, Heart, Coffee } from 'lucide-react';

export const CatalogView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedOrigin,
    setSelectedOrigin,
    setSelectedProductModal,
    favorites,
    toggleFavorite,
    setShowFilterModal,
    filterCriteria,
    setFilterCriteria,
    resetFilter,
  } = useStore();

  const origins = [
    'Semua Asal',
    'Aceh Gayo',
    'Toraja Sapan',
    'Bali Kintamani',
    'Flores Bajawa',
  ];

  const filtered = useMemo(() => {
    const list = COFFEE_PRODUCTS.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.flavorNotes.some((n) => n.toLowerCase().includes(q));
        if (!match) return false;
      }

      // 2. Origin Chips
      if (selectedOrigin !== 'Semua Asal') {
        if (selectedOrigin === 'Aceh Gayo' && !p.name.includes('Aceh')) return false;
        if (selectedOrigin === 'Toraja Sapan' && !p.name.includes('Toraja')) return false;
        if (selectedOrigin === 'Bali Kintamani' && !p.name.includes('Bali')) return false;
        if (selectedOrigin === 'Flores Bajawa' && !p.name.includes('Flores')) return false;
      }

      // 3. Category / Brew Method
      if (filterCriteria.category !== 'Semua') {
        if (p.brewMethods && !p.brewMethods.includes(filterCriteria.category)) return false;
        if (!p.brewMethods && filterCriteria.category === 'Single Origin' && p.process === 'House Blend') return false;
      }

      // 4. Roast Level
      if (filterCriteria.roast !== 'Semua') {
        if (filterCriteria.roast === 'Light' && !p.roastLevel.includes('Light')) return false;
        if (filterCriteria.roast === 'Medium' && p.roastLevel !== 'Medium' && p.roastLevel !== 'Light-Med') return false;
        if (filterCriteria.roast === 'Medium-Dark' && p.roastLevel !== 'Medium-Dark') return false;
      }

      // 5. Process
      if (filterCriteria.process !== 'Semua' && p.process !== filterCriteria.process) {
        return false;
      }

      // 6. Price
      if (filterCriteria.maxPrice > 0) {
        if (filterCriteria.maxPrice === 85000 && p.basePrice > 85000) return false;
        if (filterCriteria.maxPrice === 100000 && (p.basePrice < 85000 || p.basePrice > 100000)) return false;
        if (filterCriteria.maxPrice === 999999 && p.basePrice <= 100000) return false;
      }

      return true;
    });

    // Sorting
    if (filterCriteria.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filterCriteria.sortBy === 'price-asc') {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (filterCriteria.sortBy === 'price-desc') {
      list.sort((a, b) => b.basePrice - a.basePrice);
    } else if (filterCriteria.sortBy === 'cupping') {
      list.sort((a, b) => (b.scores.cuppingScore || 0) - (a.scores.cuppingScore || 0));
    }

    return list;
  }, [searchQuery, selectedOrigin, filterCriteria]);

  const hasActiveFilters =
    selectedOrigin !== 'Semua Asal' ||
    filterCriteria.category !== 'Semua' ||
    filterCriteria.roast !== 'Semua' ||
    filterCriteria.process !== 'Semua' ||
    filterCriteria.maxPrice > 0 ||
    searchQuery.trim().length > 0;

  return (
    <div className="pb-16 pt-3 space-y-4 px-4 bg-[#FAF7F2] min-h-full">
      {/* Search Bar & Filter Drawer Trigger */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 flex items-center bg-white rounded-2xl px-4 py-2.5 border border-[#ECE4DA] shadow-xs focus-within:border-[#26160F] transition-colors rim-light">
          <Search className="w-4 h-4 text-[#75645C] mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari varietas, daerah asal, atau rasa..."
            className="w-full bg-transparent text-xs text-[#26160F] placeholder-[#75645C] focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#75645C] hover:text-[#26160F] text-xs font-bold cursor-pointer"
            >
              ×
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          className={`w-10 h-10 flex items-center justify-center rounded-2xl border transition-all shrink-0 shadow-xs cursor-pointer active:scale-95 ${
            hasActiveFilters
              ? 'bg-[#26160F] text-[#FDB882] border-[#26160F]'
              : 'bg-white hover:bg-[#F4EFE9] border-[#ECE4DA] text-[#5C4D46]'
          }`}
          title="Filter & Urutkan Katalog"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Active Filter Chips Strip */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[10.5px] font-bold text-[#75645C] uppercase tracking-wider mr-1">
            Filter:
          </span>
          {selectedOrigin !== 'Semua Asal' && (
            <span className="inline-flex items-center gap-1 bg-[#26160F] text-[#FDB882] px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold shadow-xs">
              Asal: {selectedOrigin}
              <button
                onClick={() => setSelectedOrigin('Semua Asal')}
                className="hover:text-white cursor-pointer ml-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filterCriteria.category !== 'Semua' && (
            <span className="inline-flex items-center gap-1 bg-[#26160F] text-[#FDB882] px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold shadow-xs">
              Seduh: {filterCriteria.category}
              <button
                onClick={() => setFilterCriteria((prev) => ({ ...prev, category: 'Semua' }))}
                className="hover:text-white cursor-pointer ml-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filterCriteria.roast !== 'Semua' && (
            <span className="inline-flex items-center gap-1 bg-[#26160F] text-[#FDB882] px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold shadow-xs">
              Sangrai: {filterCriteria.roast}
              <button
                onClick={() => setFilterCriteria((prev) => ({ ...prev, roast: 'Semua' }))}
                className="hover:text-white cursor-pointer ml-0.5"
              >
                ×
              </button>
            </span>
          )}
          {filterCriteria.process !== 'Semua' && (
            <span className="inline-flex items-center gap-1 bg-[#26160F] text-[#FDB882] px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold shadow-xs">
              Proses: {filterCriteria.process}
              <button
                onClick={() => setFilterCriteria((prev) => ({ ...prev, process: 'Semua' }))}
                className="hover:text-white cursor-pointer ml-0.5"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={resetFilter}
            className="text-[10.5px] text-[#C86826] hover:underline font-bold ml-auto cursor-pointer"
          >
            Reset Semua
          </button>
        </div>
      )}

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

      {/* Status Info Row */}
      <div className="flex items-center justify-between text-xs pt-0.5">
        <span className="font-semibold text-[#5C4D46]">
          Menampilkan <strong className="text-[#26160F] font-bold">{filtered.length} Varian</strong> Biji Kopi
        </span>
        <div className="flex items-center gap-1.5 text-[#865225] font-bold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#865225]" />
          FRESH ROAST GUARANTEED
        </div>
      </div>

      {/* Catalog Grid (ZERO COLLISION: Clean Single Status Badge + Rating Below Image + Full 2-line Title) */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#ECE4DA] text-center space-y-3">
          <Coffee className="w-10 h-10 text-[#C86826] mx-auto opacity-70" />
          <h4 className="font-serif text-base font-bold text-[#26160F]">
            Tidak Menemukan Biji Kopi
          </h4>
          <p className="text-xs text-[#75645C] max-w-xs mx-auto">
            Tidak ada produk yang cocok dengan kombinasi filter saat ini.
          </p>
          <button
            onClick={resetFilter}
            className="bg-[#26160F] text-[#FDB882] text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pt-1">
          {filtered.map((p) => {
            const isFav = favorites.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => setSelectedProductModal(p)}
                className="bg-white rounded-3xl depth-card depth-card-hover rim-light p-3 flex flex-col justify-between cursor-pointer group"
              >
                {/* Image Box - ZERO COLLISION: Clean Single Status Pill on Top-Left & Favorite Heart on Top-Right */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF7F2] mb-2.5">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Clean Single Status Badge on Top-Left */}
                  <span className="absolute top-2 left-2 text-[9.5px] font-bold bg-[#26160F]/85 text-[#FDB882] px-2 py-0.5 rounded-md backdrop-blur-xs whitespace-nowrap shadow-xs">
                    {p.tag || p.process}
                  </span>

                  {/* Heart / Favorite Button on Top-Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(p.id);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/95 backdrop-blur-xs rounded-full text-[#75645C] hover:text-red-500 flex items-center justify-center transition-colors shadow-xs active:scale-90"
                    aria-label="Simpan Favorit"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFav ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Product Meta */}
                <div className="flex-1 flex flex-col">
                  {/* Region & Star Rating Moved Here for Clean Separation (NO COLLISION) */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#865225]">
                    <span className="truncate uppercase tracking-wider">{p.region}</span>
                    <span className="flex items-center gap-0.5 text-[#C86826] shrink-0 font-bold">
                      <Star className="w-3 h-3 fill-[#C86826]" />
                      {p.rating}
                    </span>
                  </div>

                  {/* Full 2-line Title (No ellipsis cut-off) */}
                  <h4 className="font-serif text-[15px] font-bold text-[#26160F] mt-1 line-clamp-2 min-h-[2.5rem] leading-snug">
                    {p.name}
                  </h4>

                  {/* Flavor Notes Preview */}
                  <p className="text-[11px] text-[#75645C] mt-0.5 truncate">
                    {p.flavorNotes.join(', ')}
                  </p>

                  {/* Roast Level & Process Pills (whitespace-nowrap solid) */}
                  <div className="flex items-center gap-1.5 mt-2 mb-3 flex-wrap">
                    <span className="text-[10px] font-semibold bg-[#F4EFE9] text-[#865225] px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                      {p.roastLevel}
                    </span>
                    <span className="text-[10px] font-semibold bg-[#FAF7F2] border border-[#ECE4DA] text-[#5C4D46] px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
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
            );
          })}
        </div>
      )}
    </div>
  );
};
