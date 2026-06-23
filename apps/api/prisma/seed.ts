import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin@123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@ocnguyen.vn' },
    update: { passwordHash, role: UserRole.ADMIN },
    create: {
      email: 'admin@ocnguyen.vn',
      name: 'Admin Ốc Nguyễn',
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  const items = [
    {
      name: 'Ốc hương rang muối Hong Kong',
      description: 'Ốc hương giòn ngọt, rang cùng muối Hong Kong cay thơm, đậm vị.',
      price: 165000,
      category: 'Ốc đặc sản',
      imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80',
      isSignature: true,
    },
    {
      name: 'Càng ghẹ rang me',
      description: 'Sốt me chua ngọt quyện vị hải sản tươi, dùng kèm rau răm.',
      price: 189000,
      category: 'Hải sản nóng',
      imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=80',
      isSignature: true,
    },
    {
      name: 'Nghêu hấp sả Thái',
      description: 'Nước hấp thơm sả, lá chanh, ớt tươi; hợp để mở vị.',
      price: 99000,
      category: 'Món hấp',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Tôm nướng muối ớt',
      description: 'Tôm tươi nướng than, sốt muối ớt cay nhẹ, thơm mùi khói.',
      price: 215000,
      category: 'Món nướng',
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80',
      isSignature: true,
    },
    {
      name: 'Ốc len xào dừa',
      description: 'Vị béo dừa truyền thống, nước sốt sệt thơm, dễ ăn.',
      price: 129000,
      category: 'Ốc đặc sản',
      imageUrl: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Sò điệp nướng phô mai',
      description: 'Sò điệp béo ngọt phủ phô mai, nướng vàng mặt.',
      price: 149000,
      category: 'Món nướng',
      imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  for (const item of items) {
    await prisma.menuItem.upsert({
      where: { id: items.indexOf(item) + 1 },
      update: item,
      create: item,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
