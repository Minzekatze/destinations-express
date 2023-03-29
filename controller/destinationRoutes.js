import { Router } from "express";
import { getCountries, postCountry } from "../model/destinationModel.js";

const deRoutes = Router();

deRoutes.route("/").get(getCountries).post(postCountry);

export default deRoutes;
