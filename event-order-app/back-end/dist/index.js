"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const coupon_router_1 = __importDefault(require("./routers/coupon.router"));
const event_category_router_1 = __importDefault(require("./routers/event-category.router"));
const event_router_1 = __importDefault(require("./routers/event.router"));
const ticket_router_1 = __importDefault(require("./routers/ticket.router"));
const voucher_router_1 = __importDefault(require("./routers/voucher.router"));
const transaction_router_1 = __importDefault(require("./routers/transaction.router"));
const cookieParser = require("cookie-parser");
const profile_router_1 = __importDefault(require("./routers/profile.router"));
const port = config_1.PORT || 8001;
const app = (0, express_1.default)();
const base_url = "/api/eventorder";
app.use(cookieParser());
app.use((0, cors_1.default)({
    origin: config_1.FE_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/api", (req, res, next) => {
    console.log("test masuk");
    next();
}, (req, res, next) => {
    res.status(200).send("ini api");
});
app.use(`${base_url}/auth`, auth_router_1.default);
app.use(`${base_url}/coupons`, coupon_router_1.default);
app.use(`${base_url}/event-categories`, event_category_router_1.default);
app.use(`${base_url}/events`, event_router_1.default);
app.use(`${base_url}/tickets`, ticket_router_1.default);
app.use(`${base_url}/vouchers`, voucher_router_1.default);
app.use(`${base_url}/transactions`, transaction_router_1.default);
app.use(`${base_url}/profile`, profile_router_1.default);
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
