const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");
const knex = require("../data/db-config");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex").ConnectSessionKnexStore;

const store = new KnexSessionStore({
    knex,
    createtable: true,
    clearInterval: 1000 * 60 * 10,
    tablename: "sessions",
    sidFieldName: "sid",
    session: session,
});

const server = express();

server.use(
    session({
        name: "chocolatechip",
        secret: "shh",
        saveUninitialized: false,
        resave: false,
        store: store,
        cookie: {
            maxAge: 1000 * 60 * 10,
            secure: false,
            httpOnly: true,
        },
    })
);

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
    res.json({ api: "up" });
});

// eslint-disable-next-line no-unused-vars
server.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        stack: err.stack,
    });
});

module.exports = server;
