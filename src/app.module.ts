import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { CategoryModule } from './category/category.module';
import { BrandsModule } from './brands/brands.module';
import { ProductModule } from './product/product.module';
import { AttributeModule } from './attribute/attribute.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { InventoryModule } from './inventory/inventory.module';
import { PaymentModule } from './payment/payment.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ReviewModule } from './review/review.module';
import { CouponModule } from './coupon/coupon.module';
import { RoleModule } from './role/role.module';
import { ProfileModule } from './profile/profile.module';
import { NotificationModule } from './notification/notification.module';
import { ShipmentModule } from './shipment/shipment.module';
import { SearchModule } from './search/search.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { TagsModule } from './tags/tags.module';
import { UnitModule } from './unit/unit.module';
import { SettingsModule } from './settings/settings.module';
import { PoliciesModule } from './policies/policies.module';
import { SectionsModule } from './sections/sections.module';
import { ReportModule } from './report/report.module';
import { ProductDiscountModule } from './product-discount/product-discount.module';
import { CampaignModule } from './campaign/campaign.module';
import { WholesaleOrderRequestModule } from './wholesale-order-request/wholesale-order-request.module';
import { NewsModule } from './news/news.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    AddressModule,
    CategoryModule,
    BrandsModule,
    ProductModule,
    AttributeModule,
    CartModule,
    OrderModule,
    InventoryModule,
    PaymentModule,
    WishlistModule,
    ReviewModule,
    CouponModule,
    RoleModule,
    ProfileModule,
    NotificationModule,
    ShipmentModule,
    SearchModule,
    DashboardModule,
    ActivityLogModule,
    TagsModule,
    UnitModule,
    SettingsModule,
    PoliciesModule,
    SectionsModule,
    ReportModule,
    ProductDiscountModule,
    CampaignModule,
    WholesaleOrderRequestModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
