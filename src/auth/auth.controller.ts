import { Controller, Post, Body, Get, Patch, Request, UseGuards, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth-extra.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiConflictResponse({ description: 'Email already exists' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);
    this.setAuthCookie(res, result.accessToken);
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    this.setAuthCookie(res, result.accessToken, dto.rememberMe);
    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user' })
  me(@Request() req) {
    return this.authService.me(req.user.id);
  }

  @Post('refresh-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Request() req, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.refreshToken(req.user.id);
    this.setAuthCookie(res, result.accessToken);
    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout current user' })
  async logout(@Res({ passthrough: true }) res: Response) {
    this.clearAuthCookie(res);
    return this.authService.logout();
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user profile (name, email, phone)' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiConflictResponse({ description: 'Email already exists' })
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.authService.updateProfile(req.user.id, dto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change current user password' })
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Generate password reset token' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  private setAuthCookie(res: Response, token: string, rememberMe?: boolean) {
    const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined;
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
      path: '/',
    });
  }

  private clearAuthCookie(res: Response) {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
  }
}
