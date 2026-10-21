import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начинаем наполнение базы данных демо-пользователями...");

  const defaultPasswordHash = await bcrypt.hash("demo12345", 10);

  const seedUsers = [
    {
      username: "alex_senior",
      avatar: "🚀",
      role: "student",
      xp: 2150,
      streakCurrent: 15,
      streakBest: 15,
      completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    },
    {
      username: "code_ninja",
      avatar: "🥷",
      role: "student",
      xp: 1640,
      streakCurrent: 9,
      streakBest: 12,
      completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
    {
      username: "maria_backend",
      avatar: "💻",
      role: "student",
      xp: 1320,
      streakCurrent: 7,
      streakBest: 8,
      completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    {
      username: "temirlan_java",
      avatar: "⚡️",
      role: "student",
      xp: 980,
      streakCurrent: 5,
      streakBest: 6,
      completedDays: [1, 2, 3, 4, 5, 6, 7],
    },
  ];

  for (const u of seedUsers) {
    const existing = await prisma.user.findUnique({
      where: { username: u.username },
    });

    if (!existing) {
      await prisma.user.create({
        data: {
          username: u.username,
          passwordHash: defaultPasswordHash,
          avatar: u.avatar,
          role: u.role,
          xp: u.xp,
          streakCurrent: u.streakCurrent,
          streakBest: u.streakBest,
          progress: {
            create: {
              completedDays: u.completedDays,
              completedTasks: {},
              completedAt: {},
              code: {},
              achievements: {},
              runsCount: u.completedDays.length * 3,
              compileErrorsCount: 2,
              checksCount: u.completedDays.length * 2,
              scannerDays: [1, 2],
            },
          },
        },
      });
      console.log(`✅ Создан пользователь: ${u.username}`);
    } else {
      console.log(`ℹ️ Пользователь ${u.username} уже существует.`);
    }
  }

  console.log("🎉 Сидирование базы данных успешно завершено!");
}

main()
  .catch((e) => {
    console.error("❌ Ошибка при сидировании:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
