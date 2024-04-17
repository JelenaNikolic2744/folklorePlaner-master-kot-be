import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject('USERS_SERVICE') private usersService: ClientProxy
    ) {}

    /**
     * @description Compares passwords
     * @return Promise<any>
     * @memberof AuthService
     */
    async login(userData: any, loginData: any): Promise<any> {
        const user = userData;
        if (user && (await bcrypt.compare(loginData.password, user.password))) {
            const token = this._createToken(user);
            const admin = user.admin;
            return { isItGood: true, admin, token };
        } else {
            throw new UnauthorizedException('Login Failed!');
        }
    }

    /**
     * @description Creates token
     * @return Promise<any>
     * @memberof AuthService
     */
    private _createToken({ username }: any): any {
        const user = { username };
        const accessToken = this.jwtService.sign(user, { expiresIn: 1200 });
        return accessToken;
    }

    /**
     * @description Validates user through guards
     * @return Promise<any>
     * @memberof AuthService
     */
    async validateUser(payload: any): Promise<any> {
        const user = await this.usersService.send(
            { cmd: 'check-login' },
            payload
        );
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }
}
