import express from "express";
import { getProdutos, addProduto, getProdutoById, updateProduto } from "./awsDynamo.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("SPEEDWARE03"));

app.get("/produtos", async (req, res) => {
  try {
    getProdutos().then((data) => {
      console.log("produtos", data);
      return res.send(data);
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ err: "Algo deu errado" });
  }
});

// app.post("/produtos", async (req, res) => {
//   try {
//     console.log(req.body);
//     addProduto(req.body).then((data) => {
//       console.log("produtos", data);
//       return res.send(data).status(201);
//     });
//   } catch (error) {
//     console.error("error", error);
//     res.status(500).json({ err: "Algo deu errado" });
//   }
// });

app.put("/produtos", async (req, res) => {
  try {
    console.log(req.body);
    updateProduto(req.body).then((data) => {
      console.log("produtos", data);
      return res.send(data).status(201);
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ err: "Algo deu errado" });
  }
});

app.get("/produtos/:sku", async (req, res) => {
  try {
    console.log(req.params.sku);
    getProdutoById(req.params.sku).then((data) => {
      console.log("produtos", data);
      return res.send(data).status(200);
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ err: "Algo deu errado" });
  }
});


// Rota para escutar o evento
app.post("/combos", async (req, res) => {
  try {
    console.log(req.body);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ err: "Algo deu errado" });
  }
});

app.listen(3000, () => console.log("Servidor Iniciado na porta 3000"));
