import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export enum StorageProvider {
  LOCAL = 'local',
  S3 = 's3',
}

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File, folder: string = 'uploads'): Promise<string> {
    const provider = this.configService.get<StorageProvider>('STORAGE_PROVIDER', StorageProvider.LOCAL);

    switch (provider) {
      case StorageProvider.S3:
        return this.uploadToS3(file, folder);
      case StorageProvider.LOCAL:
      default:
        return this.uploadToLocal(file, folder);
    }
  }

  private async uploadToLocal(file: Express.Multer.File, folder: string): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'public', folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Write file
    fs.writeFileSync(filePath, file.buffer);

    // Return public URL
    const baseUrl = this.configService.get<string>(
      'BASE_URL',
      `http://localhost:${this.configService.get<string>('PORT', '3000')}`,
    );
    return `${baseUrl}/${folder}/${fileName}`;
  }

  private async uploadToS3(file: Express.Multer.File, folder: string): Promise<string> {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
    });

    const bucketName = this.configService.get<string>('AWS_S3_BUCKET');
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const result = await s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      throw new Error(`Failed to upload to S3: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const provider = this.configService.get<StorageProvider>('STORAGE_PROVIDER', StorageProvider.LOCAL);

    switch (provider) {
      case StorageProvider.S3:
        return this.deleteFromS3(fileUrl);
      case StorageProvider.LOCAL:
      default:
        return this.deleteFromLocal(fileUrl);
    }
  }

  private async deleteFromLocal(fileUrl: string): Promise<void> {
    try {
      const baseUrl = this.configService.get<string>(
        'BASE_URL',
        `http://localhost:${this.configService.get<string>('PORT', '3000')}`,
      );
      const relativePath = fileUrl.startsWith('http')
        ? new URL(fileUrl).pathname
        : fileUrl.replace(baseUrl, '');
      const filePath = path.join(process.cwd(), 'public', relativePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Failed to delete local file:', error);
    }
  }

  private async deleteFromS3(fileUrl: string): Promise<void> {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
    });

    try {
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // Remove leading slash

      await s3.deleteObject({
        Bucket: this.configService.get<string>('AWS_S3_BUCKET'),
        Key: key,
      }).promise();
    } catch (error) {
      console.error('Failed to delete S3 file:', error);
    }
  }
}
