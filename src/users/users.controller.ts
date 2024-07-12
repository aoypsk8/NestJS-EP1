import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('file'))
  async register(
    @UploadedFile() file:Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; user?: User }> {
    try {
      const user = await this.usersService.create(createUserDto, file);
      return { message: 'Register successful', user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ message: string; user?: User }> {
    try {
      const user = await this.usersService.validateUser(loginUserDto);
      return { message: 'Login successful', user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async getAll() {
    try {
      const user = await this.usersService.findAll();
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
