import React, { useState } from "react";
import DataTable from "../components/DataTable";
import ExcelUploadPage from "../components/ExcelUploadModal";
import { downloadExcelTemplate } from "../utils/excelTemplate";

function DepolarArasiTransfer() {
  const [data, setData] = useState([
    {
      "Tarih": "2024-01-15",
      "Ürün Adı": "Laptop",
      "Transfer Miktarı": "5",
      "Birim": "Adet",
      "Kaynak Depo": "Ana Depo",
      "Hedef Depo": "Şube Depo",
    },
    {
      "Tarih": "2024-01-16",
      "Ürün Adı": "Mouse",
      "Transfer Miktarı": "20",
      "Birim": "Adet",
      "Kaynak Depo": "Şube Depo",
      "Hedef Depo": "Ana Depo",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newItem, setNewItem] = useState({
    "Tarih": "",
    "Ürün Adı": "",
    "Transfer Miktarı": "",
    "Birim": "",
    "Kaynak Depo": "",
    "Hedef Depo": "",
  });

  const columns = [
    { header: "Tarih", key: "Tarih" },
    { header: "Ürün Adı", key: "Ürün Adı" },
    { header: "Transfer Miktarı", key: "Transfer Miktarı" },
    { header: "Birim", key: "Birim" },
    { header: "Kaynak Depo", key: "Kaynak Depo" },
    { header: "Hedef Depo", key: "Hedef Depo" },
  ];

  const handleExcelUpload = (uploadedData) => {
    setData([...data, ...uploadedData]);
  };

  const handleAddItem = () => {
    if (
      newItem["Tarih"] &&
      newItem["Ürün Adı"] &&
      newItem["Transfer Miktarı"] &&
      newItem["Birim"] &&
      newItem["Kaynak Depo"] &&
      newItem["Hedef Depo"]
    ) {
      if (editingIndex !== null) {
        const updatedData = [...data];
        updatedData[editingIndex] = newItem;
        setData(updatedData);
      } else {
        setData([...data, newItem]);
      }
      resetForm();
      setShowModal(false);
    } else {
      alert("Lütfen tüm alanları doldurunuz!");
    }
  };

  const handleEditItem = (index) => {
    setEditingIndex(index);
    setNewItem(data[index]);
    setShowModal(true);
  };

  const handleDeleteItem = (index) => {
    if (window.confirm("Bu transferi silmek istediğinize emin misiniz?")) {
      const updatedData = data.filter((_, i) => i !== index);
      setData(updatedData);
    }
  };

  const resetForm = () => {
    setEditingIndex(null);
    setNewItem({
      "Tarih": "",
      "Ürün Adı": "",
      "Transfer Miktarı": "",
      "Birim": "",
      "Kaynak Depo": "",
      "Hedef Depo": "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Depolar Arası Transfer</h1>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => downloadExcelTemplate(columns, "DepolarArasiTransfer_Sablon")}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          ⬇️ Excel Şablonu
        </button>
        <button
          onClick={() => setShowExcelModal(true)}
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
          + Transfer Ekle
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              {editingIndex !== null ? "Transfer Düzenle" : "Yeni Transfer Ekle"}
            </h2>

            <div className="space-y-3">
              {columns.map((col) => (
                <div key={col.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {col.header}
                  </label>
                  <input
                    type={col.key === "Tarih" ? "date" : "text"}
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
        data={data}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
      />

      <ExcelUploadPage
        isOpen={showExcelModal}
        onClose={() => setShowExcelModal(false)}
        onUpload={handleExcelUpload}
        expectedColumns={columns}
        pageTitle="Depolar Arası Transfer"
      />
    </div>
  );
}

export default DepolarArasiTransfer;