import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.render("login", { title: "Margarita Maia - Login", req: req });
});

router.get("/register", (req, res) => {
  if (req.session?.user) {
    res.redirect("/profile");
  }

  res.render("register", { title: "Margarita Maia - Register", req: req });
});

function auth(req, res, next) {
  if (req.session?.user) return next();
  res.redirect("/");
}

router.get("/profile", auth, (req, res) => {
  const user = req.session.user;

  res.render("profile", { title: "Margarita Maia - Profile", user: user, req: req });
});

router.get("/reset", (req, res) => {
  res.render("reset", { title: "Margarita Maia - Reset password", req: req });
});

export default router;
