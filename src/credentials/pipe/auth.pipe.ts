import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  PipeTransform,
  ValidationPipe,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credential } from '../entities/credential.entity';
import { CreateCredentialInput } from '../dto/create-credential.input';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class AuthPipe implements PipeTransform {
  constructor(
    @Inject(forwardRef(() => ValidationPipe))
    private readonly validationPipe: ValidationPipe,
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(Credential) private Repository: Repository<Credential>,
  ) {}
  async transform(value: CreateCredentialInput, metadata: ArgumentMetadata) {
    const { username } = value;

    if (!username) {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.Repository.findOne({
      where: {
        username,
      },
    });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    return value;
  }
}
