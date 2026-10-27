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

export const module2Lessons: Lesson[] = [
  /* ------------------------------------------------------------------ */
  /*  DAY 8: Java Strings (Строки и методы класса String)               */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 8,
    moduleId: 2,
    title: "Java Strings: методы строк, неизменяемость и сравнение equals",
    short: "length, toUpperCase, indexOf, substring, replace и equals vs ==",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Класс String — ссылочный тип данных для текста",
      "Неизменяемость строк (Immutability): почему строка не меняется на месте",
      "Методы: length(), toUpperCase(), toLowerCase()",
      "Поиск и срезы: indexOf(), charAt(), substring()",
      "Замена и очистка: replace(), trim()",
      "Сравнение строк: почему НЕЛЬЗЯ использовать ==, а нужно .equals()",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java строки String", note: "Строки и их методы с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов String методы equals Java", note: "Сравнение строк и String Pool" },
    ],
    theory: [
      { type: "h", text: "Строки в Java: класс String" },
      {
        type: "p",
        text: "В Java строки — это не примитивы, а полноценные объекты класса `java.lang.String`. Строка представляет собой последовательность символов, заключенных в двойные кавычки `\"...\"`.",
      },
      {
        type: "code",
        caption: "Создание строки",
        code: `String greeting = "Привет, мир!";
System.out.println(greeting);`,
      },
      { type: "h", text: "Главные методы класса String (W3Schools)" },
      {
        type: "table",
        head: ["Метод", "Что возвращает", "Пример", "Результат"],
        rows: [
          ["length()", "Длину строки (число символов)", "\"Java\".length()", "4"],
          ["toUpperCase()", "Строку в верхнем регистре", "\"java\".toUpperCase()", "\"JAVA\""],
          ["toLowerCase()", "Строку в нижнем регистре", "\"JAVA\".toLowerCase()", "\"java\""],
          ["indexOf(\"x\")", "Индекс первого вхождения символа (или -1)", "\"Hello\".indexOf(\"e\")", "1 (индексация с 0)"],
          ["charAt(i)", "Символ char по индексу i", "\"Java\".charAt(0)", "'J'"],
          ["substring(from, to)", "Срез строки от from до to (не включая to)", "\"JavaForge\".substring(0, 4)", "\"Java\""],
          ["replace(old, new)", "Строку с замененными символами", "\"cat\".replace('c', 'b')", "\"bat\""],
          ["trim()", "Удаляет пробелы в начале и конце", "\"  hi  \".trim()", "\"hi\""],
        ],
      },
      { type: "h", text: "Сравнение строк: .equals() против ==" },
      {
        type: "callout",
        variant: "warning",
        title: "Критически важно: никогда не сравнивай строки через ==",
        text: "Оператор `==` сравнивает **адреса в памяти** (ссылки), а не содержимое строки!\nЧтобы сравнить сам текст двух строк, ВСЕГДА используй метод `.equals()` или `.equalsIgnoreCase()` (без учета регистра):\n`String a = scanner.nextLine();`\n`if (a.equals(\"секрет\")) { ... } // ПРАВИЛЬНО`\n`if (a == \"секрет\") { ... }      // ОШИБКА: вернет false!`",
      },
    ],
    tasks: [
      {
        id: "d8_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Нормализация имени)",
        shortDesc: "Длина строки, перевод в заглавный регистр и первый символ",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Программа считывает имя пользователя `name` через `Scanner`.\nВыведи:\n1) `Длина: <length> симв.`\n2) `ВЕРХНИЙ: <name.toUpperCase()>`\n3) `Первая буква: <name.charAt(0)>`",
        requirements: [
          "Используй методы `.length()`, `.toUpperCase()`, `.charAt(0)`.",
          "Выведи 3 строки строго по шаблону.",
        ],
        exampleInput: "Александр",
        exampleOutput: "Длина: 9 симв.\nВЕРХНИЙ: АЛЕКСАНДР\nПервая буква: А",
        sampleInput: "Александр",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();

        // TODO: выведи длину, имя заглавными и первую букву
    }
}
`,
        tests: [
          {
            label: "Александр",
            stdin: "Александр\n",
            expected: [
              "Длина: 9 симв.",
              "ВЕРХНИЙ: АЛЕКСАНДР",
              "Первая буква: А",
            ],
          },
          {
            label: "Java",
            stdin: "Java\n",
            expected: [
              "Длина: 4 симв.",
              "ВЕРХНИЙ: JAVA",
              "Первая буква: J",
            ],
          },
        ],
        requiredCode: [
          { pattern: "length\\(\\)", message: "Используй name.length()" },
          { pattern: "toUpperCase\\(\\)", message: "Используй name.toUpperCase()" },
        ],
        hints: ["`int len = name.length();`", "`char first = name.charAt(0);`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();

        System.out.println("Длина: " + name.length() + " симв.");
        System.out.println("ВЕРХНИЙ: " + name.toUpperCase());
        System.out.println("Первая буква: " + name.charAt(0));
    }
}
`,
      },
      {
        id: "d8_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Парсер email)",
        shortDesc: "Извлеки логин и домен почтового ящика через indexOf и substring",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа считывает email адрес (например, `student@javaforge.ru`).\nНайди позицию символа `@` с помощью `.indexOf(\"@\")`.\nС помощью `.substring(...)` извлеки:\n- Логин (всё до `@`)\n- Домен (всё после `@`)\nВыведи:\n`Email: student@javaforge.ru`\n`Логин: student`\n`Домен: javaforge.ru`",
        requirements: [
          "Используй методы `indexOf(\"@\")` и `substring(...)`.",
          "Выведи 3 строки.",
        ],
        exampleInput: "student@javaforge.ru",
        exampleOutput: "Email: student@javaforge.ru\nЛогин: student\nДомен: javaforge.ru",
        sampleInput: "student@javaforge.ru",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String email = scanner.nextLine();

        // TODO: найди индекс @ и выдели login и domain
    }
}
`,
        tests: [
          {
            label: "student@javaforge.ru",
            stdin: "student@javaforge.ru\n",
            expected: [
              "Email: student@javaforge.ru",
              "Логин: student",
              "Домен: javaforge.ru",
            ],
          },
          {
            label: "alex.dev@gmail.com",
            stdin: "alex.dev@gmail.com\n",
            expected: [
              "Email: alex.dev@gmail.com",
              "Логин: alex.dev",
              "Домен: gmail.com",
            ],
          },
        ],
        requiredCode: [
          { pattern: "indexOf\\s*\\(\\s*[\"']@[\"']\\s*\\)", message: "Используй indexOf(\"@\")" },
          { pattern: "substring\\s*\\(", message: "Используй substring" },
        ],
        hints: [
          "`int atIndex = email.indexOf(\"@\");`",
          "`String login = email.substring(0, atIndex);`",
          "`String domain = email.substring(atIndex + 1);`",
        ],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String email = scanner.nextLine();

        int atIndex = email.indexOf("@");
        String login = email.substring(0, atIndex);
        String domain = email.substring(atIndex + 1);

        System.out.println("Email: " + email);
        System.out.println("Логин: " + login);
        System.out.println("Домен: " + domain);
    }
}
`,
      },
      {
        id: "d8_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Цензор сообщений чата)",
        shortDesc: "Замена запрещенных слов методом replace и проверка команды выхода",
        difficulty: "Средний",
        xp: 40,
        description:
          "Программа получает строку текста сообщения. Если в тексте встречается слово `спам` (в нижнем регистре), замени его на `[ДАННЫЕ УДАЛЕНЫ]`. Также проверь, совпадает ли текст сообщения в точности с командой выхода `/exit` (используй метод `.equals()`).\nВыведи:\n`Очищенный текст: <результат>`\n`Команда выхода: <true/false>`",
        requirements: [
          "Используй метод `.replace(\"спам\", \"[ДАННЫЕ УДАЛЕНЫ]\")`.",
          "Используй `.equals(\"/exit\")` для проверки выхода.",
          "Выведи 2 строки.",
        ],
        exampleInput: "Купи спам прямо сейчас",
        exampleOutput: "Очищенный текст: Купи [ДАННЫЕ УДАЛЕНЫ] прямо сейчас\nКоманда выхода: false",
        sampleInput: "Купи спам прямо сейчас",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();

        // TODO: очисти спам и проверь команду выхода
    }
}
`,
        tests: [
          {
            label: "Купи спам прямо сейчас",
            stdin: "Купи спам прямо сейчас\n",
            expected: [
              "Очищенный текст: Купи [ДАННЫЕ УДАЛЕНЫ] прямо сейчас",
              "Команда выхода: false",
            ],
          },
          {
            label: "/exit",
            stdin: "/exit\n",
            expected: [
              "Очищенный текст: /exit",
              "Команда выхода: true",
            ],
          },
        ],
        requiredCode: [
          { pattern: "replace\\s*\\(", message: "Используй replace" },
          { pattern: "equals\\s*\\(", message: "Используй equals" },
        ],
        hints: [
          "`String clean = text.replace(\"спам\", \"[ДАННЫЕ УДАЛЕНЫ]\");`",
          "`boolean isExit = text.equals(\"/exit\");`",
        ],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();

        String clean = text.replace("спам", "[ДАННЫЕ УДАЛЕНЫ]");
        boolean isExit = text.equals("/exit");

        System.out.println("Очищенный текст: " + clean);
        System.out.println("Команда выхода: " + isExit);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 9: Java Math (Класс Math и вычисления)                        */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 9,
    moduleId: 2,
    title: "Java Math: класс Math, корни, степени и случайные числа",
    short: "Math.max, Math.min, Math.sqrt, Math.pow, Math.random и округление",
    difficulty: "Лёгкий",
    duration: "~1.5 часа",
    xp: 100,
    ready: true,
    topics: [
      "Встроенный класс java.lang.Math (не требует import)",
      "Экстремумы: Math.max(x, y) и Math.min(x, y)",
      "Степени и корни: Math.sqrt(x) и Math.pow(x, y)",
      "Модуль: Math.abs(x)",
      "Округление: Math.round(x), Math.floor(x), Math.ceil(x)",
      "Генератор случайных чисел: Math.random() и формула диапазона [min, max]",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java класс Math", note: "Математические методы и вычисления" },
      { author: "Заур Трегулов", query: "Заур Трегулов Math random генерация чисел Java", note: "Случайные числа и округление" },
    ],
    theory: [
      { type: "h", text: "Класс java.lang.Math" },
      {
        type: "p",
        text: "Класс `Math` содержит набор готовых статических методов для выполнения стандартных математических операций. Он входит в пакет `java.lang`, поэтому импортировать его не требуется.",
      },
      {
        type: "table",
        head: ["Метод", "Назначение", "Пример", "Результат"],
        rows: [
          ["Math.max(x, y)", "Находит большее из двух чисел", "Math.max(5, 10)", "10"],
          ["Math.min(x, y)", "Находит меньшее из двух чисел", "Math.min(5, 10)", "5"],
          ["Math.sqrt(x)", "Квадратный корень из x", "Math.sqrt(64)", "8.0"],
          ["Math.abs(x)", "Абсолютная величина (модуль)", "Math.abs(-4.7)", "4.7"],
          ["Math.pow(a, b)", "Возведение a в степень b", "Math.pow(2, 8)", "256.0"],
          ["Math.round(x)", "Математическое округление до целого", "Math.round(4.6)", "5"],
          ["Math.random()", "Случайное double от 0.0 до 1.0 (не включая 1.0)", "Math.random()", "0.428..."],
        ],
      },
      { type: "h", text: "Формула получения случайного числа в диапазоне [min, max]" },
      {
        type: "p",
        text: "Метод `Math.random()` возвращает дробное число от `0.0` (включительно) до `1.0` (исключительно). Чтобы получить целое случайное число от `min` до `max` включительно, используется стандартная формула:",
      },
      {
        type: "code",
        caption: "Случайное число от min до max",
        code: `int min = 1;
int max = 6; // бросок игрального кубика
int dice = (int) (Math.random() * (max - min + 1)) + min;`,
      },
    ],
    tasks: [
      {
        id: "d9_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Теорема Пифагора)",
        shortDesc: "Вычисли гипотенузу треугольника по катетам через Math.sqrt",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Программа считывает два целых катета `a` и `b` прямоугольного треугольника.\nПо теореме Пифагора гипотенуза равна: `c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))` (или `Math.sqrt(a * a + b * b)`).\nВыведи:\n`Катет 1: <a>`\n`Катет 2: <b>`\n`Гипотенуза: <c>`",
        requirements: [
          "Используй метод `Math.sqrt(...)`.",
          "Выведи 3 строки.",
        ],
        exampleInput: "3\n4",
        exampleOutput: "Катет 1: 3\nКатет 2: 4\nГипотенуза: 5.0",
        sampleInput: "3\n4",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();

        // TODO: рассчитай гипотенузу
    }
}
`,
        tests: [
          { label: "3 и 4", stdin: "3\n4\n", expected: ["Катет 1: 3", "Катет 2: 4", "Гипотенуза: 5.0"] },
          { label: "6 и 8", stdin: "6\n8\n", expected: ["Катет 1: 6", "Катет 2: 8", "Гипотенуза: 10.0"] },
        ],
        requiredCode: [{ pattern: "Math\\.sqrt", message: "Используй Math.sqrt" }],
        hints: ["`double c = Math.sqrt(a * a + b * b);`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();

        double c = Math.sqrt(a * a + b * b);

        System.out.println("Катет 1: " + a);
        System.out.println("Катет 2: " + b);
        System.out.println("Гипотенуза: " + c);
    }
}
`,
      },
      {
        id: "d9_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Максимум, минимум и модуль)",
        shortDesc: "Сравнение трех чисел с помощью Math.max и Math.min",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа считывает три целых числа `x`, `y`, `z`.\nС помощью методов `Math.max` и `Math.min` найди наибольшее и наименьшее число, а также вычисли абсолютную разницу (модуль) между максимумом и минимумом через `Math.abs`.\nВыведи:\n`Максимум: <max>`\n`Минимум: <min>`\n`Размах: <abs_diff>`",
        requirements: [
          "Используй `Math.max`, `Math.min` и `Math.abs`.",
          "Выведи 3 строки.",
        ],
        exampleInput: "15\n-8\n42",
        exampleOutput: "Максимум: 42\nМинимум: -8\nРазмах: 50",
        sampleInput: "15\n-8\n42",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int x = scanner.nextInt();
        int y = scanner.nextInt();
        int z = scanner.nextInt();

        // TODO: найди максимум, минимум и размах с Math
    }
}
`,
        tests: [
          { label: "15, -8, 42", stdin: "15\n-8\n42\n", expected: ["Максимум: 42", "Минимум: -8", "Размах: 50"] },
          { label: "100, 250, 150", stdin: "100\n250\n150\n", expected: ["Максимум: 250", "Минимум: 100", "Размах: 150"] },
        ],
        requiredCode: [
          { pattern: "Math\\.max", message: "Используй Math.max" },
          { pattern: "Math\\.min", message: "Используй Math.min" },
          { pattern: "Math\\.abs", message: "Используй Math.abs" },
        ],
        hints: ["`int max = Math.max(x, Math.max(y, z));`", "`int min = Math.min(x, Math.min(y, z));`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int x = scanner.nextInt();
        int y = scanner.nextInt();
        int z = scanner.nextInt();

        int max = Math.max(x, Math.max(y, z));
        int min = Math.min(x, Math.min(y, z));
        int range = Math.abs(max - min);

        System.out.println("Максимум: " + max);
        System.out.println("Минимум: " + min);
        System.out.println("Размах: " + range);
    }
}
`,
      },
      {
        id: "d9_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Геометрия круга и Math.PI)",
        shortDesc: "Расчет площади и длины окружности с округлением Math.round",
        difficulty: "Средний",
        xp: 40,
        description:
          "Программа считывает радиус круга `radius` (дробное число double).\nИспользуя константу `Math.PI` и метод `Math.pow`, рассчитай:\n- Длину окружности: `2 * Math.PI * radius`\n- Площадь круга: `Math.PI * Math.pow(radius, 2)`\n- Округленную площадь: `Math.round(площадь)`\nВыведи:\n`Радиус: <radius>`\n`Длина окружности: <circumference>`\n`Площадь: <area>`\n`Округленная площадь: <roundedArea>`",
        requirements: [
          "Используй `Math.PI`, `Math.pow` и `Math.round`.",
          "Выведи 4 строки.",
        ],
        exampleInput: "5.0",
        exampleOutput: "Радиус: 5.0\nДлина окружности: 31.41592653589793\nПлощадь: 78.53981633974483\nОкругленная площадь: 79",
        sampleInput: "5.0",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double radius = scanner.nextDouble();

        // TODO: рассчитай длину, площадь и округленную площадь с Math
    }
}
`,
        tests: [
          {
            label: "Радиус 5.0",
            stdin: "5.0\n",
            expected: [
              "Радиус: 5.0|5.0|5",
              "Длина окружности: 31.41|31.41|31.42",
              "Площадь: 78.53|78.53|78.54",
              "Округленная площадь: 79|79",
            ],
          },
          {
            label: "Радиус 10.0",
            stdin: "10.0\n",
            expected: [
              "Радиус: 10.0|10.0|10",
              "Длина окружности: 62.83|62.83",
              "Площадь: 314.15|314.15|314.16",
              "Округленная площадь: 314|314",
            ],
          },
        ],
        requiredCode: [
          { pattern: "Math\\.PI", message: "Используй константу Math.PI" },
          { pattern: "Math\\.round", message: "Используй Math.round" },
        ],
        hints: ["`double area = Math.PI * Math.pow(radius, 2);`", "`long rounded = Math.round(area);`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double radius = scanner.nextDouble();

        double circumference = 2 * Math.PI * radius;
        double area = Math.PI * Math.pow(radius, 2);
        long roundedArea = Math.round(area);

        System.out.println("Радиус: " + radius);
        System.out.println("Длина окружности: " + circumference);
        System.out.println("Площадь: " + area);
        System.out.println("Округленная площадь: " + roundedArea);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 10: Java Booleans & Operators (Логические выражения)          */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 10,
    moduleId: 2,
    title: "Java Booleans: операторы сравнения и логические связки &&, ||, !",
    short: "boolean, операторы сравнения >, <, ==, != и короткое замыкание",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Тип boolean: true и false",
      "Операторы сравнения: >, <, >=, <=, ==, !=",
      "Логическое И (&&): истина, только если ОБА истинны",
      "Логическое ИЛИ (||): истина, если ХОТЯ БЫ ОДИН истинен",
      "Логическое НЕ (!): инверсия условия",
      "Короткое замыкание (Short-Circuit Evaluation): почему && и || безопасны",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java логические операторы boolean", note: "Логические связки и сравнения" },
      { author: "Заур Трегулов", query: "Заур Трегулов логические операторы короткое замыкание Java", note: "Short-circuit evaluation" },
    ],
    theory: [
      { type: "h", text: "Тип данных boolean" },
      {
        type: "p",
        text: "В программировании часто требуется знать ответ типа «Да/Нет»: включен ли свет? совершеннолетний ли пользователь? равны ли числа? Для этого в Java используется тип `boolean`, принимающий ровно два значения: `true` (истина) или `false` (ложь).",
      },
      {
        type: "code",
        caption: "Булевы выражения (W3Schools)",
        code: `int x = 10;
int y = 9;
System.out.println(x > y);  // напечатает: true
System.out.println(x == y); // напечатает: false`,
      },
      { type: "h", text: "Логические операторы: &&, ||, !" },
      {
        type: "table",
        head: ["Оператор", "Название", "Правило", "Пример"],
        rows: [
          ["&&", "Логическое И (AND)", "true, только когда ОБА операнда true", "(5 > 3) && (10 > 2) -> true"],
          ["||", "Логическое ИЛИ (OR)", "true, если ХОТЯ БЫ ОДИН операнд true", "(5 < 3) || (10 > 2) -> true"],
          ["!", "Логическое НЕ (NOT)", "Переворачивает значение на противоположное", "!(5 > 3) -> false"],
        ],
      },
      { type: "h", text: "Короткое замыкание (Short-Circuit Evaluation)" },
      {
        type: "callout",
        variant: "tip",
        title: "Почему Java не делает лишней работы?",
        text: "- В выражении `A && B`: если `A` уже `false`, Java **даже не станет вычислять `B`**, потому что общий результат в любом случае будет `false`.\n- В выражении `A || B`: если `A` уже `true`, `B` не вычисляется.\nЭто позволяет писать безопасные проверки: `str != null && str.length() > 0` никогда не выбросит ошибку, если строка равна `null`!",
      },
    ],
    tasks: [
      {
        id: "d10_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Контроль доступа на аттракцион)",
        shortDesc: "Проверка условий по росту и возрасту через оператор &&",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "На экстремальный аттракцион допускаются посетители ростом не менее 140 см **И** возрастом не менее 12 лет.\nПрограмма считывает рост `height` и возраст `age`.\nСформируй булево выражение: `boolean isAllowed = height >= 140 && age >= 12;`.\nВыведи:\n`Рост: <height> см`\n`Возраст: <age> лет`\n`Допуск разрешен: <true/false>`",
        requirements: [
          "Используй оператор `&&`.",
          "Выведи 3 строки.",
        ],
        exampleInput: "155\n14",
        exampleOutput: "Рост: 155 см\nВозраст: 14 лет\nДопуск разрешен: true",
        sampleInput: "155\n14",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int height = scanner.nextInt();
        int age = scanner.nextInt();

        // TODO: определи допуск и выведи результат
    }
}
`,
        tests: [
          { label: "155 см, 14 лет", stdin: "155\n14\n", expected: ["Рост: 155 см", "Возраст: 14 лет", "Допуск разрешен: true"] },
          { label: "135 см, 15 лет", stdin: "135\n15\n", expected: ["Рост: 135 см", "Возраст: 15 лет", "Допуск разрешен: false"] },
        ],
        requiredCode: [{ pattern: "&&", message: "Используй оператор &&" }],
        hints: ["`boolean isAllowed = height >= 140 && age >= 12;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int height = scanner.nextInt();
        int age = scanner.nextInt();

        boolean isAllowed = height >= 140 && age >= 12;

        System.out.println("Рост: " + height + " см");
        System.out.println("Возраст: " + age + " лет");
        System.out.println("Допуск разрешен: " + isAllowed);
    }
}
`,
      },
      {
        id: "d10_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Валидатор диапазона и четности)",
        shortDesc: "Комбинация логических связок && и ||",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа считывает целое число `n`.\nПроверь следующие логические условия:\n1) Число находится в диапазоне от 10 до 99 включительно (`inRange`)\n2) Число является четным (`isEven`: `n % 2 == 0`)\n3) Число особое (`isSpecial`): оно либо кратно 7, либо оканчивается на 0 (`n % 7 == 0 || n % 10 == 0`)\nВыведи:\n`Число: <n>`\n`В диапазоне [10..99]: <true/false>`\n`Четное: <true/false>`\n`Особое число: <true/false>`",
        requirements: [
          "Используй `&&`, `%`, `||`.",
          "Выведи 4 строки.",
        ],
        exampleInput: "70",
        exampleOutput: "Число: 70\nВ диапазоне [10..99]: true\nЧетное: true\nОсобое число: true",
        sampleInput: "70",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: рассчитай inRange, isEven, isSpecial
    }
}
`,
        tests: [
          { label: "70", stdin: "70\n", expected: ["Число: 70", "В диапазоне [10..99]: true", "Четное: true", "Особое число: true"] },
          { label: "7", stdin: "7\n", expected: ["Число: 7", "В диапазоне [10..99]: false", "Четное: false", "Особое число: true"] },
        ],
        requiredCode: [
          { pattern: "&&", message: "Используй &&" },
          { pattern: "\\|\\|", message: "Используй ||" },
        ],
        hints: [
          "`boolean inRange = n >= 10 && n <= 99;`",
          "`boolean isSpecial = (n % 7 == 0) || (n % 10 == 0);`",
        ],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        boolean inRange = n >= 10 && n <= 99;
        boolean isEven = n % 2 == 0;
        boolean isSpecial = n % 7 == 0 || n % 10 == 0;

        System.out.println("Число: " + n);
        System.out.println("В диапазоне [10..99]: " + inRange);
        System.out.println("Четное: " + isEven);
        System.out.println("Особое число: " + isSpecial);
    }
}
`,
      },
      {
        id: "d10_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Високосный год)",
        shortDesc: "Григорианский алгоритм определения високосного года",
        difficulty: "Средний",
        xp: 40,
        description:
          "Год является високосным (`isLeap`), если он делится на 4 **И** не делится на 100, **ЛИБО** делится на 400.\nНапример: 2024 — високосный (делится на 4), 1900 — НЕ високосный (делится на 100, но не на 400), 2000 — високосный (делится на 400).\nПрограмма считывает год `year` и вычисляет `isLeap` в одну строку с помощью операторов `&&` и `||`.\nВыведи:\n`Год: <year>`\n`Високосный: <true/false>`",
        requirements: [
          "Используй формулу: `(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)`.",
          "Выведи 2 строки.",
        ],
        exampleInput: "2024",
        exampleOutput: "Год: 2024\nВисокосный: true",
        sampleInput: "2024",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int year = scanner.nextInt();

        // TODO: определи високосность года
    }
}
`,
        tests: [
          { label: "2024", stdin: "2024\n", expected: ["Год: 2024", "Високосный: true"] },
          { label: "1900", stdin: "1900\n", expected: ["Год: 1900", "Високосный: false"] },
          { label: "2000", stdin: "2000\n", expected: ["Год: 2000", "Високосный: true"] },
        ],
        requiredCode: [
          { pattern: "%\\s*4\\b", message: "Проверь деление на 4" },
          { pattern: "%\\s*400\\b", message: "Проверь деление на 400" },
        ],
        hints: ["`boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int year = scanner.nextInt();

        boolean isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);

        System.out.println("Год: " + year);
        System.out.println("Високосный: " + isLeap);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 11: Java If...Else (Ветвления и тернарный оператор)           */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 11,
    moduleId: 2,
    title: "Java If...Else: ветвления, лесенка else if и тернарный оператор",
    short: "if, else if, else, вложенные условия и тернарный оператор ? :",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Оператор if: проверка условия",
      "Конструкция if...else",
      "Лесенка множественного выбора: else if",
      "Вложенные условия (Nested if)",
      "Тернарный условный оператор (condition) ? trueVal : falseVal",
      "Частые ошибки новичков: точка с запятой сразу после if(cond);",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java условный оператор if else", note: "Ветвления и условия с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов тернарный оператор if else Java", note: "Тернарный оператор и ловушки" },
    ],
    theory: [
      { type: "h", text: "Условные конструкции: if, else if, else" },
      {
        type: "p",
        text: "Условные конструкции позволяют программе принимать решения и выполнять разные блоки кода в зависимости от истинности условий.",
      },
      {
        type: "code",
        caption: "Синтаксис if...else (W3Schools)",
        code: `int time = 22;
if (time < 10) {
    System.out.println("Доброе утро!");
} else if (time < 18) {
    System.out.println("Добрый день!");
} else {
    System.out.println("Добрый вечер!");
}`,
      },
      { type: "h", text: "Тернарный оператор (Short Hand If...Else)" },
      {
        type: "p",
        text: "Тернарный оператор заменяет простые конструкции `if-else` одной компактной строкой:",
      },
      {
        type: "code",
        caption: "Синтаксис тернарного оператора",
        code: `variable = (condition) ? expressionTrue : expressionFalse;

// Пример:
int time = 20;
String greeting = (time < 18) ? "Добрый день" : "Добрый вечер";
System.out.println(greeting);`,
      },
      { type: "h", text: "Коварная ошибка: точка с запятой после if" },
      {
        type: "callout",
        variant: "warning",
        title: "Никогда не ставь точку с запятой сразу после if (...) !",
        text: "Если написать: `if (x > 10); { System.out.println(\"Привет\"); }`,\nточка с запятой завершит условие `if` как пустую операцию, а фигурные скобки выполнятся **ВСЕГДА**, независимо от значения `x`!",
      },
    ],
    tasks: [
      {
        id: "d11_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Шкала оценок студента)",
        shortDesc: "Преобразуй 100-балльную шкалу в буквенную оценку",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Программа считывает количество баллов студента `score` (от 0 до 100):\n- `90..100`: оценка `A`\n- `75..89`: оценка `B`\n- `60..74`: оценка `C`\n- `меньше 60`: оценка `F`\nВыведи:\n`Баллы: <score>`\n`Оценка: <буква>`",
        requirements: [
          "Используй цепочку `if...else if...else`.",
          "Выведи 2 строки.",
        ],
        exampleInput: "85",
        exampleOutput: "Баллы: 85\nОценка: B",
        sampleInput: "85",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int score = scanner.nextInt();

        // TODO: определи буквенную оценку A, B, C, F
    }
}
`,
        tests: [
          { label: "85 баллов", stdin: "85\n", expected: ["Баллы: 85", "Оценка: B"] },
          { label: "95 баллов", stdin: "95\n", expected: ["Баллы: 95", "Оценка: A"] },
          { label: "55 баллов", stdin: "55\n", expected: ["Баллы: 55", "Оценка: F"] },
        ],
        requiredCode: [
          { pattern: "else\\s+if", message: "Используй else if" },
        ],
        hints: ["`if (score >= 90) grade = \"A\"; else if (score >= 75) grade = \"B\"; ...`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int score = scanner.nextInt();

        String grade;
        if (score >= 90) {
            grade = "A";
        } else if (score >= 75) {
            grade = "B";
        } else if (score >= 60) {
            grade = "C";
        } else {
            grade = "F";
        }

        System.out.println("Баллы: " + score);
        System.out.println("Оценка: " + grade);
    }
}
`,
      },
      {
        id: "d11_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Тариф доставки и тернарник)",
        shortDesc: "Расчет стоимости доставки с условиями и тернарным оператором",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Интернет-магазин рассчитывает стоимость доставки заказа. Программа получает:\n1) Сумму заказа `orderAmount` (целое число)\n2) Расстояние доставки `distanceKm` (целое число)\nПравила:\n- Если `orderAmount >= 3000`, доставка бесплатная (`cost = 0`).\n- Иначе если `distanceKm <= 10`, доставка стоит 300 руб.\n- Иначе доставка стоит 500 руб.\nС помощью тернарного оператора определи статус: если `cost == 0`, статус `\"Бесплатно\"`, иначе `\"Платно\"`.\nВыведи:\n`Сумма заказа: <orderAmount> руб.`\n`Дистанция: <distanceKm> км`\n`Стоимость доставки: <cost> руб.`\n`Тип: <статус>`",
        requirements: [
          "Используй `if...else if...else` и тернарный оператор `? :`.",
          "Выведи 4 строки.",
        ],
        exampleInput: "2500\n15",
        exampleOutput: "Сумма заказа: 2500 руб.\nДистанция: 15 км\nСтоимость доставки: 500 руб.\nТип: Платно",
        sampleInput: "2500\n15",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int orderAmount = scanner.nextInt();
        int distanceKm = scanner.nextInt();

        // TODO: рассчитай стоимость доставки и определи статус через тернарный оператор
    }
}
`,
        tests: [
          { label: "2500 руб, 15 км", stdin: "2500\n15\n", expected: ["Сумма заказа: 2500 руб.", "Дистанция: 15 км", "Стоимость доставки: 500 руб.", "Тип: Платно"] },
          { label: "4000 руб, 25 км", stdin: "4000\n25\n", expected: ["Сумма заказа: 4000 руб.", "Дистанция: 25 км", "Стоимость доставки: 0 руб.", "Тип: Бесплатно"] },
        ],
        requiredCode: [{ pattern: "\\?", message: "Используй тернарный оператор ?" }],
        hints: ["`String type = (cost == 0) ? \"Бесплатно\" : \"Платно\";`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int orderAmount = scanner.nextInt();
        int distanceKm = scanner.nextInt();

        int cost;
        if (orderAmount >= 3000) {
            cost = 0;
        } else if (distanceKm <= 10) {
            cost = 300;
        } else {
            cost = 500;
        }

        String type = (cost == 0) ? "Бесплатно" : "Платно";

        System.out.println("Сумма заказа: " + orderAmount + " руб.");
        System.out.println("Дистанция: " + distanceKm + " км");
        System.out.println("Стоимость доставки: " + cost + " руб.");
        System.out.println("Тип: " + type);
    }
}
`,
      },
      {
        id: "d11_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Квадратное уравнение)",
        shortDesc: "Расчет корней уравнения ax^2 + bx + c = 0 по дискриминанту",
        difficulty: "Средний",
        xp: 40,
        description:
          "Программа считывает три вещественных коэффициента `a`, `b`, `c` квадратного уравнения.\nВычисли дискриминант: `D = b * b - 4 * a * c`.\n- Если `D > 0`, уравнение имеет два корня: `x1 = (-b + Math.sqrt(D)) / (2 * a)`, `x2 = (-b - Math.sqrt(D)) / (2 * a)`.\n- Если `D == 0`, один корень: `x = -b / (2 * a)`.\n- Если `D < 0`, корней нет.\nВыведи:\n`Дискриминант: <D>`\n`Результат: <Два корня: x1=<x1>, x2=<x2> | Один корень: x=<x> | Корней нет>`",
        requirements: [
          "Используй `Math.sqrt` и ветвления `if (D > 0) ... else if (D == 0) ... else`.",
          "Выведи 2 строки.",
        ],
        exampleInput: "1.0\n-5.0\n6.0",
        exampleOutput: "Дискриминант: 1.0\nРезультат: Два корня: x1=3.0, x2=2.0",
        sampleInput: "1.0\n-5.0\n6.0",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double a = scanner.nextDouble();
        double b = scanner.nextDouble();
        double c = scanner.nextDouble();

        // TODO: рассчитай дискриминант и корни
    }
}
`,
        tests: [
          {
            label: "1, -5, 6 (D = 1.0)",
            stdin: "1.0\n-5.0\n6.0\n",
            expected: [
              "Дискриминант: 1.0|1.0|1",
              "Два корня: x1=3.0, x2=2.0|x1=3.0, x2=2.0|x1=2.0, x2=3.0|x1=3, x2=2|x1=2, x2=3|3.0, 2.0|2.0, 3.0|3.0 и 2.0",
            ],
          },
          {
            label: "1, -2, 1 (D = 0.0)",
            stdin: "1.0\n-2.0\n1.0\n",
            expected: [
              "Дискриминант: 0.0|0.0|0",
              "Один корень: x=1.0|x=1.0|x=1|1.0|1",
            ],
          },
          {
            label: "1, 2, 5 (D < 0)",
            stdin: "1.0\n2.0\n5.0\n",
            expected: [
              "Дискриминант: -16.0|-16",
              "Корней нет|нет корней",
            ],
          },
        ],
        requiredCode: [{ pattern: "Math\\.sqrt", message: "Используй Math.sqrt" }],
        hints: ["`double D = b * b - 4 * a * c;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double a = scanner.nextDouble();
        double b = scanner.nextDouble();
        double c = scanner.nextDouble();

        double D = b * b - 4 * a * c;

        System.out.println("Дискриминант: " + D);
        if (D > 0) {
            double x1 = (-b + Math.sqrt(D)) / (2 * a);
            double x2 = (-b - Math.sqrt(D)) / (2 * a);
            System.out.println("Результат: Два корня: x1=" + x1 + ", x2=" + x2);
        } else if (D == 0) {
            double x = -b / (2 * a);
            System.out.println("Результат: Один корень: x=" + x);
        } else {
            System.out.println("Результат: Корней нет");
        }
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 12: Java Switch (Оператор множественного выбора)              */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 12,
    moduleId: 2,
    title: "Java Switch: оператор switch, break, default и современный ->",
    short: "Оператор switch, case, ловушка fallthrough и switch expressions",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Оператор switch как замена громоздким if...else",
      "Ключевые слова: case, break, default",
      "Опасность проваливания (Fallthrough): что будет без break",
      "Поддерживаемые типы: byte, short, char, int, String, enum",
      "Запрещенные типы: float, double, boolean (почему их нельзя использовать в switch)",
      "Современные стрелочные switch expressions (Java 14+)",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java оператор switch", note: "switch и break с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов switch выражения Java", note: "Ловушка fallthrough и switch ->" },
    ],
    theory: [
      { type: "h", text: "Оператор switch" },
      {
        type: "p",
        text: "Вместо длинной и трудночитаемой цепочки `if (x == 1) ... else if (x == 2) ...` используется оператор `switch`. Он выбирает один из множества блоков кода для выполнения.",
      },
      {
        type: "code",
        caption: "Классический switch (W3Schools)",
        code: `int day = 4;
switch (day) {
    case 1:
        System.out.println("Понедельник");
        break;
    case 2:
        System.out.println("Вторник");
        break;
    case 3:
        System.out.println("Среда");
        break;
    case 4:
        System.out.println("Четверг");
        break;
    default:
        System.out.println("Выходной день");
        break;
}`,
      },
      { type: "h", text: "Роль ключевого слова break и Fallthrough" },
      {
        type: "callout",
        variant: "warning",
        title: "Что происходит, если забыть break?",
        text: "Если в секции `case` нет ключевого слова `break`, Java **не остановится**, а продолжит выполнять команды следующих `case` подряд («проваливание» / fallthrough), даже если их условия не совпали! `default` выполняется, если ни один из `case` не подошел.",
      },
      { type: "h", text: "Современный стрелочный switch (Java 14+)" },
      {
        type: "p",
        text: "В современной Java доступен лаконичный синтаксис со стрелкой `->`. В нем **не нужен `break`**, и он автоматически защищен от проваливания:",
      },
      {
        type: "code",
        caption: "Стрелочный switch",
        code: `String dayName = switch (day) {
    case 1 -> "Понедельник";
    case 2 -> "Вторник";
    case 3 -> "Среда";
    case 4 -> "Четверг";
    case 5 -> "Пятница";
    default -> "Выходной";
};`,
      },
    ],
    tasks: [
      {
        id: "d12_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Определение дня недели)",
        shortDesc: "С помощью switch выведи название дня недели по его номеру",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Программа считывает номер дня недели `day` (от 1 до 7).\nС помощью оператора `switch` сопоставь:\n1 -> Понедельник, 2 -> Вторник, 3 -> Среда, 4 -> Четверг, 5 -> Пятница, 6 -> Суббота, 7 -> Воскресенье.\nЕсли номер вне диапазона 1..7, в блоке `default` выведи `Некорректный день`.\nВыведи:\n`День <day>: <название>`",
        requirements: [
          "Используй оператор `switch`.",
          "Используй секцию `default`.",
        ],
        exampleInput: "3",
        exampleOutput: "День 3: Среда",
        sampleInput: "3",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int day = scanner.nextInt();

        // TODO: определи день через switch
    }
}
`,
        tests: [
          { label: "День 3", stdin: "3\n", expected: ["День 3: Среда"] },
          { label: "День 7", stdin: "7\n", expected: ["День 7: Воскресенье"] },
          { label: "День 9", stdin: "9\n", expected: ["День 9: Некорректный день"] },
        ],
        requiredCode: [{ pattern: "switch\\s*\\(", message: "Используй оператор switch" }],
        hints: ["`case 1: ... break;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int day = scanner.nextInt();

        String name;
        switch (day) {
            case 1: name = "Понедельник"; break;
            case 2: name = "Вторник"; break;
            case 3: name = "Среда"; break;
            case 4: name = "Четверг"; break;
            case 5: name = "Пятница"; break;
            case 6: name = "Суббота"; break;
            case 7: name = "Воскресенье"; break;
            default: name = "Некорректный день"; break;
        }

        System.out.println("День " + day + ": " + name);
    }
}
`,
      },
      {
        id: "d12_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Консольный калькулятор на switch)",
        shortDesc: "Считывание чисел и знака операции (+, -, *, /) со switch",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа считывает два целых числа `a` и `b`, а затем символ операции `op` (через `scanner.next().charAt(0)`).\nС помощью оператора `switch (op)` выполни операцию:\n- `'+'`: сложение (`a + b`)\n- `'-'`: вычитание (`a - b`)\n- `'*'`: умножение (`a * b`)\n- `'/'`: целочисленное деление (`a / b`)\nВыведи:\n`Результат: <a> <op> <b> = <result>`",
        requirements: [
          "Используй `switch` по символу операции `char op`.",
          "Выведи результат.",
        ],
        exampleInput: "20\n4\n/",
        exampleOutput: "Результат: 20 / 4 = 5",
        sampleInput: "20\n4\n/",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        char op = scanner.next().charAt(0);

        // TODO: выполни расчет через switch (op)
    }
}
`,
        tests: [
          { label: "20, 4, /", stdin: "20\n4\n/\n", expected: ["Результат: 20 / 4 = 5|20 / 4 = 5|= 5|5"] },
          { label: "15, 7, +", stdin: "15\n7\n+\n", expected: ["Результат: 15 + 7 = 22|15 + 7 = 22|= 22|22"] },
          { label: "9, 6, *", stdin: "9\n6\n*\n", expected: ["Результат: 9 * 6 = 54|9 * 6 = 54|= 54|54"] },
        ],
        requiredCode: [{ pattern: "switch\\s*\\(", message: "Используй switch" }],
        hints: ["`case '+': res = a + b; break;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        char op = scanner.next().charAt(0);

        int res = 0;
        switch (op) {
            case '+': res = a + b; break;
            case '-': res = a - b; break;
            case '*': res = a * b; break;
            case '/': res = a / b; break;
        }

        System.out.println("Результат: " + a + " " + op + " " + b + " = " + res);
    }
}
`,
      },
      {
        id: "d12_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Диспетчер терминальных команд)",
        shortDesc: "Строковый switch для команд start, stop, restart, status",
        difficulty: "Средний",
        xp: 40,
        description:
          "Программа считывает текстовую команду сервера `command` (строка: `start`, `stop`, `restart`, `status`).\nС помощью строкового оператора `switch` сопоставь действие:\n- `\"start\"`: `\"Сервер запущен на порту 8080\"`\n- `\"stop\"`: `\"Сервер успешно остановлен\"`\n- `\"restart\"`: `\"Выполняется перезагрузка служб...\"`\n- `\"status\"`: `\"Статус: 0 ошибок, аптайм 99.9%\"`\n- `default`: `\"Неизвестная команда! Введите help\"`\nВыведи:\n`Команда: <command>`\n`Ответ: <ответ_сервера>`",
        requirements: [
          "Используй `switch (command)` для работы со строками `String`.",
          "Выведи 2 строки.",
        ],
        exampleInput: "start",
        exampleOutput: "Команда: start\nОтвет: Сервер запущен на порту 8080",
        sampleInput: "start",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String command = scanner.nextLine();

        // TODO: обработай команду с помощью switch (command)
    }
}
`,
        tests: [
          {
            label: "Команда start",
            stdin: "start\n",
            expected: [
              "Команда: start",
              "Ответ: Сервер запущен на порту 8080",
            ],
          },
          {
            label: "Команда restart",
            stdin: "restart\n",
            expected: [
              "Команда: restart",
              "Ответ: Выполняется перезагрузка служб...",
            ],
          },
          {
            label: "Неизвестная команда",
            stdin: "killall\n",
            expected: [
              "Команда: killall",
              "Ответ: Неизвестная команда! Введите help",
            ],
          },
        ],
        requiredCode: [{ pattern: "switch\\s*\\(", message: "Используй switch" }],
        hints: ["`case \"start\": response = \"...\"; break;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String command = scanner.nextLine();

        String response;
        switch (command) {
            case "start":
                response = "Сервер запущен на порту 8080";
                break;
            case "stop":
                response = "Сервер успешно остановлен";
                break;
            case "restart":
                response = "Выполняется перезагрузка служб...";
                break;
            case "status":
                response = "Статус: 0 ошибок, аптайм 99.9%";
                break;
            default:
                response = "Неизвестная команда! Введите help";
                break;
        }

        System.out.println("Команда: " + command);
        System.out.println("Ответ: " + response);
    }
}
`,
      },
    ],
  }),
];
