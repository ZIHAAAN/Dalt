//const User = require("../models/user.model");
const config = require("../config/config.js");
const axios = require("axios");
const UserDb = require("../models/database.model.js");

// 封装 Promise 函数
const createNewUser = (user) => {
  return new Promise((resolve, reject) => {
    UserDb.create(user, (err, data) => {
      if (err) {
        reject(err); // 如果有错误，返回 reject
      } else {
        resolve(data); // 成功时，返回 resolve(data)
      }
    });
  });
};

exports.recommendation = async (req, res) => {};

//http://127.0.0.1:3000/restaurant?latitude=1&longitude=2&radius=3 (meter)
exports.restaurant = async (req, res) => {
  const { latitude, longitude, radius } = req.query;
  console.log(req.query);

  if (!latitude || !longitude || !radius) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required." });
  }

  const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
  let allResults = [];
  let nextPageToken = null;

  do {
    try {
      const url = nextPageToken
        ? `${baseUrl}?pagetoken=${nextPageToken}&key=${config.GoogleKey}`
        : `${baseUrl}?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${config.GoogleKey}`;

      if (nextPageToken)
        await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await axios.get(url);

      if (response.data.status === "OK") {
        allResults = allResults.concat(response.data.results);
        nextPageToken = response.data.next_page_token || null;
      } else {
        console.error(`Error: ${response.data.status}`);
        break;
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      break;
    }
  } while (nextPageToken);
  return res.json({ restaurants: allResults });
};
exports.setPreference = async (req, res) => {
  const {
    // 用户基本信息
    name, // 用户名
    age, // 用户年龄

    // 个人偏好
    preferredCuisines, // 喜爱的菜系（字符串，例如："Italian,Chinese"）
    excludedCuisines, // 不喜欢的菜系（字符串，例如："Vegan"）
    mealType, // 餐点类型（字符串，例如："dinner"）
    atmosphere, // 用餐氛围（字符串，例如："casual"）
    seatingPreferences, // 座位偏好（字符串，例如："indoor,pet-friendly"）

    // 基于位置的偏好
    maxDistance, // 最大距离半径（数字，例如："5"）
    travelBeyondRadius, // 是否愿意超出设定距离（布尔值 例如：true）
    frequentedAreas, // 常去的区域（字符串，例如："Downtown,West Side"）

    // 口味和生活方式偏好
    favoriteDishes, // 喜爱的菜品（字符串，例如："sushi,burgers"）
    dislikedDishes, // 不喜欢的菜品（字符串，例如："tofu"）
    diningTimes, // 用餐时间（字符串，例如："early dinner,late-night cravings"）
    diningCompanions, // 用餐伙伴（字符串，例如："family,friends"）

    // // 用户行为和反馈
    // ratingHistory,         // 用户评分历史（字符串，例如："Restaurant1:5,Restaurant2:4"）
    // orderHistory,          // 用户订单历史（字符串，例如："Sushi:2,Burgers:3"）

    //userFeedback, // 用户反馈（字符串，例如："Great service, love the atmosphere"）

    // 附加偏好
    cuisineExperimentation, // 是否愿意尝试新菜系（布尔值，例如：true）
    strictPreference, // 是否严格遵守偏好（布尔值，false）
    ambianceFeatures, // 环境功能偏好（字符串，例如："quiet,well-lit"）
    weatherSpecificPreferences, // 天气特定偏好（字符串，例如："summer:ice cream,winter:soup"）
  } = req.body;
  try {
    if (!req.session.user || !req.session.user.userId) {
      return res.status(401).send({ status: "Please log in." });
    }
    const userId = req.session.user.userId;
    console.log(req.body);
    await UserDb.setPreference(req.body, userId);

    return res.send({ status: "SUCCESS" });
  } catch (error) {
    console.log("Error when set preference", error);
  }
};
exports.getPreference = async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.userId) {
      return res.status(401).send({ status: "Please log in." });
    }
    const userId = req.session.user.userId;
    //console.log(req.body);
    let user = await UserDb.getUserByUserId(userId);
    delete user.password;
    console.log("user:", user);

    return res.send(user);
  } catch (error) {
    console.log("Error when get preference", error);
  }
};
exports.register = async (req, res) => {
  const { username, password } = req.body;
  //console.log(req.body);
  const user = new UserDb({
    username: username,
    password: password,
  });
  createNewUser(user)
    .then((user) => {
      console.log("User created successfully:", user);
      return res.send({ status: "SUCCESS" });
    })
    .catch((err) => {
      if (err.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .send({ status: "ERROR", message: "User already exists." });
      } else {
        console.error("Error creating user:", err);
        return res
          .status(500)
          .send({ status: "ERROR", message: "Something went wrong." });
      }
    });
};
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate request body
    if (!username || !password) {
      return res.status(400).send({
        status: "FAIL",
        message: "Username and password are required.",
      });
    }

    // Fetch user details from the database
    // const userQuery = 'SELECT * FROM users WHERE username = ?';
    // const [user] = await db.query(userQuery, [username]);
    //let result;
    const user = await UserDb.getUserByUsername(username);
    console.log("user:", user);

    if (user.kind === "not_found") {
      console.log("User not found");
      return res
        .status(401)
        .send({ status: "FAIL", message: "Invalid username or password." });
    } else {
      console.log("User found:", user);
    }

    // Set session data
    req.session.user = {
      userId: user.user_id,
      username: user.username,
    };

    // Send success response
    return res
      .status(200)
      .send({ status: "SUCCESS", message: "Login successful." });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .send({ status: "ERROR", message: "An error occurred during login." });
  }
};
