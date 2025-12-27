const fs = require('fs');
const path = require('path');

// Função: Vai na API usando o ID, mas com "crachá" de navegador
async function buscarPrecoPeloID(idProduto) {
  try {
    // 1. Limpeza do ID
    const idLimpo = idProduto.replace('-', '').trim();

    // 2. O DISFARCE (Essencial para não dar erro 403)
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json"
    };

    // 3. Chamada à API com os cabeçalhos
    const response = await fetch(`https://api.mercadolibre.com/items/${idLimpo}`, { headers });
    
    if (!response.ok) {
        // Se der erro, mostra qual foi
        console.error(`   ❌ Erro ML (ID: ${idLimpo}): Código ${response.status}`);
        return null;
    }

    const dados = await response.json();
    return dados.price; // Retorna o preço
  } catch (error) {
    console.error(`   ❌ Falha de conexão: ${error.message}`);
    return null;
  }
}

async function atualizarLoja() {
  const caminhoArquivo = path.join(__dirname, '../data/produtos.json');
  
  try {
    const arquivoRaw = fs.readFileSync(caminhoArquivo, 'utf8');
    const produtos = JSON.parse(arquivoRaw);
    
    console.log("🚀 Robô V5 iniciado: ID Direto + Disfarce...");
    console.log("---------------------------------------------------");
    let mudouAlgo = false;

    for (const produto of produtos) {
      if (produto.id) {
        const novoPreco = await buscarPrecoPeloID(produto.id);
        
        if (novoPreco) {
          if (novoPreco !== produto.precoAtual) {
            console.log(`✅ ATUALIZADO: ${produto.nome}`);
            console.log(`   💰 De R$ ${produto.precoAtual} para R$ ${novoPreco}`);
            produto.precoAtual = novoPreco;
            mudouAlgo = true;
          } else {
             console.log(`👍 ${produto.nome} (Preço igual: R$ ${produto.precoAtual})`);
          }
        } else {
            // Se falhou (deu null), avisa que manteve o antigo por erro
            console.log(`⚠️  Erro ao ler "${produto.nome}" - Mantido preço antigo.`);
        }
      } else {
          console.log(`⚠️  Pulei "${produto.nome}" (Sem ID cadastrado).`);
      }
      
      // Pausa de segurança de 1 segundo entre consultas
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log("---------------------------------------------------");
    if (mudouAlgo) {
      fs.writeFileSync(caminhoArquivo, JSON.stringify(produtos, null, 2));
      console.log("💾 Tabela de preços salva com sucesso!");
    } else {
      console.log("✅ Tudo verificado. Nenhuma alteração necessária.");
    }
    
  } catch (erro) {
      console.error("Erro no arquivo:", erro.message);
  }
}

atualizarLoja();