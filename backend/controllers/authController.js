const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
  // REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //Create new User
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      //Save to DataBase
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "40s" }
    );
  },
  //GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("Wrong Username!");
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json("Wrong Password!");
      }
      // Check username and password correct => đăng nhập
      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        // Gắn cookie -> refresh token
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // REDIS
  requestRefreshToken: (req, res) => {
    //take refresh from user
    const refreshToken = req.cookies.refreshToken;
    // res.status(200).json(refreshToken);
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid!");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      // create new access token and refresh token
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      // Gắn cookie -> refresh token
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  },

  // LOGOUT
  userLogout: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    return res.status(200).json("Logged out !");
  },
};

//  STORE TOKEN
// 1. LOCAL STORAGE DỄ BỊ TẤN CÔNG BỞI XSS
// 2. HTTP ONLY COOKIES: ÍT BỊ TẤN CÔNG XSS, BỊ TẤN CÔNG CSRF-> SAMESITE

//! 3. REDUX STORE LƯU ->  ACCESS TOKEN
//! VÀ HTTP ONLY CO0KIE -> REFRESH TOKEN

// BFF PATTERN (BACKEND FOR FRONTEND)

module.exports = authController;
