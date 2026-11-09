import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { RoastLevel } from '../../types';
import {
  Search,
  SlidersHorizontal,
  Flame,
  Globe,
  Coffee,
  Flower2,
  Snowflake,
  Heart,
  ShoppingBag,
  Award,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Star,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedRoast,
    setSelectedRoast,
    selectedCategory,
    setSelectedCategory,
    setSelectedProductModal,
    setShowGrindGuide,
    favorites,
    toggleFavorite,
    applyVoucher,
    showToast,
    setActiveTab,
    setShowFilterModal,
    filterCriteria,
    setFilterCriteria,
    resetFilter,
    products,
  } = useStore();

  const categories = [
    { id: 'Single Origin', label: 'Single Origin', icon: Globe },
    { id: 'Espresso', label: 'Espresso', icon: Coffee },
    { id: 'Filter Roast', label: 'Filter Roast', icon: Flower2 },
    { id: 'Cold Brew', label: 'Cold Brew', icon: Snowflake },
  ];

  const roastPills: RoastLevel[] = ['Semua', 'Light', 'Medium', 'Medium-Dark'];

  // Filter and sort products reactively
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchRegion = p.region.toLowerCase().includes(q);
        const matchNotes = p.flavorNotes.some((n) => n.toLowerCase().includes(q));
        if (!matchName && !matchRegion && !matchNotes) return false;
      }
      // 2. Category / Brew Method
      const activeCat = filterCriteria.category !== 'Semua' ? filterCriteria.category : selectedCategory;
      if (activeCat !== 'Semua') {
        if (p.brewMethods && !p.brewMethods.includes(activeCat)) return false;
        if (!p.brewMethods && activeCat === 'Single Origin' && p.process === 'House Blend') return false;
      }
      // 3. Roast Level
      const activeRoast = filterCriteria.roast !== 'Semua' ? filterCriteria.roast : selectedRoast;
      if (activeRoast !== 'Semua') {
        if (activeRoast === 'Light' && !p.roastLevel.includes('Light')) return false;
        if (activeRoast === 'Medium' && p.roastLevel !== 'Medium' && p.roastLevel !== 'Light-Med') return false;
        if (activeRoast === 'Medium-Dark' && p.roastLevel !== 'Medium-Dark') return false;
      }
      // 4. Process
      if (filterCriteria.process !== 'Semua' && p.process !== filterCriteria.process) {
        return false;
      }
      // 5. Price
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
  }, [searchQuery, selectedCategory, selectedRoast, filterCriteria]);

  const handleClaimPromo = () => {
    const res = applyVoucher('BEANS20');
    showToast(res.message);
  };

  const hasActiveFilters =
    selectedCategory !== 'Semua' ||
    selectedRoast !== 'Semua' ||
    filterCriteria.process !== 'Semua' ||
    filterCriteria.maxPrice > 0 ||
    searchQuery.trim().length > 0;

  return (
    <div className="pb-24 pt-3 space-y-5 px-4 bg-[#FAF7F2] min-h-full font-sans">
      {/* 1. Search Bar & Filter Drawer Trigger */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 min-h-[44px] flex items-center bg-white rounded-2xl px-4 py-2 border border-[#ECE4DA] shadow-[0_2px_8px_rgba(22,12,7,0.04)] focus-within:border-[#26160F] transition-colors rim-light">
          <Search className="w-4 h-4 text-[#75645C] mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari single origin, blend, sangrai..."
            className="w-full bg-transparent text-xs text-[#26160F] placeholder-[#75645C] focus:outline-hidden font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="w-7 h-7 flex items-center justify-center text-[#75645C] hover:text-[#26160F] text-sm font-bold cursor-pointer rounded-full hover:bg-[#F4EFE9]"
              aria-label="Hapus Pencarian"
            >
              ×
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          className={`w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-2xl border transition-all shrink-0 cursor-pointer active:scale-95 ${
            hasActiveFilters
              ? 'bg-[#26160F] text-[#FDB882] border-[#26160F] shadow-sm rim-light'
              : 'bg-white hover:bg-[#F4EFE9] border-[#ECE4DA] text-[#5C4D46] shadow-xs depth-card'
          }`}
          title="Filter & Urutkan Produk"
          aria-label="Buka Filter dan Pengurutan"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Active Filters Pill Bar */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[10.5px] font-bold text-[#75645C] uppercase tracking-wider mr-1">
            Filter:
          </span>
          {selectedCategory !== 'Semua' && (
            <span className="inline-flex items-center gap-1 bg-[#26160F] text-[#FDB882] px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold shadow-xs">
              {selectedCategory}
              <button
                onClick={() => {
                  setSelectedCategory('Semua');
                  setFilterCriteria((prev) => ({ ...prev, category: 'Semua' }));
                }}
                className="hover:text-white cursor-pointer ml-0.5"
              >
                ×
              </button>
            </span>
          )}
          {selectedRoast !== 'Semua' && (
            <span className="inline-flex items-center gap-1 bg-[#26160F] text-[#FDB882] px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold shadow-xs">
              Sangrai: {selectedRoast}
              <button
                onClick={() => {
                  setSelectedRoast('Semua');
                  setFilterCriteria((prev) => ({ ...prev, roast: 'Semua' }));
                }}
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
          {filterCriteria.maxPrice > 0 && (
            <span className="inline-flex items-center gap-1 bg-[#26160F] text-[#FDB882] px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold shadow-xs">
              Harga: &le; {filterCriteria.maxPrice.toLocaleString('id-ID')}
              <button
                onClick={() => setFilterCriteria((prev) => ({ ...prev, maxPrice: 0 }))}
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

      {/* 2. Hero Promo Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D1A12] via-[#24130C] to-[#1A0D07] text-white p-5 shadow-[0_8px_24px_rgba(22,12,7,0.25)] border border-[#382015] rim-light-dark">
        <div className="absolute right-0 top-0 bottom-0 w-[55%] opacity-40 mix-blend-screen pointer-events-none">
          <img
            src="/assets/c291c.png"
            alt="Artisan Roasting"
            className="w-full h-full object-cover object-left"
          />
        </div>

        <div className="relative z-10 max-w-[72%]">
          <div className="inline-flex items-center gap-1.5 bg-[#865225]/80 text-[#FDB882] text-[11px] font-bold px-3 py-1 rounded-full mb-2.5 border border-white/10 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#E08A44]" />
            PROMO ARTISAN
          </div>
          <h2 className="font-serif text-[24px] font-bold text-white tracking-tight leading-tight">
            Batch Sangrai Baru
          </h2>
          <p className="text-xs text-[#E0D5CE] mt-1.5 leading-relaxed line-clamp-2">
            Diskon 20% biji kopi sangrai segar pilihan roaster! Gunakan kupon BEANS20 di keranjang.
          </p>

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-[11px] font-semibold bg-black/50 text-[#E0D5CE] px-2.5 py-1.5 rounded-lg border border-white/10">
              Kupon BEANS20
            </span>
            <button
              onClick={handleClaimPromo}
              className="min-h-[44px] inline-flex items-center gap-1.5 bg-[#FDB882] hover:bg-[#E08A44] text-[#26160F] text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              Klaim Promo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Fresh Roast Guarantee Card */}
      <div className="flex items-center gap-3 bg-white border border-[#ECE4DA] rounded-2xl p-3.5 depth-card rim-light">
        <div className="p-2.5 bg-[#FAF7F2] rounded-xl text-[#865225] shrink-0 border border-[#ECE4DA]">
          <ShieldCheck className="w-5 h-5 text-[#C86826]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-[#26160F] truncate">
              Jaminan Sangrai Segar
            </h4>
            <span className="text-[10px] font-bold bg-[#F4EFE9] text-[#865225] px-2 py-0.5 rounded-md">
              MAKS. 7 HARI
            </span>
          </div>
          <p className="text-[11px] text-[#75645C] mt-0.5 truncate">
            Dikurasi dan disangrai tepat sebelum masa resting seduhan
          </p>
        </div>
      </div>

      {/* 4. Kategori Pilihan (Bebas Terpotong - Horizontal Chip Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-[#26160F]">
              Kategori Metode Seduh
            </h3>
            <p className="text-xs text-[#75645C]">
              Pilih karakter seduh favoritmu
            </p>
          </div>
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-xs font-bold text-[#865225] hover:underline cursor-pointer min-h-[44px] flex items-center"
          >
            Lihat Semua &gt;
          </button>
        </div>

        {/* Scrollable Category Chips with zero truncation */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = products.filter((p) => p.brewMethods?.includes(cat.id)).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  const next = isSelected ? 'Semua' : cat.id;
                  setSelectedCategory(next);
                  setFilterCriteria((prev) => ({ ...prev, category: next }));
                }}
                className={`shrink-0 min-h-[48px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-[#26160F] text-[#FDB882] border-[#26160F] shadow-sm rim-light'
                    : 'bg-white text-[#5C4D46] border-[#ECE4DA] hover:bg-[#FAF7F2] depth-card'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-white/10 text-[#FDB882]' : 'bg-[#FAF7F2] text-[#865225]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold whitespace-nowrap block leading-tight">
                    {cat.label}
                  </span>
                  <span
                    className={`text-[10px] ${
                      isSelected ? 'text-[#FDB882]/80' : 'text-[#75645C]'
                    }`}
                  >
                    {count} varian
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Filter Profil Sangrai (Pills) */}
      <div>
        <span className="text-[11px] font-bold text-[#75645C] tracking-wider uppercase block mb-2">
          Filter Profil Sangrai:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {roastPills.map((roast) => {
            const isSelected = selectedRoast === roast;
            return (
              <button
                key={roast}
                onClick={() => {
                  const next = isSelected && roast !== 'Semua' ? 'Semua' : roast;
                  setSelectedRoast(next);
                  setFilterCriteria((prev) => ({ ...prev, roast: next }));
                }}
                className={`shrink-0 min-h-[38px] px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#26160F] text-white shadow-xs'
                    : 'bg-white text-[#5C4D46] border border-[#ECE4DA] hover:bg-[#F4EFE9]'
                }`}
              >
                {roast === 'Semua' ? 'Semua Sangrai' : roast}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Grid Produk (Bebas Tabrakan Badge & Judul Utuh) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-[18px] font-bold text-[#26160F]">
              Koleksi Biji Kopi
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#C86826]" />
          </div>
          <span className="text-xs text-[#75645C] font-semibold">
            Menampilkan {filteredProducts.length} Varian
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#ECE4DA] text-center space-y-3 depth-card">
            <Coffee className="w-10 h-10 text-[#C86826] mx-auto opacity-70" />
            <h4 className="font-serif text-base font-bold text-[#26160F]">
              Tidak Ada Kopi yang Cocok
            </h4>
            <p className="text-xs text-[#75645C] max-w-xs mx-auto">
              Coba sesuaikan filter metode seduh atau profil sangrai Anda.
            </p>
            <button
              onClick={resetFilter}
              className="min-h-[44px] bg-[#26160F] text-[#FDB882] text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer hover:bg-[#382015] active:scale-95"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((p) => {
              const isFav = favorites.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProductModal(p)}
                  className="bg-white rounded-3xl depth-card depth-card-hover rim-light p-3 flex flex-col justify-between group cursor-pointer border border-[#ECE4DA]"
                >
                  {/* Image Box - ZERO COLLISION: Clean Single Status Pill on Top-Left & Favorite Heart on Top-Right */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF7F2] mb-2.5">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Clean Single Badge */}
                    <span className="absolute top-2 left-2 text-[9.5px] font-bold bg-[#26160F]/90 text-[#FDB882] px-2 py-0.5 rounded-md backdrop-blur-xs whitespace-nowrap shadow-xs">
                      {p.tag || p.process}
                    </span>
                    {/* Heart Button with generous touch hitbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(p.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 min-w-[32px] min-h-[32px] bg-white/95 backdrop-blur-xs rounded-full text-[#75645C] hover:text-red-500 flex items-center justify-center transition-colors shadow-xs active:scale-90"
                      aria-label="Simpan Favorit"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFav ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Info Area */}
                  <div className="flex-1 flex flex-col">
                    {/* Region & Star Rating Aligned (Zero Truncation) */}
                    <div className="flex items-center justify-between text-[10.5px] font-bold text-[#865225]">
                      <span className="truncate uppercase tracking-wider pr-1 font-semibold">{p.region}</span>
                      <span className="flex items-center gap-0.5 text-[#C86826] shrink-0 font-bold ml-auto text-[11px]">
                        <Star className="w-3 h-3 fill-[#C86826]" />
                        {p.rating}
                      </span>
                    </div>

                    {/* Product Name (Full 2 Lines, NO Truncation) */}
                    <h4 className="font-serif text-[15px] font-bold text-[#26160F] mt-1 line-clamp-2 min-h-[2.5rem] leading-snug">
                      {p.name}
                    </h4>

                    {/* Flavor Notes Preview */}
                    <p className="text-[11px] text-[#75645C] mt-0.5 line-clamp-1 leading-relaxed">
                      {p.flavorNotes.join(', ')}
                    </p>

                    {/* Roast, Process & Altitude Pills (whitespace-nowrap solid) */}
                    <div className="flex items-center gap-1 mt-1.5 mb-2.5 flex-wrap">
                      <span className="text-[9.5px] font-semibold bg-[#F4EFE9] text-[#865225] px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                        {p.roastLevel}
                      </span>
                      <span className="text-[9.5px] font-semibold bg-[#FAF7F2] border border-[#ECE4DA] text-[#5C4D46] px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                        {p.process}
                      </span>
                      {p.altitude && (
                        <span className="text-[9px] font-medium text-[#75645C] bg-white border border-[#ECE4DA] px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                          {p.altitude}
                        </span>
                      )}
                    </div>

                    {/* Price & Add Button */}
                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#F4EFE9]">
                      <div>
                        <span className="text-[10px] text-[#75645C] block leading-tight">
                          200 gram
                        </span>
                        <span className="font-serif text-[15px] font-bold text-[#26160F] leading-tight">
                          Rp {p.basePrice.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductModal(p);
                        }}
                        className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-[#26160F] hover:bg-[#C86826] text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                        title="Pilih Varian & Tambah"
                        aria-label="Pilih Varian dan Tambah ke Keranjang"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#FDB882]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Banner Edukasi Penggilingan */}
      <div className="bg-[#FAF7F2] rounded-3xl p-4 flex items-center justify-between gap-3 border border-[#ECE4DA] depth-card rim-light shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#26160F] text-[#FDB882] flex items-center justify-center shrink-0 shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#26160F]">
              Butuh Biji yang Digiling?
            </h4>
            <p className="text-[11px] text-[#75645C] mt-0.5">
              Pilih gilingan Kasar (Cold Brew), Sedang (V60), atau Halus (Espresso)
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowGrindGuide(true)}
          className="shrink-0 min-h-[44px] bg-white text-[#26160F] hover:bg-[#FAF7F2] text-xs font-bold px-4 py-2 rounded-xl border border-[#ECE4DA] shadow-xs transition-colors cursor-pointer active:scale-95 flex items-center justify-center"
        >
          Panduan
        </button>
      </div>

      {/* 8. Storytelling & Ethical Coffee Section */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECE4DA] shadow-xs depth-card rim-light">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#865225] uppercase tracking-wider mb-2">
          <Award className="w-4 h-4 text-[#C86826]" />
          Etis & Berkelanjutan
        </div>
        <h3 className="font-serif text-[18px] font-bold text-[#26160F] leading-snug">
          Dari Petani Lokal Langsung ke Cangkir Anda
        </h3>
        <p className="text-xs text-[#5C4D46] mt-2 leading-relaxed">
          Patawi Coffee bermitra langsung dengan lebih dari 40 keluarga petani kopi di Gayo, Toraja, Kintamani, dan Priangan. Tanpa perantara berlapis, memberikan harga panen yang adil untuk kesejahteraan mereka.
        </p>
        <button
          onClick={() => showToast('Membuka dokumentasi proses cupping & kemitraan petani Patawi')}
          className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold text-[#865225] mt-3 hover:text-[#26160F] transition-colors cursor-pointer"
        >
          Pelajari Proses Cupping Kami <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
