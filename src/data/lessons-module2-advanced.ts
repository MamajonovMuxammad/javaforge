import type { Lesson } from "./types";

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

export const module2AdvancedLessons: Lesson[] = [
  /* ------------------------------------------------------------------ */
  /*  DAY 15: Абстрактные классы                                       */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 15,
    moduleId: 2,
    title: "Абстрактные классы: незаконченные чертежи и шаблонный метод",
    short: "Ключевое слово abstract, абстрактные методы, Template Method",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["abstract class", "abstract методы", "Запрет new для абстрактных классов", "Паттерн Шаблонный метод"],
    videos: [
      { author: "Алишев", query: "Алишев Java абстрактные классы", note: "Зачем нужны abstract классы" },
      { author: "Заур Трегулов", query: "Заур Трегулов abstract class Java", note: "Абстрактные классы и методы" },
    ],
    theory: [
      { type: "h", text: "Что такое абстрактный класс?" },
      {
        type: "p",
        text: "Иногда базовый класс настолько обобщен, что создание его прямого экземпляра не имеет физического смысла. Например, нельзя встретить просто «Фигуру» или просто «Транспортное средство» — в реальности существует конкретный Круг или конкретный Автомобиль.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Шаблон государственного бланка",
        text: "**Абстрактный класс** — это бланк заявления с пустыми графами. Вы не можете подать пустой бланк (запрет `new Blank()`). Вы обязаны заполнить все пустые поля в конкретном заявлении-потомке (`Child extends Blank`).",
      },
      {
        type: "table",
        head: ["Критерий", "Обычный класс", "Абстрактный класс (abstract)"],
        rows: [
          ["Создание через new", "Разрешено (`new Car()`)", "Запрещено (`new Vehicle()` вызовет ошибку компиляции)"],
          ["Абстрактные методы", "Нельзя объявлять", "Можно объявлять (без тела `{}`: `abstract void draw();`)"],
          ["Обычные методы с телом", "Да", "Да, могут быть полностью готовые методы"],
          ["Конструктор", "Да", "Да (вызывается из потомков через `super()`)"],
        ],
      },
      {
        type: "h",
        text: "Паттерн «Шаблонный метод» (Template Method)",
      },
      {
        type: "p",
        text: "Абстрактный класс может задать неизменный скелет алгоритма в обычном методе, а отдельные шаги объявить абстрактными, чтобы каждый дочерний класс реализовал их по-своему.",
      },
      {
        type: "code",
        caption: "Пример шаблонного метода приготовления напитка",
        code: `abstract class HotDrink {
    // Шаблонный метод — каркас алгоритма
    final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    }

    void boilWater() {
        System.out.println("Кипячение воды");
    }

    void pourInCup() {
        System.out.println("Наливание в чашку");
    }

    // Шаги, специфичные для каждого напитка:
    abstract void brew();
    abstract void addCondiments();
}`,
      },
    ],
    tasks: [
      {
        id: "d15_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Абстрактная бытовая техника)",
        shortDesc: "Объявление abstract class и реализация метода",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай абстрактный класс `Appliance` (техника) с полем `String brand` и конструктором `Appliance(String brand)`. В классе объяви абстрактный метод `abstract void turnOn()` и обычный метод `void plugIn()`, выводящий `<brand> подключен к розетке`.\n\nСоздай класс `Toaster extends Appliance`, реализующий `turnOn()` с выводом `<brand> начинает жарить тосты`.\nВ `main` создай `Toaster`, вызови `plugIn()` и `turnOn()`.",
        requirements: ["Абстрактный класс `Appliance` с методом `turnOn()`", "Класс `Toaster` с реализацией `turnOn()`", "Вызов `plugIn()` и `turnOn()`"],
        exampleInput: "Philips",
        exampleOutput: "Philips подключен к розетке\nPhilips начинает жарить тосты",
        sampleInput: "Philips",
        starterCode: `import java.util.Scanner;

// TODO: создай abstract class Appliance

// TODO: создай class Toaster extends Appliance

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String brand = scanner.nextLine();

        // TODO: создай Toaster и вызови plugIn() и turnOn()
    }
}
`,
        tests: [
          { label: "Philips", stdin: "Philips\n", expected: ["Philips подключен к розетке", "Philips начинает жарить тосты"] },
          { label: "Bosch", stdin: "Bosch\n", expected: ["Bosch подключен к розетке", "Bosch начинает жарить тосты"] },
        ],
        requiredCode: [
          { pattern: "abstract\\s+class\\s+Appliance", message: "Объяви abstract class Appliance" },
          { pattern: "abstract\\s+void\\s+turnOn", message: "Объяви abstract void turnOn()" },
          { pattern: "class\\s+Toaster\\s+extends\\s+Appliance", message: "Класс Toaster должен наследовать Appliance" },
        ],
        hints: ["Не ставь фигурные скобки `{}` у абстрактного метода: пиши `abstract void turnOn();`"],
        solution: `import java.util.Scanner;

abstract class Appliance {
    String brand;

    Appliance(String brand) {
        this.brand = brand;
    }

    void plugIn() {
        System.out.println(brand + " подключен к розетке");
    }

    abstract void turnOn();
}

class Toaster extends Appliance {
    Toaster(String brand) {
        super(brand);
    }

    @Override
    void turnOn() {
        System.out.println(brand + " начинает жарить тосты");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String brand = scanner.nextLine();

        Toaster toaster = new Toaster(brand);
        toaster.plugIn();
        toaster.turnOn();
    }
}
`,
      },
      {
        id: "d15_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Генератор отчетов)",
        shortDesc: "Шаблонный метод генерации CSV и HTML отчетов",
        difficulty: "Средний",
        xp: 35,
        description:
          "Реализуй паттерн Шаблонный метод для генерации отчетов.\nСоздай абстрактный класс `ReportGenerator` с шаблонным методом `public final void generate(String title)`:\n1. Печатает `=== Старт генерации ===`\n2. Вызывает `formatHeader(title)` (абстрактный метод, возвращает String) и печатает результат\n3. Печатает `=== Отчет сформирован ===`\n\nСоздай класс `CsvReportGenerator extends ReportGenerator`, где `formatHeader` возвращает `CSV-Заголовок: \"` + title + `\"`.\nВ `main` создай генератор и вызови `generate(title)`.",
        requirements: ["Абстрактный класс `ReportGenerator` с `final void generate`", "Абстрактный метод `formatHeader`", "Класс `CsvReportGenerator`"],
        exampleInput: "Продажи_2026",
        exampleOutput: "=== Старт генерации ===\nCSV-Заголовок: \"Продажи_2026\"\n=== Отчет сформирован ===",
        sampleInput: "Продажи_2026",
        starterCode: `import java.util.Scanner;

abstract class ReportGenerator {
    // TODO: final void generate(String title)
    // TODO: abstract String formatHeader(String title);
}

// TODO: CsvReportGenerator

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String title = scanner.nextLine();

        // TODO
    }
}
`,
        tests: [
          { label: "Продажи_2026", stdin: "Продажи_2026\n", expected: ["=== Старт генерации ===", "CSV-Заголовок: \"Продажи_2026\"", "=== Отчет сформирован ==="] },
          { label: "Сотрудники", stdin: "Сотрудники\n", expected: ["=== Старт генерации ===", "CSV-Заголовок: \"Сотрудники\"", "=== Отчет сформирован ==="] },
        ],
        requiredCode: [
          { pattern: "abstract\\s+class\\s+ReportGenerator", message: "Создай abstract class ReportGenerator" },
          { pattern: "final\\s+void\\s+generate", message: "Метод generate должен быть final" },
          { pattern: "abstract\\s+String\\s+formatHeader", message: "Объяви abstract String formatHeader" },
        ],
        hints: ["`generate` вызывает `System.out.println(formatHeader(title));`"],
        solution: `import java.util.Scanner;

abstract class ReportGenerator {
    public final void generate(String title) {
        System.out.println("=== Старт генерации ===");
        System.out.println(formatHeader(title));
        System.out.println("=== Отчет сформирован ===");
    }

    abstract String formatHeader(String title);
}

class CsvReportGenerator extends ReportGenerator {
    @Override
    String formatHeader(String title) {
        return "CSV-Заголовок: \\"" + title + "\\"";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String title = scanner.nextLine();

        ReportGenerator gen = new CsvReportGenerator();
        gen.generate(title);
    }
}
`,
      },
      {
        id: "d15_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Приготовление кофе и чая)",
        shortDesc: "Полноценный шаблонный метод приготовления горячих напитков",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай абстрактный класс `HotDrink` с шаблонным методом `public final void prepareRecipe()`:\n1. `System.out.println(\"Кипячение воды\");`\n2. `brew();` (абстрактный метод)\n3. `System.out.println(\"Наливание в чашку\");`\n4. `addCondiments();` (абстрактный метод)\n\nСоздай классы:\n- `Tea extends HotDrink`: `brew()` выводит `Заваривание черного чая`, `addCondiments()` выводит `Добавление лимона`.\n- `Coffee extends HotDrink`: `brew()` выводит `Заваривание зерен арабики`, `addCondiments()` выводит `Добавление молока и сахара`.\nВ `main` по строке (`tea` или `coffee`) приготовь нужный напиток.",
        requirements: ["Абстрактный класс `HotDrink` с шаблонным методом", "Классы `Tea` и `Coffee`", "Обработка выбора пользователя"],
        exampleInput: "tea",
        exampleOutput: "Кипячение воды\nЗаваривание черного чая\nНаливание в чашку\nДобавление лимона",
        sampleInput: "tea",
        starterCode: `import java.util.Scanner;

// TODO: abstract class HotDrink
// TODO: class Tea extends HotDrink
// TODO: class Coffee extends HotDrink

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String drinkType = scanner.nextLine().trim();

        // TODO
    }
}
`,
        tests: [
          { label: "Чай", stdin: "tea\n", expected: ["Кипячение воды", "Заваривание черного чая", "Наливание в чашку", "Добавление лимона"] },
          { label: "Кофе", stdin: "coffee\n", expected: ["Кипячение воды", "Заваривание зерен арабики", "Наливание в чашку", "Добавление молока и сахара"] },
        ],
        requiredCode: [
          { pattern: "abstract\\s+class\\s+HotDrink", message: "Создай abstract class HotDrink" },
          { pattern: "abstract\\s+void\\s+brew", message: "Объяви abstract void brew()" },
          { pattern: "abstract\\s+void\\s+addCondiments", message: "Объяви abstract void addCondiments()" },
        ],
        hints: ["`if (drinkType.equals(\"tea\")) new Tea().prepareRecipe(); else new Coffee().prepareRecipe();`"],
        solution: `import java.util.Scanner;

abstract class HotDrink {
    public final void prepareRecipe() {
        System.out.println("Кипячение воды");
        brew();
        System.out.println("Наливание в чашку");
        addCondiments();
    }

    abstract void brew();
    abstract void addCondiments();
}

class Tea extends HotDrink {
    @Override
    void brew() {
        System.out.println("Заваривание черного чая");
    }

    @Override
    void addCondiments() {
        System.out.println("Добавление лимона");
    }
}

class Coffee extends HotDrink {
    @Override
    void brew() {
        System.out.println("Заваривание зерен арабики");
    }

    @Override
    void addCondiments() {
        System.out.println("Добавление молока и сахара");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String drinkType = scanner.nextLine().trim();

        HotDrink drink = drinkType.equals("tea") ? new Tea() : new Coffee();
        drink.prepareRecipe();
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 16: Интерфейсы                                                */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 16,
    moduleId: 2,
    title: "Интерфейсы: контракты поведения и множественная реализация",
    short: "interface, implements, множественное наследование типов, default методы",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["interface и implements", "Контракт поведения", "Множественная реализация", "default-методы"],
    videos: [
      { author: "Алишев", query: "Алишев Java интерфейсы", note: "Интерфейсы с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов интерфейсы Java", note: "default методы и контракты" },
    ],
    theory: [
      { type: "h", text: "Что такое интерфейс?" },
      {
        type: "p",
        text: "В Java класс может наследоваться только от **одного** родителя (`single inheritance`). Но реальные объекты часто обладают множеством ролей: человек может быть водителем, сотрудником и спортсменом одновременно. Для этого служат **интерфейсы**.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Электрическая розетка (Стандарт)",
        text: "**Интерфейс** — это розетка 220В на стене. Розетке всё равно, что в нее вставят: утюг, ноутбук или тостер, главное — чтобы штекер соответствовал стандарту (контракту). Любое устройство, реализующее этот штекер (`implements Plug`), гарантированно получает питание.",
      },
      {
        type: "table",
        head: ["Параметр", "Абстрактный класс", "Интерфейс (interface)"],
        rows: [
          ["Смысл концепции", "Кем является объект («is-a»)", "Что умеет делать объект («can-do»)"],
          ["Множественность", "Только один (`extends A`)", "Сколько угодно (`implements A, B, C`)"],
          ["Поля", "Любые (private, protected, нестатические)", "Только константы (`public static final`)"],
          ["Конструктор", "Есть конструктор", "Конструктора НЕТ"],
        ],
      },
      {
        type: "code",
        caption: "Пример множественной реализации интерфейсов",
        code: `interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

class Duck implements Flyable, Swimmable {
    public void fly() { System.out.println("Утка летит"); }
    public void swim() { System.out.println("Утка плывет"); }
}`,
      },
    ],
    tasks: [
      {
        id: "d16_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Интерфейс Printable)",
        shortDesc: "Реализация интерфейса и вызов метода",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай интерфейс `Printable` с методом `void print()`. Создай класс `Document implements Printable` с полем `String text`, конструктором `Document(String text)` и реализацией метода `print()`, которая выводит текст документа.\nВ `main` прочитай строку, создай `Printable doc = new Document(...)` и вызови `doc.print()`.",
        requirements: ["Интерфейс `Printable`", "Класс `Document implements Printable`", "Работа через интерфейсную ссылку"],
        exampleInput: "Договор купли-продажи",
        exampleOutput: "Документ: Договор купли-продажи",
        sampleInput: "Договор купли-продажи",
        starterCode: `import java.util.Scanner;

// TODO: interface Printable

// TODO: class Document implements Printable

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();

        // TODO: Printable doc = new Document(text);
        // doc.print();
    }
}
`,
        tests: [
          { label: "Договор", stdin: "Договор купли-продажи\n", expected: ["Документ: Договор купли-продажи"] },
          { label: "Акт", stdin: "Акт приема-передачи\n", expected: ["Документ: Акт приема-передачи"] },
        ],
        requiredCode: [
          { pattern: "interface\\s+Printable", message: "Создай interface Printable" },
          { pattern: "implements\\s+Printable", message: "Используй implements Printable" },
          { pattern: "Printable\\s+\\w+\\s*=\\s*new\\s+Document", message: "Объяви переменную типа Printable" },
        ],
        hints: ["Методы в интерфейсах по умолчанию `public`, поэтому при реализации обязательно пиши `public void print()`."],
        solution: `import java.util.Scanner;

interface Printable {
    void print();
}

class Document implements Printable {
    private String text;

    public Document(String text) {
        this.text = text;
    }

    @Override
    public void print() {
        System.out.println("Документ: " + text);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();

        Printable doc = new Document(text);
        doc.print();
    }
}
`,
      },
      {
        id: "d16_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Утка: полет и плавание)",
        shortDesc: "Множественная реализация двух интерфейсов",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай два интерфейса:\n- `Flyable` с методом `void fly()`\n- `Swimmable` с методом `void swim()`\n\nСоздай класс `Duck implements Flyable, Swimmable` с полем `String name`.\n- `fly()` выводит `<name> летит в небе`\n- `swim()` выводит `<name> плывет по озеру`\nВ `main` создай объект утки и вызови оба действия.",
        requirements: ["Два интерфейса `Flyable` и `Swimmable`", "Класс `Duck implements Flyable, Swimmable`", "Вызов обоих методов"],
        exampleInput: "Дональд",
        exampleOutput: "Дональд летит в небе\nДональд плывет по озеру",
        sampleInput: "Дональд",
        starterCode: `import java.util.Scanner;

// TODO: interface Flyable
// TODO: interface Swimmable
// TODO: class Duck

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();

        // TODO
    }
}
`,
        tests: [
          { label: "Дональд", stdin: "Дональд\n", expected: ["Дональд летит в небе", "Дональд плывет по озеру"] },
          { label: "Скрудж", stdin: "Скрудж\n", expected: ["Скрудж летит в небе", "Скрудж плывет по озеру"] },
        ],
        requiredCode: [
          { pattern: "implements\\s+Flyable\\s*,\\s*Swimmable|implements\\s+Swimmable\\s*,\\s*Flyable", message: "Реализуй оба интерфейса через запятую" },
        ],
        hints: ["`class Duck implements Flyable, Swimmable`"],
        solution: `import java.util.Scanner;

interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

class Duck implements Flyable, Swimmable {
    private String name;

    public Duck(String name) {
        this.name = name;
    }

    @Override
    public void fly() {
        System.out.println(name + " летит в небе");
    }

    @Override
    public void swim() {
        System.out.println(name + " плывет по озеру");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();

        Duck duck = new Duck(name);
        duck.fly();
        duck.swim();
    }
}
`,
      },
      {
        id: "d16_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Интерфейс со скидкой default)",
        shortDesc: "Default-методы в интерфейсе интернет-магазина",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай интерфейс `Discountable` с методами:\n- `double getPrice()` (обычный абстрактный метод)\n- `default double getPriceWithDiscount(double percent)` (default-метод, возвращающий `getPrice() * (1.0 - percent / 100.0)`).\n\nСоздай класс `Product implements Discountable` с полями `String title`, `double price`. Конструктор заполняет поля, `getPrice()` возвращает `price`.\nВ `main` прочитай название, цену и процент скидки. Выведи `Товар: <title>, Цена со скидкой: <цена с округлением до десятых>`.",
        requirements: ["Интерфейс `Discountable` с `default` методом", "Класс `Product`", "Корректный расчет цены со скидкой"],
        exampleInput: "Клавиатура\n5000\n15",
        exampleOutput: "Товар: Клавиатура, Цена со скидкой: 4250.0",
        sampleInput: "Клавиатура\n5000\n15",
        starterCode: `import java.util.Scanner;

interface Discountable {
    double getPrice();
    // TODO: default double getPriceWithDiscount(double percent)
}

// TODO: class Product implements Discountable

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String title = scanner.nextLine();
        double price = scanner.nextDouble();
        double discount = scanner.nextDouble();

        // TODO
    }
}
`,
        tests: [
          { label: "Клавиатура, 5000, 15%", stdin: "Клавиатура\n5000\n15\n", expected: ["Товар: Клавиатура, Цена со скидкой: 4250.0"] },
          { label: "Мышь, 2000, 10%", stdin: "Мышь\n2000\n10\n", expected: ["Товар: Мышь, Цена со скидкой: 1800.0"] },
        ],
        requiredCode: [
          { pattern: "default\\s+double\\s+getPriceWithDiscount", message: "Используй default double getPriceWithDiscount" },
          { pattern: "implements\\s+Discountable", message: "Product должен реализовывать Discountable" },
        ],
        hints: ["`default double getPriceWithDiscount(double percent) { return getPrice() * (1.0 - percent / 100.0); }`"],
        solution: `import java.util.Scanner;

interface Discountable {
    double getPrice();

    default double getPriceWithDiscount(double percent) {
        return getPrice() * (1.0 - percent / 100.0);
    }
}

class Product implements Discountable {
    private String title;
    private double price;

    public Product(String title, double price) {
        this.title = title;
        this.price = price;
    }

    @Override
    public double getPrice() {
        return price;
    }

    public String getTitle() {
        return title;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String title = scanner.nextLine();
        double price = scanner.nextDouble();
        double discount = scanner.nextDouble();

        Product product = new Product(title, price);
        double finalPrice = product.getPriceWithDiscount(discount);

        System.out.println("Товар: " + product.getTitle() + ", Цена со скидкой: " + finalPrice);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 17: equals и hashCode                                         */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 17,
    moduleId: 2,
    title: "equals и hashCode: контракт сравнения объектов",
    short: "Сравнение ссылок == vs по значению equals, контракт для HashSet/HashMap",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["== vs equals()", "Класс Object", "Контракт equals и hashCode", "Objects.equals и Objects.hash"],
    videos: [
      { author: "Алишев", query: "Алишев Java equals hashCode", note: "Контракт equals и hashCode" },
      { author: "Заур Трегулов", query: "Заур Трегулов equals hashCode Java", note: "Как правильно переопределять" },
    ],
    theory: [
      { type: "h", text: "В чем разница между == и equals()?" },
      {
        type: "p",
        text: "Оператор `==` сравнивает **адреса в памяти** (ссылки). Если два разных объекта имеют одинаковые поля, `obj1 == obj2` вернет `false`! Метод `equals()` предназначен для сравнения объектов **по значению их полей**.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Паспорт и Человек",
        text: "Два человека с одинаковым именем «Алексей» — это разные люди (`==` возвращает `false`). Но если у них совпадает номер паспорта, государство считает их одной персоной (`equals()` вернет `true`). Хэшкод (`hashCode()`) — это номер шкафчика в гардеробе, куда положили куртку по номеру паспорта.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Золотой контракт equals / hashCode",
        text: "1. Если `a.equals(b) == true`, то `a.hashCode()` **ОБЯЗАН** быть равен `b.hashCode()`.\n2. Если `a.hashCode() == b.hashCode()`, объекты **НЕ ОБЯЗАТЕЛЬНО** равны (это называется коллизией хэша).\n3. Если нарушить контракт — `HashSet` и `HashMap` перестанут находить добавленные объекты!",
      },
      {
        type: "code",
        caption: "Каноническое переопределение equals и hashCode в Java",
        code: `import java.util.Objects;

class User {
    private int id;
    private String email;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true; // Сравнение по ссылке
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id == user.id && Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }
}`,
      },
    ],
    tasks: [
      {
        id: "d17_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Сравнение точек Point)",
        shortDesc: "Переопределение equals для двумерной координаты",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай класс `Point` с полями `int x` и `int y`. Переопредели метод `boolean equals(Object o)` так, чтобы точки считались равными, если совпадают обе координаты `x` и `y`.\nВ `main` прочитай координаты двух точек `x1 y1` и `x2 y2`. Сравни их через `p1.equals(p2)` и выведи `Равны: true` или `Равны: false`.",
        requirements: ["Класс `Point` с полями `x`, `y`", "Переопределенный метод `equals`", "Проверка равенства"],
        exampleInput: "3 4\n3 4",
        exampleOutput: "Равны: true",
        sampleInput: "3 4\n3 4",
        starterCode: `import java.util.Scanner;

class Point {
    int x;
    int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    // TODO: @Override public boolean equals(Object o)
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Point p1 = new Point(scanner.nextInt(), scanner.nextInt());
        Point p2 = new Point(scanner.nextInt(), scanner.nextInt());

        System.out.println("Равны: " + p1.equals(p2));
    }
}
`,
        tests: [
          { label: "Одинаковые точки (3,4)", stdin: "3 4\n3 4\n", expected: ["Равны: true"] },
          { label: "Разные точки (1,2) и (3,4)", stdin: "1 2\n3 4\n", expected: ["Равны: false"] },
        ],
        requiredCode: [
          { pattern: "boolean\\s+equals\\s*\\(\\s*Object", message: "Переопредели boolean equals(Object o)" },
        ],
        hints: ["`if (o instanceof Point p) return this.x == p.x && this.y == p.y; return false;`"],
        solution: `import java.util.Scanner;

class Point {
    int x;
    int y;

    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Point point = (Point) o;
        return x == point.x && y == point.y;
    }

    @Override
    public int hashCode() {
        return 31 * x + y;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Point p1 = new Point(scanner.nextInt(), scanner.nextInt());
        Point p2 = new Point(scanner.nextInt(), scanner.nextInt());

        System.out.println("Равны: " + p1.equals(p2));
    }
}
`,
      },
      {
        id: "d17_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Пользователь: equals и hashCode)",
        shortDesc: "Соблюдение контракта equals и hashCode",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай класс `User` с полями `int id` и `String username`. Переопредели `equals` и `hashCode` с использованием `java.util.Objects` (сравнение по `id` и `username`).\nВ `main` создай двух пользователей. Выведи результат `equals` и совпадают ли их `hashCode`.",
        requirements: ["Класс `User` с `equals` и `hashCode`", "Использование `Objects.equals` и `Objects.hash`", "Проверка совпадения хэшкодов"],
        exampleInput: "101 alex\n101 alex",
        exampleOutput: "equals: true\nhashCode match: true",
        sampleInput: "101 alex\n101 alex",
        starterCode: `import java.util.Objects;
import java.util.Scanner;

class User {
    private int id;
    private String username;

    public User(int id, String username) {
        this.id = id;
        this.username = username;
    }

    // TODO: equals и hashCode
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        User u1 = new User(scanner.nextInt(), scanner.next());
        User u2 = new User(scanner.nextInt(), scanner.next());

        System.out.println("equals: " + u1.equals(u2));
        System.out.println("hashCode match: " + (u1.hashCode() == u2.hashCode()));
    }
}
`,
        tests: [
          { label: "Идентичные пользователи", stdin: "101 alex\n101 alex\n", expected: ["equals: true", "hashCode match: true"] },
          { label: "Разные ID", stdin: "101 alex\n102 alex\n", expected: ["equals: false", "hashCode match: false"] },
        ],
        requiredCode: [
          { pattern: "Objects\\.hash", message: "Используй Objects.hash(...) в hashCode()" },
          { pattern: "boolean\\s+equals\\s*\\(\\s*Object", message: "Переопредели equals(Object o)" },
        ],
        hints: ["`return Objects.hash(id, username);`"],
        solution: `import java.util.Objects;
import java.util.Scanner;

class User {
    private int id;
    private String username;

    public User(int id, String username) {
        this.id = id;
        this.username = username;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return id == user.id && Objects.equals(username, user.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        User u1 = new User(scanner.nextInt(), scanner.next());
        User u2 = new User(scanner.nextInt(), scanner.next());

        System.out.println("equals: " + u1.equals(u2));
        System.out.println("hashCode match: " + (u1.hashCode() == u2.hashCode()));
    }
}
`,
      },
      {
        id: "d17_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Каталог товаров без дубликатов)",
        shortDesc: "Поиск дубликатов в массиве через equals",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай класс `Item` с полями `String sku` (артикул) и `double price`. Товары считаются одинаковыми, если у них совпадает `sku` (цена может обновляться).\nРеализуй `equals` и `hashCode` только по полю `sku`.\nВ `main` прочитай 3 товара. Проверь, есть ли среди них дубликат (первый равен второму или первому равен третий или второй равен третьему).\nВыведи `Дубликаты найдены: да` или `Дубликаты найдены: нет`.",
        requirements: ["Класс `Item` со сравнением по `sku`", "Проверка на дубликаты через `equals`"],
        exampleInput: "A100 500\nB200 700\nA100 550",
        exampleOutput: "Дубликаты найдены: да",
        sampleInput: "A100 500\nB200 700\nA100 550",
        starterCode: `import java.util.Objects;
import java.util.Scanner;

class Item {
    String sku;
    double price;

    Item(String sku, double price) {
        this.sku = sku;
        this.price = price;
    }

    // TODO: equals и hashCode по sku
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Item i1 = new Item(scanner.next(), scanner.nextDouble());
        Item i2 = new Item(scanner.next(), scanner.nextDouble());
        Item i3 = new Item(scanner.next(), scanner.nextDouble());

        // TODO
    }
}
`,
        tests: [
          { label: "Дубликат A100", stdin: "A100 500\nB200 700\nA100 550\n", expected: ["Дубликаты найдены: да"] },
          { label: "Все уникальные", stdin: "A100 500\nB200 700\nC300 900\n", expected: ["Дубликаты найдены: нет"] },
        ],
        requiredCode: [
          { pattern: "boolean\\s+equals\\s*\\(\\s*Object", message: "Переопредели equals" },
          { pattern: "Objects\\.equals\\(sku", message: "Сравнивай sku через Objects.equals" },
        ],
        hints: ["`boolean hasDuplicates = i1.equals(i2) || i1.equals(i3) || i2.equals(i3);`"],
        solution: `import java.util.Objects;
import java.util.Scanner;

class Item {
    String sku;
    double price;

    Item(String sku, double price) {
        this.sku = sku;
        this.price = price;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Item item = (Item) o;
        return Objects.equals(sku, item.sku);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sku);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Item i1 = new Item(scanner.next(), scanner.nextDouble());
        Item i2 = new Item(scanner.next(), scanner.nextDouble());
        Item i3 = new Item(scanner.next(), scanner.nextDouble());

        boolean hasDuplicates = i1.equals(i2) || i1.equals(i3) || i2.equals(i3);
        System.out.println("Дубликаты найдены: " + (hasDuplicates ? "да" : "нет"));
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 18: String, StringBuilder и toString                          */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 18,
    moduleId: 2,
    title: "String, StringBuilder и toString: эффективная работа со строками",
    short: "String pool, иммутабельность, почему += в цикле — антипаттерн, StringBuilder",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["Иммутабельность String", "String Pool", "StringBuilder vs StringBuffer", "toString()"],
    videos: [
      { author: "Алишев", query: "Алишев Java String StringBuilder", note: "Строки и StringBuilder" },
      { author: "Заур Трегулов", query: "Заур Трегулов String pool Java", note: "Пул строк и память" },
    ],
    theory: [
      { type: "h", text: "Почему String в Java неизменяем (immutable)?" },
      {
        type: "p",
        text: "В Java строки являются **неизменяемыми**. Каждая операция «изменения» строки (например, `s += \"!\"` или `s.replace(...)`) на самом деле создает совершенно **новый** объект в памяти, а старый остается лежать до сборки мусора (Garbage Collector).",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Гравировка на камне",
        text: "Строка `String` — это надпись, высеченная на гранитном камне. Вы не можете дописать букву в конец камня — вам приходится взять новый камень и высечь всю надпись заново. Если вам нужен черновик, где можно стирать и дописывать буквы миллион раз, используйте `StringBuilder` (белая доска с маркером).",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Частая ошибка на собеседованиях",
        text: "Никогда не склеивайте строки через `+` внутри цикла: `for (...) str += arr[i];`. Это приводит к квадратичной сложности $O(N^2)$ по времени и засоряет память. Всегда используйте `StringBuilder`!",
      },
      {
        type: "code",
        caption: "Сравнение String и StringBuilder",
        code: `// Плохо: создает 1000 временных объектов в Heap
String s = "";
for (int i = 0; i < 1000; i++) s += i;

// Отлично: один изменяемый буфер
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) sb.append(i);
String result = sb.toString();`,
      },
    ],
    tasks: [
      {
        id: "d18_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Красивый toString)",
        shortDesc: "Переопределение toString для вывода в консоль",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай класс `Person` с полями `String name` и `int age`. Переопредели метод `public String toString()`, возвращающий строку вида `Person[name=Имя, age=Возраст]`.\nВ `main` создай объект и напечатай его через `System.out.println(p)`.",
        requirements: ["Класс `Person`", "Переопределенный метод `toString()`"],
        exampleInput: "Иван\n25",
        exampleOutput: "Person[name=Иван, age=25]",
        sampleInput: "Иван\n25",
        starterCode: `import java.util.Scanner;

class Person {
    String name;
    int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // TODO: @Override public String toString()
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        int age = scanner.nextInt();

        Person p = new Person(name, age);
        System.out.println(p);
    }
}
`,
        tests: [
          { label: "Иван 25", stdin: "Иван\n25\n", expected: ["Person[name=Иван, age=25]"] },
          { label: "Анна 19", stdin: "Анна\n19\n", expected: ["Person[name=Анна, age=19]"] },
        ],
        requiredCode: [{ pattern: "public\\s+String\\s+toString\\s*\\(", message: "Переопредели public String toString()" }],
        hints: ["`return \"Person[name=\" + name + \", age=\" + age + \"]\";`"],
        solution: `import java.util.Scanner;

class Person {
    String name;
    int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Person[name=" + name + ", age=" + age + "]";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        int age = scanner.nextInt();

        Person p = new Person(name, age);
        System.out.println(p);
    }
}
`,
      },
      {
        id: "d18_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Перевертыш со StringBuilder)",
        shortDesc: "Реверс строки и проверка палиндрома через StringBuilder",
        difficulty: "Средний",
        xp: 35,
        description:
          "Прочитай строку с клавиатуры. Используя `StringBuilder`, переверни ее методом `.reverse()`. Выведи перевернутую строку, а также проверь, является ли исходная строка палиндромом (без учета регистра).\nФормат вывода:\n`Реверс: <reversed>`\n`Палиндром: <да|нет>`",
        requirements: ["Использование `StringBuilder` и `.reverse()`", "Проверка на палиндром через `equalsIgnoreCase`"],
        exampleInput: "Шалаш",
        exampleOutput: "Реверс: шалаШ\nПалиндром: да",
        sampleInput: "Шалаш",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();

        // TODO: используй StringBuilder и его метод reverse()
    }
}
`,
        tests: [
          { label: "Шалаш", stdin: "Шалаш\n", expected: ["Реверс: шалаШ", "Палиндром: да"] },
          { label: "Java", stdin: "Java\n", expected: ["Реверс: avaJ", "Палиндром: нет"] },
        ],
        requiredCode: [
          { pattern: "new\\s+StringBuilder", message: "Используй new StringBuilder(...)" },
          { pattern: "\\.reverse\\(\\)", message: "Используй метод .reverse()" },
        ],
        hints: ["`String rev = new StringBuilder(s).reverse().toString(); boolean isPal = s.equalsIgnoreCase(rev);`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();

        String reversed = new StringBuilder(s).reverse().toString();
        boolean isPalindrome = s.equalsIgnoreCase(reversed);

        System.out.println("Реверс: " + reversed);
        System.out.println("Палиндром: " + (isPalindrome ? "да" : "нет"));
    }
}
`,
      },
      {
        id: "d18_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Быстрый сборщик CSV строки)",
        shortDesc: "Объединение элементов через StringBuilder с разделителем",
        difficulty: "Средний",
        xp: 40,
        description:
          "Прочитай количество слов $N$, а затем $N$ слов. Собери их в единую строку через запятую и пробел (`, `) с помощью `StringBuilder` так, чтобы после последнего слова НЕ было запятой!\nВыведи итоговую строку `CSV: <результат>`.",
        requirements: ["Использование `StringBuilder.append()`", "Отсутствие завершающей запятой"],
        exampleInput: "3\nApple\nBanana\nCherry",
        exampleOutput: "CSV: Apple, Banana, Cherry",
        sampleInput: "3\nApple\nBanana\nCherry",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        StringBuilder sb = new StringBuilder();
        // TODO: добавь слова через append с разделителем ", "
    }
}
`,
        tests: [
          { label: "3 фрукта", stdin: "3\nApple\nBanana\nCherry\n", expected: ["CSV: Apple, Banana, Cherry"] },
          { label: "2 города", stdin: "2\nМосква\nТашкент\n", expected: ["CSV: Москва, Ташкент"] },
        ],
        requiredCode: [
          { pattern: "StringBuilder", message: "Используй StringBuilder" },
          { pattern: "\\.append\\(", message: "Используй метод .append()" },
        ],
        hints: ["`if (i > 0) sb.append(\", \"); sb.append(word);`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            String word = scanner.nextLine();
            if (i > 0) {
                sb.append(", ");
            }
            sb.append(word);
        }

        System.out.println("CSV: " + sb.toString());
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 19: Исключения: try / catch / finally                         */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 19,
    moduleId: 2,
    title: "Исключения: try, catch, finally и обработка аварий",
    short: "Throwable, checked vs unchecked, ArithmeticException, throw и throws",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["Иерархия Throwable", "Checked vs Unchecked", "try-catch-finally", "throw и throws"],
    videos: [
      { author: "Алишев", query: "Алишев Java исключения", note: "Исключения от А до Я" },
      { author: "Заур Трегулов", query: "Заур Трегулов исключения Java exceptions", note: "try-catch-finally" },
    ],
    theory: [
      { type: "h", text: "Что такое исключение (Exception)?" },
      {
        type: "p",
        text: "Исключение — это нештатная ситуация во время работы программы (деление на 0, файл не найден, обрыв сети). Если исключение не перехватить, программа аварийно падает с «красным трейсом».",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Подушка безопасности в авто",
        text: "Код в блоке `try` — это поездка на автомобиле. Если происходит столкновение (`Exception`), срабатывает подушка безопасности `catch`, которая спасает пассажиров и позволяет машине плавно съехать на обочину, а не разбиться насмерть.",
      },
      {
        type: "table",
        head: ["Тип исключения", "Наследуется от", "Проверка компилятором", "Примеры"],
        rows: [
          ["Unchecked (Непроверяемые)", "`RuntimeException`", "Не проверяются компилятором", "`NullPointerException`, `ArithmeticException`"],
          ["Checked (Проверяемые)", "`Exception` (но не Runtime)", "Компилятор ОБЯЗЫВАЕТ обработать", "`IOException`, `SQLException`"],
          ["Errors (Ошибки JVM)", "`Error`", "Фатальные ошибки среды", "`OutOfMemoryError`, `StackOverflowError`"],
        ],
      },
      {
        type: "code",
        caption: "Синтаксис безопасной обработки",
        code: `try {
    int res = 10 / 0; // бросает ArithmeticException
} catch (ArithmeticException e) {
    System.out.println("Ошибка: деление на ноль!");
} finally {
    System.out.println("Этот блок выполнится ВСЕГДА, даже при ошибке");
}`,
      },
    ],
    tasks: [
      {
        id: "d19_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Безопасный калькулятор деления)",
        shortDesc: "Перехват ArithmeticException при делении на 0",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Прочитай два целых числа $a$ и $b$. В блоке `try` выполни целочисленное деление `a / b` и выведи `Результат: <результат>`.\nВ блоке `catch (ArithmeticException e)` перехвати деление на ноль и выведи `Ошибка: деление на ноль невозможно!`.",
        requirements: ["Использование блоков `try` и `catch (ArithmeticException)`"],
        exampleInput: "10 2",
        exampleOutput: "Результат: 5",
        sampleInput: "10 0",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();

        // TODO: оберни деление в try-catch
    }
}
`,
        tests: [
          { label: "10 / 2", stdin: "10 2\n", expected: ["Результат: 5"] },
          { label: "10 / 0 (деление на ноль)", stdin: "10 0\n", expected: ["Ошибка: деление на ноль невозможно!"] },
        ],
        requiredCode: [
          { pattern: "try\\s*\\{", message: "Используй блок try" },
          { pattern: "catch\\s*\\(\\s*ArithmeticException", message: "Перехвати ArithmeticException" },
        ],
        hints: ["`try { System.out.println(\"Результат: \" + (a / b)); } catch (ArithmeticException e) { ... }`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();

        try {
            int res = a / b;
            System.out.println("Результат: " + res);
        } catch (ArithmeticException e) {
            System.out.println("Ошибка: деление на ноль невозможно!");
        }
    }
}
`,
      },
      {
        id: "d19_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Сумма валидных чисел)",
        shortDesc: "Перехват NumberFormatException при парсинге строк",
        difficulty: "Средний",
        xp: 35,
        description:
          "Прочитай число $N$, а затем $N$ строк. Каждая строка может содержать число или текст (мусор). Для каждой строки пробуй распарсить её в целое число через `Integer.parseInt(s)`.\nЕсли строка не является числом, перехвати `NumberFormatException` и пропусти её.\nВ конце выведи `Сумма валидных чисел: <сумма>`.",
        requirements: ["Использование `try-catch` с `NumberFormatException`", "Подсчет суммы валидных чисел"],
        exampleInput: "4\n10\nпривет\n25\nмир",
        exampleOutput: "Сумма валидных чисел: 35",
        sampleInput: "4\n10\nпривет\n25\nмир",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        int sum = 0;
        // TODO: прочитай n строк, парси через Integer.parseInt() и лови NumberFormatException
    }
}
`,
        tests: [
          { label: "Смешанный ввод", stdin: "4\n10\nпривет\n25\nмир\n", expected: ["Сумма валидных чисел: 35"] },
          { label: "Только числа", stdin: "3\n100\n200\n300\n", expected: ["Сумма валидных чисел: 600"] },
        ],
        requiredCode: [
          { pattern: "Integer\\.parseInt", message: "Используй Integer.parseInt(...)" },
          { pattern: "catch\\s*\\(\\s*NumberFormatException", message: "Перехватывай NumberFormatException" },
        ],
        hints: ["Оберни `sum += Integer.parseInt(s)` в `try-catch (NumberFormatException e) { /* игнорируем */ }`"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        int sum = 0;
        for (int i = 0; i < n; i++) {
            String line = scanner.nextLine();
            try {
                int val = Integer.parseInt(line);
                sum += val;
            } catch (NumberFormatException e) {
                // Игнорируем нечисловые строки
            }
        }

        System.out.println("Сумма валидных чисел: " + sum);
    }
}
`,
      },
      {
        id: "d19_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Валидатор возраста с throw)",
        shortDesc: "Генерация исключения IllegalArgumentException через throw",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай метод `static void checkAge(int age)`:\n- Если `age < 0 || age > 130`, метод выбрасывает исключение: `throw new IllegalArgumentException(\"Некорректный возраст: \" + age);`\n- Иначе печатает `Возраст принят: <age>`.\nВ `main` вызови `checkAge` в блоке `try-catch` и при ошибке выведи сообщение из `e.getMessage()`.",
        requirements: ["Ключевое слово `throw new IllegalArgumentException(...)`", "Блок `try-catch` в main"],
        exampleInput: "-5",
        exampleOutput: "Перехвачено исключение: Некорректный возраст: -5",
        sampleInput: "-5",
        starterCode: `import java.util.Scanner;

public class Main {
    static void checkAge(int age) {
        // TODO: проверка и throw new IllegalArgumentException
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int age = scanner.nextInt();

        // TODO: вызов checkAge в try-catch
    }
}
`,
        tests: [
          { label: "Отрицательный возраст -5", stdin: "-5\n", expected: ["Перехвачено исключение: Некорректный возраст: -5"] },
          { label: "Корректный возраст 20", stdin: "20\n", expected: ["Возраст принят: 20"] },
        ],
        requiredCode: [
          { pattern: "throw\\s+new\\s+IllegalArgumentException", message: "Используй throw new IllegalArgumentException" },
          { pattern: "e\\.getMessage\\(\\)", message: "Выведи сообщение ошибки через e.getMessage()" },
        ],
        hints: ["`catch (IllegalArgumentException e) { System.out.println(\"Перехвачено исключение: \" + e.getMessage()); }`"],
        solution: `import java.util.Scanner;

public class Main {
    static void checkAge(int age) {
        if (age < 0 || age > 130) {
            throw new IllegalArgumentException("Некорректный возраст: " + age);
        }
        System.out.println("Возраст принят: " + age);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int age = scanner.nextInt();

        try {
            checkAge(age);
        } catch (IllegalArgumentException e) {
            System.out.println("Перехвачено исключение: " + e.getMessage());
        }
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 20: Свои исключения и try-with-resources                      */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 20,
    moduleId: 2,
    title: "Свои исключения и try-with-resources: надежный код без утечек",
    short: "Кастомные классы исключений, AutoCloseable, автоматическое закрытие ресурсов",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["Свои классы исключений", "AutoCloseable", "try-with-resources", "Подавленные исключения"],
    videos: [
      { author: "Алишев", query: "Алишев Java собственные исключения", note: "Свои классы Exception" },
      { author: "Заур Трегулов", query: "Заур Трегулов try with resources", note: "try-with-resources и AutoCloseable" },
    ],
    theory: [
      { type: "h", text: "Зачем создавать свои исключения?" },
      {
        type: "p",
        text: "Стандартных исключений Java (`NullPointerException`, `IllegalArgumentException`) недостаточно, чтобы передать бизнес-смысл ошибки. В enterprise-приложениях создают предметные классы: `UserNotFoundException`, `InsufficientFundsException`, `PaymentFailedException`.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Медицинский диагноз",
        text: "Вместо общей фразы «Пациенту плохо» врач ставит точный диагноз: «Аллергия на арахис». Точно так же собственное исключение `InsufficientFundsException` четко говорит приложению, что денег на балансе не хватило, а не произошла общая ошибка вычислений.",
      },
      {
        type: "h",
        text: "try-with-resources и интерфейс AutoCloseable",
      },
      {
        type: "p",
        text: "До Java 7 файлы, соединения с базой и сокеты закрывали в громоздких блоках `finally`. В Java 7 появилась конструкция **try-with-resources**: любой объект, реализующий интерфейс `AutoCloseable`, будет закрыт автоматически в конце блока, даже если вылетела критическая ошибка!",
      },
      {
        type: "code",
        caption: "Пример AutoCloseable и try-with-resources",
        code: `class Database implements AutoCloseable {
    public void execute(String sql) { System.out.println("Выполняем: " + sql); }
    @Override
    public void close() { System.out.println("Соединение с БД закрыто!"); }
}

// Ресурс закрывается АВТОМАТИЧЕСКИ без finally:
try (Database db = new Database()) {
    db.execute("SELECT * FROM users");
}`,
      },
    ],
    tasks: [
      {
        id: "d20_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Исключение нехватки средств)",
        shortDesc: "Создание кастомного RuntimeException",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай класс своего непроверяемого исключения `InsufficientFundsException extends RuntimeException` с конструктором `(String msg)`.\nСоздай класс `Wallet` с полем `int balance = 500`. Метод `void pay(int amount)`: если `amount > balance`, выбрасывает `throw new InsufficientFundsException(\"Недостаточно средств: нужно \" + amount + \", есть \" + balance);`. Иначе списывает деньги и выводит `Оплачено: <amount>, остаток: <balance>`.\nВ `main` прочитай сумму и вызови `pay` в блоке `try-catch`.",
        requirements: ["Класс `InsufficientFundsException extends RuntimeException`", "Бросок при нехватке средств", "Перехват и вывод сообщения"],
        exampleInput: "800",
        exampleOutput: "Ошибка: Недостаточно средств: нужно 800, есть 500",
        sampleInput: "800",
        starterCode: `import java.util.Scanner;

// TODO: class InsufficientFundsException extends RuntimeException

class Wallet {
    private int balance = 500;

    public void pay(int amount) {
        // TODO
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int amount = scanner.nextInt();

        // TODO
    }
}
`,
        tests: [
          { label: "Сумма 800 (превышение)", stdin: "800\n", expected: ["Ошибка: Недостаточно средств: нужно 800, есть 500"] },
          { label: "Сумма 200 (успех)", stdin: "200\n", expected: ["Оплачено: 200, остаток: 300"] },
        ],
        requiredCode: [
          { pattern: "extends\\s+RuntimeException", message: "Наследуй класс от RuntimeException" },
          { pattern: "throw\\s+new\\s+InsufficientFundsException", message: "Бросай InsufficientFundsException" },
        ],
        hints: ["`catch (InsufficientFundsException e) { System.out.println(\"Ошибка: \" + e.getMessage()); }`"],
        solution: `import java.util.Scanner;

class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(String msg) {
        super(msg);
    }
}

class Wallet {
    private int balance = 500;

    public void pay(int amount) {
        if (amount > balance) {
            throw new InsufficientFundsException("Недостаточно средств: нужно " + amount + ", есть " + balance);
        }
        balance -= amount;
        System.out.println("Оплачено: " + amount + ", остаток: " + balance);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int amount = scanner.nextInt();

        Wallet wallet = new Wallet();
        try {
            wallet.pay(amount);
        } catch (InsufficientFundsException e) {
            System.out.println("Ошибка: " + e.getMessage());
        }
    }
}
`,
      },
      {
        id: "d20_t2",
        type: "practice",
        title: "Задача 2: Основная практика (AutoCloseable файл)",
        shortDesc: "Автоматическое закрытие ресурсов через try-with-resources",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай класс `VirtualFile implements AutoCloseable` с полем `String filename`.\n- Метод `void write(String data)`: печатает `Запись в <filename>: <data>`\n- Переопределенный метод `close()`: печатает `Файл <filename> успешно закрыт`.\nВ `main` открой `VirtualFile` через конструкцию `try-with-resources` и запиши данные.",
        requirements: ["Реализация интерфейса `AutoCloseable`", "Конструкция `try (VirtualFile vf = ...) { ... }`", "Гарантированный вызов `close()`"],
        exampleInput: "log.txt\nСистема запущена",
        exampleOutput: "Запись в log.txt: Система запущена\nФайл log.txt успешно закрыт",
        sampleInput: "log.txt\nСистема запущена",
        starterCode: `import java.util.Scanner;

// TODO: class VirtualFile implements AutoCloseable

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        String text = scanner.nextLine();

        // TODO: используй try-with-resources
    }
}
`,
        tests: [
          { label: "log.txt", stdin: "log.txt\nСистема запущена\n", expected: ["Запись в log.txt: Система запущена", "Файл log.txt успешно закрыт"] },
          { label: "data.csv", stdin: "data.csv\nID;Name\n", expected: ["Запись в data.csv: ID;Name", "Файл data.csv успешно закрыт"] },
        ],
        requiredCode: [
          { pattern: "implements\\s+AutoCloseable", message: "Реализуй AutoCloseable" },
          { pattern: "try\\s*\\(\\s*VirtualFile", message: "Используй try-with-resources: try (VirtualFile ...)" },
        ],
        hints: ["`try (VirtualFile vf = new VirtualFile(name)) { vf.write(text); }`"],
        solution: `import java.util.Scanner;

class VirtualFile implements AutoCloseable {
    private String filename;

    public VirtualFile(String filename) {
        this.filename = filename;
    }

    public void write(String data) {
        System.out.println("Запись в " + filename + ": " + data);
    }

    @Override
    public void close() {
        System.out.println("Файл " + filename + " успешно закрыт");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        String text = scanner.nextLine();

        try (VirtualFile vf = new VirtualFile(name)) {
            vf.write(text);
        }
    }
}
`,
      },
      {
        id: "d20_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Проверяемое InvalidEmailException)",
        shortDesc: "Checked Exception с обязательным throws и валидацией",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай проверяемое исключение `InvalidEmailException extends Exception`.\nСоздай метод `static void validateEmail(String email) throws InvalidEmailException`:\n- Если email не содержит символ `@` или символ `.`, выброси `throw new InvalidEmailException(\"Неверный формат почты: \" + email);`\n- Иначе напечатай `Почта валидна: <email>`.\nВ `main` обработай вызов в `try-catch`.",
        requirements: ["Checked исключение `extends Exception`", "Спецификатор `throws InvalidEmailException`", "Обработка ошибки в `main`"],
        exampleInput: "bad-email",
        exampleOutput: "Поймана ошибка: Неверный формат почты: bad-email",
        sampleInput: "bad-email",
        starterCode: `import java.util.Scanner;

// TODO: InvalidEmailException extends Exception

public class Main {
    static void validateEmail(String email) throws InvalidEmailException {
        // TODO
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String email = scanner.nextLine();

        // TODO
    }
}
`,
        tests: [
          { label: "Неверный email", stdin: "bad-email\n", expected: ["Поймана ошибка: Неверный формат почты: bad-email"] },
          { label: "Верный email", stdin: "dev@java.com\n", expected: ["Почта валидна: dev@java.com"] },
        ],
        requiredCode: [
          { pattern: "extends\\s+Exception", message: "Наследуй от Exception для checked исключения" },
          { pattern: "throws\\s+InvalidEmailException", message: "Объяви throws InvalidEmailException" },
        ],
        hints: ["`if (!email.contains(\"@\") || !email.contains(\".\")) throw new InvalidEmailException(...);`"],
        solution: `import java.util.Scanner;

class InvalidEmailException extends Exception {
    public InvalidEmailException(String msg) {
        super(msg);
    }
}

public class Main {
    static void validateEmail(String email) throws InvalidEmailException {
        if (!email.contains("@") || !email.contains(".")) {
            throw new InvalidEmailException("Неверный формат почты: " + email);
        }
        System.out.println("Почта валидна: " + email);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String email = scanner.nextLine();

        try {
            validateEmail(email);
        } catch (InvalidEmailException e) {
            System.out.println("Поймана ошибка: " + e.getMessage());
        }
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 21: Итоговый проект ООП: «Банковская система»                */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 21,
    moduleId: 2,
    title: "Итоговый проект модуля 2: «Банковская система»",
    short: "Сборка всех концепций ООП: абстрактные классы, интерфейсы, полиморфизм и исключения",
    difficulty: "Сложный",
    duration: "~3 часа",
    xp: 100,
    ready: true,
    topics: ["Архитектура приложения", "Иерархия счетов", "Бизнес-исключения", "Полиморфный перевод средств"],
    videos: [
      { author: "Алишев", query: "Алишев Java ООП проект", note: "Проектирование ООП-системы" },
      { author: "Заур Трегулов", query: "Заур Трегулов ООП практика банковский счёт", note: "Архитектура счетов" },
    ],
    theory: [
      { type: "h", text: "Финальная сборка ООП" },
      {
        type: "p",
        text: "Поздравляем! Ты изучил все 4 столпа объектно-ориентированного программирования (Инкапсуляция, Наследование, Полиморфизм, Абстракция), а также контракты `equals`/`hashCode`, `StringBuilder` и систему исключений. Пришло время собрать полноценный банковский сервис.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Архитектура проекта",
        text: "В банке есть счета разных типов: **Дебетовый счёт** (баланс не может опускаться ниже 0) и **Кредитный счёт** (баланс может уходить в минус до заданного кредитного лимита). Метод межбанковского перевода атомарен: если со счета списались деньги, но зачисление сорвалось, транзакция должна быть защищена.",
      },
      {
        type: "code",
        caption: "Схема классов проекта",
        code: `// Иерархия:
abstract class Account {
    protected String id;
    protected double balance;
    public abstract void withdraw(double amount);
}

class DebitAccount extends Account { ... }
class CreditAccount extends Account { ... }

class BankService {
    public void transfer(Account from, Account to, double amount) { ... }
}`,
      },
    ],
    tasks: [
      {
        id: "d21_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Абстрактный счет Account)",
        shortDesc: "Базовый класс с инкапсулированным балансом",
        difficulty: "Средний",
        xp: 25,
        description:
          "Создай абстрактный класс `Account` с защищенными полями `String id` и `double balance`. Добавь конструктор и методы:\n- `void deposit(double amount)`: увеличивает баланс на amount (если amount > 0)\n- `double getBalance()`: возвращает баланс\n- `abstract void withdraw(double amount)`.\n\nСоздай `DebitAccount extends Account`: метод `withdraw` снимает деньги, только если `balance >= amount`, иначе бросает `throw new IllegalArgumentException(\"Недостаточно средств на счете \" + id);`.\nВ `main` создай дебетовый счет, пополни его на $X$ и сними $Y$.",
        requirements: ["Абстрактный класс `Account`", "Класс `DebitAccount`", "Защита от ухода в минус"],
        exampleInput: "ACC-1\n1000\n300",
        exampleOutput: "Баланс ACC-1: 700.0",
        sampleInput: "ACC-1\n1000\n300",
        starterCode: `import java.util.Scanner;

abstract class Account {
    // TODO: id, balance, deposit(), withdraw()
}

// TODO: DebitAccount extends Account

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String id = scanner.nextLine();
        double dep = scanner.nextDouble();
        double wth = scanner.nextDouble();

        // TODO
    }
}
`,
        tests: [
          { label: "Снятие 300 из 1000", stdin: "ACC-1\n1000\n300\n", expected: ["Баланс ACC-1: 700.0"] },
          { label: "Снятие 1200 из 1000 (ошибка)", stdin: "ACC-2\n1000\n1200\n", expected: ["Ошибка: Недостаточно средств на счете ACC-2"] },
        ],
        requiredCode: [
          { pattern: "abstract\\s+class\\s+Account", message: "Создай abstract class Account" },
          { pattern: "extends\\s+Account", message: "DebitAccount должен наследовать Account" },
        ],
        hints: ["Оберни снятие в try-catch для обработки IllegalArgumentException."],
        solution: `import java.util.Scanner;

abstract class Account {
    protected String id;
    protected double balance;

    public Account(String id) {
        this.id = id;
    }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public double getBalance() {
        return balance;
    }

    public String getId() {
        return id;
    }

    public abstract void withdraw(double amount);
}

class DebitAccount extends Account {
    public DebitAccount(String id) {
        super(id);
    }

    @Override
    public void withdraw(double amount) {
        if (amount <= 0 || balance < amount) {
            throw new IllegalArgumentException("Недостаточно средств на счете " + id);
        }
        balance -= amount;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String id = scanner.nextLine();
        double dep = scanner.nextDouble();
        double wth = scanner.nextDouble();

        DebitAccount acc = new DebitAccount(id);
        acc.deposit(dep);

        try {
            acc.withdraw(wth);
            System.out.println("Баланс " + acc.getId() + ": " + acc.getBalance());
        } catch (IllegalArgumentException e) {
            System.out.println("Ошибка: " + e.getMessage());
        }
    }
}
`,
      },
      {
        id: "d21_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Кредитный счет CreditAccount)",
        shortDesc: "Счет с кредитным лимитом и отрицательным балансом",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай класс `CreditAccount extends Account` с полем `double creditLimit` (например, 5000).\nМетод `withdraw(amount)` разрешает снимать деньги, если `balance - amount >= -creditLimit`. При превышении лимита бросает `throw new IllegalArgumentException(\"Превышен кредитный лимит на счете \" + id);`.\nВ `main` создай кредитный счет с лимитом 5000, балансом 0, и попытайся снять сумму $X$.",
        requirements: ["Класс `CreditAccount`", "Поддержка отрицательного баланса до `-creditLimit`"],
        exampleInput: "CR-100\n3000",
        exampleOutput: "Баланс CR-100: -3000.0",
        sampleInput: "CR-100\n3000",
        starterCode: `import java.util.Scanner;

// TODO: CreditAccount extends Account

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String id = scanner.nextLine();
        double wth = scanner.nextDouble();

        // TODO
    }
}
`,
        tests: [
          { label: "Снятие 3000 при лимите 5000", stdin: "CR-100\n3000\n", expected: ["Баланс CR-100: -3000.0"] },
          { label: "Снятие 6000 при лимите 5000 (отказ)", stdin: "CR-200\n6000\n", expected: ["Ошибка: Превышен кредитный лимит на счете CR-200"] },
        ],
        requiredCode: [
          { pattern: "class\\s+CreditAccount\\s+extends\\s+Account", message: "CreditAccount должен наследовать Account" },
        ],
        hints: ["`if (balance - amount < -creditLimit) throw new IllegalArgumentException(...); balance -= amount;`"],
        solution: `import java.util.Scanner;

abstract class Account {
    protected String id;
    protected double balance;

    public Account(String id) {
        this.id = id;
    }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public double getBalance() {
        return balance;
    }

    public String getId() {
        return id;
    }

    public abstract void withdraw(double amount);
}

class CreditAccount extends Account {
    private double creditLimit;

    public CreditAccount(String id, double creditLimit) {
        super(id);
        this.creditLimit = creditLimit;
    }

    @Override
    public void withdraw(double amount) {
        if (balance - amount < -creditLimit) {
            throw new IllegalArgumentException("Превышен кредитный лимит на счете " + id);
        }
        balance -= amount;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String id = scanner.nextLine();
        double wth = scanner.nextDouble();

        CreditAccount acc = new CreditAccount(id, 5000.0);
        try {
            acc.withdraw(wth);
            System.out.println("Баланс " + acc.getId() + ": " + acc.getBalance());
        } catch (IllegalArgumentException e) {
            System.out.println("Ошибка: " + e.getMessage());
        }
    }
}
`,
      },
      {
        id: "d21_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Сервис межбанковских переводов)",
        shortDesc: "Полиморфный перевод средств между счетами любых типов",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Создай класс `BankTransferService` с методом:\n`public static void transfer(Account from, Account to, double amount)`:\n1. Снимает деньги со счета `from.withdraw(amount)`\n2. Зачисляет деньги на счет `to.deposit(amount)`\n3. Печатает `Перевод <amount> с <from.id> на <to.id> успешен`.\nВ `main` создай дебетовый счет с балансом 2000 и кредитный счет с балансом 0. Переведи сумму $X$ с дебетового на кредитный. Выведи балансы обоих счетов.",
        requirements: ["Метод `transfer(Account from, Account to, double amount)`", "Полиморфная работа с любыми счетами", "Корректные остатки на счетах"],
        exampleInput: "700",
        exampleOutput: "Перевод 700.0 с ACC-1 на CR-2 успешен\nACC-1: 1300.0\nCR-2: 700.0",
        sampleInput: "700",
        starterCode: `import java.util.Scanner;

// TODO: BankTransferService с методом transfer

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double amount = scanner.nextDouble();

        // TODO
    }
}
`,
        tests: [
          { label: "Перевод 700", stdin: "700\n", expected: ["Перевод 700.0 с ACC-1 на CR-2 успешен", "ACC-1: 1300.0", "CR-2: 700.0"] },
          { label: "Перевод 2500 (превышение баланса)", stdin: "2500\n", expected: ["Сбой перевода: Недостаточно средств на счете ACC-1"] },
        ],
        requiredCode: [
          { pattern: "transfer\\s*\\(\\s*Account\\s+\\w+\\s*,\\s*Account", message: "Метод transfer должен принимать полиморфные параметры (Account from, Account to)" },
        ],
        hints: ["`from.withdraw(amount); to.deposit(amount);`"],
        solution: `import java.util.Scanner;

abstract class Account {
    protected String id;
    protected double balance;

    public Account(String id) {
        this.id = id;
    }

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public double getBalance() {
        return balance;
    }

    public String getId() {
        return id;
    }

    public abstract void withdraw(double amount);
}

class DebitAccount extends Account {
    public DebitAccount(String id) {
        super(id);
    }

    @Override
    public void withdraw(double amount) {
        if (balance < amount) {
            throw new IllegalArgumentException("Недостаточно средств на счете " + id);
        }
        balance -= amount;
    }
}

class CreditAccount extends Account {
    private double creditLimit;

    public CreditAccount(String id, double creditLimit) {
        super(id);
        this.creditLimit = creditLimit;
    }

    @Override
    public void withdraw(double amount) {
        if (balance - amount < -creditLimit) {
            throw new IllegalArgumentException("Превышен кредитный лимит на счете " + id);
        }
        balance -= amount;
    }
}

class BankTransferService {
    public static void transfer(Account from, Account to, double amount) {
        from.withdraw(amount);
        to.deposit(amount);
        System.out.println("Перевод " + amount + " с " + from.getId() + " на " + to.getId() + " успешен");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double amount = scanner.nextDouble();

        DebitAccount acc1 = new DebitAccount("ACC-1");
        acc1.deposit(2000.0);

        CreditAccount acc2 = new CreditAccount("CR-2", 5000.0);

        try {
            BankTransferService.transfer(acc1, acc2, amount);
            System.out.println("ACC-1: " + acc1.getBalance());
            System.out.println("CR-2: " + acc2.getBalance());
        } catch (IllegalArgumentException e) {
            System.out.println("Сбой перевода: " + e.getMessage());
        }
    }
}
`,
      },
    ],
  }),
];
