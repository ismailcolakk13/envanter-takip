import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExcelUploadPage = ({ isOpen, onClose, onUpload, expectedColumns, pageTitle }) => {
  const [file, setFile] = useState(null);
  const [excelColumns, setExcelColumns] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [showMapping, setShowMapping] = useState(false);



  
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length > 0) {
          // Excel'deki sütunları al
          const columns = Object.keys(jsonData[0]);
          setExcelColumns(columns);
          setFile(selectedFile);

          // Otomatik mapping yap
          const mapping = {};
          expectedColumns.forEach((expected) => {
            // Benzer sütun adı bul
            const found = columns.find(
              (col) =>
                col.toLowerCase().includes(expected.key.toLowerCase()) ||
                expected.key.toLowerCase().includes(col.toLowerCase())
            );
            mapping[expected.key] = found || "";
          });
          setColumnMapping(mapping);
          setShowMapping(true);
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

  const handleUpload = () => {
    // Tüm alanlar eşleştirildi mi kontrol et
    const allMapped = Object.values(columnMapping).every((val) => val !== "");
    if (!allMapped) {
      alert("Lütfen tüm sütunları eşleştirin!");
      return;
    }

    // Excel verisini oku
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Veriyi mapping'e göre dönüştür
        const transformedData = jsonData.map((row) => {
          const newRow = {};
          expectedColumns.forEach((expected) => {
            const excelColumn = columnMapping[expected.key];
            newRow[expected.key] = row[excelColumn] || "";
          });
          return newRow;
        });

        onUpload(transformedData);
        resetForm();
      } catch (error) {
        alert("Veri işleme sırasında hata oluştu: " + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const resetForm = () => {
    setFile(null);
    setExcelColumns([]);
    setColumnMapping({});
    setShowMapping(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          {pageTitle ? `${pageTitle} - Excel Yükle` : "Excel Dosyası Yükle"}
        </h2>

        {!showMapping ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excel Dosyası Seçin (.xlsx, .xls)
              </label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            {file && (
              <p className="text-green-600 text-sm">
                ✓ Dosya seçildi: {file.name}
              </p>
            )}
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Sütun Eşleştirmesi
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Tablonuzun sütunlarını Excel dosyasındaki sütunlarla eşleştirin:
            </p>
            <div className="space-y-2">
              {expectedColumns.map((expected) => (
                <div key={expected.key} className="flex items-center gap-3">
                  <label className="w-32 text-sm font-medium text-gray-700">
                    {expected.header}:
                  </label>
                  <select
                    value={columnMapping[expected.key] || ""}
                    onChange={(e) =>
                      handleMappingChange(expected.key, e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Seçin --</option>
                    {excelColumns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {showMapping ? (
            <>
              <button
                onClick={handleUpload}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Verileri Yükle
              </button>
              <button
                onClick={() => setShowMapping(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded transition"
              >
                Geri
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleFileSelect}
                disabled={!file}
                className={`flex-1 font-semibold py-2 px-4 rounded transition ${
                  file
                    ? "bg-blue-900 hover:bg-blue-800 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Devam Et
              </button>
            </>
          )}
          <button
            onClick={resetForm}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploadPage;
