import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // Your MySQL password
      database: 'HA',
      entities: [User], // Explicitly list your entities
      synchronize: false, // Set to false in production
      logging: true, // Enable logging for debugging
    }),
    UsersModule,
  ],
  
})
export class AppModule {}
