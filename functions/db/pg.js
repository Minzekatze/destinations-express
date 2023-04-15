import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    "postgres://waaomnnk:n-DY1rLnW3Ei0VxkjYOiMrx3vVuBhmsO@trumpet.db.elephantsql.com/waaomnnk",
});

export default pool;
