import dynamo from "dynamodb";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import { generateUUID } from "./util/uuid-generator.js";
import { getProductById } from "./services/catalog.js";
import { getOrderById } from "./services/order.js";

dotenv.config();

dynamo.AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
  endpoint: process.env.AWS_ENDPOINT,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "vtex_products";

const getCombos = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const response = await dynamoClient.scan(params).promise();

  const items = response.Items;

  console.log("Items", items);

  await Promise.all(items.map(async (combo) => {
    let productIdList = combo.items;
    let products = [];
    
    console.log("productIslist", productIdList);
    await Promise.all(productIdList.map(async (productId) => {
      let product = await getProductById(productId);
      products.push(product.data);
    }));
   
    combo.prodOneId = products[0].productId;
    combo.prodTwoId = products[1].productId;
    combo.prodOneName = products[0].name;
    combo.prodTwoName = products[1].name;
  }));

  
  return items;
};

const processCombos = async (orderId) => {
  const { data } = await getOrderById(orderId);
  const products = data.items;
  if (products.length <= 0) {
    return;
  }
  sortListByProductId(products);
  let combos = generateCombos(products);
  salvarOuAtualizarCombos(combos);
};

function sortListByProductId(products) {
  products.sort((product1, product2) => {
    if (product1.productId < product2.productId) {
      return -1;
    }
    if (product1.productId > product2.productId) {
      return 1;
    }
    return 0;
  });
}

function generateCombos(products) {
  let listOfProductIdCombinations = [];
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      let comboProductId = products[i].id + products[j].id;
      let combo = {
        comboProductId: comboProductId,
        items: [products[i].id, products[j].id],
      };
      listOfProductIdCombinations.push(combo);
    }
  }
  return listOfProductIdCombinations;
}

function salvarOuAtualizarCombos(combos) {
  combos.map((combo) => {
    getComboByComboProductId(combo.comboProductId).then((data) => {
      if (data.Items.length === 0) {
        saveCombo(combo);
      } else {
        let comboTobeUpdated = data.Items[0]
        comboTobeUpdated.amount++;
        updateCombo(comboTobeUpdated);
      }
    });
  });
}

async function getComboByComboProductId(comboProductId) {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "comboProductId = :comboProductId",
    ExpressionAttributeValues: { ":comboProductId": comboProductId },
  };
  let combos = await dynamoClient.scan(params).promise();
  return combos;
}

async function saveCombo(combo) {
  combo.id = generateUUID();
  combo.amount = 1;
  combo.available=false;
  const params = {
    TableName: TABLE_NAME,
    Item: combo,
  };
  return await dynamoClient.put(params).promise();
}

async function updateCombo(combo) {
  const params = {
    TableName: TABLE_NAME,
    Item: combo,
  };

  return await dynamoClient.put(params).promise();
}


const setCombosAvailability = async (combos) => {
  console.log("set combo availability")
  combos.map((comboId) => {
    getComboById(comboId).then((data) => {
      if (data.Items.length > 0) {
        data.Items[0].available = !data.Items[0].available;
        updateCombo(data.Items[0]);
      }
    });
  });
};

async function getComboById(comboId) {
  var params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "id = :comboId",
    ExpressionAttributeValues: {
      ":comboId": comboId
    } 
   };
  let data = await dynamoClient.query(params).promise();
  return data;
}

const getAvailableCombos = async () => {
  console.log("Available Combos");
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "available = :available",
    ExpressionAttributeValues: { ":available": true },
  };
  const response = await dynamoClient.scan(params).promise();

  const items = response.Items;

  console.log("Items", items);

  await Promise.all(items.map(async (combo) => {
    let productIdList = combo.items;
    let products = [];
    
    console.log("productIslist", productIdList);
    await Promise.all(productIdList.map(async (productId) => {
      let product = await getProductById(productId);
      products.push(product.data);
    }));
   
    combo.products = products;
  }));

  
  return items;
}

export { dynamoClient, getCombos, processCombos, setCombosAvailability, getAvailableCombos };
