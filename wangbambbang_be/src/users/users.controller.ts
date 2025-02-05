// users.controller.ts
import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { EvaluatePronunciationDto } from './dto/EvaluatePronunciation.dto';
import { SaveScoreDto } from './dto/SaveScore.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post() // Post request to save user score
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get() // Get all users from db
  getUser() {
    return this.usersService.getUser();
  }

  @Post('evaluate-pronunciation')
async evaluatePronunciation(
  @Body() evaluatePronunciationDto: EvaluatePronunciationDto,
) {
  const { audioData, script } = evaluatePronunciationDto;
  console.log('Received data:', { audioData, script });
  return this.usersService.evaluatePronunciation(audioData, script);
}

  @Post('save-score') // Save user score after evaluation
  async saveScore(@Body() saveScoreDto: SaveScoreDto) {
    return this.usersService.saveScore(saveScoreDto);
  }

  @Delete() // Delete all users
  async deleteAllUsers() {
    return this.usersService.deleteAllUsers();
  }
}
