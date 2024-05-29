import { Router } from 'express'
import UserController from "../controllers/UserController";
import {authenticationMiddleware} from "../middleware/AuthenticationMiddleware";

const router = Router()

router.use(authenticationMiddleware)

router.get('/', UserController.getProfile.bind(UserController))


export default router