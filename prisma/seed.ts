import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@marilah.my' },
    update: {},
    create: {
      email: 'admin@marilah.my',
      password: adminPassword,
      name: 'Super Admin',
    },
  });

  // 2. Create Categories
  const categoryData = [
    { name: '美食', slug: 'food', icon: '🍔' },
    { name: '夜市', slug: 'night-market', icon: '🌙' },
    { name: 'Cafe', slug: 'cafe', icon: '☕' },
    { name: '宠物', slug: 'pet', icon: '🐶' },
    { name: '招聘', slug: 'jobs', icon: '💼' },
    { name: '租房', slug: 'rent', icon: '🏠' },
    { name: '二手', slug: 'second-hand', icon: '🚲' },
    { name: '服务', slug: 'services', icon: '🛠️' },
  ];

  const categories: any = {};
  for (const cat of categoryData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // 3. Create Tags
  const tagData = [
    { name: 'PasarMalam', slug: 'pasar-malam' },
    { name: 'Kuala Lumpur', slug: 'kuala-lumpur' },
    { name: 'City Centre', slug: 'city-centre' },
    { name: 'Cafe', slug: 'cafe-tag' },
    { name: 'Food', slug: 'food-tag' },
    { name: 'Pet', slug: 'pet-tag' },
  ];

  const tags: any = {};
  for (const tag of tagData) {
    tags[tag.slug] = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: tag,
      create: tag,
    });
  }

  // 4. Create Locations
  const locationData = [
    { city: 'Kuala Lumpur', state: 'WP Kuala Lumpur', country: 'Malaysia' },
    { city: 'Petaling Jaya', state: 'Selangor', country: 'Malaysia' },
    { city: 'George Town', state: 'Penang', country: 'Malaysia' },
    { city: 'Johor Bahru', state: 'Johor', country: 'Malaysia' },
  ];

  const locations: any[] = [];
  for (const loc of locationData) {
    let existing = await prisma.location.findFirst({
      where: { city: loc.city, state: loc.state }
    });
    if (!existing) {
      existing = await prisma.location.create({ data: loc });
    }
    locations.push(existing);
  }

  // 5. Create a test user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Test User',
    },
  });

  // 6. Create 5 sample posts
  const posts = [
    {
      title: '康乐夜市美食推荐',
      description: '非常热闹的夜市，有很多好吃的。推荐臭豆腐和奶茶。',
      contact: '012-3456789',
      status: 'APPROVED',
      isRecommended: true,
      categoryId: categories['night-market'].id,
      userId: user.id,
      locationId: locations[0].id,
      images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'],
    },
    {
      title: '吉隆坡市中心精品咖啡馆',
      description: '环境优雅，适合办公和聚会。这里的手冲咖啡非常出名。',
      contact: '012-9876543',
      status: 'APPROVED',
      isPinned: true,
      categoryId: categories['cafe'].id,
      userId: user.id,
      locationId: locations[0].id,
      images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800'],
    },
    {
      title: '可爱金毛寻回犬待领养',
      description: '由于搬家无法继续照顾，希望找一个有爱心的家庭。',
      contact: '016-1112222',
      status: 'APPROVED',
      categoryId: categories['pet'].id,
      userId: user.id,
      locationId: locations[1].id,
      images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=800'],
    },
    {
      title: 'PJ 著名肉骨茶',
      description: '老字号肉骨茶，汤头浓郁，排骨软烂入味。',
      contact: '017-3334444',
      status: 'APPROVED',
      categoryId: categories['food'].id,
      userId: user.id,
      locationId: locations[1].id,
      images: ['https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800'],
    },
    {
      title: '诚聘高级前端开发工程师',
      description: '要求熟练掌握 React 和 Next.js，待遇优厚，五险一金。',
      contact: 'hr@example.com',
      status: 'APPROVED',
      categoryId: categories['jobs'].id,
      userId: user.id,
      locationId: locations[0].id,
      images: ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800'],
    },
  ];

  for (const post of posts) {
    const { images, ...postData } = post;
    await prisma.post.create({
      data: {
        ...postData,
        images: {
          create: images.map(url => ({ url }))
        }
      }
    });
  }

  // 7. Create initial announcements
  const announcementCount = await prisma.announcement.count();
  if (announcementCount === 0) {
    await prisma.announcement.createMany({
      data: [
        { content: '欢迎来到 Marilah.my！这是一个全新的分类信息平台。' },
        { content: '防诈骗提醒：交易时请务必当面确认，保护个人财产安全。' },
      ],
    });
  }

  console.log('Seed data created successfully with 5 posts');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
