import { HashRequest, LoginRequest, RegistrationRequest } from "../domain/authDomain";
import logger from "../logger";
import { EmailCheck, LoginRepository, RegisterRepository } from "../repository/authRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export async function LoginUsecase(request: LoginRequest) {

    let user = await LoginRepository(request)
    if (user === "") {
        return false;
    } else {
        let user_obj = {
            "externalId": user.external_id,
            "email": user.email,
        }
        logger.debug("user", user)
        let accessTokenSecret = process.env.ACCESSTOKENSECRET;
        logger.info(process.env.ACCESSTOKENSECRET)
        const accessToken = jwt.sign(user_obj, accessTokenSecret, {
            expiresIn: process.env.ACCESSTOKENEXPTIME,
        });
        let refreshTokenSecret = process.env.REFRESHTOKENSECRET;
        const refreshToken = jwt.sign(user_obj, refreshTokenSecret, {
            expiresIn: process.env.REFRESHTOKENEXPTIME,
        });
        logger.info("Token created successfully", accessToken);
        logger.info("Token created successfully", refreshToken);
        let resp = {
            'accessToken': accessToken,
            'refreshToken': refreshToken
        }
        return resp;
    }
    // return LoginRepository(request);
}

export async function RegisterUsecase(request: RegistrationRequest) {
    console.log("Inside RegisterUsecase");
    let EmailCheckResponse = await EmailCheck(request.email);
    if (EmailCheckResponse == false) {
        console.log("Email Id is already present: ", request.email);
        return false;
    } else {
        // Password Hash
        let hashreq: HashRequest = {
            password: request.password,
            salt: 10
        }
        let hashedPassword = await hashPassword(hashreq);
        console.log("Hashed value is ", hashedPassword);
        request.password = hashedPassword;
        RegisterRepository(request)
    }
}

export async function hashPassword(req: HashRequest): Promise<string> {
    const hash = await bcrypt.hash(req.password, req.salt);
    return hash;
}