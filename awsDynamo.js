import dynamo from 'dynamodb';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

dynamo.AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
  endpoint:"http://dynamodb.us-east-1.amazonaws.com",
});

console.log("dynamo.js")
const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "vtex_products";

const getProdutos = async () => {
    /*const params = {
        TableName: TABLE_NAME,

    };
    console.log("produtos");
    const produtos = await dynamoClient.scan(params).promise();
	console.table("produtos",produtos);

    return produtos;*/


	var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

	var params = {
 	 TableName: TABLE_NAME,
 	 Key: {'id':"1"}
	};

	docClient.get(params, function(err, data) {
  	 if (err) {
    	 console.log("Error", err);
  	} else {
   	 console.log("Success", data.Item);
	 return data.Item;
  	}
	});
	var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
	}

const addProduto = async (produto) => {
    const params = {
        TableName: TABLE_NAME,
        Item: produto
    };

    return await dynamoClient.put(params).promise();
}

const getProdutoById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        key: {
            id
        }
    };

    return await dynamoClient.get(params).promise();
}

  export{
    dynamoClient,
    getProdutos,
    getProdutoById,
    addProduto
 }
