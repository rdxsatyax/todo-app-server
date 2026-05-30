import { Request, Response } from "express";
import { LoginRequest, RegistrationRequest } from "../domain/authDomain"
import { LoginUsecase, RegisterUsecase } from "../usecase/authUsecase"
import logger from "../logger";
export async function Login(req, res) {
    logger.info("Inside login controller");
    let request = {} as LoginRequest;
    request.email = req.body.email;
    request.password = req.body.password;
    logger.debug("after mapping to the user request", request);
    let usecaseResponse = await LoginUsecase(request);
    if (usecaseResponse == false) {
        res.send("Incorrect email or password");
    } else {
        logger.info("Login successful")
        res.send(usecaseResponse);
    }
}

export async function Register(req: Request, res: Response) {
    logger.info('Inside Register controller');
    logger.debug('Got the request body for the api call', req.body.first_name);
    let request = {} as RegistrationRequest;
    request.firstName = req.body.first_name;
    request.lastName = req.body.last_name;
    request.mobNumber = req.body.mob_number;
    request.email = req.body.email;
    request.password = req.body.password;
    logger.debug("after mapping to the user request", request);
    let usecaseResponse = await RegisterUsecase(request);
    if (usecaseResponse == false) {
        res.send("Email id Already present in our table so plz login to continue.");
    } else {
        res.send("Registration successful");
    }
}