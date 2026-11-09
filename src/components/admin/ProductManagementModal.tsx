import React, { useState } from 'react';
import { CoffeeProduct, ProcessType } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Coffee, Save, Trash2 } from 'lucide-react';

interface ProductManagementModalProps {
  productToEdit?: CoffeeProduct | null;
  onClose: () => void;
}

export const ProductManagementModal: React.FC<ProductManagementModalProps> = ({
  productToEdit,
  onClose,
}) => {
  const { addProduct, updateProduct, deleteProduct, showToast } = useStore();

  const isEdit = !!productToEdit;

  const [name, setName] = useState(productToEdit?.name || '');
  const [region, setRegion] = useState(productToEdit?.region || 'ACEH TENGAH');
  const [altitude, setAltitude] = useState(productToEdit?.altitude || '1.500 MDPL');
  const [roastLevel, setRoastLevel] = useState<CoffeeProduct['roastLevel']>(
    productToEdit?.roastLevel || 'Medium'
  );
  const [process, setProcess] = useState<ProcessType>(
    productToEdit?.process || 'Washed'
  );
  const [flavorNotesStr, setFlavorNotesStr] = useState(
    productToEdit?.flavorNotes.join(', ') || 'Chocolate, Brown Sugar, Citrus'
  );
  const [cuppingScore, setCuppingScore] = useState(
    productToEdit?.scores.cuppingScore?.toString() || '86.5'
  );
  const [acidity, setAcidity] = useState(productToEdit?.scores.acidity || 'Medium');
  const [body, setBody] = useState(productToEdit?.scores.body || 'Bold');
  const [sweetness, setSweetness] = useState(productToEdit?.scores.sweetness || 'Tinggi');
  const [basePrice, setBasePrice] = useState(productToEdit?.basePrice.toString() || '95000');
  const [stock, setStock] = useState(productToEdit?.stock.toString() || '20');
  const [tag, setTag] = useState(productToEdit?.tag || 'Fresh Roast');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Nama produk wajib diisi.');
      return;
    }

    const priceNum = parseInt(basePrice.replace(/\D/g, ''), 10) || 85000;
    const stockNum = parseFloat(stock) || 10;
    const notesArray = flavorNotesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const productPayload: Omit<CoffeeProduct, 'id'> = {
      name: name.trim(),
      region: region.trim().toUpperCase(),
      altitude: altitude.trim(),
      roastLevel,
      process,
      flavorNotes: notesArray.length ? notesArray : ['Specialty Grade', 'Floral'],
      scores: {
        acidity,
        body,
        sweetness,
        cuppingScore: parseFloat(cuppingScore) || 85,
      },
      roastDate: 'Sangrai: Baru Hari Ini',
      basePrice: priceNum,
      stock: stockNum,
      rating: productToEdit?.rating || 4.9,
      image: productToEdit?.image || '/assets/da276.png',
      tag: tag.trim() || undefined,
      brewMethods: ['Single Origin', 'Filter Roast', 'Espresso'],
    };

    if (isEdit && productToEdit) {
      updateProduct(productToEdit.id, productPayload);
      showToast(`Biji kopi "${name}" berhasil diperbarui.`);
    } else {
      addProduct(productPayload);
      showToast(`Biji kopi "${name}" berhasil ditambahkan ke katalog.`);
    }
    onClose();
  };

  const handleDelete = () => {
    if (productToEdit && window.confirm(`Hapus produk "${productToEdit.name}" dari katalog?`)) {
      deleteProduct(productToEdit.id);
      showToast(`Produk "${productToEdit.name}" telah dihapus.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in select-none">
      <div className="depth-card rim-light bg-white rounded-3xl max-w-[500px] w-full p-5 sm:p-6 shadow-2xl border border-[#ECE4DA] max-h-[92vh] overflow-y-auto no-scrollbar relative animate-in zoom-in-95 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#ECE4DA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#26160F] text-[#FDB882] flex items-center justify-center shadow-xs shrink-0 border border-[#382015]">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-[19px] font-bold text-[#26160F]">
                {isEdit ? 'Edit Biji Kopi & Harga' : 'Tambah Biji Kopi Baru'}
              </h3>
              <p className="text-[11px] text-[#75645C]">
                Patawi Roastery Senopati Station Admin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-[#EFE8E0] text-[#75645C] hover:text-[#26160F] flex items-center justify-center transition-colors cursor-pointer border border-[#ECE4DA]"
            title="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs text-[#26160F]">
          {/* Product Name */}
          <div>
            <label className="text-[11px] font-bold text-[#75645C] block mb-1">
              Nama Varietas & Origin Biji Kopi *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Flores Bajawa Honey Process"
              required
              className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-3.5 py-2.5 text-xs text-[#26160F] focus:outline-hidden focus:border-[#C86826] min-h-[44px]"
            />
          </div>

          {/* Region & Altitude */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-[#75645C] block mb-1">
                Asal Daerah (Region)
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Contoh: NUSA TENGGARA TIMUR"
                className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-3 py-2.5 text-xs text-[#26160F] focus:outline-hidden focus:border-[#C86826] min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#75645C] block mb-1">
                Ketinggian Tanam (MDPL)
              </label>
              <input
                type="text"
                value={altitude}
                onChange={(e) => setAltitude(e.target.value)}
                placeholder="Contoh: 1.400 MDPL"
                className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-3 py-2.5 text-xs text-[#26160F] focus:outline-hidden focus:border-[#C86826] min-h-[44px]"
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-2.5 bg-[#FDF3EB] p-3.5 rounded-2xl border border-[#FDB882]/40">
            <div>
              <label className="text-[11px] font-bold text-[#865225] block mb-1">
                Harga Dasar 200g (Rp) *
              </label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                required
                className="w-full bg-white border border-[#ECE4DA] rounded-xl px-3 py-2.5 font-serif text-sm font-bold text-[#26160F] focus:outline-hidden focus:border-[#C86826] min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#865225] block mb-1">
                Total Stok Fisik (kg) *
              </label>
              <input
                type="number"
                step="0.5"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full bg-white border border-[#ECE4DA] rounded-xl px-3 py-2.5 font-serif text-sm font-bold text-[#26160F] focus:outline-hidden focus:border-[#C86826] min-h-[44px]"
              />
            </div>
          </div>

          {/* Roast Level & Process */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-[#75645C] block mb-1">
                Profil Sangrai (Roast Level)
              </label>
              <select
                value={roastLevel}
                onChange={(e) => setRoastLevel(e.target.value as any)}
                className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-3 py-2.5 text-xs text-[#26160F] focus:outline-hidden min-h-[44px]"
              >
                <option value="Light">Light</option>
                <option value="Light-Med">Light-Med</option>
                <option value="Medium">Medium</option>
                <option value="Medium-Dark">Medium-Dark</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#75645C] block mb-1">
                Metode Pascapanen (Process)
              </label>
              <select
                value={process}
                onChange={(e) => setProcess(e.target.value as ProcessType)}
                className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-3 py-2.5 text-xs text-[#26160F] focus:outline-hidden min-h-[44px]"
              >
                <option value="Washed">Washed</option>
                <option value="Anaerobic">Anaerobic</option>
                <option value="Anaerobic Honey">Anaerobic Honey</option>
                <option value="Natural">Natural</option>
                <option value="House Blend">House Blend</option>
              </select>
            </div>
          </div>

          {/* Flavor Notes & Cupping Score */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="text-[11px] font-bold text-[#75645C] block mb-1">
                Flavor Notes (Pisahkan koma)
              </label>
              <input
                type="text"
                value={flavorNotesStr}
                onChange={(e) => setFlavorNotesStr(e.target.value)}
                placeholder="Dark Berry, Winey, Caramel"
                className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-3 py-2.5 text-xs text-[#26160F] focus:outline-hidden min-h-[44px]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#75645C] block mb-1">
                Cupping Score
              </label>
              <input
                type="text"
                value={cuppingScore}
                onChange={(e) => setCuppingScore(e.target.value)}
                placeholder="86.5"
                className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-3 py-2.5 text-xs font-bold text-[#C86826] focus:outline-hidden min-h-[44px]"
              />
            </div>
          </div>

          {/* Taste Characteristics */}
          <div className="grid grid-cols-3 gap-2 bg-[#FAF7F2] p-3 rounded-2xl border border-[#ECE4DA]">
            <div>
              <label className="text-[10px] font-bold text-[#75645C] block mb-1">
                Keasaman
              </label>
              <input
                type="text"
                value={acidity}
                onChange={(e) => setAcidity(e.target.value)}
                className="w-full bg-white border border-[#ECE4DA] rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#75645C] block mb-1">
                Ketebalan
              </label>
              <input
                type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-white border border-[#ECE4DA] rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#75645C] block mb-1">
                Manis
              </label>
              <input
                type="text"
                value={sweetness}
                onChange={(e) => setSweetness(e.target.value)}
                className="w-full bg-white border border-[#ECE4DA] rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>
          </div>

          {/* Promotional Tag */}
          <div>
            <label className="text-[11px] font-bold text-[#75645C] block mb-1">
              Badge Label Promosi
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Fresh Roast / Pilihan Barista / Stok Menipis"
              className="w-full bg-[#FAF7F2] border border-[#ECE4DA] rounded-xl px-3.5 py-2.5 text-xs text-[#26160F] focus:outline-hidden min-h-[44px]"
            />
          </div>

          {/* Actions Buttons */}
          <div className="pt-2 flex items-center justify-between gap-2.5">
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="min-h-[44px] flex items-center gap-1.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" /> Hapus
              </button>
            )}

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] bg-[#FAF7F2] hover:bg-[#EFE8E0] text-[#75645C] px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer border border-[#ECE4DA]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="min-h-[44px] flex items-center gap-2 bg-[#26160F] hover:bg-[#C86826] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95 border border-[#382015]"
              >
                <Save className="w-3.5 h-3.5 text-[#FDB882]" />
                {isEdit ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
