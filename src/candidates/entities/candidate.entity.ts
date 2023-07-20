import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { CandidateProgramme } from 'src/candidate-programme/entities/candidate-programme.entity';
import { Category } from 'src/category/entities/category.entity';
import { Section } from 'src/sections/entities/section.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Photo } from '../../utils/photo.interface';
import { Substitute } from 'src/substitute/entities/substitute.entity';

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  OTHER = 'O'
}

registerEnumType(Gender, {
  name: 'Gender',
});

@Entity()
@ObjectType()
export class Candidate {

  // Primary generated ID

  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'Example field (placeholder)' })
  id: number;

  // Normal columns

  @Column()
  @Field()
  name: string;

  @Column({nullable:true})
  @Field(()=> Int,{nullable:true})
  class: number;

  @Column({nullable:true})
  @Field({nullable:true})
  adno: number;

  @Column({nullable:true})
  @Field({nullable:true})
  dob: string;

  @Column({nullable:true , unique: true})
  @Field(()=> Int ,{nullable:true})
  chestNO: number;


  @Column({ nullable: true})
  @Field({nullable:true})
  imageId: string ;

  @Column({ type: 'varchar', default: Gender.MALE })
  @Field(()=> Gender)
  gender: Gender;

  // OneTOMany relations

  @OneToMany(() => CandidateProgramme, (candidateProgramme) => candidateProgramme.candidate)
  @Field(() => [CandidateProgramme], { nullable: true })
  candidateProgrammes: CandidateProgramme[];

  @OneToMany(() => Substitute , (substitute) => substitute.oldCandidate)
  @JoinTable()
  @Field(() => [Substitute], { nullable: true })
  substitutesOld: Substitute[];

  @OneToMany(() => Substitute , (substitute) => substitute.newCandidate)
  @JoinTable()
  @Field(() => [Substitute], { nullable: true })
  substitutesNew: Substitute[];

  // ManyToOne relations

  @ManyToOne(()=> Team , (team) => team.candidates , { eager: true , onDelete : 'SET NULL'})
  @Field(()=> Team , {nullable:true})
  team:Team;


  @ManyToOne(()=> Category , (category) => category.candidates , { eager: true , onDelete : 'SET NULL'})
  @Field(()=> Category , {nullable:true})
  category:Category;

  // ManyToMany relations

  // @ManyToMany(() => CandidateProgramme , (candidateProgramme) => candidateProgramme.candidatesOfGroup)
  // @Field(() => [CandidateProgramme], { nullable: true })
  // candidateProgrammesOfGroup: CandidateProgramme[];

  // Dates

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

}
