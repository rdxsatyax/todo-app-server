import { authRouter } from "./auth";
import { taskRouter } from "./task";
import { userRouter } from "./users";
import { Router } from "express";

export let router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/task', taskRouter)