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
      { type: "h", text: "Зачем нужны циклы и как устроен while" },
      {
        type: "p",
        text: "Циклы позволяют повторять блок инструкций десятки, миллионы раз или до тех пор, пока не наступит нужное событие (например, пользователь не введёт верный пароль или не закончатся цифры числа). Цикл `while` (с **предусловием**) сначала проверяет условие в скобках, и только если оно `true`, выполняет очередную **итерацию**.",
      },
      {
        type: "code",
        caption: "Три кита цикла while: Старт -> Условие -> Шаг",
        code: `int power = 1;                  // 1. Начальное состояние ДО цикла
while (power <= 16) {           // 2. Условие продолжения
    System.out.println(power);  // Полезная работа: 1, 2, 4, 8, 16
    power *= 2;                 // 3. Обязательное изменение к завершению!
}`,
      },
      { type: "h", text: "Цикл do-while (с постусловием)" },
      {
        type: "p",
        text: "Если обычное условие `while` ложно с самого начала, тело цикла не выполнится ни разу. Цикл `do { ... } while (условие);` сначала один раз выполняет тело, и **только в конце** проверяет условие. Это идеально подходит для интерактивного ввода, проверки пароля или угадывания числа — ведь первую попытку пользователь должен сделать в любом случае!",
      },
      {
        type: "code",
        caption: "Паттерн ввода до правильного ответа на do-while",
        code: `int guess;
do {
    guess = scanner.nextInt();
    if (guess != 42) {
        System.out.println("Попытка: " + guess + " — не угадал!");
    }
} while (guess != 42); // Точка с запятой после while обязательна!`,
      },
      { type: "h", text: "Сравнение: когда выбрать while, а когда do-while" },
      {
        type: "list",
        items: [
          "**`while (условие)`** — когда цикл при невыполнении условия с самого начала **может не сработать ни разу** (например, обход цифр числа `n`, пока `n > 0`).",
          "**`do { ... } while (условие);`** — когда тело цикла **обязано выполниться хотя бы 1 раз** (чтение первой попытки пароля, показ главного меню игры).",
        ],
      },
      { type: "h", text: "Обработка цифр любого числа без преобразования в строку" },
      {
        type: "p",
        text: "Классическая алгоритмическая задача на собеседованиях: как найти сумму и количество цифр числа (например, `472`)? Мы не знаем длину числа заранее, но знаем условие завершения — пока `n > 0`, отрываем последнюю цифру остатком `n % 10` и отбрасываем её делением `n /= 10`.",
      },
      {
        type: "code",
        caption: "Алгоритм перебора цифр числа в цикле while",
        code: `int temp = n;
int sum = 0;
int digits = 0;
while (temp > 0) {
    sum += temp % 10; // Забираем последнюю цифру
    digits++;         // Увеличиваем счётчик цифр
    temp /= 10;       // Отрезаем последнюю цифру (472 -> 47 -> 4 -> 0)
}`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Бесконечный цикл и случай нуля",
        text: "1. Если забыть шаг изменения переменной внутри `while` (например, забыть `n /= 10` или `power *= 2`), условие останется вечно истинным и программа зависнет по таймауту.\n2. При разборе цифр числа `0` цикл `while (temp > 0)` не запустится ни разу — случай `n == 0` удобно обработать отдельно (в числе 0 ровно 1 цифра).",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями дня",
        text: "Задание 1: постройте геометрический `while` с удвоением `val *= 2`. Задание 2: считайте попытки внутри `do { ... } while (guess != 42);`. Задание 3: примените схему `% 10` и `/= 10` внутри `while` для подсчёта количества и суммы цифр числа.",
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
          "С помощью цикла `while` выведи последовательность всех степеней двойки от 1 до 1024 включительно (1, 2, 4, 8, ...).\nВывод должен начинаться с `Степень: 1` и заканчиваться `Степень: 1024`.",
        requirements: [
          "Используй цикл `while`.",
          "Выведи все степени двойки от 1 до 1024.",
        ],
        exampleOutput: "Степень: 1\nСтепень: 2\n...\nСтепень: 1024",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // С помощью цикла while выведи степени двойки от 1 до 1024
        
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
        hints: [
          "Начни со значения 1. На каждой итерации выводи текущее значение и удваивай его (умножай на 2), пока оно не превысит 1024.",
        ],
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
          "Программа считывает положительное целое число со стандартного входа.\nС помощью математических операций отделения последней цифры числа найди:\n1) Общее количество цифр в числе\n2) Сумму всех его цифр\n\nВыведи:\n`Цифр в числе: <count>`\n`Сумма цифр: <sum>`",
        requirements: [
          "Используй цикл `while` и операции деления и остатка от деления.",
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

        // Посчитай количество и сумму цифр числа
        
    }
}
`,
        tests: [
          { label: "9874", stdin: "9874\n", expected: ["Цифр в числе: 4", "Сумма цифр: 28"] },
          { label: "123456", stdin: "123456\n", expected: ["Цифр в числе: 6", "Сумма цифр: 21"] },
        ],
        requiredCode: [{ pattern: "while\\s*\\(", message: "Используй цикл while" }],
        hints: [
          "Остаток от деления числа на 10 даёт его последнюю цифру, а целочисленное деление на 10 отбрасывает эту последнюю цифру.",
        ],
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
      { type: "h", text: "Что такое цикл for и чем он отличается от while" },
      {
        type: "p",
        text: "Если вы заранее знаете число повторений (вывести 10 строк таблицы умножения, обойти массив из `n` элементов, перебрать диапазон от 1 до 100), цикл `for` делает код компактнее и безопаснее: инициализация счётчика, условие продолжения и шаг изменения собраны в одной шапке — забыть про шаг `i++` практически невозможно.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: стрелки настенных часов (вложенные циклы)",
        text: "Представьте механические часы: внешний цикл — это **часовая стрелка**, а внутренний — **минутная**. Пока часовая стрелка сдвигается на 1 деление (`i++`), минутная стрелка (`j`) успевает сделать **полный круг** от 0 до 59!",
      },
      { type: "h", text: "Как работает цикл for по шагам и обратный отсчёт" },
      {
        type: "p",
        text: "Шаг в заголовке `for` может быть любым: `i++` (по +1), `i += 2` (только чётные), или `i--` (обратный отсчёт от `10` до `1`). Главное — чтобы шаг приближал переменную к границе условия завершения.",
      },
      {
        type: "code",
        caption: "Порядок выполнения частей заголовка for",
        code: `for (int i = 1; i <= 10; i++) {
    // 1) int i = 1     — выполняется ОДИН раз перед стартом
    // 2) i <= 10       — проверяется ПЕРЕД каждой итерацией
    // 3) тело { ... }  — выполняется, если условие true
    // 4) i++           — шаг ПОСЛЕ тела перед следующей проверкой
    System.out.println(n + " x " + i + " = " + (n * i));
}`,
      },
      { type: "h", text: "Вложенные циклы (Nested Loops): строки и столбцы" },
      {
        type: "p",
        text: "Вложенный цикл — это цикл, находящийся внутри тела другого цикла. **Золотое правило вложенных циклов:** на каждый **один** шаг внешнего цикла (`i`, номер строки) внутренний цикл (`j`, номер столбца) успевает пробежать **от начала до конца**! Так в программировании строятся таблицы, матрицы и двумерная графика.",
      },
      {
        type: "table",
        head: ["Конструкция", "Роль в двумерном выводе", "Важный приём печати"],
        rows: [
          ["Внешний `for (int i = 1; i <= n; i++)`", "Отвечает за номер **строки** сверху вниз", "В конце тела (после внутреннего цикла) вызывает `System.out.println();` для перехода на новую строку!"],
          ["Внутренний `for (int j = 1; j <= ...; j++)`", "Печатает ячейки внутри текущей строки слева направо", "Использует `System.out.print(...)` (без `ln`), чтобы не рвать строку!"],
        ],
      },
      {
        type: "code",
        caption: "Прямоугольная сетка vs Треугольник (зависимость j от i)",
        code: `// 1. Полная сетка N x N (таблица умножения): j идёт от 1 до N
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= n; j++) {
        System.out.print((i * j) + "\\t"); // Печатаем в строку с табуляцией
    }
    System.out.println(); // Переходим на новую строку после завершения ряда!
}

// 2. Прямоугольный треугольник: в строке i ровно i символов (j <= i)!
for (int i = 1; i <= height; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("*");
    }
    System.out.println();
}`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Разные имена счётчиков i и j!",
        text: "Никогда не используйте одну и ту же переменную `i` во внешнем и во внутреннем цикле (`for (int i ... ) { for (int i ...) }`) — компилятор выдаст ошибку `variable i is already defined in method`. Стандарт в Java: `i`, `j`, `k` (или `row`, `col`).",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями дня",
        text: "Задание 1: одиночный `for` от `1` до `10`. Задание 2: вложенный `for` `1..n` × `1..n`, разделяйте числа внутри строки через `\\t` (и `print`), а в конце строки переходите на новую через `println()`. Задание 3: ограничьте внутренний цикл текущим номером строки (`j <= i`), чтобы формировать треугольник из `*`.",
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
        requiredCode: [{ pattern: "(\\\\t|\\t|printf)", message: "Используй табуляцию \\t" }],
        hints: ["Внутренний цикл: `System.out.print((i * j) + \"\\t\");`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                System.out.print((i * j) + "\\t");
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
      { type: "h", text: "Зачем управлять ходом цикла вручную: break и continue" },
      {
        type: "p",
        text: "Часто цикл должен закончиться раньше запланированного (например, вы искали первое подходящее число и уже нашли его — нет смысла крутить цикл дальше) или пропустить неподходящий элемент (отфильтровать брак, отрицательные суммы или числа, кратные 3). Для этого служат два оператора: `break` и `continue`.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: аварийный стоп-кран vs переключение телеканала",
        text: "**`break`** — это стоп-кран в поезде: состав останавливается полностью, и поездка заканчивается. **`continue`** — это кнопка «следующий канал» на пульте: вы не выключаете телевизор, а просто моментально перескакиваете к следующей передаче (итерации).",
      },
      { type: "h", text: "Отказ от глубокой вложенности (Guard Clause в циклах)" },
      {
        type: "p",
        text: "Вместо того чтобы оборачивать длинное тело цикла в гигантский `if (...) { ... }`, опытные разработчики ставят фильтр в самом начале итерации: `if (!valid) continue;`. Код остаётся плоским и легко читается.",
      },
      {
        type: "table",
        head: ["Оператор", "Что делает", "Частое применение"],
        rows: [
          ["`break`", "Немедленно **выходит** из ближайшего цикла и идёт дальше по программе", "Остановка поиска при первом найденном элементе или выход из меню `while (true)` по команде `0`"],
          ["`continue`", "**Пропускает** хвост текущей итерации и прыгает к следующему шагу цикла", "Фильтрация ненужных значений (`if (i % 3 == 0) continue;`) без глубокой вложенности `if-else`"],
        ],
      },
      {
        type: "code",
        caption: "Досрочный поиск с break и фильтрация с continue",
        code: `// 1. Поиск ПЕРВОГО числа в диапазоне — остановимся сразу через break:
for (int i = 100; i <= 1000; i++) {
    if (i % 7 == 0 && i % 11 == 0) {
        System.out.println("Найдено: " + i);
        break; // Без break нашли бы ВСЕ кратные числа до 1000!
    }
}

// 2. Фильтрация: пропускаем всё, что кратно 3:
for (int i = 1; i <= 10; i++) {
    if (i % 3 == 0) continue; // Сразу переходим к i++
    System.out.println("Число: " + i);
}`,
      },
      { type: "h", text: "Бесконечный событийный цикл while (true) + break" },
      {
        type: "p",
        text: "Все консольные меню, серверные обработчики и игровые циклы устроены по единой схеме: они запускаются в бесконечном цикле `while (true)`, внутри считывают команду пользователя через `Scanner` / `switch`, а при получении команды выхода (например, `0` или `\"exit\"`) вызывают `break;`.",
      },
      {
        type: "code",
        caption: "Каркас интерактивного терминального меню",
        code: `while (true) {
    int cmd = scanner.nextInt();
    if (cmd == 0) {
        System.out.println("Сессия завершена");
        break; // Выход из вечного цикла
    }
    // Обработка остальных команд (1, 2, default...)
}`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Ловушка continue внутри цикла while",
        text: "В цикле `for` `continue` сам переходит к шагу `i++`. Но в цикле `while` `continue` перепрыгивает сразу к проверке условия! Если шаг `i++` стоял **после** `continue`, вы получите бесконечный цикл. В `while` всегда обновляйте счётчик **до** `continue`!",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями дня",
        text: "Задание 1: найдите первое число, кратное 7 и 11, и остановите цикл через `break`. Задание 2: пропустите кратные 3 через `continue`. Задание 3: реализуйте меню банкомата внутри `while (true)` с выходом по `break` при вводе `0`.",
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
          { label: "Поиск числа", expected: ["Найдено число: 154|154"] },
        ],
        requiredCode: [{ pattern: "\\bbreak\\b", message: "Используй оператор break;" }],
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
        requiredCode: [{ pattern: "\\bcontinue\\b", message: "Используй continue;" }],
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
      { type: "h", text: "Зачем нужны массивы: от одиночных переменных к коллекциям данных" },
      {
        type: "p",
        text: "Если у вас в магазине 3 товара, ещё можно завести `price1, price2, price3`. Но если товаров 10 000, нужны **массивы**. **Массив (Array)** — это объект в куче памяти (Heap), представляющий собой непрерывную цепочку пронумерованных ячеек одного типа фиксированной длины.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: пронумерованный ряд камер хранения на вокзале",
        text: "Представьте 10 шкафчиков, сваренных в один блок: они стоят в памяти **вплотную друг за другом**, поэтому к любому шкафчику `arr[5]` Java прыгает мгновенно за $O(1)$, но приварить к блоку 11-й шкафчик уже нельзя — для нового размера создают новый массив.",
      },
      { type: "h", text: "Значения по умолчанию после new int[n]" },
      {
        type: "p",
        text: "Как только вы выделили массив через `new int[5]`, Java автоматически обнуляет всю выделенную память: числа получают `0` (`double` — `0.0`), `boolean` — `false`, а ссылки вроде `String[]` — `null`. Это гарантирует отсутствие случайного «мусора» в ячейках.",
      },
      { type: "h", text: "Создание массива и нулевая индексация" },
      {
        type: "p",
        text: "Нумерация (индексы) в Java **всегда начинается с `0`**. Поэтому первый элемент — это `arr[0]`, а последний — `arr[arr.length - 1]`. Свойство `.length` у массива пишется **без круглых скобок** (в отличие от `.length()` у `String`!).",
      },
      {
        type: "code",
        caption: "Два способа создания массива и считывание с клавиатуры",
        code: `// 1. С готовыми значениями:
int[] scores = {10, 20, 30, 40, 50};
System.out.println("Длина: " + scores.length); // 5 (индексы 0..4)

// 2. Динамический размер n из Scanner (по умолчанию все ячейки равны 0):
int n = scanner.nextInt();
int[] arr = new int[n];
for (int i = 0; i < arr.length; i++) {
    arr[i] = scanner.nextInt();
}`,
      },
      { type: "h", text: "Три базовых алгоритма с индексами массива" },
      {
        type: "table",
        head: ["Задача", "Как написать цикл", "На что обратить внимание"],
        rows: [
          ["**Обратный вывод**", "`for (int i = arr.length - 1; i >= 0; i--)`", "Старт именно с `length - 1`, а условие `i >= 0` (включая нулевой индекс!)"],
          ["**Поиск Min и Max**", "`int min = arr[0]; int max = arr[0];` затем цикл с `i = 1`", "**Не ставьте `min = 0`!** Если в массиве все числа больше 0 (или все отрицательные), ответ будет неверным!"],
          ["**Линейный поиск**", "`int foundIdx = -1;` внутри `if (arr[i] == target) { foundIdx = i; break; }`", "Инициализация `-1` означает «не найдено»; `break` гарантирует индекс **первого** вхождения"],
        ],
      },
      {
        type: "code",
        caption: "Правильный поиск минимума, максимума и среднего значения",
        code: `int min = arr[0], max = arr[0];
long sum = 0;
for (int i = 0; i < arr.length; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
    sum += arr[i];
}
double avg = (double) sum / arr.length; // Каст в double обязателен!`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "ArrayIndexOutOfBoundsException — выход за границы",
        text: "Обращение к `arr[arr.length]` или `arr[-1]` мгновенно «уронит» программу с `ArrayIndexOutOfBoundsException`. Всегда проверяйте строгое условие `< arr.length`!",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями дня",
        text: "Задание 1: прямой обход `0 .. length-1` и обратный `length-1 .. 0`. Задание 2: считайте `n` чисел в `new int[n]`, инициализируйте `min` и `max` первым элементом `arr[0]` и вычислите дробное среднее. Задание 3: примените линейный поиск с начальным индексом `-1` и выходом по `break`.",
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
          "Создай массив из 5 целых чисел: `{10, 20, 30, 40, 50}`.\n1) Напечатай `Длина: <length>`\n2) В цикле выведи элементы в прямом порядке через пробел: `Прямой: 10 20 30 40 50`\n3) В обратном цикле `for (int i = arr.length - 1; i >= 0; i--)` выведи: `Обратный: 50 40 30 20 10`",
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
              "Прямой: 10 20 30 40 50|10, 20, 30, 40, 50|10 20 30 40 50",
              "Обратный: 50 40 30 20 10|50, 40, 30, 20, 10|50 40 30 20 10",
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
      { type: "h", text: "Улучшенный цикл for-each: синтаксис и назначение" },
      {
        type: "p",
        text: "Когда вам нужно просто прочитать **каждый** элемент массива подряд слева направо и не требуется сам номер индекса `i` (например, чтобы посчитать сумму чисел или отфильтровать короткие слова), в Java используют **for-each**. Он читается почти по-английски: «для каждого элемента `item` из коллекции `items`».",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: просмотр писем на конвейерной ленте",
        text: "Цикл `for-each` даёт вам в руки очередное письмо (значение элемента), вы можете его прочитать и прибавить к сумме, но вы не знаете номер полки, с которой оно взято, и не можете заменить исходник в коробке, переписав локальную копию.",
      },
      { type: "h", text: "Сравнение: классический for-i против for-each" },
      {
        type: "list",
        items: [
          "Нужно только **прочитать** все элементы подряд (сумма, поиск, фильтрация) → используйте чистый `for (T x : arr)` (меньше шансов ошибиться с `< length`).",
          "Нужен **индекс**, обратный обход или **перезапись** `arr[i] = ...` → берите классический `for (int i = 0; i < arr.length; i++)`.",
        ],
      },
      {
        type: "code",
        caption: "Примеры for-each для чисел и строк",
        code: `int[] numbers = {15, 25, 35, 45, 55};
int sum = 0;
for (int num : numbers) {
    sum += num; // На каждом шаге num — копия очередного числа
}

String[] words = {"Java", "Backend", "API"};
for (String w : words) {
    if (w.length() < 5) {
        System.out.println("Короткое слово: " + w);
    }
}`,
      },
      { type: "h", text: "Когда for-each использовать НЕЛЬЗЯ" },
      {
        type: "callout",
        variant: "warning",
        title: "Ограничение цикла for-each",
        text: "1. Переменная внутри `for (int x : arr)` — это **копия элемента**! Запись `x = 100;` внутри цикла **НЕ изменит** сам массив `arr`.\n2. В `for-each` нет доступа к индексу `i`, нельзя идти задом наперёд и нельзя перебирать сразу два массива параллельно — для этого нужен классический `for (int i = 0; ...)`.",
      },
      { type: "h", text: "Швейцарский нож работы с массивами: java.util.Arrays" },
      {
        type: "p",
        text: "Если вывести массив напрямую (`System.out.println(arr)`), Java напечатает непонятный адрес памяти вроде `[I@4617c264`. Чтобы не писать каждый раз циклы для сортировки или красивой печати, в стандартной библиотеке `java.util.Arrays` есть готовые статические методы:",
      },
      {
        type: "table",
        head: ["Метод из `java.util.Arrays`", "Что делает", "Пример"],
        rows: [
          ["`Arrays.toString(arr)`", "Превращает 1D массив в красивую строку вида `[1, 2, 3]`", "`System.out.println(Arrays.toString(arr));`"],
          ["`Arrays.sort(arr)`", "Сортирует массив по возрастанию прямо на месте (Dual-Pivot Quicksort)", "`Arrays.sort(arr);` (ничего не возвращает!)"],
          ["`Arrays.equals(a, b)`", "Сравнивает два массива по содержимому (так как `a == b` сравнивает ссылки!)", "`boolean eq = Arrays.equals(a, b);`"],
          ["`Arrays.binarySearch(arr, k)`", "Быстрый бинарный поиск $O(\\log N)$ в **уже отсортированном** массиве", "`int idx = Arrays.binarySearch(arr, 10);`"],
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями дня",
        text: "Задание 1: посчитайте сумму массива через `for (int n : numbers)`. Задание 2: импортируйте `java.util.Arrays`, отсортируйте считанный массив через `Arrays.sort(arr)` и красиво распечатайте через `Arrays.toString(arr)`. Задание 3: переберите массив слов через `for (String w : words)` и отфильтруйте по `w.length()`.",
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
      { type: "h", text: "Что такое двумерный массив (матрица) и как он устроен в памяти" },
      {
        type: "p",
        text: "Для хранения таблиц, игровых полей (крестики-нолики, шахматы, сапёр), карт уровней и пикселей изображений используют **двумерные массивы** `int[][]`. В Java матрица — это «массив массивов»: внешний массив хранит ссылки на одномерные массивы-строки.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: таблица Excel или театральный зал",
        text: "Любое место в зале задаётся парой чисел: **ряд** (`row`, первый индекс) и **кресло** (`col`, второй индекс). Сначала вы находите нужный ряд `matrix[row]`, а затем конкретное кресло внутри этого ряда `matrix[row][col]`.",
      },
      { type: "h", text: "Красивая печать матрицы: Arrays.deepToString()" },
      {
        type: "p",
        text: "Обычный `Arrays.toString(matrix)` распечатает только адреса строк-подмассивов (`[[I@..., [I@...]`). Для быстрой отладки двумерных и многомерных массивов используйте специальный метод **`Arrays.deepToString(matrix)`**, а в пользовательских отчётах — вложенный цикл `for`.",
      },
      {
        type: "code",
        caption: "Объявление, доступ и размеры матрицы",
        code: `// 1. Создание пустой матрицы 3x3 (все ячейки = 0):
int[][] matrix = new int[3][3];

// 2. Готовая таблица 2 строки x 3 столбца:
int[][] table = {
    {5, 10, 15},   // строка 0 (table[0])
    {20, 25, 30}   // строка 1 (table[1])
};

// Количество строк: table.length (2)
// Длина строки r (число столбцов): table[r].length (3)`,
      },
      { type: "h", text: "Вложенный обход и индексные правила диагоналей" },
      {
        type: "p",
        text: "Первый индекс `[i]` (или `[row]`) всегда выбирает **строку** (сверху вниз), а второй `[j]` (или `[col]`) — **столбец** (слева направо). Для квадратной матрицы размером $N \\times N$ легко выделить диагонали:",
      },
      {
        type: "list",
        items: [
          "**Главная диагональ** (от верхнего левого к правому нижнему углу): совпадают индексы **`row == col`** (`matrix[i][i] = 1`).",
          "**Побочная диагональ** (от правого верхнего к левому нижнему углу): сумма индексов **`row + col == N - 1`**.",
          "**Подсчёт суммы каждой строки:** переменную `int rowSum = 0;` нужно обнулять **внутри** внешнего цикла перед началом внутреннего цикла по столбцам!",
        ],
      },
      {
        type: "code",
        caption: "Подсчёт суммы по строкам и вывод матрицы",
        code: `int totalSum = 0;
for (int row = 0; row < table.length; row++) {
    int rowSum = 0; // Обнуляем перед КАЖДОЙ новой строкой!
    for (int col = 0; col < table[row].length; col++) {
        rowSum += table[row][col];
    }
    totalSum += rowSum;
    System.out.println("Строка " + row + ": сумма = " + rowSum);
}`,
      },
      { type: "h", text: "Игровые поля (char[][]): проверка выигрышных линий" },
      {
        type: "p",
        text: "Для поля крестиков-ноликов `char[3][3]` проверку выигрыша по горизонтали делают циклом по строкам `r = 0..2`: если `board[r][0] == 'X' && board[r][1] == 'X' && board[r][2] == 'X'`, то строка собрана целиком! Считать символы из `Scanner` удобно через `scanner.next().charAt(0)`.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями дня",
        text: "Задание 1 (Единичная матрица): установите `1` на главной диагонали (`i == j` или `matrix[i][i] = 1`). Задание 2: считайте локальный `rowSum` для каждой строки и общий `totalSum`. Задание 3: заполните `char[3][3]` введёнными символами и проверьте горизонтальные ряды в цикле.",
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
            stdin: "X X X\nO X O\nO O X\n",
            expected: ["Победа крестиков по горизонтали: ДА|ДА|Да|да|true"],
          },
          {
            label: "Нет победы в строках",
            stdin: "X O X\nO X O\nO X O\n",
            expected: ["Победа крестиков по горизонтали: НЕТ|НЕТ|Нет|нет|false"],
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
      { type: "h", text: "Почему классические алгоритмы на массивах спрашивают на каждом собеседовании?" },
      {
        type: "p",
        text: "Даже если в продакшене есть готовый `Arrays.sort()`, на собеседованиях проверяют, понимаете ли вы, как работать с памятью вручную с **дополнительной памятью $O(1)$** (in-place — без выделения новых массивов). Три главных алгоритма этого урока: обмен значений (**Swap**), **Два указателя**, **Циклический сдвиг** и **Bubble Sort**.",
      },
      { type: "h", text: "1. Алгоритм «Два указателя» (Two Pointers) и Swap" },
      {
        type: "p",
        text: "Чтобы развернуть массив на месте, ставим левый указатель `left = 0` на начало, а правый `right = arr.length - 1` на конец. Пока `left < right`, меняем их местами через временную переменную `temp` (как поменять воду и сок в двух стаканах с помощью третьего пустого стакана!) и сдвигаем указатели навстречу друг другу.",
      },
      {
        type: "code",
        caption: "In-place разворот массива двумя указателями (память O(1))",
        code: `int left = 0, right = arr.length - 1;
while (left < right) {
    int temp = arr[left]; // Запоминаем левое значение
    arr[left] = arr[right];
    arr[right] = temp;
    left++;
    right--;
}`,
      },
      { type: "h", text: "2. Циклический сдвиг элементов вправо на 1 позицию" },
      {
        type: "p",
        text: "Если начать копировать элементы слева направо (`arr[1] = arr[0]`, `arr[2] = arr[1]`...), вы затрёте весь массив первым элементом! **Секрет сдвига вправо:** сначала сохраните **последний** элемент `int last = arr[n - 1]`, затем сдвигайте элементы **справа налево** (`i` от `n - 1` вниз до `1`: `arr[i] = arr[i - 1]`), а в самом конце положите сохранённый `last` в `arr[0]`!",
      },
      {
        type: "code",
        caption: "Безопасный сдвиг вправо без затирания",
        code: `int last = arr[arr.length - 1];
for (int i = arr.length - 1; i > 0; i--) {
    arr[i] = arr[i - 1]; // Тянем слева направо, двигаясь с конца!
}
arr[0] = last;`,
      },
      { type: "h", text: "3. Пузырьковая сортировка (Bubble Sort)" },
      {
        type: "p",
        text: "Идея сортировки пузырьком со сложностью $O(N^2)$: проходим по массиву, сравниваем соседние пары `arr[j]` и `arr[j + 1]`. Если левый больше правого (`arr[j] > arr[j + 1]`), меняем их местами (и увеличиваем счётчик перестановок `swaps++`). После каждого полного прохода самый крупный элемент гарантированно «всплывает» в конец массива.",
      },
      {
        type: "code",
        caption: "Bubble Sort с подсчётом перестановок",
        code: `int swaps = 0;
for (int i = 0; i < arr.length - 1; i++) {
    for (int j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
            int temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            swaps++;
        }
    }
}`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями дня",
        text: "Задание 1: примените схему `left` / `right` с `temp`. Задание 2: сохраните `arr[length - 1]` и пройдите циклом от конца к началу `i > 0`. Задание 3: вложенные циклы Bubble Sort с условием `arr[j] > arr[j + 1]` и счётчиком `swaps`.",
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
              "Отсортировано: [1, 2, 3, 4, 5]|1, 2, 3, 4, 5|1 2 3 4 5",
              "Число перестановок: 10|10",
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
      { type: "h", text: "Архитектура спринта: хранение сущностей до изучения ООП" },
      {
        type: "p",
        text: "Пока мы не перешли к классам и объектам (ООП), связанные характеристики нескольких товаров можно хранить в **параллельных массивах**: элемент с одним и тем же индексом `i` во всех массивах описывает один и тот же товар (например, `items[0]` стоит `prices[0]` и на складе его `stock[0]` штук).",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: три бумажных журнала, синхронизированных по номеру строки",
        text: "В первом журнале записаны названия, во втором — цены, в третьем — остатки. Строка №2 в каждом журнале относится к одному и тому же товару (`Монитор`). Главное правило архитектора здесь — **не нарушить синхронизацию индексов**!",
      },
      { type: "h", text: "Почему финансовые итоги и капитализацию считают в long" },
      {
        type: "p",
        text: "Если цена товара равна `500_000`, а на складе лежит `10_000` штук, произведение `prices[i] * stock[i]` равно `5_000_000_000` — это больше максимума `int` (`2.14 млрд`), и обычный `int` **молча уйдёт в минус (переполнится)**! Приведение `(long) prices[i] * stock[i]` перед умножением полностью защищает складской отчёт от финансовых багов.",
      },
      { type: "h", text: "Пошаговый план реализации складского терминала" },
      {
        type: "list",
        items: [
          "Храните три массива одинаковой длины (`items.length == prices.length == stock.length`).",
          "Для пользовательского номера товара `itemNum` (с 1) переводите в индекс `idx = itemNum - 1` и проверяйте границы `idx >= 0 && idx < items.length`.",
          "Перед списанием всегда валидируйте количество: `qty > 0 && qty <= stock[idx]`.",
        ],
      },
      {
        type: "code",
        caption: "Схема параллельных массивов",
        code: `String[] items = {"Клавиатура", "Мышь", "Монитор"};
int[] prices   = {3500,         1800,   22000};
int[] stock    = {12,           25,     4};

// Всё под индексом i = 0 относится к Клавиатуре (3500 руб., 12 шт.)
for (int i = 0; i < items.length; i++) {
    System.out.println((i + 1) + ". " + items[i] + " — " + prices[i] + " руб.");
}`,
      },
      { type: "h", text: "Бизнес-логика списания остатков и валидация ввода" },
      {
        type: "list",
        items: [
          "**Перевод 1-based номера в 0-based индекс:** Пользователь выбирает товар `1, 2 или 3`, но в Java-массиве ему соответствует индекс `int idx = itemNum - 1;`.",
          "**Проверка остатка:** Перед списанием обязательно проверьте `if (qty > stock[idx])` — нельзя продать больше, чем есть на складе!",
          "**Транзакционное обновление:** Если товара достаточно, уменьшаем `stock[idx] -= qty` и вычисляем сумму заказа `qty * prices[idx]`.",
          "**Инвентаризация и капитализация:** Чтобы узнать ценность позиции в деньгах, умножаем `long itemValue = (long) prices[i] * stock[i]`, а для поиска самого ценного товара отслеживаем `maxVal` и запоминаем индекс `maxIdx = i`.",
        ],
      },
      {
        type: "code",
        caption: "Расчёт капитализации склада и поиск лидера по сумме",
        code: `long totalValue = 0;
long maxItemValue = -1;
String topItem = "";
for (int i = 0; i < items.length; i++) {
    long value = (long) prices[i] * stock[i];
    totalValue += value;
    if (value > maxItemValue) {
        maxItemValue = value;
        topItem = items[i];
    }
}`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями спринта",
        text: "В Задании 1 красиво отформатируйте прайс-лист из параллельных массивов. В Задании 2 отработайте индексацию `itemNum - 1`, проверку остатков `qty > stock[idx]` и обновление количества. В Задании 3 посчитайте стоимость каждой позиции, общую капитализацию и найдите самую дорогую позицию на складе.",
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
              "Каталог склада:|Каталог",
              "1. Клавиатура — 3500|Клавиатура - 3500|Клавиатура: 3500|3500",
              "2. Мышь — 1800|Мышь - 1800|Мышь: 1800|1800",
              "3. Монитор — 22000|Монитор - 22000|Монитор: 22000|22000",
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
              "Инвентаризация склада:|Инвентаризация",
              "Клавиатура: 42000|Клавиатура - 42000|42000",
              "Мышь: 45000|Мышь - 45000|45000",
              "Монитор: 88000|Монитор - 88000|88000",
              "Общая стоимость: 175000|стоимость склада: 175000|175000",
              "Лидер: Монитор|Лидер по стоимости: Монитор|Монитор",
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
