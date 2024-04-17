import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(@Inject('USERS_SERVICE') private usersService: ClientProxy) {}

    /**
     * @description Returns message if user is successfully saved
     * @return Promise<any>
     * @memberof UsersController
     */
    @Post()
    async saveUser(@Body() user: any): Promise<any> {
        const userData = await this.usersService
            .send({ cmd: 'save-user' }, user)
            .toPromise();
        if (userData === 'not saved') {
            throw new HttpException(
                {
                    status: HttpStatus.CONFLICT,
                    error: 'Already exists in database',
                },
                HttpStatus.CONFLICT
            );
        }
        return userData;
    }

    /**
     * @description Get all users
     * @return Promise<User[]>
     * @memberof UsersController
     */

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getUsers(): Promise<any> {
        return this.usersService.send({ cmd: 'get-users' }, '');
    }

    /**
     * @description Adds money to db
     * @return Promise<any>
     * @memberof UsersController
     */
    @Post('money')
    @UseGuards(AuthGuard('jwt'))
    async saveMoney(@Body() money: any): Promise<any> {
        this.usersService.emit({ cmd: 'save-money' }, money);
    }

    /**
     * @description Adds rehearsal to db
     * @return Promise<any>
     * @memberof UsersController
     */
    @Post('rehearsal')
    @UseGuards(AuthGuard('jwt'))
    async saveRehearsal(@Body() rehearsal: any): Promise<any> {
        const rehearsalData = await this.usersService
            .send({ cmd: 'save-rehearsal' }, rehearsal)
            .toPromise();
        if (rehearsalData === 'not saved') {
            throw new HttpException(
                {
                    status: HttpStatus.CONFLICT,
                    error: 'Already exists in database',
                },
                HttpStatus.CONFLICT
            );
        }
        return rehearsalData;
    }

    /**
     * @description Updates user data
     * @return Promise<void>
     * @memberof UsersController
     */
    @Put()
    @UseGuards(AuthGuard('jwt'))
    async updateUser(@Body() userData: any): Promise<void> {
        this.usersService.emit({ cmd: 'update-user' }, userData);
    }
}
