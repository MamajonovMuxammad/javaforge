import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function run() {
  const username = process.argv[2] || process.env.SEED_USERNAME;
  const password = process.argv[3] || process.env.SEED_PASSWORD;
  const targetDay = Number(process.argv[4] || process.env.SEED_DAY || 1);

  if (!username || !password) {
    console.error("Usage: node scripts/seed-user.mjs <username> <password> [day]");
    console.error("Example: node scripts/seed-user.mjs student Pass123! 1");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const completedDays = [];
  const completedTasks = {};
  const completedAt = {};

  for (let d = 1; d <= targetDay; d++) {
    completedDays.push(d);
    completedTasks[String(d)] = [`d${d}_t1`, `d${d}_t2`, `d${d}_t3`];
    completedAt[String(d)] = new Date().toISOString();
  }

  const xp = completedDays.length * 100;

  const progressData = {
    completedDays,
    completedTasks,
    completedAt,
    code: {},
    achievements: {
      first_run: new Date().toISOString(),
      first_task: new Date().toISOString(),
    },
    runsCount: completedDays.length * 3,
    compileErrorsCount: 0,
    checksCount: completedDays.length * 3,
    scannerDays: [1],
  };

  const existing = await prisma.user.findUnique({ where: { username } });
  let user;

  if (existing) {
    user = await prisma.user.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        xp,
        streakCurrent: completedDays.length,
        streakBest: completedDays.length,
        lastActiveDate: new Date().toISOString().slice(0, 10),
        progress: {
          upsert: {
            create: progressData,
            update: progressData,
          },
        },
      },
    });
    console.log(`✅ Пользователь ${username} успешно обновлен в базе данных!`);
  } else {
    user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        avatar: "🚀",
        role: "student",
        xp,
        streakCurrent: completedDays.length,
        streakBest: completedDays.length,
        lastActiveDate: new Date().toISOString().slice(0, 10),
        progress: {
          create: progressData,
        },
      },
    });
    console.log(`✅ Пользователь ${username} успешно создан в базе данных!`);
  }

  console.log("ID:", user.id);
  console.log("XP:", user.xp);
  console.log("Completed Days:", completedDays);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
