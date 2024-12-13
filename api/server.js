const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");
const session = require("express-session");
const { ConnectSessionKnexStore } = require("connect-session-knex"); // Import the class
const knex = require("../data/db-config"); // Import your Knex configuration

const store = new ConnectSessionKnexStore({
    knex, // Pass the Knex instance
    tablename: "sessions", // Specify the sessions table name
    createtable: true, // Automatically create the table if it doesn't exist
    clearInterval: 1000 * 60 * 10, // Optional: cleanup interval in ms
});

const server = express();

server.use(
    session({
        name: "chocolatchip", // Cookie name
        secret: "shh", // Replace with a secure secret
        saveUninitialized: false,
        resave: false,
        store: store, // Use the Knex-based store
        cookie: {
            maxAge: 1000 * 60 * 10, // Cookie expiry: 10 minutes
            secure: false, // Set to true if using HTTPS
            httpOnly: true, // Prevent client-side JS access to cookies
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
    // eslint-disable-line
    res.status(err.status || 500).json({
        message: err.message,
        stack: err.stack,
    });
});

module.exports = server;

/**
  Do what needs to be done to support sessions with the `express-session` package!
  To respect users' privacy, do NOT send them a cookie unless they log in.
  This is achieved by setting 'saveUninitialized' to false, and by not
  changing the `req.session` object unless the user authenticates.

  Users that do authenticate should have a session persisted on the server,
  and a cookie set on the client. The name of the cookie should be "chocolatechip".

  The session can be persisted in memory (would not be adecuate for production)
  or you can use a session store like `connect-session-knex`.
 */



