import pool from "../db/pg.js";

const getCountries = async (req, res) => {
  try {
    const sort = req.query.sort;
    if (!sort) {
      const myQuery = "SELECT * from destination";
      const { rows: desti } = await pool.query(myQuery);
      res.json(desti);
    } else {
      const newQuery = "SELECT COUNT(name) from destination ORDER BY name ASC";
      const { rows: desti2 } = await pool.query(newQuery);
      res.json(desti2);
    }
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
};

const postCountry = async (req, res) => {
  try {
    const { name, alpha_two_code, alpha_three_code } = req.body;
    if (!name || !alpha_two_code || !alpha_three_code)
      return res.json({ error: "missing data" });

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
    if (
      answerN[0].count > 0 ||
      answerTwo[0].count > 0 ||
      answerThre[0].count > 0
    )
      return res.json({ error: "item already exists" });

    const myQuery =
      "INSERT INTO destination (name, alpha_two_code, alpha_three_code) VALUES ($1, $2, $3) RETURNING *";
    const {
      rows: [desti],
    } = await pool.query(myQuery, [name, alpha_two_code, alpha_three_code]);
    res.status(201).json(desti);
  } catch (error) {
    console.log(error.message);
    res.json({ error: error.message });
  }
};

export { getCountries, postCountry };
