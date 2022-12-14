import express from "express";
import { getCombos, processarCombo } from "./awsDynamo.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => res.send("SPEEDWARE03"));

app.get("/combos", async (req, res) => {
  try {
    getCombos().then((data) => {
      return res.json(data);
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ err: "SERVER ERROR" });
  }
});

app.post("/combos" , async (req, res) => {
  try {
    console.log("VTEX ESCUTA DO EVENTO", req.body);
    const orderId = req.body.OrderId;
    await processarCombo(orderId);
    return res.status(200).json({SUCCESS: "Combo Registered Successfully!"})

  } catch (error) {
    console.error("error", error);
    res.status(500).json({ err: "SERVER ERROR" });
  }
});

app.listen(3000, () => console.log("Servidor Iniciado na porta 3000"));
