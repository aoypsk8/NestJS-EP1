import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import cloudinary from 'src/config/cloudinary.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(
    createUserDto: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;

    if (!firstName || !lastName || !email || !password) {
      throw new BadRequestException('ກະລຸນາປ້ອນຂໍ້ມູນ !');
    }
    const userCheck = await this.findByEmail(email);
    // check user email first
    if (userCheck) {
      throw new BadRequestException('Email ນີ້ມີຢູ່ໃນລະບົບແລ້ວ !');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Upload profile picture to Cloudinary
    let profilePictureUrl = null;
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      profilePictureUrl = result.secure_url;
    }

    const user = this.usersRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profilePicture: profilePictureUrl,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    } else {
      throw new BadRequestException('ລະຫັດຜ່ານບໍ່ຖືກ !');
    }
  }
}
