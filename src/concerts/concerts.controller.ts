import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Logger,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

@Controller('concerts')
export class ConcertsController {
    constructor(
        @Inject('CONCERTS_SERVICE') private concertsService: ClientProxy
    ) {}

    /**
     * @description Returns a list of all concerts
     * @return Promise<any>
     * @memberof ConcertsController
     */
    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getConcerts(): Promise<any> {
        return this.concertsService.send({ cmd: 'get-concerts' }, '');
    }

    /**
     * @description Saves a concert
     * @return Promise<string>
     * @memberof ConcertsController
     */
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async saveConcert(@Body() concert: any): Promise<string> {
        const data = await this.concertsService
            .send({ cmd: 'save-concert' }, concert)
            .toPromise();
        if (data === 'not saved') {
            throw new HttpException(
                {
                    status: HttpStatus.CONFLICT,
                    error: 'Already exists in database',
                },
                HttpStatus.CONFLICT
            );
        }
        return data;
    }
}
