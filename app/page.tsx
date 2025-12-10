'use client';

import React, { useState } from 'react';
// Agora ele vai procurar na pasta 'data' que pedimos para renomear
import { produtos } from '../data/produtos'; 

export default function Home() {
  const [busca, setBusca] = useState('');

  // Garante que a lista existe para não dar erro
  const listaProdutos = produtos || [];

  const produtosFiltrados = listaProdutos.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) || 
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* HEADER / TOPO */}
      <header className="bg-[#FFC107] p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center max-w-6xl">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🔥</span> 
            <h1 className="text-2xl font-black text-white tracking-tighter uppercase drop-shadow-md">
              Bombando <span className="text-gray-900">Hoje</span>
            </h1>
          </div>
          {/* Busca Rápida */}
          <input 
            type="text" 
            placeholder="Buscar oferta..." 
            className="p-2 rounded text-gray-900 border-none outline-none hidden md:block"
            onChange={(e) => setBusca(e.target.value)}
          />
          <a href="#" className="bg-gray-900 text-[#FFC107] px-4 py-2 rounded-full font-bold text-sm hover:bg-white transition">
            Grupo VIP
          </a>
        </div>
      </header>

      {/* BANNER PRINCIPAL */}
      <section className="bg-gradient-to-b from-[#FFC107] to-gray-900 py-12 px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 drop-shadow-sm">
          As melhores ofertas de tecnologia <br/> em um só lugar.
        </h2>
        <p className="text-white mb-6 text-lg">Garimpamos o Mercado Livre para você não perder tempo.</p>
      </section>

      {/* LISTAGEM DE PRODUTOS */}
      <main className="container mx-auto p-4 -mt-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtosFiltrados.map((produto) => (
            <div key={produto.id} className="bg-white rounded-xl shadow-xl overflow-hidden hover:scale-105 transition duration-300 flex flex-col">
              
              {/* Imagem do Produto */}
              <div className="h-48 bg-white flex items-center justify-center p-4 border-b border-gray-100">
                <img src={produto.img} alt={produto.nome} className="max-h-full max-w-full object-contain" />
              </div>

              {/* Informações */}
              <div className="p-5 text-gray-800 flex flex-col flex-grow">
                <div className="mb-2">
                  <span className="bg-gray-200 text-xs px-2 py-1 rounded text-gray-600 uppercase font-bold">
                    {produto.categoria}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg leading-tight mb-4 line-clamp-2 h-14">
                  {produto.nome}
                </h3>
                
                <div className="mt-auto">
                  <span className="text-gray-400 line-through text-sm">R$ {produto.precoAntigo}</span>
                  <div className="flex items-end gap-1">
                    <span className="text-xs font-bold text-green-600 mb-1">R$</span>
                    <span className="text-3xl font-black text-gray-900">{produto.precoAtual}</span>
                  </div>
                  <p className="text-xs text-green-600 font-semibold mt-1">{produto.parcelamento}</p>
                </div>

                {/* BOTÃO DE AÇÃO */}
                <a 
                  href={produto.linkAfiliado} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center mt-4 bg-[#FFC107] hover:bg-yellow-400 text-gray-900 font-black py-3 rounded-lg uppercase shadow-md transition"
                >
                  Ver Oferta 🔥
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* RODAPÉ */}
      <footer className="bg-gray-900 text-gray-500 text-center p-8 mt-12 border-t border-gray-800">
        <p>© 2025 Bombando Hoje. Curadoria de ofertas.</p>
      </footer>
    </div>
  );
} 