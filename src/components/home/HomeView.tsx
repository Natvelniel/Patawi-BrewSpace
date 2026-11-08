import React from 'react';
import { useStore } from '../../context/StoreContext';
import { COFFEE_PRODUCTS } from '../../data/coffeeProducts';
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
  } = useStore();

  const categories = [
    { id: 'Single Origin', label: 'Single Origin', icon: Globe },
    { id: 'Espresso', label: 'Espresso', icon: Coffee },
    { id: 'Filter Roast', label: 'Filter Roast', icon: Flower2 },
    { id: 'Cold Brew', label: 'Cold Brew', icon: Snowflake },
  ];

  const roastPills: RoastLevel[] = ['Semua', 'Light', 'Medium', 'Medium-Dark'];

  // Filter products
  const filteredProducts = COFFEE_PRODUCTS.filter((p) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchRegion = p.region.toLowerCase().includes(q);
      const matchNotes = p.flavorNotes.some((n) => n.toLowerCase().includes(q));
      if (!matchName && !matchRegion && !matchNotes) return false;
    }
    // Category
    if (selectedCategory !== 'Semua') {
      if (selectedCategory === 'Single Origin' && p.process === 'House Blend') return false;
      if (selectedCategory === 'Espresso' && p.process !== 'House Blend' && p.roastLevel !== 'Medium-Dark') return false;
      if (selectedCategory === 'Filter Roast' && (p.roastLevel === 'Medium-Dark' || p.process === 'House Blend')) return false;
    }
    // Roast
    if (selectedRoast !== 'Semua') {
      if (selectedRoast === 'Light' && !p.roastLevel.includes('Light')) return false;
      if (selectedRoast === 'Medium' && p.roastLevel !== 'Medium' && p.roastLevel !== 'Light-Med') return false;
      if (selectedRoast === 'Medium-Dark' && p.roastLevel !== 'Medium-Dark') return false;
    }
    return true;
  });

  const handleClaimPromo = () => {
    const res = applyVoucher('BEANS20');
    showToast(res.message);
  };

  return (
    <div className="pb-16 pt-3 space-y-5 px-4 bg-[#FAF7F2] min-h-full">
      {/* 1. Search Bar */}
      <div className="flex items-center gap-2.5">
        <div className="flex-1 flex items-center bg-white rounded-2xl px-4 py-2.5 border border-[#ECE4DA] shadow-xs focus-within:border-[#26160F] transition-colors rim-light">
          <Search className="w-4 h-4 text-[#75645C] mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari single origin, blend, sangrai..."
            className="w-full bg-transparent text-xs text-[#26160F] placeholder-[#75645C] focus:outline-hidden"
          />
        </div>
        <button
          onClick={() => {
            setSelectedRoast('Semua');
            setSelectedCategory('Semua');
            setSearchQuery('');
            showToast('Filter pencarian direset');
          }}
          className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#F4EFE9] rounded-2xl border border-[#ECE4DA] text-[#5C4D46] transition-colors shrink-0 shadow-xs cursor-pointer active:scale-95"
          title="Reset / Opsi Filter"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Hero Promo Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D1A12] via-[#24130C] to-[#1A0D07] text-white p-5 shadow-md">
        {/* Background Coffee Beans Image */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] opacity-40 mix-blend-screen pointer-events-none">
          <img
            src="/assets/c291c.png"
            alt="Artisan Roasting"
            className="w-full h-full object-cover object-left"
          />
        </div>

        <div className="relative z-10 max-w-[70%]">
          <div className="inline-flex items-center gap-1.5 bg-[#865225]/70 text-[#FDB882] text-[11px] font-bold px-3 py-1 rounded-full mb-2.5 border border-white/10">
            <Flame className="w-3.5 h-3.5 text-[#E08A44]" />
            CONTOH PROMO
          </div>
          <h2 className="font-serif text-[23px] font-bold text-white tracking-tight leading-tight">
            Profil Baru
          </h2>
          <p className="text-xs text-[#E0D5CE] mt-1.5 leading-relaxed line-clamp-2">
            Diskon 20% biji kopi sangrai segar pilihan artisan! Gunakan kode kupon di keranjang.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <span className="text-[11px] font-semibold bg-black/40 text-[#E0D5CE] px-2.5 py-1 rounded-lg border border-white/10">
              Beans Promo
            </span>
            <button
              onClick={handleClaimPromo}
              className="inline-flex items-center gap-1 bg-[#FDB882] hover:bg-[#E08A44] text-[#26160F] text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              Klaim Promo <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Fresh Roast Guarantee Card */}
      <div className="flex items-center gap-3 bg-white border border-[#ECE4DA] rounded-2xl p-3.5 shadow-2xs">
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

      {/* 4. Kategori Pilihan (Icon Buttons) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-serif text-[18px] font-bold text-[#26160F]">
              Kategori Pilihan
            </h3>
            <p className="text-xs text-[#75645C]">
              Pilih metode seduh & karakter favoritmu
            </p>
          </div>
          <button
            onClick={() => setActiveTab('catalog')}
            className="text-xs font-bold text-[#865225] hover:underline"
          >
            Semua &gt;
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'Semua' : cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-[#26160F] text-[#FDB882] border-[#26160F] shadow-sm'
                    : 'bg-white text-[#5C4D46] border-[#ECE4DA] hover:bg-[#F4EFE9]'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-[#FDB882]' : 'text-[#865225]'}`} />
                <span className="text-[11px] font-semibold truncate w-full">
                  {cat.label}
                </span>
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
                onClick={() => setSelectedRoast(roast)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
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

      {/* 6. Grid Produk */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-[18px] font-bold text-[#26160F]">
              Produk Pilihan
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#C86826]" />
          </div>
          <span className="text-xs text-[#75645C] font-medium">
            {filteredProducts.length} Varian Biji Kopi
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((p) => {
            const isFav = favorites.includes(p.id);
            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl depth-card depth-card-hover rim-light p-3 flex flex-col justify-between group cursor-pointer"
              >
                {/* Image Box */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF7F2] mb-2.5">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Process Tag */}
                  <span className="absolute top-2 left-2 text-[10px] font-bold bg-[#26160F]/80 text-[#FDB882] px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {p.process}
                  </span>
                  {/* Heart / Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(p.id)}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-xs rounded-full text-[#75645C] hover:text-red-500 flex items-center justify-center transition-colors shadow-xs active:scale-90"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFav ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#865225]">
                    <span className="truncate">{p.region}</span>
                    <span className="text-[#75645C] font-semibold shrink-0">{p.roastLevel}</span>
                  </div>
                  <h4 className="font-serif text-[15px] font-bold text-[#26160F] mt-0.5 line-clamp-1 leading-snug">
                    {p.name}
                  </h4>

                  {/* Flavor chips */}
                  <div className="flex flex-wrap gap-1 mt-1.5 mb-3">
                    {p.flavorNotes.slice(0, 3).map((n, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-[#F4EFE9] text-[#5C4D46] px-1.5 py-0.5 rounded-md"
                      >
                        {n}
                      </span>
                    ))}
                  </div>

                  {/* Price & Add Button */}
                  <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#F4EFE9]">
                    <div>
                      <span className="text-[10px] text-[#75645C] block leading-tight">
                        200 gram
                      </span>
                      <span className="font-serif text-[14px] font-bold text-[#26160F] leading-tight">
                        Rp {p.basePrice.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedProductModal(p)}
                      className="w-8 h-8 rounded-xl bg-[#26160F] hover:bg-[#C86826] text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                      title="Pilih Varian & Tambah"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#FDB882]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Banner Edukasi Penggilingan */}
      <div className="bg-[#EFE8E0] rounded-3xl p-4 flex items-center justify-between gap-3 border border-[#E2D7CC] shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#26160F] text-[#FDB882] flex items-center justify-center shrink-0 shadow-xs">
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
          className="shrink-0 bg-white text-[#26160F] hover:bg-[#FAF7F2] text-xs font-bold px-3.5 py-1.5 rounded-xl border border-[#D9CEC5] shadow-xs transition-colors cursor-pointer active:scale-95"
        >
          Panduan
        </button>
      </div>

      {/* 8. Storytelling & Ethical Coffee Section */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECE4DA] shadow-2xs">
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
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#865225] mt-3 hover:text-[#26160F] transition-colors"
        >
          Pelajari Proses Cupping Kami <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
