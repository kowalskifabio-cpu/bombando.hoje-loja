'use client';

import React, { useState } from 'react';

export default function AdminPage() {
  const [form, setForm] = useState({
    nome: '',
    img: '',
    precoAntigo: '',
    precoAtual: '',
    parcelamento: '10x sem juros',
    linkAfiliado: '',
    categoria: 'Geral'
  });

  const [resultado, setResultado] = useState('');

  // A CORREÇÃO ESTÁ AQUI: Adicionei ": any" para o sistema aceitar qualquer coisa
  const formatarPreco = (valor: any) => {
    if (!valor) return 0;
    // Converte para texto caso venha como número, para evitar erros
    const textoValor = String(valor);
    const numeroLimpo = textoValor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    return numeroLimpo;
  };

  const gerarCodigo = () => {
    const idUnico = Date.now(); 
    
    const precoAntigoFormatado = formatarPreco(form.precoAntigo);
    const precoAtualFormatado = formatarPreco(form.precoAtual);

    const codigoPronto = `
  {
    "id": ${idUnico},
    "nome": "${form.nome}",
    "img": "${form.img}",
    "precoAntigo": ${precoAntigoFormatado},
    "precoAtual": ${precoAtualFormatado},
    "parcelamento": "${form.parcelamento}",
    "linkAfiliado": "${form.linkAfiliado}",
    "categoria": "${form.categoria}",
    "destaque": true
  },`;
    
    setResultado(codigoPronto);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-black mb-6 text-[#111827]">
          Gestão <span className="text-[#FFC107]">Bombando Hoje</span> 🔥
        </h1>
        <p className="mb-4 text-gray-600">Agora o sistema aceita qualquer formato de preço sem travar.</p>
        
        <div className="space-y-4">
          
          <div>
            <label className="block font-bold mb-1">Nome do Produto</label>
            <input 
              className="w-full p-3 border rounded bg-gray-50" 
              placeholder="Ex: Samsung Galaxy S24"
              onChange={e => setForm({...form, nome: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Preço Antigo</label>
              <input 
                className="w-full p-3 border rounded bg-gray-50" 
                placeholder="Ex: 6.999,00"
                onChange={e => setForm({...form, precoAntigo: e.target.value})}
              />
            </div>
            <div>
              <label className="block font-bold mb-1">Preço Atual</label>
              <input 
                className="w-full p-3 border rounded bg-gray-50 border-green-500" 
                placeholder="Ex: 4.513,00"
                onChange={e => setForm({...form, precoAtual: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Link da Imagem</label>
            <input 
              className="w-full p-3 border rounded bg-gray-50" 
              placeholder="https://..."
              onChange={e => setForm({...form, img: e.target.value})}
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Link de Afiliado</label>
            <input 
              className="w-full p-3 border rounded bg-gray-50" 
              placeholder="Seu link do ML aqui..."
              onChange={e => setForm({...form, linkAfiliado: e.target.value})}
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Categoria</label>
            <select 
              className="w-full p-3 border rounded bg-gray-50"
              onChange={e => setForm({...form, categoria: e.target.value})}
            >
              <option>Geral</option>
              <option>Computadores</option>
              <option>Celulares</option>
              <option>Periféricos</option>
              <option>Áudio</option>
              <option>Casa Inteligente</option>
            </select>
          </div>

          <button 
            onClick={gerarCodigo}
            className="w-full bg-[#FFC107] hover:bg-yellow-400 text-black font-black py-4 rounded-lg uppercase shadow mt-4 transition"
          >
            Gerar Código Seguro
          </button>

        </div>

        {resultado && (
          <div className="mt-8 bg-gray-900 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto">
            <p className="text-white font-sans font-bold mb-2">Copie e cole no final do arquivo data/produtos.js:</p>
            <pre>{resultado}</pre>
          </div>
        )}

      </div>
    </div>
  );
}