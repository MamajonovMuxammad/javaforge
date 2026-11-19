import type { QuizQuestion } from "./types";

export const CORE_AND_OOP_QUESTIONS: QuizQuestion[] = [
  // =========================================================================
  // CATEGORY: CORE JAVA & SYNTAX (16 questions)
  // =========================================================================
  {
    id: "q_core_1",
    category: "core",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Какой примитивный тип данных в Java занимает ровно 4 байта и хранит целые числа?",
    options: ["byte", "short", "int", "long"],
    correctIndex: 2,
    explanation:
      "Тип int в Java всегда занимает 32 бита (4 байта) и имеет диапазон от -2 147 483 648 до 2 147 483 647. byte занимает 1 байт, short — 2 байта, long — 8 байт.",
    theoryHint: "Вспомни таблицу размеров 8 примитивных типов Java (8, 16, 32, 64 бита).",
    relatedLinks: [
      { title: "День 4: 8 примитивных типов, память и диапазоны", url: "/?day=4", type: "lesson", day: 4 },
      { title: "Практика: Переменные и типы", url: "/practice", type: "practice" },
    ],
  },
  {
    id: "q_core_2",
    category: "core",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Что выведет этот фрагмент кода на экран?",
    codeSnippet: `int a = 7;
int b = 2;
double res = a / b;
System.out.println(res);`,
    options: ["3.5", "3.0", "3", "Ошибку компиляции"],
    correctIndex: 1,
    explanation:
      "Сначала выполняется целочисленное деление a / b (7 / 2 = 3, дробная часть отбрасывается), а затем int 3 неявно приводится к double 3.0 при присваивании.",
    theoryHint: "Обрати внимание на типы операндов справа от знака `=` до присваивания в double.",
    relatedLinks: [
      { title: "День 5: Type Casting — расширение и деление", url: "/?day=5", type: "lesson", day: 5 },
      { title: "День 6: Арифметические операторы", url: "/?day=6", type: "lesson", day: 6 },
    ],
  },
  {
    id: "q_core_3",
    category: "core",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Какое значение выведет программа в консоль?",
    codeSnippet: `int x = 5;
System.out.println(x++ + ++x);`,
    options: ["10", "11", "12", "13"],
    correctIndex: 2,
    explanation:
      "x++ сначала возвращает старое значение (5), затем увеличивает x до 6. Затем ++x сначала увеличивает x до 7 и возвращает 7. Сумма: 5 + 7 = 12.",
    theoryHint: "Различай постфиксный инкремент (x++) и префиксный (++x).",
    relatedLinks: [
      { title: "День 6: Инкремент ++i и i++", url: "/?day=6", type: "lesson", day: 6 },
    ],
  },
  {
    id: "q_core_4",
    category: "core",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Почему после вызова scanner.nextInt() вызов scanner.nextLine() может считать пустую строку?",
    options: [
      "nextInt() очищает буфер консоли после каждого числа",
      "nextInt() не считывает символ перевода строки \\n, оставляя его в буфере",
      "Scanner запрещает вызывать nextLine() после числовых методов",
      "nextLine() всегда пропускает первую строку ввода",
    ],
    correctIndex: 1,
    explanation:
      "Метод nextInt() считывает только сами цифры числа и оставляет символ новой строки (Enter / \\n) в потоке ввода. Последующий nextLine() сразу встречает этот \\n и возвращает пустую строку.",
    theoryHint: "Как ведут себя nextInt() и nextLine() с символом новой строки Enter?",
    relatedLinks: [
      { title: "День 7: Scanner и ловушка Enter", url: "/?day=7", type: "lesson", day: 7 },
    ],
  },
  {
    id: "q_core_5",
    category: "core",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Что вернёт выражение \"JavaForge\".substring(0, 4)?",
    options: ["\"JavaF\"", "\"Java\"", "\"avaF\"", "\"ava\""],
    correctIndex: 1,
    explanation:
      "В методе substring(beginIndex, endIndex) начальный индекс включается, а конечный — НЕ включается [0, 4). Это символы с индексами 0, 1, 2, 3: 'J', 'a', 'v', 'a'.",
    theoryHint: "Второй аргумент substring — исключающая (exclusive) граница.",
    relatedLinks: [
      { title: "День 8: Методы класса String", url: "/?day=8", type: "lesson", day: 8 },
    ],
  },
  {
    id: "q_core_6",
    category: "core",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что выведет этот код с логическим оператором && (short-circuit)?",
    codeSnippet: `int count = 0;
boolean flag = false && (++count > 0);
System.out.println(flag + " " + count);`,
    options: ["false 1", "false 0", "true 1", "Ошибку компиляции"],
    correctIndex: 1,
    explanation:
      "Оператор && использует ленивое вычисление (short-circuit): так как левый операнд уже false, правая часть (++count > 0) вообще не выполняется, и count остаётся равным 0.",
    theoryHint: "Подумай, вычисляется ли правая часть оператора `&&`, если слева уже `false`.",
    relatedLinks: [
      { title: "День 10: Логические связки &&, ||, !", url: "/?day=10", type: "lesson", day: 10 },
    ],
  },
  {
    id: "q_core_7",
    category: "core",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Какой цикл в Java гарантированно выполнит тело хотя бы один раз, даже если условие ложно с самого начала?",
    options: ["for", "while", "do-while", "for-each"],
    correctIndex: 2,
    explanation:
      "Цикл do-while проверяет условие только после выполнения первой итерации тела цикла (цикл с постусловием).",
    theoryHint: "Цикл с постусловием проверяет условие в самом конце блока.",
    relatedLinks: [
      { title: "День 13: Циклы while и do-while", url: "/?day=13", type: "lesson", day: 13 },
    ],
  },
  {
    id: "q_core_8",
    category: "core",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что произойдёт при попытке выполнить этот код?",
    codeSnippet: `int[] nums = {10, 20, 30};
nums[3] = 40;
System.out.println(nums[3]);`,
    options: [
      "Массив автоматически расширится и выведет 40",
      "Выбросится ArrayIndexOutOfBoundsException во время выполнения",
      "Код не скомпилируется",
      "Выведет 0",
    ],
    correctIndex: 1,
    explanation:
      "Массивы в Java имеют фиксированную длину. Для массива из 3 элементов допустимы только индексы 0, 1 и 2. Обращение к индексу 3 вызывает исключение ArrayIndexOutOfBoundsException в runtime.",
    theoryHint: "Какой максимальный индекс у массива длины N и может ли обычный массив менять размер?",
    relatedLinks: [
      { title: "День 16: Массивы и индексация с 0", url: "/?day=16", type: "lesson", day: 16 },
    ],
  },
  {
    id: "q_core_9",
    category: "core",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что выведет этот код в консоль? (Классический вопрос про передачу аргументов в Java)",
    codeSnippet: `static void change(int x) {
    x = 99;
}
public static void main(String[] args) {
    int a = 10;
    change(a);
    System.out.println(a);
}`,
    options: ["99", "10", "0", "Ошибку компиляции"],
    correctIndex: 1,
    explanation:
      "Java всегда передаёт аргументы по значению (pass-by-value). В метод change передаётся копия значения переменной a. Изменение параметра x внутри метода не затрагивает исходную переменную a.",
    theoryHint: "В Java аргументы передаются по значению или по ссылке?",
    relatedLinks: [
      { title: "День 22: Параметры методов и область видимости", url: "/?day=22", type: "lesson", day: 22 },
      { title: "День 24: Java Scope", url: "/?day=24", type: "lesson", day: 24 },
    ],
  },
  {
    id: "q_core_10",
    category: "core",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что выведет цикл при отсутствии оператора break внутри классического switch?",
    codeSnippet: `int day = 2;
switch (day) {
    case 1: System.out.print("Пн");
    case 2: System.out.print("Вт");
    case 3: System.out.print("Ср"); break;
    default: System.out.print("?");
}`,
    options: ["Вт", "ВтСр", "ПнВтСр", "ВтСр?"],
    correctIndex: 1,
    explanation:
      "Без break в классическом switch возникает эффект «проваливания» (fall-through): после совпадения с case 2 выполнятся case 2, затем case 3, пока не встретится break.",
    theoryHint: "Вспомни эффект fall-through в классическом операторе switch.",
    relatedLinks: [
      { title: "День 12: Оператор switch и современный синтаксис ->", url: "/?day=12", type: "lesson", day: 12 },
    ],
  },
  {
    id: "q_core_11",
    category: "core",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что определяет перегрузку методов (Method Overloading) в Java?",
    options: [
      "Только разный тип возвращаемого значения",
      "Одинаковое имя метода, но разные параметры (количество, тип или порядок)",
      "Переопределение метода родительского класса с тем же набором параметров",
      "Использование ключевого слова static перед методом",
    ],
    correctIndex: 1,
    explanation:
      "Перегрузка (Overloading) — это создание нескольких методов с одинаковым именем в одном классе, но разным списком параметров. Тип возвращаемого значения сам по себе не является частью сигнатуры для перегрузки.",
    theoryHint: "Из чего состоит сигнатура метода, по которой компилятор различает перегруженные версии?",
    relatedLinks: [
      { title: "День 23: Перегрузка методов (Method Overloading)", url: "/?day=23", type: "lesson", day: 23 },
    ],
  },
  {
    id: "q_core_12",
    category: "core",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что произойдёт, если в рекурсивном методе забыть про базовый случай (условие выхода)?",
    options: [
      "Компилятор не соберёт программу",
      "Программа вернёт 0 или null",
      "Произойдёт переполнение стека — StackOverflowError",
      "JVM автоматически прервёт цикл после 1000 шагов",
    ],
    correctIndex: 2,
    explanation:
      "Каждый рекурсивный вызов создаёт новый фрейм в памяти Stack. Бесконечная рекурсия исчерпывает доступный размер стека и приводит к ошибке StackOverflowError.",
    theoryHint: "Где хранятся фреймы вызовов методов и локальные переменные при каждом рекурсивном вызове?",
    relatedLinks: [
      { title: "День 25: Рекурсия и стек вызовов", url: "/?day=25", type: "lesson", day: 25 },
    ],
  },
  {
    id: "q_core_13",
    category: "core",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Что выведет этот классический вопрос с собеседований про обёртку Integer?",
    codeSnippet: `Integer a = 127;
Integer b = 127;
Integer c = 128;
Integer d = 128;
System.out.println((a == b) + " " + (c == d));`,
    options: ["true true", "false false", "true false", "false true"],
    correctIndex: 2,
    explanation:
      "В Java работает кэш целочисленных обёрток IntegerCache для значений от -128 до 127 (по умолчанию). Поэтому a и b указывают на один кэшированный объект (true), а для 128 создаются два разных объекта в Heap (false).",
    theoryHint: "Подумай про пул кэширования Integer.valueOf() и диапазон 1 байта со знаком (-128..127).",
    relatedLinks: [
      { title: "День 4: Типы данных и память", url: "/?day=4", type: "lesson", day: 4 },
      { title: "День 36: equals и сравнение объектов", url: "/?day=36", type: "lesson", day: 36 },
    ],
  },
  {
    id: "q_core_14",
    category: "core",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Что выведет цикл при переполнении типа byte?",
    codeSnippet: `byte b = 127;
b++;
System.out.println(b);`,
    options: ["128", "-128", "0", "Ошибка компиляции"],
    correctIndex: 1,
    explanation:
      "Максимальное значение byte равно 127 (0111 1111). Операция b++ (в отличие от b = b + 1) включает неявное сужение типа, и значение циклически переполняется в минимальное значение -128 (1000 0000 в дополнительном коде).",
    theoryHint: "Диапазон byte: [-128; 127]. Что происходит при прибавлении 1 к максимуму в дополнительном коде?",
    relatedLinks: [
      { title: "День 4: Диапазоны примитивов", url: "/?day=4", type: "lesson", day: 4 },
      { title: "День 5: Приведение типов", url: "/?day=5", type: "lesson", day: 5 },
    ],
  },
  {
    id: "q_core_15",
    category: "core",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Какой результат выведет программа с перегрузкой методов и null?",
    codeSnippet: `static void test(Object o) { System.out.println("Object"); }
static void test(String s) { System.out.println("String"); }
public static void main(String[] args) {
    test(null);
}`,
    options: ["Object", "String", "Ошибку компиляции: ambiguous call", "NullPointerException"],
    correctIndex: 1,
    explanation:
      "При разрешении перегрузки компилятор выбирает наиболее специфичный (узкий) тип из иерархии наследования. String наследуется от Object, поэтому он более специфичен — вызовется test(String).",
    theoryHint: "Если два перегруженных метода подходят для null, компилятор выбирает дочерний класс или выдаёт ошибку?",
    relatedLinks: [
      { title: "День 23: Перегрузка методов", url: "/?day=23", type: "lesson", day: 23 },
      { title: "День 31: Иерархия наследования", url: "/?day=31", type: "lesson", day: 31 },
    ],
  },
  {
    id: "q_core_16",
    category: "core",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Что выведет программа, использующая varargs и перегрузку?",
    codeSnippet: `static void run(int... a) { System.out.print("varargs "); }
static void run(long a, long b) { System.out.print("long "); }
public static void main(String[] args) {
    run(5, 10);
}`,
    options: ["varargs", "long", "varargs long", "Ошибку компиляции"],
    correctIndex: 1,
    explanation:
      "Приоритет подбора перегруженного метода в Java: 1) Точное совпадение, 2) Расширение примитива (widening: int -> long), 3) Autoboxing (int -> Integer), 4) Varargs (int...). Поэтому побеждает widening run(long, long).",
    theoryHint: "У varargs самый низкий приоритет при выборе перегруженного метода (после расширения примитивов и упаковки).",
    relatedLinks: [
      { title: "День 5: Расширение примитивов", url: "/?day=5", type: "lesson", day: 5 },
      { title: "День 23: Overloading", url: "/?day=23", type: "lesson", day: 23 },
    ],
  },

  // =========================================================================
  // CATEGORY: ООП & ПАМЯТЬ JVM (16 questions)
  // =========================================================================
  {
    id: "q_oop_1",
    category: "oop",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Где в памяти JVM создаются сами объекты (экземпляры классов через new) и где хранятся локальные ссылки на них?",
    options: [
      "И объекты, и ссылки хранятся в Stack",
      "Объекты создаются в Heap (куче), а локальные ссылки на них — в Stack",
      "Объекты хранятся в Stack, а ссылки — в Heap",
      "Всё хранится в Metaspace",
    ],
    correctIndex: 1,
    explanation:
      "Все экземпляры классов и массивы размещаются в куче (Heap), которой управляет сборщик мусора (GC). Локальные переменные и ссылки на эти объекты лежат в стеке (Stack) текущего потока.",
    theoryHint: "Раздели области памяти: Stack (локальные фреймы) и Heap (динамическая память объектов).",
    relatedLinks: [
      { title: "День 26: Классы, объекты и память Heap", url: "/?day=26", type: "lesson", day: 26 },
    ],
  },
  {
    id: "q_oop_2",
    category: "oop",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Когда компилятор Java перестаёт автоматически создавать конструктор по умолчанию (без параметров)?",
    options: [
      "Если класс помечен как public",
      "Если в классе объявлен хотя бы один явный конструктор (например, с параметрами)",
      "Если в классе есть поля типа private",
      "Конструктор по умолчанию создаётся всегда",
    ],
    correctIndex: 1,
    explanation:
      "Компилятор генерирует пустой конструктор без аргументов только тогда, когда в классе не написано ни одного другого конструктора. Как только вы объявляете свой конструктор с параметрами, конструктор по умолчанию пропадает.",
    theoryHint: "Подумай, что будет при вызове `new User()`, если у `User` объявлен только `User(String name)`.",
    relatedLinks: [
      { title: "День 27: Конструкторы и инициализация объектов", url: "/?day=27", type: "lesson", day: 27 },
    ],
  },
  {
    id: "q_oop_3",
    category: "oop",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Какой модификатор доступа разрешает видимость члена класса в том же пакете, а также во всех классах-наследниках (даже в других пакетах)?",
    options: ["private", "default (package-private)", "protected", "public"],
    correctIndex: 2,
    explanation:
      "Модификатор protected открывает доступ внутри текущего класса, внутри того же пакета и во всех подклассах (даже если подкласс находится в другом пакете).",
    theoryHint: "Вспомни 4 уровня доступа в Java: private -> default -> protected -> public.",
    relatedLinks: [
      { title: "День 28: Инкапсуляция и модификаторы доступа", url: "/?day=28", type: "lesson", day: 28 },
    ],
  },
  {
    id: "q_oop_4",
    category: "oop",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Что означает модификатор final для ссылочной переменной, например: final List<String> list = new ArrayList<>();?",
    options: [
      "В список нельзя добавлять и удалять элементы",
      "Переменной list нельзя присвоить ссылку на другой объект, но сам список изменять можно",
      "Список становится потокобезопасным",
      "Класс List становится финальным",
    ],
    correctIndex: 1,
    explanation:
      "final для ссылочной переменной запрещает переназначать саму ссылку (list = new ArrayList<>() даст ошибку компиляции), но внутреннее состояние объекта (list.add(\"A\")) менять можно.",
    theoryHint: "final замораживает ссылку в переменной, но не делает внутренности объекта immutable.",
    relatedLinks: [
      { title: "День 30: static, final и константы", url: "/?day=30", type: "lesson", day: 30 },
    ],
  },
  {
    id: "q_oop_5",
    category: "oop",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Почему из static метода (например, main) нельзя напрямую обратиться к нестатическому полю класса?",
    options: [
      "static методы компилируются раньше других",
      "static метод принадлежит классу и может вызываться без создания экземпляра (нет ссылки this)",
      "Нестатические поля всегда имеют доступ private",
      "В static методах запрещены любые переменные",
    ],
    correctIndex: 1,
    explanation:
      "Обычные поля существуют только внутри конкретного объекта в Heap. Static метод вызывается у самого класса (ClassName.method()) без объекта, поэтому внутри него нет ссылки this и непонятно, к чьему полю обращаться.",
    theoryHint: "К чему привязан static — к объекту или ко всему классу целиком?",
    relatedLinks: [
      { title: "День 30: Ключевое слово static", url: "/?day=30", type: "lesson", day: 30 },
      { title: "День 29: Ключевое слово this", url: "/?day=29", type: "lesson", day: 29 },
    ],
  },
  {
    id: "q_oop_6",
    category: "oop",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что выведет программа, демонстрирующая полиморфизм (позднее связывание)?",
    codeSnippet: `class Animal {
    void speak() { System.out.println("Sound"); }
}
class Dog extends Animal {
    @Override void speak() { System.out.println("Woof"); }
}
// В main:
Animal a = new Dog();
a.speak();`,
    options: ["Sound", "Woof", "SoundWoof", "Ошибку компиляции"],
    correctIndex: 1,
    explanation:
      "Выбор реализации переопределённого нестатического метода в Java происходит динамически во время выполнения (динамический полиморфизм) по реальному типу объекта (Dog), а не по типу ссылки (Animal).",
    theoryHint: "Какой реальный объект создан через `new` в куче?",
    relatedLinks: [
      { title: "День 32: Полиморфизм и @Override", url: "/?day=32", type: "lesson", day: 32 },
    ],
  },
  {
    id: "q_oop_7",
    category: "oop",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "В чём ключевое отличие abstract class от interface (начиная с Java 8+)?",
    options: [
      "В интерфейсе вообще нельзя писать реализацию методов",
      "Абстрактный класс может иметь состояние (нестатические изменяемые поля) и конструкторы, а класс может наследовать только один абстрактный класс",
      "В абстрактном классе все методы обязаны быть abstract",
      "Интерфейс может наследоваться от обычного класса",
    ],
    correctIndex: 1,
    explanation:
      "Абстрактный класс хранит состояние объекта (любые поля) и имеет конструкторы, но в Java запрещено множественное наследование классов. Интерфейсы задают контракт (поля только public static final), поддерживают default/static методы и могут реализовываться сразу в любом количестве.",
    theoryHint: "Сравни наличие состояния (полей), конструкторов и возможность множественной реализации.",
    relatedLinks: [
      { title: "День 34: Абстрактные классы", url: "/?day=34", type: "lesson", day: 34 },
      { title: "День 35: Интерфейсы", url: "/?day=35", type: "lesson", day: 35 },
    ],
  },
  {
    id: "q_oop_8",
    category: "oop",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что произойдёт с HashMap или HashSet, если в классе-ключе переопределить equals(), но НЕ переопределить hashCode()?",
    options: [
      "Код не скомпилируется",
      "Два логически равных объекта будут иметь разные hashCode, попадать в разные корзины, и коллекция не найдёт ключ",
      "JVM сама сгенерирует одинаковый hashCode",
      "HashSet автоматически превратится в TreeSet",
    ],
    correctIndex: 1,
    explanation:
      "По контракту equals и hashCode: если a.equals(b) == true, то a.hashCode() ОБЯЗАН быть равен b.hashCode(). Иначе HashMap/HashSet сначала вычислит другой бакет по стандартному hashCode (адресу в памяти) и даже не дойдёт до вызова equals().",
    theoryHint: "Как HashMap ищет нужную корзину (bucket) перед вызовом equals?",
    relatedLinks: [
      { title: "День 36: Контракт equals и hashCode", url: "/?day=36", type: "lesson", day: 36 },
      { title: "День 44: HashMap изнутри", url: "/?day=44", type: "lesson", day: 44 },
    ],
  },
  {
    id: "q_oop_9",
    category: "oop",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что выведет сравнение строк через String Pool и оператор new?",
    codeSnippet: `String s1 = "Java";
String s2 = "Java";
String s3 = new String("Java");
System.out.println((s1 == s2) + " " + (s1 == s3) + " " + s1.equals(s3));`,
    options: [
      "true true true",
      "true false true",
      "false false true",
      "true false false",
    ],
    correctIndex: 1,
    explanation:
      "Литералы s1 и s2 попадают в String Pool и ссылаются на один объект (s1 == s2 -> true). new String(\"Java\") принудительно создаёт новый объект в Heap (s1 == s3 -> false). Но содержимое одинаковое, поэтому s1.equals(s3) -> true.",
    theoryHint: "Оператор `==` сравнивает ссылки в памяти, а строковые литералы кэшируются в String Pool.",
    relatedLinks: [
      { title: "День 37: String, StringBuilder и String Pool", url: "/?day=37", type: "lesson", day: 37 },
    ],
  },
  {
    id: "q_oop_10",
    category: "oop",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Почему конкатенация 50 000 строк в цикле через `str += i` работает медленно, и как сделать её быстрее?",
    options: [
      "Оператор += запрещён для строк; нужно использовать ArrayList",
      "String неизменяем (immutable), в цикле создаётся 50 000 новых объектов в Heap; нужно использовать StringBuilder",
      "Нужно поместить цикл в поток Runnable",
      "Нужно заменить String на char",
    ],
    correctIndex: 1,
    explanation:
      "Поскольку String immutable, каждое сложение в цикле аллоцирует новый объект String и копирует все предыдущие символы — сложность O(N^2). StringBuilder использует расширяемый буфер и делает ту же задачу за O(N).",
    theoryHint: "Класс String является immutable — что происходит при каждой операции `+`?",
    relatedLinks: [
      { title: "День 37: String vs StringBuilder", url: "/?day=37", type: "lesson", day: 37 },
    ],
  },
  {
    id: "q_oop_11",
    category: "oop",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "От какого класса наследуются ВСЕ Unchecked-исключения (непроверяемые) в Java?",
    options: [
      "Throwable",
      "Exception",
      "RuntimeException",
      "Error",
    ],
    correctIndex: 2,
    explanation:
      "Исключения, наследующиеся от RuntimeException (например, NullPointerException, IllegalArgumentException, IndexOutOfBoundsException), являются непроверяемыми (Unchecked) — их не обязательно указывать в throws или оборачивать в try-catch. (Error тоже unchecked, но относится к системным сбоям JVM).",
    theoryHint: "Раздели Exception на Checked (наследники Exception) и Unchecked (наследники ...).",
    relatedLinks: [
      { title: "День 38: Исключения: Checked vs Unchecked", url: "/?day=38", type: "lesson", day: 38 },
    ],
  },
  {
    id: "q_oop_12",
    category: "oop",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Какое значение вернёт этот метод с блоком finally? (Классическая ловушка на собеседованиях)",
    codeSnippet: `static int compute() {
    try {
        return 1;
    } catch (Exception e) {
        return 2;
    } finally {
        return 3;
    }
}`,
    options: ["1", "2", "3", "Ошибку компиляции"],
    correctIndex: 2,
    explanation:
      "Блок finally выполняется практически всегда (кроме System.exit или падения JVM) непосредственно перед выходом из метода. Поскольку внутри finally также стоит return 3, он перезаписывает возвращаемое значение try и метод вернёт 3 (на практике так писать антипаттерн!).",
    theoryHint: "Когда именно выполняется блок `finally` относительно инструкции `return` в `try`?",
    relatedLinks: [
      { title: "День 38: Исключения try / catch / finally", url: "/?day=38", type: "lesson", day: 38 },
    ],
  },
  {
    id: "q_oop_13",
    category: "oop",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Что выведет программа в консоль при создании объекта Child? (Порядок инициализации)",
    codeSnippet: `class Parent {
    static { System.out.print("1"); }
    { System.out.print("2"); }
    Parent() { System.out.print("3"); }
}
class Child extends Parent {
    static { System.out.print("4"); }
    { System.out.print("5"); }
    Child() { System.out.print("6"); }
}
// Вызов: new Child();`,
    options: ["123456", "142356", "415623", "142536"],
    correctIndex: 1,
    explanation:
      "Правильный порядок в Java: 1) Static-блоки родителя (1), 2) Static-блоки потомка (4), 3) Нестатический блок и конструктор родителя (2, 3), 4) Нестатический блок и конструктор потомка (5, 6). Итог: 142356.",
    theoryHint: "Сначала срабатывают static-блоки сверху вниз, затем инициализация экземпляра родителя (блок + конструктор), затем потомка.",
    relatedLinks: [
      { title: "День 27: Конструкторы и инициализация", url: "/?day=27", type: "lesson", day: 27 },
      { title: "День 31: Наследование и super()", url: "/?day=31", type: "lesson", day: 31 },
    ],
  },
  {
    id: "q_oop_14",
    category: "oop",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Что выведет программа при обращении к полю и static методу через полиморфную ссылку?",
    codeSnippet: `class Base {
    String name = "Base";
    static void hello() { System.out.print("BaseHello "); }
}
class Sub extends Base {
    String name = "Sub";
    static void hello() { System.out.print("SubHello "); }
}
// В main:
Base b = new Sub();
b.hello();
System.out.print(b.name);`,
    options: ["SubHello Sub", "BaseHello Base", "SubHello Base", "BaseHello Sub"],
    correctIndex: 1,
    explanation:
      "В Java полиморфизм (позднее связывание) работает ТОЛЬКО для обычных (нестатических) методов. Поля и static-методы связываются статически на этапе компиляции по типу ссылки (Base) — это называется сокрытие (hiding).",
    theoryHint: "Применяется ли полиморфизм в Java к полям класса и к static-методам?",
    relatedLinks: [
      { title: "День 30: static и наследование", url: "/?day=30", type: "lesson", day: 30 },
      { title: "День 32: Полиморфизм", url: "/?day=32", type: "lesson", day: 32 },
    ],
  },
  {
    id: "q_oop_15",
    category: "oop",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Какой интерфейс обязан реализовать ресурс, чтобы его можно было использовать в конструкции try-with-resources: try (var r = new MyRes()) { ... }?",
    options: ["Serializable", "Cloneable", "AutoCloseable", "Iterable"],
    correctIndex: 2,
    explanation:
      "Конструкция try-with-resources автоматически вызывает метод close() в конце блока try для любого класса, реализующего интерфейс java.lang.AutoCloseable (или его наследника java.io.Closeable).",
    theoryHint: "Какой интерфейс содержит единственный метод `void close() throws Exception`?",
    relatedLinks: [
      { title: "День 38: Исключения и закрытие ресурсов", url: "/?day=38", type: "lesson", day: 38 },
      { title: "День 63: JDBC ресурсы", url: "/?day=63", type: "lesson", day: 63 },
    ],
  },
  {
    id: "q_oop_16",
    category: "oop",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Если у интерфейса A и интерфейса B есть default-метод с одинаковой сигнатурой void log(), а класс MyService implements A, B — что произойдёт?",
    options: [
      "Вызовется реализация из первого указанного интерфейса A",
      "Код не скомпилируется, пока класс MyService явно не переопределит метод log()",
      "Вызовется реализация из последнего интерфейса B",
      "Оба метода выполнятся по очереди",
    ],
    correctIndex: 1,
    explanation:
      "Чтобы избежать проблемы ромбовидного наследования (Diamond Problem), компилятор требует, чтобы класс сам явно переопределил конфликтующий default-метод (при желании внутри можно вызвать A.super.log()).",
    theoryHint: "Как Java решает конфликт одинаковых default-методов из двух интерфейсов?",
    relatedLinks: [
      { title: "День 35: Интерфейсы и default-методы", url: "/?day=35", type: "lesson", day: 35 },
    ],
  },
];
