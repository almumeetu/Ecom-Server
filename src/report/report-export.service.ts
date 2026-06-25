import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';

@Injectable()
export class ReportExportService {
  constructor(private readonly prisma: PrismaService) {}

  private getDateRange(startDate?: string, endDate?: string) {
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : now;
    return { start, end };
  }

  // ──────────────────────────────────────────────
  //  CSV HELPERS
  // ──────────────────────────────────────────────

  private escapeCsv(value: unknown): string {
    const str = value == null ? '' : String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  private toCsv(headers: string[], rows: string[][]): string {
    const headerLine = headers.map((h) => this.escapeCsv(h)).join(',');
    const dataLines = rows.map((row) => row.map((c) => this.escapeCsv(c)).join(','));
    return [headerLine, ...dataLines, ''].join('\n');
  }

  private n(val: unknown): number {
    if (val == null) return 0;
    if (typeof val === 'number') return val;
    if (typeof val === 'object' && 'toNumber' in (val as any)) {
      return (val as any).toNumber();
    }
    return Number(val);
  }

  private fmt(val: unknown): string {
    return this.n(val).toFixed(2);
  }

  private dateStr(d: Date | string | null | undefined): string {
    if (!d) return '';
    const date = typeof d === 'string' ? new Date(d) : d;
    return date.toISOString().split('T')[0];
  }

  // ──────────────────────────────────────────────
  //  SALES
  // ──────────────────────────────────────────────

  async salesToCsv(startDate?: string, endDate?: string): Promise<string> {
    const { start, end } = this.getDateRange(startDate, endDate);
    const items = await this.prisma.orderItem.findMany({
      where: { order: { paymentStatus: 'paid', placedAt: { gte: start, lte: end } } },
      include: {
        order: {
          select: {
            orderNumber: true, total: true, discount: true, placedAt: true,
            shippingAddress: true, user: { select: { name: true } },
          },
        },
        product: { select: { name: true } },
        variant: { select: { sku: true } },
      },
      orderBy: { order: { placedAt: 'desc' } },
    });

    const headers = ['Order Number', 'Customer', 'Total', 'Discount', 'Date', 'Product', 'SKU', 'Qty', 'Unit Price', 'Item Total'];
    const rows = items.map((i) => {
      const customer = i.order.user?.name ?? ((i.order.shippingAddress as any)?.fullName) ?? 'Guest';
      return [
        i.order.orderNumber,
        customer,
        this.fmt(i.order.total),
        this.fmt(i.order.discount),
        this.dateStr(i.order.placedAt),
        i.product.name,
        i.variant.sku,
        String(i.quantity),
        this.fmt(i.unitPrice),
        this.fmt(i.totalPrice),
      ];
    });

    return this.toCsv(headers, rows);
  }

  async salesToPdf(startDate?: string, endDate?: string): Promise<Buffer> {
    const { start, end } = this.getDateRange(startDate, endDate);

    const orders = await this.prisma.order.findMany({
      where: { paymentStatus: 'paid', placedAt: { gte: start, lte: end } },
      include: {
        items: { include: { product: { select: { name: true } }, variant: { select: { sku: true } } } },
        user: { select: { name: true } },
      },
      orderBy: { placedAt: 'desc' },
    });

    const totalRevenue = orders.reduce((s, o) => s + this.n(o.total), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: 'Sales Report' } });
    return this.buildPdf(doc, (d) => {
      this.addTitle(d, 'Sales Report', start, end);
      this.addSummary(d, [
        ['Total Revenue', `$${this.fmt(totalRevenue)}`],
        ['Total Orders', String(totalOrders)],
        ['Avg Order Value', `$${this.fmt(avgOrderValue)}`],
      ]);
      this.addTable(d, ['Order', 'Customer', 'Total', 'Discount', 'Date'], orders.map((o) => {
        const customer = o.user?.name ?? ((o.shippingAddress as any)?.fullName) ?? 'Guest';
        return [o.orderNumber, customer, `$${this.fmt(o.total)}`, `$${this.fmt(o.discount)}`, this.dateStr(o.placedAt)];
      }));
    });
  }

  // ──────────────────────────────────────────────
  //  USERS
  // ──────────────────────────────────────────────

  async usersToCsv(startDate?: string, endDate?: string): Promise<string> {
    const { start, end } = this.getDateRange(startDate, endDate);
    const users = await this.prisma.user.findMany({
      where: { createdAt: { gte: start, lte: end }, deletedAt: null },
      select: { name: true, email: true, phone: true, role: { select: { name: true } }, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['Name', 'Email', 'Phone', 'Role', 'Registered At'];
    const rows = users.map((u) => [
      u.name,
      u.email,
      u.phone ?? '',
      u.role?.name ?? 'user',
      this.dateStr(u.createdAt),
    ]);

    return this.toCsv(headers, rows);
  }

  async usersToPdf(startDate?: string, endDate?: string): Promise<Buffer> {
    const { start, end } = this.getDateRange(startDate, endDate);

    const users = await this.prisma.user.findMany({
      where: { createdAt: { gte: start, lte: end }, deletedAt: null },
      select: { name: true, email: true, phone: true, role: { select: { name: true } }, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: 'Customer Report' } });
    return this.buildPdf(doc, (d) => {
      this.addTitle(d, 'Customer Report', start, end);
      this.addSummary(d, [['New Users', String(users.length)]]);
      this.addTable(d, ['Name', 'Email', 'Phone', 'Role', 'Registered'], users.map((u) => [
        u.name, u.email, u.phone ?? '—', u.role?.name ?? 'user', this.dateStr(u.createdAt),
      ]));
    });
  }

  // ──────────────────────────────────────────────
  //  INVENTORY
  // ──────────────────────────────────────────────

  async inventoryToCsv(startDate?: string, endDate?: string): Promise<string> {
    const { start, end } = this.getDateRange(startDate, endDate);
    const logs = await this.prisma.inventoryLog.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { variant: { include: { product: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['Date', 'Product', 'SKU', 'Change', 'Reason', 'Note', 'Current Stock'];
    const rows = logs.map((l) => [
      this.dateStr(l.createdAt),
      l.variant.product.name,
      l.variant.sku,
      String(l.change),
      l.reason,
      l.note ?? '',
      String(l.variant.stockQuantity),
    ]);

    return this.toCsv(headers, rows);
  }

  async inventoryToPdf(startDate?: string, endDate?: string): Promise<Buffer> {
    const { start, end } = this.getDateRange(startDate, endDate);

    const logs = await this.prisma.inventoryLog.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { variant: { include: { product: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });

    const totalIn = logs.filter((l) => l.change > 0).reduce((s, l) => s + l.change, 0);
    const totalOut = logs.filter((l) => l.change < 0).reduce((s, l) => s + Math.abs(l.change), 0);

    const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: 'Inventory Report' } });
    return this.buildPdf(doc, (d) => {
      this.addTitle(d, 'Inventory Report', start, end);
      this.addSummary(d, [
        ['Stock In', String(totalIn)],
        ['Stock Out', String(totalOut)],
        ['Transactions', String(logs.length)],
      ]);
      this.addTable(d, ['Date', 'Product', 'SKU', 'Change', 'Reason'], logs.map((l) => [
        this.dateStr(l.createdAt), l.variant.product.name, l.variant.sku, String(l.change), l.reason,
      ]));
    });
  }

  // ──────────────────────────────────────────────
  //  PURCHASES
  // ──────────────────────────────────────────────

  async purchasesToCsv(startDate?: string, endDate?: string): Promise<string> {
    const { start, end } = this.getDateRange(startDate, endDate);
    const logs = await this.prisma.inventoryLog.findMany({
      where: { reason: 'restock', createdAt: { gte: start, lte: end } },
      include: { variant: { include: { product: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['Date', 'Product', 'SKU', 'Qty', 'Unit Cost', 'Total Cost', 'Note'];
    const rows = logs.map((l) => [
      this.dateStr(l.createdAt),
      l.variant.product.name,
      l.variant.sku,
      String(l.change),
      this.fmt(l.variant.cost),
      this.fmt(this.n(l.change) * this.n(l.variant.cost)),
      l.note ?? '',
    ]);

    return this.toCsv(headers, rows);
  }

  async purchasesToPdf(startDate?: string, endDate?: string): Promise<Buffer> {
    const { start, end } = this.getDateRange(startDate, endDate);

    const logs = await this.prisma.inventoryLog.findMany({
      where: { reason: 'restock', createdAt: { gte: start, lte: end } },
      include: { variant: { include: { product: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' },
    });

    const totalUnits = logs.reduce((s, l) => s + l.change, 0);
    const totalCost = logs.reduce((s, l) => s + this.n(l.change) * this.n(l.variant.cost), 0);

    const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: 'Purchase Report' } });
    return this.buildPdf(doc, (d) => {
      this.addTitle(d, 'Purchase Report', start, end);
      this.addSummary(d, [
        ['Total Purchases', String(logs.length)],
        ['Total Units', String(totalUnits)],
        ['Total Cost', `$${this.fmt(totalCost)}`],
      ]);
      this.addTable(d, ['Date', 'Product', 'SKU', 'Qty', 'Unit Cost', 'Total Cost'], logs.map((l) => [
        this.dateStr(l.createdAt), l.variant.product.name, l.variant.sku, String(l.change),
        `$${this.fmt(l.variant.cost)}`, `$${this.fmt(this.n(l.change) * this.n(l.variant.cost))}`,
      ]));
    });
  }

  // ──────────────────────────────────────────────
  //  DISCOUNTS
  // ──────────────────────────────────────────────

  async discountsToCsv(startDate?: string, endDate?: string): Promise<string> {
    const { start, end } = this.getDateRange(startDate, endDate);

    const [orders, coupons] = await Promise.all([
      this.prisma.order.findMany({
        where: { discount: { gt: 0 }, placedAt: { gte: start, lte: end } },
        include: { user: { select: { name: true } } },
        orderBy: { placedAt: 'desc' },
      }),
      this.prisma.coupon.findMany({
        where: { OR: [{ expiresAt: null }, { expiresAt: { gte: start } }] },
        orderBy: { usedCount: 'desc' },
      }),
    ]);

    const lines: string[] = [];

    lines.push(this.toCsv(
      ['Code', 'Type', 'Value', 'Used Count', 'Max Usage', 'Expires'],
      coupons.map((c) => [
        c.code, c.type, this.fmt(c.value), String(c.usedCount), String(c.maxUsage),
        c.expiresAt ? this.dateStr(c.expiresAt) : 'Never',
      ]),
    ));

    lines.push('');

    lines.push(this.toCsv(
      ['Order Number', 'Customer', 'Discount Amount', 'Order Total', 'Date'],
      orders.map((o) => {
        const customer = o.user?.name ?? ((o.shippingAddress as any)?.fullName) ?? 'Guest';
        return [o.orderNumber, customer, this.fmt(o.discount), this.fmt(o.total), this.dateStr(o.placedAt)];
      }),
    ));

    return lines.join('\n');
  }

  async discountsToPdf(startDate?: string, endDate?: string): Promise<Buffer> {
    const { start, end } = this.getDateRange(startDate, endDate);

    const [orders, coupons] = await Promise.all([
      this.prisma.order.findMany({
        where: { discount: { gt: 0 }, placedAt: { gte: start, lte: end } },
        include: { user: { select: { name: true } } },
        orderBy: { placedAt: 'desc' },
      }),
      this.prisma.coupon.findMany({
        where: { OR: [{ expiresAt: null }, { expiresAt: { gte: start } }] },
        orderBy: { usedCount: 'desc' },
      }),
    ]);

    const totalDiscount = orders.reduce((s, o) => s + this.n(o.discount), 0);

    const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: 'Discount Report' } });
    return this.buildPdf(doc, (d) => {
      this.addTitle(d, 'Discount Report', start, end);
      this.addSummary(d, [
        ['Total Discount Given', `$${this.fmt(totalDiscount)}`],
        ['Orders with Discount', String(orders.length)],
        ['Total Coupons', String(coupons.length)],
      ]);

      if (coupons.length > 0) {
        d.moveDown(1);
        d.fontSize(14).text('Coupons', { underline: true });
        this.addTable(d, ['Code', 'Type', 'Value', 'Used', 'Expires'], coupons.map((c) => [
          c.code, c.type, this.fmt(c.value), String(c.usedCount),
          c.expiresAt ? this.dateStr(c.expiresAt) : 'Never',
        ]));
      }

      d.moveDown(1);
      d.fontSize(14).text('Discounted Orders', { underline: true });
      this.addTable(d, ['Order', 'Customer', 'Discount', 'Total', 'Date'], orders.map((o) => {
        const customer = o.user?.name ?? ((o.shippingAddress as any)?.fullName) ?? 'Guest';
        return [o.orderNumber, customer, `$${this.fmt(o.discount)}`, `$${this.fmt(o.total)}`, this.dateStr(o.placedAt)];
      }));
    });
  }

  // ──────────────────────────────────────────────
  //  PDF BUILDING BLOCKS
  // ──────────────────────────────────────────────

  private buildPdf(
    doc: any,
    fn: (doc: any) => void,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      fn(doc);
      doc.end();
    });
  }

  private addTitle(doc: any, title: string, start: Date, end: Date) {
    doc.fontSize(22).text(title, { align: 'center' });
    doc.fontSize(11).text(`Period: ${this.dateStr(start)} — ${this.dateStr(end)}`, { align: 'center' });
    doc.moveDown(2);
  }

  private addSummary(doc: any, items: [string, string][]) {
    const pageW = doc.page.width - 100;
    const boxW = Math.min(pageW / items.length - 10, 180);
    const boxH = 50;
    const startX = (pageW - items.length * (boxW + 10) + 10) / 2 + 50;

    for (let i = 0; i < items.length; i++) {
      const x = startX + i * (boxW + 10);
      const y = doc.y;

      doc.rect(x, y, boxW, boxH).fill('#f0f4ff').stroke('#d0d7ff');
      doc.fillColor('#1e293b').fontSize(9).text(items[i][0], x + 8, y + 6, { width: boxW - 16, align: 'center' });
      doc.fontSize(14).text(items[i][1], x + 8, y + 22, { width: boxW - 16, align: 'center' });
    }

    doc.y += boxH + 20;
  }

  private addTable(doc: any, headers: string[], rows: string[][]) {
    const pageW = doc.page.width - 100;
    const colW = pageW / headers.length;
    const rowH = 18;

    const drawRow = (cells: string[], y: number, fill: string, textColor: string) => {
      doc.rect(50, y, pageW, rowH).fill(fill);
      doc.fillColor(textColor).fontSize(8);
      cells.forEach((cell, i) => {
        doc.text(cell, 50 + i * colW + 4, y + 4, { width: colW - 8, align: i === 0 ? 'left' : 'right' });
      });
    };

    doc.moveDown(0.5);
    drawRow(headers, doc.y, '#1e293b', '#ffffff');
    doc.y += rowH;

    for (const row of rows) {
      const y = doc.y;
      drawRow(row, y, y % 40 === 0 ? '#f8fafc' : '#ffffff', '#1e293b');
      doc.y += rowH;

      if (doc.y > doc.page.height - 60) {
        doc.addPage();
      }
    }
  }
}