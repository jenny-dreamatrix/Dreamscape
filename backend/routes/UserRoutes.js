import { Router } from "express";
import multer from "multer";
import User from "../models/UserModel.js";
import { authenticateToken, generateAccessToken } from "../token/authToken.js";
import { createResetToken, validateResetToken } from "../token/ResetTokenModel.js";

export const userRouter = Router();

const multerMiddleware = multer();

// get all users -----------------------------------------------------------------------------------------------

userRouter.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// signup ------------------------------------------------------------------------------------------------------

userRouter.post("/signup", multerMiddleware.none(), async (req, res) => {
  // neuen user erstellen
  const { name, email } = req.body;
  const newUser = new User({ name, email });
  // user.setPassword (hash und salt setzen)
  newUser.setPassword(req.body.password);
  // user speichern
  try {
    await newUser.save();
    return res.send({
      data: {
        message: "New user created",
        user: { name, email },
      },
    });
  } catch (e) {
    console.log(e);
    if (e.name === "ValidationError") {
      return res.status(400).send({ error: e });
    }

    // Duplication Error email existiert bereits als user
    if (e.name === "MongoServerError" && e.code === 11000) {
      console.log("Account exists already");
      return res.status(400).send({
        error: { message: "Username and Password combination not valid" },
      });
    }

    return res.status(500).send({ error: { message: "Unknown Server error" } });
  }
});

// login -------------------------------------------------------------------------------------------------------

const hoursInMillisec = (hours) => {
  return 1000 * 60 * 60 * hours;
};

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+hash").select("+salt");
  const passwordIsValid = user.verifyPassword(password);
  if (passwordIsValid) {
    const token = generateAccessToken({ email });
    res.cookie("auth", token, { httpOnly: true, maxAge: hoursInMillisec(4) });
    res.send({ message: "success", data: user });
  } else {
    res.status(404).send({
      message: "failed to login",
      error: {
        message: "Password and E-Mail combination is wrong",
      },
    });
  }
});

// secure ------------------------------------------------------------------------------------------------------

userRouter.get("/secure", authenticateToken, async (req, res) => {
  console.log(req.userEmail);
  res.send({ email: req.userEmail });
});

// get user profile of logged in user --------------------------------------------------------------------------

userRouter.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.userEmail });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.send("there was an error");
  }
});

// reset password ----------------------------------------------------------------------------------------------

userRouter.post("/resetPassword", async (req, res) => {
  const { email } = req.body;
  try {
    console.log("reset password for ", email);
    await createResetToken(email);
    return res.sendStatus(200);
  } catch (e) {
    if (e?.message === "No User with this email") {
      return res.status(404).send({ error: "User not found" });
    }

    return res.status(500).send({ error: "Unknown Error occurred" });
  }
});

// reset password confirm --------------------------------------------------------------------------------------

userRouter.post("/resetPassword-confirm", async (req, res) => {
  const { id, token, password } = req.body;
  const isValidResetProcess = validateResetToken(id, token);
  try {
    if (!isValidResetProcess) {
      throw new Error("NonValidResetProcess");
    }

    const user = await User.findById(id);
    user.setPassword(password);

    await user.save();
    return res.send({
      data: { message: "New password confirmed" },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Something went wrong" });
  }
});

// logout ------------------------------------------------------------------------------------------------------

userRouter.get("/logout", (req, res) => {
  res.clearCookie("auth");
  res.send("OK");
});