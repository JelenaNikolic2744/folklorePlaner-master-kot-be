import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConcertsModule } from './concerts/concerts.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [ConcertsModule, UsersModule, AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
