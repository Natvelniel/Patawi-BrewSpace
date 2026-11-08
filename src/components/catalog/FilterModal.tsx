import React from 'react';
import { useStore } from '../../context/StoreContext';
import { COFFEE_PRODUCTS } from '../../data/coffeeProducts';
import { RoastLevel } from '../../types';
import { X, RotateCcw, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const FilterModal: React.FC = () => {
  const {
    showFilterModal,
    setShowFilterModal,
    filterCriteria,
    setFilterCriteria,
    resetFilter,
    showToast,
  } = useStore();

  if (!showFilterModal) return null;

  const categories = ['Semua', 'Single Origin', 'Espresso', 'Filter Roast', 'Cold Brew'];
  const roastLevels: RoastLevel[] = ['Semua', 'Light', 'Medium', 'Medium-Dark'];
  const processes = ['Semua', 'Anaerobic', 'Washed', 'Anaerobic Honey', 'House Blend'];
  const priceRanges = [
    { label: 'Semua Harga', max: 0 },
    { label: '< Rp 85.000 (Terjangkau)', max: 85000 },
    { label: 'Rp 85.000 - Rp 100.000', max: 100000 },
    { label: '> Rp 100.000 (Specialty Reserve)', max: 999999 },
  ];
  const sortOptions = [
    { id: 'featured', label: 'Paling Sesuai / Rekomendasi' },
    { id: 'rating', label: 'Rating Tertinggi (★ 5.0 → 4.0)' },
    { id: 'cupping', label: 'Cupping Score Tertinggi' },
    { id: 'price-asc', label: 'Harga Terendah (Termurah)' },
    { id: 'price-desc', label: 'Harga Tertinggi' },
  ] as const;

  // Calculate live matching product count
  const matchingCount = COFFEE_PRODUCTS.filter((p) => {
    if (filterCriteria.category !== 'Semua') {
      if (p.brewMethods && !p.brewMethods.includes(filterCriteria.category)) return false;
      if (!p.brewMethods && filterCriteria.category === 'Single Origin' && p.process === 'House Blend') return false;
    }
    if (filterCriteria.roast !== 'Semua') {
      if (filterCriteria.roast === 'Light' && !p.roastLevel.includes('Light')) return false;
      if (filterCriteria.roast === 'Medium' && p.roastLevel !== 'Medium' && p.roastLevel !== 'Light-Med') return false;
      if (filterCriteria.roast === 'Medium-Dark' && p.roastLevel !== 'Medium-Dark') return false;
    }
    if (filterCriteria.process !== 'Semua' && p.process !== filterCriteria.process) {
      return false;
    }
    if (filterCriteria.maxPrice > 0) {
      if (filterCriteria.maxPrice === 85000 && p.basePrice > 85000) return false;
      if (filterCriteria.maxPrice === 100000 && (p.basePrice < 85000 || p.basePrice > 100000)) return false;
      if (filterCriteria.maxPrice === 999999 && p.basePrice <= 100000) return false;
    }
    return true;
  }).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in select-none p-0 md:p-4">
      <div
        className="w-full max-w-[420px] bg-[#FAF7F2] rounded-t-[32px] md:rounded-[32px] max-h-[92vh] flex flex-col shadow-2xl border border-[#ECE4DA] overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle for Mobile */}
        <div className="pt-3 pb-1 flex justify-center md:hidden">
          <div className="w-12 h-1 bg-[#D9CEC5] rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#ECE4DA] bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#C86826]" />
            <h3 className="font-serif text-[17px] font-bold text-[#26160F]">
              Filter & Urutkan
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetFilter}
              className="text-xs text-[#75645C] hover:text-[#26160F] flex items-center gap-1 font-semibold cursor-pointer px-2 py-1 rounded-lg hover:bg-[#EFE8E0] transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="w-8 h-8 rounded-full bg-[#EFE8E0] text-[#75645C] hover:text-[#26160F] hover:bg-[#E5DCD2] flex items-center justify-center transition-colors cursor-pointer active:scale-95"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Filters */}
        <div className="p-6 overflow-y-auto space-y-5 no-scrollbar text-xs">
          {/* 1. Metode Seduh */}
          <div>
            <label className="font-bold text-[#26160F] block mb-2 text-xs">
              Metode Seduh & Karakter
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => {
                const isSelected = filterCriteria.category === c;
                return (
                  <button
                    key={c}
                    onClick={() => setFilterCriteria((prev) => ({ ...prev, category: c }))}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#26160F] text-[#FDB882] shadow-xs'
                        : 'bg-white text-[#5C4D46] border border-[#ECE4DA] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Profil Sangrai */}
          <div>
            <label className="font-bold text-[#26160F] block mb-2 text-xs">
              Profil Sangrai (Roast Level)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {roastLevels.map((r) => {
                const isSelected = filterCriteria.roast === r;
                return (
                  <button
                    key={r}
                    onClick={() => setFilterCriteria((prev) => ({ ...prev, roast: r }))}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#26160F] text-[#FDB882] shadow-xs'
                        : 'bg-white text-[#5C4D46] border border-[#ECE4DA] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Proses Pascapanen */}
          <div>
            <label className="font-bold text-[#26160F] block mb-2 text-xs">
              Proses Kopi (Processing Method)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {processes.map((p) => {
                const isSelected = filterCriteria.process === p;
                return (
                  <button
                    key={p}
                    onClick={() => setFilterCriteria((prev) => ({ ...prev, process: p }))}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#26160F] text-[#FDB882] shadow-xs'
                        : 'bg-white text-[#5C4D46] border border-[#ECE4DA] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Rentang Harga */}
          <div>
            <label className="font-bold text-[#26160F] block mb-2 text-xs">
              Rentang Harga (Kemasan 200g)
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {priceRanges.map((pr) => {
                const isSelected = filterCriteria.maxPrice === pr.max;
                return (
                  <button
                    key={pr.label}
                    onClick={() => setFilterCriteria((prev) => ({ ...prev, maxPrice: pr.max }))}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#26160F] text-white border-[#26160F]'
                        : 'bg-white text-[#5C4D46] border-[#ECE4DA] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{pr.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#FDB882]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Urutkan (Sorting) */}
          <div>
            <label className="font-bold text-[#26160F] flex items-center gap-1.5 mb-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C86826]" /> Urutkan Berdasarkan
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {sortOptions.map((s) => {
                const isSelected = filterCriteria.sortBy === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setFilterCriteria((prev) => ({ ...prev, sortBy: s.id }))}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#26160F] text-white border-[#26160F]'
                        : 'bg-white text-[#5C4D46] border-[#ECE4DA] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{s.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#FDB882]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Apply Footer */}
        <div className="p-4 bg-white border-t border-[#ECE4DA] flex items-center gap-3">
          <button
            onClick={() => {
              setShowFilterModal(false);
              showToast(`Filter diterapkan: ${matchingCount} biji kopi ditemukan`);
            }}
            className="w-full bg-[#26160F] hover:bg-[#3E2419] active:scale-[0.98] text-white py-3 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Tampilkan {matchingCount} Biji Kopi
          </button>
        </div>
      </div>
    </div>
  );
};
