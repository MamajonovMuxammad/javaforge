import type { Lesson, LessonTask } from "./types";

function withDefaults(l: Omit<Lesson, "starterCode" | "tests" | "requiredCode" | "hints" | "solution" | "sampleInput">): Lesson {
  const mainTask = l.tasks[0];
  return {
    ...l,
    task: mainTask,
    starterCode: mainTask.starterCode,
    sampleInput: mainTask.sampleInput,
    tests: mainTask.tests,
    requiredCode: mainTask.requiredCode,
    hints: mainTask.hints,
    solution: mainTask.solution,
  };
}

export const module3Lessons: Lesson[] = [
  /* ------------------------------------------------------------------ */
  /*  DAY 13: Java While & Do/While Loop (Циклы while и do-while)       */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 13,
    moduleId: 3,
    title: "Java While & Do/While Loop: циклы с пред- и постусловием",
    short: "while, do-while, условия остановки и защита от вечных циклов",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Зачем нужны циклы: автоматизация повторяющихся действий",
      "Цикл while: проверка условия ДО выполнения тела",
      "Итерации и обязательное обновление счетчика",
      "Цикл do/while: гарантированное выполнение минимум 1 раз",
      "Опасность бесконечного цикла: зависание программы и CPU 100%",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java цикл while", note: "Цикл while с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов циклы while do while Java", note: "while и do-while на примерах" },
    ],
    theory: [
      { type: "h", text: "Цикл while (с предусловием)" },
      {
        type: "p",
        text: "Цикл `while` выполняет блок кода до тех пор, пока указанное условие остаётся `true`.",
      },
      {
        type: "code",
        caption: "Синтаксис while (W3Schools)",
        code: `int i = 0;
while (i < 5) {
    System.out.println("Шаг: " + i);
    i++; // ОБЯЗАТЕЛЬНО: шаг цикла, иначе цикл станет бесконечным!
}`,
      },
      { type: "h", text: "Цикл do/while (с постусловием)" },
      {
        type: "p",
        text: "Главное отличие `do/while`: его тело **всегда выполнится хотя бы один раз**, потому что условие проверяется в самом конце:",
      },
      {
        type: "code",
        caption: "Синтаксис do/while",
        code: `int i = 0;
do {
    System.out.println("Значение: " + i);
    i++;
} while (i < 5);`,
      },
    ],
    tasks: [
      {
        id: "d13_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Степени двойки)",
        shortDesc: "С помощью цикла while выведи степени двойки от 1 до 1024",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Начни с `int val = 1;`.\nС помощью цикла `while (val <= 1024)` выводи текущее значение и на каждом шаге умножай его на 2 (`val *= 2`).\nВывод должен начинаться с `Степень: 1` и заканчиваться `Степень: 1024`.",
        requirements: [
          "Используй цикл `while`.",
          "Выведи все степени двойки от 1 до 1024.",
        ],
        exampleOutput: "Степень: 1\nСтепень: 2\n...\nСтепень: 1024",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // TODO: выведи степени двойки от 1 до 1024 с помощью while
    }
}
`,
        tests: [
          {
            label: "Степени двойки",
            expected: [
              "Степень: 1",
              "Степень: 2",
              "Степень: 4",
              "Степень: 512",
              "Степень: 1024",
            ],
          },
        ],
        requiredCode: [{ pattern: "while\\s*\\(", message: "Используй while" }],
        hints: ["`int val = 1; while (val <= 1024) { System.out.println(\"Степень: \" + val); val *= 2; }`"],
        solution: `public class Main {
    public static void main(String[] args) {
        int val = 1;
        while (val <= 1024) {
            System.out.println("Степень: " + val);
            val *= 2;
        }
    }
}
`,
      },
      {
        id: "d13_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Угадай число с do/while)",
        shortDesc: "Считывай догадки пользователя, пока число не совпадет с загаданным",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Секретное число равно `42`.\nПрограмма последовательно считывает числа из `Scanner` в цикле `do/while`.\nНа каждой неверной попытке выводится: `Попытка: <num> — не угадал!`.\nКогда пользователь введёт 42, цикл завершается и выводится: `Попытка: 42 — в яблочко!`.",
        requirements: [
          "Используй цикл `do/while`.",
          "Завершай ввод при совпадении с 42.",
        ],
        exampleInput: "10\n25\n42",
        exampleOutput: "Попытка: 10 — не угадал!\nПопытка: 25 — не угадал!\nПопытка: 42 — в яблочко!",
        sampleInput: "10\n25\n42",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        final int SECRET = 42;

        // TODO: считывай попытки в цикле do-while
    }
}
`,
        tests: [
          {
            label: "10, 25, 42",
            stdin: "10\n25\n42\n",
            expected: [
              "Попытка: 10 — не угадал!",
              "Попытка: 25 — не угадал!",
              "Попытка: 42 — в яблочко!",
            ],
          },
        ],
        requiredCode: [{ pattern: "do\\s*\\{", message: "Используй цикл do-while" }],
        hints: ["`do { guess = scanner.nextInt(); ... } while (guess != SECRET);`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        final int SECRET = 42;
        int guess;

        do {
            guess = scanner.nextInt();
            if (guess != SECRET) {
                System.out.println("Попытка: " + guess + " — не угадал!");
            } else {
                System.out.println("Попытка: " + guess + " — в яблочко!");
            }
        } while (guess != SECRET);
    }
}
`,
      },
      {
        id: "d13_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Сумма и количество цифр числа)",
        shortDesc: "Алгоритм разбора числа на цифры в цикле while (n > 0)",
        difficulty: "Средний",
        xp: 40,
        description:
          "Программа считывает положительное целое число `n`.\nС помощью цикла `while (n > 0)` найди:\n- Количество цифр в числе (`count`)\n- Сумму всех цифр числа (`sum`)\nНа каждой итерации извлекай последнюю цифру (`n % 10`) и отбрасывай её (`n /= 10`).\nВыведи:\n`Цифр в числе: <count>`\n`Сумма цифр: <sum>`",
        requirements: [
          "Используй цикл `while (n > 0)` и операции `% 10` и `/= 10`.",
          "Выведи 2 строки.",
        ],
        exampleInput: "9874",
        exampleOutput: "Цифр в числе: 4\nСумма цифр: 28",
        sampleInput: "9874",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: разбери число n в цикле while (n > 0)
    }
}
`,
        tests: [
          { label: "9874", stdin: "9874\n", expected: ["Цифр в числе: 4", "Сумма цифр: 28"] },
          { label: "123456", stdin: "123456\n", expected: ["Цифр в числе: 6", "Сумма цифр: 21"] },
        ],
        requiredCode: [{ pattern: "while\\s*\\(", message: "Используй цикл while" }],
        hints: ["`while (temp > 0) { sum += temp % 10; count++; temp /= 10; }`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        int count = 0;
        int sum = 0;
        int temp = n;

        while (temp > 0) {
            sum += temp % 10;
            count++;
            temp /= 10;
        }

        System.out.println("Цифр в числе: " + count);
        System.out.println("Сумма цифр: " + sum);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 14: Java For Loop & Вложенные циклы (Цикл for)                */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 14,
    moduleId: 3,
    title: "Java For Loop: цикл со счётчиком и вложенные циклы",
    short: "for (init; cond; step), обратный цикл и таблицы Пифагора",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Синтаксис цикла for: 3 секции (statement 1; statement 2; statement 3)",
      "Шаг цикла: инкремент, декремент, произвольный шаг (i += 2)",
      "Обратный цикл: обратный отсчет от 10 до 1",
      "Вложенные циклы (Nested Loops): цикл внутри цикла",
      "Построение сеток, матриц и геометрических паттернов",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java цикл for", note: "Цикл for с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов вложенные циклы Java", note: "Вложенные циклы и таблицы" },
    ],
    theory: [
      { type: "h", text: "Синтаксис цикла for (W3Schools)" },
      {
        type: "p",
        text: "Когда заранее известно точное количество повторений, цикл `for` предпочтительнее `while`:",
      },
      {
        type: "code",
        caption: "Структура for",
        code: `for (statement 1; statement 2; statement 3) {
    // тело цикла
}

// 1. statement 1: выполняется 1 раз перед стартом (инициализация счетчика)
// 2. statement 2: условие продолжения цикла
// 3. statement 3: шаг изменения счетчика после каждой итерации

for (int i = 0; i < 5; i++) {
    System.out.println(i);
}`,
      },
      { type: "h", text: "Вложенные циклы (Nested Loops)" },
      {
        type: "p",
        text: "Вложенный цикл — это цикл внутри другого цикла. «Внутренний цикл» выполнится целиком на **каждой** итерации «внешнего цикла»:",
      },
      {
        type: "code",
        caption: "Вложенные циклы",
        code: `// Внешний цикл (строки)
for (int i = 1; i <= 2; i++) {
    System.out.println("Внешний: " + i);

    // Внутренний цикл (столбцы)
    for (int j = 1; j <= 3; j++) {
        System.out.println(" Внутренний: " + j);
    }
}`,
      },
    ],
    tasks: [
      {
        id: "d14_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Таблица умножения на N)",
        shortDesc: "С помощью цикла for выведи таблицу умножения от 1 до 10",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Программа считывает целое число `n`.\nС помощью цикла `for (int i = 1; i <= 10; i++)` выведи 10 строк формата:\n`<n> x <i> = <n * i>`",
        requirements: [
          "Используй цикл `for` от 1 до 10.",
          "Формат вывода: `<n> x <i> = <результат>`.",
        ],
        exampleInput: "5",
        exampleOutput: "5 x 1 = 5\n5 x 2 = 10\n...\n5 x 10 = 50",
        sampleInput: "5",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: выведи таблицу умножения для числа n
    }
}
`,
        tests: [
          {
            label: "Таблица на 5",
            stdin: "5\n",
            expected: [
              "5 x 1 = 5",
              "5 x 2 = 10",
              "5 x 5 = 25",
              "5 x 10 = 50",
            ],
          },
          {
            label: "Таблица на 7",
            stdin: "7\n",
            expected: [
              "7 x 1 = 7",
              "7 x 7 = 49",
              "7 x 10 = 70",
            ],
          },
        ],
        requiredCode: [{ pattern: "for\\s*\\(", message: "Используй цикл for" }],
        hints: ["`for (int i = 1; i <= 10; i++) { System.out.println(n + \" x \" + i + \" = \" + (n * i)); }`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        for (int i = 1; i <= 10; i++) {
            System.out.println(n + " x " + i + " = " + (n * i));
        }
    }
}
`,
      },
      {
        id: "d14_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Сетка Пифагора через вложенные циклы)",
        shortDesc: "Таблица умножения размером N x N с табуляцией",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа считывает размер таблицы `n` (от 2 до 5).\nС помощью двух вложенных циклов `for` (внешний `i` от 1 до `n`, внутренний `j` от 1 до `n`) выведи таблицу умножения чисел.\nЧисла в строке разделяй табуляцией `\\t` (используй `System.out.print((i * j) + \"\\t\")`), а после завершения внутреннего цикла переводи строку (`System.out.println()`).",
        requirements: [
          "Используй два вложенных цикла `for`.",
          "Разделяй числа табуляцией `\\t`.",
        ],
        exampleInput: "3",
        exampleOutput: "1\t2\t3\n2\t4\t6\n3\t6\t9",
        sampleInput: "3",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: напечатай таблицу N x N с помощью вложенных циклов
    }
}
`,
        tests: [
          {
            label: "Таблица 3 x 3",
            stdin: "3\n",
            expected: [
              "1\t2\t3",
              "2\t4\t6",
              "3\t6\t9",
            ],
          },
        ],
        requiredCode: [{ pattern: "\\\\t", message: "Используй табуляцию \\t" }],
        hints: ["Внутренний цикл: `System.out.print((i * j) + \"\\t\");`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                System.out.print((i * j) + "\t");
            }
            System.out.println();
        }
    }
}
`,
      },
      {
        id: "d14_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Треугольник из звёздочек)",
        shortDesc: "Рисование пирамидального треугольника заданной высоты",
        difficulty: "Средний",
        xp: 40,
        description:
          "Программа считывает высоту треугольника `height` (целое число от 1 до 10).\nС помощью вложенных циклов напечатай прямоугольный треугольник из звёздочек `*`, где 1-я строка содержит 1 звездочку, 2-я — 2, и так далее до `height` звёздочек в последней строке.\nНапример, для высоты 4:\n`*`\n`**`\n`***`\n`****`",
        requirements: [
          "Используй вложенный цикл `for`.",
          "Выведи ровно `height` строк.",
        ],
        exampleInput: "4",
        exampleOutput: "*\n**\n***\n****",
        sampleInput: "4",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int height = scanner.nextInt();

        // TODO: нарисуй треугольник высотой height
    }
}
`,
        tests: [
          {
            label: "Высота 4",
            stdin: "4\n",
            expected: [
              "*",
              "**",
              "***",
              "****",
            ],
          },
          {
            label: "Высота 2",
            stdin: "2\n",
            expected: [
              "*",
              "**",
            ],
          },
        ],
        hints: ["`for (int i = 1; i <= height; i++) { for (int j = 1; j <= i; j++) System.out.print(\"*\"); System.out.println(); }`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int height = scanner.nextInt();

        for (int i = 1; i <= height; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 15: Java Break & Continue (Управление циклами)                */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 15,
    moduleId: 3,
    title: "Java Break & Continue: досрочный выход и пропуск шагов",
    short: "break для выхода, continue для пропуска, бесконечные циклы",
    difficulty: "Лёгкий",
    duration: "~1.5 часа",
    xp: 100,
    ready: true,
    topics: [
      "Оператор break: немедленный выход из цикла",
      "Оператор continue: пропуск оставшейся части текущей итерации",
      "Бесконечный цикл while (true) с прерыванием по условию",
      "Именованные метки (Labeled break / continue)",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java break continue", note: "Управление циклом с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов break continue метки Java", note: "Метки и досрочный выход" },
    ],
    theory: [
      { type: "h", text: "Операторы break и continue (W3Schools)" },
      {
        type: "list",
        items: [
          "**`break`** — мгновенно прерывает выполнение цикла и передаёт управление следующей за циклом строке кода.",
          "**`continue`** — пропускает выполнение оставшейся части тела цикла **только для текущей итерации** и сразу переходит к следующему шагу.",
        ],
      },
      {
        type: "code",
        caption: "Сравнение break и continue",
        code: `// break: остановится, когда i станет равен 4
for (int i = 0; i < 10; i++) {
    if (i == 4) break;
    System.out.print(i + " "); // напечатает: 0 1 2 3
}

// continue: пропустит печать четвёрки
for (int i = 0; i < 6; i++) {
    if (i == 4) continue;
    System.out.print(i + " "); // напечатает: 0 1 2 3 5
}`,
      },
    ],
    tasks: [
      {
        id: "d15_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Первое число, кратное 7 и 11)",
        shortDesc: "Найди первое подходящее число в цикле и прерви поиск через break",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "В диапазоне от 100 до 1000 найди **первое** целое число, которое одновременно делится на 7 и на 11 (`i % 7 == 0 && i % 11 == 0`). Как только число найдено, напечатай его и немедленно останови цикл с помощью `break`.\nВыведи:\n`Найдено число: <число>`",
        requirements: [
          "Используй цикл `for` и оператор `break`.",
          "Выведи ровно 1 строку.",
        ],
        exampleOutput: "Найдено число: 154",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // TODO: найди первое число от 100 до 1000, кратное 7 и 11, и вызови break
    }
}
`,
        tests: [
          { label: "Поиск числа", expected: ["Найдено число: 154"] },
        ],
        requiredCode: [{ pattern: "break;", message: "Используй оператор break;" }],
        hints: ["`if (i % 7 == 0 && i % 11 == 0) { System.out.println(\"Найдено число: \" + i); break; }`"],
        solution: `public class Main {
    public static void main(String[] args) {
        for (int i = 100; i <= 1000; i++) {
            if (i % 7 == 0 && i % 11 == 0) {
                System.out.println("Найдено число: " + i);
                break;
            }
        }
    }
}
`,
      },
      {
        id: "d15_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Фильтрация с continue)",
        shortDesc: "Печать чисел от 1 до 20 с пропуском кратных 3 через continue",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Пробегись циклом `for (int i = 1; i <= 20; i++)`.\nЕсли число делится на 3 (`i % 3 == 0`), пропусти его с помощью `continue`.\nВсе остальные числа напечатай в формате:\n`Число: <i>`",
        requirements: [
          "Используй оператор `continue` для пропуска чисел.",
          "Числа 3, 6, 9, 12, 15, 18 не должны быть напечатаны.",
        ],
        exampleOutput: "Число: 1\nЧисло: 2\nЧисло: 4\n...",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // TODO: выведи числа от 1 до 20 кроме кратных 3
    }
}
`,
        tests: [
          {
            label: "Проверка пропуска кратных 3",
            expected: [
              "Число: 1",
              "Число: 2",
              "Число: 4",
              "Число: 5",
              "Число: 19",
              "Число: 20",
            ],
          },
        ],
        requiredCode: [{ pattern: "continue;", message: "Используй continue;" }],
        hints: ["`if (i % 3 == 0) continue;`"],
        solution: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 20; i++) {
            if (i % 3 == 0) continue;
            System.out.println("Число: " + i);
        }
    }
}
`,
      },
      {
        id: "d15_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Интерактивное меню с выходом)",
        shortDesc: "Бесконечный цикл while (true) со считыванием команд и выходом по 0",
        difficulty: "Средний",
        xp: 40,
        description:
          "Программа симулирует терминал банкомата. В бесконечном цикле `while (true)` считывается числовая команда:\n- `1`: напечатать `Баланс: 15000 руб.`\n- `2`: напечатать `Выписка отправлена на email`\n- `0`: напечатать `Сессия завершена. До свидания!` и немедленно выйти из цикла через `break`.\n- Любое другое число: пропустить через `continue`.",
        requirements: [
          "Используй `while (true)` и `break` при вводе 0.",
          "Завершай программу корректно.",
        ],
        exampleInput: "1\n2\n0",
        exampleOutput: "Баланс: 15000 руб.\nВыписка отправлена на email\nСессия завершена. До свидания!",
        sampleInput: "1\n2\n0",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // TODO: организуй цикл while (true) с обработкой команд и выходом по 0
    }
}
`,
        tests: [
          {
            label: "Команды 1, 2, 0",
            stdin: "1\n2\n0\n",
            expected: [
              "Баланс: 15000 руб.",
              "Выписка отправлена на email",
              "Сессия завершена. До свидания!",
            ],
          },
        ],
        hints: ["`if (cmd == 0) { System.out.println(\"Сессия завершена. До свидания!\"); break; }`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        while (true) {
            int cmd = scanner.nextInt();
            if (cmd == 1) {
                System.out.println("Баланс: 15000 руб.");
            } else if (cmd == 2) {
                System.out.println("Выписка отправлена на email");
            } else if (cmd == 0) {
                System.out.println("Сессия завершена. До свидания!");
                break;
            } else {
                continue;
            }
        }
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 16: Java Arrays (Одномерные массивы)                          */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 16,
    moduleId: 3,
    title: "Java Arrays: объявление, индексация с 0 и свойство .length",
    short: "Создание массивов, индексы, обход в цикле for и границы",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Что такое массив: фиксированная последовательность однотипных данных",
      "Объявление и выделение памяти: int[] arr = new int[5];",
      "Литеральная инициализация: String[] cars = {\"Volvo\", \"BMW\", \"Ford\"};",
      "Индексация с нуля: первый элемент arr[0], последний arr[arr.length - 1]",
      "Свойство .length (без скобок!)",
      "Частая ошибка: ArrayIndexOutOfBoundsException",
      "Обход элементов массива классическим циклом for",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java массивы с нуля", note: "Одномерные массивы подробно" },
      { author: "Заур Трегулов", query: "Заур Трегулов массивы length границы Java", note: "Индексы и свойство length" },
    ],
    theory: [
      { type: "h", text: "Массивы в Java" },
      {
        type: "p",
        text: "Массив — это структура данных фиксированного размера, содержащая элементы одного и того же типа. В памяти Java элементы массива располагаются в виде сплошного блока ячеек.",
      },
      {
        type: "code",
        caption: "Создание и доступ к элементам (W3Schools)",
        code: `String[] cars = {"Volvo", "BMW", "Ford", "Mazda"};
System.out.println(cars[0]); // Выведет: Volvo

cars[0] = "Opel"; // изменение значения по индексу
System.out.println(cars[0]); // Выведет: Opel

System.out.println("Длина массива: " + cars.length); // 4`,
      },
      { type: "h", text: "Обход массива в цикле for" },
      {
        type: "code",
        caption: "Обход элементов",
        code: `int[] scores = {90, 85, 78, 92, 88};

for (int i = 0; i < scores.length; i++) {
    System.out.println("Оценка " + i + ": " + scores[i]);
}`,
      },
    ],
    tasks: [
      {
        id: "d16_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Реверс вывода массива)",
        shortDesc: "Выведи элементы массива в прямом и обратном порядке",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай массив из 5 целых чисел: `{10, 20, 30, 40, 50}`.\n1) Напечатай `Длина: <length>`\n2) В цикле выведи элементы в прямом порядке через запятую: `Прямой: 10 20 30 40 50`\n3) В обратном цикле `for (int i = arr.length - 1; i >= 0; i--)` выведи: `Обратный: 50 40 30 20 10`",
        requirements: [
          "Используй свойство `.length`.",
          "Выведи 3 строки.",
        ],
        exampleOutput: "Длина: 5\nПрямой: 10 20 30 40 50\nОбратный: 50 40 30 20 10",
        starterCode: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};

        // TODO: выведи длину, прямой и обратный порядок
    }
}
`,
        tests: [
          {
            label: "Проверка вывода массива",
            expected: [
              "Длина: 5",
              "Прямой: 10 20 30 40 50",
              "Обратный: 50 40 30 20 10",
            ],
          },
        ],
        requiredCode: [{ pattern: "\\.length", message: "Используй свойство .length" }],
        hints: ["`for (int i = arr.length - 1; i >= 0; i--)`"],
        solution: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};

        System.out.println("Длина: " + arr.length);

        System.out.print("Прямой:");
        for (int i = 0; i < arr.length; i++) {
            System.out.print(" " + arr[i]);
        }
        System.out.println();

        System.out.print("Обратный:");
        for (int i = arr.length - 1; i >= 0; i--) {
            System.out.print(" " + arr[i]);
        }
        System.out.println();
    }
}
`,
      },
      {
        id: "d16_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Поиск min, max и среднего)",
        shortDesc: "Считай размер и элементы массива и найди статистику",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа считывает размер массива `n`, затем `n` целых чисел и сохраняет их в `int[] arr = new int[n];`.\nНайди:\n- Минимальный элемент (`min`)\n- Максимальный элемент (`max`)\n- Сумму элементов и среднее арифметическое (`(double) sum / n`)\nВыведи:\n`Минимум: <min>`\n`Максимум: <max>`\n`Среднее: <avg>`",
        requirements: [
          "Используй массив `new int[n]`.",
          "Выведи 3 строки.",
        ],
        exampleInput: "4\n15\n8\n42\n23",
        exampleOutput: "Минимум: 8\nМаксимум: 42\nСреднее: 22.0",
        sampleInput: "4\n15\n8\n42\n23",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];

        // TODO: прочитай элементы массива и найди min, max, avg
    }
}
`,
        tests: [
          {
            label: "4 элемента: 15, 8, 42, 23",
            stdin: "4\n15\n8\n42\n23\n",
            expected: [
              "Минимум: 8",
              "Максимум: 42",
              "Среднее: 22.0",
            ],
          },
        ],
        hints: ["`min = Math.min(min, arr[i]);`", "`max = Math.max(max, arr[i]);`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];

        int sum = 0;
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
            sum += arr[i];
        }

        int min = arr[0];
        int max = arr[0];
        for (int i = 1; i < n; i++) {
            if (arr[i] < min) min = arr[i];
            if (arr[i] > max) max = arr[i];
        }

        double avg = (double) sum / n;

        System.out.println("Минимум: " + min);
        System.out.println("Максимум: " + max);
        System.out.println("Среднее: " + avg);
    }
}
`,
      },
      {
        id: "d16_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Линейный поиск в массиве)",
        shortDesc: "Проверь наличие целевого числа в массиве и верни его индекс",
        difficulty: "Средний",
        xp: 40,
        description:
          "Программа считывает размер `n`, затем `n` чисел массива, а последним числом — искомое значение `target`.\nНайди индекс первого вхождения `target` в массиве. Если число найдено, выведи `Индекс: <индекс>`. Если число отсутствует в массиве, выведи `Элемент не найден: -1`.",
        requirements: [
          "Используй линейный поиск по массиву.",
          "Выведи результат.",
        ],
        exampleInput: "5\n10 20 30 40 50\n30",
        exampleOutput: "Индекс: 2",
        sampleInput: "5\n10\n20\n30\n40\n50\n30",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        int target = scanner.nextInt();

        // TODO: найди индекс целевого числа target
    }
}
`,
        tests: [
          {
            label: "Число 30 есть на позиции 2",
            stdin: "5\n10\n20\n30\n40\n50\n30\n",
            expected: ["Индекс: 2"],
          },
          {
            label: "Числа 99 нет в массиве",
            stdin: "4\n1\n2\n3\n4\n99\n",
            expected: ["Элемент не найден: -1"],
          },
        ],
        hints: ["Сохраняй `foundIndex = -1` и при нахождении делай `break;`."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        int target = scanner.nextInt();

        int found = -1;
        for (int i = 0; i < n; i++) {
            if (arr[i] == target) {
                found = i;
                break;
            }
        }

        if (found != -1) {
            System.out.println("Индекс: " + found);
        } else {
            System.out.println("Элемент не найден: -1");
        }
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 17: Java For-Each Loop & Arrays (Улучшенный цикл for-each)   */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 17,
    moduleId: 3,
    title: "Java For-Each Loop: лаконичный обход и утилиты Arrays",
    short: "Синтаксис for (Type x : arr), Arrays.toString и Arrays.sort",
    difficulty: "Лёгкий",
    duration: "~1.5 часа",
    xp: 100,
    ready: true,
    topics: [
      "Синтаксис for-each: for (Type variable : arrayName)",
      "Когда for-each лучше обычного for: читаемость, безопасность, нет счетчиков",
      "Когда for-each НЕ подходит: изменение элементов, шаг, доступ по индексу",
      "Класс java.util.Arrays: Arrays.toString(arr)",
      "Сортировка массива: Arrays.sort(arr)",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java цикл for each", note: "Цикл for-each с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов Arrays sort toString Java", note: "Класс Arrays и сортировка" },
    ],
    theory: [
      { type: "h", text: "Цикл For-Each (W3Schools)" },
      {
        type: "p",
        text: "Цикл `for-each` (улучшенный цикл `for`) используется исключительно для последовательного перебора элементов массивов и коллекций:",
      },
      {
        type: "code",
        caption: "Синтаксис for-each",
        code: `String[] cars = {"Volvo", "BMW", "Ford", "Mazda"};
for (String car : cars) {
    System.out.println(car);
}`,
      },
      { type: "h", text: "Утилиты класса java.util.Arrays" },
      {
        type: "list",
        items: [
          "`Arrays.toString(arr)` — превращает массив в красивую строку вида `[1, 2, 3]`.",
          "`Arrays.sort(arr)` — сортирует массив по возрастанию на месте (in-place).",
        ],
      },
    ],
    tasks: [
      {
        id: "d17_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Суммирование через for-each)",
        shortDesc: "Посчитай сумму чисел с помощью цикла for-each",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Дан массив: `int[] numbers = {15, 25, 35, 45, 55};`.\nС помощью цикла `for (int n : numbers)` подсчитай общую сумму элементов.\nВыведи:\n`Сумма элементов: 175`",
        requirements: [
          "Используй синтаксис цикла for-each.",
          "Выведи 1 строку.",
        ],
        exampleOutput: "Сумма элементов: 175",
        starterCode: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {15, 25, 35, 45, 55};

        // TODO: подсчитай сумму с помощью for-each
    }
}
`,
        tests: [
          { label: "Сумма 175", expected: ["Сумма элементов: 175"] },
        ],
        requiredCode: [{ pattern: "for\\s*\\(\\s*int\\s+\\w+\\s*:", message: "Используй цикл for (int x : numbers)" }],
        hints: ["`for (int num : numbers) { sum += num; }`"],
        solution: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {15, 25, 35, 45, 55};
        int sum = 0;
        for (int n : numbers) {
            sum += n;
        }
        System.out.println("Сумма элементов: " + sum);
    }
}
`,
      },
      {
        id: "d17_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Сортировка Arrays.sort)",
        shortDesc: "Сортировка массива чисел и печать через Arrays.toString",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа считывает 5 чисел массива.\nИспользуй метод `java.util.Arrays.sort(arr);` для сортировки по возрастанию.\nВыведи:\n`До сортировки: [...]` (или печать отсортированного)\n`Отсортировано: [min, ..., max]` (с помощью `Arrays.toString(arr)`)\n`Медиана: arr[2]`",
        requirements: [
          "Используй `Arrays.sort` и `Arrays.toString`.",
          "Выведи 2 строки.",
        ],
        exampleInput: "90 10 50 30 70",
        exampleOutput: "Отсортировано: [10, 30, 50, 70, 90]\nМедиана: 50",
        sampleInput: "90\n10\n50\n30\n70",
        starterCode: `import java.util.Scanner;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int[] arr = new int[5];
        for (int i = 0; i < 5; i++) {
            arr[i] = scanner.nextInt();
        }

        // TODO: отсортируй массив и выведи результат
    }
}
`,
        tests: [
          {
            label: "90 10 50 30 70",
            stdin: "90\n10\n50\n30\n70\n",
            expected: [
              "Отсортировано: [10, 30, 50, 70, 90]",
              "Медиана: 50",
            ],
          },
        ],
        requiredCode: [
          { pattern: "Arrays\\.sort", message: "Используй Arrays.sort" },
          { pattern: "Arrays\\.toString", message: "Используй Arrays.toString" },
        ],
        hints: ["`Arrays.sort(arr);`", "`System.out.println(\"Медиана: \" + arr[2]);`"],
        solution: `import java.util.Scanner;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int[] arr = new int[5];
        for (int i = 0; i < 5; i++) {
            arr[i] = scanner.nextInt();
        }

        Arrays.sort(arr);

        System.out.println("Отсортировано: " + Arrays.toString(arr));
        System.out.println("Медиана: " + arr[2]);
    }
}
`,
      },
      {
        id: "d17_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Фильтрация строк по длине)",
        shortDesc: "Подсчет коротких слов (< 5 букв) в массиве строк",
        difficulty: "Средний",
        xp: 40,
        description:
          "Дан массив слов: `String[] words = {\"Java\", \"Backend\", \"Spring\", \"API\", \"Git\", \"Postgres\"};`.\nС помощью цикла `for (String w : words)` найди все слова, длина которых строго меньше 5 символов (`w.length() < 5`).\nВыведи:\n`Короткие слова:`\n`- Java (4)`\n`- API (3)`\n`- Git (3)`\n`Всего коротких слов: 3`",
        requirements: [
          "Используй цикл for-each.",
          "Выведи найденные слова и их общее количество.",
        ],
        exampleOutput: "Короткие слова:\n- Java (4)\n- API (3)\n- Git (3)\nВсего коротких слов: 3",
        starterCode: `public class Main {
    public static void main(String[] args) {
        String[] words = {"Java", "Backend", "Spring", "API", "Git", "Postgres"};

        // TODO: отфильтруй слова через for-each
    }
}
`,
        tests: [
          {
            label: "Фильтрация слов",
            expected: [
              "Короткие слова:",
              "- Java (4)",
              "- API (3)",
              "- Git (3)",
              "Всего коротких слов: 3",
            ],
          },
        ],
        hints: ["`for (String w : words) { if (w.length() < 5) { ... count++; } }`"],
        solution: `public class Main {
    public static void main(String[] args) {
        String[] words = {"Java", "Backend", "Spring", "API", "Git", "Postgres"};

        System.out.println("Короткие слова:");
        int count = 0;
        for (String w : words) {
            if (w.length() < 5) {
                System.out.println("- " + w + " (" + w.length() + ")");
                count++;
            }
        }
        System.out.println("Всего коротких слов: " + count);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 18: Java Multi-Dimensional Arrays (Двумерные массивы)         */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 18,
    moduleId: 3,
    title: "Java Multi-Dimensional Arrays: матрицы и вложенный обход",
    short: "Двумерные массивы int[][], адресация matrix[row][col] и сетки",
    difficulty: "Средний",
    duration: "~2.5 часа",
    xp: 100,
    ready: true,
    topics: [
      "Что такое многомерный массив: массив массивов",
      "Синтаксис объявления: int[][] matrix = new int[rows][cols];",
      "Литеральная инициализация: int[][] myNumbers = {{1, 2, 3}, {4, 5, 6}};",
      "Обращение по индексам: matrix[row][col]",
      "Двойной цикл for для полного обхода таблицы",
      "Ступенчатые (нерегулярные) массивы (Jagged Arrays)",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java многомерные массивы", note: "Двумерные массивы с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов матрицы двумерные массивы Java", note: "Матрицы и адресация" },
    ],
    theory: [
      { type: "h", text: "Двумерные массивы (W3Schools)" },
      {
        type: "p",
        text: "Многомерный массив — это массив, элементами которого являются другие массивы. Самый распространенный вид — двумерный массив (таблица строк и столбцов):",
      },
      {
        type: "code",
        caption: "Создание двумерного массива",
        code: `int[][] myNumbers = { {1, 2, 3, 4}, {5, 6, 7} };
System.out.println(myNumbers[1][2]); // 7 (строка 1, столбец 2)

// Обход матрицы:
for (int row = 0; row < myNumbers.length; row++) {
    for (int col = 0; col < myNumbers[row].length; col++) {
        System.out.print(myNumbers[row][col] + " ");
    }
    System.out.println();
}`,
      },
    ],
    tasks: [
      {
        id: "d18_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Единичная матрица N x N)",
        shortDesc: "Создай квадратную матрицу с единицами на главной диагонали",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Программа считывает размер квадратной матрицы `n` (например, 3).\nСоздай массив `int[][] matrix = new int[n][n];`.\nЗаполни главную диагональ единицами (`matrix[i][i] = 1`), а остальные ячейки нулями.\nВыведи матрицу построчно (числа разделяй пробелом).",
        requirements: [
          "Используй двумерный массив `int[n][n]`.",
          "Выведи матрицу построчно.",
        ],
        exampleInput: "3",
        exampleOutput: "1 0 0\n0 1 0\n0 0 1",
        sampleInput: "3",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: создай единичную матрицу и напечатай её
    }
}
`,
        tests: [
          {
            label: "Матрица 3x3",
            stdin: "3\n",
            expected: [
              "1 0 0",
              "0 1 0",
              "0 0 1",
            ],
          },
        ],
        hints: ["`if (i == j) matrix[i][j] = 1; else matrix[i][j] = 0;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[][] matrix = new int[n][n];

        for (int i = 0; i < n; i++) {
            matrix[i][i] = 1;
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                System.out.print(matrix[i][j] + (j == n - 1 ? "" : " "));
            }
            System.out.println();
        }
    }
}
`,
      },
      {
        id: "d18_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Сумма строк и столбцов)",
        shortDesc: "Вычисли суммы по каждой строке двумерной матрицы 2x3",
        difficulty: "Средний",
        xp: 35,
        description:
          "Задана матрица 2х3:\n`int[][] table = { {5, 10, 15}, {20, 25, 30} };`\nПосчитай сумму элементов в каждой строке и общую сумму всей таблицы.\nВыведи:\n`Строка 0: сумма = 30`\n`Строка 1: сумма = 75`\n`Общая сумма: 105`",
        requirements: [
          "Используй двойной цикл `for`.",
          "Выведи 3 строки.",
        ],
        exampleOutput: "Строка 0: сумма = 30\nСтрока 1: сумма = 75\nОбщая сумма: 105",
        starterCode: `public class Main {
    public static void main(String[] args) {
        int[][] table = { {5, 10, 15}, {20, 25, 30} };

        // TODO: рассчитай сумму по строкам и общую сумму
    }
}
`,
        tests: [
          {
            label: "Сумма таблицы",
            expected: [
              "Строка 0: сумма = 30",
              "Строка 1: сумма = 75",
              "Общая сумма: 105",
            ],
          },
        ],
        hints: ["Суммируй `table[i][j]` во внутреннем цикле."],
        solution: `public class Main {
    public static void main(String[] args) {
        int[][] table = { {5, 10, 15}, {20, 25, 30} };

        int total = 0;
        for (int i = 0; i < table.length; i++) {
            int rowSum = 0;
            for (int j = 0; j < table[i].length; j++) {
                rowSum += table[i][j];
            }
            total += rowSum;
            System.out.println("Строка " + i + ": сумма = " + rowSum);
        }
        System.out.println("Общая сумма: " + total);
    }
}
`,
      },
      {
        id: "d18_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Крестики-нолики: проверка ряда)",
        shortDesc: "Проверь поле 3х3 на победу символа 'X' в любой из строк",
        difficulty: "Средний",
        xp: 40,
        description:
          "Программа считывает 9 символов игрового поля 3х3 (по 3 символа в строке).\nЕсли хотя бы в одной горизонтальной строке все 3 символа равны `'X'`, выведи `Победа крестиков по горизонтали: ДА`.\nИначе выведи `Победа крестиков по горизонтали: НЕТ`.",
        requirements: [
          "Используй двумерный массив `char[][] board = new char[3][3];`.",
          "Выведи статус победы.",
        ],
        exampleInput: "X X X\nO X O\nO O X",
        exampleOutput: "Победа крестиков по горизонтали: ДА",
        sampleInput: "X\nX\nX\nO\nX\nO\nO\nO\nX",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        char[][] board = new char[3][3];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                board[i][j] = scanner.next().charAt(0);
            }
        }

        // TODO: проверь наличие строки из трех 'X'
    }
}
`,
        tests: [
          {
            label: "Победа в первой строке",
            stdin: "X X X O X O O O X\n",
            expected: ["Победа крестиков по горизонтали: ДА"],
          },
          {
            label: "Нет победы в строках",
            stdin: "X O X O X O O X O\n",
            expected: ["Победа крестиков по горизонтали: НЕТ"],
          },
        ],
        hints: ["`if (board[i][0] == 'X' && board[i][1] == 'X' && board[i][2] == 'X') win = true;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        char[][] board = new char[3][3];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                board[i][j] = scanner.next().charAt(0);
            }
        }

        boolean win = false;
        for (int i = 0; i < 3; i++) {
            if (board[i][0] == 'X' && board[i][1] == 'X' && board[i][2] == 'X') {
                win = true;
                break;
            }
        }

        if (win) {
            System.out.println("Победа крестиков по горизонтали: ДА");
        } else {
            System.out.println("Победа крестиков по горизонтали: НЕТ");
        }
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 19: Базовые алгоритмы на массивах                             */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 19,
    moduleId: 3,
    title: "Базовые алгоритмы: реверс массива на месте и сортировка пузырьком",
    short: "Два указателя left/right, in-place swap и Bubble Sort",
    difficulty: "Средний",
    duration: "~2.5 часа",
    xp: 100,
    ready: true,
    topics: [
      "Алгоритм разворота массива на месте (In-Place Reverse) с двумя указателями",
      "Обмен элементов через временную переменную temp",
      "Циклический сдвиг элементов массива",
      "Пузырьковая сортировка (Bubble Sort): пошаговый алгоритм и оптимизация",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java пузырьковая сортировка", note: "Bubble Sort алгоритм" },
      { author: "Заур Трегулов", query: "Заур Трегулов алгоритмы массивы реверс Java", note: "Реверс массива двумя указателями" },
    ],
    theory: [
      { type: "h", text: "Разворот массива на месте (Два указателя)" },
      {
        type: "p",
        text: "Вместо создания второго массива и траты лишней памяти, разворот выполняют обменом элементов с двух концов навстречу друг другу:",
      },
      {
        type: "code",
        caption: "In-place разворот массива",
        code: `int[] arr = {1, 2, 3, 4, 5};
int left = 0;
int right = arr.length - 1;

while (left < right) {
    int temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
}`,
      },
      { type: "h", text: "Пузырьковая сортировка (Bubble Sort)" },
      {
        type: "p",
        text: "На каждом проходе соседние элементы сравниваются, и если левый больше правого — они меняются местами. Самый большой элемент «всплывает» в конец, как пузырек воздуха в воде.",
      },
    ],
    tasks: [
      {
        id: "d19_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Разворот массива двумя указателями)",
        shortDesc: "Разверни массив чисел на месте без создания второго массива",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Программа считывает 5 чисел массива `arr`.\nРазверни массив задом наперёд с помощью двух указателей `left = 0` и `right = arr.length - 1` и временной переменной `temp`.\nВыведи развернутый массив через пробел:\n`Развернуто: 50 40 30 20 10`",
        requirements: [
          "Не создавай второй массив.",
          "Используй алгоритм двух указателей.",
        ],
        exampleInput: "10 20 30 40 50",
        exampleOutput: "Развернуто: 50 40 30 20 10",
        sampleInput: "10\n20\n30\n40\n50",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int[] arr = new int[5];
        for (int i = 0; i < 5; i++) {
            arr[i] = scanner.nextInt();
        }

        // TODO: разверни массив на месте и напечатай
    }
}
`,
        tests: [
          {
            label: "10 20 30 40 50",
            stdin: "10\n20\n30\n40\n50\n",
            expected: ["Развернуто: 50 40 30 20 10"],
          },
        ],
        hints: ["`int temp = arr[left]; arr[left] = arr[right]; arr[right] = temp;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int[] arr = new int[5];
        for (int i = 0; i < 5; i++) {
            arr[i] = scanner.nextInt();
        }

        int left = 0, right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }

        System.out.print("Развернуто:");
        for (int x : arr) {
            System.out.print(" " + x);
        }
        System.out.println();
    }
}
`,
      },
      {
        id: "d19_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Циклический сдвиг вправо)",
        shortDesc: "Сдвинь элементы массива на 1 шаг вправо с сохранением последнего",
        difficulty: "Средний",
        xp: 35,
        description:
          "Программа считывает 5 чисел массива.\nСдвинь все элементы массива циклически вправо на 1 позицию (последний элемент становится первым, а каждый остальной сдвигается на 1 вправо).\nВыведи:\n`Сдвинуто: <элементы через пробел>`",
        requirements: [
          "Сохрани последний элемент во временную переменную `last = arr[arr.length - 1]`.",
          "Сдвинь элементы справа налево.",
        ],
        exampleInput: "1 2 3 4 5",
        exampleOutput: "Сдвинуто: 5 1 2 3 4",
        sampleInput: "1\n2\n3\n4\n5",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int[] arr = new int[5];
        for (int i = 0; i < 5; i++) {
            arr[i] = scanner.nextInt();
        }

        // TODO: сдвинь элементы вправо на 1 шаг
    }
}
`,
        tests: [
          {
            label: "1 2 3 4 5 -> 5 1 2 3 4",
            stdin: "1\n2\n3\n4\n5\n",
            expected: ["Сдвинуто: 5 1 2 3 4"],
          },
        ],
        hints: ["`for (int i = arr.length - 1; i > 0; i--) arr[i] = arr[i - 1];`", "`arr[0] = last;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int[] arr = new int[5];
        for (int i = 0; i < 5; i++) {
            arr[i] = scanner.nextInt();
        }

        int last = arr[arr.length - 1];
        for (int i = arr.length - 1; i > 0; i--) {
            arr[i] = arr[i - 1];
        }
        arr[0] = last;

        System.out.print("Сдвинуто:");
        for (int x : arr) {
            System.out.print(" " + x);
        }
        System.out.println();
    }
}
`,
      },
      {
        id: "d19_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Сортировка пузырьком и подсчет обменов)",
        shortDesc: "Реализуй Bubble Sort и подсчитай количество совершенных обменов",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Программа считывает 5 чисел массива.\nРеализуй классическую пузырьковую сортировку (Bubble Sort) и подсчитай общее число перестановок (swaps).\nВыведи:\n`Отсортировано: [min, ..., max]`\n`Число перестановок: <swaps>`",
        requirements: [
          "Реализуй алгоритм Bubble Sort вручную (без Arrays.sort).",
          "Выведи отсортированный массив и число перестановок.",
        ],
        exampleInput: "5 4 3 2 1",
        exampleOutput: "Отсортировано: [1, 2, 3, 4, 5]\nЧисло перестановок: 10",
        sampleInput: "5\n4\n3\n2\n1",
        starterCode: `import java.util.Scanner;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int[] arr = new int[5];
        for (int i = 0; i < 5; i++) {
            arr[i] = scanner.nextInt();
        }

        // TODO: отсортируй пузырьком и посчитай число перестановок
    }
}
`,
        tests: [
          {
            label: "5 4 3 2 1 (10 перестановок)",
            stdin: "5\n4\n3\n2\n1\n",
            expected: [
              "Отсортировано: [1, 2, 3, 4, 5]",
              "Число перестановок: 10",
            ],
          },
        ],
        hints: ["`if (arr[j] > arr[j + 1]) { int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp; swaps++; }`"],
        solution: `import java.util.Scanner;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int[] arr = new int[5];
        for (int i = 0; i < 5; i++) {
            arr[i] = scanner.nextInt();
        }

        int swaps = 0;
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swaps++;
                }
            }
        }

        System.out.println("Отсортировано: " + Arrays.toString(arr));
        System.out.println("Число перестановок: " + swaps);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 20: Спринт практики: Консольный складской терминал           */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 20,
    moduleId: 3,
    title: "Практический спринт: Консольный складской терминал",
    short: "Объединяем массивы, циклы, ввод и условия в мини-проект",
    difficulty: "Средний",
    duration: "~3 часа",
    xp: 100,
    ready: true,
    topics: [
      "Архитектура консольного приложения на массивах",
      "Параллельные массивы: названия, цены и количество остатков",
      "Поиск по коду товара и модификация остатка",
      "Инвентаризация и расчет совокупной стоимости склада",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java проект для начинающих", note: "Консольный проект с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов Java задачи на массивы циклы", note: "Практика решения прикладных задач" },
    ],
    theory: [
      { type: "h", text: "Спринт: Консольный складской терминал" },
      {
        type: "p",
        text: "В этом практическом спринте ты закрепишь всё, что освоил за первые 20 дней: циклы `while`, массивы, ветвления `if...else`, сканер ввода и форматированный вывод.",
      },
    ],
    tasks: [
      {
        id: "d20_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Формирование каталога склада)",
        shortDesc: "Выведи прайс-лист по трем параллельным массивам товаров",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Заданы параллельные массивы для 3 товаров:\n`String[] items = {\"Клавиатура\", \"Мышь\", \"Монитор\"};`\n`int[] prices = {3500, 1800, 22000};`\n`int[] stock = {12, 25, 4};`\nВыведи каталог склада:\n`Каталог склада:`\n`1. Клавиатура — 3500 руб. (в наличии: 12 шт.)`\n`2. Мышь — 1800 руб. (в наличии: 25 шт.)`\n`3. Монитор — 22000 руб. (в наличии: 4 шт.)`",
        requirements: [
          "Используй цикл `for` по длине массивов.",
          "Выведи форматированный каталог.",
        ],
        exampleOutput: "Каталог склада:\n1. Клавиатура — 3500 руб. (в наличии: 12 шт.)\n2. Мышь — 1800 руб. (в наличии: 25 шт.)\n3. Монитор — 22000 руб. (в наличии: 4 шт.)",
        starterCode: `public class Main {
    public static void main(String[] args) {
        String[] items = {"Клавиатура", "Мышь", "Монитор"};
        int[] prices = {3500, 1800, 22000};
        int[] stock = {12, 25, 4};

        // TODO: напечатай каталог
    }
}
`,
        tests: [
          {
            label: "Проверка каталога",
            expected: [
              "Каталог склада:",
              "1. Клавиатура — 3500 руб. (в наличии: 12 шт.)",
              "2. Мышь — 1800 руб. (в наличии: 25 шт.)",
              "3. Монитор — 22000 руб. (в наличии: 4 шт.)",
            ],
          },
        ],
        hints: ["`for (int i = 0; i < items.length; i++)`"],
        solution: `public class Main {
    public static void main(String[] args) {
        String[] items = {"Клавиатура", "Мышь", "Монитор"};
        int[] prices = {3500, 1800, 22000};
        int[] stock = {12, 25, 4};

        System.out.println("Каталог склада:");
        for (int i = 0; i < items.length; i++) {
            System.out.println((i + 1) + ". " + items[i] + " — " + prices[i] + " руб. (в наличии: " + stock[i] + " шт.)");
        }
    }
}
`,
      },
      {
        id: "d20_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Оформление покупки и списание)",
        shortDesc: "Считай код товара и количество к покупке, проверь остаток и спиши",
        difficulty: "Средний",
        xp: 35,
        description:
          "На складе те же 3 товара. Программа считывает:\n1) Номер товара `itemNum` (1, 2 или 3)\n2) Количество к покупке `qty`\nЕсли запрошенное количество превышает остаток, выведи `Ошибка: недостаточно товара на складе!`.\nИначе спиши остаток, рассчитай стоимость (`qty * price`) и выведи:\n`Покупка: <item>`\n`Количество: <qty> шт.`\n`Сумма к оплате: <sum> руб.`\n`Остаток на складе: <newStock> шт.`",
        requirements: [
          "Проверь остаток на складе.",
          "Выведи 4 строки при успешной покупке.",
        ],
        exampleInput: "2\n5",
        exampleOutput: "Покупка: Мышь\nКоличество: 5 шт.\nСумма к оплате: 9000 руб.\nОстаток на складе: 20 шт.",
        sampleInput: "2\n5",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] items = {"Клавиатура", "Мышь", "Монитор"};
        int[] prices = {3500, 1800, 22000};
        int[] stock = {12, 25, 4};

        int itemNum = scanner.nextInt();
        int qty = scanner.nextInt();

        // TODO: проверь остаток, спиши и выведи чек
    }
}
`,
        tests: [
          {
            label: "Покупка 5 мышей",
            stdin: "2\n5\n",
            expected: [
              "Покупка: Мышь",
              "Количество: 5 шт.",
              "Сумма к оплате: 9000 руб.",
              "Остаток на складе: 20 шт.",
            ],
          },
          {
            label: "Попытка купить 15 клавиатур (остаток 12)",
            stdin: "1\n15\n",
            expected: ["Ошибка: недостаточно товара на складе!"],
          },
        ],
        hints: ["`int idx = itemNum - 1;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] items = {"Клавиатура", "Мышь", "Монитор"};
        int[] prices = {3500, 1800, 22000};
        int[] stock = {12, 25, 4};

        int itemNum = scanner.nextInt();
        int qty = scanner.nextInt();
        int idx = itemNum - 1;

        if (qty > stock[idx]) {
            System.out.println("Ошибка: недостаточно товара на складе!");
        } else {
            stock[idx] -= qty;
            int total = qty * prices[idx];
            System.out.println("Покупка: " + items[idx]);
            System.out.println("Количество: " + qty + " шт.");
            System.out.println("Сумма к оплате: " + total + " руб.");
            System.out.println("Остаток на складе: " + stock[idx] + " шт.");
        }
    }
}
`,
      },
      {
        id: "d20_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Полная инвентаризация склада)",
        shortDesc: "Подсчет общей стоимости товарных запасов склада",
        difficulty: "Средний",
        xp: 40,
        description:
          "Рассчитай суммарную стоимость всех товаров на складе (для каждого товара `prices[i] * stock[i]`).\nНайди самый дорогой товар в денежном выражении остатка.\nВыведи:\n`Инвентаризация склада:`\n`- Клавиатура: 42000 руб.`\n`- Мышь: 45000 руб.`\n`- Монитор: 88000 руб.`\n`Общая стоимость склада: 175000 руб.`\n`Лидер по стоимости: Монитор`",
        requirements: [
          "Используй цикл `for`.",
          "Выведи итоговый отчет инвентаризации.",
        ],
        exampleOutput: "Инвентаризация склада:\n- Клавиатура: 42000 руб.\n- Мышь: 45000 руб.\n- Монитор: 88000 руб.\nОбщая стоимость склада: 175000 руб.\nЛидер по стоимости: Монитор",
        starterCode: `public class Main {
    public static void main(String[] args) {
        String[] items = {"Клавиатура", "Мышь", "Монитор"};
        int[] prices = {3500, 1800, 22000};
        int[] stock = {12, 25, 4};

        // TODO: рассчитай стоимость остатков и выведи отчет
    }
}
`,
        tests: [
          {
            label: "Отчет инвентаризации",
            expected: [
              "Инвентаризация склада:",
              "- Клавиатура: 42000 руб.",
              "- Мышь: 45000 руб.",
              "- Монитор: 88000 руб.",
              "Общая стоимость склада: 175000 руб.",
              "Лидер по стоимости: Монитор",
            ],
          },
        ],
        hints: ["`int itemTotal = prices[i] * stock[i]; totalCost += itemTotal;`"],
        solution: `public class Main {
    public static void main(String[] args) {
        String[] items = {"Клавиатура", "Мышь", "Монитор"};
        int[] prices = {3500, 1800, 22000};
        int[] stock = {12, 25, 4};

        System.out.println("Инвентаризация склада:");
        int totalCost = 0;
        int maxVal = -1;
        String leader = "";

        for (int i = 0; i < items.length; i++) {
            int val = prices[i] * stock[i];
            totalCost += val;
            System.out.println("- " + items[i] + ": " + val + " руб.");
            if (val > maxVal) {
                maxVal = val;
                leader = items[i];
            }
        }

        System.out.println("Общая стоимость склада: " + totalCost + " руб.");
        System.out.println("Лидер по стоимости: " + leader);
    }
}
`,
      },
    ],
  }),
];
