import express from "express";
import cors from "cors";
import deRoutes from "./controller/destinationRoutes.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/countries", deRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
