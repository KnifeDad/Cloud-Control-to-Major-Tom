"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var express_1 = require("express");
dotenv_1.default.config();
// Import the routes
var index_js_1 = require("./routes/index.js");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
// TODO: Serve static files of entire client dist folder
// TODO: Implement middleware for parsing JSON and urlencoded form data
// TODO: Implement middleware to connect the routes
app.use(index_js_1.default);
// Start the server on the port
app.listen(PORT, function () { return console.log("Listening on PORT: ".concat(PORT)); });
