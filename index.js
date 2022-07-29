import express from "express";
import {getProdutos} from "./awsDynamo.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("SPEEDWARE03"));

app.get("/produtos", async (req, res) => {
  try {
    const produtos = await getProdutos();
	  console.log("produtos",produtos)
	  res.send(produtos);
  } catch (error) {
    console.error("error",error);
    res.status(500).json({ err: "Algo deu errado" });
  }
});

app.listen(3000, () => console.log("Servidor Iniciado na porta 3000"));
