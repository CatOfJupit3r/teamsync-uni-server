import { Request, Response} from "express";
import {Unauthorized} from "../models/ErrorModels";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";


class UserController {
    async getProfile(req: Request, res: Response) {
        if (!req.headers.authorization) throw new Unauthorized('No authorization header') // although this case is already handled by authenticationMiddleware
        const token = AuthService.removeBearerPrefix(req.headers.authorization)
        res.json(await UserService.getProfile(token)).status(200)
    }
}


export default new UserController()