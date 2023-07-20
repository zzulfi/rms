import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Category } from './entities/category.entity';
import { SectionsService } from 'src/sections/sections.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    private readonly sectionService: SectionsService,
  ) {}

  async create(createCategoryInput: CreateCategoryInput) {
    //  checking is section exist

    const section = await this.sectionService.findOneByName(createCategoryInput.section);

    if (!section) {
      throw new HttpException(
        `Cant find a section named ${createCategoryInput.section}  ,ie: check on Section of ${createCategoryInput.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const newCategoryInput = this.categoryRepository.create({
        name: createCategoryInput.name,
        section,
      });
      return this.categoryRepository.save(newCategoryInput);
    } catch (e) {
      throw new HttpException(
        'An Error have when inserting data , please check the all required fields are filled ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  findAll() {
    try {
      return this.categoryRepository.find({
        relations: ['section', 'candidates', 'candidates.team', 'programmes', 'settings'],
      });
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  findOne(id: number) {
    if (!id) {
      throw new HttpException(`category cannot be undefined`, HttpStatus.BAD_REQUEST);
    }
    try {
      const category = this.categoryRepository.findOne({
        where: {
          id,
        },
        relations: ['section', 'candidates', 'programmes', 'settings', 'candidates.team'],
      });
      if (!category) {
        throw new HttpException(`can't find category with id ${id}`, HttpStatus.BAD_REQUEST);
      }

      return category;
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  findOneByName(name: string) {
    if (!name) {
      throw new HttpException(`category cannot be undefined`, HttpStatus.BAD_REQUEST);
    }
    try {
      const category = this.categoryRepository.findOne({
        where: {
          name,
        },
        relations: ['section' , 'programmes', 'settings'],
      });
      if (!category) {
        throw new HttpException(`can't find category with id ${name}`, HttpStatus.BAD_REQUEST);
      }

      return category;
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async update(id: number, updateCategoryInput: UpdateCategoryInput) {
    //  checking is section exist

    const section = await this.sectionService.findOneByName(updateCategoryInput.section);

    if (!section) {
      throw new HttpException(
        `Cant find a section named ${updateCategoryInput.section}  ,ie: check on Section of ${updateCategoryInput.name}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const newCategoryInput = this.categoryRepository.create({
        name: updateCategoryInput.name,
        section,
      });
      return this.categoryRepository.save(newCategoryInput);
    } catch (e) {
      throw new HttpException(
        'An Error have when updating data , please check the all required fields are filled ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }

  async remove(id: number) {
    const programme = await this.categoryRepository.findOneBy({ id });

    if (!programme) {
      throw new HttpException(`Cant find a category to delete`, HttpStatus.BAD_REQUEST);
    }

    try {
      return this.categoryRepository.delete(id);
    } catch (e) {
      throw new HttpException(
        'An Error have when deleting data ',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }


  async addSettingsToCategory(id: number, category: Category) {
    // checking is category exist
    const categoryData = this.categoryRepository.findOneBy({ id });

    if (!categoryData) {
      throw new HttpException('Invalid category name ', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      return this.categoryRepository.save(category);
    } catch (e) {
      throw new HttpException(
        'An Error have when finding data of category',
        HttpStatus.INTERNAL_SERVER_ERROR,
        { cause: e },
      );
    }
  }
}
