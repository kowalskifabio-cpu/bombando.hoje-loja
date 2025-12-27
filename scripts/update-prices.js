const fs = require('fs');
const path = require('path');

// Função para buscar preço real na API do Mercado Livre
async function buscarPrecoReal(linkAfiliado) {
  try {
    // 1. Segue o link de afiliado para descobrir o código MLB
    const response = await fetch(linkAfiliado, { redirect: 'follow' });
    const urlFinal = response.url;
    
    // Procura por MLB... na URL
    const match = urlFinal.match(/MLB-?(\d+)/);
    if (!match) return null;
    
    const idProduto = `MLB${match[1]}`;
    
    // 2. Consulta a API oficial
    const apiResponse = await fetch(`https://api.mercadolibre.com/items/${idProduto}`);
    const dados = await apiResponse.json();
    
    return dados.price; // Retorna o preço numérico (ex: 3899)
  } catch (error) {
    console.error(`Erro no link: ${linkAfiliado}`);
    return null;
  }
}

async function atualizarLoja() {
  const caminhoArquivo = path.join(__dirname, '../data/produtos.json');
  
  // 1. Ler o arquivo JSON atual
  const arquivoRaw = fs.readFileSync(caminhoArquivo, 'utf8');
  const produtos = JSON.parse(arquivoRaw);
  
  console.log("🕵️ Robô iniciado: Buscando preços atualizados...");
  let mudouAlgo = false;

  // 2. Varrer cada produto
  for (const produto of produtos) {
    if (produto.linkAfiliado) {
      const novoPreco = await buscarPrecoReal(produto.linkAfiliado);
      
      // Se achou preço e ele é diferente do atual
      if (novoPreco && novoPreco !== produto.precoAtual) {
        console.log(`✅ Atualizando ${produto.nome}: De R$${produto.precoAtual} para R$${novoPreco}`);
        produto.precoAtual = novoPreco;
        mudouAlgo = true;
      }
    }
  }

  // 3. Salvar no arquivo se houve mudança
  if (mudouAlgo) {
    fs.writeFileSync(caminhoArquivo, JSON.stringify(produtos, null, 2));
    console.log("💾 Arquivo produtos.json atualizado com sucesso!");
  } else {
    console.log("👍 Tudo atualizado. Nenhuma mudança de preço detectada.");
  }
}

atualizarLoja();