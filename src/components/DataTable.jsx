// src/components/DataTable.js
import React from 'react';

const DataTable = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left text-gray-500">
        
        {/* DİNAMİK BAŞLIKLAR (HEADER) */}
        <thead className="text-xs text-white uppercase bg-blue-900">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col" className="px-6 py-4">
                {col.header}
              </th>
            ))}
            <th scope="col" className="px-6 py-4">İşlemler</th>
          </tr>
        </thead>

        {/* DİNAMİK GÖVDE (BODY) */}
        <tbody className="bg-white">
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b ${
                  rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-yellow-50 transition duration-150`}
              >
                {/* Burada kritik nokta şudur:
                  Sütun sırasına göre veriyi (row) map'liyoruz.
                  col.key -> Excel veya Data objesindeki property adıdır.
                */}
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {/* Eğer veri undefined ise boş string bas */}
                    {row[col.key] || "-"} 
                  </td>
                ))}
                {/* İŞLEMLER SÜTUNU */}
                <td className="px-6 py-4 whitespace-nowrap space-x-2 flex">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(rowIndex)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1 px-3 rounded transition"
                    >
                      Düzenle
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(rowIndex)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-3 rounded transition"
                    >
                      Sil
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            // Veri Yoksa
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-400 italic bg-gray-50">
                Görüntülenecek veri bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;