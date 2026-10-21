import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function run() {
  const username = "wercis";
  const password = "Muxammad2008!";
  const passwordHash = await bcrypt.hash(password, 10);

  const d1_code = `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        int birthYear = scanner.nextInt();
        int age = 2026 - birthYear;

        System.out.println("Привет, " + name + "!");
        System.out.println("Тебе " + age + " лет");
    }
}`;

  const progressData = {
    completedDays: [1],
    completedTasks: { "1": ["d1_t1", "d1_t2", "d1_t3"] },
    completedAt: { "1": new Date().toISOString() },
    code: {
      "1": d1_code,
      "1_d1_t1": 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Разработчик: Java Junior");\n        System.out.println("Стек: Java, Spring Boot, PostgreSQL");\n        System.out.println("Цель: 2026 год");\n    }\n}',
      "1_d1_t2": d1_code,
      "1_d1_t3": 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int h = sc.nextInt();\n        int d = sc.nextInt();\n        System.out.println("Часов в неделю: " + (h * d));\n        System.out.println("Часов в год: " + (h * d * 52));\n    }\n}',
    },
    achievements: {
      first_code: new Date().toISOString(),
      first_day: new Date().toISOString(),
    },
    runsCount: 5,
    compileErrorsCount: 0,
    checksCount: 3,
    scannerDays: [1],
  };

  const existing = await prisma.user.findUnique({ where: { username } });
  let user;

  if (existing) {
    user = await prisma.user.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        avatar: "🚀",
        xp: 100,
        streakCurrent: 1,
        streakBest: 1,
        lastActiveDate: "2026-10-21",
        progress: {
          upsert: {
            create: progressData,
            update: progressData,
          },
        },
      },
    });
    console.log("✅ Аккаунт wercis успешно обновлен в Supabase!");
  } else {
    user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        avatar: "🚀",
        role: "student",
        xp: 100,
        streakCurrent: 1,
        streakBest: 1,
        lastActiveDate: "2026-10-21",
        progress: {
          create: progressData,
        },
      },
    });
    console.log("✅ Аккаунт wercis успешно создан в Supabase!");
  }

  console.log("User ID:", user.id);
  console.log("Username:", user.username);
  console.log("XP:", user.xp);
  console.log("Streak:", user.streakCurrent);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
