import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsBoolean, IsInt, IsNumber, IsObject } from "class-validator";

export class CreateSettingDto {
  @ApiPropertyOptional({ description: 'Shop Name' })
  @IsString()
  @IsOptional()
  shopName?: string;

  @ApiPropertyOptional({ description: 'Logo URL' })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiPropertyOptional({ description: 'Icon URL' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: 'Favicon URL' })
  @IsString()
  @IsOptional()
  favicon?: string;

  @ApiPropertyOptional({ description: 'Branch name' })
  @IsString()
  @IsOptional()
  branchName?: string;

  @ApiPropertyOptional({ description: 'Branch address' })
  @IsString()
  @IsOptional()
  branchAddress?: string;

  @ApiPropertyOptional({ description: 'Branch latitude' })
  @IsNumber()
  @IsOptional()
  branchLat?: number;

  @ApiPropertyOptional({ description: 'Branch longitude' })
  @IsNumber()
  @IsOptional()
  branchLng?: number;

  @ApiPropertyOptional({ description: 'Copyright Year', default: '2026' })
  @IsString()
  @IsOptional()
  copyrightYear?: string;

  @ApiPropertyOptional({ description: 'Parent Company' })
  @IsString()
  @IsOptional()
  parentCompany?: string;

  @ApiPropertyOptional({ description: 'Parent Company Link' })
  @IsString()
  @IsOptional()
  parentCompanyLink?: string;

  @ApiPropertyOptional({ description: 'Slogan' })
  @IsString()
  @IsOptional()
  slogan?: string;

  @ApiPropertyOptional({ description: 'Contact Number (JSON)' })
  @IsObject()
  @IsOptional()
  contactNumber?: any;

  @ApiPropertyOptional({ description: 'Email (JSON)' })
  @IsObject()
  @IsOptional()
  email?: any;

  @ApiPropertyOptional({ description: 'Social Contact (JSON)' })
  @IsObject()
  @IsOptional()
  socialContact?: any;

  @ApiPropertyOptional({ description: 'Currency', default: 'BDT' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional({ description: 'Language', default: 'en' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ description: 'Fraud Check API Key' })
  @IsString()
  @IsOptional()
  fraudCheckApiKey?: string;

  @ApiPropertyOptional({ description: 'Is Fraud Checking Enabled', default: false })
  @IsBoolean()
  @IsOptional()
  isFraudChecking?: boolean;

  @ApiPropertyOptional({ description: 'Fraud Checking Threshold', default: 0 })
  @IsInt()
  @IsOptional()
  fraudCheckingThreshold?: number;

  @ApiPropertyOptional({ description: 'Fraud Checking Success Rate' })
  @IsNumber()
  @IsOptional()
  fraudCheckingSuccessRate?: number;

  @ApiPropertyOptional({ description: 'Delivery charge inside' })
  @IsNumber()
  @IsOptional()
  deliveryChargeInside?: number;

  @ApiPropertyOptional({ description: 'Delivery charge outside' })
  @IsNumber()
  @IsOptional()
  deliveryChargeOutside?: number;

  @ApiPropertyOptional({ description: 'Delivery charge near city' })
  @IsNumber()
  @IsOptional()
  deliveryChargeNearCity?: number;

  @ApiPropertyOptional({ description: 'YouTube URL' })
  @IsString()
  @IsOptional()
  youtubeUrl?: string;

  @ApiPropertyOptional({ description: 'YouTube thumbnail image' })
  @IsString()
  @IsOptional()
  youtubeThumbnailImage?: string;

  @ApiPropertyOptional({ description: 'YouTube title' })
  @IsString()
  @IsOptional()
  youtubeTitle?: string;

  @ApiPropertyOptional({ description: 'YouTube description' })
  @IsString()
  @IsOptional()
  youtubeDescription?: string;

  @ApiPropertyOptional({ description: 'YouTube meta data (JSON)' })
  @IsObject()
  @IsOptional()
  youtubeMetaData?: any;
}
