import dynamo from "dynamodb";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import { generateUUID } from "./util/uuid-generator.js";
import { getProdutoByProductId } from "./services/catalogo.js";

dotenv.config();

dynamo.AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
  endpoint: process.env.AWS_ENDPOINT,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "vtex_products";

const getProdutos = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const response = await dynamoClient.scan(params).promise();

  const itens = response.Items;

  await Promise.all(itens.map(async (item) => {
    let listaDeProductId = item.itens;
    let produtos = [];
    
    await Promise.all(listaDeProductId.map(async (productId) => {
      let produto = await getProdutoByProductId(productId);
      // console.log("produto", produto.data);
      produtos.push(produto.data);
    }));
   
   item.produtos = produtos;
  }));

  
  return itens;
};

const processarCombo = async (produtos) => {
  ordenarLista(produtos);
  let combos = gerarCombos(produtos);
  salvarOuAtualizarCombos(combos);
};

function ordenarLista(produtos) {
  produtos.sort((item1, item2) => {
    let item1LowerCase = item1.productId.toLowerCase();
    let item2LowerCase = item2.productId.toLowerCase();

    if (item1LowerCase < item2LowerCase) {
      return -1;
    }
    if (item1LowerCase > item2LowerCase) {
      return 1;
    }
    return 0;
  });
}

function gerarCombos(produtos) {
  let listaDeCombinacoesDeID = [];
  for (let i = 0; i < produtos.length; i++) {
    for (let j = i + 1; j < produtos.length; j++) {
      let comboProdutoId = produtos[i].id + produtos[j].id;
      let combo = {
        comboProdutoId: comboProdutoId,
        itens: [produtos[i].id, produtos[j].id],
      };
      listaDeCombinacoesDeID.push(combo);
    }
  }
  return listaDeCombinacoesDeID;
}

function salvarOuAtualizarCombos(combos) {
  combos.map((combo) => {
    getComboByComboProdutoId(combo.comboProdutoId).then((data) => {
      if (data.Items.length === 0) {
        saveCombo(combo);
      } else {
        updateCombo(data.Items[0]);
      }
    });
  });
}

async function getComboByComboProdutoId(comboProdutoId) {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "comboProdutoId = :comboProdutoId",
    ExpressionAttributeValues: { ":comboProdutoId": comboProdutoId },
  };
  let combos = await dynamoClient.scan(params).promise();
  return combos;
}

async function saveCombo(combo) {
  combo.id = generateUUID();
  combo.quantidade = 1;
  const params = {
    TableName: TABLE_NAME,
    Item: combo,
  };
  return await dynamoClient.put(params).promise();
}

async function updateCombo(combo) {
  combo.quantidade++;
  const params = {
    TableName: TABLE_NAME,
    Item: combo,
  };

  return await dynamoClient.put(params).promise();
}

export { dynamoClient, getProdutos, processarCombo };
