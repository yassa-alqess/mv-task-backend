// file dependencies
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../../shared/constants";
import User from "../../shared/models/user";
import RefreshToken from "../../shared/models/refresh-token";
import { generateAccessToken, generateRefreshToken } from "../../shared/utils";
import { IAuthPayload } from "./auth.interface";
import { RoleEnum } from "../../shared/enums";
import { NotFoundException, WrongCredentialsException } from "../../shared/exceptions";
import { initializeRedisClient } from "../../config/cache";
import logger from "../../config/logger";

//3rd party dependinces
import bcrypt from 'bcrypt'
import ms from 'ms'
import { RedisClientType } from "redis";

export default class AuthService {
    constructor(private _redisClient: RedisClientType | null = null) {
        this._initializeRedisClient();
    }
    private async _initializeRedisClient(): Promise<void> {
        this._redisClient = await initializeRedisClient();
    }
    public async login(email: string, password: string): Promise<string[]> {

        // check if user exists & credentials are correct
        const user = await this._checkUser(email) as User;
        await this._checkCredentials(user, password);

        // prepare tokens
        try {
            const tokenPayload = {
                id: user.userId,
                roles: user.roles.map((role) => role.name as RoleEnum),
            } as IAuthPayload;

            const accessToken = generateAccessToken(tokenPayload) as string;
            const token = `access-token:${user.userId}:${accessToken}`;
            const result = await this._redisClient?.setEx(token, ms(ACCESS_TOKEN_EXPIRY), 'valid');
            logger.debug(`cache result: ${result}`);


            const refreshToken = generateRefreshToken(tokenPayload) as string;
            await RefreshToken.create({ value: refreshToken, expiresAt: new Date(Date.now() + ms(REFRESH_TOKEN_EXPIRY)) });
            return [accessToken, refreshToken];
        }
        
        //eslint-disable-next-line
        catch (err: any) {
            logger.error(`error in login service: ${err.message}`);
            throw new Error('couldn\'t login at the moment');
        }
    }

    private async _checkUser(email: string): Promise<User | null> {
        const user = await User.findOne({
            where: {
                email,
            },
            include: 'roles',

        });
        if (!user) {
            throw new NotFoundException('User', 'email', email);
        }
        return user;
    }

    private async _checkCredentials(user: User, password: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new WrongCredentialsException();
        }
        return true;
    }
}
