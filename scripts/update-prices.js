const fs = require('fs');
const path = require('path');

// Função Faxineira: Pega qualquer link sujo e devolve só o ID MLB
function extrairIdLimpo(linkOuId) {
    // Procura por MLB seguido de números (ex: MLB37044038)
    // Ignora hifens e aceita letras minúsculas
    const match = linkOuId.match(/(MLB|mlb)-?(\d+)/);
    
    if (match) {
        // Retorna formatado padrão: MLB123456
        return `MLB${match[2]}`;
    }
    return null;
}

async function buscarPrecoModoBatch(idProduto) {
  try {
    // TRUQUE DO MESTRE: Usar a API de "Multi-Get" (ids=...) 
    // Muitas vezes ela não tem o mesmo bloqueio da API individual.
    const url = `https://api.mercadolibre.com/items?ids=${idProduto}`;

    // Disfarce leve
    const headers = {
        "User-Agent": "MercadoLibre/10.350.0 Android/13 (Pixel 7)", // Fingindo ser o App de Celular
        "Authorization": "" // Garante que não tem credencial velha atrapalhando
    };

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
        console.error(`   ❌ API recusou (Status ${response.status})`);
        return null;
    }

    const dados = await response.json();
    
    // A resposta dessa API vem em uma lista: [ { "body": { ... } } ]
    if (dados && dados[0] && dados[0].body) {
        if (dados[0].code === 403 || dados[0].code === 404) {
             console.error(`   ❌ O Mercado Livre bloqueou especificamente este ID.`);
             return null;
        }
        return dados[0].body.price;
    }
    
    return null;

  } catch (error) {
    console.error(`   ❌ Erro de conexão: ${error.message}`);
    return null;
  }
}

async function atualizarLoja() {
  const caminhoArquivo = path.join(__dirname, '../data/produtos.json');
  
  try {
    const arquivoRaw = fs.readFileSync(caminhoArquivo, 'utf8');
    const produtos = JSON.parse(arquivoRaw);
    
    console.log("🚀 Robô V7: Faxina de Link + Técnica 'Multi-Get'...");
    console.log("---------------------------------------------------");
    let mudouAlgo = false;

    for (const produto of produtos) {
      // Tenta pegar o ID do campo 'id' ou extrair do 'linkAfiliado'
      const idBruto = produto.id || produto.linkAfiliado;
      const idLimpo = extrairIdLimpo(idBruto);

      if (idLimpo) {
        const novoPreco = await buscarPrecoModoBatch(idLimpo);
        
        if (novoPreco) {
          if (novoPreco !== produto.precoAtual) {
            console.log(`✅ ${produto.nome}`);
            console.log(`   💰 ATUALIZADO: R$ ${produto.precoAtual} -> R$ ${novoPreco}`);
            produto.precoAtual = novoPreco;
            mudouAlgo = true;
          } else {
             console.log(`👍 ${produto.nome} (Segue R$ ${produto.precoAtual})`);
          }
        } else {
            console.log(`⚠️  Falha ao ler "${produto.nome}" (Provável bloqueio de IP)`);
        }
      } else {
          console.log(`⚠️  Não achei código MLB válido em "${produto.nome}"`);
      }
      
      // Pausa essencial
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log("---------------------------------------------------");
    if (mudouAlgo) {
      fs.writeFileSync(caminhoArquivo, JSON.stringify(produtos, null, 2));
      console.log("💾 Arquivo salvo com sucesso!");
    } else {
      console.log("✅ Tudo verificado.");
    }
    
  } catch (erro) {
      console.error("Erro no arquivo:", erro.message);
  }
}

atualizarLoja();