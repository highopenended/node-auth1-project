const router = require("express").Router();
const { checkPasswordLength, checkUsernameExists, checkUsernameFree } = require("./auth-middleware");
const bcrypt = require("bcryptjs");
const User = require("../users/users-model");

router.post("/register", checkUsernameFree, checkPasswordLength, (req, res, next) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 8);
    User.add({ username, password: hash })
        .then((saved) => {
            res.status(201).json(saved);
        })
        .catch(next);
});

router.post("/login", checkUsernameExists, (req, res, next) => {
    const { password } = req.body;
    const dbPass = req.user.password;
    if (bcrypt.compareSync(password, dbPass)) {
        req.session.user = req.user;
        res.status(201).json({ message: `Welcome ${req.user.username}` });
    } else {
        next({ status: 401, message: "Invalid credentials" });
    }
});

router.get("/logout", (req, res, next) => {
    if (req.session.user) {
        req.session.destroy();
        next({ status: 200, message: "logged out" });
    } else {
        next({ status: 200, message: "no session" });
    }
});

module.exports = router;
