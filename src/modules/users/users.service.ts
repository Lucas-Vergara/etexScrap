import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: email });
  }

  async createUser(createUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const existingUser = await this.findOne(email);
    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con este correo electrónico');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async getAllUsers(): Promise<{ id: string; email: string }[]> {
    const users = await this.userModel.find().select('_id email').exec();
    return users.map(user => ({ id: user.id, email: user.email }));
  }

  async deleteUser(userId: string): Promise<any> {
    const result = await this.userModel.deleteOne({ _id: userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }
    return result
  }

}
