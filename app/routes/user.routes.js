module.exports = (app) => {
  const userController = require("../controllers/user.controller");

  app.post("/api/login", userController.login);
  app.post("/api/register", userController.register);
  app.post("/api/preference", userController.setPreference);
  //app.get("/api/preference", userController.getPreference);
  app.get("/api/restaurant", userController.restaurant);
  app.get("/api/recommendation", userController.recommendation);
};
