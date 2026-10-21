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
  /*  DAY 1                                                              */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 1,
    moduleId: 1,
    title: "Как работает JVM, первая программа и Scanner",
    short: "JDK, JVM, байткод и ввод с клавиатуры",
    difficulty: "Лёгкий",
    duration: "~1.5 часа",
    xp: 100,
    ready: true,
    topics: ["JDK / JRE / JVM", "javac и байткод", "public static void main", "System.out.println", "Scanner", "Античит"],
    videos: [
      { author: "Алишев", query: "Алишев Java урок 1 установка JDK первая программа", note: "Установка и Hello World" },
      { author: "Алишев", query: "Алишев Java ввод с клавиатуры Scanner", note: "Чтение данных из консоли" },
      { author: "Заур Трегулов", query: "Заур Трегулов JDK JRE JVM что это", note: "Как устроена платформа" },
    ],
    theory: [
      { type: "h", text: "Путь кода: от .java до процессора" },
      {
        type: "p",
        text: "Java — компилируемый **и** интерпретируемый язык одновременно. Ты пишешь исходник `Main.java`, компилятор `javac` превращает его в **байткод** (`Main.class`), а виртуальная машина **JVM** исполняет этот байткод на любой ОС. Горячие участки JVM дополнительно компилирует в машинный код с помощью **JIT-компилятора** — поэтому Java быстрая.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия",
        text: "Байткод — это ноты, а JVM — музыкант. Одни и те же ноты сыграет пианист в Ташкенте, Москве или Берлине. Так работает принцип **Write Once, Run Anywhere**.",
      },
      {
        type: "table",
        head: ["Аббревиатура", "Что это", "Кому нужно"],
        rows: [
          ["JVM", "Виртуальная машина, исполняющая байткод", "Всем, кто запускает Java"],
          ["JRE", "JVM + стандартные библиотеки", "Пользователям программ"],
          ["JDK", "JRE + компилятор javac + инструменты", "Разработчикам (тебе!)"],
        ],
      },
      { type: "h", text: "Анатомия первой программы" },
      {
        type: "code",
        caption: "Main.java",
        code: `public class Main {                          // класс — контейнер для кода
    public static void main(String[] args) { // точка входа в программу
        System.out.println("Hello, Java!");  // вывод строки + перенос
        System.out.print("Без переноса ");   // вывод без переноса
        System.out.println(2 + 3);           // 5
    }
}`,
      },
      {
        type: "list",
        items: [
          "Имя публичного класса совпадает с именем файла: `Main` → `Main.java`.",
          "`main` — метод, с которого JVM начинает выполнение. Сигнатуру нужно запомнить дословно.",
          "Каждая инструкция заканчивается `;`, а блоки кода оборачиваются в `{ }`.",
          "Java чувствительна к регистру: `system.out` ≠ `System.out`.",
        ],
      },
      { type: "h", text: "Ввод с клавиатуры: Scanner" },
      {
        type: "p",
        text: "Чтобы программа могла «слушать» пользователя, используем класс `Scanner` из пакета `java.util`. Он читает данные из стандартного потока ввода `System.in`.",
      },
      {
        type: "code",
        code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        String city = scanner.nextLine(); // читает всю строку
        int year = scanner.nextInt();     // читает целое число
        double gpa = scanner.nextDouble(); // читает дробное число

        System.out.println("Город: " + city + ", год: " + year);
    }
}`,
      },
      {
        type: "callout",
        variant: "warning",
        title: "Классическая ловушка",
        text: "После `nextInt()` в буфере остаётся символ переноса строки. Если сразу вызвать `nextLine()`, он вернёт пустую строку. Решение — вызвать лишний `scanner.nextLine()` после чтения числа или читать строку первой.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Как вводить данные в песочнице",
        text: "Открой вкладку **stdin** под редактором и впиши входные данные — каждое значение с новой строки. Они попадут в `System.in` при запуске.",
      },
    ],
    tasks: [
      {
        id: "d1_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Визитка разработчика)",
        shortDesc: "Базовый вывод данных через System.out.println",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Выведи в консоль визитку будущего Java Junior разработчика ровно в 3 строки: имя, специализацию и статус.",
        requirements: [
          "Первая строка: `Разработчик: Java Junior`",
          "Вторая строка: `Стек: Java, Spring Boot, PostgreSQL`",
          "Третья строка: `Цель: 2026 год`",
        ],
        exampleOutput: "Разработчик: Java Junior\nСтек: Java, Spring Boot, PostgreSQL\nЦель: 2026 год",
        starterCode: `public class Main {
    public static void main(String[] args) {
        // TODO: выведи три строки визитки через System.out.println
    }
}
`,
        tests: [
          {
            label: "Проверка точного формата визитки",
            expected: [
              "Разработчик: Java Junior",
              "Стек: Java, Spring Boot, PostgreSQL",
              "Цель: 2026 год",
            ],
          },
        ],
        requiredCode: [{ pattern: "System\\.out\\.println", message: "Используй System.out.println" }],
        hints: ["Напиши 3 вызова `System.out.println(...)` с точным текстом из задания."],
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
          "2) `Тебе <возраст> лет` (или `Вам <возраст> лет`, также принимается просто число возраста).\n\n" +
          "💡 **Интерактивный терминал (как в IntelliJ IDEA):**\n" +
          "Нажми «Запустить» ▶️ — если в коде есть `Scanner`, терминал будет ждать ввода данных с клавиатуры! Вводи любое имя (Мухаммад, Ибрагим, Алекс) и год в строке ❯ внизу терминала.",
        requirements: [
          "Используй `Scanner` для чтения данных из `System.in`.",
          "Сначала прочитай имя через `nextLine()` (или `next()`), затем год рождения через `nextInt()`.",
          "Выведи приветствие: `Привет, <имя>!`",
          "Выведи возраст: `Тебе <возраст> лет` (или `Вам <возраст> лет` / просто возраст).",
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
          {
            label: "Тест 4: Мария, 1999",
            stdin: "Мария\n1999\n",
            expected: [
              "Привет, Мария!|Привет, Мария|Привет Мария",
              "Тебе 27|Вам 27|будет 27|возраст 27|возраст: 27|27 лет|27",
            ],
          },
        ],
        requiredCode: [
          { pattern: "new\\s+Scanner\\s*\\(\\s*System\\.in\\s*\\)", message: "Создай объект Scanner: new Scanner(System.in)" },
          { pattern: "(nextLine|next)\\s*\\(", message: "Используй scanner.nextLine() для чтения строки" },
          { pattern: "nextInt\\s*\\(", message: "Используй scanner.nextInt() для чтения года" },
        ],
        hints: [
          "Объяви имя: `String name = scanner.nextLine();`",
          "Объяви год рождения: `int birthYear = scanner.nextInt();`",
          "Посчитай возраст: `int age = 2026 - birthYear;`",
          "Выведи приветствие: `System.out.println(\"Привет, \" + name + \"!\");`",
          "Выведи возраст: `System.out.println(\"Тебе \" + age + \" лет\");` (или `System.out.println(\"Вам \" + age + \" лет\");`).",
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
          "Напиши программу для расчета учебной нагрузки студента на курсе Java. Программа считывает:\n1) Имя студента (строка)\n2) Часов практики в день (целое число hoursPerDay)\n3) Дней учебы в неделю (целое число daysPerWeek)\nПрограмма вычисляет часы практики за неделю (`hoursPerDay * daysPerWeek`) и за год из 52 недель (`weekly * 52`), а затем выводит результат в строгом формате.",
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
          {
            label: "Тест 3: Бобур (2 ч/день, 4 дн/нед)",
            stdin: "Бобур\n2\n4\n",
            expected: [
              "Студент: Бобур",
              "Часов в неделю: 8",
              "Часов в год: 416",
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
  /*  DAY 2                                                              */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 2,
    moduleId: 1,
    title: "Примитивные типы данных, память и кастинг",
    short: "8 примитивов, stack vs heap, приведение типов",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["byte, short, int, long", "float, double", "char, boolean", "Stack и Heap", "Расширение и сужение типов", "Целочисленное деление и %"],
    videos: [
      { author: "Алишев", query: "Алишев Java переменные примитивные типы данных", note: "Переменные и типы" },
      { author: "Заур Трегулов", query: "Заур Трегулов примитивные типы данных приведение типов Java", note: "Кастинг и переполнение" },
    ],
    theory: [
      { type: "h", text: "Переменная — именованная ячейка памяти" },
      {
        type: "p",
        text: "Java — язык со **статической типизацией**: тип переменной указывается при объявлении и больше не меняется. Компилятор проверяет типы заранее и ловит ошибки до запуска программы.",
      },
      {
        type: "table",
        head: ["Тип", "Размер", "Диапазон / пример", "Когда использовать"],
        rows: [
          ["byte", "1 байт", "-128 … 127", "Файлы, сетевые пакеты"],
          ["short", "2 байта", "-32 768 … 32 767", "Почти не используется"],
          ["int", "4 байта", "≈ ±2.1 млрд", "Тип по умолчанию для целых"],
          ["long", "8 байт", "≈ ±9.2 × 10¹⁸, суффикс L", "Время в мс, большие суммы"],
          ["float", "4 байта", "3.14f, ~7 знаков", "Графика, экономия памяти"],
          ["double", "8 байт", "3.14, ~15 знаков", "Тип по умолчанию для дробных"],
          ["char", "2 байта", "'A', '\\u0041'", "Один символ Unicode"],
          ["boolean", "—", "true / false", "Флаги и условия"],
        ],
      },
      { type: "h", text: "Где живут данные: Stack и Heap" },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия",
        text: "**Stack** — это стопка листков на столе: быстро положить, быстро убрать, но места мало. Там хранятся локальные примитивы и ссылки. **Heap** — большой склад: там лежат объекты (`String`, массивы, твои классы), а в стеке хранится лишь «номер ячейки» на складе — ссылка.",
      },
      {
        type: "code",
        code: `int age = 20;               // значение 20 лежит прямо в стеке
String name = "Java";       // в стеке — ссылка, сам объект — в куче
long big = 9_000_000_000L;  // подчёркивания для читаемости, L обязателен
char letter = 'J';
boolean isStudent = true;`,
      },
      { type: "h", text: "Приведение типов (casting)" },
      {
        type: "list",
        items: [
          "**Расширение** (widening) — автоматическое и безопасное: `int → long → float → double`.",
          "**Сужение** (narrowing) — только явно, через `(тип)`: возможна потеря данных.",
          "При делении двух `int` дробная часть **отбрасывается**: `7 / 2 == 3`.",
          "Остаток от деления — оператор `%`: `7 % 2 == 1`.",
        ],
      },
      {
        type: "code",
        code: `int a = 7, b = 2;
System.out.println(a / b);           // 3   — целочисленное деление
System.out.println((double) a / b);  // 3.5 — сначала кастим, потом делим
System.out.println((double) (a / b));// 3.0 — поздно, дробь уже потеряна!

double price = 9.99;
int rounded = (int) price;           // 9 — дробная часть отброшена

int max = Integer.MAX_VALUE;
System.out.println(max + 1);         // -2147483648 — переполнение!`,
      },
    ],
    tasks: [
      {
        id: "d2_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Приведение типов и деление)",
        shortDesc: "Практика с кастингом int в double и округлением",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Программа получает два целых числа x и y. Выведи их целочисленное деление (`x / y`), честное дробное деление (`(double) x / y`) и остаток от деления (`x % y`).",
        requirements: [
          "Выведи `Целочисленно: <результат>`",
          "Выведи `Дробно: <результат>`",
          "Выведи `Остаток: <результат>`",
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
        id: "d2_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Конвертер времени и среднее)",
        shortDesc: "Секунды в часы, минуты, секунды и честное среднее",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа получает три целых числа: количество **секунд**, затем числа **a** и **b**. Переведи секунды в часы, минуты и секунды, а затем выведи среднее арифметическое `a` и `b` как дробное число.",
        requirements: [
          "Прочитай три `int` через `Scanner`.",
          "Используй операторы `/` и `%` для перевода времени.",
          "Выведи строку формата `<ч> ч <м> мин <с> сек` — например `1 ч 2 мин 5 сек`.",
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
          { label: "60 сек; 4 и 4", stdin: "60\n4\n4\n", expected: ["0 ч 1 мин 0 сек", "Среднее: 4.0"] },
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
        id: "d2_t3",
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
          { label: "250, 10%, 2%", stdin: "250\n10\n2\n", expected: ["Скидка: 25.0", "К оплате: 225.0", "Кэшбэк: 4.5"] },
        ],
        requiredCode: [{ pattern: "double", message: "Используй тип double для расчета сумм" }],
        hints: [
          "`double discount = (double) price * discountPercent / 100;`",
          "`double finalPrice = price - discount;`",
          "`double cashback = finalPrice * cashbackPercent / 100;`",
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
  /*  DAY 3                                                              */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 3,
    moduleId: 1,
    title: "Условные операторы if-else и switch expressions",
    short: "Ветвления, логика и современный switch",
    difficulty: "Лёгкий",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["if / else if / else", "&&, ||, !", "Тернарный оператор", "switch expressions (Java 14+)", "equals для строк"],
    videos: [
      { author: "Алишев", query: "Алишев Java условный оператор if else", note: "Ветвления" },
      { author: "Заур Трегулов", query: "Заур Трегулов switch Java", note: "switch и его ловушки" },
    ],
    theory: [
      { type: "h", text: "if / else — развилка на дороге" },
      {
        type: "p",
        text: "Условие внутри `if` должно иметь тип `boolean`. Ветки проверяются **сверху вниз**, выполняется первая подходящая — остальные пропускаются.",
      },
      {
        type: "code",
        code: `int temperature = 18;

if (temperature >= 30) {
    System.out.println("Жарко");
} else if (temperature >= 15) {
    System.out.println("Тепло");   // выполнится эта ветка
} else {
    System.out.println("Холодно");
}`,
      },
      {
        type: "table",
        head: ["Оператор", "Смысл", "Пример"],
        rows: [
          ["&&", "И (оба истинны)", "age >= 18 && hasTicket"],
          ["||", "ИЛИ (хотя бы один)", "isAdmin || isOwner"],
          ["!", "НЕ (инверсия)", "!isBlocked"],
          ["== / !=", "Равно / не равно (для примитивов)", "x == 0"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Строки сравниваем через equals",
        text: "`==` сравнивает ссылки в памяти. Для строк ВСЕГДА используй `\"admin\".equals(role)`.",
      },
      { type: "h", text: "switch expressions (Java 14+)" },
      {
        type: "code",
        code: `int month = 7;
String season = switch (month) {
    case 12, 1, 2 -> "Зима";
    case 3, 4, 5  -> "Весна";
    case 6, 7, 8  -> "Лето";
    case 9, 10, 11 -> "Осень";
    default -> "Ошибка";
};`,
      },
    ],
    tasks: [
      {
        id: "d3_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Проверка четности и знака)",
        shortDesc: "Простые ветвления if-else",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Программа принимает целое число n. Выведи `Положительное` / `Отрицательное` / `Ноль`, а также на второй строке `Чётное` или `Нечётное` (для 0 — Чётное).",
        requirements: ["Выведи знак числа", "Выведи четность числа"],
        exampleInput: "-4",
        exampleOutput: "Отрицательное\nЧётное",
        sampleInput: "-4",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: знак и чётность
    }
}
`,
        tests: [
          { label: "-4", stdin: "-4\n", expected: ["Отрицательное", "Четное"] },
          { label: "7", stdin: "7\n", expected: ["Положительное", "Нечетное"] },
          { label: "0", stdin: "0\n", expected: ["Ноль", "Четное"] },
        ],
        requiredCode: [{ pattern: "\\bif\\s*\\(", message: "Используй if-else" }],
        hints: ["`if (n > 0) ... else if (n < 0) ... else ...`", "`if (n % 2 == 0) ...`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        if (n > 0) {
            System.out.println("Положительное");
        } else if (n < 0) {
            System.out.println("Отрицательное");
        } else {
            System.out.println("Ноль");
        }

        if (n % 2 == 0) {
            System.out.println("Чётное");
        } else {
            System.out.println("Нечётное");
        }
    }
}
`,
      },
      {
        id: "d3_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Электронный журнал)",
        shortDesc: "if-else для оценок и switch expressions для дней",
        difficulty: "Лёгкий",
        xp: 35,
        description:
          "Программа получает **балл** студента (0–100) и **номер дня недели** (1–7). Выставь буквенную оценку через `if-else`, а тип дня определи через **switch expression**.",
        requirements: [
          "Балл < 0 или > 100 → `Ошибка: некорректный балл`",
          "90–100 → `Оценка: A`, 75–89 → `Оценка: B`, 60–74 → `Оценка: C`, 0–59 → `Оценка: F`",
          "Дни 1–5 → `Будний день`, 6 и 7 → `Выходной`, иначе → `Нет такого дня`",
          "Тип дня вычисли через `switch` со стрелками `->`.",
        ],
        exampleInput: "95\n6",
        exampleOutput: "Оценка: A\nВыходной",
        sampleInput: "95\n6",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int score = scanner.nextInt();
        int day = scanner.nextInt();

        // TODO: оценка и switch day
    }
}
`,
        tests: [
          { label: "95 баллов, день 6", stdin: "95\n6\n", expected: ["Оценка: A", "Выходной"] },
          { label: "74 балла, день 3", stdin: "74\n3\n", expected: ["Оценка: C", "Будний день"] },
          { label: "120 баллов, день 9", stdin: "120\n9\n", expected: ["Ошибка: некорректный балл", "Нет такого дня"] },
        ],
        requiredCode: [
          { pattern: "switch\\s*\\([^)]*\\)\\s*\\{[\\s\\S]*->", message: "Используй switch expression со стрелками (->)" },
          { pattern: "\\bif\\s*\\(", message: "Используй if-else для выставления оценки" },
        ],
        hints: ["Используй `switch (day) { case 1, 2, 3, 4, 5 -> \"Будний день\"; ... }`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int score = scanner.nextInt();
        int day = scanner.nextInt();

        if (score < 0 || score > 100) {
            System.out.println("Ошибка: некорректный балл");
        } else if (score >= 90) {
            System.out.println("Оценка: A");
        } else if (score >= 75) {
            System.out.println("Оценка: B");
        } else if (score >= 60) {
            System.out.println("Оценка: C");
        } else {
            System.out.println("Оценка: F");
        }

        String dayType = switch (day) {
            case 1, 2, 3, 4, 5 -> "Будний день";
            case 6, 7 -> "Выходной";
            default -> "Нет такого дня";
        };
        System.out.println(dayType);
    }
}
`,
      },
      {
        id: "d3_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Калькулятор тарифа такси)",
        shortDesc: "Сложное ветвление с промокодом и ночным тарифом",
        difficulty: "Средний",
        xp: 40,
        description:
          "Напиши алгоритм тарификации поездки на такси. Программа считывает:\n1) Расстояние поездки в км `distance` (int)\n2) Класс поездки `tariffClass` (int: 1 - Эконом, 2 - Комфорт, 3 - Бизнес)\n3) Время суток `hour` (int от 0 до 23)\nТарифы за 1 км:\n- 1 (Эконом): 20 руб/км, базовая посадка 100 руб.\n- 2 (Комфорт): 35 руб/км, посадка 150 руб.\n- 3 (Бизнес): 60 руб/км, посадка 300 руб.\nЕсли время `hour` ночное (с 23:00 до 05:00 включительно), начисляется ночная надбавка +20% к сумме.",
        requirements: [
          "Используй `switch` для определения базовой цены и стоимости километра.",
          "Используй `if` для проверки ночного времени (`hour >= 23 || hour <= 5`).",
          "Выведи `Тариф: <Эконом|Комфорт|Бизнес>`",
          "Выведи `Итого: <сумма>`",
        ],
        exampleInput: "10\n2\n14",
        exampleOutput: "Тариф: Комфорт\nИтого: 500.0",
        sampleInput: "10\n2\n14",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int distance = scanner.nextInt();
        int tariffClass = scanner.nextInt();
        int hour = scanner.nextInt();

        // TODO: рассчитай тариф поездки
    }
}
`,
        tests: [
          { label: "10 км, Комфорт, день", stdin: "10\n2\n14\n", expected: ["Тариф: Комфорт", "Итого: 500.0"] },
          { label: "10 км, Эконом, ночь", stdin: "10\n1\n23\n", expected: ["Тариф: Эконом", "Итого: 360.0"] },
          { label: "5 км, Бизнес, день", stdin: "5\n3\n10\n", expected: ["Тариф: Бизнес", "Итого: 600.0"] },
        ],
        requiredCode: [{ pattern: "switch", message: "Используй оператор switch" }],
        hints: ["Эконом: `100 + distance * 20`. Ночь: `sum * 1.2`."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int distance = scanner.nextInt();
        int tariffClass = scanner.nextInt();
        int hour = scanner.nextInt();

        String name;
        double cost;

        switch (tariffClass) {
            case 1 -> {
                name = "Эконом";
                cost = 100 + distance * 20.0;
            }
            case 2 -> {
                name = "Комфорт";
                cost = 150 + distance * 35.0;
            }
            case 3 -> {
                name = "Бизнес";
                cost = 300 + distance * 60.0;
            }
            default -> {
                name = "Неизвестный";
                cost = 0;
            }
        }

        if (hour >= 23 || hour <= 5) {
            cost *= 1.2;
        }

        System.out.println("Тариф: " + name);
        System.out.println("Итого: " + cost);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAYS 4 TO 7 (CYCLING, ARRAYS, SPRINT, METHODS)                     */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 4,
    moduleId: 1,
    title: "Циклы for, while и break/continue",
    short: "Повторение действий и управление циклом",
    difficulty: "Средний",
    duration: "~2.5 часа",
    xp: 100,
    ready: true,
    topics: ["for", "while и do-while", "break и continue", "Вложенные циклы", "Переполнение и long"],
    videos: [
      { author: "Алишев", query: "Алишев Java циклы for while", note: "Циклы с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов циклы break continue Java", note: "Управление циклами" },
    ],
    theory: [
      { type: "h", text: "Зачем нужны циклы" },
      {
        type: "p",
        text: "Цикл повторяет блок кода, пока условие истинно. Без циклов пришлось бы писать `println` сто раз.",
      },
      {
        type: "code",
        caption: "for — когда известно количество повторений",
        code: `for (int i = 1; i <= 5; i++) {
    System.out.print(i + " ");   // 1 2 3 4 5
}`,
      },
      {
        type: "code",
        caption: "while — когда известно условие",
        code: `int balance = 1000;
while (balance < 2000) {
    balance += 100;
}`,
      },
    ],
    tasks: [
      {
        id: "d4_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Таблица умножения)",
        shortDesc: "Простой цикл for для числа n",
        difficulty: "Лёгкий",
        xp: 25,
        description: "Программа считывает целое число n и выводит таблицу умножения от 1 до 5 в формате `<n> x <i> = <res>`.",
        requirements: ["Используй цикл for от 1 до 5", "Формат: `n x i = res`"],
        exampleInput: "3",
        exampleOutput: "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15",
        sampleInput: "3",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: цикл for от 1 до 5
    }
}
`,
        tests: [
          { label: "n = 3", stdin: "3\n", expected: ["3 x 1 = 3", "3 x 5 = 15"] },
          { label: "n = 7", stdin: "7\n", expected: ["7 x 1 = 7", "7 x 5 = 35"] },
        ],
        requiredCode: [{ pattern: "\\bfor\\s*\\(", message: "Используй цикл for" }],
        hints: ["`for (int i = 1; i <= 5; i++) { System.out.println(n + \" x \" + i + \" = \" + (n * i)); }`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        for (int i = 1; i <= 5; i++) {
            System.out.println(n + " x " + i + " = " + (n * i));
        }
    }
}
`,
      },
      {
        id: "d4_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Математический тренажёр)",
        shortDesc: "Сумма, факториал, четные числа и степень двойки",
        difficulty: "Средний",
        xp: 35,
        description:
          "Программа получает целое число **n** (1–20) и выводит четыре результата, используя циклы.",
        requirements: [
          "`Сумма: <x>` — сумма чисел от 1 до n.",
          "`Факториал: <x>` — произведение чисел от 1 до n (используй `long`).",
          "`Чётные: <числа>` — все чётные числа от 1 до n через пробел.",
          "`Степень двойки: <x>` — первая степень двойки, которая **строго больше** n.",
        ],
        exampleInput: "5",
        exampleOutput: "Сумма: 15\nФакториал: 120\nЧётные: 2 4\nСтепень двойки: 8",
        sampleInput: "5",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: сумма, факториал, четные, степень двойки
    }
}
`,
        tests: [
          { label: "n = 5", stdin: "5\n", expected: ["Сумма: 15", "Факториал: 120", "Четные: 2 4", "Степень двойки: 8"] },
          { label: "n = 10", stdin: "10\n", expected: ["Сумма: 55", "Факториал: 3628800", "Степень двойки: 16"] },
        ],
        requiredCode: [
          { pattern: "\\bfor\\s*\\(", message: "Используй for" },
          { pattern: "\\bwhile\\s*\\(", message: "Используй while" },
          { pattern: "\\blong\\b", message: "Используй тип long для факториала" },
        ],
        hints: ["Факториал: `long fact = 1; for(...) fact *= i;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        int sum = 0;
        long factorial = 1;
        for (int i = 1; i <= n; i++) {
            sum += i;
            factorial *= i;
        }
        System.out.println("Сумма: " + sum);
        System.out.println("Факториал: " + factorial);

        System.out.print("Чётные: ");
        for (int i = 1; i <= n; i++) {
            if (i % 2 != 0) continue;
            System.out.print(i + " ");
        }
        System.out.println();

        int power = 1;
        while (power <= n) {
            power *= 2;
        }
        System.out.println("Степень двойки: " + power);
    }
}
`,
      },
      {
        id: "d4_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Инвестиционный калькулятор)",
        shortDesc: "Сложный процент через цикл while",
        difficulty: "Средний",
        xp: 40,
        description:
          "Инвестор вкладывает начальную сумму `startCapital`. Каждый год капитал увеличивается на `percent` процентов. Программа считывает:\n1) Начальный капитал `startCapital` (double)\n2) Годовой процент `percent` (double, например 10.0)\n3) Желаемую целевую сумму `targetCapital` (double)\nЧерез цикл `while` посчитай, за сколько полных лет капитал превысит цель, и выведи `Лет: <количество>` и `Итоговый капитал: <сумма>` (округли до целого int).",
        requirements: [
          "Используй цикл `while`",
          "Выведи `Лет: <лет>`",
          "Выведи `Итоговый капитал: <капитал>`",
        ],
        exampleInput: "1000\n10\n2000",
        exampleOutput: "Лет: 8\nИтоговый капитал: 2143",
        sampleInput: "1000\n10\n2000",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double capital = scanner.nextDouble();
        double percent = scanner.nextDouble();
        double target = scanner.nextDouble();

        // TODO: цикл while до достижения цели
    }
}
`,
        tests: [
          { label: "1000, 10%, цель 2000", stdin: "1000\n10\n2000\n", expected: ["Лет: 8", "Итоговый капитал: 2143"] },
          { label: "500, 20%, цель 1000", stdin: "500\n20\n1000\n", expected: ["Лет: 4", "Итоговый капитал: 1036"] },
        ],
        requiredCode: [{ pattern: "\\bwhile\\s*\\(", message: "Используй цикл while" }],
        hints: ["`while (capital < target) { capital += capital * percent / 100; years++; }`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double capital = scanner.nextDouble();
        double percent = scanner.nextDouble();
        double target = scanner.nextDouble();

        int years = 0;
        while (capital < target) {
            capital += capital * (percent / 100.0);
            years++;
        }

        System.out.println("Лет: " + years);
        System.out.println("Итоговый капитал: " + (int) Math.round(capital));
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAYS 5, 6, 7                                                       */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 5,
    moduleId: 1,
    title: "Массивы (одномерные и двумерные)",
    short: "Индексы, обход, поиск min/max, матрицы",
    difficulty: "Средний",
    duration: "~2.5 часа",
    xp: 100,
    ready: true,
    topics: ["Объявление и инициализация", "Индексы и length", "for-each", "Arrays.toString", "Двумерные массивы"],
    videos: [
      { author: "Алишев", query: "Алишев Java массивы", note: "Одномерные массивы" },
      { author: "Заур Трегулов", query: "Заур Трегулов многомерные массивы Java", note: "Двумерные массивы" },
    ],
    theory: [
      { type: "h", text: "Массив — ряд ячеек в памяти" },
      {
        type: "p",
        text: "Массив хранит фиксированное количество элементов одного типа. Индексация начинается с нуля: `arr[0]`.",
      },
      {
        type: "code",
        code: `int[] numbers = new int[5];
int[] primes = {2, 3, 5, 7, 11};
System.out.println(primes.length); // 5`,
      },
    ],
    tasks: [
      {
        id: "d5_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Количество четных чисел)",
        shortDesc: "Подсчет элементов в массиве",
        difficulty: "Лёгкий",
        xp: 25,
        description: "Считай размер массива n, затем n чисел. Посчитай и выведи количество четных чисел в массиве.",
        requirements: ["Выведи `Чётных: <количество>`"],
        exampleInput: "5\n1 2 3 4 5",
        exampleOutput: "Чётных: 2",
        sampleInput: "5\n1 2 3 4 5",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        // TODO: заполни и посчитай чётные
    }
}
`,
        tests: [{ label: "1 2 3 4 5", stdin: "5\n1 2 3 4 5\n", expected: ["Четных: 2"] }],
        requiredCode: [{ pattern: "new\\s+int\\s*\\[", message: "Используй массив" }],
        hints: ["В цикле `if (x % 2 == 0) count++;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        int count = 0;
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
            if (arr[i] % 2 == 0) count++;
        }
        System.out.println("Чётных: " + count);
    }
}
`,
      },
      {
        id: "d5_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Анализатор чисел)",
        shortDesc: "Мин, макс, сумма и обратный порядок",
        difficulty: "Средний",
        xp: 35,
        description:
          "Программа получает число **n**, а затем **n целых чисел**. Сохрани их в массив и выведи статистику.",
        requirements: [
          "`Мин: <x>` и `Макс: <x>` — минимальный и максимальный элементы.",
          "`Сумма: <x>` — сумма всех элементов.",
          "`Наоборот: <числа>` — элементы в обратном порядке через пробел.",
        ],
        exampleInput: "5\n3 9 1 7 5",
        exampleOutput: "Мин: 1\nМакс: 9\nСумма: 25\nНаоборот: 5 7 1 9 3",
        sampleInput: "5\n3 9 1 7 5",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];

        // TODO: min, max, sum, reverse
    }
}
`,
        tests: [
          { label: "3 9 1 7 5", stdin: "5\n3 9 1 7 5\n", expected: ["Мин: 1", "Макс: 9", "Сумма: 25", "Наоборот: 5 7 1 9 3"] },
          { label: "Отрицательные", stdin: "4\n-2 -8 -1 -5\n", expected: ["Мин: -8", "Макс: -1", "Сумма: -16"] },
        ],
        requiredCode: [{ pattern: "new\\s+int\\s*\\[", message: "Используй массив" }],
        hints: ["Стартуй с `int min = numbers[0]; int max = numbers[0];`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) {
            numbers[i] = scanner.nextInt();
        }

        int min = numbers[0];
        int max = numbers[0];
        int sum = 0;
        for (int x : numbers) {
            if (x < min) min = x;
            if (x > max) max = x;
            sum += x;
        }
        System.out.println("Мин: " + min);
        System.out.println("Макс: " + max);
        System.out.println("Сумма: " + sum);

        System.out.print("Наоборот: ");
        for (int i = n - 1; i >= 0; i--) {
            System.out.print(numbers[i] + " ");
        }
        System.out.println();
    }
}
`,
      },
      {
        id: "d5_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Главная диагональ матрицы)",
        shortDesc: "Работа с двумерным массивом n x n",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Программа считывает размер квадратной матрицы n, затем n x n целых чисел. Посчитай сумму элементов главной диагонали (где индекс строки равен индексу столбца `matrix[i][i]`) и сумму побочной диагонали `matrix[i][n - 1 - i]`.",
        requirements: [
          "Создай двумерный массив `int[][] matrix = new int[n][n];`",
          "Выведи `Главная диагональ: <сумма>`",
          "Выведи `Побочная диагональ: <сумма>`",
        ],
        exampleInput: "3\n1 2 3\n4 5 6\n7 8 9",
        exampleOutput: "Главная диагональ: 15\nПобочная диагональ: 15",
        sampleInput: "3\n1 2 3\n4 5 6\n7 8 9",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[][] matrix = new int[n][n];

        // TODO: заполни и посчитай диагонали
    }
}
`,
        tests: [
          { label: "Матрица 3x3", stdin: "3\n1 2 3\n4 5 6\n7 8 9\n", expected: ["Главная диагональ: 15", "Побочная диагональ: 15"] },
          { label: "Матрица 2x2", stdin: "2\n10 20\n30 40\n", expected: ["Главная диагональ: 50", "Побочная диагональ: 50"] },
        ],
        requiredCode: [{ pattern: "int\\s*\\[\\s*\\]\\s*\\[\\s*\\]", message: "Используй двумерный массив int[][]" }],
        hints: ["`mainDiag += matrix[i][i];`", "`secondaryDiag += matrix[i][n - 1 - i];`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[][] matrix = new int[n][n];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                matrix[i][j] = scanner.nextInt();
            }
        }

        int mainDiag = 0;
        int secondaryDiag = 0;
        for (int i = 0; i < n; i++) {
            mainDiag += matrix[i][i];
            secondaryDiag += matrix[i][n - 1 - i];
        }

        System.out.println("Главная диагональ: " + mainDiag);
        System.out.println("Побочная диагональ: " + secondaryDiag);
    }
}
`,
      },
    ],
  }),

  withDefaults({
    day: 6,
    moduleId: 1,
    title: "Спринт практики: банкомат и алгоритмы",
    short: "Собираем всё вместе: жадный алгоритм выдачи купюр",
    difficulty: "Средний",
    duration: "~3 часа",
    xp: 100,
    ready: true,
    topics: ["Декомпозиция задачи", "Жадный алгоритм", "Валидация ввода"],
    videos: [
      { author: "Алишев", query: "Алишев Java практика задачи для начинающих", note: "Разбор задач" },
      { author: "Заур Трегулов", query: "Заур Трегулов Java задачи на циклы и массивы", note: "Практика" },
    ],
    theory: [
      { type: "h", text: "Жадный алгоритм выдачи сдачи" },
      {
        type: "p",
        text: "Жадный алгоритм на каждом шаге берет максимальный доступный номинал.",
      },
    ],
    tasks: [
      {
        id: "d6_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Проверка кратности)",
        shortDesc: "Валидация суммы для банкомата",
        difficulty: "Лёгкий",
        xp: 25,
        description: "Банкомат принимает только суммы, кратные 100. Если сумма > 0 и делится на 100 — выведи `Сумма корректна: <сумма>`, иначе `Ошибка: сумма не кратна 100`.",
        requirements: ["Проверь `amount > 0 && amount % 100 == 0`"],
        exampleInput: "500",
        exampleOutput: "Сумма корректна: 500",
        sampleInput: "500",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int amount = scanner.nextInt();
        // TODO
    }
}
`,
        tests: [
          { label: "500", stdin: "500\n", expected: ["Сумма корректна: 500"] },
          { label: "250", stdin: "250\n", expected: ["Ошибка: сумма не кратна 100"] },
        ],
        requiredCode: [{ pattern: "%\\s*100", message: "Используй оператор % 100" }],
        hints: ["`if (amount > 0 && amount % 100 == 0)`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int amount = scanner.nextInt();
        if (amount > 0 && amount % 100 == 0) {
            System.out.println("Сумма корректна: " + amount);
        } else {
            System.out.println("Ошибка: сумма не кратна 100");
        }
    }
}
`,
      },
      {
        id: "d6_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Банкомат)",
        shortDesc: "Жадная выдача купюр 5000, 2000, 1000, 500, 200, 100",
        difficulty: "Средний",
        xp: 35,
        description:
          "Банкомат выдаёт купюры номиналом **5000, 2000, 1000, 500, 200 и 100**. Программа получает запрошенную сумму и выводит, какие купюры выдать, используя минимальное их количество.",
        requirements: [
          "Храни номиналы в массиве `int[] bills = {5000, 2000, 1000, 500, 200, 100};`",
          "Если сумма ≤ 0 или не кратна 100 → `Ошибка: сумма должна быть положительной и кратной 100`",
          "Для каждого используемого номинала выведи строку `<номинал> x <количество>`.",
          "В конце выведи `Всего купюр: <количество>`.",
        ],
        exampleInput: "7300",
        exampleOutput: "5000 x 1\n2000 x 1\n200 x 1\n100 x 1\nВсего купюр: 4",
        sampleInput: "7300",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int amount = scanner.nextInt();
        int[] bills = {5000, 2000, 1000, 500, 200, 100};

        // TODO
    }
}
`,
        tests: [
          { label: "7300", stdin: "7300\n", expected: ["5000 x 1", "2000 x 1", "200 x 1", "100 x 1", "Всего купюр: 4"] },
          { label: "250", stdin: "250\n", expected: ["Ошибка: сумма должна быть положительной и кратной 100"] },
        ],
        requiredCode: [{ pattern: "\\{\\s*5000\\s*,", message: "Храни номиналы купюр в массиве" }],
        hints: ["`int count = amount / bill; amount %= bill;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int amount = scanner.nextInt();
        int[] bills = {5000, 2000, 1000, 500, 200, 100};

        if (amount <= 0 || amount % 100 != 0) {
            System.out.println("Ошибка: сумма должна быть положительной и кратной 100");
            return;
        }

        int total = 0;
        for (int bill : bills) {
            int count = amount / bill;
            if (count > 0) {
                System.out.println(bill + " x " + count);
                amount %= bill;
                total += count;
            }
        }
        System.out.println("Всего купюр: " + total);
    }
}
`,
      },
      {
        id: "d6_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Валидатор контрольной суммы)",
        shortDesc: "Контрольная сумма последовательности цифр",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Программа считывает целое число n (количество цифр), затем n цифр от 0 до 9. Вычисли контрольную сумму по правилу: четные позиции умножаются на 1, нечетные позиции (1-indexed) умножаются на 2. Если произведение > 9, вычитается 9. Выведи `Контрольная сумма: <сумма>`.",
        requirements: ["Используй массив или цикл для подсчета", "Выведи `Контрольная сумма: <сумма>`"],
        exampleInput: "4\n1 2 3 4",
        exampleOutput: "Контрольная сумма: 11",
        sampleInput: "4\n1 2 3 4",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        // TODO
    }
}
`,
        tests: [
          { label: "1 2 3 4", stdin: "4\n1 2 3 4\n", expected: ["Контрольная сумма: 11"] },
          { label: "7 9 9 2", stdin: "4\n7 9 9 2\n", expected: ["Контрольная сумма: 24"] },
        ],
        requiredCode: [{ pattern: "\\bfor\\s*\\(", message: "Используй цикл" }],
        hints: ["Нечетная 1-я позиция: `val = d * 2; if (val > 9) val -= 9;`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int sum = 0;
        for (int i = 1; i <= n; i++) {
            int d = scanner.nextInt();
            if (i % 2 != 0) {
                int val = d * 2;
                if (val > 9) val -= 9;
                sum += val;
            } else {
                sum += d;
            }
        }
        System.out.println("Контрольная сумма: " + sum);
    }
}
`,
      },
    ],
  }),

  withDefaults({
    day: 7,
    moduleId: 1,
    title: "Буферный день: статические методы и повторение",
    short: "Закрепляем модуль 1 и выносим код в методы",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["Статические методы", "Параметры и return", "Простые числа", "Палиндромы"],
    videos: [
      { author: "Алишев", query: "Алишев Java методы", note: "Методы с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов методы Java return параметры", note: "Сигнатура и return" },
    ],
    theory: [
      { type: "h", text: "Методы — кирпичики программ" },
      {
        type: "p",
        text: "Метод — это именованный блок кода с параметрами и возвращаемым значением через `return`.",
      },
      {
        type: "code",
        code: `static int square(int x) {
    return x * x;
}`,
      },
    ],
    tasks: [
      {
        id: "d7_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Метод max3)",
        shortDesc: "Статический метод для максимума из трех чисел",
        difficulty: "Лёгкий",
        xp: 25,
        description: "Создай статический метод `static int max3(int a, int b, int c)`, который возвращает наибольшее из трех чисел. В `main` вызови его и выведи `Максимум: <число>`.",
        requirements: ["Объяви метод `static int max3(int a, int b, int c)`", "Выведи `Максимум: <число>`"],
        exampleInput: "10 50 30",
        exampleOutput: "Максимум: 50",
        sampleInput: "10 50 30",
        starterCode: `import java.util.Scanner;

public class Main {
    static int max3(int a, int b, int c) {
        // TODO
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        int c = scanner.nextInt();

        System.out.println("Максимум: " + max3(a, b, c));
    }
}
`,
        tests: [{ label: "10 50 30", stdin: "10 50 30\n", expected: ["Максимум: 50"] }],
        requiredCode: [{ pattern: "static\\s+int\\s+max3", message: "Объяви static int max3" }],
        hints: ["`return Math.max(a, Math.max(b, c));`"],
        solution: `import java.util.Scanner;

public class Main {
    static int max3(int a, int b, int c) {
        return Math.max(a, Math.max(b, c));
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        int c = scanner.nextInt();
        System.out.println("Максимум: " + max3(a, b, c));
    }
}
`,
      },
      {
        id: "d7_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Простые числа и палиндромы)",
        shortDesc: "Методы isPrime и isPalindrome",
        difficulty: "Средний",
        xp: 35,
        description:
          "Программа получает число **n**. Вынеси логику в два статических метода: `isPrime(int number)` и `isPalindrome(int number)`.",
        requirements: [
          "Создай метод `static boolean isPrime(int number)`.",
          "Создай метод `static boolean isPalindrome(int number)`.",
          "`Простые: <числа>` — все простые числа от 2 до n через пробел.",
          "`Количество: <x>` — сколько простых чисел найдено.",
          "`Палиндром: да` или `Палиндром: нет`.",
        ],
        exampleInput: "13",
        exampleOutput: "Простые: 2 3 5 7 11 13\nКоличество: 6\nПалиндром: нет",
        sampleInput: "13",
        starterCode: `import java.util.Scanner;

public class Main {
    static boolean isPrime(int number) {
        // TODO
        return false;
    }

    static boolean isPalindrome(int number) {
        // TODO
        return false;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        // TODO
    }
}
`,
        tests: [
          { label: "n = 13", stdin: "13\n", expected: ["Простые: 2 3 5 7 11 13", "Количество: 6", "Палиндром: нет"] },
          { label: "n = 121", stdin: "121\n", expected: ["Количество: 30", "Палиндром: да"] },
        ],
        requiredCode: [
          { pattern: "static\\s+boolean\\s+isPrime", message: "Создай static boolean isPrime" },
          { pattern: "static\\s+boolean\\s+isPalindrome", message: "Создай static boolean isPalindrome" },
        ],
        hints: ["`isPrime`: проверка делителей от 2 до `d * d <= number`."],
        solution: `import java.util.Scanner;

public class Main {
    static boolean isPrime(int number) {
        if (number < 2) return false;
        for (int d = 2; d * d <= number; d++) {
            if (number % d == 0) return false;
        }
        return true;
    }

    static boolean isPalindrome(int number) {
        int original = number;
        int reversed = 0;
        while (number > 0) {
            reversed = reversed * 10 + number % 10;
            number /= 10;
        }
        return original == reversed;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        int count = 0;
        System.out.print("Простые: ");
        for (int i = 2; i <= n; i++) {
            if (isPrime(i)) {
                System.out.print(i + " ");
                count++;
            }
        }
        System.out.println();
        System.out.println("Количество: " + count);
        System.out.println("Палиндром: " + (isPalindrome(n) ? "да" : "нет"));
    }
}
`,
      },
      {
        id: "d7_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Валидатор паролей)",
        shortDesc: "Комплексный метод валидации надежности пароля",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Напиши статический метод `static boolean isStrongPassword(String password)`.\nПароль считается надежным, если:\n1) Длина не менее 8 символов\n2) Содержит хотя бы одну заглавную букву (Character.isUpperCase)\n3) Содержит хотя бы одну строчную букву (Character.isLowerCase)\n4) Содержит хотя бы одну цифру (Character.isDigit)\nВыведи `Пароль надежный: да` или `Пароль надежный: нет`.",
        requirements: [
          "Создай метод `static boolean isStrongPassword(String password)`",
          "Выведи `Пароль надежный: да` или `нет`",
        ],
        exampleInput: "Java2026!",
        exampleOutput: "Пароль надежный: да",
        sampleInput: "Java2026!",
        starterCode: `import java.util.Scanner;

public class Main {
    static boolean isStrongPassword(String password) {
        // TODO
        return false;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String pass = scanner.nextLine();
        System.out.println("Пароль надежный: " + (isStrongPassword(pass) ? "да" : "нет"));
    }
}
`,
        tests: [
          { label: "Java2026!", stdin: "Java2026!\n", expected: ["Пароль надежный: да"] },
          { label: "weak", stdin: "weak\n", expected: ["Пароль надежный: нет"] },
          { label: "NoDigitsHere", stdin: "NoDigitsHere\n", expected: ["Пароль надежный: нет"] },
        ],
        requiredCode: [{ pattern: "static\\s+boolean\\s+isStrongPassword", message: "Создай static boolean isStrongPassword" }],
        hints: ["Проверь длину: `password.length() >= 8` и флаги в цикле по символам."],
        solution: `import java.util.Scanner;

public class Main {
    static boolean isStrongPassword(String password) {
        if (password.length() < 8) return false;
        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            if (Character.isLowerCase(c)) hasLower = true;
            if (Character.isDigit(c)) hasDigit = true;
        }

        return hasUpper && hasLower && hasDigit;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String pass = scanner.nextLine();
        System.out.println("Пароль надежный: " + (isStrongPassword(pass) ? "да" : "нет"));
    }
}
`,
      },
    ],
  }),
];
