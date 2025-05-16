import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";

import { PORT, FE_URL } from "./config";

import AuthRouter from "./routers/auth.router";
import CouponRouter from "./routers/coupon.router";
import eventCategoryRouter from "./routers/event-category.router";
import eventRouter from "./routers/event.router";
import ticketRouter from "./routers/ticket.router";
import voucherRouter from "./routers/voucher.router";
import transactionRouter from "./routers/transaction.router";
import cookieParser = require("cookie-parser");
import ProfileRouter from "./routers/profile.router";
import pointRouter from "./routers/point.router";
import ResetPasswordRouter from "./routers/reset-password.router";
import StatisticRouter from "./routers/statistic.router";
import OverviewRouter from "./routers/overview.router";

const port = PORT || 8001;
const app: Application = express();
const base_url: string = "/api/eventorder";

app.use(cookieParser());
app.use(
  cors({
    origin: FE_URL,
    credentials: true,
  })
);

app.use(express.json());
app.get(
  "/api",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("test masuk");
    next();
  },
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("ini api");
  }
);

app.use(express.static(path.join(__dirname, "../public")));

app.use(`${base_url}/auth`, AuthRouter);
app.use(`${base_url}/coupons`, CouponRouter);
app.use(`${base_url}/event-categories`, eventCategoryRouter);
app.use(`${base_url}/events`, eventRouter);
app.use(`${base_url}/tickets`, ticketRouter);
app.use(`${base_url}/vouchers`, voucherRouter);
app.use(`${base_url}/transactions`, transactionRouter);
app.use(`${base_url}/profile`, ProfileRouter);
app.use(`${base_url}/reset-password`, ResetPasswordRouter);
app.use(`${base_url}/points`, pointRouter);
app.use(`${base_url}/statistic`, StatisticRouter);
app.use(`${base_url}/overview`, OverviewRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
