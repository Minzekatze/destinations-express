import { Router } from "express";
import {
  getCountries,
  getCountryByCode,
  postCountry,
  putCountry,
  deleteCountry,
  getCreateCountry,
  postCreateCountry,
} from "../model/destinationModel.js";

const deRoutes = Router();

deRoutes.route("/").get(getCountries).post(postCountry);
deRoutes
  .route("/:code")
  .get(getCountryByCode)
  .put(putCountry)
  .delete(deleteCountry);
deRoutes.route("/create").get(getCreateCountry).post(postCreateCountry);

export default deRoutes;
