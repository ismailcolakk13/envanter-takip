// src/pages/UrunListesi.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DataTable from "../components/DataTable";
import { downloadExcelTemplate } from "../utils/excelTemplate";

function UrunListesi() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([
    {
      "Ürün adı": "Laptop",
      "Ürün grubu": "Bilgisayar",
      "Marka": "Dell",
      "Model": "XPS 13",
      "Birim": "Adet",
    },
    {
      "Ürün adı": "Monitör",
      "Ürün grubu": "Bilgisayar",
      "Marka": "LG",
      "Model": "27UK850",
      "Birim": "Adet",
    },
    {
      "Ürün adı": "Klavye",
      "Ürün grubu": "Aksesuar",
      "Marka": "Logitech",
      "Model": "MX Keys",
      "Birim": "Adet",
    },
    {
      "Ürün adı": "Mouse",
      "Ürün grubu": "Aksesuar",
      "Marka": "Razer",
      "Model": "DeathAdder",
      "Birim": "Adet",
    },
    {
      "Ürün adı": "Yazıcı",
      "Ürün grubu": "Ofis",
      "Marka": "HP",
      "Model": "M426dw",
      "Birim": "Adet",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newProduct, setNewProduct] = useState({
    "Ürün adı": "",
    "Ürün grubu": "",
    "Marka": "",
    "Model": "",
    "Birim": "",
  });

  const columns = [
    { header: "Ürün Adı", key: "Ürün adı" },
    { header: "Ürün Grubu", key: "Ürün grubu" },
    { header: "Marka", key: "Marka" },
    { header: "Model", key: "Model" },
    { header: "Birim", key: "Birim" },
  ];

  // ExcelYukleme sayfasından gelen veriyi işle
  useEffect(() => {
    if (location.state && location.state.uploadedData) {
      console.log("UrunListesi: Received uploadedData", location.state.uploadedData); // Debug log
      setData((prevData) => {
        console.log("UrunListesi: Current data before update", prevData); // Debug log
        const newData = [...prevData, ...location.state.uploadedData];
        console.log("UrunListesi: Data after update", newData); // Debug log
        return newData;
      });
      // State'i temizle, sayfa yenilendiğinde tekrar eklenmesin
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleAddProduct = () => {
    if (
      newProduct["Ürün adı"] &&
      newProduct["Ürün grubu"] &&
      newProduct["Marka"] &&
      newProduct["Model"] &&
      newProduct["Birim"]
    ) {
      if (editingIndex !== null) {
        const updatedData = [...data];
        updatedData[editingIndex] = newProduct;
        setData(updatedData);
      } else {
        setData([...data, newProduct]);
      }
      resetForm();
      setShowModal(false);
    } else {
      alert("Lütfen tüm alanları doldurunuz!");
    }
  };

  const handleEditProduct = (index) => {
    setEditingIndex(index);
    setNewProduct(data[index]);
    setShowModal(true);
  };

  const handleDeleteProduct = (index) => {
    if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      const updatedData = data.filter((_, i) => i !== index);
      setData(updatedData);
    }
  };

  const resetForm = () => {
    setEditingIndex(null);
    setNewProduct({
      "Ürün adı": "",
      "Ürün grubu": "",
      "Marka": "",
      "Model": "",
      "Birim": "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const navigateToExcelUpload = () => {
    navigate("/excel-yukle", {
      state: {
        columns: columns,
        target: "/urun-liste",
        pageTitle: "Ürün Listesi",
      },
    });
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Ürün Listesi</h1>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => downloadExcelTemplate(columns, "UrunListesi_Sablon")}
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
          + Ürün Ekle
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              {editingIndex !== null ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  name="Ürün adı"
                  value={newProduct["Ürün adı"]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Grubu
                </label>
                <input
                  type="text"
                  name="Ürün grubu"
                  value={newProduct["Ürün grubu"]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marka
                </label>
                <input
                  type="text"
                  name="Marka"
                  value={newProduct["Marka"]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  name="Model"
                  value={newProduct["Model"]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Birim
                </label>
                <input
                  type="text"
                  name="Birim"
                  value={newProduct["Birim"]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddProduct}
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
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}

export default UrunListesi;
