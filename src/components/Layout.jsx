// src/components/Layout.js
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
  // Menü elemanları listesi (Senin verdiğin liste)
  const menuItems = [
    { name: 'Ürün Listesi', path: '/urun-liste' },
    { name: 'Depo Listesi', path: '/depo-liste' },
    { name: 'Depolar Arası Transfer', path: '/depolar-arasi-transfer' },
    { name: 'Stok Girişi', path: '/stok-giris' }, // İsimleri biraz kısalttım sığması için
    { name: 'Stok Çıkışı', path: '/stok-cikis' },
    { name: 'Yönetim', path: '/admin' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* 1. ÜST HEADER BÖLÜMÜ */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Logo / Uygulama Adı */}
          <div className="flex justify-center py-6">
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
              Envanter Takip
            </h1>
          </div>

          {/* Navigasyon Sekmeleri (Tabs) */}
          <div className="mt-2">
            <nav className="-mb-px flex justify-center space-x-8 overflow-x-auto" aria-label="Tabs">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                    ${
                      isActive
                        ? 'border-blue-600 text-blue-700'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* 2. ORTALANMIŞ İÇERİK ALANI */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* İçerik Kartı */}
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg min-h-[600px] border border-gray-100">
            {/* Outlet: Sayfalar burada render edilecek */}
            <div className="p-6 sm:p-10">
              <Outlet />
            </div>
          </div>

        </div>
      </main>

      {/* Footer (Opsiyonel) */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-xs text-gray-400">
          {/* © 2024 Turkcell İletişim Hizmetleri A.Ş. */}
        </div>
      </footer>

    </div>
  );
};

export default Layout;