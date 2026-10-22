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
      { type: "h", text: "Что такое метод в Java?" },
      {
        type: "p",
        text: "Метод — это блок кода, выполняющий определённое действие и запускаемый только тогда, когда его **вызывают**. Методы позволяют разбить большую программу на независимые, переиспользуемые кирпичики.",
      },
      {
        type: "code",
        caption: "Создание и вызов метода (W3Schools)",
        code: `public class Main {
    // 1. Объявляем собственный метод
    public static void myMethod() {
        System.out.println("Я метод myMethod, меня вызвали!");
    }

    public static void main(String[] args) {
        // 2. Вызываем метод из main
        myMethod();
        myMethod(); // можно вызывать сколько угодно раз!
    }
}`,
      },
      { type: "h", text: "Анатомия объявления метода" },
      {
        type: "list",
        items: [
          "`public` — метод открыт и доступен для вызова.",
          "`static` — метод принадлежит классу `Main`, его можно вызывать напрямую из статического `main` без создания объекта `new Main()`.",
          "`void` — метод выполняет инструкции и **ничего не возвращает** в качестве результата.",
          "`myMethod()` — имя метода, за которым следуют круглые скобки `()` для передачи параметров.",
          "`{ ... }` — тело метода, содержащее исполняемые инструкции.",
        ],
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
      { type: "h", text: "Возвращаемые значения и оператор return (W3Schools)" },
      {
        type: "p",
        text: "Если метод должен вернуть результат вызывающему коду, вместо `void` указывается конкретный тип возвращаемого значения (`int`, `double`, `boolean`, `String` и т.д.), а в теле метода используется оператор `return`:",
      },
      {
        type: "code",
        caption: "Метод с возвращаемым значением",
        code: `public class Main {
    // Метод возвращает целое число int
    public static int add(int x, int y) {
        return x + y;
    }

    public static void main(String[] args) {
        int result = add(5, 3);
        System.out.println("Сумма: " + result); // 8
    }
}`,
      },
      { type: "h", text: "Передача параметров по значению (Pass by Value)" },
      {
        type: "callout",
        variant: "warning",
        title: "В Java ВСЕ параметры передаются по значению!",
        text: "Когда ты передаёшь переменную в метод, метод получает её **копию**. Изменение значения аргумента внутри метода никак не влияет на исходную переменную снаружи!",
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
          "Создай метод `public static String getBmiStatus(double weightKg, double heightM)`.\nИндекс массы тела рассчитывается по формуле: `bmi = weightKg / (heightM * heightM)`.\n- Если `bmi < 18.5`, возвращается строка `\"Дефицит массы\"`\n- Если `bmi >= 18.5 && bmi < 25.0`, возвращается `\"Норма\"`\n- Иначе возвращается `\"Избыточная масса\"`\nВ `main` считай вес и рост и выведи статус.",
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
          { label: "70 кг, 1.75 м (22.86 -> Норма)", stdin: "70.0\n1.75\n", expected: ["Статус ИМТ: Норма"] },
          { label: "50 кг, 1.80 м (15.43 -> Дефицит)", stdin: "50.0\n1.80\n", expected: ["Статус ИМТ: Дефицит массы"] },
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
      { type: "h", text: "Что такое перегрузка методов? (W3Schools)" },
      {
        type: "p",
        text: "При перегрузке методов несколько методов могут иметь **одно и то же имя**, но обязаны иметь **разные параметры** (разное количество или разные типы данных):",
      },
      {
        type: "code",
        caption: "Пример перегрузки методов (W3Schools)",
        code: `public class Main {
    // 1. Метод для сложения двух int
    public static int plusMethod(int x, int y) {
        return x + y;
    }

    // 2. Метод для сложения двух double
    public static double plusMethod(double x, double y) {
        return x + y;
    }

    public static void main(String[] args) {
        int myNum1 = plusMethod(8, 5);
        double myNum2 = plusMethod(4.3, 6.26);

        System.out.println("int: " + myNum1);       // 13
        System.out.println("double: " + myNum2); // 10.559999999999999
    }
}`,
      },
      { type: "h", text: "Правило сигнатуры" },
      {
        type: "callout",
        variant: "warning",
        title: "Важно запомнить",
        text: "Два метода НЕ могут отличаться только типом возвращаемого значения! Если у методов одинаковое имя и одинаковые типы параметров, компилятор выдаст ошибку `method already defined`, даже если один возвращает `int`, а второй `double`.",
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
      { type: "h", text: "Область видимости (Java Scope)" },
      {
        type: "p",
        text: "В Java переменные доступны только внутри той области (блока кода), в которой они были объявлены.",
      },
      {
        type: "code",
        caption: "Method Scope против Block Scope (W3Schools)",
        code: `public class Main {
    public static void main(String[] args) {
        // 1. Method Scope: переменная x доступна во всем методе main после объявления
        int x = 100;

        { // 2. Block Scope: блок внутри фигурных скобок
            int y = 50;
            System.out.println(x + y); // 150 (x виден, y виден)
        }

        // System.out.println(y); // ОШИБКА КОМПИЛЯЦИИ: y уничтожен при выходе из скобок!
    }
}`,
      },
      { type: "h", text: "Счетчики циклов for" },
      {
        type: "callout",
        variant: "warning",
        title: "Частая ошибка",
        text: "Если переменная объявлена в заголовке цикла `for (int i = 0; i < 5; i++)`, она существует **только внутри этого цикла**. После закрывающей фигурной скобки `}` переменная `i` больше не существует!",
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
      { type: "h", text: "Что такое рекурсия? (W3Schools)" },
      {
        type: "p",
        text: "Рекурсия — это техника, при которой метод вызывает сам себя для решения более простой подзадачи. Как в цикле `while`, в рекурсии **всегда должно быть условие остановки (базовый случай)**, иначе программа переполнит память и выбросит ошибку `StackOverflowError`.",
      },
      {
        type: "code",
        caption: "Рекурсивное суммирование (W3Schools)",
        code: `public class Main {
    public static int sum(int k) {
        if (k > 0) {
            return k + sum(k - 1); // рекурсивный шаг
        } else {
            return 0;              // базовый случай (остановка)
        }
    }

    public static void main(String[] args) {
        int result = sum(10);
        System.out.println(result); // 55 (10 + 9 + ... + 1)
    }
}`,
      },
      { type: "h", text: "Как работает стек вызовов (Call Stack)" },
      {
        type: "list",
        items: [
          "`sum(3)` вызывает `3 + sum(2)`",
          "`sum(2)` вызывает `2 + sum(1)`",
          "`sum(1)` вызывает `1 + sum(0)`",
          "`sum(0)` возвращает `0` (базовый случай!)",
          "Затем результаты сворачиваются назад: `1 + 0 = 1` -> `2 + 1 = 3` -> `3 + 3 = 6`.",
        ],
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
        requiredCode: [{ pattern: "countdown\\s*\\(\\s*n\\s*-\\s*1\\s*\\)", message: "Рекурсивно вызови countdown(n - 1)" }],
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
        requiredCode: [{ pattern: "long\\s+factorial\\s*\\(", message: "Объяви long factorial(int n)" }],
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
