"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
var app = express_1.default();
/*** MIDDLEWARES ***/
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
/*** ROUTE HANLDERS ***/
reviewRoutes_1.default(app);
/*** APP LISTENER ***/
app.listen(3000, function () { return console.log("🚀 Server is running on port 3000"); });
