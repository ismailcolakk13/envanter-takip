import * as XLSX from "xlsx";

/**
 * Excel şablonu oluşturur ve indirir
 * @param {Array} columns - Sütun tanımları [{header: "...", key: "..."}]
 * @param {String} fileName - İndirilecek dosyanın adı
 */
export const downloadExcelTemplate = (columns, fileName) => {
  // Şablon verisi oluştur - 3 satırlık örnek veri
  const templateData = Array(3).fill(null).map(() => {
    const row = {};
    columns.forEach((col) => {
      row[col.key] = ""; // Boş değer
    });
    return row;
  });

  // Workbook oluştur
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(templateData);

  // Sütun genişliğini ayarla
  const columnWidths = columns.map(() => 20);
  worksheet["!cols"] = columnWidths.map((width) => ({ wch: width }));

  // Header stillemesi için format bilgisi ekle (XLSX'te temel styling)
  const headerStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "1F4E78" } }, // Koyu mavi
    alignment: { horizontal: "center", vertical: "center" },
  };

  // Header hücrelerine stil uygula
  columns.forEach((col, idx) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: idx });
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = headerStyle;
    }
  });

  // Worksheet'i workbook'a ekle
  XLSX.utils.book_append_sheet(workbook, worksheet, "Veriler");

  // Dosyayı indir
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
