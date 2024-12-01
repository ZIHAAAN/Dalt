//const User = require("../models/user.model");
const config = require("../config/config.js");
const axios = require("axios");
const UserDb = require("../models/database.model.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

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

exports.recommendationByLocation = async (req, res) => {
  //const {} = req.body;

  const prompt =
    'Select the top three restaurants from the json array below:{"restaurants":[{"business_status":"OPERATIONAL","geometry":{"location":{"lat":-37.7497315,"lng":175.2784954},"viewport":{"northeast":{"lat":-37.74837197010727,"lng":175.2799468798927},"southwest":{"lat":-37.75107162989271,"lng":175.2772472201073}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png","icon_background_color":"#FF9E67","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet","name":"Hungry Wok","opening_hours":{"open_now":true},"photos":[{"height":3024,"html_attributions":["<a href=\\"https://maps.google.com/maps/contrib/101671028822578499346\\">Marcelo Lourenço da Silva</a>"],"photo_reference":"AdDdOWr9ia_hIRABILRGfRdlM4w6YF99X9WVzXIzlmwDn0N5KAKWD1Orp0H8MqTaNXBWd1mokvAMQy4c16KA3uvtuwh2LqSDhEASwy2C1A9LatcXhB4bIvD9kH9TBNJcM_iIX_sbB8NEfW1l3RvXm4NYvslou2op8UZaMd6WiUA47yfTVP3h","width":4032}],"place_id":"ChIJycA1fv4ibW0RsMZw-OVr8h0","plus_code":{"compound_code":"772H+49 Hamilton","global_code":"4VJQ772H+49"},"rating":2.1,"reference":"ChIJycA1fv4ibW0RsMZw-OVr8h0","scope":"GOOGLE","types":["restaurant","food","point_of_interest","establishment"],"user_ratings_total":57,"vicinity":"201 Hukanui Rd, Chartwell, Hamilton"},{"business_status":"OPERATIONAL","geometry":{"location":{"lat":-37.789564,"lng":175.2990237},"viewport":{"northeast":{"lat":-37.78814012010728,"lng":175.3003507798927},"southwest":{"lat":-37.79083977989273,"lng":175.2976511201073}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png","icon_background_color":"#FF9E67","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet","name":"Lucky Chinese & European Takeaway","opening_hours":{"open_now":true},"photos":[{"height":3023,"html_attributions":["<a href=\\"https://maps.google.com/maps/contrib/115141284467488735792\\">Abbi Pritchardjones</a>"],"photo_reference":"AdDdOWqr_pDq94yE42ct5Un2mhvmNvQQ0WoqftqEvli4peIQYa95r0eozpuaOUFfu8RfGup3NK9vHDXuF4yGNgFyil87ILBiFTn_d0Gq2w3efbPtGkdcxXgbETUUrBguXS5WlIkwU4gZ0yYLIeqVyAUZxv1ukTDocq1vM-chKiIoKEM4HWdC","width":3899}],"place_id":"ChIJJeAi9sUYbW0Rxw27HGDr_jc","plus_code":{"compound_code":"676X+5J Hamilton","global_code":"4VJQ676X+5J"},"rating":3.7,"reference":"ChIJJeAi9sUYbW0Rxw27HGDr_jc","scope":"GOOGLE","types":["meal_takeaway","restaurant","food","point_of_interest","establishment"],"user_ratings_total":155,"vicinity":"Unit 2/5 Peachgrove Rd, Hamilton East, Hamilton"},{"business_status":"OPERATIONAL","geometry":{"location":{"lat":-37.7651471,"lng":175.27912},"viewport":{"northeast":{"lat":-37.76373617010728,"lng":175.2803812298928},"southwest":{"lat":-37.76643582989272,"lng":175.2776815701073}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png","icon_background_color":"#FF9E67","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet","name":"China Takeaways","opening_hours":{"open_now":true},"photos":[{"height":2250,"html_attributions":["<a href=\\"https://maps.google.com/maps/contrib/114074010124683332063\\">Asanka Sandaruwan</a>"],"photo_reference":"AdDdOWqTKPtNFzSjUCexNBWiHun7LRj-SvZEbI3PA0XP39SyyFmNFnHpwGUSuxxknHvLHosgtVdLeBwy4j4j_85HvpGOVFDbmOXikgz0VwRNG5P7KbdP9W9vOfSbB36lPZ6DrfM0zUUbznBJPaAxAV2MZaYU6XPW00dlR4ISuKv8QekUftHf","width":4000}],"place_id":"ChIJMbna9YQYbW0Rgflb3wC-i9Q","plus_code":{"compound_code":"67MH+WJ Hamilton","global_code":"4VJQ67MH+WJ"},"price_level":1,"rating":4.4,"reference":"ChIJMbna9YQYbW0Rgflb3wC-i9Q","scope":"GOOGLE","types":["restaurant","food","point_of_interest","establishment"],"user_ratings_total":57,"vicinity":"168 Clarkin Rd, Fairfield, Hamilton"},{"business_status":"OPERATIONAL","geometry":{"location":{"lat":-37.7952028,"lng":175.2612},"viewport":{"northeast":{"lat":-37.79371992010728,"lng":175.2625375798927},"southwest":{"lat":-37.79641957989272,"lng":175.2598379201073}}},"icon":"https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png","icon_background_color":"#FF9E67","icon_mask_base_uri":"https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet","name":"SK LUNCH BAR AND TAkEAWAY","opening_hours":{"open_now":true},"photos":[{"height":3024,"html_attributions":["<a href=\\"https://maps.google.com/maps/contrib/116451076710567673005\\">Rabita Saleh</a>"],"photo_reference":"AdDdOWrHTHzAafieWH_ohGa5QxQPVTrJswk7ql7CWkftLHeRBCV009JJEpaD9gLmcY61vzCKvGB8x6IXFHfRQhX3m4RC-p2yM12hwJdUA7fmWDvTtTmKK5Iu6BLDRA3OOGortzWMntkUWFQpRu-B68Nc9GyIYaxAwZTboqIMEhaTPwmJ61xl","width":4032}],"place_id":"ChIJYV07xRwibW0R6kSMDvjMp-E","plus_code":{"compound_code":"6736+WF Hamilton","global_code":"4VJQ6736+WF"},"price_level":1,"rating":4.3,"reference":"ChIJYV07xRwibW0R6kSMDvjMp-E","scope":"GOOGLE","types":["restaurant","food","point_of_interest","establishment"],"user_ratings_total":153,"vicinity":"85 Killarney Rd, Frankton, Hamilton"}]}';
  const genAI = new GoogleGenerativeAI(config.GeminiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
};

//http://127.0.0.1:3000/restaurant?latitude=1&longitude=2&radius=3 (meter)
//cuisine could be empty
exports.restaurant = async (req, res) => {
  let { latitude, longitude, radius, cuisine, opennow } = req.query;
  console.log(req.query);

  if (!latitude || !longitude || !radius) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required." });
  }
  if (cuisine) {
    cuisine = `&keyword=${cuisine}`;
  }
  if (opennow) {
    opennow = `&opennow=${opennow}`;
  }
  const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
  let allResults = [];
  let nextPageToken = null;

  do {
    try {
      const url = nextPageToken
        ? `${baseUrl}?pagetoken=${nextPageToken}&key=${config.GoogleKey}`
        : `${baseUrl}?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${config.GoogleKey}${cuisine}${opennow}`;

      if (nextPageToken)
        await new Promise((resolve) => setTimeout(resolve, 1500));

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
