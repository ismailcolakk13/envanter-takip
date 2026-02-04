import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/layout';

import UrunListesi from './pages/UrunListesi';
import DepoListesi from './pages/DepoListesi';
import DepolarArasiTransfer from './pages/DepolarArasiTransfer';
import StokCikisiTakibi from './pages/StokCikisiTakibi';
import StokGirisiTakibi from './pages/StokGirisiTakibi';
import YonetimPaneli from './pages/YonetimPaneli';
import ExcelYukleme from './pages/ExcelYukleme';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout kapsayıcı olarak en dışta durur */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="urun-liste" replace/>} />
          
          {/* Layout içindeki Outlet kısmına gelecek sayfalar: */}
          <Route path="urun-liste" element={<UrunListesi/>} />
          <Route path="depo-liste" element={<DepoListesi />} />
          <Route path="depolar-arasi-transfer" element={<DepolarArasiTransfer />} />
          <Route path="stok-giris" element={<StokGirisiTakibi />} />
          <Route path="stok-cikis" element={<StokCikisiTakibi />} />
          <Route path="admin" element={<YonetimPaneli />} />
          <Route path="excel-yukle" element={<ExcelYukleme />} />

          {/* Tanımsız bir sayfaya gidilirse */}
          <Route path="*" element={<div className="text-red-500">Sayfa Bulunamadı (404)</div>} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;