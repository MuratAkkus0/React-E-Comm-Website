import * as adminRepository from "./admin.repository.js";

export async function getDashboardStats() {
  const [ordersByStatus, revenue, lowStockCount, lowStockProducts, productCount, userCount] =
    await Promise.all([
      adminRepository.countOrdersByStatus(),
      adminRepository.sumRevenueCents(),
      adminRepository.countLowStockProducts(),
      adminRepository.findLowStockProducts(),
      adminRepository.countProducts(),
      adminRepository.countUsers(),
    ]);

  const ordersByStatusMap = Object.fromEntries(
    ordersByStatus.map((row) => [row.status, row._count._all]),
  );

  return {
    ordersByStatus: ordersByStatusMap,
    revenueCents: revenue._sum.totalCents ?? 0,
    lowStockCount,
    lowStockProducts,
    productCount,
    userCount,
  };
}
