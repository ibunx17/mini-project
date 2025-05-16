"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterController = RegisterController;
exports.LoginController = LoginController;
exports.UserController = UserController;
const auth_service_1 = require("../services/auth.service");
function RegisterController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0, auth_service_1.RegisterService)(req.body);
            res.status(200).send({
                message: "Register Berhasil",
                data,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function LoginController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield (0, auth_service_1.LoginService)(req.body);
            res.status(200).cookie("acces_token", data.token).send({
                message: "Login Berhasil",
                data: data.user,
            });
        }
        catch (err) {
            next(err);
        }
    });
}
function UserController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            console.log(user);
            const data = yield (0, auth_service_1.GetAll)();
            res.status(200).send({
                message: "Berhasil",
                data: data,
            });
        }
        catch (err) {
            next();
        }
    });
}
