# Brands API Documentation

## Overview

The Brands API provides CRUD operations for managing brand entities with image upload functionality. The API supports both local file storage and AWS S3 storage based on configuration.

## Features

- **CRUD Operations**: Create, Read, Update, Delete brands
- **Image Upload**: Support for brand logo uploads
- **Storage Flexibility**: Local storage or AWS S3 based on configuration
- **File Management**: Automatic cleanup of old images when updating/deleting
- **Swagger Documentation**: Full API documentation with Swagger UI

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```bash
# Storage Configuration
STORAGE_PROVIDER=local  # Options: local, s3

# Application Configuration
BASE_URL=http://localhost:3000  # For local storage URLs

# AWS S3 Configuration (required only if STORAGE_PROVIDER=s3)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
```

### Storage Providers

#### Local Storage (Default)
- Files are stored in `public/brands/` directory
- URLs are generated using the `BASE_URL` environment variable
- No additional configuration required

#### AWS S3 Storage
- Set `STORAGE_PROVIDER=s3`
- Configure AWS credentials and bucket name
- Files are uploaded with public-read ACL
- URLs are returned directly from S3

## API Endpoints

### Create Brand
```http
POST /brands
Content-Type: multipart/form-data
```

**Request Body:**
- `name` (string, required): Brand name
- `slug` (string, required): Brand slug (unique)
- `logo` (file, optional): Brand logo image

**Response:**
```json
{
  "id": "uuid",
  "name": "Brand Name",
  "slug": "brand-slug",
  "logoUrl": "http://localhost:3000/brands/uuid.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Upload Logo to Existing Brand
```http
POST /brands/:id/upload-logo
Content-Type: multipart/form-data
```

**Request Body:**
- `logo` (file, required): Brand logo image

### Get All Brands
```http
GET /brands
```

### Get Brand by ID
```http
GET /brands/:id
```

### Update Brand
```http
PATCH /brands/:id
Content-Type: multipart/form-data
```

**Request Body:**
- `name` (string, optional): Updated brand name
- `slug` (string, optional): Updated brand slug
- `logo` (file, optional): New brand logo image

### Delete Brand
```http
DELETE /brands/:id
```

## File Upload Details

### Supported File Types
- Images (JPEG, PNG, GIF, WebP, etc.)
- Maximum file size: Determined by your NestJS configuration

### File Naming
- Files are automatically renamed using UUID to prevent conflicts
- File extension is preserved from the original upload

### Storage Locations
- **Local**: `public/brands/` directory
- **S3**: `brands/` prefix in your S3 bucket

### Automatic Cleanup
- Old logo files are automatically deleted when:
  - Updating a brand with a new logo
  - Deleting a brand
  - Uploading a new logo via the dedicated endpoint

## Error Handling

### Common Errors
- **404 Not Found**: Brand with specified ID doesn't exist
- **400 Bad Request**: Invalid input data or file
- **413 Payload Too Large**: File exceeds size limits
- **500 Internal Server Error**: Storage provider errors

### Error Response Format
```json
{
  "statusCode": 404,
  "message": "Brand with ID uuid not found",
  "error": "Not Found"
}
```

## Usage Examples

### Using cURL

#### Create Brand with Logo
```bash
curl -X POST http://localhost:3000/brands \
  -F "name=Apple" \
  -F "slug=apple" \
  -F "logo=@/path/to/logo.png"
```

#### Update Brand Logo
```bash
curl -X POST http://localhost:3000/brands/brand-uuid/upload-logo \
  -F "logo=@/path/to/new-logo.png"
```

### Using JavaScript/Fetch

```javascript
// Create brand with logo
const formData = new FormData();
formData.append('name', 'Apple');
formData.append('slug', 'apple');
formData.append('logo', fileInput.files[0]);

const response = await fetch('http://localhost:3000/brands', {
  method: 'POST',
  body: formData,
});

const brand = await response.json();
```

## Development Notes

### Database Schema
The Brand model uses the following schema:
```prisma
model Brand {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  logoUrl   String?  @map("logo_url")
  createdAt DateTime @default(now())
  products  Product[]

  @@map("brands")
}
```

### Dependencies
- `@nestjs/config`: Configuration management
- `aws-sdk`: AWS S3 integration
- `uuid`: Unique filename generation
- `multer`: File upload handling

### Security Considerations
- File uploads are validated by NestJS/Multer
- S3 uploads use public-read ACL for web accessibility
- Local files are served from the public directory
- Consider implementing additional file type validation if needed

## Testing

The API includes Swagger UI for interactive testing. Access it at:
`http://localhost:3000/api` (when running locally)

## Production Deployment

### Local Storage Considerations
- Ensure the `public` directory is properly served by your web server
- Consider implementing CDN for static assets
- Monitor disk space usage

### S3 Storage Considerations
- Configure proper CORS on your S3 bucket
- Consider implementing S3 lifecycle policies for old files
- Monitor S3 costs and usage

## Troubleshooting

### Common Issues
1. **Upload failures**: Check storage provider configuration and credentials
2. **File not found**: Verify `BASE_URL` is correctly configured for local storage
3. **S3 permission errors**: Ensure AWS credentials have proper S3 permissions
4. **Large file uploads**: Adjust NestJS body parser limits if needed

### Debug Tips
- Check application logs for detailed error messages
- Verify environment variables are correctly set
- Test storage provider connectivity separately
