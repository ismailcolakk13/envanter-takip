import { useState } from "react";
import DataTable from "../components/DataTable";
import { downloadExcelTemplate } from "../utils/excelTemplate";
import { useNavigate } from "react-router-dom";

function DepoListesi({ liste, setListe }) {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newItem, setNewItem] = useState({
    "Depo Adı": "",
    "Depo Kodu": "",
    Lokasyon: "",
    Kapasite: "",
    Sorumlu: "",
  });

  const columns = [
    { header: "Depo Adı", key: "Depo Adı" },
    { header: "Depo Kodu", key: "Depo Kodu" },
    { header: "Lokasyon", key: "Lokasyon" },
    { header: "Kapasite", key: "Kapasite" },
    { header: "Sorumlu", key: "Sorumlu" },
  ];


  const handleAddItem = () => {
    if (
      newItem["Depo Adı"] &&
      newItem["Depo Kodu"] &&
      newItem["Lokasyon"] &&
      newItem["Kapasite"] &&
      newItem["Sorumlu"]
    ) {
      if (editingIndex !== null) {
        const updatedData = [...liste];
        updatedData[editingIndex] = newItem;
        setListe(updatedData);
      } else {
        setListe([...liste, newItem]);
      }
      resetForm();
      setShowModal(false);
    } else {
      alert("Lütfen tüm alanları doldurunuz!");
    }
  };

  const handleEditItem = (index) => {
    setEditingIndex(index);
    setNewItem(liste[index]);
    setShowModal(true);
  };

  const handleDeleteItem = (index) => {
    if (window.confirm("Bu depoyu silmek istediğinize emin misiniz?")) {
      const updatedData = liste.filter((_, i) => i !== index);
      setListe(updatedData);
    }
  };

  const resetForm = () => {
    setEditingIndex(null);
    setNewItem({
      "Depo Adı": "",
      "Depo Kodu": "",
      Lokasyon: "",
      Kapasite: "",
      Sorumlu: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const navigateToExcelUpload = () => {
    navigate("/excel-yukle", {
      state: {
        columns: columns,
        target: "/depo-liste",
        pageTitle: "Depo Listesi",
      },
    });
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Depo Listesi</h1>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => downloadExcelTemplate(columns, "DepoListesi_Sablon")}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          ⬇️ Excel Şablonu
        </button>
        <button
          onClick={navigateToExcelUpload}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          📊 Excel Yükle
        </button>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition"
        >
          + Depo Ekle
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              {editingIndex !== null ? "Depo Düzenle" : "Yeni Depo Ekle"}
            </h2>

            <div className="space-y-3">
              {columns.map((col) => (
                <div key={col.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {col.header}
                  </label>
                  <input
                    type="text"
                    name={col.key}
                    value={newItem[col.key]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddItem}
                className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition"
              >
                {editingIndex !== null ? "Güncelle" : "Ekle"}
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={liste}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />
    </div>
  );
}

export default DepoListesi;
