import pool from "../db/pg.js";
import validator from "validator";

const findCountry = async (req, res, next) => {
  const { code } = req.params;
  const myQuery =
    "SELECT * FROM destination WHERE alpha_two_code = $1 OR alpha_three_code = $1";
  const { rows: country } = await pool.query(myQuery, [code.toUpperCase()]);
  if (country.length === 0) return next("no match found");
  return next();
};

const checkEmpty = (req, res, next) => {
  const { name, alpha_two_code, alpha_three_code, visited } = req.body;
  if (!name || !alpha_two_code || !alpha_three_code || !visited)
    return next("missing data");
  return next();
};
const validInput = (req, res, next) => {
  const { alpha_two_code, alpha_three_code, visited } = req.body;
  const validCodeTwo = validator.isLength(alpha_two_code, { min: 2, max: 2 });
  const validCodeThree = validator.isLength(alpha_three_code, {
    min: 3,
    max: 3,
  });
  const validVisited = validator.isBoolean(visited);
  if (!validCodeTwo || !validCodeThree || !validVisited)
    return next("invalid value");
  return next();
};

const realCode = async (req, res, next) => {
  const { alpha_two_code, alpha_three_code } = req.body;
  const validTwoCode = validator.isISO31661Alpha2(alpha_two_code);
  const validThreeCode = validator.isISO31661Alpha3(alpha_three_code);
  if (!validTwoCode || !validThreeCode) return next("invalid code");
  return next();
};

const duplicatedEntry = async (req, res, next) => {
  const { name, alpha_two_code, alpha_three_code } = req.body;
  const { rows: answerN } = await pool.query(
    "SELECT COUNT(name) from destination WHERE name = $1",
    [name]
  );
  const { rows: answerTwo } = await pool.query(
    "SELECT COUNT(alpha_two_code) from destination WHERE name = $1",
    [alpha_two_code]
  );
  const { rows: answerThre } = await pool.query(
    "SELECT COUNT(alpha_three_code) from destination WHERE name = $1",
    [alpha_three_code]
  );
  if (answerN[0].count > 0 || answerTwo[0].count > 0 || answerThre[0].count > 0)
    return next("item already exists");
  return next();
};

const errorHandler = async (err, req, res, next) => {
  console.log(err);
  return res.status(400).json({ error: err.message });
};

export {
  checkEmpty,
  validInput,
  duplicatedEntry,
  errorHandler,
  findCountry,
  realCode,
};
