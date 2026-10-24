import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Начинаем наполнение базы данных демо-пользователями...");

  const defaultPasswordHash = await bcrypt.hash("demo12345", 10);

  const seedUsers = [
    {
      username: "Nazar",
      avatar: "⚡️",
      role: "student",
      xp: 145,
      streakCurrent: 1,
      streakBest: 1,
      completedDays: [1],
    },
    {
      username: "Skittler",
      avatar: "👾",
      role: "student",
      xp: 20,
      streakCurrent: 1,
      streakBest: 1,
      completedDays: [],
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
