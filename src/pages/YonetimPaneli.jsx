import { useState } from "react";

function YonetimPaneli() {
  const [units, setUnits] = useState(["Adet", "Kilo", "Metre", "Litre"]);
  const [categories, setCategories] = useState(["Mutfak", "Kırtasiye", "Tekstil", "Elektronik"]);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newUnit, setNewUnit] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleAddUnit = () => {
    if (newUnit.trim()) {
      setUnits([...units, newUnit]);
      setNewUnit("");
      setShowUnitModal(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      setShowCategoryModal(false);
    }
  };

  // Depo Kullanıcı Yetkileri
  const [depolar] = useState([
    { id: 1, ad: "AVRUPA DC ANA DEPO" },
    { id: 2, ad: "İZMİR DC ANA DEPO" },
    { id: 3, ad: "KOÇÖKYALLI ANA DEPO" },
    { id: 4, ad: "ANKARA ANA DEPO" },
    { id: 5, ad: "ANTALYA ANA DEPO" },
    { id: 6, ad: "ERZURUM ANA DEPO" },
    { id: 7, ad: "GAZİANTEP ANA DEPO" },
  ]);

  const [tümKullanicilar] = useState([
    { id: 1, ad: "ÖZGÜR TÖZÜN", depoId: 1 },
    { id: 2, ad: "EMRE İNAN", depoId: 1 },
    { id: 3, ad: "HASAN KAVABAŞI", depoId: 2 },
    { id: 4, ad: "MEHMET ZAKİR YETİM", depoId: 2 },
    { id: 5, ad: "MERVE KÖKEN", depoId: 3 },
    { id: 6, ad: "NURAY ŞAKRAK", depoId: 1 },
    { id: 7, ad: "YASEMİN COŞAR", depoId: 4 },
    { id: 8, ad: "BURCU KAYADENİZ SAMURAY", depoId: 3 },
    { id: 9, ad: "MUHAMMED ZEKİ TAVLAŞOĞLU", depoId: 5 },
  ]);

  const [selectedDepo, setSelectedDepo] = useState(depolar[0].id);
  const [permissions, setPermissions] = useState({});

  // Seçilen depoya ait yetkililer
  const depoYetkililer = tümKullanicilar.filter(k => k.depoId === selectedDepo);

  const togglePermission = (kullaniciId, permType) => {
    const key = `${kullaniciId}-${permType}`;
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const hasPermission = (kullaniciId, permType) => {
    const key = `${kullaniciId}-${permType}`;
    return permissions[key] || false;
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Yönetim Paneli</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Birim Tanımla */}
        <div>
          <div className="mb-4">
            <button
              onClick={() => setShowUnitModal(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition"
            >
              + Birim Ekle
            </button>
          </div>

          {showUnitModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-bold text-blue-900 mb-4">Yeni Birim Ekle</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Birim Adı
                    </label>
                    <input
                      type="text"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      placeholder="Örn: Paket"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddUnit}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Ekle
                  </button>
                  <button
                    onClick={() => {
                      setNewUnit("");
                      setShowUnitModal(false);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="border rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left font-semibold text-gray-800">Birimler</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ürün Grubu Tanımla */}
        <div>
          <div className="mb-4">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition"
            >
              + Ürün Grubu Ekle
            </button>
          </div>

          {showCategoryModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-bold text-blue-900 mb-4">Yeni Ürün Grubu Ekle</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grup Adı
                    </label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      placeholder="Örn: Mobilya"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddCategory}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition"
                  >
                    Ekle
                  </button>
                  <button
                    onClick={() => {
                      setNewCategory("");
                      setShowCategoryModal(false);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="border rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left font-semibold text-gray-800">Ürün Grupları</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Depo Kullanıcı Yetkileri Tablosu */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-900">Depo Kullanıcı Yetkileri</h2>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition">
            📥 Dışa Aktar
          </button>
        </div>

        <div className="border rounded overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-r w-2/6">Depolar</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800 border-r w-2/6">Depo Yetkililer</th>
                <th className="px-3 py-3 text-center font-semibold text-gray-800 border-r w-1/6">Görüntüleyebilir</th>
                <th className="px-3 py-3 text-center font-semibold text-gray-800 w-1/6">İşlem Yapabilir</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                {/* Bölüm 1: Depolar */}
                <td className="px-4 py-3 align-top border-r bg-gray-50 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {depolar.map((depo) => (
                      <div
                        key={depo.id}
                        onClick={() => setSelectedDepo(depo.id)}
                        className={`p-3 rounded cursor-pointer transition ${
                          selectedDepo === depo.id
                            ? "bg-blue-900 text-white font-semibold"
                            : "bg-white border border-gray-300 hover:bg-blue-50"
                        }`}
                      >
                        {depo.ad}
                      </div>
                    ))}
                  </div>
                </td>

                {/* Bölüm 2: Seçilen Deponun Yetkililer */}
                <td className="py-3 align-top border-r bg-gray-50 max-h-96 min-h-96  overflow-y-auto">
                  {depoYetkililer.length > 0 ? (
                    <div className="space-y-2">
                      {depoYetkililer.map((kullanici) => (
                        <div
                          key={kullanici.id}
                          className="p-3 bg-white border border-r-0 border-gray-300  hover:bg-blue-50 transition"
                        >
                          <p className="font-medium text-gray-800">{kullanici.ad}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Bu depoda yetkili bulunmamaktadır</p>
                  )}
                </td>

                {/* Bölüm 3: Görüntüleyebilir Yetkisi */}
                <td className="py-3 align-top border-r bg-gray-50 max-h-96 min-h-96 overflow-y-auto w-24">
                  {depoYetkililer.length > 0 ? (
                    <div className="space-y-2">
                      {depoYetkililer.map((kullanici) => (
                        <div
                          key={kullanici.id}
                          className="p-3 bg-white border border-l-0 border-gray-300  flex justify-center"
                        >
                          <input
                            type="checkbox"
                            checked={hasPermission(kullanici.id, "view")}
                            onChange={() => togglePermission(kullanici.id, "view")}
                            className="w-5 h-6 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm text-center">-</p>
                  )}
                </td>

                {/* Bölüm 4: İşlem Yapabilir Yetkisi */}
                <td className="py-3 align-top bg-gray-50 max-h-96 overflow-y-auto w-24">
                  {depoYetkililer.length > 0 ? (
                    <div className="space-y-2">
                      {depoYetkililer.map((kullanici) => (
                        <div
                          key={kullanici.id}
                          className="p-3 bg-white border border-l-0 border-gray-300  flex justify-center"
                        >
                          <input
                            type="checkbox"
                            checked={hasPermission(kullanici.id, "edit")}
                            onChange={() => togglePermission(kullanici.id, "edit")}
                            className="w-5 h-6 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm text-center">-</p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default YonetimPaneli;
