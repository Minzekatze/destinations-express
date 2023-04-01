import pool from "../db/pg.js";
import validator from "validator";

const getCountries = async (req, res) => {
  try {
    const visited = req.query.visited;
    const sort = req.query.sort;
    if (visited === "true") {
      // const newQuery = "SELECT COUNT(name) from destination ORDER BY name ASC";
      const newQuery2 = "SELECT * from destination WHERE visited = TRUE";
      const { rows: desti2 } = await pool.query(newQuery2);
      res.json(desti2);
    } else if (visited === "false") {
      const newQuery3 = "SELECT * from destination WHERE visited = FALSE";
      const { rows: desti3 } = await pool.query(newQuery3);
      res.json(desti3);
    } else if (sort === "true") {
      const sortQuery = "SELECT * from destination ORDER BY name ASC";
      const { rows: desti4 } = await pool.query(sortQuery);
      res.json(desti4);
    } else {
      const myQuery = "SELECT * from destination";
      const { rows: desti } = await pool.query(myQuery);
      res.json(desti);
    }
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
};

const postCountry = async (req, res) => {
  try {
    const { name, alpha_two_code, alpha_three_code, visited } = req.body;
    // validating(name, alpha_two_code, alpha_three_code)
    //   .then((response) => {
    //     if (response) return res.json({ error: response });
    //   })
    //   .catch((error) => console.log(error));

    if (!name || !alpha_two_code || !alpha_three_code || !visited)
      return res.json({ error: "missing data" });

    const validCodeTwo = validator.isLength(alpha_two_code, { min: 2, max: 2 });
    const validCodeThree = validator.isLength(alpha_three_code, {
      min: 3,
      max: 3,
    });

    if (!validCodeTwo || !validCodeThree)
      return res.json({ error: "invalid value" });

    const { rows: answerN } = await pool.query(
      "SELECT COUNT(name) from destination WHERE name = $1",
      [name]
    );
    const { rows: answerTwo } = await pool.query(
      "SELECT COUNT(alpha_two_code) from destination WHERE alpha_two_code = $1",
      [alpha_two_code]
    );
    const { rows: answerThre } = await pool.query(
      "SELECT COUNT(alpha_three_code) from destination WHERE alpha_three_code = $1",
      [alpha_three_code]
    );
    if (
      answerN[0].count > 0 ||
      answerTwo[0].count > 0 ||
      answerThre[0].count > 0
    )
      return res.json({ error: "item already exists" });
    const myQuery =
      "INSERT INTO destination (name, alpha_two_code, alpha_three_code, visited) VALUES ($1, $2, $3, $4) RETURNING *";
    const {
      rows: [desti],
    } = await pool.query(myQuery, [
      name,
      alpha_two_code,
      alpha_three_code,
      visited,
    ]);
    res.status(201).json(desti);
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
};

const getCountryByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const myQuery =
      "SELECT * FROM destination WHERE alpha_two_code = $1 OR alpha_three_code = $1";
    const { rows: country } = await pool.query(myQuery, [code.toUpperCase()]);
    if (country.length === 0)
      return res.json({ error: "no matching item found" });
    res.json(country);
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
};
const putCountry = async (req, res) => {
  try {
    const { code } = req.params;
    const { name, alpha_two_code, alpha_three_code, visited } = req.body;
    if (!name || !alpha_two_code || !alpha_three_code || !visited)
      return res.json({ error: "missing values" });

    const validCodeTwo = validator.isLength(alpha_two_code, { min: 2, max: 2 });
    const validCodeThree = validator.isLength(alpha_three_code, {
      min: 3,
      max: 3,
    });
    if (!validCodeTwo || !validCodeThree)
      return res.json({ error: "invalid value" });

    const myQuery =
      "UPDATE destination SET name = $1, alpha_two_code = $2, alpha_three_code = $3, visited = $4 WHERE alpha_two_code = $5 OR alpha_three_code = $5 RETURNING *";
    const {
      rows: [country],
    } = await pool.query(myQuery, [
      name,
      alpha_two_code,
      alpha_three_code,
      visited,
      code.toUpperCase(),
    ]);
    console.log(country);
    if (!country) return res.json({ error: "no matching item found" });
    res.json(country);
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
};

const deleteCountry = async (req, res) => {
  const { code } = req.params;

  // const myQuery =
  //   "Delete FROM destination WHERE alpha_two_code = $1 OR alpha_three_code = $1 RETURNING *";
  const myQuery2 =
    "UPDATE destination SET visited = true WHERE alpha_two_code = $1 OR alpha_three_code = $1 RETURNING *";
  const { rows: country } = await pool.query(myQuery2, [code.toUpperCase()]);
  if (country.length === 0)
    return res.json({ error: "no matching item found" });
  res.json(country);
};

const getCreateCountry = async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
};

const postCreateCountry = async (req, res) => {
  try {
    console.log(req.body);
    const { name, alpha_two_code, alpha_three_code, visited } = req.body;
    const myQuery =
      "INSERT INTO destination (name, alpha_two_code, alpha_three_code, visited) VALUES ($1, $2, $3, $4) RETURNING *";
    const {
      rows: [desti],
    } = await pool.query(myQuery, [
      name,
      alpha_two_code,
      alpha_three_code,
      visited,
    ]);
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
};

// const validating = async (one, two, three) => {
//   if (!one || !two || !three) return "missing data";

//   const validCodeTwo = validator.isLength(two, { min: 2, max: 2 });
//   const validCodeThree = validator.isLength(three, {
//     min: 3,
//     max: 3,
//   });
//   if (!validCodeTwo || !validCodeThree) return "invalid value";

//   const { rows: answerN } = await pool.query(
//     "SELECT COUNT(name) from destination WHERE name = $1",
//     [one]
//   );
//   const { rows: answerTwo } = await pool.query(
//     "SELECT COUNT(alpha_two_code) from destination WHERE name = $1",
//     [two]
//   );
//   const { rows: answerThre } = await pool.query(
//     "SELECT COUNT(alpha_three_code) from destination WHERE name = $1",
//     [three]
//   );
//   if (answerN[0].count > 0 || answerTwo[0].count > 0 || answerThre[0].count > 0)
//     return "item already exists";

//   return false;
// };

export {
  getCountries,
  postCountry,
  getCountryByCode,
  putCountry,
  deleteCountry,
  getCreateCountry,
  postCreateCountry,
};
