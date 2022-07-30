import express from "express";
import { getProdutos, processarCombo } from "./awsDynamo.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("SPEEDWARE03"));

app.get("/combos", async (req, res) => {
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

// Rota para escutar o evento
app.post("/combos", async (req, res) => {
  try {
    if (req.body.produtos.length == 0) {
      return res.status(400).json({err: "BAD REQUEST"})
    } 

    processarCombo(req.body.produtos);
    return res.status(200).json({ok: "SUCCESS"})

  } catch (error) {
    console.error("error", error);
    res.status(500).json({ err: "Algo deu errado" });
  }
});

app.listen(3000, () => console.log("Servidor Iniciado na porta 3000"));
