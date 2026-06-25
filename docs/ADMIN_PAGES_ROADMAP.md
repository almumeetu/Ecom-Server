# NeoComerz Admin Pages Roadmap

## Purpose

This document lists the admin pages needed to manage NeoComerz as a complete e-commerce business.

The admin panel should be built for store owners, admins, and staff users.

## Priority 1: Core Admin Pages

These pages are required first because the business cannot operate properly without them.

### 1. Admin Login Page

Purpose:

- Allow admin/staff users to log in securely.

Required features:

- Email and password login
- Error message for invalid credentials
- Redirect logged-in users to dashboard
- Forgot password link

### 2. Dashboard Page

Purpose:

- Show business summary in one place.

Required widgets:

- Total sales
- Total orders
- Pending orders
- Processing orders
- Delivered orders
- Total customers
- Total products
- Low stock products
- Recent orders
- Top selling products

Useful filters:

- Today
- Last 7 days
- Last 30 days
- Custom date range

### 3. Products List Page

Purpose:

- Manage all products.

Required features:

- Product table
- Search by product name or SKU
- Filter by category
- Filter by brand
- Filter by status
- Filter by stock status
- Sort by newest, price, stock
- Pagination
- View product
- Edit product
- Delete or soft delete product
- Change product status

Table columns:

- Image
- Name
- SKU or default variant SKU
- Category
- Brand
- Price
- Stock
- Status
- Created date
- Actions

### 4. Create Product Page

Purpose:

- Add a new product to the shop.

Required sections:

- Basic product information
- Brand and category
- Description
- Product status
- SEO information
- Product images/media
- Variants
- Inventory

Required fields:

- Name
- Slug
- Description
- Brand
- Category
- Status
- Meta title
- Meta description
- Meta keywords

### 5. Edit Product Page

Purpose:

- Update existing product information.

Required features:

- Edit basic product data
- Update category and brand
- Update product media
- Add/edit/delete variants
- Update stock
- Change product status
- Soft delete product

### 6. Product Variants Page Or Section

Purpose:

- Manage product variants like size, color, RAM, storage, etc.

Required features:

- Add variant
- Edit variant
- Delete variant
- Set default variant
- Set SKU
- Set price
- Set cost
- Set stock quantity
- Set low stock alert threshold
- Assign attributes

Example:

```text
Product: T-Shirt
Variant 1: Red / M
Variant 2: Red / L
Variant 3: Black / M
```

### 7. Orders List Page

Purpose:

- Manage all customer orders.

Required features:

- Order table
- Search by order number, customer name, phone, email
- Filter by order status
- Filter by payment status
- Filter by date range
- Sort by newest or total amount
- Pagination
- View order details
- Update order status

Table columns:

- Order number
- Customer
- Phone
- Total
- Payment status
- Order status
- Placed date
- Actions

### 8. Order Details Page

Purpose:

- Show full details of a single order.

Required sections:

- Order summary
- Customer information
- Shipping address
- Ordered items
- Payment information
- Shipment information
- Order status history
- Admin notes

Required actions:

- Change order status
- Mark as paid
- Add shipment tracking
- Cancel order
- Print invoice

### 9. Categories Page

Purpose:

- Manage product categories.

Required features:

- Category list
- Create category
- Edit category
- Delete category
- Parent-child category support
- Search category

Table columns:

- Name
- Slug
- Parent category
- Product count
- Created date
- Actions

### 10. Brands Page

Purpose:

- Manage product brands.

Required features:

- Brand list
- Create brand
- Edit brand
- Delete brand
- Upload brand logo
- Search brand

Table columns:

- Logo
- Name
- Slug
- Product count
- Created date
- Actions

## Priority 2: Business Management Pages

These pages are important after the core shopping workflow is ready.

### 11. Inventory Page

Purpose:

- Track and manage stock.

Required features:

- View all product variant stock
- Search by product or SKU
- Filter low stock products
- Manual stock adjustment
- Restock
- View stock movement history

Table columns:

- Product
- Variant
- SKU
- Current stock
- Low stock threshold
- Stock status
- Last updated
- Actions

### 12. Inventory Logs Page

Purpose:

- Audit all stock changes.

Required features:

- View stock change history
- Filter by product variant
- Filter by reason
- Filter by date range

Table columns:

- Product
- Variant
- Change
- Reason
- Reference ID
- Note
- Created date

### 13. Customers Page

Purpose:

- Manage customer accounts.

Required features:

- Customer list
- Search by name, email, phone
- View customer profile
- View customer orders
- Disable or restore customer

Table columns:

- Name
- Email
- Phone
- Total orders
- Total spent
- Created date
- Status
- Actions

### 14. Customer Details Page

Purpose:

- Show full customer information.

Required sections:

- Basic profile
- Addresses
- Orders
- Wishlist
- Reviews
- Activity logs

### 15. Coupons Page

Purpose:

- Manage discounts and promotional codes.

Required features:

- Create coupon
- Edit coupon
- Delete coupon
- Enable or disable coupon
- View usage count

Required fields:

- Code
- Type: percentage or fixed
- Value
- Max usage
- Expiry date

### 16. Reviews Page

Purpose:

- Moderate customer product reviews.

Required features:

- View all reviews
- Filter pending reviews
- Approve review
- Reject or delete review
- Search by product or customer

Table columns:

- Product
- Customer
- Rating
- Comment
- Approved status
- Created date
- Actions

### 17. Payments Page

Purpose:

- Track order payments.

Required features:

- Payment list
- Filter by payment status
- Filter by payment method
- Search by order number or transaction ID
- View payment details

Table columns:

- Order number
- Customer
- Method
- Amount
- Transaction ID
- Status
- Paid date

### 18. Shipments Page

Purpose:

- Track deliveries.

Required features:

- Shipment list
- Search by order number or tracking number
- Filter by courier
- Mark as shipped
- Mark as delivered
- Update tracking number

Table columns:

- Order number
- Customer
- Courier
- Tracking number
- Shipped date
- Delivered date
- Actions

## Priority 3: Admin Control Pages

These pages are needed for multi-admin or staff-based business.

### 19. Admin Users Page

Purpose:

- Manage admin and staff accounts.

Required features:

- Create admin/staff user
- Edit admin/staff user
- Assign role
- Disable user
- Reset password

Table columns:

- Name
- Email
- Role
- Status
- Created date
- Actions

### 20. Roles Page

Purpose:

- Manage admin roles.

Required features:

- Create role
- Edit role
- Delete role
- Assign permissions

Example roles:

- Super Admin
- Store Manager
- Order Manager
- Product Manager
- Support Staff

### 21. Permissions Page

Purpose:

- Control what each role can access.

Example permissions:

- Manage products
- Manage orders
- Manage customers
- Manage payments
- Manage coupons
- Manage settings
- View reports

### 22. Activity Logs Page

Purpose:

- Track important admin and system actions.

Required features:

- View admin actions
- Search by user
- Filter by action
- Filter by entity type
- Filter by date range

Table columns:

- User
- Action
- Entity type
- Entity ID
- Metadata
- Created date

## Priority 4: Settings And Reporting Pages

These pages are useful for a polished production system.

### 23. Store Settings Page

Purpose:

- Manage general shop settings.

Required settings:

- Store name
- Store logo
- Store email
- Store phone
- Store address
- Currency
- Timezone
- Default language

### 24. Payment Settings Page

Purpose:

- Configure payment methods.

Required settings:

- Cash on Delivery enable/disable
- SSLCommerz credentials
- bKash credentials
- Nagad credentials
- Stripe credentials if needed

### 25. Shipping Settings Page

Purpose:

- Configure shipping methods and costs.

Required settings:

- Delivery zones
- Inside city delivery charge
- Outside city delivery charge
- Free shipping threshold
- Courier list

### 26. Media Library Page

Purpose:

- Manage uploaded images and videos.

Required features:

- View uploaded media
- Upload new media
- Delete media
- Search media
- Filter by type
- Copy media URL

### 27. Sales Report Page

Purpose:

- Analyze sales performance.

Required reports:

- Revenue by date
- Orders by date
- Average order value
- Payment method breakdown
- Top selling products
- Top customers

Filters:

- Date range
- Order status
- Payment status

### 28. Product Report Page

Purpose:

- Analyze product performance.

Required reports:

- Best selling products
- Low stock products
- Out of stock products
- Products with no sales
- Most reviewed products

### 29. Customer Report Page

Purpose:

- Analyze customer behavior.

Required reports:

- New customers
- Returning customers
- Top customers by spending
- Customers with abandoned carts

## Suggested Admin Sidebar Menu

```text
Dashboard
Products
  All Products
  Add Product
  Attributes
Categories
Brands
Orders
Payments
Shipments
Inventory
Customers
Coupons
Reviews
Media Library
Reports
  Sales Report
  Product Report
  Customer Report
Admin Management
  Admin Users
  Roles
  Permissions
Activity Logs
Settings
  Store Settings
  Payment Settings
  Shipping Settings
```

## Suggested Build Order

Build admin pages in this order:

1. Admin login
2. Dashboard
3. Products list
4. Create product
5. Edit product
6. Categories
7. Brands
8. Orders list
9. Order details
10. Inventory
11. Customers
12. Coupons
13. Reviews
14. Payments
15. Shipments
16. Roles and permissions
17. Settings
18. Reports

## Minimum Admin Panel For First Release

For the first usable version, build these pages first:

- Admin login
- Dashboard
- Products list
- Create product
- Edit product
- Categories
- Brands
- Orders list
- Order details
- Inventory
- Customers

With these pages, an admin can manage the basic online shop workflow:

```text
Add products -> manage stock -> receive orders -> update order status -> manage customers
```

## Notes

- Admin pages should require admin login.
- Staff access should depend on role permissions.
- Tables should support search, filter, sort, and pagination.
- Destructive actions should show confirmation modals.
- Forms should have clear validation messages.
- Order and inventory actions should create activity logs.
- Dashboard and reports should support date filters.
