import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import DataTable from "../components/DataTable";
import { downloadExcelTemplate } from "../utils/excelTemplate";

function UrunListesi({ liste, setListe }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [hasProcessedUploadedData, setHasProcessedUploadedData] =
    useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newProduct, setNewProduct] = useState({
    "Ürün adı": "",
    "Ürün grubu": "",
    Marka: "",
    Model: "",
    Birim: "",
  });

  const columns = [
    // TODO: Api den gelmeli ?
    { header: "Ürün Adı", key: "Ürün adı" },
    { header: "Ürün Grubu", key: "Ürün grubu" },
    { header: "Marka", key: "Marka" },
    { header: "Model", key: "Model" },
    { header: "Birim", key: "Birim" },
  ];

  // ExcelYukleme sayfasından gelen veriyi işle
  useEffect(() => {
    if (
      location.state &&
      location.state.uploadedData &&
      !hasProcessedUploadedData
    ) {
      console.log(
        "UrunListesi: Received uploadedData",
        location.state.uploadedData,
      );
      setListe((prevListe) => {
        const newData = [...prevListe, ...location.state.uploadedData];
        console.log("UrunListesi: Data after update", newData);
        return newData;
      });
      setHasProcessedUploadedData(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, hasProcessedUploadedData, setListe]);

  const handleAddProduct = () => {
    const requiredFields = columns.map((col) => col.key);
    const allFieldsFilled = requiredFields.every(
      (field) => newProduct[field] && newProduct[field].trim() !== "",
    );

    if (allFieldsFilled) {
      if (editingIndex !== null) {
        const updatedData = [...liste];
        updatedData[editingIndex] = newProduct;
        setListe(updatedData);
      } else {
        setListe((prevListe) => [...prevListe, { ...newProduct }]);
      }
      setShowModal(false);
      resetForm();
    } else {
      alert("Lütfen tüm alanları doldurunuz!");
    }
  };

  const handleEditProduct = (index) => {
    setEditingIndex(index);
    setNewProduct(liste[index]);
    setShowModal(true);
  };

  const handleDeleteProduct = (index) => {
    if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      const updatedData = liste.filter((_, i) => i !== index);
      setListe(updatedData);
    }
  };

  const resetForm = () => {
    setEditingIndex(null);
    setNewProduct(
      columns.reduce((acc, col) => {
        acc[col.key] = "";
        return acc;
      }, {}),
    );
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

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(liste);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ürün Listesi");
    XLSX.writeFile(wb, "UrunListesi.xlsx");
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
              {columns.map((col) => {
                return (
                  <div key={col.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {col.header}
                    </label>
                    <input
                      type="text"
                      name={col.key}
                      value={newProduct[col.key]}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                );
              })}
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
        data={liste}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <button
        onClick={exportToExcel}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition mt-6"
      >
        📥 Listeyi Excel'e Aktar
      </button>
    </div>
  );
}

export default UrunListesi;
