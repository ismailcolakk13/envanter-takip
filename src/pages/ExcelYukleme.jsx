import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import DataTable from "../components/DataTable"; // Önizleme için DataTable'ı kullanacağız

const ExcelYukleme = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // UrunListesi'nden gönderilen state'i al
  const { columns: expectedColumns, target, pageTitle } = location.state || {};

  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [excelColumns, setExcelColumns] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [step, setStep] = useState(1); // 1: Dosya Seç, 2: Eşleştirme, 3: Önizleme

  // Eğer gerekli state bilgisi yoksa, ana sayfaya yönlendir.
  useEffect(() => {
    if (!expectedColumns || !target) {
      console.error("Gerekli bilgiler (sütunlar, hedef sayfa) eksik.");
      navigate("/");
    }
  }, [expectedColumns, target, navigate]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Başlıkları da al

        if (jsonData.length > 0) {
          const columns = jsonData[0];
          setExcelColumns(columns);

          // Otomatik eşleştirme yap
          const mapping = {};
          expectedColumns.forEach((expected) => {
            const found = columns.find(
              (col) =>
                col.toLowerCase().includes(expected.key.toLowerCase()) ||
                expected.key.toLowerCase().includes(col.toLowerCase()),
            );
            mapping[expected.key] = found || "";
          });
          setColumnMapping(mapping);
          setStep(2); // Eşleştirme adımına geç
        }
      } catch (error) {
        alert("Dosya okunurken hata oluştu: " + error.message);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleMappingChange = (expectedKey, excelColumn) => {
    setColumnMapping({ ...columnMapping, [expectedKey]: excelColumn });
  };

  const processToPreview = () => {
    // Tüm alanlar eşleştirildi mi kontrol et
    const allMapped = Object.values(columnMapping).every((val) => val !== "");
    if (!allMapped) {
      alert("Lütfen tüm sütunları eşleştirin!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Veriyi mapping'e göre dönüştür
        const transformedData = jsonData.map((row, index) => {
          const newRow = { id: index }; // Düzenleme/silme için bir id
          expectedColumns.forEach((expected) => {
            const excelColumn = columnMapping[expected.key];
            newRow[expected.key] = row[excelColumn] || "";
          });
          return newRow;
        });

        setExcelData(transformedData);
        setStep(3); // Önizleme adımına geç
      } catch (error) {
        alert("Veri işleme sırasında hata oluştu: " + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSave = () => {
    // ID'leri kaldırarak veriyi temizle
    const cleanData = excelData.map(({ id, ...rest }) => rest);
    navigate(target, { state: { uploadedData: cleanData } });
  };

  const handleEditRow = (index) => {
    // Bu kısım daha sonra detaylı bir modal ile yapılabilir.
    // Şimdilik basit bir prompt ile düzenleme yapalım.
    const row = excelData[index];
    const newRow = { ...row };

    expectedColumns.forEach((col) => {
      const newValue = prompt(
        `Yeni değeri girin: ${col.header}`,
        newRow[col.key],
      );
      if (newValue !== null) {
        newRow[col.key] = newValue;
      }
    });

    const updatedData = [...excelData];
    updatedData[index] = newRow;
    setExcelData(updatedData);
  };

  const handleDeleteRow = (index) => {
    if (window.confirm("Bu satırı silmek istediğinize emin misiniz?")) {
      const updatedData = excelData.filter((_, i) => i !== index);
      setExcelData(updatedData);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate(target)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded text-sm transition"
        >
          ❮ Geri Dön
        </button>
        <h1 className="text-2xl font-bold text-blue-900">
          {pageTitle
            ? `${pageTitle} - Excel'den Veri Yükle`
            : "Excel'den Veri Yükle"}
        </h1>
      </div>

      {/* Adım 1: Dosya Seçimi */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 text-lg">
          1. Excel Dosyası Seçimi
        </h3>
        {!file ? (
          <div>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        ) : (
          <p className="text-green-600 text-sm">
            {file.name}
            <button
              onClick={() => {
                setStep(1);
                setFile(null); // Dosyayı da sıfırla
                setExcelColumns([]);
                setColumnMapping({});
                setExcelData([]);
              }}
              className="ml-4 bg-orange-50 hover:bg-orange-100 text-orange-500 font-semibold py-1 px-2 rounded text-xs transition"
            >
              Dosyayı Değiştir
            </button>
          </p>
        )}
      </div>

      {/* Adım 2: Sütun Eşleştirme */}
      {step >= 2 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">
            2. Sütun Eşleştirmesi
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Otomatik sütunlar eşleştirildi. Gerekirse düzenleyebilirsiniz.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {expectedColumns.map((expected) => (
              <div
                key={expected.key}
                className="flex items-center gap-2 text-sm"
              >
                <label className="w-28 font-medium text-gray-700 truncate">
                  {expected.header}:
                </label>
                <select
                  value={columnMapping[expected.key] || ""}
                  onChange={(e) =>
                    handleMappingChange(expected.key, e.target.value)
                  }
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Sütun Seçin --</option>
                  {excelColumns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={processToPreview}
              className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded text-sm transition"
            >
              Önizlemeye Geç
            </button>
          </div>
        </div>
      )}

      {/* Adım 3: Veri Önizlemesi ve Kaydetme */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">
            3. Veri Önizlemesi
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Yüklenen verileri kontrol edin, düzenleyin veya silin.
          </p>
          <DataTable
            columns={expectedColumns}
            data={excelData}
            onEdit={handleEditRow}
            onDelete={handleDeleteRow}
          />
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-sm transition"
            >
              Listeye Aktar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelYukleme;
