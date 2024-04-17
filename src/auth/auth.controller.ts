import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject('USERS_SERVICE') private usersService: ClientProxy,
        private authService: AuthService
    ) {}

    /**
     * @description Check login
     * @return Promise<any>
     * @memberof AuthController
     */
    @Post()
    async loginUser(@Body() loginData: any): Promise<any> {
        const userData = await this.usersService
            .send({ cmd: 'check-login' }, loginData)
            .toPromise();
        const user = await this.authService.login(userData, loginData);
        return user;
    }
}
