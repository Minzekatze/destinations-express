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
import {
  checkEmpty,
  validInput,
  duplicatedEntry,
  findCountry,
  realCode,
} from "../middleware/destinationMiddleware.js";

const deRoutes = Router();

deRoutes
  .route("/")
  .get(getCountries)
  .post(checkEmpty, validInput, realCode, duplicatedEntry, postCountry);
deRoutes
  .route("/create")
  .get(getCreateCountry)
  .post(checkEmpty, validInput, realCode, duplicatedEntry, postCreateCountry);
deRoutes
  .route("/:code")
  .get(findCountry, getCountryByCode)
  .put(
    findCountry,
    checkEmpty,
    validInput,
    realCode,
    duplicatedEntry,
    putCountry
  )
  .delete(findCountry, deleteCountry);

export default deRoutes;
