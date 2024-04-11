import passport from "passport";
import { UserModel } from "../../dao/models/user.model.js";
import { createHash } from "../../helpers/utils.js";
import { Router } from "express";

const router = Router();

router.post("/v1/sessions/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email, password });

    if (!user) {
      console.log("Invalid credentials");
      req.session.destroy();
      return res.status(404).redirect("/");
    } else {
      req.session.user = user;
      req.session.login = true;
    }

    return res.redirect("/profile");
  } catch (error) {
    console.log("Internal server error");
    res.status(500).redirect("/");
  }
});

router.post("/v1/sessions/reset", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log("User not found");
      req.session.destroy();
      return res.status(404).redirect("/");
    } else {
      const userId = user._id;

      const userNewPassword = await UserModel.findByIdAndUpdate(userId, {
        password: password,
      });
    }

    return res.status(200).redirect("/");
  } catch (error) {
    console.log("Internal server error");
    res.status(500).redirect("/");
  }
});

router.post("/v1/sessions/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    const userExist = await UserModel.findOne({ email: email });

    if (userExist) {
      console.log("Email is already registered");
      return res.status(400).redirect("/");
    }

    const user = { first_name, last_name, email, age, password };

    if (
      user.email === "adminCoder@coder.com" &&
      user.password === "adminCod3r123"
    ) {
      user.rol = "admin";
    }

    await UserModel.create(user);

    return res.status(200).redirect("/");
  } catch (error) {
    console.log("Internal server error");
    res.status(500).redirect("/");
  }
});

//Passport
router.post(
  "/v2/sessions/register",
  passport.authenticate("register", {
    failureRedirect: "/",
  }),
  async (req, res) => {
    if (!req.user) {
      console.log("Sign up failed");
      return res.status(400).redirect("/");
    }

    return res.status(200).redirect("/");
  }
);

router.post(
  "/v2/sessions/login",
  passport.authenticate("login", {
    failureRedirect: "/",
  }),
  async (req, res) => {
    if (!req.user) {
      console.log("Invalid credentials");
      req.session.destroy();
      return res.status(400).redirect("/");
    } else {
      req.session.user = req.user;
      req.session.login = true;
    }

    return res.redirect("/profile");
  }
);

router.post("/v2/sessions/reset", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      console.log("User not found");
      req.session.destroy();
      return res.status(404).redirect("/");
    } else {
      const userId = user._id;

      const userNewPassword = await UserModel.findByIdAndUpdate(userId, {
        password: createHash(password),
      });
    }

    return res.status(200).redirect("/");
  } catch (error) {
    console.log("Internal server error");
    res.status(500).redirect("/");
  }
});

//GitHub
router.get(
  "/v2/sessions/login-github",
  passport.authenticate("github", { scope: ["user:email"], session: true }),
  async (req, res) => {}
);

router.get(
  "/v2/sessions/login-google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: true,
  }),
  async (req, res) => {}
);

router.get(
  "/v2/sessions/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
  }
);

router.get(
  "/v2/sessions/googlecallback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
  }
);

router.get("/v1/sessions/logout", (req, res) => {
  req.session.destroy((err) => {
    if (error) {
      res.json({ message: err });
    }
    res.redirect("/");
  });
});

export default router;
