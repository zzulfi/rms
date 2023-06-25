import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TeamsService } from './teams.service';
import { Team } from './entities/team.entity';
import { CreateTeamInput } from './dto/create-team.input';
import { UpdateTeamInput } from './dto/update-team.input';
import { AuthPipe } from './pipe/auth.pipe';
import { UseGuards, UsePipes } from '@nestjs/common';
import { HasRoles, RolesGuard } from 'src/credentials/roles/roles.guard';
import { Roles } from 'src/credentials/roles/roles.enum';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @UsePipes(AuthPipe)
  @Mutation(() => Team)
  @HasRoles(Roles.Admin)
  @UseGuards(RolesGuard)
  createTeam(@Args('createTeamInput') createTeamInput: CreateTeamInput) {
    return this.teamsService.create(createTeamInput);
  }

  @Query(() => [Team], { name: 'teams' })
  findAll() {
    return this.teamsService.findAll();
  }

  @Query(() => Team, { name: 'team' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.teamsService.findOne(id);
  }

  @Mutation(() => Team)
  @HasRoles(Roles.Admin)
  @UseGuards(RolesGuard)
  updateTeam(@Args('updateTeamInput') updateTeamInput: UpdateTeamInput) {
    return this.teamsService.update(updateTeamInput.id, updateTeamInput);
  }

  @Mutation(() => Team)
  @HasRoles(Roles.Admin)
  @UseGuards(RolesGuard)
  removeTeam(@Args('id', { type: () => Int }) id: number) {
    return this.teamsService.remove(id);
  }
}
