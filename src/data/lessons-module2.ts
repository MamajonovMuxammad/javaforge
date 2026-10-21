import type { Lesson, LessonTask } from "./types";
import { module2AdvancedLessons } from "./lessons-module2-advanced";

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

const coreModule2Lessons: Lesson[] = [
  /* ------------------------------------------------------------------ */
  /*  DAY 8: Классы и объекты                                          */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 8,
    moduleId: 2,
    title: "Классы и объекты: чертёж и экземпляры",
    short: "Создание собственных типов данных, поля и методы",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["class и new", "Поля (состояние)", "Методы (поведение)", "Ссылки в памяти Heap"],
    videos: [
      { author: "Алишев", query: "Алишев Java классы и объекты", note: "Классы и объекты с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов классы и объекты Java", note: "Объекты в памяти" },
    ],
    theory: [
      { type: "h", text: "Что такое класс и объект?" },
      {
        type: "p",
        text: "В реальном мире нас окружают объекты: автомобиль, студент, банковский счет. У каждого объекта есть **состояние** (характеристики: цвет, баланс, имя) и **поведение** (действия: ехать, учиться, перевести деньги).",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Чертёж и Дом",
        text: "**Класс** — это чертёж архитектора на бумаге. **Объект (экземпляр)** — это реальный кирпичный дом, построенный по этому чертежу. По одному чертежу можно построить 100 разных домов с разным цветом стен и жильцами.",
      },
      {
        type: "code",
        caption: "Объявление класса и создание объектов",
        code: `class Car {
    String model; // поле класса (состояние)
    int year;

    void drive() { // метод класса (поведение)
        System.out.println(model + " едет вперед!");
    }
}

public class Main {
    public static void main(String[] args) {
        Car car1 = new Car(); // выделение памяти в Heap
        car1.model = "BMW";
        car1.year = 2024;
        car1.drive(); // BMW едет вперед!
    }
}`,
      },
    ],
    tasks: [
      {
        id: "d8_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Класс Книга)",
        shortDesc: "Создание простого класса и вызов метода",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай класс `Book` с полями `String title` и `int pages`. Добавь метод `void printInfo()`, который выводит `Книга: <title>, страниц: <pages>`. В `main` создай объект книги и вызови метод.",
        requirements: ["Создай класс `Book`", "Добавь метод `printInfo()`", "Выведи информацию о книге"],
        exampleInput: "Java\n450",
        exampleOutput: "Книга: Java, страниц: 450",
        sampleInput: "Java\n450",
        starterCode: `import java.util.Scanner;

class Book {
    // TODO: поля title и pages
    // TODO: метод printInfo()
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String title = scanner.nextLine();
        int pages = scanner.nextInt();

        // TODO: создай Book, заполни поля и вызови printInfo()
    }
}
`,
        tests: [
          { label: "Java, 450", stdin: "Java\n450\n", expected: ["Книга: Java, страниц: 450"] },
          { label: "Clean Code, 300", stdin: "Clean Code\n300\n", expected: ["Книга: Clean Code, страниц: 300"] },
        ],
        requiredCode: [
          { pattern: "class\\s+Book", message: "Создай класс Book" },
          { pattern: "void\\s+printInfo", message: "Создай метод void printInfo()" },
          { pattern: "new\\s+Book\\s*\\(", message: "Создай объект через new Book()" },
        ],
        hints: ["`void printInfo() { System.out.println(\"Книга: \" + title + \", страниц: \" + pages); }`"],
        solution: `import java.util.Scanner;

class Book {
    String title;
    int pages;

    void printInfo() {
        System.out.println("Книга: " + title + ", страниц: " + pages);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String title = scanner.nextLine();
        int pages = scanner.nextInt();

        Book book = new Book();
        book.title = title;
        book.pages = pages;
        book.printInfo();
    }
}
`,
      },
      {
        id: "d8_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Класс Студент)",
        shortDesc: "Метод с логикой проверки успеваемости",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай класс `Student` с полями `String name` и `double gpa`. Добавь метод `boolean isHonor()`, возвращающий `true`, если `gpa >= 4.5`. В `main` прочитай данные, создай студента и выведи `Студент: <name>` и `Отличник: <да|нет>`.",
        requirements: ["Класс `Student` с методом `isHonor()`", "Вывод статуса отличника"],
        exampleInput: "Амир\n4.8",
        exampleOutput: "Студент: Амир\nОтличник: да",
        sampleInput: "Амир\n4.8",
        starterCode: `import java.util.Scanner;

class Student {
    // TODO: поля name и gpa
    // TODO: метод isHonor()
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        double gpa = scanner.nextDouble();

        // TODO
    }
}
`,
        tests: [
          { label: "Амир, 4.8", stdin: "Амир\n4.8\n", expected: ["Студент: Амир", "Отличник: да"] },
          { label: "Олег, 3.9", stdin: "Олег\n3.9\n", expected: ["Студент: Олег", "Отличник: нет"] },
        ],
        requiredCode: [{ pattern: "class\\s+Student", message: "Создай класс Student" }],
        hints: ["`boolean isHonor() { return gpa >= 4.5; }`"],
        solution: `import java.util.Scanner;

class Student {
    String name;
    double gpa;

    boolean isHonor() {
        return gpa >= 4.5;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        double gpa = scanner.nextDouble();

        Student student = new Student();
        student.name = name;
        student.gpa = gpa;

        System.out.println("Студент: " + student.name);
        System.out.println("Отличник: " + (student.isHonor() ? "да" : "нет"));
    }
}
`,
      },
      {
        id: "d8_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Класс Прямоугольник)",
        shortDesc: "Методы расчета площади и периметра",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай класс `Rectangle` с полями `int width` и `int height`. Реализуй методы:\n- `int area()`: вычисляет площадь (`width * height`)\n- `int perimeter()`: вычисляет периметр (`2 * (width + height)`)\n- `boolean isSquare()`: проверяет, является ли прямоугольник квадратом (`width == height`).\nВыведи площадь, периметр и статус квадрата.",
        requirements: ["Класс `Rectangle`", "Методы `area()`, `perimeter()`, `isSquare()`"],
        exampleInput: "5\n5",
        exampleOutput: "Площадь: 25\nПериметр: 20\nКвадрат: да",
        sampleInput: "5\n5",
        starterCode: `import java.util.Scanner;

class Rectangle {
    // TODO: поля width, height и методы
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int w = scanner.nextInt();
        int h = scanner.nextInt();
        // TODO
    }
}
`,
        tests: [
          { label: "5 x 5 (квадрат)", stdin: "5\n5\n", expected: ["Площадь: 25", "Периметр: 20", "Квадрат: да"] },
          { label: "4 x 6", stdin: "4\n6\n", expected: ["Площадь: 24", "Периметр: 20", "Квадрат: нет"] },
        ],
        requiredCode: [{ pattern: "class\\s+Rectangle", message: "Создай класс Rectangle" }],
        hints: ["`int area() { return width * height; }`", "`boolean isSquare() { return width == height; }`"],
        solution: `import java.util.Scanner;

class Rectangle {
    int width;
    int height;

    int area() {
        return width * height;
    }

    int perimeter() {
        return 2 * (width + height);
    }

    boolean isSquare() {
        return width == height;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int w = scanner.nextInt();
        int h = scanner.nextInt();

        Rectangle rect = new Rectangle();
        rect.width = w;
        rect.height = h;

        System.out.println("Площадь: " + rect.area());
        System.out.println("Периметр: " + rect.perimeter());
        System.out.println("Квадрат: " + (rect.isSquare() ? "да" : "нет"));
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 9: Конструкторы и this                                        */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 9,
    moduleId: 2,
    title: "Конструкторы и ключевое слово this",
    short: "Инициализация объектов, перегрузка конструкторов",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["Конструктор по умолчанию", "Параметризованный конструктор", "this для полей", "Перегрузка конструкторов"],
    videos: [
      { author: "Алишев", query: "Алишев Java конструкторы", note: "Конструкторы в Java" },
      { author: "Заур Трегулов", query: "Заур Трегулов конструктор this Java", note: "this и конструкторы" },
    ],
    theory: [
      { type: "h", text: "Зачем нужны конструкторы?" },
      {
        type: "p",
        text: "Конструктор вызывается в момент создания объекта оператором `new`. Он гарантирует, что объект не останется в «полусобранном» состоянии со значениями по умолчанию `null` или `0`.",
      },
      {
        type: "code",
        code: `class User {
    String username;
    int age;

    // Конструктор: имя совпадает с именем класса, типа возврата НЕТ
    public User(String username, int age) {
        this.username = username; // this указывает на текущий объект
        this.age = age;
    }
}`,
      },
    ],
    tasks: [
      {
        id: "d9_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Конструктор Person)",
        shortDesc: "Инициализация полей в конструкторе",
        difficulty: "Лёгкий",
        xp: 25,
        description: "Создай класс `Person` с полями `name` и `age` и конструктором `public Person(String name, int age)`. Метод `void greet()` выводит `Привет, меня зовут <name>, мне <age> лет.`",
        requirements: ["Конструктор `Person(String name, int age)`", "Использование `this.name = name`"],
        exampleInput: "Дамир\n22",
        exampleOutput: "Привет, меня зовут Дамир, мне 22 лет.",
        sampleInput: "Дамир\n22",
        starterCode: `import java.util.Scanner;

class Person {
    String name;
    int age;

    // TODO: конструктор Person(String name, int age)
    // TODO: метод greet()
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String n = scanner.nextLine();
        int a = scanner.nextInt();
        // TODO: создай Person через конструктор с параметрами
    }
}
`,
        tests: [{ label: "Дамир 22", stdin: "Дамир\n22\n", expected: ["Привет, меня зовут Дамир, мне 22 лет."] }],
        requiredCode: [{ pattern: "this\\.name\\s*=", message: "Используй this.name = name" }],
        hints: ["`public Person(String name, int age) { this.name = name; this.age = age; }`"],
        solution: `import java.util.Scanner;

class Person {
    String name;
    int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    void greet() {
        System.out.println("Привет, меня зовут " + name + ", мне " + age + " лет.");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String n = scanner.nextLine();
        int a = scanner.nextInt();
        Person p = new Person(n, a);
        p.greet();
    }
}
`,
      },
      {
        id: "d9_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Перегрузка конструкторов)",
        shortDesc: "Несколько конструкторов и вызов this()",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай класс `BankAccount` с полями `String owner` и `double balance`. Реализуй два конструктора:\n1) `BankAccount(String owner, double balance)`\n2) `BankAccount(String owner)` — вызывает первый конструктор со стартовым балансом 0.0 через `this(owner, 0.0)`. Добавь метод `void printStatement()`: `Владелец: <owner>, баланс: <balance>`.",
        requirements: ["Перегрузка конструкторов с вызовом `this(...)`"],
        exampleInput: "Алиса",
        exampleOutput: "Владелец: Алиса, баланс: 0.0",
        sampleInput: "Алиса",
        starterCode: `import java.util.Scanner;

class BankAccount {
    String owner;
    double balance;

    // TODO: два конструктора
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        // TODO
    }
}
`,
        tests: [{ label: "Алиса", stdin: "Алиса\n", expected: ["Владелец: Алиса, баланс: 0.0"] }],
        requiredCode: [{ pattern: "this\\s*\\(\\s*owner\\s*,", message: "Используй вызов this(owner, 0.0)" }],
        hints: ["`public BankAccount(String owner) { this(owner, 0.0); }`"],
        solution: `import java.util.Scanner;

class BankAccount {
    String owner;
    double balance;

    public BankAccount(String owner, double balance) {
        this.owner = owner;
        this.balance = balance;
    }

    public BankAccount(String owner) {
        this(owner, 0.0);
    }

    void printStatement() {
        System.out.println("Владелец: " + owner + ", баланс: " + balance);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        BankAccount acc = new BankAccount(name);
        acc.printStatement();
    }
}
`,
      },
      {
        id: "d9_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Класс Товар со скидкой)",
        shortDesc: "Конструктор и метод применения скидки",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай класс `Product` с конструктором `Product(String name, double price, int quantity)`. Реализуй методы:\n- `double getTotalCost()`: возвращает `price * quantity`\n- `void applyDiscount(double percent)`: уменьшает `price` на указанный процент.\nСчитай данные, создай товар, примени скидку и выведи `Итоговая стоимость: <сумма>`.",
        requirements: ["Конструктор с 3 параметрами", "Методы `applyDiscount` и `getTotalCost`"],
        exampleInput: "Ноутбук\n1000\n2\n10",
        exampleOutput: "Итоговая стоимость: 1800.0",
        sampleInput: "Ноутбук\n1000\n2\n10",
        starterCode: `import java.util.Scanner;

class Product {
    // TODO
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        double price = scanner.nextDouble();
        int qty = scanner.nextInt();
        double discount = scanner.nextDouble();

        // TODO
    }
}
`,
        tests: [
          { label: "1000 x 2, скидка 10%", stdin: "Ноутбук\n1000\n2\n10\n", expected: ["Итоговая стоимость: 1800.0"] },
          { label: "500 x 3, скидка 20%", stdin: "Мышь\n500\n3\n20\n", expected: ["Итоговая стоимость: 1200.0"] },
        ],
        requiredCode: [{ pattern: "class\\s+Product", message: "Создай класс Product" }],
        hints: ["`price -= price * (percent / 100.0);`"],
        solution: `import java.util.Scanner;

class Product {
    String name;
    double price;
    int quantity;

    public Product(String name, double price, int quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    void applyDiscount(double percent) {
        this.price -= this.price * (percent / 100.0);
    }

    double getTotalCost() {
        return price * quantity;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        double price = scanner.nextDouble();
        int qty = scanner.nextInt();
        double discount = scanner.nextDouble();

        Product prod = new Product(name, price, qty);
        prod.applyDiscount(discount);
        System.out.println("Итоговая стоимость: " + prod.getTotalCost());
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 10: Инкапсуляция, геттеры и сеттеры                          */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 10,
    moduleId: 2,
    title: "Инкапсуляция: сокрытие данных и валидация",
    short: "private поля, public геттеры и сеттеры, защита от некорректных данных",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["private и public", "getters и setters", "Валидация состояния", "Защита целостности"],
    videos: [
      { author: "Алишев", query: "Алишев Java инкапсуляция геттеры сеттеры", note: "Инкапсуляция в деталях" },
      { author: "Заур Трегулов", query: "Заур Трегулов access modifiers инкапсуляция", note: "Модификаторы доступа" },
    ],
    theory: [
      { type: "h", text: "Что такое инкапсуляция?" },
      {
        type: "p",
        text: "Инкапсуляция — это защита внутренних данных объекта от прямого неконтролируемого вмешательства извне. Поля объявляются `private`, а доступ к ним предоставляется через методы: **геттеры** (читать) и **сеттеры** (изменять с валидацией).",
      },
      {
        type: "code",
        code: `class User {
    private int age; // скрыто!

    public void setAge(int age) {
        if (age < 0 || age > 120) {
            System.out.println("Ошибка: некорректный возраст");
            return;
        }
        this.age = age;
    }

    public int getAge() {
        return this.age;
    }
}`,
      },
    ],
    tasks: [
      {
        id: "d10_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Геттер и Сеттер)",
        shortDesc: "Объявление private полей и методов доступа",
        difficulty: "Лёгкий",
        xp: 25,
        description: "Создай класс `Account` с закрытым полем `private double balance`. Добавь геттер `getBalance()` и сеттер `setBalance(double balance)`. Сеттер должен принимать только неотрицательный баланс (`balance >= 0`), иначе игнорировать.",
        requirements: ["Поле `private double balance`", "`getBalance()` и `setBalance(...)`"],
        exampleInput: "1500.5",
        exampleOutput: "Баланс: 1500.5",
        sampleInput: "1500.5",
        starterCode: `import java.util.Scanner;

class Account {
    // TODO: private double balance
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double b = scanner.nextDouble();
        Account acc = new Account();
        acc.setBalance(b);
        System.out.println("Баланс: " + acc.getBalance());
    }
}
`,
        tests: [{ label: "1500.5", stdin: "1500.5\n", expected: ["Баланс: 1500.5"] }],
        requiredCode: [{ pattern: "private\\s+double\\s+balance", message: "Сделай balance закрытым: private double balance" }],
        hints: ["`public void setBalance(double balance) { if (balance >= 0) this.balance = balance; }`"],
        solution: `import java.util.Scanner;

class Account {
    private double balance;

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        if (balance >= 0) {
            this.balance = balance;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double b = scanner.nextDouble();
        Account acc = new Account();
        acc.setBalance(b);
        System.out.println("Баланс: " + acc.getBalance());
    }
}
`,
      },
      {
        id: "d10_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Сейф с паролем)",
        shortDesc: "Валидация пароля при доступе к секрету",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай класс `Safe` с закрытыми полями `private String secret` и `private int pinCode`. Конструктор принимает секрет и пин-код: `Safe(String secret, int pinCode)`. Реализуй метод `String getSecret(int enteredPin)`: если пин-код совпадает — возвращает секрет, иначе возвращает строку `Доступ запрещён`.",
        requirements: ["Закрытые поля `private`", "Проверка пин-кода в геттере"],
        exampleInput: "TopSecret\n1234\n1234",
        exampleOutput: "Секрет: TopSecret",
        sampleInput: "TopSecret\n1234\n1234",
        starterCode: `import java.util.Scanner;

class Safe {
    // TODO: private поля и конструктор
    // TODO: getSecret(int enteredPin)
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String secret = scanner.nextLine();
        int pin = scanner.nextInt();
        int attempt = scanner.nextInt();

        Safe safe = new Safe(secret, pin);
        System.out.println("Секрет: " + safe.getSecret(attempt));
    }
}
`,
        tests: [
          { label: "Верный пин 1234", stdin: "TopSecret\n1234\n1234\n", expected: ["Секрет: TopSecret"] },
          { label: "Неверный пин 9999", stdin: "TopSecret\n1234\n9999\n", expected: ["Секрет: Доступ запрещен"] },
        ],
        requiredCode: [{ pattern: "private\\s+int\\s+pinCode", message: "Поле pinCode должно быть private" }],
        hints: ["`public String getSecret(int enteredPin) { return enteredPin == pinCode ? secret : \"Доступ запрещён\"; }`"],
        solution: `import java.util.Scanner;

class Safe {
    private String secret;
    private int pinCode;

    public Safe(String secret, int pinCode) {
        this.secret = secret;
        this.pinCode = pinCode;
    }

    public String getSecret(int enteredPin) {
        if (enteredPin == pinCode) {
            return secret;
        }
        return "Доступ запрещён";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String secret = scanner.nextLine();
        int pin = scanner.nextInt();
        int attempt = scanner.nextInt();

        Safe safe = new Safe(secret, pin);
        System.out.println("Секрет: " + safe.getSecret(attempt));
    }
}
`,
      },
      {
        id: "d10_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Банковский аккаунт с лимитом)",
        shortDesc: "Методы deposit и withdraw с проверками",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Создай класс `BankAccount` с приватным балансом `private double balance` (начальный баланс 0.0). Реализуй методы:\n- `void deposit(double amount)`: пополняет баланс, если `amount > 0`\n- `boolean withdraw(double amount)`: снимает сумму, если `amount > 0` и `balance >= amount`, возвращает `true`. Иначе возвращает `false`.\n- `double getBalance()`: возвращает текущий баланс.\nПрограмма выполняет пополнение и попытку снятия, выводя результат.",
        requirements: ["`deposit`, `withdraw`, `getBalance`", "Защита от отрицательного баланса"],
        exampleInput: "1000\n400",
        exampleOutput: "Снятие успешно: true\nОстаток: 600.0",
        sampleInput: "1000\n400",
        starterCode: `import java.util.Scanner;

class BankAccount {
    // TODO
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double dep = scanner.nextDouble();
        double wth = scanner.nextDouble();

        // TODO
    }
}
`,
        tests: [
          { label: "Пополнение 1000, снятие 400", stdin: "1000\n400\n", expected: ["Снятие успешно: true", "Остаток: 600.0"] },
          { label: "Пополнение 500, снятие 900", stdin: "500\n900\n", expected: ["Снятие успешно: false", "Остаток: 500.0"] },
        ],
        requiredCode: [{ pattern: "private\\s+double\\s+balance", message: "Используй private double balance" }],
        hints: ["`if (amount > 0 && balance >= amount) { balance -= amount; return true; } return false;`"],
        solution: `import java.util.Scanner;

class BankAccount {
    private double balance;

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public boolean withdraw(double amount) {
        if (amount > 0 && balance >= amount) {
            balance -= amount;
            return true;
        }
        return false;
    }

    public double getBalance() {
        return balance;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double dep = scanner.nextDouble();
        double wth = scanner.nextDouble();

        BankAccount acc = new BankAccount();
        acc.deposit(dep);
        boolean ok = acc.withdraw(wth);

        System.out.println("Снятие успешно: " + ok);
        System.out.println("Остаток: " + acc.getBalance());
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 11: static, final и пакеты                                    */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 11,
    moduleId: 2,
    title: "static, final и константы: общее состояние и неизменяемость",
    short: "Статические поля и методы, константы, ключевое слово final",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["static поля (Metaspace)", "static методы", "final переменные", "Константы и соглашения"],
    videos: [
      { author: "Алишев", query: "Алишев Java ключевое слово static", note: "static поля и методы" },
      { author: "Заур Трегулов", query: "Заур Трегулов static final Java", note: "final и константы" },
    ],
    theory: [
      { type: "h", text: "Что означает static?" },
      {
        type: "p",
        text: "Обычные поля принадлежат **конкретному объекту** и хранятся в Heap для каждого экземпляра. Поле со спецификатором `static` принадлежит **самому классу** и существует в единственном экземпляре для всех объектов в памяти Metaspace.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Личный паспорт vs Государственный закон",
        text: "Имя и возраст гражданина — это нестатические поля (`name`, `age`), у каждого свои. Но закон страны или ставка налога НДС — это `static`: они едины для всех граждан и не дублируются в паспорте каждого человека.",
      },
      {
        type: "h",
        text: "Ключевое слово final",
      },
      {
        type: "p",
        text: "- **Для переменной**: значение можно присвоить только один раз (константа).\n- **Для метода**: метод нельзя переопределить в дочернем классе.\n- **Для класса**: от этого класса запрещено наследоваться (например, класс `String` является `final`).",
      },
      {
        type: "code",
        caption: "Объявление констант и статических методов",
        code: `class MathConstants {
    // Общепринятый формат именования констант: UPPER_SNAKE_CASE
    public static final double PI = 3.1415926535;

    public static double circleArea(double r) {
        return PI * r * r;
    }
}

// Вызов БЕЗ создания new:
double area = MathConstants.circleArea(10.0);`,
      },
    ],
    tasks: [
      {
        id: "d11_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Глобальный счетчик Counter)",
        shortDesc: "Статическое поле для подсчета созданных объектов",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай класс `Counter` со статическим приватным полем `private static int count = 0;`.\nВ конструкторе `Counter()` увеличивай `count++`.\nДобавь статический метод `public static int getCount()`, возвращающий текущее количество.\nВ `main` прочитай число $N$, создай в цикле $N$ объектов `new Counter()` и напечатай `Всего создано: <count>`.",
        requirements: ["Статическое поле `static int count`", "Статический геттер `getCount()`", "Создание N объектов"],
        exampleInput: "3",
        exampleOutput: "Всего создано: 3",
        sampleInput: "3",
        starterCode: `import java.util.Scanner;

class Counter {
    // TODO: private static int count = 0;
    // TODO: конструктор
    // TODO: static int getCount()
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: создай n объектов Counter и выведи результат
    }
}
`,
        tests: [
          { label: "3 объекта", stdin: "3\n", expected: ["Всего создано: 3"] },
          { label: "5 объектов", stdin: "5\n", expected: ["Всего создано: 5"] },
        ],
        requiredCode: [
          { pattern: "static\\s+int\\s+count", message: "Используй static int count" },
          { pattern: "static\\s+int\\s+getCount", message: "Создай static int getCount()" },
        ],
        hints: ["`for (int i = 0; i < n; i++) new Counter();` затем `Counter.getCount()`"],
        solution: `import java.util.Scanner;

class Counter {
    private static int count = 0;

    public Counter() {
        count++;
    }

    public static int getCount() {
        return count;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        for (int i = 0; i < n; i++) {
            new Counter();
        }

        System.out.println("Всего создано: " + Counter.getCount());
    }
}
`,
      },
      {
        id: "d11_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Утилита геометрии)",
        shortDesc: "Статические методы и константа PI",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай класс `GeometryHelper` со статической константой `public static final double PI = 3.14159;` и двумя статическими методами:\n- `static double circleArea(double r)`: площадь круга `PI * r * r`\n- `static double circlePerimeter(double r)`: длина окружности `2 * PI * r`\nВ `main` прочитай радиус $R$, вычисли значения и выведи их с точностью до 2 знаков после запятой (используй `String.format(\"%.2f\", ...)`).",
        requirements: ["Константа `public static final double PI`", "Методы `circleArea` и `circlePerimeter`", "Вывод с 2 знаками после запятой"],
        exampleInput: "5.0",
        exampleOutput: "Площадь: 78.54\nПериметр: 31.42",
        sampleInput: "5.0",
        starterCode: `import java.util.Scanner;

class GeometryHelper {
    // TODO: public static final double PI = 3.14159;
    // TODO: circleArea(double r)
    // TODO: circlePerimeter(double r)
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double r = scanner.nextDouble();

        // TODO
    }
}
`,
        tests: [
          { label: "Радиус 5.0", stdin: "5.0\n", expected: ["Площадь: 78.54", "Периметр: 31.42"] },
          { label: "Радиус 10.0", stdin: "10.0\n", expected: ["Площадь: 314.16", "Периметр: 62.83"] },
        ],
        requiredCode: [
          { pattern: "static\\s+final\\s+double\\s+PI", message: "Объяви static final double PI" },
          { pattern: "static\\s+double\\s+circleArea", message: "Создай static double circleArea" },
        ],
        hints: ["`System.out.println(\"Площадь: \" + String.format(java.util.Locale.US, \"%.2f\", GeometryHelper.circleArea(r)));`"],
        solution: `import java.util.Locale;
import java.util.Scanner;

class GeometryHelper {
    public static final double PI = 3.14159;

    public static double circleArea(double r) {
        return PI * r * r;
    }

    public static double circlePerimeter(double r) {
        return 2 * PI * r;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double r = scanner.nextDouble();

        System.out.println("Площадь: " + String.format(Locale.US, "%.2f", GeometryHelper.circleArea(r)));
        System.out.println("Периметр: " + String.format(Locale.US, "%.2f", GeometryHelper.circlePerimeter(r)));
    }
}
`,
      },
      {
        id: "d11_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Генератор уникальных ID)",
        shortDesc: "Автоинкремент ID с помощью static и final полей",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай класс `User`:\n- Приватное статическое поле `private static int nextId = 1001;`\n- Приватное неизменяемое поле `private final int id;`\n- Поле `private String name;`\nВ конструкторе `User(String name)` присвой `this.id = nextId++;` и `this.name = name;`.\nДобавь метод `void printInfo()`, печатающий `User[id=<id>, name=<name>]`.\nВ `main` прочитай 3 имени пользователей, создай их и вызови `printInfo()`.",
        requirements: ["Автогенерация id через `static nextId`", "Поле `final int id`", "Уникальные ID для каждого нового объекта"],
        exampleInput: "Алексей\nЕлена\nСергей",
        exampleOutput: "User[id=1001, name=Алексей]\nUser[id=1002, name=Елена]\nUser[id=1003, name=Сергей]",
        sampleInput: "Алексей\nЕлена\nСергей",
        starterCode: `import java.util.Scanner;

class User {
    // TODO: private static int nextId = 1001;
    // TODO: private final int id;
    // TODO: private String name;
    // TODO: конструктор и printInfo()
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name1 = scanner.nextLine();
        String name2 = scanner.nextLine();
        String name3 = scanner.nextLine();

        // TODO
    }
}
`,
        tests: [
          { label: "3 пользователя", stdin: "Алексей\nЕлена\nСергей\n", expected: ["User[id=1001, name=Алексей]", "User[id=1002, name=Елена]", "User[id=1003, name=Сергей]"] },
          { label: "Другие имена", stdin: "Иван\nОльга\nПетр\n", expected: ["User[id=1001, name=Иван]", "User[id=1002, name=Ольга]", "User[id=1003, name=Петр]"] },
        ],
        requiredCode: [
          { pattern: "static\\s+int\\s+nextId", message: "Используй static int nextId" },
          { pattern: "final\\s+int\\s+id", message: "Поле id должно быть final" },
        ],
        hints: ["`this.id = nextId++;` внутри конструктора"],
        solution: `import java.util.Scanner;

class User {
    private static int nextId = 1001;
    private final int id;
    private String name;

    public User(String name) {
        this.id = nextId++;
        this.name = name;
    }

    public void printInfo() {
        System.out.println("User[id=" + id + ", name=" + name + "]");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name1 = scanner.nextLine();
        String name2 = scanner.nextLine();
        String name3 = scanner.nextLine();

        User u1 = new User(name1);
        User u2 = new User(name2);
        User u3 = new User(name3);

        u1.printInfo();
        u2.printInfo();
        u3.printInfo();
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 12: Наследование и super                                      */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 12,
    moduleId: 2,
    title: "Наследование и super: переиспользование кода и иерархии",
    short: "extends, конструктор super(), расширение полей и методов",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["extends", "Конструкторы и super()", "Доступ к методам super", "Одиночное наследование"],
    videos: [
      { author: "Алишев", query: "Алишев Java наследование", note: "Наследование с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов наследование super Java", note: "super и конструкторы" },
    ],
    theory: [
      { type: "h", text: "Что такое наследование?" },
      {
        type: "p",
        text: "Наследование позволяет создать новый класс на основе уже существующего, переняв его поля и методы. Это реализует фундаментальный принцип программирования **DRY** (Don't Repeat Yourself).",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Эволюция и ДНК",
        text: "Все млекопитающие дышат кислородом и имеют температуру тела (базовый класс `Mammal`). Человек и Дельфин наследуют эти свойства, но добавляют свои уникальные способности: человек пишет код на Java, а дельфин эхолоцирует.",
      },
      {
        type: "h",
        text: "Ключевое слово super",
      },
      {
        type: "p",
        text: "- `super(...)`: вызов конструктора родительского класса. **ОБЯЗАН** быть самой первой инструкцией в конструкторе дочернего класса!\n- `super.method()`: вызов метода родительского класса, если в дочернем он был переопределен.",
      },
      {
        type: "code",
        caption: "Пример наследования и super",
        code: `class Animal {
    String name;

    Animal(String name) {
        this.name = name;
    }

    void eat() {
        System.out.println(name + " кушает");
    }
}

class Dog extends Animal {
    String breed;

    Dog(String name, String breed) {
        super(name); // Вызов конструктора Animal
        this.breed = breed;
    }

    void bark() {
        System.out.println(name + " лает: Гав-гав!");
    }
}`,
      },
    ],
    tasks: [
      {
        id: "d12_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Животное и Собака)",
        shortDesc: "Базовый класс Animal и наследник Dog с вызовом super",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай базовый класс `Animal` с полем `String name`, конструктором `Animal(String name)` и методом `void sound()`, выводящим `<name> издает звук`.\nСоздай класс `Dog extends Animal`, который в конструкторе вызывает `super(name)` и переопределяет метод `sound()`, выводя `<name> лает: Гав!`.\nВ `main` создай `Dog` и вызови `sound()`.",
        requirements: ["Класс `Animal`", "Класс `Dog extends Animal`", "Вызов `super(name)`"],
        exampleInput: "Шарик",
        exampleOutput: "Шарик лает: Гав!",
        sampleInput: "Шарик",
        starterCode: `import java.util.Scanner;

class Animal {
    // TODO: name, конструктор, sound()
}

// TODO: Dog extends Animal

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();

        // TODO
    }
}
`,
        tests: [
          { label: "Шарик", stdin: "Шарик\n", expected: ["Шарик лает: Гав!"] },
          { label: "Бобик", stdin: "Бобик\n", expected: ["Бобик лает: Гав!"] },
        ],
        requiredCode: [
          { pattern: "extends\\s+Animal", message: "Dog должен наследовать Animal (extends Animal)" },
          { pattern: "super\\s*\\(\\s*name\\s*\\)", message: "Вызови super(name) в конструкторе Dog" },
        ],
        hints: ["`Dog(String name) { super(name); }`"],
        solution: `import java.util.Scanner;

class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    public void sound() {
        System.out.println(name + " издает звук");
    }
}

class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }

    @Override
    public void sound() {
        System.out.println(name + " лает: Гав!");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();

        Dog dog = new Dog(name);
        dog.sound();
    }
}
`,
      },
      {
        id: "d12_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Сотрудник и Менеджер)",
        shortDesc: "Расчет дохода с использованием super.getSalary()",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай класс `Employee` с полями `String name`, `double baseSalary`. Метод `double getSalary()` возвращает `baseSalary`.\nСоздай класс `Manager extends Employee` с дополнительным полем `double bonus`. Метод `getSalary()` переопределен и возвращает `super.getSalary() + bonus`.\nВ `main` прочитай имя, базовую зарплату и бонус. Выведи `Менеджер: <name>, Доход: <сумма>`.",
        requirements: ["Класс `Employee`", "Класс `Manager extends Employee`", "Вызов `super.getSalary()`"],
        exampleInput: "Амир\n50000\n15000",
        exampleOutput: "Менеджер: Амир, Доход: 65000.0",
        sampleInput: "Амир\n50000\n15000",
        starterCode: `import java.util.Scanner;

class Employee {
    // TODO: name, baseSalary
}

// TODO: Manager extends Employee

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        double base = scanner.nextDouble();
        double bonus = scanner.nextDouble();

        // TODO
    }
}
`,
        tests: [
          { label: "Амир 50k + 15k", stdin: "Амир\n50000\n15000\n", expected: ["Менеджер: Амир, Доход: 65000.0"] },
          { label: "Диана 80k + 20k", stdin: "Диана\n80000\n20000\n", expected: ["Менеджер: Диана, Доход: 100000.0"] },
        ],
        requiredCode: [
          { pattern: "extends\\s+Employee", message: "Manager должен расширять Employee" },
          { pattern: "super\\.getSalary\\(\\)", message: "Используй super.getSalary() для расчета" },
        ],
        hints: ["`return super.getSalary() + bonus;`"],
        solution: `import java.util.Scanner;

class Employee {
    protected String name;
    protected double baseSalary;

    public Employee(String name, double baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }

    public double getSalary() {
        return baseSalary;
    }

    public String getName() {
        return name;
    }
}

class Manager extends Employee {
    private double bonus;

    public Manager(String name, double baseSalary, double bonus) {
        super(name, baseSalary);
        this.bonus = bonus;
    }

    @Override
    public double getSalary() {
        return super.getSalary() + bonus;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        double base = scanner.nextDouble();
        double bonus = scanner.nextDouble();

        Manager mgr = new Manager(name, base, bonus);
        System.out.println("Менеджер: " + mgr.getName() + ", Доход: " + mgr.getSalary());
    }
}
`,
      },
      {
        id: "d12_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Электромобиль с зарядкой)",
        shortDesc: "Переопределение displayInfo с вызовом метода предка",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай класс `Vehicle` с полями `String brand` и `int maxSpeed`. Метод `void displayInfo()` печатает `Транспорт: <brand>, Макс. скорость: <maxSpeed> км/ч`.\nСоздай класс `ElectricCar extends Vehicle` с полем `int batteryLevel` (процент заряда). Добавь метод `void charge(int percent)` (увеличивает заряд, максимум до 100).\nПереопредели метод `displayInfo()`: сначала вызови `super.displayInfo()`, а затем напечатай `Заряд батареи: <batteryLevel>%`.\nВ `main` прочитай бренд, скорость, начальный заряд и величину подзарядки.",
        requirements: ["Класс `Vehicle`", "Класс `ElectricCar extends Vehicle`", "Вызов `super.displayInfo()`"],
        exampleInput: "Tesla\n260\n40\n30",
        exampleOutput: "Транспорт: Tesla, Макс. скорость: 260 км/ч\nЗаряд батареи: 70%",
        sampleInput: "Tesla\n260\n40\n30",
        starterCode: `import java.util.Scanner;

// TODO: Vehicle
// TODO: ElectricCar extends Vehicle

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String brand = scanner.nextLine();
        int speed = scanner.nextInt();
        int battery = scanner.nextInt();
        int chargeAmount = scanner.nextInt();

        // TODO
    }
}
`,
        tests: [
          { label: "Tesla 40 + 30", stdin: "Tesla\n260\n40\n30\n", expected: ["Транспорт: Tesla, Макс. скорость: 260 км/ч", "Заряд батареи: 70%"] },
          { label: "Porsche 80 + 50 (лимит 100)", stdin: "Porsche\n300\n80\n50\n", expected: ["Транспорт: Porsche, Макс. скорость: 300 км/ч", "Заряд батареи: 100%"] },
        ],
        requiredCode: [
          { pattern: "extends\\s+Vehicle", message: "ElectricCar должен наследовать Vehicle" },
          { pattern: "super\\.displayInfo\\(\\)", message: "Вызови super.displayInfo() в переопределенном методе" },
        ],
        hints: ["`batteryLevel = Math.min(100, batteryLevel + percent);`"],
        solution: `import java.util.Scanner;

class Vehicle {
    protected String brand;
    protected int maxSpeed;

    public Vehicle(String brand, int maxSpeed) {
        this.brand = brand;
        this.maxSpeed = maxSpeed;
    }

    public void displayInfo() {
        System.out.println("Транспорт: " + brand + ", Макс. скорость: " + maxSpeed + " км/ч");
    }
}

class ElectricCar extends Vehicle {
    private int batteryLevel;

    public ElectricCar(String brand, int maxSpeed, int initialBattery) {
        super(brand, maxSpeed);
        this.batteryLevel = initialBattery;
    }

    public void charge(int percent) {
        batteryLevel = Math.min(100, batteryLevel + percent);
    }

    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Заряд батареи: " + batteryLevel + "%");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String brand = scanner.nextLine();
        int speed = scanner.nextInt();
        int battery = scanner.nextInt();
        int chargeAmount = scanner.nextInt();

        ElectricCar car = new ElectricCar(brand, speed, battery);
        car.charge(chargeAmount);
        car.displayInfo();
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 13: Полиморфизм                                               */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 13,
    moduleId: 2,
    title: "Полиморфизм: один интерфейс — множество реализаций",
    short: "@Override, динамическое связывание, полиморфные массивы и upcasting",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["Полиморфизм подтипов", "Динамическое связывание (Late Binding)", "Аннотация @Override", "Upcasting и полиморфные коллекции"],
    videos: [
      { author: "Алишев", query: "Алишев Java полиморфизм", note: "Полиморфизм простыми словами" },
      { author: "Заур Трегулов", query: "Заур Трегулов полиморфизм Java", note: "Dynamic binding и upcasting" },
    ],
    theory: [
      { type: "h", text: "Что такое полиморфизм?" },
      {
        type: "p",
        text: "Полиморфизм (от греч. «много форм») — это способность программы работать с объектами разных классов через единый интерфейс базового типа, при этом реальное поведение определяется типом конкретного объекта во время выполнения.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Кнопка воспроизведения (Play)",
        text: "Кнопка «Play» на пульте одинакова для всех устройств. Но если нажать ее на плеере — заиграет музыка, на проекторе — начнется фильм, а на игровой консоли — запустится игра. Один метод `play()` вызывает совершенно разное поведение у каждого устройства.",
      },
      {
        type: "h",
        text: "Восходящее приведение (Upcasting)",
      },
      {
        type: "p",
        text: "Мы можем положить кота, собаку и слона в один массив `Animal[]`. При вызове `animal.sound()` JVM сама найдет правильный метод именно того класса, объект которого лежит в памяти Heap!",
      },
      {
        type: "code",
        caption: "Полиморфный массив",
        code: `Animal[] zoo = new Animal[] {
    new Dog("Рекс"),
    new Cat("Мурка")
};

for (Animal a : zoo) {
    a.sound(); // вызовется Dog.sound() или Cat.sound() автоматически!
}`,
      },
    ],
    tasks: [
      {
        id: "d13_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Полиморфные геометрические фигуры)",
        shortDesc: "Сумма площадей разных фигур через базовый класс Shape",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай базовый класс `Shape` с методом `double getArea() { return 0.0; }`.\nСоздай потомков:\n- `Circle(double r)`: `getArea()` возвращает `3.14 * r * r`\n- `Rectangle(double w, double h)`: `getArea()` возвращает `w * h`.\nВ `main` прочитай радиус круга, ширину и высоту прямоугольника. Создай массив `Shape[] shapes = new Shape[]{ new Circle(r), new Rectangle(w, h) };`. В цикле посчитай общую площадь и выведи `Общая площадь: <сумма>`.",
        requirements: ["Базовый класс `Shape`", "Потомки `Circle` и `Rectangle`", "Полиморфный массив `Shape[]`"],
        exampleInput: "3.0\n4.0 5.0",
        exampleOutput: "Общая площадь: 48.26",
        sampleInput: "3.0\n4.0 5.0",
        starterCode: `import java.util.Scanner;

class Shape {
    public double getArea() { return 0.0; }
}

// TODO: Circle extends Shape
// TODO: Rectangle extends Shape

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double r = scanner.nextDouble();
        double w = scanner.nextDouble();
        double h = scanner.nextDouble();

        // TODO
    }
}
`,
        tests: [
          { label: "r=3.0, 4x5", stdin: "3.0\n4.0 5.0\n", expected: ["Общая площадь: 48.26"] },
          { label: "r=2.0, 2x3", stdin: "2.0\n2.0 3.0\n", expected: ["Общая площадь: 18.56"] },
        ],
        requiredCode: [
          { pattern: "Shape\\[\\]", message: "Используй массив Shape[]" },
          { pattern: "@Override", message: "Используй аннотацию @Override" },
        ],
        hints: ["`double total = 0; for (Shape s : shapes) total += s.getArea();`"],
        solution: `import java.util.Scanner;

class Shape {
    public double getArea() {
        return 0.0;
    }
}

class Circle extends Shape {
    private double r;

    public Circle(double r) {
        this.r = r;
    }

    @Override
    public double getArea() {
        return 3.14 * r * r;
    }
}

class Rectangle extends Shape {
    private double w, h;

    public Rectangle(double w, double h) {
        this.w = w;
        this.h = h;
    }

    @Override
    public double getArea() {
        return w * h;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double r = scanner.nextDouble();
        double w = scanner.nextDouble();
        double h = scanner.nextDouble();

        Shape[] shapes = new Shape[] {
            new Circle(r),
            new Rectangle(w, h)
        };

        double total = 0.0;
        for (Shape s : shapes) {
            total += s.getArea();
        }

        System.out.println("Общая площадь: " + total);
    }
}
`,
      },
      {
        id: "d13_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Платежные шлюзы)",
        shortDesc: "Полиморфная обработка платежей через метод executePayment",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай базовый класс `PaymentMethod` с методом `void pay(double amount)`.\nСоздай потомков:\n- `CardPayment`: печатает `Оплата картой: <amount> руб.`\n- `QrPayment`: печатает `Оплата по QR: <amount> руб.`\nСоздай статический метод `static void process(PaymentMethod method, double amount)`, который вызывает `method.pay(amount)`.\nВ `main` прочитай тип платежа (`card` или `qr`) и сумму, и проведи платеж.",
        requirements: ["Базовый класс `PaymentMethod`", "Метод принимающий полиморфную ссылку `PaymentMethod`"],
        exampleInput: "card\n1500",
        exampleOutput: "Оплата картой: 1500.0 руб.",
        sampleInput: "card\n1500",
        starterCode: `import java.util.Scanner;

class PaymentMethod {
    public void pay(double amount) {
        System.out.println("Базовый платеж");
    }
}

// TODO: CardPayment и QrPayment

public class Main {
    static void process(PaymentMethod method, double amount) {
        // TODO: вызов pay
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String type = scanner.next();
        double amount = scanner.nextDouble();

        // TODO
    }
}
`,
        tests: [
          { label: "Карта 1500", stdin: "card\n1500\n", expected: ["Оплата картой: 1500.0 руб."] },
          { label: "QR 750", stdin: "qr\n750\n", expected: ["Оплата по QR: 750.0 руб."] },
        ],
        requiredCode: [
          { pattern: "process\\s*\\(\\s*PaymentMethod", message: "Метод process должен принимать PaymentMethod" },
          { pattern: "@Override", message: "Используй @Override в дочерних классах" },
        ],
        hints: ["`PaymentMethod pm = type.equals(\"card\") ? new CardPayment() : new QrPayment();`"],
        solution: `import java.util.Scanner;

class PaymentMethod {
    public void pay(double amount) {
        System.out.println("Базовый платеж");
    }
}

class CardPayment extends PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.println("Оплата картой: " + amount + " руб.");
    }
}

class QrPayment extends PaymentMethod {
    @Override
    public void pay(double amount) {
        System.out.println("Оплата по QR: " + amount + " руб.");
    }
}

public class Main {
    static void process(PaymentMethod method, double amount) {
        method.pay(amount);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String type = scanner.next();
        double amount = scanner.nextDouble();

        PaymentMethod pm = type.equals("card") ? new CardPayment() : new QrPayment();
        process(pm, amount);
    }
}
`,
      },
      {
        id: "d13_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Мультиканальный центр уведомлений)",
        shortDesc: "Рассылка сообщений по списку полиморфных каналов",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай базовый класс `NotificationSender` с методом `void send(String message)`.\nСоздай классы:\n- `EmailSender`: печатает `[EMAIL] <message>`\n- `SmsSender`: печатает `[SMS] <message>`\n- `TelegramSender`: печатает `[TG] <message>`\nСоздай класс `NotificationService`, метод `void broadcast(NotificationSender[] senders, String message)`, который отправляет сообщение во все переданные каналы.\nВ `main` прочитай текст сообщения и отправь его сразу по всем 3 каналам.",
        requirements: ["Базовый класс `NotificationSender` и 3 потомка", "Метод `broadcast` с полиморфным массивом"],
        exampleInput: "Код подтверждения: 4892",
        exampleOutput: "[EMAIL] Код подтверждения: 4892\n[SMS] Код подтверждения: 4892\n[TG] Код подтверждения: 4892",
        sampleInput: "Код подтверждения: 4892",
        starterCode: `import java.util.Scanner;

// TODO: NotificationSender
// TODO: EmailSender, SmsSender, TelegramSender
// TODO: NotificationService

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String msg = scanner.nextLine();

        // TODO
    }
}
`,
        tests: [
          { label: "Код 4892", stdin: "Код подтверждения: 4892\n", expected: ["[EMAIL] Код подтверждения: 4892", "[SMS] Код подтверждения: 4892", "[TG] Код подтверждения: 4892"] },
          { label: "Скидка", stdin: "Скидка 20% на курсы!\n", expected: ["[EMAIL] Скидка 20% на курсы!", "[SMS] Скидка 20% на курсы!", "[TG] Скидка 20% на курсы!"] },
        ],
        requiredCode: [
          { pattern: "broadcast\\s*\\(\\s*NotificationSender\\[\\]", message: "Метод broadcast должен принимать NotificationSender[]" },
        ],
        hints: ["`for (NotificationSender s : senders) s.send(message);`"],
        solution: `import java.util.Scanner;

class NotificationSender {
    public void send(String message) {
        System.out.println("Отправка: " + message);
    }
}

class EmailSender extends NotificationSender {
    @Override
    public void send(String message) {
        System.out.println("[EMAIL] " + message);
    }
}

class SmsSender extends NotificationSender {
    @Override
    public void send(String message) {
        System.out.println("[SMS] " + message);
    }
}

class TelegramSender extends NotificationSender {
    @Override
    public void send(String message) {
        System.out.println("[TG] " + message);
    }
}

class NotificationService {
    public void broadcast(NotificationSender[] senders, String message) {
        for (NotificationSender s : senders) {
            s.send(message);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String msg = scanner.nextLine();

        NotificationSender[] senders = new NotificationSender[] {
            new EmailSender(),
            new SmsSender(),
            new TelegramSender()
        };

        NotificationService service = new NotificationService();
        service.broadcast(senders, msg);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 14: Спринт: мини-проект «Зоопарк»                            */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 14,
    moduleId: 2,
    title: "Спринт: мини-проект «Зоопарк» (практика ООП-моделирования)",
    short: "Комплексное моделирование предметной области, композиция и полиморфизм",
    difficulty: "Сложный",
    duration: "~3 часа",
    xp: 100,
    ready: true,
    topics: ["Моделирование сущностей", "Композиция ('has-a')", "Полиморфное кормление", "Расчет ресурсов"],
    videos: [
      { author: "Алишев", query: "Алишев Java ООП практика", note: "Практика ООП проектирования" },
      { author: "Заур Трегулов", query: "Заур Трегулов ООП задачи Java", note: "Комплексные задачи ООП" },
    ],
    theory: [
      { type: "h", text: "Спринт ООП: проектирование системы «Зоопарк»" },
      {
        type: "p",
        text: "В этом спринте ты объединишь все изученные концепции: классы, конструкторы, инкапсуляцию, наследование и полиморфизм. Мы спроектируем систему управления городским зоопарком.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Архитектура зоопарка",
        text: "- `Animal` — базовый класс любого обитателя (имя, дневной рацион еды в кг).\n- `Lion` и `Panda` — конкретные виды с уникальным поведением.\n- `Zoo` — класс зоопарка, хранящий список всех животных (композиция) и умеющий централизованно накормить всех и посчитать общий расход корма.",
      },
      {
        type: "code",
        caption: "Связи между классами",
        code: `// Наследование:
class Lion extends Animal { ... }
class Panda extends Animal { ... }

// Композиция ("Зоопарк содержит животных"):
class Zoo {
    private List<Animal> animals = new ArrayList<>();
    public void addAnimal(Animal a) { animals.add(a); }
    public void feedAll() { ... }
}`,
      },
    ],
    tasks: [
      {
        id: "d14_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Обитатели зоопарка)",
        shortDesc: "Классы Lion и Panda с уникальным звуком и рационом",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай базовый класс `Animal` с полями `String name`, `int dailyFoodKg` и методом `void eat()`, выводящим `<name> кушает <dailyFoodKg> кг еды`.\nСоздай потомков:\n- `Lion`: в методе `eat()` дополнительно печатает `Лев <name> довольно рычит: Р-р-р!`\n- `Panda`: в методе `eat()` дополнительно печатает `Панда <name> хрустит бамбуком`.\nВ `main` создай льва с рационом 15 кг и панду с рационом 10 кг, вызови `eat()` для обоих.",
        requirements: ["Базовый класс `Animal`", "Потомки `Lion` и `Panda`", "Переопределение метода `eat()`"],
        exampleInput: "Симба\nПо",
        exampleOutput: "Симба кушает 15 кг еды\nЛев Симба довольно рычит: Р-р-р!\nПо кушает 10 кг еды\nПанда По хрустит бамбуком",
        sampleInput: "Симба\nПо",
        starterCode: `import java.util.Scanner;

// TODO: Animal, Lion, Panda

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String lionName = scanner.nextLine();
        String pandaName = scanner.nextLine();

        // TODO
    }
}
`,
        tests: [
          { label: "Симба и По", stdin: "Симба\nПо\n", expected: ["Симба кушает 15 кг еды", "Лев Симба довольно рычит: Р-р-р!", "По кушает 10 кг еды", "Панда По хрустит бамбуком"] },
          { label: "Алекс и Мэй", stdin: "Алекс\nМэй\n", expected: ["Алекс кушает 15 кг еды", "Лев Алекс довольно рычит: Р-р-р!", "Мэй кушает 10 кг еды", "Панда Мэй хрустит бамбуком"] },
        ],
        requiredCode: [
          { pattern: "class\\s+Lion\\s+extends\\s+Animal", message: "Lion должен наследовать Animal" },
          { pattern: "class\\s+Panda\\s+extends\\s+Animal", message: "Panda должен наследовать Animal" },
        ],
        hints: ["`super.eat(); System.out.println(...);`"],
        solution: `import java.util.Scanner;

class Animal {
    protected String name;
    protected int dailyFoodKg;

    public Animal(String name, int dailyFoodKg) {
        this.name = name;
        this.dailyFoodKg = dailyFoodKg;
    }

    public void eat() {
        System.out.println(name + " кушает " + dailyFoodKg + " кг еды");
    }
}

class Lion extends Animal {
    public Lion(String name, int dailyFoodKg) {
        super(name, dailyFoodKg);
    }

    @Override
    public void eat() {
        super.eat();
        System.out.println("Лев " + name + " довольно рычит: Р-р-р!");
    }
}

class Panda extends Animal {
    public Panda(String name, int dailyFoodKg) {
        super(name, dailyFoodKg);
    }

    @Override
    public void eat() {
        super.eat();
        System.out.println("Панда " + name + " хрустит бамбуком");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String lionName = scanner.nextLine();
        String pandaName = scanner.nextLine();

        Lion lion = new Lion(lionName, 15);
        Panda panda = new Panda(pandaName, 10);

        lion.eat();
        panda.eat();
    }
}
`,
      },
      {
        id: "d14_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Вольер с лимитом вместимости)",
        shortDesc: "Контроль вместимости вольера и добавление животных",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай класс `Enclosure` (вольер) с параметром максимальной вместимости `int capacity`.\n- Метод `boolean addAnimal(String animalName)`: если в вольере еще есть место, добавляет животное и возвращает `true`.\n- Если вольер полон, возвращает `false`.\n- Метод `int getAnimalCount()`: возвращает текущее число обитателей.\nВ `main` создай вольер вместимостью 2. Прочитай 3 имени и попытайся добавить всех троих. Если метод вернул `false`, выведи `Вольер переполнен! Не удалось добавить: <имя>`.",
        requirements: ["Класс `Enclosure`", "Проверка переполнения вместимости", "Корректный возврат true/false"],
        exampleInput: "Обезьяна\nПопугай\nЖираф",
        exampleOutput: "Добавлен: Обезьяна\nДобавлен: Попугай\nВольер переполнен! Не удалось добавить: Жираф",
        sampleInput: "Обезьяна\nПопугай\nЖираф",
        starterCode: `import java.util.Scanner;

class Enclosure {
    // TODO: capacity, count, addAnimal()
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String a1 = scanner.nextLine();
        String a2 = scanner.nextLine();
        String a3 = scanner.nextLine();

        // TODO
    }
}
`,
        tests: [
          { label: "3 животных при лимите 2", stdin: "Обезьяна\nПопугай\nЖираф\n", expected: ["Добавлен: Обезьяна", "Добавлен: Попугай", "Вольер переполнен! Не удалось добавить: Жираф"] },
          { label: "Другие звери", stdin: "Тигр\nСлон\nЗебра\n", expected: ["Добавлен: Тигр", "Добавлен: Слон", "Вольер переполнен! Не удалось добавить: Зебра"] },
        ],
        requiredCode: [
          { pattern: "class\\s+Enclosure", message: "Создай класс Enclosure" },
          { pattern: "boolean\\s+addAnimal", message: "Создай метод boolean addAnimal" },
        ],
        hints: ["`if (count < capacity) { count++; return true; } return false;`"],
        solution: `import java.util.Scanner;

class Enclosure {
    private int capacity;
    private int count;

    public Enclosure(int capacity) {
        this.capacity = capacity;
        this.count = 0;
    }

    public boolean addAnimal(String animalName) {
        if (count < capacity) {
            count++;
            return true;
        }
        return false;
    }

    public int getAnimalCount() {
        return count;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] animals = new String[] {
            scanner.nextLine(),
            scanner.nextLine(),
            scanner.nextLine()
        };

        Enclosure enc = new Enclosure(2);
        for (String a : animals) {
            if (enc.addAnimal(a)) {
                System.out.println("Добавлен: " + a);
            } else {
                System.out.println("Вольер переполнен! Не удалось добавить: " + a);
            }
        }
    }
}
`,
      },
      {
        id: "d14_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Симулятор зоопарка: подсчет рациона)",
        shortDesc: "Полиморфный расчет общего расхода корма по всем животным",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Создай класс `Zoo`, хранящий массив `Animal[] animals` (вместимостью до 10 животных).\nРеализуй методы:\n- `void add(Animal a)`: добавляет животное в зоопарк\n- `void feedAll()`: вызывает `eat()` у каждого добавленного животного\n- `int calculateTotalFood()`: суммирует `dailyFoodKg` всех животных зоопарка.\nВ `main` создай `Zoo`, добавь Льва (15 кг) и Панду (10 кг), вызови `feedAll()` и выведи `Итого корма в день: <сумма> кг`.",
        requirements: ["Класс `Zoo` с полиморфным массивом", "Методы `feedAll()` и `calculateTotalFood()`"],
        exampleInput: "Шерхан\nБамбу",
        exampleOutput: "Шерхан кушает 15 кг еды\nЛев Шерхан довольно рычит: Р-р-р!\nБамбу кушает 10 кг еды\nПанда Бамбу хрустит бамбуком\nИтого корма в день: 25 кг",
        sampleInput: "Шерхан\nБамбу",
        starterCode: `import java.util.Scanner;

// TODO: Animal, Lion, Panda
// TODO: Zoo

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String lion = scanner.nextLine();
        String panda = scanner.nextLine();

        // TODO
    }
}
`,
        tests: [
          { label: "Шерхан и Бамбу (15+10=25)", stdin: "Шерхан\nБамбу\n", expected: ["Шерхан кушает 15 кг еды", "Лев Шерхан довольно рычит: Р-р-р!", "Бамбу кушает 10 кг еды", "Панда Бамбу хрустит бамбуком", "Итого корма в день: 25 кг"] },
          { label: "Муфаса и КунгФу (15+10=25)", stdin: "Муфаса\nКунгФу\n", expected: ["Муфаса кушает 15 кг еды", "Лев Муфаса довольно рычит: Р-р-р!", "КунгФу кушает 10 кг еды", "Панда КунгФу хрустит бамбуком", "Итого корма в день: 25 кг"] },
        ],
        requiredCode: [
          { pattern: "class\\s+Zoo", message: "Создай класс Zoo" },
          { pattern: "calculateTotalFood", message: "Создай метод calculateTotalFood" },
        ],
        hints: ["`int total = 0; for (int i = 0; i < count; i++) total += animals[i].dailyFoodKg; return total;`"],
        solution: `import java.util.Scanner;

class Animal {
    protected String name;
    protected int dailyFoodKg;

    public Animal(String name, int dailyFoodKg) {
        this.name = name;
        this.dailyFoodKg = dailyFoodKg;
    }

    public void eat() {
        System.out.println(name + " кушает " + dailyFoodKg + " кг еды");
    }

    public int getDailyFoodKg() {
        return dailyFoodKg;
    }
}

class Lion extends Animal {
    public Lion(String name, int dailyFoodKg) {
        super(name, dailyFoodKg);
    }

    @Override
    public void eat() {
        super.eat();
        System.out.println("Лев " + name + " довольно рычит: Р-р-р!");
    }
}

class Panda extends Animal {
    public Panda(String name, int dailyFoodKg) {
        super(name, dailyFoodKg);
    }

    @Override
    public void eat() {
        super.eat();
        System.out.println("Панда " + name + " хрустит бамбуком");
    }
}

class Zoo {
    private Animal[] animals = new Animal[10];
    private int count = 0;

    public void add(Animal a) {
        if (count < animals.length) {
            animals[count++] = a;
        }
    }

    public void feedAll() {
        for (int i = 0; i < count; i++) {
            animals[i].eat();
        }
    }

    public int calculateTotalFood() {
        int total = 0;
        for (int i = 0; i < count; i++) {
            total += animals[i].getDailyFoodKg();
        }
        return total;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String lion = scanner.nextLine();
        String panda = scanner.nextLine();

        Zoo zoo = new Zoo();
        zoo.add(new Lion(lion, 15));
        zoo.add(new Panda(panda, 10));

        zoo.feedAll();
        System.out.println("Итого корма в день: " + zoo.calculateTotalFood() + " кг");
    }
}
`,
      },
    ],
  }),
];

export const module2Lessons: Lesson[] = [
  ...coreModule2Lessons,
  ...module2AdvancedLessons,
];

