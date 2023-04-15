import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import deRoutes from "./controller/destinationRoutes.js";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.set("view engine", "ejs");

app.use("/.netlify/functions/index", deRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export const handler = serverless(app);
