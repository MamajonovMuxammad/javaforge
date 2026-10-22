import type { Lesson, LessonTask } from "./types";

/** Helper to attach backward-compatible fields from task 1 */
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

export const module1Lessons: Lesson[] = [
  /* ------------------------------------------------------------------ */
  /*  DAY 1: Java Syntax & Output (Синтаксис и вывод)                   */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 1,
    moduleId: 1,
    title: "Java Syntax & Output: вывод текста, чисел и форматирование",
    short: "Синтаксис, System.out.println vs print, спецсимволы и точка с запятой",
    difficulty: "Лёгкий",
    duration: "~1.5 часа",
    xp: 100,
    ready: true,
    topics: [
      "Java Syntax: структура файла и правила именования",
      "System.out.println() vs System.out.print()",
      "Печать текста в кавычках и печать чисел",
      "Математические вычисления внутри println()",
      "Спецсимволы экранирования: \\n, \\t, \\\", \\\\",
      "Точка с запятой (;) и чувствительность к регистру",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java урок 1 установка JDK первая программа", note: "Первая программа и вывод на экран" },
      { author: "Заур Трегулов", query: "Заур Трегулов основы Java System out println", note: "Вывод текста и спецсимволы" },
    ],
    theory: [
      { type: "h", text: "Java Syntax: золотой стандарт структуры" },
      {
        type: "p",
        text: "В Java каждая строчка кода обязана находиться внутри **класса**. Имя публичного класса должно в точности совпадать с именем файла на диске: файл `Main.java` обязан содержать класс `public class Main`.",
      },
      {
        type: "code",
        caption: "Main.java — классический шаблон",
        code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`,
      },
      { type: "h", text: "Разбор примера (Example Explained)" },
      {
        type: "list",
        items: [
          "`public class Main`: `class` — ключевое слово, создающее класс. `Main` — имя класса, начинается с заглавной буквы.",
          "`public static void main(String[] args)`: главный метод (точка входа). С него JVM всегда начинает выполнение.",
          "`System.out.println(...)`: метод для вывода строки в консоль.",
          "`\"Hello World\"`: текст в двойных кавычках. Одинарные кавычки `'` для строк в Java использовать нельзя!",
          "`;` (точка с запятой): завершает инструкцию. Пропуск `;` приведёт к ошибке компиляции.",
        ],
      },
      { type: "h", text: "System.out.println() против System.out.print()" },
      {
        type: "p",
        text: "В Java есть два основных способа вывести текст в консоль:",
      },
      {
        type: "table",
        head: ["Метод", "Поведение", "Пример"],
        rows: [
          ["System.out.println()", "Печатает текст и переводит курсор на новую строку (Print Line)", "System.out.println(\"Привет\");"],
          ["System.out.print()", "Печатает текст, курсор остаётся на той же строке", "System.out.print(\"Привет, \");"],
        ],
      },
      {
        type: "code",
        caption: "Сравнение вывода",
        code: `System.out.print("Раз ");
System.out.print("Два ");
System.out.println("Три!"); // переведет строку
System.out.println("Четыре!");

// Вывод в консоли:
// Раз Два Три!
// Четыре!`,
      },
      { type: "h", text: "Печать чисел и математических выражений" },
      {
        type: "p",
        text: "Если передать в `println` число или выражение без кавычек, Java сначала вычислит результат и напечатает число:",
      },
      {
        type: "code",
        caption: "Числа vs Текст",
        code: `System.out.println(3 + 3);   // Выведет: 6 (число)
System.out.println("3 + 3"); // Выведет: 3 + 3 (текст)`,
      },
      { type: "h", text: "Спецсимволы экранирования (Escape Sequences)" },
      {
        type: "table",
        head: ["Символ", "Название", "Что делает"],
        rows: [
          ["\\n", "Newline", "Перенос строки"],
          ["\\t", "Tab", "Табуляция (отступ в 4 пробела)"],
          ["\\\"", "Double quote", "Печать двойной кавычки внутри строки"],
          ["\\\\", "Backslash", "Печать обратного слэша"],
        ],
      },
      {
        type: "code",
        caption: "Пример экранирования",
        code: `System.out.println("Книга \\"Чистый код\\"\\nАвтор:\\tРоберт Мартин");
// Выведет:
// Книга "Чистый код"
// Автор:    Роберт Мартин`,
      },
    ],
    tasks: [
      {
        id: "d1_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Визитка разработчика)",
        shortDesc: "Выведи визитку из 3 строк с точным текстом",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Напиши программу, которая выводит в консоль 3 строки:\n" +
          "1) `Разработчик: Java Junior`\n" +
          "2) `Стек: Java, Spring Boot, PostgreSQL`\n" +
          "3) `Цель: 2026 год`",
        requirements: [
          "Используй `System.out.println(...)` ровно 3 раза.",
          "Текст должен строго соответствовать условию задачи.",
        ],
        exampleOutput: "Разработчик: Java Junior\nСтек: Java, Spring Boot, PostgreSQL\nЦель: 2026 год",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // TODO: выведи 3 строки с помощью System.out.println
    }
}
`,
        tests: [
          {
            label: "Проверка 3 строк визитки",
            expected: [
              "Разработчик: Java Junior",
              "Стек: Java, Spring Boot, PostgreSQL",
              "Цель: 2026 год",
            ],
          },
        ],
        requiredCode: [
          { pattern: "System\\.out\\.println", message: "Используй System.out.println" },
        ],
        hints: [
          "Напиши: `System.out.println(\"Разработчик: Java Junior\");`",
          "Каждая команда должна заканчиваться точкой с запятой `;`.",
        ],
        solution: `public class Main {
    public static void main(String[] args) {
        System.out.println("Разработчик: Java Junior");
        System.out.println("Стек: Java, Spring Boot, PostgreSQL");
        System.out.println("Цель: 2026 год");
    }
}
`,
      },
      {
        id: "d1_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Приветствие и Scanner)",
        shortDesc: "Считывание имени и года рождения, расчет возраста",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа считывает **имя** пользователя (строка) и **год его рождения** (число).\n" +
          "Программа вычисляет возраст (`2026 - год`) и выводит:\n" +
          "1) `Привет, <имя>!`\n" +
          "2) `Тебе <возраст> лет` (или `Вам <возраст> лет`).",
        requirements: [
          "Используй `Scanner` для чтения данных из `System.in`.",
          "Сначала прочитай имя через `nextLine()`, затем год через `nextInt()`.",
          "Выведи приветствие и возраст.",
        ],
        exampleInput: "Мухаммад\n2008",
        exampleOutput: "Привет, Мухаммад!\nТебе 18 лет",
        sampleInput: "Мухаммад\n2008",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // TODO 1: прочитай имя через scanner.nextLine()
        // TODO 2: прочитай год рождения через scanner.nextInt()
        // TODO 3: посчитай возраст (2026 - год) и выведи результат
    }
}
`,
        tests: [
          {
            label: "Тест 1: Мухаммад, 2008",
            stdin: "Мухаммад\n2008\n",
            expected: [
              "Привет, Мухаммад!|Привет, Мухаммад|Привет Мухаммад",
              "Тебе 18|Вам 18|будет 18|возраст 18|возраст: 18|18 лет|18",
            ],
          },
          {
            label: "Тест 2: Ибрагим, 2005",
            stdin: "Ибрагим\n2005\n",
            expected: [
              "Привет, Ибрагим!|Привет, Ибрагим|Привет Ибрагим",
              "Тебе 21|Вам 21|будет 21|возраст 21|возраст: 21|21 год|21 лет|21",
            ],
          },
          {
            label: "Тест 3: Алекс, 2000",
            stdin: "Алекс\n2000\n",
            expected: [
              "Привет, Алекс!|Привет, Алекс|Привет Алекс",
              "Тебе 26|Вам 26|будет 26|возраст 26|возраст: 26|26 лет|26",
            ],
          },
        ],
        requiredCode: [
          { pattern: "new\\s+Scanner\\s*\\(\\s*System\\.in\\s*\\)", message: "Создай объект Scanner: new Scanner(System.in)" },
        ],
        hints: [
          "`String name = scanner.nextLine();`",
          "`int birthYear = scanner.nextInt();`",
          "`int age = 2026 - birthYear;`",
        ],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String name = scanner.nextLine();
        int birthYear = scanner.nextInt();

        int age = 2026 - birthYear;

        System.out.println("Привет, " + name + "!");
        System.out.println("Тебе " + age + " лет");
    }
}
`,
      },
      {
        id: "d1_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Калькулятор нагрузки студента)",
        shortDesc: "Комплексный ввод данных и расчет часов практики за год",
        difficulty: "Средний",
        xp: 40,
        description:
          "Напиши программу для расчета учебной нагрузки студента на курсе Java. Программа считывает:\n" +
          "1) Имя студента (строка)\n" +
          "2) Часов практики в день (целое число hoursPerDay)\n" +
          "3) Дней учебы в неделю (целое число daysPerWeek)\n" +
          "Программа вычисляет часы практики за неделю (`hoursPerDay * daysPerWeek`) и за год из 52 недель (`weekly * 52`), а затем выводит результат.",
        requirements: [
          "Используй `Scanner` для считывания 3 значений.",
          "Первая строка вывода: `Студент: <имя>`",
          "Вторая строка вывода: `Часов в неделю: <часы>`",
          "Третья строка вывода: `Часов в год: <часы_в_год>`",
          "Четвертая строка вывода: `Готов к позиции Junior: да`",
        ],
        exampleInput: "Иван\n3\n5",
        exampleOutput: "Студент: Иван\nЧасов в неделю: 15\nЧасов в год: 780\nГотов к позиции Junior: да",
        sampleInput: "Иван\n3\n5",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // TODO: прочитай имя, часы в день и дни в неделю
        // TODO: произведи математический расчёт и выведи 4 строки
    }
}
`,
        tests: [
          {
            label: "Тест 1: Иван (3 ч/день, 5 дн/нед)",
            stdin: "Иван\n3\n5\n",
            expected: [
              "Студент: Иван",
              "Часов в неделю: 15",
              "Часов в год: 780",
              "Готов к позиции Junior: да|Готов к позиции Junior: Да",
            ],
          },
          {
            label: "Тест 2: Алина (4 ч/день, 6 дн/нед)",
            stdin: "Алина\n4\n6\n",
            expected: [
              "Студент: Алина",
              "Часов в неделю: 24",
              "Часов в год: 1248",
              "Готов к позиции Junior: да|Готов к позиции Junior: Да",
            ],
          },
        ],
        requiredCode: [
          { pattern: "new\\s+Scanner\\s*\\(\\s*System\\.in\\s*\\)", message: "Используй Scanner" },
          { pattern: "\\*\\s*52|52\\s*\\*", message: "Умножь недельные часы на 52 недели" },
        ],
        hints: [
          "Сначала `String name = scanner.nextLine();`",
          "Затем `int hours = scanner.nextInt();` и `int days = scanner.nextInt();`",
          "`int weekly = hours * days;` и `int yearly = weekly * 52;`",
        ],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String name = scanner.nextLine();
        int hoursPerDay = scanner.nextInt();
        int daysPerWeek = scanner.nextInt();

        int weekly = hoursPerDay * daysPerWeek;
        int yearly = weekly * 52;

        System.out.println("Студент: " + name);
        System.out.println("Часов в неделю: " + weekly);
        System.out.println("Часов в год: " + yearly);
        System.out.println("Готов к позиции Junior: да");
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 2: Java Comments & Clean Code (Комментарии)                   */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 2,
    moduleId: 1,
    title: "Java Comments: однострочные, многострочные и чистый код",
    short: "Синтаксис //, /* */, JavaDoc и правила комментирования",
    difficulty: "Лёгкий",
    duration: "~1 час",
    xp: 100,
    ready: true,
    topics: [
      "Зачем нужны комментарии в реальных проектах",
      "Однострочные комментарии //",
      "Многострочные комментарии /* ... */",
      "Документационные комментарии JavaDoc /** ... */",
      "Временное отключение кода при отладке",
      "Правила чистого кода: когда комментарии вредят",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java комментарии в коде", note: "Виды комментариев и их назначение" },
      { author: "Заур Трегулов", query: "Заур Трегулов комментарии в Java JavaDoc", note: "JavaDoc и оформление кода" },
    ],
    theory: [
      { type: "h", text: "Что такое комментарии в Java?" },
      {
        type: "p",
        text: "Комментарии — это поясняющий текст для людей (тебя и коллег-разработчиков). **Компилятор `javac` полностью игнорирует комментарии** и не включает их в результирующий байткод. Они не замедляют работу программы и не увеличивают размер `.class` файлов.",
      },
      {
        type: "code",
        caption: "3 типа комментариев в Java",
        code: `// 1. Однострочный комментарий: действует до конца текущей строки

/* 2. Многострочный комментарий:
   удобен для больших пояснений
   и временного отключения блоков кода */

/**
 * 3. JavaDoc комментарий:
 * используется для генерации официальной HTML-документации
 * к классам и методам.
 */`,
      },
      { type: "h", text: "Пример использования (W3Schools Example)" },
      {
        type: "code",
        caption: "Пример с однострочным и многострочным комментариями",
        code: `public class Main {
    public static void main(String[] args) {
        // Это однострочный комментарий перед выводом
        System.out.println("Hello World"); // комментарий в конце строки

        /* Этот блок кода
           временно выключен
        System.out.println("Не напечатается");
        */
    }
}`,
      },
      { type: "h", text: "Правила чистого кода: когда писать комментарии" },
      {
        type: "callout",
        variant: "tip",
        title: "Золотое правило Роберта Мартина (Clean Code)",
        text: "Хороший код документирует сам себя. Не пиши комментарии, объясняющие «что делает этот код» (это должно быть понятно из названий переменных). Пиши комментарии, объясняющие **«почему именно так сделано»** — неочевидные бизнес-правила, багфиксы или ссылки на задачи.",
      },
    ],
    tasks: [
      {
        id: "d2_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Очистка кода комментариями)",
        shortDesc: "Закомментируй ошибочные строки, чтобы программа скомпилировалась",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "В стартовом коде присутствуют ошибочные строки, ломающие сборку. Используй комментарии `//`, чтобы отключить сломанные строки, и оставь активными только те, которые печатают:\n`Java — строго типизированный язык!`\n`Код компилируется без ошибок.`",
        requirements: [
          "Используй `//` для отключения ошибочных строк.",
          "В выводе должно остаться ровно 2 указанные строки.",
        ],
        exampleOutput: "Java — строго типизированный язык!\nКод компилируется без ошибок.",
        starterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Java — строго типизированный язык!");
        System.out.println("Этот вывод содержит синтаксическую ошибку
        System.out.println("Код компилируется без ошибок.");
        BrokenCommandThatFailsCompilation();
    }
}
`,
        tests: [
          {
            label: "Корректный вывод после отключения ошибок",
            expected: [
              "Java — строго типизированный язык!",
              "Код компилируется без ошибок.",
            ],
          },
        ],
        hints: [
          "Поставь `//` в начале строки со сломанной кавычкой.",
          "Поставь `//` в начале строки `BrokenCommandThatFailsCompilation();`.",
        ],
        solution: `public class Main {
    public static void main(String[] args) {
        System.out.println("Java — строго типизированный язык!");
        // System.out.println("Этот вывод содержит синтаксическую ошибку
        System.out.println("Код компилируется без ошибок.");
        // BrokenCommandThatFailsCompilation();
    }
}
`,
      },
      {
        id: "d2_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Оформление с JavaDoc)",
        shortDesc: "Добавь JavaDoc спецификацию к программе расчёта скидки",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Оформи исходный код программы. Напиши многострочный JavaDoc-комментарий над методом `main` с описанием программы, а также добавь однострочные пояснения к ключевым этапам: расчёту скидки и выводу итоговой суммы. Программа должна выводить:\n`Товар: Ноутбук`\n`Цена: 50000`\n`Скидка: 5000`\n`К оплате: 45000`",
        requirements: [
          "Используй JavaDoc комментарий `/** ... */` над методом `main`.",
          "Используй однострочные комментарии `//` перед блоками логики.",
          "Выведи 4 строки с правильными суммами.",
        ],
        exampleOutput: "Товар: Ноутбук\nЦена: 50000\nСкидка: 5000\nК оплате: 45000",
        starterCode: `public class Main {
    // TODO: добавь JavaDoc комментарий к main
    public static void main(String[] args) {
        // TODO: добавь расчет и вывод
    }
}
`,
        tests: [
          {
            label: "Проверка вывода финансовой сводки",
            expected: [
              "Товар: Ноутбук",
              "Цена: 50000",
              "Скидка: 5000",
              "К оплате: 45000",
            ],
          },
        ],
        requiredCode: [
          { pattern: "/\\*\\*", message: "Добавь JavaDoc комментарий /** ... */" },
          { pattern: "//", message: "Используй однострочные комментарии //" },
        ],
        hints: [
          "Напиши `/** Программа расчета скидки */` над методом `main`.",
          "Выведи строки через `System.out.println`.",
        ],
        solution: `public class Main {
    /**
     * Точка входа в программу.
     * Рассчитывает скидку на товар и выводит чек.
     */
    public static void main(String[] args) {
        // Исходные данные
        int price = 50000;
        int discount = 5000;

        // Расчет итоговой цены
        int total = price - discount;

        // Вывод результатов
        System.out.println("Товар: Ноутбук");
        System.out.println("Цена: " + price);
        System.out.println("Скидка: " + discount);
        System.out.println("К оплате: " + total);
    }
}
`,
      },
      {
        id: "d2_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Архитектурный рефакторинг)",
        shortDesc: "Самодокументируемый код и очистка от мусорных комментариев",
        difficulty: "Средний",
        xp: 40,
        description:
          "Плохой код полон бесполезных комментариев вроде `// увеличиваем x на 1`. Замени непонятные однобуквенные переменные на осмысленные имена (`baseSalary`, `taxRatePercent`, `netSalary`), оставь только один ценный JavaDoc комментарий, и выведи чистый расчёт зарплаты:\n`Оклад: 120000`\n`Налог 13%: 15600`\n`На руки: 104400`",
        requirements: [
          "Имена переменных должны быть осмысленными (camelCase).",
          "Программа должна содержать аккуратный JavaDoc комментарий.",
          "Выведи 3 строки с правильным расчётом.",
        ],
        exampleOutput: "Оклад: 120000\nНалог 13%: 15600\nНа руки: 104400",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // плохие переменные:
        int a = 120000; // оклад
        int b = 15600;  // налог
        int c = a - b;  // итог
        System.out.println("Оклад: " + a);
        System.out.println("Налог 13%: " + b);
        System.out.println("На руки: " + c);
    }
}
`,
        tests: [
          {
            label: "Проверка расчета чистой зарплаты",
            expected: [
              "Оклад: 120000",
              "Налог 13%: 15600",
              "На руки: 104400",
            ],
          },
        ],
        hints: [
          "Переименуй переменные в `salary`, `tax`, `netSalary`.",
          "Добавь JavaDoc `/** Расчет зарплаты сотрудника */`.",
        ],
        solution: `public class Main {
    /**
     * Расчет заработной платы после вычета НДФЛ 13%.
     */
    public static void main(String[] args) {
        int grossSalary = 120000;
        int taxAmount = 15600;
        int netSalary = grossSalary - taxAmount;

        System.out.println("Оклад: " + grossSalary);
        System.out.println("Налог 13%: " + taxAmount);
        System.out.println("На руки: " + netSalary);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 3: Java Variables & final (Переменные и константы)            */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 3,
    moduleId: 1,
    title: "Java Variables: объявление, константы final и camelCase",
    short: "Объявление, инициализация, final константы, вывод переменных",
    difficulty: "Лёгкий",
    duration: "~1.5 часа",
    xp: 100,
    ready: true,
    topics: [
      "Что такое переменная: контейнер для значений в памяти",
      "Синтаксис: type variableName = value;",
      "Перезапись значений (reassignment)",
      "Константы: ключевое слово final",
      "Множественное объявление: int x = 5, y = 6, z = 50;",
      "Идентификаторы (Identifiers) и правила camelCase",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java переменные примитивные типы данных", note: "Объявление и типы переменных" },
      { author: "Заур Трегулов", query: "Заур Трегулов переменные final константы Java", note: "Константы и правила именования" },
    ],
    theory: [
      { type: "h", text: "Что такое переменная?" },
      {
        type: "p",
        text: "Переменная — это именованная ячейка в оперативной памяти компьютера (RAM), предназначенная для хранения данных. В Java переменная строго привязана к своему **типу данных**.",
      },
      {
        type: "code",
        caption: "Синтаксис создания переменной",
        code: `type variableName = value;

// Примеры:
String name = "Джон"; // строка текста
int age = 25;         // целое число
double weight = 72.5; // дробное число`,
      },
      { type: "h", text: "Объявление и перезапись значения" },
      {
        type: "code",
        caption: "Перезапись переменной",
        code: `int score = 10;
System.out.println(score); // 10

score = 25; // присваиваем новое значение (тип указывать повторно НЕЛЬЗЯ!)
System.out.println(score); // 25`,
      },
      { type: "h", text: "Константы: ключевое слово final" },
      {
        type: "p",
        text: "Если ты не хочешь, чтобы значение переменной могло быть случайно изменено в процессе работы программы, добавь ключевое слово `final`. Переменная станет **неизменяемой константой**:",
      },
      {
        type: "code",
        caption: "Неизменяемая константа final",
        code: `final int BIRTH_YEAR = 2000;
// BIRTH_YEAR = 2005; // Ошибка компиляции: cannot assign a value to final variable!`,
      },
      {
        type: "callout",
        variant: "tip",
        title: "Соглашение по именованию констант",
        text: "Обычные переменные в Java именуются в **camelCase** (`userAge`, `maxSpeed`), а `final` константы принято писать заглавными буквами со змейкой (**UPPER_SNAKE_CASE**): `MAX_RETRY_COUNT`, `PI`, `DEFAULT_TIMEOUT`.",
      },
      { type: "h", text: "Объявление нескольких переменных одновременно" },
      {
        type: "code",
        caption: "Несколько переменных в одной строке",
        code: `int x = 5, y = 6, z = 50;
System.out.println(x + y + z); // 61`,
      },
    ],
    tasks: [
      {
        id: "d3_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Профиль пользователя)",
        shortDesc: "Объяви переменные для профиля и выведи карточку",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай переменные:\n- `String username = \"Алексей\";`\n- `int level = 5;`\n- `int coins = 350;`\nВыведи в консоль карточку:\n`Игрок: Алексей`\n`Уровень: 5`\n`Баланс монет: 350`",
        requirements: [
          "Используй правильные типы данных: `String` и `int`.",
          "Выведи 3 строки с объединением текста и переменных через `+`.",
        ],
        exampleOutput: "Игрок: Алексей\nУровень: 5\nБаланс монет: 350",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // TODO: объяви переменные username, level, coins и выведи карточку
    }
}
`,
        tests: [
          {
            label: "Проверка карточки игрока",
            expected: [
              "Игрок: Алексей",
              "Уровень: 5",
              "Баланс монет: 350",
            ],
          },
        ],
        requiredCode: [
          { pattern: "String\\s+username", message: "Объяви переменную String username" },
          { pattern: "int\\s+level", message: "Объяви переменную int level" },
          { pattern: "int\\s+coins", message: "Объяви переменную int coins" },
        ],
        hints: ["`System.out.println(\"Игрок: \" + username);`"],
        solution: `public class Main {
    public static void main(String[] args) {
        String username = "Алексей";
        int level = 5;
        int coins = 350;

        System.out.println("Игрок: " + username);
        System.out.println("Уровень: " + level);
        System.out.println("Баланс монет: " + coins);
    }
}
`,
      },
      {
        id: "d3_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Конвертер валют и final)",
        shortDesc: "Используй final константу для курса валюты",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Объяви неизменяемую константу курса доллара: `final int USD_RATE = 95;`.\nОбъяви переменную суммы в долларах: `int dollars = 400;`.\nВычисли сумму в рублях (`dollars * USD_RATE`) и выведи:\n`Курс USD: 95 руб.`\n`Сумма в USD: 400 $`\n`Итого в рублях: 38000 руб.`",
        requirements: [
          "Используй ключевое слово `final` для переменной `USD_RATE`.",
          "Выведи 3 строки строго по условию.",
        ],
        exampleOutput: "Курс USD: 95 руб.\nСумма в USD: 400 $\nИтого в рублях: 38000 руб.",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // TODO: объяви final int USD_RATE = 95;
        // TODO: рассчитай и выведи результат
    }
}
`,
        tests: [
          {
            label: "Проверка конвертации валют",
            expected: [
              "Курс USD: 95 руб.",
              "Сумма в USD: 400 $",
              "Итого в рублях: 38000 руб.",
            ],
          },
        ],
        requiredCode: [
          { pattern: "final\\s+int\\s+USD_RATE", message: "Объяви константу final int USD_RATE" },
        ],
        hints: ["`int rubles = dollars * USD_RATE;`"],
        solution: `public class Main {
    public static void main(String[] args) {
        final int USD_RATE = 95;
        int dollars = 400;
        int rubles = dollars * USD_RATE;

        System.out.println("Курс USD: " + USD_RATE + " руб.");
        System.out.println("Сумма в USD: " + dollars + " $");
        System.out.println("Итого в рублях: " + rubles + " руб.");
    }
}
`,
      },
      {
        id: "d3_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Бортовой компьютер шаттла)",
        shortDesc: "Множественное объявление и расчет остатка топлива",
        difficulty: "Средний",
        xp: 40,
        description:
          "Объяви в одну строку начальные параметры шаттла: `int fuel = 1500, consumptionPerHour = 120, flightHours = 8;`.\nВычисли расход за полет (`consumptionPerHour * flightHours`) и остаток топлива (`fuel - расход`).\nВыведи отчет:\n`Запас топлива: 1500 л`\n`Расход за полет: 960 л`\n`Остаток топлива: 540 л`\n`Статус: посадка разрешена`",
        requirements: [
          "Объяви `fuel`, `consumptionPerHour`, `flightHours` в одну строку через запятую.",
          "Выведи 4 строки с правильными вычислениями.",
        ],
        exampleOutput: "Запас топлива: 1500 л\nРасход за полет: 960 л\nОстаток топлива: 540 л\nСтатус: посадка разрешена",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // TODO: объяви переменные в одну строку и рассчитай остаток топлива
    }
}
`,
        tests: [
          {
            label: "Проверка телеметрии шаттла",
            expected: [
              "Запас топлива: 1500 л",
              "Расход за полет: 960 л",
              "Остаток топлива: 540 л",
              "Статус: посадка разрешена",
            ],
          },
        ],
        requiredCode: [
          { pattern: "int\\s+fuel\\s*=\\s*1500\\s*,", message: "Объяви переменные через запятую: int fuel = 1500, ..." },
        ],
        hints: ["`int used = consumptionPerHour * flightHours;`"],
        solution: `public class Main {
    public static void main(String[] args) {
        int fuel = 1500, consumptionPerHour = 120, flightHours = 8;
        int used = consumptionPerHour * flightHours;
        int remaining = fuel - used;

        System.out.println("Запас топлива: " + fuel + " л");
        System.out.println("Расход за полет: " + used + " л");
        System.out.println("Остаток топлива: " + remaining + " л");
        System.out.println("Статус: посадка разрешена");
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 4: Java Data Types & Memory (Типы данных и память)            */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 4,
    moduleId: 1,
    title: "Java Data Types: 8 примитивов, память и диапазоны",
    short: "byte, short, int, long, float, double, boolean, char и Stack vs Heap",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "8 примитивных типов данных в Java",
      "Целочисленные: byte (1B), short (2B), int (4B), long (8B, суффикс L)",
      "Числа с плавающей точкой: float (4B, суффикс f) и double (8B)",
      "Символы: char (2B, одинарные кавычки ''), Unicode и ASCII",
      "Логический тип: boolean (true / false)",
      "Научная нотация чисел: 12e4d, 35e3f",
      "Примитивные типы vs Ссылочные (Non-Primitive)",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java примитивные типы данных", note: "Все 8 примитивов подробно" },
      { author: "Заур Трегулов", query: "Заур Трегулов типы данных память Stack Heap Java", note: "Память Stack и Heap" },
    ],
    theory: [
      { type: "h", text: "8 примитивных типов данных в Java" },
      {
        type: "p",
        text: "Типы данных в Java делятся на две большие категории: **Примитивные** (хранят простое значение прямо в стеке памяти) и **Ссылочные** (хранят адрес объекта в куче памяти — Heap).",
      },
      {
        type: "table",
        head: ["Тип", "Размер", "Диапазон значений", "Пример"],
        rows: [
          ["byte", "1 байт (8 бит)", "от -128 до 127", "byte b = 100;"],
          ["short", "2 байта (16 бит)", "от -32,768 до 32,767", "short s = 5000;"],
          ["int", "4 байта (32 бит)", "от -2 млрд до 2 млрд", "int i = 100000;"],
          ["long", "8 байт (64 бит)", "от -9 квинтиллионов до 9 квинтиллионов", "long l = 15000000000L; (суффикс L)"],
          ["float", "4 байта", "6-7 знаков после запятой", "float f = 5.75f; (суффикс f)"],
          ["double", "8 байт", "15 знаков после запятой (стандарт)", "double d = 19.99;"],
          ["boolean", "1 бит", "true или false", "boolean isJavaFun = true;"],
          ["char", "2 байта", "один символ в одинарных кавычках", "char grade = 'A';"],
        ],
      },
      { type: "h", text: "Обязательные суффиксы: L и f" },
      {
        type: "callout",
        variant: "warning",
        title: "Не забудь про суффиксы!",
        text: "По умолчанию любое целое число в коде Java считается типом `int`, а любое дробное — типом `double`.\n- Для `long` обязательно указывать суффикс `L`: `long n = 9000000000L;`.\n- Для `float` обязательно указывать суффикс `f`: `float pi = 3.14f;`.",
      },
      { type: "h", text: "Символы char и таблица ASCII / Unicode" },
      {
        type: "p",
        text: "Символ `char` занимает 2 байта, так как Java использует кодировку Unicode (UTF-16). Символы можно задавать буквой в кавычках, либо числовым кодом:",
      },
      {
        type: "code",
        caption: "Символы char",
        code: `char letterA = 'A';
char letterByCode = 65; // в таблице ASCII код 65 — это заглавная буква 'A'
System.out.println(letterA);      // напечатает: A
System.out.println(letterByCode); // напечатает: A`,
      },
    ],
    tasks: [
      {
        id: "d4_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Сенсор умного дома)",
        shortDesc: "Объяви переменные правильных примитивных типов",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Объяви переменные для умного датчика климата:\n- `byte humidity = 45;` (влажность в %)\n- `double temperature = 23.4;` (температура)\n- `boolean heaterActive = true;` (статус нагревателя)\n- `char sensorClass = 'A';` (класс энергопотребления)\nВыведи показания:\n`Датчик класса: A`\n`Температура: 23.4 °C`\n`Влажность: 45 %`\n`Обогрев включен: true`",
        requirements: [
          "Используй типы `byte`, `double`, `boolean`, `char`.",
          "Выведи 4 строки с форматированием.",
        ],
        exampleOutput: "Датчик класса: A\nТемпература: 23.4 °C\nВлажность: 45 %\nОбогрев включен: true",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // TODO: объяви humidity, temperature, heaterActive, sensorClass
    }
}
`,
        tests: [
          {
            label: "Проверка показаний датчика",
            expected: [
              "Датчик класса: A",
              "Температура: 23.4 °C",
              "Влажность: 45 %",
              "Обогрев включен: true",
            ],
          },
        ],
        requiredCode: [
          { pattern: "byte\\s+humidity", message: "Используй тип byte для влажности" },
          { pattern: "double\\s+temperature", message: "Используй тип double для температуры" },
          { pattern: "boolean\\s+heaterActive", message: "Используй тип boolean для статуса" },
          { pattern: "char\\s+sensorClass", message: "Используй тип char для класса" },
        ],
        hints: ["`char sensorClass = 'A';` — одинарные кавычки!"],
        solution: `public class Main {
    public static void main(String[] args) {
        byte humidity = 45;
        double temperature = 23.4;
        boolean heaterActive = true;
        char sensorClass = 'A';

        System.out.println("Датчик класса: " + sensorClass);
        System.out.println("Температура: " + temperature + " °C");
        System.out.println("Влажность: " + humidity + " %");
        System.out.println("Обогрев включен: " + heaterActive);
    }
}
`,
      },
      {
        id: "d4_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Космический масштаб и long)",
        shortDesc: "Вычисления с большими числами long и суффиксом L",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Расстояние от Земли до Солнца составляет около 149 600 000 километров. Скорость света — 300 000 км/сек.\nОбъяви:\n`long distanceKm = 149600000L;`\n`long speedOfLight = 300000L;`\nВычисли время в секундах (`distanceKm / speedOfLight`) и выведи:\n`Дистанция: 149600000 км`\n`Скорость света: 300000 км/с`\n`Свет летит: 498 сек.`",
        requirements: [
          "Используй тип `long` и суффикс `L`.",
          "Выведи 3 строки с расчетом.",
        ],
        exampleOutput: "Дистанция: 149600000 км\nСкорость света: 300000 км/с\nСвет летит: 498 сек.",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // TODO: рассчитай время полета фотона
    }
}
`,
        tests: [
          {
            label: "Проверка расчета времени полета света",
            expected: [
              "Дистанция: 149600000 км",
              "Скорость света: 300000 км/с",
              "Свет летит: 498 сек.",
            ],
          },
        ],
        requiredCode: [
          { pattern: "long\\s+distanceKm", message: "Используй long для distanceKm" },
          { pattern: "L", message: "Используй суффикс L для больших чисел" },
        ],
        hints: ["`long timeSeconds = distanceKm / speedOfLight;`"],
        solution: `public class Main {
    public static void main(String[] args) {
        long distanceKm = 149600000L;
        long speedOfLight = 300000L;
        long timeSeconds = distanceKm / speedOfLight;

        System.out.println("Дистанция: " + distanceKm + " км");
        System.out.println("Скорость света: " + speedOfLight + " км/с");
        System.out.println("Свет летит: " + timeSeconds + " сек.");
    }
}
`,
      },
      {
        id: "d4_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Декодер символов ASCII)",
        shortDesc: "Символы char, их числовые коды и смещение",
        difficulty: "Средний",
        xp: 40,
        description:
          "В таблице ASCII буква 'A' имеет код 65, 'B' — 66, 'C' — 67.\nОбъяви `char letter = 65;`.\nОбъяви `char nextLetter = (char) (letter + 1);`.\nОбъяви `char thirdLetter = (char) (letter + 2);`.\nВыведи зашифрованный пароль:\n`Код 65: A`\n`Код 66: B`\n`Код 67: C`\n`Секретное слово: ABC`",
        requirements: [
          "Используй преобразование чисел в символы `(char)`.",
          "Выведи 4 строки строго по шаблону.",
        ],
        exampleOutput: "Код 65: A\nКод 66: B\nКод 67: C\nСекретное слово: ABC",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // TODO: создай символы по ASCII кодам и собери слово ABC
    }
}
`,
        tests: [
          {
            label: "Проверка расшифровки ASCII",
            expected: [
              "Код 65: A",
              "Код 66: B",
              "Код 67: C",
              "Секретное слово: ABC",
            ],
          },
        ],
        hints: ["Слово можно объединить: `\"\" + letter + nextLetter + thirdLetter`."],
        solution: `public class Main {
    public static void main(String[] args) {
        char letter = 65;
        char nextLetter = (char) (letter + 1);
        char thirdLetter = (char) (letter + 2);

        System.out.println("Код 65: " + letter);
        System.out.println("Код 66: " + nextLetter);
        System.out.println("Код 67: " + thirdLetter);
        System.out.println("Секретное слово: " + letter + nextLetter + thirdLetter);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 5: Java Type Casting (Приведение типов данных)                */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 5,
    moduleId: 1,
    title: "Java Type Casting: расширение, сужение типов и деление",
    short: "Widening vs Narrowing casting, переполнение и целочисленное деление",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Что такое приведение типов (Type Casting)",
      "Автоматическое расширение (Widening Casting): byte -> double",
      "Явное сужение (Narrowing Casting): (int) myDouble",
      "Потеря точности и отсечение дробной части",
      "Опасность переполнения (Overflow): byte 127 + 1 = -128",
      "Целочисленное деление: почему 5 / 2 = 2, а (double) 5 / 2 = 2.5",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java приведение типов кастинг", note: "Явное и неявное приведение типов" },
      { author: "Заур Трегулов", query: "Заур Трегулов приведение типов переполнение Java", note: "Ловушки переполнения и кастинга" },
    ],
    theory: [
      { type: "h", text: "Что такое Type Casting?" },
      {
        type: "p",
        text: "Приведение типов — это операция преобразования значения одной переменной в другой тип данных. В Java существует два основных вида кастинга:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "**Widening Casting (Автоматическое расширение):** Преобразование меньшего типа в больший. Происходит безопасно и автоматически: `byte -> short -> char -> int -> long -> float -> double`.",
          "**Narrowing Casting (Явное ручное сужение):** Преобразование большего типа в меньший. Требует явного указания типа в скобках `(type)`: `double -> float -> long -> int -> char -> short -> byte`.",
        ],
      },
      {
        type: "code",
        caption: "Примеры приведения типов (W3Schools)",
        code: `// Widening (автоматически):
int myInt = 9;
double myDouble = myInt; // автоматически станет 9.0

// Narrowing (вручную в скобках):
double price = 9.78;
int wholePrice = (int) price; // станет 9 (дробная часть просто отбрасывается!)`,
      },
      { type: "h", text: "Ловушка целочисленного деления" },
      {
        type: "callout",
        variant: "warning",
        title: "Главная ошибка всех новичков!",
        text: "Когда ты делишь два целых числа `int / int`, Java выполняет **целочисленное деление** и отбрасывает остаток:\n`int a = 5, b = 2;`\n`double result = a / b; // результат будет 2.0, а НЕ 2.5!`\nЧтобы получить точный дробный результат, хотя бы один из операндов нужно привести к `double`:\n`double correct = (double) a / b; // 2.5`.",
      },
      { type: "h", text: "Переполнение (Overflow)" },
      {
        type: "p",
        text: "Тип `byte` вмещает числа от -128 до 127. Что будет, если положить туда 128? Произойдет переход через границу круга:",
      },
      {
        type: "code",
        caption: "Переполнение байта",
        code: `byte b = (byte) 130;
System.out.println(b); // напечатает: -126 !`,
      },
    ],
    tasks: [
      {
        id: "d5_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Деление и остаток)",
        shortDesc: "Целочисленное деление, дробное деление и остаток",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Программа считывает два целых числа `x` и `y` через `Scanner`. Выведи три строки:\n" +
          "1) `Целочисленно: <x / y>`\n" +
          "2) `Дробно: <(double) x / y>`\n" +
          "3) `Остаток: <x % y>`",
        requirements: [
          "Используй `(double) x / y` для дробного результата.",
          "Используй оператор `%` для вычисления остатка.",
        ],
        exampleInput: "9\n4",
        exampleOutput: "Целочисленно: 2\nДробно: 2.25\nОстаток: 1",
        sampleInput: "9\n4",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int x = scanner.nextInt();
        int y = scanner.nextInt();

        // TODO: выведи три строки с делением и остатком
    }
}
`,
        tests: [
          { label: "9 и 4", stdin: "9\n4\n", expected: ["Целочисленно: 2", "Дробно: 2.25", "Остаток: 1"] },
          { label: "10 и 3", stdin: "10\n3\n", expected: ["Целочисленно: 3", "Остаток: 1"] },
        ],
        requiredCode: [{ pattern: "\\(\\s*double\\s*\\)", message: "Используй явное приведение (double)" }],
        hints: ["`System.out.println(\"Дробно: \" + ((double) x / y));`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int x = scanner.nextInt();
        int y = scanner.nextInt();

        System.out.println("Целочисленно: " + (x / y));
        System.out.println("Дробно: " + ((double) x / y));
        System.out.println("Остаток: " + (x % y));
    }
}
`,
      },
      {
        id: "d5_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Конвертер времени и среднее)",
        shortDesc: "Секунды в часы, минуты, секунды и честное среднее",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа получает три целых числа: количество **секунд**, затем числа **a** и **b**. Переведи секунды в часы, минуты и секунды, а затем выведи среднее арифметическое `a` и `b` как дробное число.",
        requirements: [
          "Прочитай три `int` через `Scanner`.",
          "Выведи `<ч> ч <м> мин <с> сек`.",
          "Выведи `Среднее: <значение>` — используй явное приведение `(double)`.",
        ],
        exampleInput: "3725\n2\n3",
        exampleOutput: "1 ч 2 мин 5 сек\nСреднее: 2.5",
        sampleInput: "3725\n2\n3",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int totalSeconds = scanner.nextInt();
        int a = scanner.nextInt();
        int b = scanner.nextInt();

        // TODO: часы, минуты, секунды
        // TODO: среднее (double) (a + b) / 2
    }
}
`,
        tests: [
          { label: "3725 сек; 2 и 3", stdin: "3725\n2\n3\n", expected: ["1 ч 2 мин 5 сек", "Среднее: 2.5"] },
          { label: "86399 сек; 7 и 8", stdin: "86399\n7\n8\n", expected: ["23 ч 59 мин 59 сек", "Среднее: 7.5"] },
        ],
        requiredCode: [{ pattern: "\\(\\s*double\\s*\\)", message: "Используй явное приведение типа (double)" }],
        hints: ["Часы: `totalSeconds / 3600`, минуты: `(totalSeconds % 3600) / 60`, секунды: `totalSeconds % 60`."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int totalSeconds = scanner.nextInt();
        int a = scanner.nextInt();
        int b = scanner.nextInt();

        int hours = totalSeconds / 3600;
        int minutes = (totalSeconds % 3600) / 60;
        int seconds = totalSeconds % 60;
        System.out.println(hours + " ч " + minutes + " мин " + seconds + " сек");

        double average = (double) (a + b) / 2;
        System.out.println("Среднее: " + average);
    }
}
`,
      },
      {
        id: "d5_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Калькулятор скидок и кэшбэка)",
        shortDesc: "Финансовый расчет со скидкой, налогом и кэшбэком",
        difficulty: "Средний",
        xp: 40,
        description:
          "Напиши финансовый калькулятор для интернет-магазина. Программа получает:\n1) Базовую цену товара `price` (целое число int)\n2) Процент скидки `discountPercent` (int, например 15)\n3) Процент кэшбэка `cashbackPercent` (int, например 5)\nПрограмма рассчитывает:\n- Сумму скидки: `(double) price * discountPercent / 100`\n- Итоговую цену к оплате: `price - скидка`\n- Сумму начисленного кэшбэка от итоговой цены: `итоговая_цена * cashbackPercent / 100`.",
        requirements: [
          "Выведи `Скидка: <сумма>`",
          "Выведи `К оплате: <сумма>`",
          "Выведи `Кэшбэк: <сумма>`",
        ],
        exampleInput: "1000\n15\n5",
        exampleOutput: "Скидка: 150.0\nК оплате: 850.0\nКэшбэк: 42.5",
        sampleInput: "1000\n15\n5",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int price = scanner.nextInt();
        int discountPercent = scanner.nextInt();
        int cashbackPercent = scanner.nextInt();

        // TODO: рассчитай скидку, цену к оплате и кэшбэк (используй double!)
    }
}
`,
        tests: [
          { label: "1000, 15%, 5%", stdin: "1000\n15\n5\n", expected: ["Скидка: 150.0", "К оплате: 850.0", "Кэшбэк: 42.5"] },
          { label: "5000, 20%, 10%", stdin: "5000\n20\n10\n", expected: ["Скидка: 1000.0", "К оплате: 4000.0", "Кэшбэк: 400.0"] },
        ],
        requiredCode: [{ pattern: "double", message: "Используй тип double для расчета сумм" }],
        hints: [
          "`double discount = (double) price * discountPercent / 100.0;`",
          "`double finalPrice = price - discount;`",
        ],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int price = scanner.nextInt();
        int discountPercent = scanner.nextInt();
        int cashbackPercent = scanner.nextInt();

        double discount = (double) price * discountPercent / 100.0;
        double finalPrice = price - discount;
        double cashback = finalPrice * cashbackPercent / 100.0;

        System.out.println("Скидка: " + discount);
        System.out.println("К оплате: " + finalPrice);
        System.out.println("Кэшбэк: " + cashback);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 6: Java Operators (Операторы: арифметика и инкремент)         */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 6,
    moduleId: 1,
    title: "Java Operators: арифметика, остаток % и инкремент ++i / i++",
    short: "Операторы +, -, *, /, %, префиксный vs постфиксный инкремент",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Арифметические операторы: +, -, *, /, %",
      "Оператор остатка от деления % и его применение (чётность, извлечение цифр)",
      "Инкремент ++ и декремент --",
      "Разница между ++x (префиксный) и x++ (постфиксный)",
      "Составное присваивание: +=, -=, *=, /=, %=",
      "Приоритет операторов (Operator Precedence)",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java арифметические операторы инкремент декремент", note: "Операторы и инкремент" },
      { author: "Заур Трегулов", query: "Заур Трегулов префиксный постфиксный инкремент Java", note: "Ловушки i++ и ++i" },
    ],
    theory: [
      { type: "h", text: "Арифметические операторы в Java" },
      {
        type: "p",
        text: "Java предоставляет полный набор базовых арифметических операторов:",
      },
      {
        type: "table",
        head: ["Оператор", "Название", "Пример", "Результат"],
        rows: [
          ["+", "Сложение", "10 + 5", "15"],
          ["-", "Вычитание", "10 - 5", "5"],
          ["*", "Умножение", "10 * 5", "50"],
          ["/", "Деление", "10 / 5", "2"],
          ["%", "Остаток от деления (Modulo)", "10 % 3", "1"],
          ["++", "Инкремент (увеличение на 1)", "++x или x++", "x увеличивается на 1"],
          ["--", "Декремент (уменьшение на 1)", "--x или x--", "x уменьшается на 1"],
        ],
      },
      { type: "h", text: "Префиксный (++x) против Постфиксного (x++) инкремента" },
      {
        type: "callout",
        variant: "warning",
        title: "Главная тонкость инкремента",
        text: "- **Префиксный `++x`:** Сначала увеличивает значение `x` на 1, а затем возвращает новое значение.\n- **Постфиксный `x++`:** Сначала возвращает текущее старое значение, и только потом увеличивает `x` на 1.",
      },
      {
        type: "code",
        caption: "Наглядная демонстрация",
        code: `int a = 5;
int b = ++a; // a становится 6, и в b записывается 6
System.out.println("a=" + a + ", b=" + b); // a=6, b=6

int x = 5;
int y = x++; // в y записывается старое значение 5, а x становится 6!
System.out.println("x=" + x + ", y=" + y); // x=6, y=5`,
      },
      { type: "h", text: "Оператор остатка % и его практическая польза" },
      {
        type: "list",
        items: [
          "**Проверка чётности:** если `x % 2 == 0`, то число чётное.",
          "**Получение последней цифры числа:** `127 % 10` вернёт `7`.",
          "**Циклическое ограничение:** значение `sec % 60` никогда не превысит 59.",
        ],
      },
    ],
    tasks: [
      {
        id: "d6_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Извлечение цифр числа)",
        shortDesc: "Разбей трёхзначное число на отдельные цифры с помощью / и %",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Программа считывает трёхзначное целое число `n` (например, 735).\nС помощью операторов `/` и `%` извлеки:\n- Первую цифру (сотни)\n- Вторую цифру (десятки)\n- Третью цифру (единицы)\nА также найди их сумму.\nВыведи:\n`Сотни: 7`\n`Десятки: 3`\n`Единицы: 5`\n`Сумма цифр: 15`",
        requirements: [
          "Используй только операторы `/` и `%`.",
          "Выведи 4 строки строго по шаблону.",
        ],
        exampleInput: "735",
        exampleOutput: "Сотни: 7\nДесятки: 3\nЕдиницы: 5\nСумма цифр: 15",
        sampleInput: "735",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: извлеки сотни, десятки, единицы и выведи сумму цифр
    }
}
`,
        tests: [
          { label: "Число 735", stdin: "735\n", expected: ["Сотни: 7", "Десятки: 3", "Единицы: 5", "Сумма цифр: 15"] },
          { label: "Число 942", stdin: "942\n", expected: ["Сотни: 9", "Десятки: 4", "Единицы: 2", "Сумма цифр: 15"] },
        ],
        hints: ["`int hundreds = n / 100;`", "`int tens = (n / 10) % 10;`", "`int units = n % 10;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        int hundreds = n / 100;
        int tens = (n / 10) % 10;
        int units = n % 10;
        int sum = hundreds + tens + units;

        System.out.println("Сотни: " + hundreds);
        System.out.println("Десятки: " + tens);
        System.out.println("Единицы: " + units);
        System.out.println("Сумма цифр: " + sum);
    }
}
`,
      },
      {
        id: "d6_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Тренажёр инкремента)",
        shortDesc: "Предскажи и рассчитай значения префиксного и постфиксного шага",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа считывает стартовое целое число `x`. Выполни следующие шаги:\n1) Выведи `Старт: <x>`\n2) Примени префиксный инкремент в присваивании: `int a = ++x;` и выведи `Префикс: x=<x>, a=<a>`\n3) Примени постфиксный инкремент: `int b = x++;` и выведи `Постфикс: x=<x>, b=<b>`\n4) Выведи `Финал: <x>`",
        requirements: [
          "Используй `++x` и `x++` в точности по шагам задания.",
          "Выведи 4 строки с результатами.",
        ],
        exampleInput: "10",
        exampleOutput: "Старт: 10\nПрефикс: x=11, a=11\nПостфикс: x=12, b=11\nФинал: 12",
        sampleInput: "10",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int x = scanner.nextInt();

        // TODO: выполни шаги с ++x и x++
    }
}
`,
        tests: [
          { label: "x = 10", stdin: "10\n", expected: ["Старт: 10", "Префикс: x=11, a=11", "Постфикс: x=12, b=11", "Финал: 12"] },
          { label: "x = 50", stdin: "50\n", expected: ["Старт: 50", "Префикс: x=51, a=51", "Постфикс: x=52, b=51", "Финал: 52"] },
        ],
        requiredCode: [
          { pattern: "\\+\\+x", message: "Используй префиксный инкремент ++x" },
          { pattern: "x\\+\\+", message: "Используй постфиксный инкремент x++" },
        ],
        hints: ["`int a = ++x;` затем `int b = x++;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int x = scanner.nextInt();

        System.out.println("Старт: " + x);
        int a = ++x;
        System.out.println("Префикс: x=" + x + ", a=" + a);
        int b = x++;
        System.out.println("Постфикс: x=" + x + ", b=" + b);
        System.out.println("Финал: " + x);
    }
}
`,
      },
      {
        id: "d6_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Банкомат: размен купюр)",
        shortDesc: "Жадный алгоритм выдачи суммы купюрами 5000, 1000, 500, 100",
        difficulty: "Средний",
        xp: 40,
        description:
          "Банкомат получает запрошенную к снятию сумму `amount` (кратную 100). Разменяй её минимальным числом банкнот номиналом 5000, 1000, 500 и 100 рублей с использованием операторов `/` и `%=`.\nВыведи отчет:\n`Сумма: <amount> руб.`\n`Купюр 5000: <count5000>`\n`Купюр 1000: <count1000>`\n`Купюр 500: <count500>`\n`Купюр 100: <count100>`",
        requirements: [
          "Используй операторы `/` и `%=` для последовательного уменьшения суммы.",
          "Выведи 5 строк.",
        ],
        exampleInput: "13700",
        exampleOutput: "Сумма: 13700 руб.\nКупюр 5000: 2\nКупюр 1000: 3\nКупюр 500: 1\nКупюр 100: 2",
        sampleInput: "13700",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int amount = scanner.nextInt();

        // TODO: рассчитай количество купюр каждого номинала
    }
}
`,
        tests: [
          {
            label: "13700 руб.",
            stdin: "13700\n",
            expected: [
              "Сумма: 13700 руб.",
              "Купюр 5000: 2",
              "Купюр 1000: 3",
              "Купюр 500: 1",
              "Купюр 100: 2",
            ],
          },
          {
            label: "6800 руб.",
            stdin: "6800\n",
            expected: [
              "Сумма: 6800 руб.",
              "Купюр 5000: 1",
              "Купюр 1000: 1",
              "Купюр 500: 1",
              "Купюр 100: 3",
            ],
          },
        ],
        requiredCode: [{ pattern: "%=", message: "Используй оператор составного остатка %=" }],
        hints: [
          "`int c5000 = current / 5000; current %= 5000;`",
          "`int c1000 = current / 1000; current %= 1000;`",
        ],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int amount = scanner.nextInt();
        int rem = amount;

        int c5000 = rem / 5000;
        rem %= 5000;

        int c1000 = rem / 1000;
        rem %= 1000;

        int c500 = rem / 500;
        rem %= 500;

        int c100 = rem / 100;

        System.out.println("Сумма: " + amount + " руб.");
        System.out.println("Купюр 5000: " + c5000);
        System.out.println("Купюр 1000: " + c1000);
        System.out.println("Купюр 500: " + c500);
        System.out.println("Купюр 100: " + c100);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 7: Java User Input (Ввод данных с клавиатуры: класс Scanner)   */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 7,
    moduleId: 1,
    title: "Java User Input: чтение из консоли с Scanner и ловушка Enter",
    short: "Scanner, System.in, nextInt, nextLine и очистка буфера клавиатуры",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Класс Scanner из пакета java.util",
      "Чтение целых (nextInt) и дробных (nextDouble) чисел",
      "Чтение слов (next) и целых строк (nextLine)",
      "Опасность: зависший перевод строки \\n после nextInt()",
      "Как правильно сбрасывать буфер ввода",
      "Проверка наличия данных: hasNextInt() и hasNextLine()",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java ввод с клавиатуры Scanner", note: "Чтение данных из консоли" },
      { author: "Заур Трегулов", query: "Заур Трегулов Scanner ловушка nextLine Java", note: "Очистка буфера клавиатуры" },
    ],
    theory: [
      { type: "h", text: "Что такое Scanner и как он работает?" },
      {
        type: "p",
        text: "Класс `Scanner` находится в пакете `java.util`. Чтобы использовать его, нужно в самом верху файла написать `import java.util.Scanner;`. Сканер подключается к стандартному потоку ввода `System.in` (твоя клавиатура) и считывает символы, которые вводит пользователь.",
      },
      {
        type: "code",
        caption: "Считывание разных типов данных",
        code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Введите целое число: ");
        int num = scanner.nextInt();

        System.out.print("Введите цену: ");
        double price = scanner.nextDouble();

        System.out.print("Введите одно слово: ");
        String word = scanner.next(); // до первого пробела

        scanner.nextLine(); // ВАЖНО: очистка буфера от зависшего Enter!

        System.out.print("Введите строку текста: ");
        String line = scanner.nextLine(); // считывает всю строку
    }
}`,
      },
      { type: "h", text: "Анатомия ловушки nextLine() после nextInt()" },
      {
        type: "callout",
        variant: "warning",
        title: "Почему nextLine() возвращает пустую строку?",
        text: "Когда пользователь вводит `42` и нажимает клавишу Enter, клавиатура отправляет в буфер: `4` `2` `\\n`.\nМетод `nextInt()` забирает только число `42`. Невидимый символ `\\n` остаётся ждать в очереди.\nСледующий вызов `nextLine()` моментально «проглатывает» этот зависший `\\n` и считает, что строка уже прочитана (пустая!).\n**Лекарство:** Всегда делай пустой вызов `scanner.nextLine();` сразу после `nextInt()` или `nextDouble()`, если дальше планируешь читать текст!",
      },
    ],
    tasks: [
      {
        id: "d7_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Интерактивная анкета)",
        shortDesc: "Считай имя, возраст и город и выведи форматированный результат",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Считай со стандартного входа:\n1) Имя пользователя (строка)\n2) Возраст (целое число)\n3) Город проживания (строка)\nВыведи:\n`Пользователь: <имя>`\n`Возраст: <возраст> лет`\n`Город: <город>`",
        requirements: [
          "Используй `Scanner`.",
          "Не забудь очистить буфер между чтением числа и города!",
          "Выведи 3 строки.",
        ],
        exampleInput: "Амир\n20\nСамарканд",
        exampleOutput: "Пользователь: Амир\nВозраст: 20 лет\nГород: Самарканд",
        sampleInput: "Амир\n20\nСамарканд",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // TODO: прочитай имя, возраст и город, не забывая про очистку буфера
    }
}
`,
        tests: [
          {
            label: "Амир, 20, Самарканд",
            stdin: "Амир\n20\nСамарканд\n",
            expected: [
              "Пользователь: Амир",
              "Возраст: 20 лет",
              "Город: Самарканд",
            ],
          },
          {
            label: "Ольга, 28, Москва",
            stdin: "Ольга\n28\nМосква\n",
            expected: [
              "Пользователь: Ольга",
              "Возраст: 28 лет",
              "Город: Москва",
            ],
          },
        ],
        hints: ["После `scanner.nextInt();` напиши `scanner.nextLine();` чтобы съесть остаток перевода строки."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String name = scanner.nextLine();
        int age = scanner.nextInt();
        scanner.nextLine(); // сброс Enter
        String city = scanner.nextLine();

        System.out.println("Пользователь: " + name);
        System.out.println("Возраст: " + age + " лет");
        System.out.println("Город: " + city);
    }
}
`,
      },
      {
        id: "d7_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Калькулятор автопутешествия)",
        shortDesc: "Расчет расхода бензина и стоимости поездки с double",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Напиши программу для расчета расходов на бензин в поездке. Программа считывает:\n1) Дистанцию поездки в км (целое число `distance`)\n2) Расход топлива на 100 км в литрах (дробное число `consumption`)\n3) Стоимость 1 литра бензина (дробное число `pricePerLiter`)\nПрограмма рассчитывает:\n- Необходимое топливо: `distance * consumption / 100.0`\n- Полную стоимость поездки: `топливо * pricePerLiter`\nВыведи:\n`Потребуется топлива: <литры> л`\n`Стоимость поездки: <стоимость> руб.`",
        requirements: [
          "Используй `scanner.nextInt()` и `scanner.nextDouble()`.",
          "Выведи 2 строки.",
        ],
        exampleInput: "500\n8.5\n55.0",
        exampleOutput: "Потребуется топлива: 42.5 л\nСтоимость поездки: 2337.5 руб.",
        sampleInput: "500\n8.5\n55.0",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // TODO: прочитай distance, consumption, pricePerLiter и выведи итог
    }
}
`,
        tests: [
          {
            label: "500 км, 8.5 л/100, 55 руб",
            stdin: "500\n8.5\n55.0\n",
            expected: [
              "Потребуется топлива: 42.5 л",
              "Стоимость поездки: 2337.5 руб.",
            ],
          },
          {
            label: "1000 км, 7.0 л/100, 60 руб",
            stdin: "1000\n7.0\n60.0\n",
            expected: [
              "Потребуется топлива: 70.0 л",
              "Стоимость поездки: 4200.0 руб.",
            ],
          },
        ],
        hints: ["`double fuel = distance * consumption / 100.0;`", "`double totalCost = fuel * pricePerLiter;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int distance = scanner.nextInt();
        double consumption = scanner.nextDouble();
        double pricePerLiter = scanner.nextDouble();

        double fuel = distance * consumption / 100.0;
        double totalCost = fuel * pricePerLiter;

        System.out.println("Потребуется топлива: " + fuel + " л");
        System.out.println("Стоимость поездки: " + totalCost + " руб.");
    }
}
`,
      },
      {
        id: "d7_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Регистрационный лист университета)",
        shortDesc: "Комплексное считывание строк и чисел с идеальной очисткой",
        difficulty: "Средний",
        xp: 40,
        description:
          "Напиши форму регистрации студента в деканате. Программа последовательно считывает:\n1) Полное имя студента (строка: `Иванов Иван`)\n2) Номер студенческого билета (целое число: `10842`)\n3) Название факультета (строка: `Компьютерные науки`)\n4) Средний балл диплома (дробное число: `4.85`)\nВыведи официальный студенческий билет:\n`Студент: Иванов Иван`\n`Билет №: 10842`\n`Факультет: Компьютерные науки`\n`Средний балл: 4.85`\n`Статус: зачислен`",
        requirements: [
          "Используй `Scanner` с корректной очисткой буфера `\\n` после номера билета.",
          "Выведи 5 строк строго по шаблону.",
        ],
        exampleInput: "Иванов Иван\n10842\nКомпьютерные науки\n4.85",
        exampleOutput: "Студент: Иванов Иван\nБилет №: 10842\nФакультет: Компьютерные науки\nСредний балл: 4.85\nСтатус: зачислен",
        sampleInput: "Иванов Иван\n10842\nКомпьютерные науки\n4.85",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // TODO: прочитай 4 параметра студента и выведи билет
    }
}
`,
        tests: [
          {
            label: "Иванов Иван, 10842, Компьютерные науки, 4.85",
            stdin: "Иванов Иван\n10842\nКомпьютерные науки\n4.85\n",
            expected: [
              "Студент: Иванов Иван",
              "Билет №: 10842",
              "Факультет: Компьютерные науки",
              "Средний балл: 4.85",
              "Статус: зачислен",
            ],
          },
        ],
        hints: [
          "После `int ticket = scanner.nextInt();` обязательно выполни `scanner.nextLine();` перед чтением факультета!",
        ],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String name = scanner.nextLine();
        int ticket = scanner.nextInt();
        scanner.nextLine(); // очистка буфера Enter
        String faculty = scanner.nextLine();
        double gpa = scanner.nextDouble();

        System.out.println("Студент: " + name);
        System.out.println("Билет №: " + ticket);
        System.out.println("Факультет: " + faculty);
        System.out.println("Средний балл: " + gpa);
        System.out.println("Статус: зачислен");
    }
}
`,
      },
    ],
  }),
];
