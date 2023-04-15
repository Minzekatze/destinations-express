import pool from "../db/pg.js";

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
    res.render("index2", {
      country: name,
      code2: alpha_two_code,
      code3: alpha_three_code,
      bo: visited,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
};

export {
  getCountries,
  postCountry,
  getCountryByCode,
  putCountry,
  deleteCountry,
  getCreateCountry,
  postCreateCountry,
};
