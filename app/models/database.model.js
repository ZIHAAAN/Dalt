const db = require("./db");

const UserDb = function (UserDb) {
  this.user_id = Date.now() + Math.floor(Math.random() * 1000);
  this.username = UserDb.username;
  this.password = UserDb.password;
  //...
};
UserDb.create = function (newUser, result) {
  try {
    db.query("INSERT INTO user SET ?", newUser, (err, res) => {
      if (err) {
        console.log("SQL error: " + err);
        result(err, null);
        return;
      }
      result(null, newUser);
    });
  } catch {
    console.log("Something went wrong when creating.");
  }
};
UserDb.getUserByUsername = function (username) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM user WHERE username = ?",
      [username],
      (err, res) => {
        if (err) {
          // Log the error and reject the promise
          console.error("SQL error: ", err);
          reject(err);
          return;
        }

        if (res.length) {
          // Resolve with the found user
          resolve(res[0]);
        } else {
          // Resolve with a "not found" kind object
          resolve({ kind: "not_found" });
        }
      }
    );
  });
};
module.exports = UserDb;
