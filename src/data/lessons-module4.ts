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

export const module4Lessons: Lesson[] = [
  /* ------------------------------------------------------------------ */
  /*  DAY 21: Java Methods (Создание и вызов методов)                   */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 21,
    moduleId: 4,
    title: "Java Methods: объявление методов, вызов и принцип DRY",
    short: "Синтаксис public static void myMethod(), вызов из main и DRY",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Что такое метод: именованный блок кода для повторного использования",
      "Принцип DRY: Don't Repeat Yourself (не повторяйся)",
      "Синтаксис объявления метода: public static void methodName()",
      "Вызов метода из метода main()",
      "Многократный вызов и порядок выполнения команд",
      "Правила именования методов: глагол в camelCase (printReport, calculateTax)",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java методы с нуля", note: "Методы в Java для начинающих" },
      { author: "Заур Трегулов", query: "Заур Трегулов методы Java вызов сигнатура", note: "Объявление и вызов методов" },
    ],
    theory: [
      { type: "h", text: "Что такое метод в Java и зачем нужен принцип DRY" },
      {
        type: "p",
        text: "Представьте, что в десятке мест программы нужно нарисовать красивую рамку отчёта или проверить права пользователя. Копировать один и тот же код десятки раз — грубая ошибка, потому что при правке придётся менять код во всех местах. В программировании действует принцип **DRY (Don't Repeat Yourself — Не повторяйся)**: повторяющуюся логику выносят в отдельный именованный **метод** (в других языках — функцию).",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: отдельный рецепт в поваренной книге",
        text: "Вместо того чтобы в каждом рецепте торта заново расписывать 10 шагов приготовления крема, вы выносите «Крем заварной» на отдельную страницу и просто пишете в рецептах «Приготовить заварной крем». Метод — это именно такая именованная подпрограмма, которую можно вызвать из любого места.",
      },
      { type: "h", text: "Параметр vs Аргумент — в чём разница терминов?" },
      {
        type: "p",
        text: "**Параметр** — это переменная в скобках объявления метода (`void sayHello(String name)`). **Аргумент** — это конкретное значение, которое вы передаёте при вызове (`sayHello(\"Катя\")`). Имена аргумента в `main` и параметра в методе могут не совпадать.",
      },
      {
        type: "code",
        caption: "Объявление, многократный вызов и динамическое выравнивание",
        code: `public class Main {
    // 1. Объявляем метод вне main, но внутри class Main:
    public static void printDivider() {
        System.out.println("====================");
    }

    public static void main(String[] args) {
        // 2. Вызываем метод столько раз, сколько нужно:
        printDivider();
        System.out.println("ОТЧЕТ О СИСТЕМЕ JAVA");
        printDivider();
    }
}`,
      },
      { type: "h", text: "Анатомия заголовка (сигнатуры) метода" },
      {
        type: "table",
        head: ["Часть объявления", "Что означает", "Пример"],
        rows: [
          ["`public`", "Модификатор доступа: метод виден извне", "`public ...`"],
          ["`static`", "Принадлежит самому классу `Main`, можно вызвать из `main` без `new Main()`", "`static ...`"],
          ["`void`", "Возвращаемый тип: метод просто выполняет действия и **ничего не возвращает**", "`void printBox(...)`"],
          ["`sayHello(String name)`", "Имя (глагол в `camelCase`) + входные параметры в скобках", "`sayHello(\"Али\")`"],
        ],
      },
      { type: "h", text: "Входные параметры и передача String внутрь метода" },
      {
        type: "p",
        text: "Чтобы метод был универсальным (например, приветствовал разных людей или рисовал рамку ровно по ширине любого сообщения), ему передают данные через **параметры** в круглых скобках. Внутри `printBox(String msg)` длину рамки легко подогнать под `msg.length() + 4` с помощью цикла `for` (учитывая символы `| ` слева и ` |` справа).",
      },
      {
        type: "code",
        caption: "Метод с параметром и циклом для динамической рамки",
        code: `public static void printBox(String msg) {
    int dashes = msg.length() + 2; // по 1 пробелу с каждой стороны
    String line = "+";
    for (int i = 0; i < dashes; i++) {
        line += "-";
    }
    line += "+";
    System.out.println(line);
    System.out.println("| " + msg + " |");
    System.out.println(line);
}`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Частая ошибка новичков: метод внутри метода",
        text: "В Java **нельзя** объявлять один метод внутри тела другого (внутри `main`)! Все ваши методы (`printDivider`, `sayHello`, `printBox`) должны располагаться рядом с `main` на одном уровне отступов внутри `class Main`.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями дня",
        text: "Задание 1: объявите `printDivider()` без параметров и вызовите его дважды в `main`. Задание 2: добавьте параметр `(String name)` в метод `sayHello`. Задание 3: вычислите длину границы по `msg.length()` и нарисуйте рамку через цикл внутри `printBox(String msg)`.",
      },
    ],
    tasks: [
      {
        id: "d21_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Печать разделителя и заголовка)",
        shortDesc: "Создай статический метод printDivider() и вызови его трижды",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай метод `public static void printDivider()`, который печатает строку `====================` (20 знаков равно).\nВ методе `main` вызови метод `printDivider()` до и после печати названия отчета:\n`====================`\n`ОТЧЕТ О СИСТЕМЕ JAVA`\n`====================`",
        requirements: [
          "Объяви метод `public static void printDivider()`.",
          "Вызови его дважды в методе `main`.",
        ],
        exampleOutput: "====================\nОТЧЕТ О СИСТЕМЕ JAVA\n====================",
        starterCode: `public class Main {
    // TODO: объяви метод printDivider()

    public static void main(String[] args) {
        // TODO: вызови printDivider(), напечатай текст отчета и снова printDivider()
    }
}
`,
        tests: [
          {
            label: "Проверка разделителей",
            expected: [
              "====================",
              "ОТЧЕТ О СИСТЕМЕ JAVA",
              "====================",
            ],
          },
        ],
        requiredCode: [
          { pattern: "static\\s+void\\s+printDivider\\s*\\(", message: "Создай метод static void printDivider()" },
        ],
        hints: ["`public static void printDivider() { System.out.println(\"====================\"); }`"],
        solution: `public class Main {
    public static void printDivider() {
        System.out.println("====================");
    }

    public static void main(String[] args) {
        printDivider();
        System.out.println("ОТЧЕТ О СИСТЕМЕ JAVA");
        printDivider();
    }
}
`,
      },
      {
        id: "d21_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Приветствие пользователя)",
        shortDesc: "Метод sayHello, считывающий имя и печатающий приветствие",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Создай метод `public static void sayHello(String name)`, принимающий строку `name` и выводящий `Привет, <name>! Добро пожаловать в JavaForge.`.\nВ методе `main` считай имя пользователя через `Scanner` и передай его в метод `sayHello`.",
        requirements: [
          "Метод `sayHello` должен принимать параметр `String name`.",
          "Выведи приветствие.",
        ],
        exampleInput: "Тимур",
        exampleOutput: "Привет, Тимур! Добро пожаловать в JavaForge.",
        sampleInput: "Тимур",
        starterCode: `import java.util.Scanner;

public class Main {
    // TODO: объяви метод sayHello(String name)

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();

        // TODO: вызови sayHello(name)
    }
}
`,
        tests: [
          {
            label: "Тимур",
            stdin: "Тимур\n",
            expected: ["Привет, Тимур! Добро пожаловать в JavaForge."],
          },
        ],
        requiredCode: [{ pattern: "void\\s+sayHello\\s*\\(\\s*String", message: "Объяви sayHello(String name)" }],
        hints: ["`public static void sayHello(String name) { System.out.println(\"Привет, \" + name + \"! Добро пожаловать в JavaForge.\"); }`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void sayHello(String name) {
        System.out.println("Привет, " + name + "! Добро пожаловать в JavaForge.");
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        sayHello(name);
    }
}
`,
      },
      {
        id: "d21_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Рамка для текста)",
        shortDesc: "Метод printBoxedMessage для красивого оформления текста в рамке",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай метод `public static void printBox(String msg)`.\nМетод должен напечатать верхнюю границу из символов `+` и `-`, затем строку с текстом `| <msg> |`, а затем нижнюю границу.\nДлина границы рассчитывается динамически: `\"+\" + \"-\".repeat(msg.length() + 2) + \"+\"` (или циклом).\nДля текста `Java is awesome` вывод:\n`+-----------------+`\n`| Java is awesome |`\n`+-----------------+`",
        requirements: [
          "Создай метод `printBox(String msg)`.",
          "Отрисуй рамку под длину строки.",
        ],
        exampleInput: "Java is awesome",
        exampleOutput: "+-----------------+\n| Java is awesome |\n+-----------------+",
        sampleInput: "Java is awesome",
        starterCode: `import java.util.Scanner;

public class Main {
    // TODO: объяви метод printBox(String msg)

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        // TODO: вызови printBox(text)
    }
}
`,
        tests: [
          {
            label: "Java is awesome",
            stdin: "Java is awesome\n",
            expected: [
              "+-----------------+",
              "| Java is awesome |",
              "+-----------------+",
            ],
          },
        ],
        hints: ["`String border = \"+\" + \"-\".repeat(msg.length() + 2) + \"+\";`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void printBox(String msg) {
        String border = "+" + "-".repeat(msg.length() + 2) + "+";
        System.out.println(border);
        System.out.println("| " + msg + " |");
        System.out.println(border);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        printBox(text);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 22: Java Method Parameters & Return (Параметры и return)      */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 22,
    moduleId: 4,
    title: "Java Method Parameters & Return: параметры и возвращаемые значения",
    short: "Параметры, ключевое слово return, возвращаемые типы и Pass by Value",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Параметры (в сигнатуре) vs Аргументы (при вызове)",
      "Множественные параметры: void printSum(int a, int b)",
      "Ключевое слово return: возврат значения из метода",
      "Возвращаемые типы: int, double, boolean, String, массивы",
      "Досрочный выход из метода через return;",
      "Передача параметров по значению (Pass by Value) в Java",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java метод return параметры", note: "Параметры и return подробно" },
      { author: "Заур Трегулов", query: "Заур Трегулов return pass by value Java", note: "Pass by value и возвращаемые типы" },
    ],
    theory: [
      { type: "h", text: "Зачем методам возвращать значения через return?" },
      {
        type: "p",
        text: "Методы со словом `void` умеют только что-то делать (например, печатать в консоль), но их результат нельзя сохранить в переменную или использовать в дальнейших расчётах. В реальном бэкенде большинство методов — это **чистые функции-калькуляторы**: они принимают входные данные, вычисляют итог и отдают его обратно вызывающему коду через `return`.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: `void` vs `return` — курьер vs калькулятор",
        text: "Метод **`void`** похож на сотрудника, который выполнил поручение (напечатал чек) и ушёл молча. Метод с **`return`** работает как калькулятор: вы даёте ему числа `(80.0, 1.75)`, а он протягивает вам готовый результат, который можно записать в переменную `String status = getBmiStatus(...);`.",
      },
      { type: "h", text: "Зачем отделять вычисления от печати (`System.out.println`)?" },
      {
        type: "p",
        text: "Если метод `isEven` возвращает `boolean`, его можно использовать в `if (isEven(n))`, в циклах, в веб-API и в автотестах JUnit. Если бы метод сразу печатал строку в консоль (`void`), переиспользовать его результат в других формулах было бы невозможно.",
      },
      {
        type: "code",
        caption: "Разница между void и возвращаемым значением (int, boolean, String)",
        code: `public class Main {
    // Предикат: возвращает true или false
    public static boolean isEven(int number) {
        return number % 2 == 0; // Можно сразу вернуть логическое выражение!
    }

    // Расчёт и выбор статуса (ранний выход через return):
    public static String getBmiStatus(double weightKg, double heightM) {
        double bmi = weightKg / (heightM * heightM);
        if (bmi < 18.5) return "Дефицит массы";
        if (bmi < 25.0) return "Норма";
        if (bmi < 30.0) return "Избыточный вес";
        return "Ожидание консультации";
    }
}`,
      },
      { type: "h", text: "Важнейшее свойство return: досрочный выход и «все ветки»" },
      {
        type: "list",
        items: [
          "**Мгновенная остановка:** Как только выполнение доходит до `return ...;`, метод **немедленно завершается** — любые строки ниже внутри того же блока не выполнятся!",
          "**Обязательный возврат на всех путях:** Если метод возвращает значение (не `void`), компилятор `javac` проверяет каждую ветку `if/else`. Нельзя вернуть значение только внутри `if` и забыть `else`/финальный `return` — получите ошибку `missing return statement`!",
        ],
      },
      { type: "h", text: "Как работает Pass-by-Value (Передача по значению)" },
      {
        type: "callout",
        variant: "warning",
        title: "В Java ВСЕ аргументы передаются по значению!",
        text: "Когда вы вызываете `method(x)`, внутрь метода передаётся **копия значения** переменной `x`.\nЕсли внутри метода написать `x = x + 10;`, то изменится только локальная копия внутри метода, а исходная переменная `x` в `main` останется прежней! Чтобы обновить данные, метод должен **вернуть** новое значение через `return`, а в `main` его нужно присвоить: `x = update(x);`.",
      },
      { type: "h", text: "Множественные параметры и композиция методов" },
      {
        type: "p",
        text: "Метод может принимать любое число параметров разных типов через запятую (`int a, int b, int c` или `double w, double h`). А внутри метода вы можете вызывать стандартные утилиты вроде `Math.max(a, Math.max(b, c))` или другие свои методы.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями дня",
        text: "Задание 1: напишите булев метод `isEven(int number)`, возвращающий `number % 2 == 0`. Задание 2: создайте `maxOfThree(int a, int b, int c)` (через `if` или `Math.max`) и распечатайте результат в `main`. Задание 3: вычислите ИМТ в `getBmiStatus` и верните текстовый статус по порогам (удобно через ранний `return`).",
      },
    ],
    tasks: [
      {
        id: "d22_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Метод проверки чётности)",
        shortDesc: "Создай метод isEven(int n), возвращающий boolean",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай метод `public static boolean isEven(int number)`, который возвращает `true`, если число чётное (`number % 2 == 0`), и `false`, если нечётное.\nВ методе `main` считай число `x`, вызови `isEven(x)` и выведи:\n`Число <x> чётное: <true/false>`",
        requirements: [
          "Метод должен возвращать `boolean`.",
          "Выведи 1 строку.",
        ],
        exampleInput: "8",
        exampleOutput: "Число 8 чётное: true",
        sampleInput: "8",
        starterCode: `import java.util.Scanner;

public class Main {
    // TODO: объяви метод isEven(int number)

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int x = scanner.nextInt();

        // TODO: вызови isEven(x) и напечатай результат
    }
}
`,
        tests: [
          { label: "8", stdin: "8\n", expected: ["Число 8 чётное: true"] },
          { label: "15", stdin: "15\n", expected: ["Число 15 чётное: false"] },
        ],
        requiredCode: [{ pattern: "boolean\\s+isEven\\s*\\(", message: "Объяви boolean isEven(int number)" }],
        hints: ["`public static boolean isEven(int number) { return number % 2 == 0; }`"],
        solution: `import java.util.Scanner;

public class Main {
    public static boolean isEven(int number) {
        return number % 2 == 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int x = scanner.nextInt();
        System.out.println("Число " + x + " чётное: " + isEven(x));
    }
}
`,
      },
      {
        id: "d22_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Максимум из трёх чисел)",
        shortDesc: "Создай метод findMax(int a, int b, int c)",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Создай метод `public static int maxOfThree(int a, int b, int c)`, который возвращает наибольшее из трёх чисел.\nВ `main` считай три целых числа и выведи:\n`Максимум: <результат>`",
        requirements: [
          "Метод должен возвращать `int`.",
          "Выведи результат.",
        ],
        exampleInput: "15 42 28",
        exampleOutput: "Максимум: 42",
        sampleInput: "15\n42\n28",
        starterCode: `import java.util.Scanner;

public class Main {
    // TODO: объяви метод maxOfThree(int a, int b, int c)

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        int c = scanner.nextInt();

        // TODO: вызови maxOfThree и напечатай
    }
}
`,
        tests: [
          { label: "15, 42, 28", stdin: "15\n42\n28\n", expected: ["Максимум: 42"] },
          { label: "100, 20, 50", stdin: "100\n20\n50\n", expected: ["Максимум: 100"] },
        ],
        requiredCode: [{ pattern: "int\\s+maxOfThree\\s*\\(", message: "Объяви int maxOfThree(int a, int b, int c)" }],
        hints: ["`return Math.max(a, Math.max(b, c));`"],
        solution: `import java.util.Scanner;

public class Main {
    public static int maxOfThree(int a, int b, int c) {
        return Math.max(a, Math.max(b, c));
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        int c = scanner.nextInt();
        System.out.println("Максимум: " + maxOfThree(a, b, c));
    }
}
`,
      },
      {
        id: "d22_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Калькулятор индекса массы тела ИМТ)",
        shortDesc: "Метод getBmiCategory(double weight, double height)",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай метод `public static String getBmiStatus(double weightKg, double heightM)`.\nИндекс массы тела рассчитывается по формуле: `bmi = weightKg / (heightM * heightM)`.\n- Если `bmi < 18.5`, возвращается строка `\"Дефицит массы\"`\n- Если `bmi >= 18.5 && bmi < 25.0`, возвращается `\"Норма\"`\n- Иначе возвращается `\"Избыточная масса\"`\nВ `main` считай вес и рост и выведи: `Статус ИМТ: <статус>`",
        requirements: [
          "Метод должен возвращать `String`.",
          "Выведи категорию ИМТ.",
        ],
        exampleInput: "70.0\n1.75",
        exampleOutput: "Статус ИМТ: Норма",
        sampleInput: "70.0\n1.75",
        starterCode: `import java.util.Scanner;

public class Main {
    // TODO: объяви метод getBmiStatus(double weightKg, double heightM)

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double w = scanner.nextDouble();
        double h = scanner.nextDouble();

        // TODO: вызови getBmiStatus(w, h)
    }
}
`,
        tests: [
          { label: "70 кг, 1.75 м (22.86 -> Норма)", stdin: "70.0\n1.75\n", expected: ["Статус ИМТ: Норма|Норма"] },
          { label: "50 кг, 1.80 м (15.43 -> Дефицит)", stdin: "50.0\n1.80\n", expected: ["Статус ИМТ: Дефицит массы|Дефицит массы"] },
        ],
        hints: ["`double bmi = weightKg / (heightM * heightM);`"],
        solution: `import java.util.Scanner;

public class Main {
    public static String getBmiStatus(double weightKg, double heightM) {
        double bmi = weightKg / (heightM * heightM);
        if (bmi < 18.5) {
            return "Дефицит массы";
        } else if (bmi < 25.0) {
            return "Норма";
        } else {
            return "Избыточная масса";
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double w = scanner.nextDouble();
        double h = scanner.nextDouble();
        System.out.println("Статус ИМТ: " + getBmiStatus(w, h));
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 23: Java Method Overloading (Перегрузка методов)              */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 23,
    moduleId: 4,
    title: "Java Method Overloading: перегрузка методов и сигнатура",
    short: "Одинаковые имена с разными параметрами, правила сигнатуры",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: [
      "Что такое перегрузка методов (Method Overloading)",
      "Сигнатура метода: имя + типы и порядок параметров",
      "Почему тип возвращаемого значения НЕ отличает перегрузку",
      "Перегрузка по количеству параметров",
      "Перегрузка по типам параметров (int vs double)",
      "Как компилятор выбирает нужный метод",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java перегрузка методов", note: "Перегрузка методов с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов overloading перегрузка сигнатура Java", note: "Сигнатура и правила компилятора" },
    ],
    theory: [
      { type: "h", text: "Что такое перегрузка методов (Method Overloading)?" },
      {
        type: "p",
        text: "Вспоминаете `System.out.println(...)`? Вы передаёте в него `int`, `double`, `boolean` или `String` — и во всех случаях вызываете одно и то же имя `println`. Это возможно благодаря **перегрузке методов (Method Overloading)**: в одном классе можно объявить несколько методов с **одинаковым именем**, если у них **разные параметры**.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: швейцарский ключ с одним названием «открыть»",
        text: "Человек в жизни тоже перегружает действия: фраза «умножить» работает одинаково как для целых `3 × 4`, так и для дробных `2.5 × 4.0`. Перегрузка позволяет дать **единый интуитивный интерфейс** (одно имя метода) для родственных операций с разными типами или числом аргументов.",
      },
      { type: "h", text: "Неявное расширение и двусмысленность вызовов" },
      {
        type: "list",
        items: [
          "Если есть `print(double x)` и нет `print(int x)`, то вызов `print(5)` спокойно расширит `5` до `5.0`.",
          "Но если объявить одновременно `calc(int a, double b)` и `calc(double a, int b)` и вызвать `calc(5, 5)`, компилятор выдаст ошибку **`reference to calc is ambiguous`**, так как оба варианта подходят одинаково!",
        ],
      },
      { type: "h", text: "Три способа перегрузить метод" },
      {
        type: "table",
        head: ["Способ", "Пример 1", "Пример 2", "Допустимо?"],
        rows: [
          ["Разные **типы** параметров", "`multiply(int a, int b)`", "`multiply(double a, double b)`", "✅ Да"],
          ["Разное **количество** параметров", "`getArea(int side)`", "`getArea(int w, int h)`", "✅ Да"],
          ["Разный **порядок** разных типов", "`log(String tag, int code)`", "`log(int code, String tag)`", "✅ Да"],
          ["Разный только **возвращаемый тип**", "`int calc(int a)`", "`double calc(int a)`", "❌ **Ошибка компиляции!**"],
        ],
      },
      {
        type: "code",
        caption: "Перегрузка по типам и по количеству аргументов",
        code: `public class Main {
    // 1. Для квадрата (1 параметр)
    public static int getArea(int side) {
        return side * side;
    }

    // 2. Для прямоугольника (2 параметра)
    public static int getArea(int width, int height) {
        return width * height;
    }

    // 3. Делегирование перегруженного метода (вызов одной версии из другой):
    public static String formatName(String first, String last) {
        return last + " " + first;
    }

    public static String formatName(String first, String middle, String last) {
        return last + " " + first + " " + middle;
    }
}`,
      },
      { type: "h", text: "Почему компилятор решает всё заранее (Static Dispatch)" },
      {
        type: "p",
        text: "Сигнатура метода — это **имя + список типов параметров** (но БЕЗ типа возвращаемого значения и БЕЗ имён параметров!). Когда компилятор `javac` встречает вызов `multiply(2.5, 4.0)`, он ещё **до запуска программы** по типам аргументов выбирает нужную перегруженную версию.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Почему нельзя перегрузить метод только по возвращаемому типу?",
        text: "Представьте, что в `main` программист просто написал `calc(5);` и не сохранил результат в переменную. Компилятор не смог бы понять, какую версию (`int` или `double`) вы хотите вызвать! Поэтому `method already defined` запрещает менять только return type.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями дня",
        text: "Задание 1: перегрузите `multiply` по **типам** параметров (`int, int` и `double, double`). Задание 2: перегрузите `getArea` по **количеству** параметров (1 для квадрата, 2 для прямоугольника). Задание 3: перегрузите `formatName` для 2 и 3 строковых компонентов ФИО.",
      },
    ],
    tasks: [
      {
        id: "d23_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Перегрузка метода multiply)",
        shortDesc: "Создай два метода multiply: для целых чисел и для дробных",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай два перегруженных метода:\n1) `public static int multiply(int a, int b)` -> возвращает `a * b`\n2) `public static double multiply(double a, double b)` -> возвращает `a * b`\nВ `main` продемонстрируй их работу:\n`Целое: 15`\n`Дробное: 12.5`",
        requirements: [
          "Используй перегрузку методов с одинаковым именем `multiply`.",
          "Выведи 2 строки.",
        ],
        exampleOutput: "Целое: 15\nДробное: 12.5",
        starterCode: `public class Main {
    // TODO: объяви multiply(int, int) и multiply(double, double)

    public static void main(String[] args) {
        System.out.println("Целое: " + multiply(3, 5));
        System.out.println("Дробное: " + multiply(2.5, 5.0));
    }
}
`,
        tests: [
          {
            label: "Проверка multiply",
            expected: [
              "Целое: 15",
              "Дробное: 12.5",
            ],
          },
        ],
        requiredCode: [
          { pattern: "int\\s+multiply\\s*\\(\\s*int", message: "Объяви multiply(int, int)" },
          { pattern: "double\\s+multiply\\s*\\(\\s*double", message: "Объяви multiply(double, double)" },
        ],
        hints: ["Оба метода имеют имя `multiply`, но разные типы параметров."],
        solution: `public class Main {
    public static int multiply(int a, int b) {
        return a * b;
    }

    public static double multiply(double a, double b) {
        return a * b;
    }

    public static void main(String[] args) {
        System.out.println("Целое: " + multiply(3, 5));
        System.out.println("Дробное: " + multiply(2.5, 5.0));
    }
}
`,
      },
      {
        id: "d23_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Калькулятор площадей getArea)",
        shortDesc: "Перегрузи метод getArea для квадрата и прямоугольника",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Создай два перегруженных метода расчета площади фигур:\n1) `public static int getArea(int side)` — для квадрата (`side * side`)\n2) `public static int getArea(int width, int height)` — для прямоугольника (`width * height`)\nВ `main` считай сторону квадрата `s`, а затем ширину `w` и высоту `h` прямоугольника.\nВыведи:\n`Площадь квадрата: <areaSquare>`\n`Площадь прямоугольника: <areaRect>`",
        requirements: [
          "Имя обоих методов должно быть строго `getArea`.",
          "Выведи 2 строки.",
        ],
        exampleInput: "5\n4\n6",
        exampleOutput: "Площадь квадрата: 25\nПлощадь прямоугольника: 24",
        sampleInput: "5\n4\n6",
        starterCode: `import java.util.Scanner;

public class Main {
    // TODO: объяви getArea(int side) и getArea(int w, int h)

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int s = scanner.nextInt();
        int w = scanner.nextInt();
        int h = scanner.nextInt();

        // TODO: вызови оба метода getArea и напечатай
    }
}
`,
        tests: [
          {
            label: "Квадрат 5, прямоугольник 4х6",
            stdin: "5\n4\n6\n",
            expected: [
              "Площадь квадрата: 25",
              "Площадь прямоугольника: 24",
            ],
          },
        ],
        requiredCode: [
          { pattern: "int\\s+getArea\\s*\\(\\s*int\\s+\\w+\\s*\\)", message: "Объяви getArea(int side)" },
          { pattern: "int\\s+getArea\\s*\\(\\s*int\\s+\\w+\\s*,\\s*int", message: "Объяви getArea(int w, int h)" },
        ],
        hints: ["`getArea(s)` вызовет 1-й метод, `getArea(w, h)` — 2-й."],
        solution: `import java.util.Scanner;

public class Main {
    public static int getArea(int side) {
        return side * side;
    }

    public static int getArea(int width, int height) {
        return width * height;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int s = scanner.nextInt();
        int w = scanner.nextInt();
        int h = scanner.nextInt();

        System.out.println("Площадь квадрата: " + getArea(s));
        System.out.println("Площадь прямоугольника: " + getArea(w, h));
    }
}
`,
      },
      {
        id: "d23_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Перегрузка форматирования имени)",
        shortDesc: "Метод formatFullName с 2 или 3 параметрами (фамилия, имя, отчество)",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай перегруженные методы форматирования имени пользователя:\n1) `public static String formatName(String first, String last)` -> возвращает `last + \" \" + first`\n2) `public static String formatName(String first, String middle, String last)` -> возвращает `last + \" \" + first + \" \" + middle`\nВ `main` продемонстрируй оба вызова:\n`formatName(\"Иван\", \"Иванов\")` -> `Иванов Иван`\n`formatName(\"Иван\", \"Иванович\", \"Иванов\")` -> `Иванов Иван Иванович`",
        requirements: [
          "Используй перегрузку метода `formatName` по числу аргументов (2 и 3).",
          "Выведи 2 строки.",
        ],
        exampleOutput: "Иванов Иван\nИванов Иван Иванович",
        starterCode: `public class Main {
    // TODO: объяви два перегруженных метода formatName

    public static void main(String[] args) {
        System.out.println(formatName("Иван", "Иванов"));
        System.out.println(formatName("Иван", "Иванович", "Иванов"));
    }
}
`,
        tests: [
          {
            label: "Проверка formatName",
            expected: [
              "Иванов Иван",
              "Иванов Иван Иванович",
            ],
          },
        ],
        hints: ["`return last + \" \" + first;`"],
        solution: `public class Main {
    public static String formatName(String first, String last) {
        return last + " " + first;
    }

    public static String formatName(String first, String middle, String last) {
        return last + " " + first + " " + middle;
    }

    public static void main(String[] args) {
        System.out.println(formatName("Иван", "Иванов"));
        System.out.println(formatName("Иван", "Иванович", "Иванов"));
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 24: Java Scope (Область видимости переменных)                 */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 24,
    moduleId: 4,
    title: "Java Scope: видимость переменных, Method Scope и Block Scope",
    short: "Область видимости внутри методов и фигурных скобок {}, время жизни",
    difficulty: "Лёгкий",
    duration: "~1.5 часа",
    xp: 100,
    ready: true,
    topics: [
      "Что такое Scope: где переменная доступна и где уничтожается",
      "Method Scope (область видимости метода): локальные переменные",
      "Block Scope (область видимости блока): фигурные скобки {}",
      "Переменные циклов: почему счетчик for (int i = 0...) не виден вне цикла",
      "Затенение переменных (Variable Shadowing)",
      "Стек вызовов и время жизни данных в памяти",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java область видимости переменных", note: "Область видимости Scope с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов scope область видимости переменных стек Java", note: "Method vs Block scope" },
    ],
    theory: [
      { type: "h", text: "Что такое область видимости (Scope) и время жизни переменной" },
      {
        type: "p",
        text: "Когда программа становится больше 10 строк, важно, чтобы переменные не «конфликтовали» между разными функциями и блоками. **Область видимости (Scope)** — это часть кода, внутри которой переменная существует и к ней можно обратиться. Вне своей области видимости переменная уничтожается (освобождает стек) и становится невидимой для компилятора.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: комнаты с односторонними окнами",
        text: "Внутренний блок `{ ... }` похож на кабинет со стеклом в общий зал метода: люди в кабинете видят всё, что объявлено в зале до входа в кабинет, но коллеги в зале или в соседнем методе не видят локальных бумаг внутри кабинета.",
      },
      { type: "h", text: "Счётчик цикла for тоже имеет Block Scope" },
      {
        type: "p",
        text: "Переменная `i`, объявленная в шапке `for (int i = 0; i < 5; i++)`, существует **только внутри этого цикла**. Поэтому два независимых цикла подряд могут спокойно использовать одинаковое имя `for (int i = 0; ...)` без конфликта имён.",
      },
      {
        type: "table",
        head: ["Уровень Scope", "Где объявлена переменная", "Где она видна"],
        rows: [
          ["**Block Scope (блочный)**", "Внутри пары фигурных скобок `{ ... }`, тела `if`, `else` или шапки `for (int i ...)`", "Только от строки объявления до ближайшей закрывающей `}`!"],
          ["**Method Scope (метод)**", "На уровне тела метода (или в списке его параметров)", "Во всём этом методе ниже объявления, но **невидима в других методах**!"],
          ["**Class Scope (поля)**", "Прямо внутри `class`, но вне методов (изучим в ООП)", "Во всех методах класса"],
        ],
      },
      {
        type: "code",
        caption: "Типичная ошибка Block Scope и как её исправить",
        code: `// ОШИБКА: переменная sum родилась внутри цикла и умирает на каждой итерации!
for (int i = 1; i <= 10; i++) {
    int brokenSum = 0; // ОШИБКА: не видна после цикла!
    brokenSum += i;
}
// System.out.println(brokenSum); // cannot find symbol!

// ПРАВИЛЬНО: выносим объявление переменной ДО блока цикла / if:
int total = 0;
for (int i = 1; i <= 10; i++) {
    total += i; // Из блока видны внешние переменные!
}
System.out.println(total); // 55 — теперь видна!`,
      },
      { type: "h", text: "Изоляция локальных переменных между методами" },
      {
        type: "p",
        text: "Каждый вызов метода получает на стеке **собственный изолированный фрейм памяти**. Поэтому переменная `int x = 10;` в `main` и параметр `int x` в методе `tryModify(int x)` — это две совершенно разные ячейки памяти с одинаковым именем! Изменение `x` внутри `tryModify` никак не меняет `x` в `main`.",
      },
      {
        type: "code",
        caption: "Две разные переменные x в разных фреймах стека",
        code: `public static void tryModify(int x) {
    x = x + 100; // Меняем только локальную копию в tryModify
    System.out.println("Внутри: " + x);
}

public static void main(String[] args) {
    int x = 10;
    tryModify(x); // Передали копию значения 10
    System.out.println("Снаружи: " + x); // Осталось 10!
}`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Правило односторонней видимости",
        text: "Вложенный блок `{ ... }` (внутри `if`, `for`) **видит** переменные, созданные снаружи, но внешний код **никогда не видит** переменные, созданные внутри вложенного блока. Причём вы не можете объявить в `if` переменную с именем, которое уже занято выше в том же методе.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями дня",
        text: "Задание 1: вынесите накопитель `total` из тела цикла `for` в Method Scope. Задание 2: объявите переменные итоговых значений до блока `if`, чтобы напечатать их после закрытия скобки `}`. Задание 3: убедитесь на практике в изоляции локального параметра `x` внутри метода `tryModify`.",
      },
    ],
    tasks: [
      {
        id: "d24_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Исправление выхода за область видимости)",
        shortDesc: "Вынеси объявление переменной из блока цикла, чтобы напечатать итог",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "В стартовом коде переменная `total` объявлена внутри цикла, из-за чего её нельзя вывести после цикла.\nИсправь код: объяви `int total = 0;` ДО цикла `for`.\nВыведи:\n`Сумма чисел от 1 до 10: 55`",
        requirements: [
          "Объяви `total` в области видимости метода `main`.",
          "Выведи 1 строку.",
        ],
        exampleOutput: "Сумма чисел от 1 до 10: 55",
        starterCode: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            int total = 0; // Ошибка: пересоздается на каждом шаге!
            total += i;
        }

        // Ошибка: total не виден здесь!
        System.out.println("Сумма чисел от 1 до 10: " + total);
    }
}
`,
        tests: [
          { label: "Сумма 55", expected: ["Сумма чисел от 1 до 10: 55"] },
        ],
        hints: ["Объяви `int total = 0;` перед циклом `for`."],
        solution: `public class Main {
    public static void main(String[] args) {
        int total = 0;
        for (int i = 1; i <= 10; i++) {
            total += i;
        }

        System.out.println("Сумма чисел от 1 до 10: " + total);
    }
}
`,
      },
      {
        id: "d24_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Изоляция переменных в блоках)",
        shortDesc: "Разграничение локальных переменных внутри условий if-else",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа рассчитывает скидку. В `main` объявлена переменная `int price = 1000;`.\nВнутри блока `if` рассчитай промежуточную скидку и итоговую цену, а затем напечатай:\n`Базовая цена: 1000 руб.`\n`Скидка применена: 150 руб.`\n`Итог: 850 руб.`",
        requirements: [
          "Используй правильные области видимости переменных.",
          "Выведи 3 строки.",
        ],
        exampleOutput: "Базовая цена: 1000 руб.\nСкидка применена: 150 руб.\nИтог: 850 руб.",
        starterCode: `public class Main {
    public static void main(String[] args) {
        int price = 1000;
        boolean hasCoupon = true;

        // TODO: рассчитай скидку и выведи итог
    }
}
`,
        tests: [
          {
            label: "Проверка расчета цены",
            expected: [
              "Базовая цена: 1000 руб.",
              "Скидка применена: 150 руб.",
              "Итог: 850 руб.",
            ],
          },
        ],
        hints: ["`int discount = 150; int finalPrice = price - discount;`"],
        solution: `public class Main {
    public static void main(String[] args) {
        int price = 1000;
        boolean hasCoupon = true;

        System.out.println("Базовая цена: " + price + " руб.");

        int discount = 0;
        if (hasCoupon) {
            discount = 150;
            System.out.println("Скидка применена: " + discount + " руб.");
        }

        int finalPrice = price - discount;
        System.out.println("Итог: " + finalPrice + " руб.");
    }
}
`,
      },
      {
        id: "d24_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Локальные переменные в методах)",
        shortDesc: "Докажи, что метод не меняет переменную снаружи",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай метод `public static void tryModify(int x)`:\nвнутри метода напиши `x = x + 100;` и напечатай `Внутри метода: x = <x>`.\nВ методе `main` объяви `int x = 10;`, вызови `tryModify(x)`, а затем напечатай `В main после вызова: x = <x>`.\nЭто наглядно демонстрирует, что переменная `x` в `main` не изменилась!",
        requirements: [
          "Создай метод `tryModify(int x)`.",
          "Выведи 2 строки.",
        ],
        exampleOutput: "Внутри метода: x = 110\nВ main после вызова: x = 10",
        starterCode: `public class Main {
    // TODO: объяви tryModify(int x)

    public static void main(String[] args) {
        int x = 10;
        // TODO: вызови tryModify(x) и напечатай x в main
    }
}
`,
        tests: [
          {
            label: "Проверка изоляции локальных переменных",
            expected: [
              "Внутри метода: x = 110",
              "В main после вызова: x = 10",
            ],
          },
        ],
        hints: ["Переменная `x` в методе `tryModify` живёт в своём собственном кадре стека."],
        solution: `public class Main {
    public static void tryModify(int x) {
        x = x + 100;
        System.out.println("Внутри метода: x = " + x);
    }

    public static void main(String[] args) {
        int x = 10;
        tryModify(x);
        System.out.println("В main после вызова: x = " + x);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 25: Java Recursion (Рекурсия)                                 */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 25,
    moduleId: 4,
    title: "Java Recursion: рекурсивные методы, базовый случай и стек",
    short: "Рекурсия, базовый случай, факториал и StackOverflowError",
    difficulty: "Средний",
    duration: "~2.5 часа",
    xp: 100,
    ready: true,
    topics: [
      "Что такое рекурсия: метод вызывает сам себя",
      "Два обязательных условия рекурсии: базовый случай (выход) и шаг",
      "Стек вызовов (Call Stack) и кадры стека",
      "Опасность бесконечной рекурсии: ошибка StackOverflowError",
      "Классический пример: сумма чисел от 1 до N",
      "Факториал числа: n! = n * (n - 1)!",
    ],
    videos: [
      { author: "Алишев", query: "Алишев Java рекурсия", note: "Рекурсия с нуля на понятных примерах" },
      { author: "Заур Трегулов", query: "Заур Трегулов рекурсия факториал стек вызовов Java", note: "Стек вызовов Call Stack и рекурсия" },
    ],
    theory: [
      { type: "h", text: "Что такое рекурсия и зачем она нужна?" },
      {
        type: "p",
        text: "**Рекурсия** — это способ решения задачи, при котором метод вызывает **сам себя**, но каждый раз для более простого или меньшего случая. Рекурсия незаменима при работе с древовидными структурами (папки на диске, DOM-деревья, бинарные деревья поиска, парсинг JSON) и классических алгоритмах вроде QuickSort, MergeSort или алгоритма Евклида.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: русская матрёшка",
        text: "Вы открываете самую большую куклу (основной вызов `factorial(4)`), внутри лежит кукла поменьше (`factorial(3)`), внутри — ещё меньше (`factorial(2)`), пока не упрётесь в неделимую самую маленькую матрёшку (`n <= 1`, **базовый случай**). После этого вы начинаете закрывать куклы в обратном порядке, возвращая результаты вверх.",
      },
      { type: "h", text: "Трассировка вызова factorial(4) на стеке" },
      {
        type: "p",
        text: "`factorial(4)` ждёт `4 * factorial(3)` -> `3 * factorial(2)` -> `2 * factorial(1)`. На `n == 1` возвращается `1`, затем вычисляются произведения `2 * 1 = 2`, `3 * 2 = 6`, и наконец `4 * 6 = 24`!",
      },
      { type: "h", text: "Два обязательных компонента любой рекурсии" },
      {
        type: "table",
        head: ["Компонент", "Назначение", "Что будет без него"],
        rows: [
          ["**1. Базовый случай (Base Case)**", "Условие выхода (`if (n <= 1) return 1;`), когда метод **не вызывает** сам себя, а сразу даёт ответ", "Бесконечная рекурсия и падение программы с **`StackOverflowError`**!"],
          ["**2. Рекурсивный шаг (Recursive Step)**", "Сведение задачи к меньшей подзадаче (`n - 1` или `a % b`), приближающей к базовому случаю", "Застревание на одном и том же аргументе -> тоже `StackOverflowError`"],
        ],
      },
      { type: "h", text: "Как работает Call Stack (Стек вызовов): погружение и всплытие" },
      {
        type: "p",
        text: "При каждом вызове метода JVM кладёт в стек памяти (Stack) новый фрейм с текущими параметрами. Метод `factorial(3)` не знает ответа сразу — он ставит своё выполнение «на паузу», ждёт `factorial(2)`, тот ждёт `factorial(1)` (базовый случай вернул `1`), и затем стек начинает **разворачиваться обратно**.",
      },
      {
        type: "code",
        caption: "Разбор рекурсии для countdown(n) и factorial(n)",
        code: `public class Main {
    // 1. Void-рекурсия: печатает до рекурсивного вызова (прямой ход)
    public static void countdown(int n) {
        if (n <= 0) {
            System.out.println("Поехали!");
            return; // Базовый случай!
        }
        System.out.println(n);
        countdown(n - 1); // Уменьшаем задачу на 1
    }

    // 2. Рекурсия с возвратом значения (используем long, т.к. 20! не влезает в int!):
    public static long factorial(int n) {
        if (n <= 1) return 1;            // Базовый случай: 0! = 1, 1! = 1
        return n * factorial(n - 1);     // Шаг: 4! = 4 * 3!
    }
}`,
      },
      { type: "h", text: "Алгоритм Евклида (нахождение НОД двух чисел)" },
      {
        type: "p",
        text: "Один из старейших и красивейших алгоритмов: наибольший общий делитель чисел `a` и `b` равен `a`, если `b == 0`, а иначе — `gcd(b, a % b)`. Остаток `a % b` стремительно уменьшает числа и гарантированно доводит `b` до нуля всего за несколько шагов!",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Ограничение глубины стека JVM",
        text: "По умолчанию стек вызовов в JVM вмещает около 5 000–10 000 вложенных вызовов. Если запустить `sum(1_000_000)` рекурсивно без перехода на цикл `for`/`while`, произойдёт `java.lang.StackOverflowError`.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Связь с заданиями дня",
        text: "Задание 1: оформите базовый случай `n <= 0` и рекурсивный шаг `countdown(n - 1)`. Задание 2: напишите `factorial(int n)` с типом `long` (так как факториал растёт быстрее диапазона `int`). Задание 3: реализуйте 2-строчный рекурсивный алгоритм Евклида `gcd(int a, int b)` с условием остановки `b == 0`.",
      },
    ],
    tasks: [
      {
        id: "d25_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Рекурсивный обратный отсчёт)",
        shortDesc: "Рекурсивный метод countdown(n) до 1 и печать «Поехали!»",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай рекурсивный метод `public static void countdown(int n)`.\n- Если `n <= 0`, метод печатает `Поехали!` и завершается (`return;`).\n- Иначе метод печатает `n`, а затем вызывает `countdown(n - 1)`.\nВ `main` считай число (например 5) и запусти обратный отсчет.",
        requirements: [
          "Используй рекурсивный метод.",
          "Выведи числа и финальную фразу.",
        ],
        exampleInput: "3",
        exampleOutput: "3\n2\n1\nПоехали!",
        sampleInput: "3",
        starterCode: `import java.util.Scanner;

public class Main {
    // TODO: объяви рекурсивный метод countdown(int n)

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        // TODO: вызови countdown(n)
    }
}
`,
        tests: [
          {
            label: "Отсчет от 3",
            stdin: "3\n",
            expected: [
              "3",
              "2",
              "1",
              "Поехали!",
            ],
          },
        ],
        requiredCode: [{ pattern: "countdown\\s*\\(", message: "Рекурсивно вызови countdown(n - 1)" }],
        hints: ["`if (n <= 0) { System.out.println(\"Поехали!\"); return; }`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void countdown(int n) {
        if (n <= 0) {
            System.out.println("Поехали!");
            return;
        }
        System.out.println(n);
        countdown(n - 1);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        countdown(n);
    }
}
`,
      },
      {
        id: "d25_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Рекурсивный факториал n!)",
        shortDesc: "Вычисли факториал n! = n * factorial(n - 1)",
        difficulty: "Средний",
        xp: 35,
        description:
          "Факториал числа `n!` — это произведение всех чисел от 1 до `n`. По определению: `0! = 1`, `1! = 1`.\nСоздай рекурсивный метод `public static long factorial(int n)`:\n- Базовый случай: `if (n <= 1) return 1;`\n- Рекурсивный шаг: `return n * factorial(n - 1);`\nВ `main` считай число `n` (например 5) и выведи:\n`Факториал <n>! = <результат>`",
        requirements: [
          "Используй рекурсию для вычисления факториала.",
          "Возвращаемый тип должен быть `long`.",
        ],
        exampleInput: "5",
        exampleOutput: "Факториал 5! = 120",
        sampleInput: "5",
        starterCode: `import java.util.Scanner;

public class Main {
    // TODO: объяви рекурсивный метод factorial(int n)

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: вызови factorial(n) и напечатай
    }
}
`,
        tests: [
          { label: "5! = 120", stdin: "5\n", expected: ["Факториал 5! = 120"] },
          { label: "6! = 720", stdin: "6\n", expected: ["Факториал 6! = 720"] },
        ],
        requiredCode: [{ pattern: "(?:long|int)\\s+factorial\\s*\\(", message: "Объяви long factorial(int n)" }],
        hints: ["`if (n <= 1) return 1L; return n * factorial(n - 1);`"],
        solution: `import java.util.Scanner;

public class Main {
    public static long factorial(int n) {
        if (n <= 1) {
            return 1L;
        }
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println("Факториал " + n + "! = " + factorial(n));
    }
}
`,
      },
      {
        id: "d25_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Алгоритм Евклида: НОД)",
        shortDesc: "Рекурсивный поиск наибольшего общего делителя двух чисел",
        difficulty: "Средний",
        xp: 40,
        description:
          "Алгоритм Евклида для нахождения наибольшего общего делителя (НОД / GCD) двух чисел `a` и `b`:\n- Если `b == 0`, то `НОД(a, b) = a` (базовый случай)\n- Иначе `НОД(a, b) = НОД(b, a % b)` (рекурсивный шаг)\nСоздай метод `public static int gcd(int a, int b)` и выведи в `main`:\n`НОД: <результат>`",
        requirements: [
          "Используй рекурсивный алгоритм Евклида.",
          "Выведи 1 строку.",
        ],
        exampleInput: "48 18",
        exampleOutput: "НОД: 6",
        sampleInput: "48\n18",
        starterCode: `import java.util.Scanner;

public class Main {
    // TODO: объяви рекурсивный метод gcd(int a, int b)

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();

        // TODO: вызови gcd(a, b) и напечатай
    }
}
`,
        tests: [
          { label: "48 и 18 -> 6", stdin: "48\n18\n", expected: ["НОД: 6"] },
          { label: "100 и 25 -> 25", stdin: "100\n25\n", expected: ["НОД: 25"] },
        ],
        requiredCode: [{ pattern: "int\\s+gcd\\s*\\(", message: "Объяви int gcd(int a, int b)" }],
        hints: ["`if (b == 0) return a; return gcd(b, a % b);`"],
        solution: `import java.util.Scanner;

public class Main {
    public static int gcd(int a, int b) {
        if (b == 0) {
            return a;
        }
        return gcd(b, a % b);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println("НОД: " + gcd(a, b));
    }
}
`,
      },
    ],
  }),
];
