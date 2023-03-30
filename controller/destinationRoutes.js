import { Router } from "express";
import {
  getCountries,
  getCountryByCode,
  postCountry,
  putCountry,
  deleteCountry,
  createCountry,
} from "../model/destinationModel.js";

const deRoutes = Router();

deRoutes.route("/").get(getCountries).post(postCountry);
deRoutes
  .route("/:code")
  .get(getCountryByCode)
  .put(putCountry)
  .delete(deleteCountry);
deRoutes.route("/create").post(createCountry);

export default deRoutes;
