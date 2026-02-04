import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/layout';

import DepoListesi from './pages/DepoListesi';
import DepolarArasiTransfer from './pages/DepolarArasiTransfer';
import ExcelYukleme from './pages/ExcelYukleme';
import StokCikisiTakibi from './pages/StokCikisiTakibi';
import StokGirisiTakibi from './pages/StokGirisiTakibi';
import UrunListesi from './pages/UrunListesi';
import YonetimPaneli from './pages/YonetimPaneli';
import { depolarArasiListepl, depoListepl, stokCikisListepl, stokGirisListepl, urunListepl } from './utils/placeHolderDatas';

function App() {
  const [urunListe, setUrunListe] = useState(() => {
    const saved = localStorage.getItem('urunListe');
    return saved ? JSON.parse(saved) : urunListepl;
  });
  const [depoListe, setDepoListe] = useState(() => {
    const saved = localStorage.getItem('depoListe');
    return saved ? JSON.parse(saved) : depoListepl;
  });
  const [depolarArasiListe, setDepolarArasiListe] = useState(() => {
    const saved = localStorage.getItem('depolarArasiListe');
    return saved ? JSON.parse(saved) : depolarArasiListepl;
  });
  const [stokGirisListe, setStokGirisListe] = useState(() => {
    const saved = localStorage.getItem('stokGirisListe');
    return saved ? JSON.parse(saved) : stokGirisListepl;
  });
  const [stokCikisListe, setStokCikisListe] = useState(() => {
    const saved = localStorage.getItem('stokCikisListe');
    return saved ? JSON.parse(saved) : stokCikisListepl;
  });

  // Save to localStorage whenever lists change
  useEffect(() => {
    localStorage.setItem('urunListe', JSON.stringify(urunListe));
  }, [urunListe]);

  useEffect(() => {
    localStorage.setItem('depoListe', JSON.stringify(depoListe));
  }, [depoListe]);

  useEffect(() => {
    localStorage.setItem('depolarArasiListe', JSON.stringify(depolarArasiListe));
  }, [depolarArasiListe]);

  useEffect(() => {
    localStorage.setItem('stokGirisListe', JSON.stringify(stokGirisListe));
  }, [stokGirisListe]);

  useEffect(() => {
    localStorage.setItem('stokCikisListe', JSON.stringify(stokCikisListe));
  }, [stokCikisListe]);


  
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout kapsayıcı olarak en dışta durur */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="urun-liste" replace/>} />
          
          {/* Layout içindeki Outlet kısmına gelecek sayfalar: */}
          <Route path="urun-liste" element={<UrunListesi liste={urunListe} setListe={setUrunListe}/>} />
          <Route path="depo-liste" element={<DepoListesi liste={depoListe} setListe={setDepoListe}/>} />
          <Route path="depolar-arasi-transfer" element={<DepolarArasiTransfer liste={depolarArasiListe} setListe={setDepolarArasiListe} />} />
          <Route path="stok-giris" element={<StokGirisiTakibi liste={stokGirisListe} setListe={setStokGirisListe}/>} />
          <Route path="stok-cikis" element={<StokCikisiTakibi liste={stokCikisListe} setListe={setStokCikisListe} />} />
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