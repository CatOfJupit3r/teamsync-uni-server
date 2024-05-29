import { Router } from 'express'
import UserController from "../controllers/UserController";
import {authenticationMiddleware} from "../middleware/AuthenticationMiddleware";

const router = Router()


router.get('/', UserController.getProfile.bind(UserController))


export default router