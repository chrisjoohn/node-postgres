const Pool = require("pg").Pool;
const pool = new Pool({
  user: "chrisjoohn",
  host: "localhost",
  database: "api",
  password: "iamsuperman",
  port: 5432
});

const getUsers = (req, res) => {
  pool.query("SELECT * FROM users", (err, result) => {
    if (err) {
      res.status(500).send(err);
    }

    res.status(200).json(result.rows);
  });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("SELECT * FROM users WHERE Id = $1", [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(result.rows);
  });
};

const createUser = (req, res) => {
  const { first_name, last_name, email, username } = req.body;

  pool.query(
    "INSERT INTO users(first_name, last_name, email, username) VALUES ($1, $2, $3, $4) RETURNING *",
    [first_name, last_name, email, username],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      let id = result.rows[0].id;
      res.status(200).send(id.toString());
    }
  );
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("DELETE FROM users WHERE Id = $1", [id], (err, result) => {
    if (err) {
        res.status(500).send(err);
    }
    res.status(200).send("USER SUCCESSFULLY DELETED");
  });
};

const updateUser = (req, res) => {
  const { id, first_name, last_name, email, username } = req.body;

  pool.query(
    "UPDATE users SET first_name=$1, last_name=$2, email=$3, username=$4 WHERE Id = $5",
    [first_name, last_name, email, username, id],
    (err, result) => {
      if(err){
        res.status(500).send(err);
      }
      res.status(200).send("SUCCESSFULLY UPDATED USER $1", [id]);
    }
  );
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser
};
