import dynamo from "dynamodb";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import { generateUUID } from "./util/uuid-generator.js";

dotenv.config();

dynamo.AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
  endpoint: process.env.AWS_ENDPOINT,
});

console.log("dynamo.js");
const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "vtex_products";

const getProdutos = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  return await dynamoClient.scan(params).promise();
};

const addProduto = async (produto) => {
  produto.id = generateUUID();
  const params = {
    TableName: TABLE_NAME,
    Item: produto,
  };

  return await dynamoClient.put(params).promise();
};

const updateProduto = async (produto) => {
    produto.quantidade++;
    const params = {
        TableName: TABLE_NAME,
        Item: produto,
      };
    
      return await dynamoClient.put(params).promise();
};

const getProdutoById = async (sku) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "sku = :sku",
    ExpressionAttributeValues: { ":sku": parseInt(sku) },
  };

  return await dynamoClient.scan(params).promise();
};

export { dynamoClient, getProdutos, getProdutoById, addProduto, updateProduto };
