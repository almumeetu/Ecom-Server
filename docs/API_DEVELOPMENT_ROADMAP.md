# NeoComerz API Development Roadmap

## Purpose

This document lists the APIs that should be built to make NeoComerz a complete e-commerce backend.

Current base URL pattern:

```http
/api/v1
```

Example:

```http
GET /api/v1/products
```

## Current Implemented APIs

These modules already exist in the project:

- Auth
- Users
- Addresses
- Categories
- Brands
- Brand logo upload

## Priority 1: Core E-Commerce APIs

These APIs are required first because the shop cannot work without them.

### 1. Product APIs

Products are the main catalog items of the shop.

```http
POST   /api/v1/products
GET    /api/v1/products
GET    /api/v1/products/:id
GET    /api/v1/products/slug/:slug
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id
```

Recommended features:

- Create product with name, slug, description, brand, category, status
- Product list with pagination
- Search by name
- Filter by category, brand, status, price range
- Sort by price, newest, popular
- Soft delete using `deletedAt`
- Product SEO fields: meta title, meta description, meta keywords

### 2. Product Media APIs

Product images and videos should be managed separately from basic product data.

```http
POST   /api/v1/products/:productId/media
GET    /api/v1/products/:productId/media
PATCH  /api/v1/product-media/:id
DELETE /api/v1/product-media/:id
```

Recommended features:

- Upload product image/video
- Set featured media
- Sort media order
- Support local storage and S3

### 3. Product Variant APIs

Variants are needed for products with size, color, storage, RAM, etc.

```http
POST   /api/v1/products/:productId/variants
GET    /api/v1/products/:productId/variants
GET    /api/v1/variants/:id
PATCH  /api/v1/variants/:id
DELETE /api/v1/variants/:id
```

Recommended features:

- SKU
- Price
- Cost
- Stock quantity
- Default variant
- Stock alert threshold
- Variant attributes

### 4. Attribute APIs

Attributes support product variants.

```http
POST   /api/v1/attributes
GET    /api/v1/attributes
GET    /api/v1/attributes/:id
PATCH  /api/v1/attributes/:id
DELETE /api/v1/attributes/:id
```

Attribute value APIs:

```http
POST   /api/v1/attributes/:attributeId/values
GET    /api/v1/attributes/:attributeId/values
PATCH  /api/v1/attribute-values/:id
DELETE /api/v1/attribute-values/:id
```

Example:

- Attribute: Color
- Values: Red, Blue, Black
- Attribute: Size
- Values: S, M, L, XL

### 5. Cart APIs

Cart is required before checkout.

```http
GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/:id
DELETE /api/v1/cart/items/:id
DELETE /api/v1/cart/clear
```

Recommended features:

- Add item by variant ID
- Update quantity
- Remove item
- Clear cart
- Validate stock before adding
- Calculate subtotal

### 6. Order APIs

Orders are the core business transaction.

```http
POST   /api/v1/orders
GET    /api/v1/orders
GET    /api/v1/orders/my-orders
GET    /api/v1/orders/:id
PATCH  /api/v1/orders/:id/status
DELETE /api/v1/orders/:id/cancel
```

Recommended features:

- Create order from cart
- Save order items with price snapshot
- Reduce stock after order
- Order number generation
- Customer order history
- Admin order list
- Status update: pending, processing, shipped, delivered, cancelled, returned

### 7. Payment APIs

Payment APIs depend on the selected payment provider.

```http
POST   /api/v1/payments/initiate
POST   /api/v1/payments/confirm
POST   /api/v1/payments/webhook
GET    /api/v1/payments/order/:orderId
```

Recommended providers for Bangladesh:

- Cash on Delivery
- SSLCommerz
- bKash
- Nagad

Recommended features:

- Payment method
- Transaction ID
- Payment status
- Webhook verification
- Refund support later

### 8. Inventory APIs

Inventory APIs are needed for admin stock control.

```http
GET    /api/v1/inventory
GET    /api/v1/inventory/variant/:variantId
POST   /api/v1/inventory/adjust
GET    /api/v1/inventory/logs
```

Recommended features:

- Manual stock adjustment
- Restock
- Sale stock reduction
- Return stock increase
- Inventory logs
- Low stock report

## Priority 2: Customer Experience APIs

These APIs improve the shopping experience.

### 9. Wishlist APIs

```http
POST   /api/v1/wishlist
GET    /api/v1/wishlist
DELETE /api/v1/wishlist/:productId
```

Recommended features:

- Add product to wishlist
- Remove product from wishlist
- Prevent duplicate wishlist items

### 10. Review APIs

```http
POST   /api/v1/products/:productId/reviews
GET    /api/v1/products/:productId/reviews
GET    /api/v1/reviews/pending
PATCH  /api/v1/reviews/:id/approve
DELETE /api/v1/reviews/:id
```

Recommended features:

- Customer rating and comment
- Admin approval
- Only verified buyers can review
- Average rating calculation

### 11. Coupon APIs

```http
POST   /api/v1/coupons
GET    /api/v1/coupons
GET    /api/v1/coupons/:code
PATCH  /api/v1/coupons/:id
DELETE /api/v1/coupons/:id
POST   /api/v1/coupons/apply
```

Recommended features:

- Percentage discount
- Fixed discount
- Expiry date
- Max usage
- Used count
- Coupon validation during checkout

### 12. Notification APIs

```http
GET    /api/v1/notifications
PATCH  /api/v1/notifications/:id/read
PATCH  /api/v1/notifications/read-all
DELETE /api/v1/notifications/:id
```

Recommended features:

- Order status notification
- Payment notification
- Admin notification
- Read/unread status

## Priority 3: Admin And Security APIs

These APIs are needed for production-level admin control.

### 13. Role And Permission APIs

```http
POST   /api/v1/roles
GET    /api/v1/roles
PATCH  /api/v1/roles/:id
DELETE /api/v1/roles/:id

POST   /api/v1/permissions
GET    /api/v1/permissions
PATCH  /api/v1/roles/:id/permissions
```

Recommended features:

- Admin role
- Customer role
- Staff role
- Permission-based access control
- Admin-only route guard

### 14. User Profile APIs

```http
GET    /api/v1/profile/me
PATCH  /api/v1/profile/me
POST   /api/v1/profile/avatar
DELETE /api/v1/profile/avatar
```

Recommended features:

- User bio
- Avatar upload
- Profile update

### 15. Auth Improvement APIs

Existing auth has register and login. These should be added later.

```http
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/change-password
GET    /api/v1/auth/me
```

Recommended features:

- Refresh token
- Session tracking
- Password reset token
- Email verification
- Logout from one device
- Logout from all devices

### 16. Activity Log APIs

```http
GET    /api/v1/activity-logs
GET    /api/v1/activity-logs/user/:userId
```

Recommended features:

- Track admin actions
- Track important user actions
- Store entity type and entity ID
- Store metadata as JSON

## Priority 4: Reporting And Business APIs

These APIs help business owners manage the shop.

### 17. Dashboard APIs

```http
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/sales
GET /api/v1/dashboard/orders
GET /api/v1/dashboard/products
GET /api/v1/dashboard/customers
```

Recommended metrics:

- Total sales
- Total orders
- Pending orders
- Low stock products
- Top selling products
- New customers
- Revenue by date

### 18. Search APIs

```http
GET /api/v1/search/products
GET /api/v1/search/suggestions
```

Recommended features:

- Keyword search
- Category filter
- Brand filter
- Price filter
- Sort
- Pagination

### 19. Shipping APIs

```http
POST   /api/v1/shipments
GET    /api/v1/shipments/order/:orderId
PATCH  /api/v1/shipments/:id
PATCH  /api/v1/shipments/:id/delivered
```

Recommended features:

- Courier name
- Tracking number
- Shipped date
- Delivered date

## Suggested Build Order

Build in this order:

1. Product APIs
2. Product media APIs
3. Attribute and variant APIs
4. Inventory APIs
5. Cart APIs
6. Order APIs
7. Payment APIs
8. Wishlist APIs
9. Review APIs
10. Coupon APIs
11. Admin role and permission APIs
12. Dashboard APIs

## Minimum Version For Real Use

For a first usable e-commerce backend, complete these modules first:

- Product
- Product media
- Product variant
- Inventory
- Cart
- Order
- Payment
- Admin authorization

After these are complete, the project can support a real online shop workflow:

```text
Customer registers -> browses products -> adds to cart -> places order -> pays -> admin processes order -> shipment/delivery
```

## Notes

- Public customer APIs should allow product browsing without login.
- Cart, wishlist, order, address, review, and profile APIs should require login.
- Admin APIs should require admin role or permission.
- All list APIs should support pagination.
- Important write APIs should create activity logs.
- Order creation should use database transactions.
- Stock should never go negative.
- Product price should be copied into order items during checkout.
