import type { LessonExtras } from "../types";
import {
  h, p, code, list, table, tip, warn, info, analogy,
  oracle, javadoc, baeldung, habr, leetcode, codingbat, book, link,
  JAVA_INTERVIEW_RU, PYTHON_TUTOR_JAVA, DEV_JAVA, METANIT_JAVA, ROADMAP_JAVA, VISUALGO,
} from "./helpers";

const r = String.raw;

export const module1Extras: Record<number, LessonExtras> = {
  /* ================================================================== */
  /*  DAY 1 — JVM, первая программа, Scanner                            */
  /* ================================================================== */
  1: {
    deepDive: [
      h("Что происходит внутри JVM при запуске"),
      p("Команда `java Main` запускает виртуальную машину, и она проходит несколько этапов. Знать их — обязательный минимум для собеседования на Junior."),
      list(
        "**Class Loader** — находит файл `Main.class` и загружает его в память. Классы грузятся лениво, только когда впервые понадобятся.",
        "**Bytecode Verifier** — проверяет, что байткод корректен и не ломает защиту памяти (например, нет перехода в середину инструкции).",
        "**Interpreter** — начинает выполнять байткод построчно. Запуск быстрый, но само выполнение медленное.",
        "**JIT-компилятор (C1/C2)** — замечает «горячие» методы (вызываемые тысячи раз) и компилирует их в машинный код процессора. После разогрева Java работает почти как C++.",
        "**Garbage Collector** — автоматически освобождает память от объектов, на которые больше никто не ссылается. В Java нет ручного `free()`.",
      ),
      table(
        ["Область памяти", "Что хранит", "Особенность"],
        ["Stack (стек)", "Локальные переменные, вызовы методов", "Свой у каждого потока, очищается сам при выходе из метода"],
        ["Heap (куча)", "Все объекты (`new ...`), массивы, строки", "Общая для всех потоков, чистится GC"],
        ["Metaspace", "Описание классов, методов, констант", "Растёт по мере загрузки классов"],
      ),
      h("Смотрим на байткод своими глазами"),
      p("Байткод — не магия. Утилита `javap` из JDK показывает инструкции, в которые превратился твой код:"),
      code(r`
javac Main.java        # компиляция → Main.class
java Main              # запуск байткода
java Main.java         # Java 11+: компиляция и запуск одной командой
javap -c Main          # дизассемблировать байткод и посмотреть инструкции
jshell                 # интерактивная консоль: пиши Java построчно без класса и main
`, "Терминал", "bash"),
      code(r`
// Фрагмент вывода javap -c для System.out.println("Hi"):
0: getstatic     #7   // Field java/lang/System.out:Ljava/io/PrintStream;
3: ldc           #13  // String Hi
5: invokevirtual #15  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
8: return
`, "javap -c Main", "text"),
      h("Почему main выглядит именно так"),
      table(
        ["Часть сигнатуры", "Зачем она нужна"],
        ["public", "JVM вызывает метод «снаружи» класса — он должен быть доступен"],
        ["static", "Метод вызывается без создания объекта: `Main.main(args)`"],
        ["void", "Метод ничего не возвращает. Код завершения задаётся через `System.exit(code)`"],
        ["String[] args", "Аргументы командной строки: `java Main hello 42` → `args[0] = \"hello\"`"],
      ),
      h("Вывод в консоль: print, println, printf"),
      code(r`
System.out.print("Без переноса");           // курсор остаётся на строке
System.out.println("С переносом");          // добавляет \n в конце
System.out.println("Табуляция:\tконец");    // \t — табуляция
System.out.println("Кавычки: \"Java\"");    // \" — кавычка внутри строки
System.out.printf("Имя: %s, возраст: %d, GPA: %.2f%n", "Али", 20, 3.756);
// Имя: Али, возраст: 20, GPA: 3.76
String s = String.format("%05d", 42);       // "00042" — добивка нулями
`, "Форматированный вывод"),
      table(
        ["Спецификатор", "Тип", "Пример"],
        ["%d", "Целое число", "printf(\"%d\", 42) → 42"],
        ["%f / %.2f", "Дробное (2 знака)", "printf(\"%.2f\", 3.14159) → 3.14"],
        ["%s", "Строка / любой объект", "printf(\"%s\", \"Java\") → Java"],
        ["%c", "Символ", "printf(\"%c\", 'A') → A"],
        ["%n", "Перенос строки (кроссплатформенный)", "лучше, чем \\n в printf"],
      ),
      h("Scanner: полный разбор"),
      table(
        ["Метод", "Что читает", "Где останавливается"],
        ["next()", "Одно слово", "На пробеле / переносе строки"],
        ["nextLine()", "Всю строку целиком", "На символе переноса (сам перенос съедает)"],
        ["nextInt() / nextLong()", "Целое число", "Сразу после числа (перенос остаётся в буфере!)"],
        ["nextDouble()", "Дробное число", "Зависит от локали: 3,14 или 3.14"],
        ["hasNextInt() / hasNext()", "Ничего не читает", "Проверяет, есть ли дальше число / токен"],
      ),
      code(r`
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);

        // Надёжный способ: читаем ВСЁ строками и парсим сами — ловушки nextInt+nextLine нет
        int age = Integer.parseInt(in.nextLine().trim());
        String city = in.nextLine();

        // Защита от неверного ввода
        if (in.hasNextInt()) {
            int year = in.nextInt();
            System.out.println("Год: " + year);
        } else {
            System.out.println("Ошибка: ожидалось число");
        }
    }
}
`, "Безопасное чтение ввода"),
      warn("InputMismatchException и NoSuchElementException", "Если пользователь ввёл `abc`, а ты вызвал `nextInt()` — программа упадёт с `InputMismatchException`. Если данных нет вовсе — `NoSuchElementException`. Проверяй ввод через `hasNextInt()` или оборачивай в `try/catch` (тема дня 19)."),
      h("Соглашения об именовании (Java Code Conventions)"),
      table(
        ["Что", "Стиль", "Пример"],
        ["Классы, интерфейсы", "PascalCase", "BankAccount, UserService"],
        ["Переменные, методы", "camelCase", "totalSum, calculateTax()"],
        ["Константы", "UPPER_SNAKE_CASE", "MAX_SIZE, PI"],
        ["Пакеты", "только строчные", "com.javaforge.bank"],
      ),
      h("Частые ошибки компиляции новичков"),
      list(
        "`';' expected` — забыта точка с запятой в конце инструкции.",
        "`cannot find symbol` — опечатка в имени (`Systen`, `scaner`) или переменная не объявлена.",
        "`class Main is public, should be declared in a file named Main.java` — имя файла не совпадает с именем класса.",
        "`reached end of file while parsing` — не закрыта фигурная скобка `}`.",
        "`unclosed string literal` — строка открыта `\"` и не закрыта (или закрыта `'`).",
      ),
      tip("Читай ошибку снизу вверх", "Компилятор указывает файл и номер строки: `Main.java:7: error: ...`. Иди сразу на эту строку и смотри на символ под знаком `^`. Исправляй **первую** ошибку — остальные часто являются её следствием."),
    ],
    interview: [
      { q: "Чем отличаются JDK, JRE и JVM?", a: "JVM — виртуальная машина, исполняющая байткод. JRE = JVM + стандартная библиотека классов (то, что нужно для запуска). JDK = JRE + инструменты разработчика: компилятор javac, javap, jshell, отладчик. Начиная с Java 11 отдельный JRE не распространяется — ставят JDK." },
      { q: "Что такое байткод и зачем он нужен?", a: "Промежуточный платформонезависимый набор инструкций для JVM, хранится в .class файлах. Позволяет скомпилировать код один раз и запускать на любой ОС, где есть JVM (принцип WORA — Write Once, Run Anywhere)." },
      { q: "Что такое JIT-компиляция?", a: "Just-In-Time — компиляция «горячих» участков байткода в машинный код прямо во время работы программы. Благодаря JIT Java после «прогрева» работает почти так же быстро, как нативные языки." },
      { q: "Почему метод main статический?", a: "JVM должна вызвать main до того, как будет создан хоть один объект. Статический метод принадлежит классу, а не объекту, поэтому его можно вызвать как Main.main(args) без new Main()." },
      { q: "Можно ли перегрузить метод main?", a: "Да, можно объявить main(int x) и т.д., но JVM в качестве точки входа вызовет только public static void main(String[] args)." },
    ],
    selfStudy: [
      "Установи JDK 21 (Temurin или Oracle) и IntelliJ IDEA Community. Проверь в терминале `java -version` и `javac -version`.",
      "Скомпилируй и запусти программу из терминала без IDE: `javac Main.java`, затем `java Main`.",
      "Выполни `javap -c Main` и найди в выводе инструкцию `invokevirtual` для `println`.",
      "Открой `jshell` и посчитай в нём `2 + 2 * 2`, `10 / 3`, `10 / 3.0` — сравни результаты.",
      "Передай аргументы командной строки: `java Main Ali 20` и выведи `args[0]` и `args.length`.",
      "Поэкспериментируй с `printf`: выведи таблицу умножения на 7 с выравниванием `%3d`.",
    ],
    resources: [
      oracle("getStarted/index.html", "Oracle Java Tutorial: Getting Started", "Официальный старт: первая программа и как она работает"),
      DEV_JAVA,
      baeldung("jvm-vs-jre-vs-jdk", "Baeldung: JVM vs JRE vs JDK", "Чётко и с картинками"),
      baeldung("java-main-method", "Baeldung: Java main() Method Explained"),
      baeldung("java-scanner", "Baeldung: Java Scanner", "Все методы Scanner с примерами"),
      javadoc("java/util/Scanner"),
      link("docs", "JShell — интерактивная консоль Java", "https://docs.oracle.com/en/java/javase/21/jshell/introduction-jshell.html", "Как быстро проверять куски кода", "en"),
      link("tool", "IntelliJ IDEA: Getting Started", "https://www.jetbrains.com/help/idea/getting-started.html", "Первые шаги в IDE, которой пользуются 80% Java-разработчиков", "en"),
      METANIT_JAVA,
      habr("как работает JVM"),
      book("Кэти Сьерра, Берт Бейтс — «Изучаем Java» (Head First Java)", "Лучшая первая книга: легко, с картинками и юмором"),
      book("Герберт Шилдт — «Java. Руководство для начинающих»", "Классический подробный учебник"),
    ],
  },

  /* ================================================================== */
  /*  DAY 2 — Примитивы, память, кастинг                                */
  /* ================================================================== */
  2: {
    deepDive: [
      h("Полная таблица примитивных типов"),
      table(
        ["Тип", "Размер", "Диапазон", "По умолчанию", "Литерал"],
        ["byte", "1 байт", "-128 … 127", "0", "(byte) 10"],
        ["short", "2 байта", "-32 768 … 32 767", "0", "(short) 1000"],
        ["int", "4 байта", "≈ -2.1 млрд … 2.1 млрд", "0", "42, 1_000_000"],
        ["long", "8 байт", "≈ ±9.2 × 10¹⁸", "0L", "9_000_000_000L"],
        ["float", "4 байта", "~7 значащих цифр", "0.0f", "3.14f"],
        ["double", "8 байт", "~15–16 значащих цифр", "0.0", "3.14, 1e-9"],
        ["char", "2 байта", "0 … 65 535 (символ Unicode)", "'\\u0000'", "'A', '\\u0041'"],
        ["boolean", "JVM-зависимо", "true / false", "false", "true"],
      ),
      info("Значения по умолчанию", "Значения по умолчанию получают только **поля класса** и **элементы массива**. Локальную переменную внутри метода нужно обязательно инициализировать, иначе — ошибка компиляции `variable might not have been initialized`."),
      h("Литералы, о которых мало кто знает"),
      code(r`
int million = 1_000_000;       // подчёркивания для читаемости (Java 7+)
int hex     = 0xFF;            // 255 в шестнадцатеричной системе
int bin     = 0b1010;          // 10 в двоичной системе
long big    = 3_000_000_000L;  // без L — ошибка: число не влезает в int
float f     = 2.5f;            // без f — ошибка: 2.5 по умолчанию double
char c      = 'A';
char unicode = '\u0410';       // 'А' (русская)
var count   = 10;              // Java 10+: тип int выводится автоматически
`, "Литералы"),
      h("Переполнение (overflow) — тихая ошибка"),
      p("Java **не** выбрасывает исключение при переполнении целых чисел — значение просто «заворачивается» по кругу. Это классический источник багов в финансовых расчётах."),
      code(r`
int max = Integer.MAX_VALUE;           // 2147483647
System.out.println(max + 1);           // -2147483648 (!!!)

long ok = (long) max + 1;              // 2147483648 — считаем в long
int safe = Math.addExact(max, 1);      // выбросит ArithmeticException — ошибка видна сразу

int seconds = 365 * 24 * 60 * 60 * 1000; // переполнение! результат отрицательный
long ms = 365L * 24 * 60 * 60 * 1000;    // L у первого множителя → всё считается в long
`, "Переполнение int"),
      h("Почему 0.1 + 0.2 ≠ 0.3"),
      p("`float` и `double` хранят числа в двоичном виде по стандарту IEEE 754. Многие десятичные дроби (0.1, 0.2) в двоичной системе — бесконечные, как 1/3 = 0.333… в десятичной. Поэтому появляется погрешность."),
      code(r`
System.out.println(0.1 + 0.2);            // 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3);     // false

// Сравнение дробных — только с допуском (epsilon)
double eps = 1e-9;
System.out.println(Math.abs((0.1 + 0.2) - 0.3) < eps); // true

// Деньги — только BigDecimal (или хранить в копейках в long)
import java.math.BigDecimal;
BigDecimal a = new BigDecimal("0.1");    // ВАЖНО: из строки, не из double!
BigDecimal b = new BigDecimal("0.2");
System.out.println(a.add(b));            // 0.3
`, "Точность чисел с плавающей точкой"),
      warn("Никогда не храни деньги в double", "В банковском и платёжном коде используют `BigDecimal` или целое число копеек/тийинов в `long`. На собеседовании это спрашивают почти всегда."),
      h("Целочисленное деление и остаток"),
      code(r`
System.out.println(7 / 2);      // 3   — дробная часть отбрасывается
System.out.println(7 / 2.0);    // 3.5 — один операнд double → результат double
System.out.println(-7 / 2);     // -3  — округление к нулю
System.out.println(-7 % 2);     // -1  — знак остатка = знаку делимого
System.out.println(Math.floorMod(-7, 2)); // 1 — «математический» остаток
System.out.println(5 / 0);      // ArithmeticException: / by zero
System.out.println(5.0 / 0);    // Infinity — для double исключения нет!
`, "Деление"),
      h("Приведение типов (casting)"),
      p("**Расширяющее** (widening) приведение происходит автоматически — данные не теряются: `byte → short → int → long → float → double`. **Сужающее** (narrowing) требует явного `(тип)` — ты берёшь ответственность за потерю данных."),
      code(r`
int i = 100;
long l = i;              // автоматически
double d = l;            // автоматически

double pi = 3.99;
int n = (int) pi;        // 3 — дробная часть ОТБРАСЫВАЕТСЯ, не округляется
long rounded = Math.round(pi); // 4 — честное округление

int big = 200;
byte b = (byte) big;     // -56 — старшие биты обрезаны

char ch = 'a';
int code = ch;           // 97 — код символа
char next = (char) (ch + 1); // 'b'
`, "Casting"),
      h("Продвижение типов в выражениях"),
      p("В арифметике `byte`, `short` и `char` сначала автоматически превращаются в `int`. Поэтому `byte + byte` даёт `int`:"),
      code(r`
byte a = 10, b = 20;
// byte c = a + b;       // ОШИБКА: результат a + b имеет тип int
byte c = (byte) (a + b); // ок
a += 5;                  // ок! составное присваивание содержит скрытый cast
`, "Type promotion"),
      h("Обёртки (Wrapper classes) и автоупаковка"),
      table(
        ["Примитив", "Обёртка", "Полезное"],
        ["int", "Integer", "Integer.parseInt(\"42\"), Integer.MAX_VALUE"],
        ["long", "Long", "Long.parseLong(...)"],
        ["double", "Double", "Double.parseDouble(...), Double.isNaN(x)"],
        ["char", "Character", "Character.isDigit(c), isLetter(c), toUpperCase(c)"],
        ["boolean", "Boolean", "Boolean.parseBoolean(\"true\")"],
      ),
      code(r`
Integer boxed = 42;           // autoboxing: int → Integer
int unboxed = boxed;          // unboxing: Integer → int

Integer a = 127, b = 127;
System.out.println(a == b);   // true  — значения -128..127 кэшируются
Integer x = 128, y = 128;
System.out.println(x == y);   // false — разные объекты!
System.out.println(x.equals(y)); // true — сравнивай обёртки через equals

Integer nothing = null;
int boom = nothing;           // NullPointerException при распаковке
`, "Integer cache — частый вопрос на собеседовании"),
      h("Инкремент: i++ против ++i"),
      code(r`
int i = 5;
int a = i++;   // a = 5, i = 6 — сначала вернуть, потом увеличить
int b = ++i;   // b = 7, i = 7 — сначала увеличить, потом вернуть
`, "Постфикс и префикс"),
      analogy("Типы как коробки", "`byte` — спичечный коробок, `long` — грузовой контейнер. Переложить из коробка в контейнер можно всегда (widening). Обратно — только если обрезать лишнее (narrowing), и Java заставляет тебя явно написать `(byte)`, чтобы ты осознавал риск."),
    ],
    interview: [
      { q: "Назови все примитивные типы Java и их размеры.", a: "byte (1 байт), short (2), int (4), long (8), float (4), double (8), char (2, Unicode), boolean (размер не специфицирован, логически 1 бит)." },
      { q: "Почему 0.1 + 0.2 != 0.3 и как правильно считать деньги?", a: "double хранит числа в двоичной форме IEEE 754, и 0.1 не представима точно — накапливается погрешность. Для денег используют BigDecimal (создавая из строки) или целые копейки в long." },
      { q: "Что выведет Integer a = 128, b = 128; a == b?", a: "false. == сравнивает ссылки, а Integer кэширует только диапазон -128..127. Обёртки нужно сравнивать через equals()." },
      { q: "Что такое расширяющее и сужающее приведение?", a: "Расширяющее (int → long → double) — автоматическое и безопасное. Сужающее (double → int, int → byte) — только явное через (тип), возможна потеря данных: дробная часть отбрасывается, старшие биты обрезаются." },
      { q: "Что произойдёт при Integer.MAX_VALUE + 1?", a: "Переполнение без исключения: получится Integer.MIN_VALUE (-2147483648). Для контроля используют Math.addExact или переходят на long/BigInteger." },
    ],
    selfStudy: [
      "Выведи `Integer.MAX_VALUE`, `Long.MAX_VALUE`, `Double.MAX_VALUE`, `Character.MAX_VALUE` и сравни.",
      "Посчитай количество миллисекунд в году сначала в `int`, потом в `long`. Найди, где произошло переполнение.",
      "Сложи `0.1` десять раз в цикле в `double` и в `BigDecimal` — сравни результаты.",
      "Выведи коды символов `'A'`, `'a'`, `'0'`, `'Я'` через `(int) c` и посмотри таблицу Unicode.",
      "Прочитай про `BigInteger` и посчитай `2^100` (подсказка: `BigInteger.TWO.pow(100)`).",
    ],
    resources: [
      oracle("java/nutsandbolts/datatypes.html", "Oracle: Primitive Data Types", "Официальная таблица типов и литералов"),
      oracle("java/nutsandbolts/operators.html", "Oracle: Operators", "Все операторы и их приоритеты"),
      baeldung("java-primitives", "Baeldung: Introduction to Java Primitives"),
      baeldung("java-type-casting", "Baeldung: Object Type Casting in Java"),
      baeldung("java-overflow-underflow", "Baeldung: Overflow and Underflow in Java"),
      baeldung("java-bigdecimal-biginteger", "Baeldung: BigDecimal and BigInteger"),
      link("article", "0.30000000000000004.com", "https://0.30000000000000004.com/", "Почему дроби «ломаются» во всех языках программирования", "en"),
      javadoc("java/math/BigDecimal"),
      javadoc("java/lang/Integer"),
      codingbat("Warmup-1", "Разминка: простые выражения и условия"),
      habr("числа с плавающей точкой IEEE 754"),
      book("Джошуа Блох — «Java: эффективное программирование» (Effective Java)", "Глава про примитивы vs обёртки и BigDecimal — must read"),
    ],
  },

  /* ================================================================== */
  /*  DAY 3 — if-else и switch                                           */
  /* ================================================================== */
  3: {
    deepDive: [
      h("Логические операторы и короткое замыкание"),
      table(
        ["Оператор", "Смысл", "Короткое замыкание?"],
        ["&&", "И (AND)", "Да — если слева false, правая часть НЕ вычисляется"],
        ["||", "ИЛИ (OR)", "Да — если слева true, правая часть НЕ вычисляется"],
        ["!", "НЕ (NOT)", "—"],
        ["& / |", "Побитовые И / ИЛИ (с boolean — без замыкания)", "Нет — вычисляются обе части"],
        ["^", "Исключающее ИЛИ (XOR)", "Нет"],
      ),
      code(r`
String name = null;
// Безопасно: если name == null, вызов name.length() не произойдёт
if (name != null && name.length() > 3) { ... }

// Упадёт с NullPointerException: & вычисляет обе части
if (name != null & name.length() > 3) { ... }

// Деление на ноль не случится благодаря &&
if (count != 0 && total / count > 10) { ... }
`, "Short-circuit evaluation"),
      tip("Законы де Моргана", "`!(a && b)` == `!a || !b`, а `!(a || b)` == `!a && !b`. Помогают упрощать запутанные условия вроде `if (!(age >= 18 && hasPassport))` → `if (age < 18 || !hasPassport)`."),
      h("Строки сравниваем через equals"),
      code(r`
String a = "java";
String b = new String("java");
System.out.println(a == b);              // false — разные объекты в памяти
System.out.println(a.equals(b));         // true  — одинаковое содержимое
System.out.println("JAVA".equalsIgnoreCase(a)); // true

String input = null;
// input.equals("yes")  → NullPointerException
"yes".equals(input);    // безопасно: false (литерал никогда не null)
`, "== против equals"),
      h("Тернарный оператор"),
      code(r`
int age = 20;
String status = age >= 18 ? "взрослый" : "несовершеннолетний";
int max = a > b ? a : b;

// Не злоупотребляй вложенными тернарниками — читать невозможно:
String grade = s >= 90 ? "A" : s >= 75 ? "B" : s >= 60 ? "C" : "F"; // лучше switch/if
`, "condition ? ifTrue : ifFalse"),
      h("Эволюция switch: от классики до Java 21"),
      code(r`
// 1) Классический switch — опасен «проваливанием» (fall-through)
switch (day) {
    case 1:
        System.out.println("Понедельник");
        break;               // забыл break → выполнится и следующий case!
    case 6:
    case 7:
        System.out.println("Выходной");
        break;
    default:
        System.out.println("Будний день");
}

// 2) Switch с стрелками (Java 14+) — без break и без проваливания
switch (day) {
    case 1 -> System.out.println("Понедельник");
    case 6, 7 -> System.out.println("Выходной");
    default -> System.out.println("Будний день");
}

// 3) Switch-выражение — возвращает значение
String type = switch (day) {
    case 6, 7 -> "Выходной";
    default -> {
        String t = "Будний";
        yield t + " день";   // yield — вернуть значение из блока
    }
};
`, "switch statement vs switch expression"),
      table(
        ["Тип в switch", "Поддержка"],
        ["int, short, byte, char", "Всегда"],
        ["Integer, Character и др. обёртки", "Да (распаковка)"],
        ["String", "Java 7+"],
        ["enum", "Да — компилятор проверит, что все значения покрыты (в switch-выражении)"],
        ["long, double, boolean", "Нет (до Java 21 pattern matching)"],
        ["Любой объект с паттернами", "Java 21: `case Integer i when i > 0 ->`"],
      ),
      h("Guard clauses — пиши плоский код"),
      p("Глубокая вложенность `if` — признак плохого кода («стрелка» вправо). Обрабатывай ошибочные случаи сразу и выходи раньше:"),
      code(r`
// Плохо: пирамида из if
if (user != null) {
    if (user.isActive()) {
        if (balance >= price) {
            buy();
        }
    }
}

// Хорошо: ранний выход (guard clauses)
if (user == null) return;
if (!user.isActive()) return;
if (balance < price) return;
buy();
`, "Ранний возврат"),
      h("Порядок проверок в диапазонах"),
      code(r`
// Ошибка: условие score >= 60 «съест» всех отличников
if (score >= 60) grade = "C";
else if (score >= 90) grade = "A";   // никогда не выполнится!

// Правильно: от самого строгого к самому мягкому
if (score >= 90) grade = "A";
else if (score >= 75) grade = "B";
else if (score >= 60) grade = "C";
else grade = "F";
`, "Порядок важен"),
      warn("Всегда ставь фигурные скобки", "`if (x > 0) a++; b++;` — здесь `b++` выполнится **всегда**, независимо от условия. Отступы не влияют на логику Java. Скобки `{ }` даже для одной строки — стандарт в индустрии (Google Java Style)."),
    ],
    interview: [
      { q: "Чем отличается && от &?", a: "&& — логическое И с коротким замыканием: если левая часть false, правая не вычисляется. & с boolean вычисляет обе части всегда (и ещё работает как побитовое И для чисел)." },
      { q: "Почему строки нельзя сравнивать через ==?", a: "== сравнивает ссылки (адреса объектов), а не содержимое. Две одинаковые строки могут быть разными объектами. Для сравнения содержимого — equals() или equalsIgnoreCase()." },
      { q: "Что такое fall-through в switch?", a: "Если в классическом switch не поставить break, выполнение «проваливается» в следующий case. Новый синтаксис с -> (Java 14+) этой проблемы не имеет." },
      { q: "Какие типы можно использовать в switch?", a: "byte, short, char, int, их обёртки, String (с Java 7) и enum. С Java 21 — любые объекты через pattern matching. long, float, double, boolean — нельзя в классическом switch." },
    ],
    selfStudy: [
      "Перепиши любую задачу дня с классического `switch` на switch-выражение со стрелками.",
      "Напиши программу «Високосный год»: год делится на 4, но не на 100, либо делится на 400.",
      "Реши задачу FizzBuzz для чисел 1..30 с помощью `if-else`.",
      "Найди в своём коде вложенность глубже 2 уровней и перепиши её через guard clauses.",
      "Изучи pattern matching для `switch` в Java 21 (`case String s ->`).",
    ],
    resources: [
      oracle("java/nutsandbolts/if.html", "Oracle: The if-then and if-then-else Statements"),
      oracle("java/nutsandbolts/switch.html", "Oracle: The switch Statement"),
      baeldung("java-switch", "Baeldung: A Guide to the Java switch Statement", "Включая switch expressions"),
      baeldung("java-ternary-operator", "Baeldung: Ternary Operator in Java"),
      baeldung("java-switch-pattern-matching", "Baeldung: Pattern Matching for Switch", "Современный switch Java 21"),
      codingbat("Logic-1", "Задачи на условия — отличная тренировка"),
      codingbat("Logic-2"),
      leetcode("fizz-buzz", "Fizz Buzz", "Классика собеседований"),
      habr("switch expressions Java"),
      link("article", "Google Java Style Guide", "https://google.github.io/styleguide/javaguide.html", "Стандарт оформления кода в Google: скобки, отступы, именование", "en"),
    ],
  },

  /* ================================================================== */
  /*  DAY 4 — Циклы                                                      */
  /* ================================================================== */
  4: {
    deepDive: [
      h("Какой цикл выбрать"),
      table(
        ["Цикл", "Когда использовать", "Пример"],
        ["for", "Число итераций известно заранее", "for (int i = 0; i < n; i++)"],
        ["while", "Повторять, пока условие истинно (заранее неизвестно сколько)", "while (balance < goal)"],
        ["do-while", "Тело должно выполниться хотя бы один раз", "меню программы, повторный ввод"],
        ["for-each", "Перебор всех элементов массива/коллекции без индекса", "for (int x : arr)"],
      ),
      code(r`
// Анатомия for: инициализация; условие; шаг
for (int i = 10; i > 0; i -= 2) {     // 10 8 6 4 2
    System.out.print(i + " ");
}

// do-while: меню, которое показывается минимум один раз
Scanner in = new Scanner(System.in);
int choice;
do {
    System.out.println("1 - Играть, 0 - Выход");
    choice = in.nextInt();
} while (choice != 0);
`, "Разные формы циклов"),
      h("Метки (labels) для вложенных циклов"),
      p("Обычный `break` выходит только из **внутреннего** цикла. Чтобы выйти сразу из нескольких — используют метку:"),
      code(r`
outer:
for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (i * j == 6) {
            System.out.println("Найдено: " + i + " * " + j);
            break outer;        // выход из ОБОИХ циклов
        }
        if (j > i) continue outer; // переход к следующей итерации внешнего цикла
    }
}
`, "break / continue с меткой"),
      h("Классические шаблоны циклов"),
      code(r`
// 1) Аккумулятор — сумма/произведение
int sum = 0;
for (int i = 1; i <= 100; i++) sum += i;        // 5050

// 2) Счётчик по условию
int evens = 0;
for (int i = 1; i <= 100; i++) if (i % 2 == 0) evens++;

// 3) Разбор числа по цифрам: % 10 даёт последнюю цифру, / 10 её отбрасывает
int n = 12345, digitSum = 0, reversed = 0;
while (n > 0) {
    int digit = n % 10;
    digitSum += digit;
    reversed = reversed * 10 + digit;
    n /= 10;
}
// digitSum = 15, reversed = 54321

// 4) Поиск с флагом — проверка на простое число
int x = 29;
boolean isPrime = x > 1;
for (int d = 2; d * d <= x; d++) {   // достаточно проверить до √x
    if (x % d == 0) { isPrime = false; break; }
}
`, "Шаблоны, которые встречаются постоянно"),
      tip("Оптимизация: до корня из n", "При проверке делителей достаточно идти до `√n`: если у числа есть делитель больше корня, то есть и парный меньше корня. Условие `d * d <= n` быстрее, чем `d <= Math.sqrt(n)`, и не требует дробей."),
      h("Ошибки на единицу (off-by-one)"),
      list(
        "`for (int i = 0; i <= arr.length; i++)` — последняя итерация выйдет за границу массива → `ArrayIndexOutOfBoundsException`.",
        "`for (int i = 1; i < 10; i++)` выполнится **9** раз, а не 10. Считай итерации: `конец - начало`.",
        "Перед тем как писать цикл, проверь на бумаге первую и последнюю итерацию.",
      ),
      h("Бесконечные циклы"),
      code(r`
while (true) {                 // намеренно бесконечный цикл
    String cmd = in.nextLine();
    if (cmd.equals("exit")) break;
    process(cmd);
}

int i = 0;
while (i < 10) {
    System.out.println(i);
    // забыли i++ → цикл никогда не закончится (Time Limit на платформе)
}
`, "while(true) + break — нормально; забытый шаг — баг"),
      h("Сложность алгоритмов: первое знакомство с Big O"),
      table(
        ["Код", "Сложность", "При n = 1 000 000"],
        ["Один цикл по n", "O(n) — линейная", "~10⁶ операций — мгновенно"],
        ["Цикл в цикле по n", "O(n²) — квадратичная", "~10¹² операций — часы!"],
        ["Деление n пополам в цикле", "O(log n)", "~20 операций"],
        ["Цикл до √n", "O(√n)", "~1000 операций"],
      ),
      p("Big O показывает, как растёт время работы при росте входных данных. Это основа для выбора алгоритмов и структур данных (подробнее в модуле 3)."),
      h("Область видимости переменной цикла"),
      code(r`
for (int i = 0; i < 3; i++) { }
// System.out.println(i);  // ОШИБКА: i существует только внутри for

int j;
for (j = 0; j < 3; j++) { }
System.out.println(j);     // 3 — объявлена снаружи, доступна после цикла
`, "Scope"),
      tip("Отладчик вместо println", "В IntelliJ поставь точку останова (клик слева от номера строки) и запусти **Debug**. Кнопкой **Step Over (F8)** проходи цикл по шагу и смотри значения переменных в окне Variables. Это главный навык для поиска ошибок в циклах."),
    ],
    interview: [
      { q: "Чем отличается while от do-while?", a: "while проверяет условие до выполнения тела — тело может не выполниться ни разу. do-while проверяет после — тело выполнится минимум один раз." },
      { q: "Как выйти из вложенного цикла сразу?", a: "С помощью метки: outer: for(...) { for(...) { break outer; } }. Альтернатива — вынести циклы в метод и сделать return." },
      { q: "Какова сложность двух вложенных циклов по n?", a: "O(n²). Если внутренний цикл идёт от i до n — всё равно O(n²) (n(n-1)/2 операций), константы в Big O отбрасываются." },
      { q: "Как перевернуть число без строк?", a: "В цикле: digit = n % 10; reversed = reversed * 10 + digit; n /= 10; пока n > 0." },
    ],
    selfStudy: [
      "Выведи таблицу умножения 9×9 вложенными циклами с выравниванием `printf(\"%4d\", ...)`.",
      "Найди все простые числа до 100 и посчитай их количество (должно быть 25).",
      "Проверь число на палиндром (12321) без перевода в строку.",
      "Напиши игру «Угадай число»: программа загадывает `(int)(Math.random() * 100) + 1`, пользователь угадывает с подсказками «больше/меньше».",
      "Пройди любой цикл в отладчике IntelliJ с точкой останова и посмотри изменение переменных.",
      "Изучи «Решето Эратосфена» — более быстрый способ найти простые числа.",
    ],
    resources: [
      oracle("java/nutsandbolts/while.html", "Oracle: The while and do-while Statements"),
      oracle("java/nutsandbolts/for.html", "Oracle: The for Statement"),
      oracle("java/nutsandbolts/branch.html", "Oracle: Branching Statements (break, continue, return)"),
      baeldung("java-loops", "Baeldung: A Guide to Java Loops"),
      baeldung("java-continue-and-break", "Baeldung: The Java continue and break Keywords"),
      codingbat("Warmup-2", "Задачи с циклами и строками"),
      leetcode("palindrome-number", "Palindrome Number"),
      leetcode("count-primes", "Count Primes", "Решето Эратосфена"),
      link("tool", "IntelliJ IDEA: отладка первого приложения", "https://www.jetbrains.com/help/idea/debugging-your-first-java-application.html", "Пошаговый туториал по дебаггеру", "en"),
      link("article", "Big-O Cheat Sheet", "https://www.bigocheatsheet.com/", "Шпаргалка по сложности алгоритмов", "en"),
      PYTHON_TUTOR_JAVA,
      book("Адитья Бхаргава — «Грокаем алгоритмы»", "Простое введение в алгоритмы и Big O с картинками"),
    ],
  },

  /* ================================================================== */
  /*  DAY 5 — Массивы                                                    */
  /* ================================================================== */
  5: {
    deepDive: [
      h("Массив в памяти: почему доступ по индексу — O(1)"),
      p("Массив — это **объект в куче**, элементы которого лежат в памяти подряд, без промежутков. Переменная `int[] arr` хранит лишь **ссылку** (адрес) на начало блока. Адрес любого элемента вычисляется формулой `адрес_начала + индекс × размер_элемента` — поэтому `arr[999999]` достаётся так же быстро, как `arr[0]`."),
      code(r`
int[] a = new int[5];             // [0, 0, 0, 0, 0] — значения по умолчанию
String[] names = new String[3];   // [null, null, null]
boolean[] flags = new boolean[2]; // [false, false]
int[] primes = {2, 3, 5, 7, 11};  // инициализация литералом
int[] copy = new int[]{1, 2, 3};  // явная форма (нужна, например, при передаче в метод)

System.out.println(primes.length); // 5 — length это поле, а не метод (без скобок!)
System.out.println(primes);        // [I@1b6d3586 — адрес, а не содержимое!
System.out.println(java.util.Arrays.toString(primes)); // [2, 3, 5, 7, 11]
`, "Создание и вывод массивов"),
      warn("Размер массива нельзя изменить", "После `new int[5]` массив навсегда останется из 5 элементов. Нужно «добавить» элемент — создаётся новый массив большего размера и данные копируются. Именно это автоматически делает `ArrayList` (день 23)."),
      h("Ссылочная семантика: копия ссылки ≠ копия массива"),
      code(r`
int[] original = {1, 2, 3};
int[] alias = original;        // НЕ копия! Обе переменные указывают на ОДИН массив
alias[0] = 99;
System.out.println(original[0]); // 99 (!)

int[] real = java.util.Arrays.copyOf(original, original.length); // настоящая копия
int[] part = java.util.Arrays.copyOfRange(original, 1, 3);       // [2, 3]
int[] cloned = original.clone();                                  // тоже копия

int[] x = {1, 2}, y = {1, 2};
System.out.println(x == y);                         // false — разные объекты
System.out.println(java.util.Arrays.equals(x, y));  // true  — одинаковое содержимое
`, "Псевдонимы и копирование"),
      h("Утилитный класс java.util.Arrays"),
      table(
        ["Метод", "Что делает", "Сложность"],
        ["Arrays.toString(arr)", "Строка вида [1, 2, 3]", "O(n)"],
        ["Arrays.deepToString(matrix)", "Вывод двумерного массива", "O(n·m)"],
        ["Arrays.sort(arr)", "Сортировка по возрастанию", "O(n log n)"],
        ["Arrays.binarySearch(arr, key)", "Бинарный поиск (массив должен быть отсортирован!)", "O(log n)"],
        ["Arrays.fill(arr, value)", "Заполнить все ячейки значением", "O(n)"],
        ["Arrays.equals(a, b)", "Сравнить содержимое", "O(n)"],
        ["Arrays.stream(arr).sum()", "Сумма через Stream API (день 31)", "O(n)"],
      ),
      h("Алгоритмы, которые нужно уметь писать руками"),
      code(r`
// 1) Разворот массива на месте — метод двух указателей
int left = 0, right = arr.length - 1;
while (left < right) {
    int tmp = arr[left];
    arr[left] = arr[right];
    arr[right] = tmp;
    left++;
    right--;
}

// 2) Пузырьковая сортировка — O(n²), учебный алгоритм
for (int i = 0; i < arr.length - 1; i++) {
    boolean swapped = false;
    for (int j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
            int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
            swapped = true;
        }
    }
    if (!swapped) break;   // уже отсортирован — выходим раньше
}

// 3) Бинарный поиск в отсортированном массиве — O(log n)
int lo = 0, hi = arr.length - 1, target = 7, found = -1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;   // так нет переполнения, в отличие от (lo + hi) / 2
    if (arr[mid] == target) { found = mid; break; }
    if (arr[mid] < target) lo = mid + 1; else hi = mid - 1;
}

// 4) Префиксные суммы: сумма на отрезке [l, r] за O(1)
int[] pref = new int[arr.length + 1];
for (int i = 0; i < arr.length; i++) pref[i + 1] = pref[i] + arr[i];
int rangeSum = pref[r + 1] - pref[l];
`, "Базовые алгоритмы на массивах"),
      h("Двумерные массивы — массивы массивов"),
      code(r`
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6}
};
System.out.println(matrix.length);     // 2 — количество строк
System.out.println(matrix[0].length);  // 3 — количество столбцов
System.out.println(matrix[1][2]);      // 6 — строка 1, столбец 2

// Обход матрицы
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        System.out.print(matrix[i][j] + " ");
    }
    System.out.println();
}

// «Рваный» (jagged) массив — строки разной длины
int[][] triangle = new int[3][];
triangle[0] = new int[1];
triangle[1] = new int[2];
triangle[2] = new int[3];

// Транспонирование: строки становятся столбцами
int[][] t = new int[matrix[0].length][matrix.length];
for (int i = 0; i < matrix.length; i++)
    for (int j = 0; j < matrix[0].length; j++)
        t[j][i] = matrix[i][j];
`, "Матрицы"),
      analogy("Двумерный массив как многоэтажка", "`matrix` — это подъезд со списком этажей. Каждый этаж (`matrix[i]`) — отдельный массив квартир. Этажи могут иметь разное число квартир — это и есть «рваный» массив."),
      h("Массивы и методы"),
      p("Передавая массив в метод, ты передаёшь **копию ссылки**. Метод может изменить элементы — и изменения будут видны снаружи. Но если внутри метода присвоить параметру новый массив, оригинал не изменится."),
      code(r`
static void fillWithZero(int[] a) { java.util.Arrays.fill(a, 0); }   // изменит оригинал
static void replace(int[] a) { a = new int[]{9, 9}; }                // оригинал НЕ изменится
`, "Pass-by-value ссылки"),
      tip("for-each — только для чтения", "В `for (int x : arr) x = 0;` изменяется лишь локальная копия `x`, массив остаётся прежним. Для изменения элементов нужен обычный `for` с индексом."),
    ],
    interview: [
      { q: "Где хранится массив и почему доступ по индексу за O(1)?", a: "Массив — объект в куче, элементы лежат непрерывным блоком. Адрес элемента = начало + индекс × размер элемента, поэтому доступ не зависит от размера массива." },
      { q: "Можно ли изменить размер массива?", a: "Нет. Можно только создать новый массив нужного размера и скопировать данные (Arrays.copyOf, System.arraycopy). Динамический размер даёт ArrayList." },
      { q: "Чем отличается arr1 == arr2 от Arrays.equals(arr1, arr2)?", a: "== сравнивает ссылки (один ли это объект), Arrays.equals — поэлементно содержимое. Для двумерных массивов — Arrays.deepEquals." },
      { q: "Какая сложность у Arrays.sort?", a: "O(n log n). Для примитивов используется Dual-Pivot Quicksort, для объектов — TimSort (стабильная сортировка)." },
      { q: "Что будет при обращении к arr[arr.length]?", a: "ArrayIndexOutOfBoundsException — последний допустимый индекс arr.length - 1." },
    ],
    selfStudy: [
      "Реализуй сортировку выбором (selection sort) и сравни с пузырьковой.",
      "Найди второй по величине элемент массива за один проход.",
      "Сдвинь все нули в конец массива, сохранив порядок остальных (LeetCode Move Zeroes).",
      "Поверни квадратную матрицу на 90° по часовой стрелке.",
      "Посмотри анимацию сортировок на VisuAlgo и попробуй предсказать каждый шаг.",
      "Изучи `System.arraycopy` и сравни его с `Arrays.copyOf`.",
    ],
    resources: [
      oracle("java/nutsandbolts/arrays.html", "Oracle: Arrays", "Официальный урок по массивам"),
      baeldung("java-arrays-guide", "Baeldung: Arrays in Java — A Reference Guide"),
      baeldung("java-util-arrays", "Baeldung: Guide to the java.util.Arrays Class"),
      javadoc("java/util/Arrays"),
      codingbat("Array-1", "Простые задачи на массивы"),
      codingbat("Array-2", "Задачи посложнее с циклами"),
      leetcode("two-sum", "Two Sum", "Самая известная задача собеседований"),
      leetcode("move-zeroes", "Move Zeroes", "Метод двух указателей"),
      leetcode("running-sum-of-1d-array", "Running Sum of 1d Array", "Префиксные суммы"),
      leetcode("transpose-matrix", "Transpose Matrix"),
      VISUALGO("sorting", "Сортировки"),
      habr("алгоритмы сортировки массивов"),
    ],
  },

  /* ================================================================== */
  /*  DAY 6 — Спринт: банкомат и жадные алгоритмы                        */
  /* ================================================================== */
  6: {
    deepDive: [
      h("Как решать задачу, а не просто писать код"),
      p("Опытный разработчик тратит больше времени на понимание задачи, чем на набор кода. Используй этот алгоритм для любой задачи — от учебной до рабочей:"),
      list(
        "**1. Пойми условие.** Перескажи задачу своими словами. Что на входе? Что на выходе? Какие ограничения?",
        "**2. Разбери примеры руками.** Пройди пример из условия на бумаге, шаг за шагом.",
        "**3. Придумай граничные случаи.** Ноль, отрицательное число, очень большое число, пустой ввод, один элемент.",
        "**4. Напиши псевдокод.** Опиши шаги по-русски, без синтаксиса Java.",
        "**5. Реализуй по частям.** Ввод → валидация → вычисление → вывод. Проверяй каждую часть отдельно.",
        "**6. Протестируй.** Прогони все примеры и граничные случаи.",
      ),
      code(r`
// Псевдокод банкомата:
// 1. прочитать сумму
// 2. если сумма <= 0 или не кратна 100 → ошибка, выход
// 3. для каждой купюры от большей к меньшей:
//      count = сумма / купюра
//      если count > 0 → вывести "купюра x count"
//      сумма = сумма % купюра
// 4. готово
`, "Сначала псевдокод", "text"),
      h("Жадный алгоритм: что это и когда он работает"),
      p("**Жадный алгоритм** на каждом шаге делает локально лучший выбор, надеясь получить глобально оптимальный результат. Для банкнот 5000/1000/500/200/100 он даёт минимальное количество купюр — такие системы номиналов называют **каноническими**."),
      code(r`
int[] notes = {5000, 2000, 1000, 500, 200, 100};
int amount = 8700;
for (int note : notes) {
    int count = amount / note;      // сколько купюр этого номинала помещается
    if (count > 0) {
        System.out.println(note + " x " + count);
    }
    amount %= note;                 // остаток для следующих номиналов
}
// 5000 x 1, 2000 x 1, 1000 x 1, 500 x 1, 200 x 1
`, "Выдача купюр"),
      warn("Жадность не всегда оптимальна", "Монеты `{1, 3, 4}`, сумма `6`. Жадный: 4 + 1 + 1 = **3 монеты**. Оптимально: 3 + 3 = **2 монеты**. Для произвольных номиналов нужно **динамическое программирование** (задача Coin Change — классика собеседований)."),
      h("Пара `/` и `%` — швейцарский нож целочисленной арифметики"),
      table(
        ["Задача", "Формула"],
        ["Секунды → часы, минуты, секунды", "h = s / 3600; m = s % 3600 / 60; sec = s % 60"],
        ["Последняя цифра числа", "n % 10"],
        ["Отбросить последнюю цифру", "n / 10"],
        ["Чётность", "n % 2 == 0"],
        ["Кратность", "n % k == 0"],
        ["Циклический индекс (по кругу)", "(i + 1) % length"],
      ),
      h("Валидация ввода"),
      code(r`
Scanner in = new Scanner(System.in);
if (!in.hasNextInt()) {
    System.out.println("Ошибка: введите целое число");
    return;
}
int amount = in.nextInt();
if (amount <= 0) {
    System.out.println("Ошибка: сумма должна быть положительной");
    return;
}
if (amount % 100 != 0) {
    System.out.println("Ошибка: сумма не кратна 100");
    return;
}
`, "Сначала проверки, потом логика"),
      h("Чистый код с первого дня"),
      list(
        "**Без магических чисел.** Вместо `if (amount > 300000)` пиши `final int DAILY_LIMIT = 300_000;`.",
        "**Говорящие имена.** `count`, `remaining`, `banknote` вместо `a`, `b`, `x`.",
        "**Один метод — одна задача.** Валидацию и расчёт можно вынести в отдельные методы (день 7).",
        "**Комментарии объясняют «почему», а не «что».** `// жадно: номиналы канонические` полезнее, чем `// делим`.",
      ),
      tip("Тестируй граничные случаи", "Для банкомата проверь: `100` (минимум), `0`, `-500`, `150`, `300000` (лимит), `300100` (больше лимита). Автотесты на платформе делают ровно это — думай как тестировщик."),
    ],
    interview: [
      { q: "Что такое жадный алгоритм?", a: "Алгоритм, который на каждом шаге выбирает локально оптимальный вариант. Прост и быстр, но даёт оптимальный ответ не для всех задач — нужно доказательство или контрпример." },
      { q: "Приведи пример, когда жадный алгоритм ошибается.", a: "Сдача суммы 6 монетами {1, 3, 4}: жадный выберет 4+1+1 (3 монеты), а оптимум 3+3 (2 монеты). Здесь нужно динамическое программирование." },
      { q: "Как ты подходишь к решению незнакомой задачи?", a: "Уточняю условие и ограничения, разбираю примеры руками, ищу граничные случаи, пишу простое решение, оцениваю сложность, затем оптимизирую и тестирую." },
    ],
    selfStudy: [
      "Добавь в банкомат дневной лимит и учёт количества купюр каждого номинала в кассете.",
      "Реши Coin Change с монетами `{1, 3, 4}` перебором и убедись, что жадный ответ неверен.",
      "Конвертер времени: введённые секунды переведи в формат `ЧЧ:ММ:СС` через `printf(\"%02d\")`.",
      "Прочитай главу про жадные алгоритмы в «Грокаем алгоритмы».",
    ],
    resources: [
      leetcode("lemonade-change", "Lemonade Change", "Жадный алгоритм выдачи сдачи"),
      leetcode("coin-change", "Coin Change", "Когда жадность не работает — динамическое программирование"),
      leetcode("best-time-to-buy-and-sell-stock", "Best Time to Buy and Sell Stock"),
      habr("жадные алгоритмы"),
      link("article", "Refactoring.Guru: Рефакторинг и запахи кода", "https://refactoring.guru/ru/refactoring", "Как писать чистый код и узнавать «плохой»", "ru"),
      EXERCISM_JAVA_PRACTICE(),
      book("Адитья Бхаргава — «Грокаем алгоритмы»", "Глава 8: жадные алгоритмы"),
      book("Роберт Мартин — «Чистый код»", "Именование, функции, комментарии — читать с первых месяцев"),
    ],
  },

  /* ================================================================== */
  /*  DAY 7 — Методы                                                     */
  /* ================================================================== */
  7: {
    deepDive: [
      h("Анатомия метода"),
      code(r`
//  модификаторы  тип     имя       параметры
    public static double  average(int[] numbers) {   // ← сигнатура: average(int[])
        if (numbers.length == 0) return 0;            // ранний выход
        int sum = 0;
        for (int n : numbers) sum += n;
        return (double) sum / numbers.length;         // тип return совпадает с объявленным
    }
`, "Части метода"),
      table(
        ["Термин", "Значение"],
        ["Сигнатура", "Имя метода + типы параметров (без возвращаемого типа!)"],
        ["Параметр", "Переменная в объявлении: `int a`"],
        ["Аргумент", "Конкретное значение при вызове: `max(5, 7)`"],
        ["void", "Метод ничего не возвращает; `return;` можно использовать для досрочного выхода"],
        ["static", "Метод принадлежит классу — вызывается без объекта"],
      ),
      h("Java всегда передаёт аргументы по значению"),
      p("Это один из самых частых вопросов на собеседовании. В Java **только pass-by-value**: метод получает **копию** значения. Для примитивов — копию числа. Для объектов и массивов — **копию ссылки**, поэтому через неё можно изменить объект, но нельзя заменить сам объект снаружи."),
      code(r`
static void increment(int x) { x++; }                  // меняет копию
static void changeFirst(int[] arr) { arr[0] = 100; }   // меняет объект по ссылке
static void reassign(int[] arr) { arr = new int[]{7}; } // меняет только копию ссылки

int n = 5;
increment(n);
System.out.println(n);        // 5 — не изменилось

int[] data = {1, 2, 3};
changeFirst(data);
System.out.println(data[0]);  // 100 — изменилось

reassign(data);
System.out.println(data[0]);  // 100 — data по-прежнему указывает на старый массив
`, "Pass-by-value"),
      analogy("Копия ключа от квартиры", "Передавая объект в метод, ты даёшь ему **дубликат ключа**. Метод может зайти и переставить мебель (изменить объект). Но если он выбросит свой ключ и сделает новый от другой квартиры — твой ключ всё ещё открывает твою квартиру."),
      h("Перегрузка методов (overloading)"),
      p("Можно объявить несколько методов с одним именем, но **разными параметрами** (количеством, типом или порядком). Компилятор выберет нужный по аргументам. Различие только по возвращаемому типу — **ошибка компиляции**."),
      code(r`
static int sum(int a, int b) { return a + b; }
static int sum(int a, int b, int c) { return a + b + c; }
static double sum(double a, double b) { return a + b; }
// static long sum(int a, int b) { ... }  // ОШИБКА: отличается только return-тип

sum(1, 2);        // вызовет sum(int, int)
sum(1.5, 2.5);    // вызовет sum(double, double)
sum(1, 2, 3);     // вызовет sum(int, int, int)
`, "Overloading"),
      h("Varargs — переменное число аргументов"),
      code(r`
static int sumAll(int... numbers) {   // внутри numbers — обычный массив int[]
    int total = 0;
    for (int n : numbers) total += n;
    return total;
}

sumAll();            // 0
sumAll(5);           // 5
sumAll(1, 2, 3, 4);  // 10
// varargs должен быть последним параметром: static void log(String msg, Object... args)
`, "int... args"),
      h("Стек вызовов и рекурсия"),
      p("Каждый вызов метода создаёт **фрейм** в стеке: в нём хранятся параметры и локальные переменные. Когда метод завершается, фрейм удаляется. **Рекурсия** — метод, вызывающий сам себя. Обязательно нужен **базовый случай**, иначе стек переполнится → `StackOverflowError`."),
      code(r`
static long factorial(int n) {
    if (n <= 1) return 1;          // базовый случай — остановка рекурсии
    return n * factorial(n - 1);   // рекурсивный шаг — задача становится меньше
}
// factorial(4) → 4 * factorial(3) → 4 * 3 * factorial(2) → 4 * 3 * 2 * 1 = 24

static int fib(int n) {             // наивная рекурсия: O(2^n) — очень медленно!
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}

static int fibFast(int n) {         // итеративно: O(n)
    int a = 0, b = 1;
    for (int i = 0; i < n; i++) { int t = a + b; a = b; b = t; }
    return a;
}
`, "Рекурсия"),
      warn("Рекурсия ≠ всегда хорошо", "Наивный `fib(45)` выполняет больше миллиарда вызовов. Любую рекурсию можно переписать циклом. Рекурсия удобна для деревьев, обхода каталогов, «разделяй и властвуй» (быстрая сортировка)."),
      h("Полезные методы класса Math"),
      table(
        ["Метод", "Результат"],
        ["Math.max(a, b) / Math.min(a, b)", "Максимум / минимум"],
        ["Math.abs(x)", "Модуль числа"],
        ["Math.pow(2, 10)", "1024.0 (возвращает double)"],
        ["Math.sqrt(16)", "4.0"],
        ["Math.round(2.5) / Math.floor / Math.ceil", "3 / округление вниз / вверх"],
        ["Math.random()", "Случайное double в [0, 1)"],
      ),
      h("Принципы хороших методов"),
      list(
        "**Имя — глагол**, описывающий действие: `calculateTax`, `isPrime`, `findMax`. Булевы методы начинаются с `is/has/can`.",
        "**Одна ответственность.** Метод либо считает, либо печатает — но не всё сразу. Так его проще тестировать.",
        "**Короткий.** Если метод не помещается на экран — разбей его.",
        "**Мало параметров.** Больше 3–4 — повод сгруппировать их в объект (модуль 2).",
        "**Чистые функции** (без побочных эффектов, результат зависит только от аргументов) — самые надёжные.",
      ),
    ],
    interview: [
      { q: "В Java передача параметров по ссылке или по значению?", a: "Всегда по значению. Для объектов передаётся копия ссылки: через неё можно изменить состояние объекта, но присваивание параметру нового объекта не повлияет на переменную вызывающего кода." },
      { q: "Чем перегрузка (overloading) отличается от переопределения (overriding)?", a: "Перегрузка — несколько методов с одним именем и разными параметрами в одном классе, выбирается при компиляции. Переопределение — подкласс заменяет реализацию метода родителя с той же сигнатурой, выбирается во время выполнения (день 13)." },
      { q: "Можно ли перегрузить метод, изменив только возвращаемый тип?", a: "Нет. Возвращаемый тип не входит в сигнатуру, компилятор не сможет выбрать метод — будет ошибка компиляции." },
      { q: "Что такое StackOverflowError?", a: "Ошибка переполнения стека вызовов, обычно из-за бесконечной рекурсии без базового случая или слишком глубокой рекурсии." },
    ],
    selfStudy: [
      "Напиши метод `isPalindrome(String s)` и метод `reverse(String s)` — и используй второй в первом.",
      "Реализуй рекурсивное возведение в степень `pow(base, exp)` за O(log n) (быстрое возведение).",
      "Пройди рекурсивный `factorial(4)` в Java Visualizer и посмотри, как растёт и уменьшается стек.",
      "Напиши перегруженные методы `printArea` для квадрата, прямоугольника и круга.",
      "Посчитай, сколько раз вызывается `fib` для `n = 30`, добавив статический счётчик.",
    ],
    resources: [
      oracle("java/javaOO/methods.html", "Oracle: Defining Methods"),
      oracle("java/javaOO/arguments.html", "Oracle: Passing Information to a Method"),
      baeldung("java-methods", "Baeldung: Methods in Java"),
      baeldung("java-pass-by-value-or-pass-by-reference", "Baeldung: Pass-By-Value as a Parameter Passing Mechanism"),
      baeldung("java-varargs", "Baeldung: Varargs in Java"),
      baeldung("java-recursion", "Baeldung: Recursion in Java"),
      baeldung("java-method-overload-override", "Baeldung: Method Overloading and Overriding"),
      codingbat("Recursion-1", "Задачи на рекурсию"),
      leetcode("fibonacci-number", "Fibonacci Number"),
      leetcode("reverse-string", "Reverse String"),
      PYTHON_TUTOR_JAVA,
      JAVA_INTERVIEW_RU,
      ROADMAP_JAVA,
    ],
  },
};

function EXERCISM_JAVA_PRACTICE() {
  return link("practice", "Exercism: Java track", "https://exercism.org/tracks/java/exercises", "Задачи с ревью от менторов — тренируй декомпозицию", "en");
}

// keep tree-shaking quiet for unused helpers in this module
void info;
