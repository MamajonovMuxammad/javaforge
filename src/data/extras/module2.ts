import type { LessonExtras } from "../types";
import {
  h, p, code, list, table, tip, warn, info, analogy,
  oracle, javadoc, baeldung, habr, leetcode, codingbat, book, link,
  JAVA_INTERVIEW_RU, PYTHON_TUTOR_JAVA, DEV_JAVA, METANIT_JAVA, ROADMAP_JAVA, ROADMAP_BACKEND, REFACTORING_GURU, VISUALGO,
} from "./helpers";

const r = String.raw;

export const module2Extras: Record<number, LessonExtras> = {
  /* ================================================================== */
  /*  DAY 8 — Классы и объекты: чертёж и экземпляры                     */
  /* ================================================================== */
  8: {
    deepDive: [
      h("Что такое класс и объект на уровне памяти"),
      p("Класс — это тип данных и чертёж (шаблон), а объект (экземпляр, instance) — конкретная область памяти в **куче (Heap)**, созданная по этому чертежу."),
      code(r`
public class User {
    String name;      // Поле (field) / состояние объекта
    int age;

    void sayHello() { // Метод / поведение объекта
        System.out.println("Привет, я " + name + ", мне " + age);
    }
}

// В методе main:
User u1 = new User(); // new выделяет память в Heap и возвращает адрес (ссылку)
u1.name = "Али";
u1.age = 20;

User u2 = u1;         // u2 копирует ССЫЛКУ на тот же самый объект в Heap!
u2.age = 21;
System.out.println(u1.age); // 21 (объект один и тот же!)
`, "Классы и объекты"),
      table(
        ["Где находится", "Что хранит", "Жизненный цикл"],
        ["Стек (Stack)", "Переменная `u1` (адрес в памяти)", "Удаляется сразу при выходе из метода"],
        ["Куча (Heap)", "Сам объект `{name: \"Али\", age: 21}`", "Живёт, пока есть хотя бы одна ссылка; удаляется сборщиком мусора (GC)"],
      ),
      h("Null и NullPointerException (NPE)"),
      p("Если ссылочная переменная объявлена, но объект не создан, она равна `null` (пустая ссылка никуда). Любая попытка вызвать метод или обратиться к полю через `null` приводит к `NullPointerException` — ошибке №1 в мире Java."),
      code(r`
User u = null;
// u.sayHello(); // java.lang.NullPointerException!

// Защита:
if (u != null) {
    u.sayHello();
}
`, "Защита от NPE"),
      analogy("Чертёж дома и сам дом", "Класс — это архитектурный чертёж дома на бумаге. По одному чертежу можно построить 100 реальных домов из кирпича (объектов). Переменная `User u` — это бумажка с адресом дома. Если на бумажке написано `null` — адреса нет, ехать некуда."),
    ],
    interview: [
      { q: "Чем отличается класс от объекта?", a: "Класс — это описание структуры и поведения (шаблон, тип данных). Объект — конкретный экземпляр класса, размещённый в памяти Heap." },
      { q: "Что такое NullPointerException и как его избежать?", a: "Исключение при обращении к полям или методам по ссылке, равной null. Предотвращается проверками на null, использованием Objects.requireNonNull, правильной инициализацией или классом Optional." },
      { q: "Что происходит в памяти при выполнении `User u = new User()`?", a: "В стеке создаётся ссылочная переменная u. Оператор new выделяет память в Heap под объект User, инициализирует его поля дефолтными значениями, вызывает конструктор и возвращает ссылку, которая записывается в u." },
    ],
    selfStudy: [
      "Создай класс `Car` с полями `model`, `year`, `speed` и методами `accelerate(int amount)` и `brake()`.",
      "Создай 3 объекта Car, измени их поля и проверь их вывод через визуализатор памяти Python Tutor.",
      "Проверь, чему равны поля числовых, булевых и ссылочных типов по умолчанию сразу после `new`.",
    ],
    resources: [
      oracle("java/javaOO/classes.html", "Oracle: Classes and Objects"),
      baeldung("java-classes-objects", "Baeldung: Classes and Objects in Java"),
      PYTHON_TUTOR_JAVA,
      METANIT_JAVA,
      book("Кэти Сьерра — Head First Java (Глава 2: Поездка в Объектвилль)"),
    ],
  },

  /* ================================================================== */
  /*  DAY 9 — Конструкторы и ключевое слово this                        */
  /* ================================================================== */
  9: {
    deepDive: [
      h("Конструктор: создание и инициализация"),
      p("Конструктор — специальный блок кода, вызываемый оператором `new` для первичной инициализации объекта. Его имя **строго совпадает с именем класса**, и у него **нет возвращаемого типа** (даже `void`)."),
      code(r`
public class Person {
    String name;
    int age;

    // Конструктор по умолчанию (без параметров)
    public Person() {
        this("Аноним", 18); // Вызов другого конструктора этого же класса через this(...)
    }

    // Параметризованный конструктор
    public Person(String name, int age) {
        this.name = name; // this.name — поле объекта, name — локальный параметр
        this.age = age;
    }
}
`, "Конструкторы и this(...)"),
      warn("Дефолтный конструктор исчезает", "Если ты не написал ни одного конструктора, компилятор бесплатно генерирует пустой `public Person() {}`. Но как только ты объявил **хоть один свой конструктор с параметрами**, бесплатный конструктор исчезает! Если он нужен, напиши его явно."),
      h("Зачем нужен `this`"),
      list(
        "**Разрешение коллизий имён:** `this.name = name` отличает поле объекта от аргумента метода.",
        "**Делегирование конструкторов:** `this(...)` вызывает соседний конструктор. Вызов **обязан быть первой строкой** в конструкторе!",
        "**Передача ссылки на себя:** `service.register(this)` передаёт текущий объект в другой метод.",
      ),
      h("Блоки инициализации (Init Blocks)"),
      code(r`
public class Example {
    // 1. Статический блок: выполняется 1 раз при загрузке класса в память
    static { System.out.println("Static init"); }

    // 2. Нестатический блок: выполняется перед каждым конструктором
    { System.out.println("Instance init"); }

    public Example() { System.out.println("Constructor"); }
}
`, "Порядок инициализации"),
    ],
    interview: [
      { q: "Может ли конструктор возвращать значение?", a: "Нет, у конструктора нет возвращаемого типа (даже void). Если указать void, компилятор воспримет его как обычный метод, а не конструктор." },
      { q: "Что такое this() и какие к нему требования?", a: "this(...) вызывает другой конструктор того же класса. Он обязан быть самой первой инструкцией в теле конструктора." },
      { q: "В каком порядке инициализируются поля и блоки?", a: "1) Статические поля и статические блоки класса (один раз). 2) Нестатические поля и блоки инициализации экземпляра. 3) Тело конструктора." },
    ],
    selfStudy: [
      "Реализуй класс `Rectangle` с двумя конструкторами: `Rectangle(w, h)` и `Rectangle(size)` (квадрат, использующий `this(size, size)`).",
      "Проверь на практике, скомпилируется ли код, если `this(...)` поставить на вторую строку конструктора.",
    ],
    resources: [
      oracle("java/javaOO/constructors.html", "Oracle: Providing Constructors for your Classes"),
      baeldung("java-constructors", "Baeldung: Constructors in Java"),
      baeldung("java-this", "Baeldung: The 'this' Keyword in Java"),
    ],
  },

  /* ================================================================== */
  /*  DAY 10 — Инкапсуляция, геттеры/сеттеры и валидация                */
  /* ================================================================== */
  10: {
    deepDive: [
      h("Инкапсуляция: первый столп ООП"),
      p("Инкапсуляция решает две задачи: 1) объединяет данные и методы работы с ними в одном месте; 2) **скрывает внутреннее устройство** объекта от прямого неконтролируемого вмешательства извне."),
      table(
        ["Модификатор", "Внутри класса", "Внутри пакета", "В подклассах", "Везде в проекте"],
        ["private", "✅ Да", "❌ Нет", "❌ Нет", "❌ Нет"],
        ["(default / package-private)", "✅ Да", "✅ Да", "❌ Нет", "❌ Нет"],
        ["protected", "✅ Да", "✅ Да", "✅ Да", "❌ Нет"],
        ["public", "✅ Да", "✅ Да", "✅ Да", "✅ Да"],
      ),
      code(r`
public class BankAccount {
    // 1. Поля закрыты: никто снаружи не сделает balance = -999999
    private double balance;
    private String owner;

    public BankAccount(String owner, double initialDeposit) {
        this.owner = owner;
        deposit(initialDeposit);
    }

    // 2. Геттер: контролируемый доступ на чтение
    public double getBalance() {
        return balance;
    }

    // 3. Бизнес-метод с защитой инварианта: проверка корректности данных
    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Сумма пополнения должна быть > 0");
        }
        this.balance += amount;
    }

    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            this.balance -= amount;
            return true;
        }
        return false;
    }
}
`, "Защита инварианта класса"),
      analogy("Банкомат и купюры", "Если бы не было инкапсуляции, любой человек мог бы подойти к банкомату, открыть заднюю стенку отвёрткой и забрать деньги. Инкапсуляция прячет деньги под броней (`private`), давая наружу только экран и кнопки (`public getBalance`, `withdraw`)."),
    ],
    interview: [
      { q: "Что такое инкапсуляция и зачем она нужна?", a: "Сокрытие внутреннего состояния и деталей реализации объекта с предоставлением доступа только через публичный интерфейс (методы). Защищает инвариант объекта от некорректных изменений и уменьшает связанность (coupling)." },
      { q: "Почему нельзя просто делать все поля public?", a: "Теряется контроль над состоянием: внешний код может установить невалидные значения (отрицательный возраст, пустой логин), а при изменении структуры поля сломается весь зависимый код." },
      { q: "В чём разница между private, default, protected и public?", a: "private — доступен только внутри текущего класса; package-private (default) — внутри своего пакета; protected — внутри пакета + подклассам в других пакетах; public — доступен везде." },
    ],
    selfStudy: [
      "Спроектируй класс `Student` с валидацией возраста (16..100) и среднего балла GPA (0.0..5.0). Выбрасывай исключение при некорректных значениях.",
      "Попробуй создать два разных пакета `model` и `service` и проверь доступность `package-private` полей между ними.",
    ],
    resources: [
      oracle("java/javaOO/accesscontrol.html", "Oracle: Controlling Access to Members of a Class"),
      baeldung("java-access-modifiers", "Baeldung: Access Modifiers in Java"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 11 — static, final и константы                                */
  /* ================================================================== */
  11: {
    deepDive: [
      h("Что означает static: одно на весь класс"),
      p("Ключевое слово `static` привязывает поле или метод **к самому классу**, а не к отдельным объектам. Статическое поле существует в единственном экземпляре в Metaspace/Heap, независимо от того, создано 0 или 1 000 000 объектов."),
      code(r`
public class Counter {
    public static int totalCount = 0; // Общее для ВСЕХ объектов
    public int instanceId = 0;        // У каждого объекта СВОЙ

    public Counter() {
        totalCount++;
        instanceId = totalCount;
    }

    public static void printTotal() {
        System.out.println("Всего создано: " + totalCount);
        // System.out.println(instanceId); // ОШИБКА: static метод не видит нестатические поля!
    }
}
`, "static поля и методы"),
      warn("Чего не может static-метод", "Внутри статического метода **нет ссылки `this`**! Он не может напрямую обращаться к нестатическим полям и методам, потому что не знает, у какого конкретно объекта их брать."),
      h("Три лица ключевого слова final"),
      table(
        ["Где применяется", "Что означает", "Пример"],
        ["Переменная / поле", "Значение нельзя перезаписать (константа)", "`final double PI = 3.14159;`"],
        ["Метод", "Метод нельзя переопределить (@Override) в подклассе", "`public final void lock() {}`"],
        ["Класс", "От класса нельзя наследоваться (extends запрещён)", "`public final class String {}`"],
      ),
      h("Константы в Java: static final"),
      code(r`
public class AppConstants {
    public static final String APP_NAME = "JavaForge";
    public static final int MAX_USERS = 10_000;
}
`, "Глобальные константы"),
    ],
    interview: [
      { q: "Где хранятся static переменные?", a: "В Metaspace / Heap (начиная с Java 8 статическое состояние классов хранится в обычной куче как часть объекта java.lang.Class)." },
      { q: "Можно ли переопределить static метод в подклассе?", a: "Нет. Статические методы не участвуют в полиморфизме. Если объявить такой же static метод в подклассе, произойдёт скрытие (method hiding), а не переопределение." },
      { q: "Что гарантирует final у ссылочной переменной?", a: "Только то, что ссылка не может указывать на другой объект (нельзя сделать arr = new int[10]). Но состояние самого объекта (например, arr[0] = 5) менять МОЖНО." },
    ],
    selfStudy: [
      "Напиши утилитный класс `MathUtils` с приватным конструктором (`private MathUtils() {}`), чтобы никто не мог создать его экземпляр, и статическими методами `clamp` и `gcd`.",
      "Объяви `final int[] numbers = {1, 2, 3}` и проверь, можно ли изменить `numbers[0]` и `numbers = new int[5]`.",
    ],
    resources: [
      baeldung("java-static", "Baeldung: The 'static' Keyword in Java"),
      baeldung("java-final", "Baeldung: The 'final' Keyword in Java"),
      oracle("java/javaOO/classvars.html", "Oracle: Understanding Class Members"),
    ],
  },

  /* ================================================================== */
  /*  DAY 12 — Наследование и super                                     */
  /* ================================================================== */
  12: {
    deepDive: [
      h("Наследование: отношение «is-a» (является)"),
      p("Наследование позволяет создать новый класс на основе существующего, унаследовав его поля и методы с помощью ключевого слова `extends`. В Java **нет множественного наследования классов** — класс может расширять только одного родителя."),
      code(r`
public class Animal {
    protected String name; // protected доступен наследникам!

    public Animal(String name) {
        this.name = name;
    }

    public void eat() {
        System.out.println(name + " ест корм.");
    }
}

public class Dog extends Animal {
    private String breed;

    public Dog(String name, String breed) {
        super(name); // Вызов конструктора РОДИТЕЛЯ обязателен в первой строке!
        this.breed = breed;
    }

    public void bark() {
        System.out.println(name + " лает: Гав!");
    }
}
`, "Наследование и super"),
      h("Композиция против наследования"),
      p("Один из главных принципов чистого ООП: **Favor composition over inheritance** (предпочитай композицию наследованию). Не используй наследование только ради повторного использования кода. Наследование связывает классы намертво; композиция («has-a») гораздо гибче:"),
      code(r`
// Плохо: наследование ради пары методов (Car is-not-a Engine)
public class Car extends Engine {} 

// Хорошо: композиция (у машины ЕСТЬ двигатель)
public class Car {
    private final Engine engine;
    public Car(Engine engine) { this.engine = engine; }
}
`, "Композиция («has-a»)"),
    ],
    interview: [
      { q: "Почему в Java нет множественного наследования классов?", a: "Чтобы избежать «ромбовидного наследования» (Diamond Problem), когда неясно, чью версию метода вызывать при совпадении имён у двух родителей. Вместо этого в Java разрешена множественная реализация интерфейсов." },
      { q: "Что делает ключевое слово super?", a: "Обращается к родительскому классу: super(...) вызывает конструктор родителя, а super.method() — метод родителя (полезно при переопределении)." },
      { q: "Какой класс является прародителем всех классов в Java?", a: "java.lang.Object. Любой класс, если не указан extends явно, неявно наследуется от Object." },
    ],
    selfStudy: [
      "Построй иерархию сотрудников: `Employee` → `Developer`, `Manager`. Добавь расчёт зарплаты с бонусами.",
      "Попробуй вызвать метод родителя через `super.super` — скомпилируется ли такой код?",
    ],
    resources: [
      oracle("java/IandI/subclasses.html", "Oracle: Inheritance"),
      baeldung("java-inheritance", "Baeldung: Inheritance in Java"),
      baeldung("java-composition-vs-inheritance", "Baeldung: Composition vs Inheritance"),
      REFACTORING_GURU("composite", "Паттерн Компоновщик"),
    ],
  },

  /* ================================================================== */
  /*  DAY 13 — Полиморфизм: @Override и позднее связывание              */
  /* ================================================================== */
  13: {
    deepDive: [
      h("Полиморфизм: один интерфейс — много реализаций"),
      p("Полиморфизм позволяет работать с объектами разных классов через ссылку на их **общий базовый тип**. Какая конкретно версия метода вызовется — JVM решает во время выполнения на основе реального типа объекта в Heap (**динамическая диспетчеризация / позднее связывание**)."),
      code(r`
Animal[] animals = {
    new Dog("Бобик", "Овчарка"),
    new Cat("Мурка")
};

for (Animal a : animals) {
    a.makeSound(); // JVM сама вызовет гав для Dog и мяу для Cat!
}
`, "Полиморфный вызов"),
      h("Аннотация @Override"),
      p("Всегда пиши `@Override` над переопределяемыми методами! Она заставляет компилятор проверить, что метод с такой сигнатурой РЕАЛЬНО есть у родителя. Это защищает от глупых опечаток вроде `hashcode()` вместо `hashCode()`."),
      h("Upcasting, Downcasting и оператор instanceof"),
      code(r`
Animal a = new Dog("Рекс", "Хаски"); // Upcasting: безопасно, неявно

// До Java 16:
if (a instanceof Dog) {
    Dog d = (Dog) a; // Downcasting с риском ClassCastException
    d.bark();
}

// Java 16+ Pattern Matching for instanceof:
if (a instanceof Dog d) {
    d.bark(); // Переменная d уже типа Dog!
}
`, "Приведение ссылочных типов"),
    ],
    interview: [
      { q: "Что такое полиморфизм в Java?", a: "Способность программы единообразно работать с объектами разных типов, имеющих общего предка или общий интерфейс. Реализуется через переопределение методов (@Override) и позднее связывание." },
      { q: "Что такое раннее и позднее связывание?", a: "Раннее (статическое) связывание происходит на этапе компиляции для private, static и final методов. Позднее (динамическое) — во время выполнения по таблице виртуальных методов (vtable) для переопределяемых методов." },
      { q: "Что произойдёт при некорректном Downcasting?", a: "Выбросится исключение ClassCastException во время выполнения. Чтобы избежать, всегда проверяют тип через instanceof." },
    ],
    selfStudy: [
      "Создай полиморфную систему геометрических фигур: базовый класс `Shape` и методы `getArea()`, `getPerimeter()`. Наследники: `Circle`, `Rectangle`, `Triangle`.",
      "Создай массив `Shape[]` и посчитай суммарную площадь всех фигур в цикле.",
    ],
    resources: [
      oracle("java/IandI/polymorphism.html", "Oracle: Polymorphism"),
      baeldung("java-polymorphism", "Baeldung: Polymorphism in Java"),
      baeldung("java-instanceof", "Baeldung: The instanceof Operator in Java"),
    ],
  },

  /* ================================================================== */
  /*  DAY 14 — Спринт: Мини-проект «Зоопарк»                            */
  /* ================================================================== */
  14: {
    deepDive: [
      h("Проектирование ООП-системы: от идеи к коду"),
      p("В спринте дня 14 ты объединяешь всё: классы, инкапсуляцию, наследование и полиморфизм. Главное правило архитектора:"),
      list(
        "Выдели сущности предметной области (существительные: `Animal`, `Enclosure`, `Keeper`).",
        "Определи их ответственность (глаголы: `feed`, `calculateFood`, `clean`).",
        "Найди общие черты и вынеси в базовый класс (`Animal` с общим полем `name` и методом `eat()`).",
        "Создай коллекцию базового типа и управляй ей полиморфно (`Zoo` с массивом `Animal[]`).",
      ),
      tip("Связанность и сцепление (Coupling & Cohesion)", "Стремись к **High Cohesion** (класс делает одну конкретную задачу хорошо) и **Low Coupling** (классы слабо зависят от внутренних деталей друг друга)."),
    ],
    interview: [
      { q: "Какие 4 основных принципа ООП ты знаешь?", a: "1. Абстракция — выделение значимых характеристик объекта без лишних деталей. 2. Инкапсуляция — сокрытие данных и объединение их с методами. 3. Наследование — расширение базового класса новыми свойствами. 4. Полиморфизм — разное поведение объектов через общий интерфейс." },
    ],
    selfStudy: [
      "Добавь в проект «Зоопарк» класс смотрителя `Zookeeper`, который кормит животных и проверяет их здоровье.",
      "Добавь хищников (`Carnivore`) и травоядных (`Herbivore`) как промежуточный уровень иерархии.",
    ],
    resources: [
      REFACTORING_GURU("oop", "Refactoring.Guru: Принципы ООП простыми словами"),
      JAVA_INTERVIEW_RU,
      book("Роберт Мартин — «Чистая архитектура»"),
    ],
  },

  /* ================================================================== */
  /*  DAY 15 — Абстрактные классы                                       */
  /* ================================================================== */
  15: {
    deepDive: [
      h("Абстрактный класс: незаконченный чертёж"),
      p("Абстрактный класс (`abstract class`) нельзя инстанциировать напрямую через `new`. Он служит общим каркасом для наследников и может содержать как готовые методы, так и абстрактные (`abstract`) — методы без тела, которые наследники **обязаны** реализовать."),
      code(r`
public abstract class Employee {
    protected String name;

    public Employee(String name) { this.name = name; }

    // Готовый общий метод
    public void printBadge() {
        System.out.println("Сотрудник: " + name + ", Должность: " + getPosition());
    }

    // Абстрактный метод: каждый наследник считает зарплату по-своему!
    public abstract double calculateSalary();
    public abstract String getPosition();
}
`, "Абстрактный класс"),
      h("Паттерн «Шаблонный метод» (Template Method)"),
      p("Один из самых популярных паттернов. Родитель фиксирует **скелет алгоритма**, а конкретные шаги делегирует абстрактным методам:"),
      code(r`
public abstract class ReportGenerator {
    // Шаблонный метод — final, чтобы наследники не сломали алгоритм
    public final void generateReport() {
        fetchData();
        formatHeader();
        formatBody(); // шаг переопределяется в подклассах (PDF, Excel, HTML)
        save();
    }
    protected abstract void formatBody();
    private void fetchData() { ... }
    private void save() { ... }
}
`, "Template Method Pattern"),
    ],
    interview: [
      { q: "Можно ли создать объект абстрактного класса?", a: "Напрямую через new AbstractClass() — нет. Можно создать только экземпляр неабстрактного подкласса (или анонимного класса), реализующего все абстрактные методы." },
      { q: "Может ли абстрактный класс иметь конструктор?", a: "Да! Конструктор абстрактного класса вызывается из конструкторов подклассов через super(...) для инициализации общих полей." },
      { q: "Может ли класс быть abstract без единого абстрактного метода?", a: "Да. Это делается специально, чтобы запретить создание объектов базового класса напрямую через new." },
    ],
    selfStudy: [
      "Реализуй абстрактный класс `PaymentProcessor` с шаблонным методом `processPayment(double amount)`: валидация → `doTransfer(amount)` → запись лога.",
      "Создай подклассы `CreditCardProcessor` и `CryptoPaymentProcessor`.",
    ],
    resources: [
      oracle("java/IandI/abstract.html", "Oracle: Abstract Methods and Classes"),
      baeldung("java-abstract-class", "Baeldung: Abstract Classes in Java"),
      REFACTORING_GURU("template-method", "Паттерн Шаблонный метод"),
    ],
  },

  /* ================================================================== */
  /*  DAY 16 — Интерфейсы                                               */
  /* ================================================================== */
  16: {
    deepDive: [
      h("Интерфейс: чистый контракт поведения"),
      p("Интерфейс (`interface`) задаёт **что** объект умеет делать, но не говорит **как**. Класс может реализовывать (`implements`) сколько угодно интерфейсов, обходя ограничение на одиночное наследование."),
      code(r`
public interface Flyable {
    // Все поля в интерфейсе неявно: public static final (константы)
    int MAX_ALTITUDE = 10_000;

    // Все методы неявно: public abstract
    void fly();

    // Java 8+: дефолтные методы с готовой реализацией
    default void glide() {
        System.out.println("Парим по ветру...");
    }

    // Java 8+: статические утилитные методы
    static boolean canFly(int weightKg) {
        return weightKg < 500;
    }
}
`, "Интерфейсы в современной Java"),
      h("Абстрактный класс против интерфейса"),
      table(
        ["Критерий", "Интерфейс (interface)", "Абстрактный класс (abstract class)"],
        ["Множественное участие", "✅ Неограниченно (`implements A, B, C`)", "❌ Только один (`extends A`)"],
        ["Состояние (поля объекта)", "❌ Только `public static final` константы", "✅ Любые поля (private, protected, нестатические)"],
        ["Конструктор", "❌ Нет конструкторов", "✅ Есть (вызываются через super)"],
        ["Смысловая связь", "Описывает способность («что умеет»: `Comparable`, `AutoCloseable`)", "Описывает родство («кем является»: `Animal`, `Vehicle`)"],
      ),
    ],
    interview: [
      { q: "Зачем в Java 8 появились default методы в интерфейсах?", a: "Для обратной совместимости стандартных библиотек: чтобы можно было добавить новые методы (например, forEach в Iterable или stream() в Collection) без поломки миллионов существующих классов, реализующих эти интерфейсы." },
      { q: "Что делать при конфликте двух default методов с одинаковым именем из разных интерфейсов?", a: "Код не скомпилируется. Реализующий класс ОБЯЗАН явно переопределить этот метод и при необходимости вызвать нужный через InterfaceName.super.methodName()." },
      { q: "Что такое маркерный интерфейс (Marker Interface)?", a: "Интерфейс без единого метода (например, Serializable, Cloneable, Remote). Он служит меткой для JVM или фреймворка, подтверждающей определённое свойство объекта." },
    ],
    selfStudy: [
      "Реализуй интерфейсы `Swimmable` и `Flyable` у класса `Duck` (Утка).",
      "Попробуй создать конфликт двух интерфейсов с одинаковым default методом и разреши его через `@Override`.",
    ],
    resources: [
      oracle("java/IandI/createinterface.html", "Oracle: Interfaces"),
      baeldung("java-interfaces", "Baeldung: Interfaces in Java"),
      baeldung("java-static-default-methods", "Baeldung: Default Methods in Java 8"),
    ],
  },

  /* ================================================================== */
  /*  DAY 17 — equals и hashCode: контракт сравнения                    */
  /* ================================================================== */
  17: {
    deepDive: [
      h("Почему стандартный equals из Object не подходит"),
      p("В классе `Object` метод `equals` реализован банально как `this == obj` — то есть сравнивает ссылки. Но для бизнес-объектов (`User`, `Money`, `Product`) нам важно **равенство по содержимому** (например, два юзера с одинаковым `id` равны)."),
      code(r`
public class User {
    private final long id;
    private final String email;

    public User(long id, String email) {
        this.id = id;
        this.email = email;
    }

    @Override
    public boolean equals(Object o) {
        // 1. Проверка на идентичность ссылок (быстрый выход)
        if (this == o) return true;
        // 2. Проверка на null и точное совпадение классов
        if (o == null || getClass() != o.getClass()) return false;
        // 3. Безопасное приведение типа
        User user = (User) o;
        // 4. Сравнение значимых полей
        return id == user.id && java.util.Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id, email);
    }
}
`, "Каноническая реализация equals и hashCode"),
      h("Священный контракт equals & hashCode"),
      list(
        "Если `a.equals(b) == true`, то `a.hashCode()` **ОБЯЗАН** быть равен `b.hashCode()`.",
        "Если `a.hashCode() == b.hashCode()`, объекты **НЕ ОБЯЗАНЫ** быть равны (это называется коллизией).",
        "Если переопределил `equals`, ты **ОБЯЗАН** переопределить `hashCode`! Иначе объект потеряется в `HashMap` и `HashSet`.",
      ),
      warn("Катастрофа в HashMap", "Если не переопределить `hashCode()`, ты положишь объект в `map.put(new User(1, \"a@b.com\"), \"data\")`, а при попытке достать `map.get(new User(1, \"a@b.com\"))` получишь `null`, потому что новый объект попадёт в совершенно другой бакет памяти!"),
    ],
    interview: [
      { q: "Сформулируй контракт между equals и hashCode.", a: "1. Если два объекта равны по equals, их hashCode обязаны совпадать. 2. Одинаковый hashCode не гарантирует равенство объектов (коллизия). 3. hashCode должен возвращать одно и то же число при повторных вызовах, если значимые поля не менялись." },
      { q: "Почему нельзя использовать только getClass() или только instanceof в equals?", a: "getClass() требует строгого совпадения классов (наследники никогда не равны родителю — часто это лучший выбор по принципу Лисков). instanceof позволяет сравнивать подкласс с родителем, но может нарушить симметричность контракта." },
      { q: "Что будет, если добавить объект в HashSet, а потом изменить поле, участвующее в hashCode?", a: "Объект останется в старом бакете, но его новый хэш изменится. Найти или удалить его из сета станет невозможно — произойдёт утечка памяти." },
    ],
    selfStudy: [
      "Проверь поведение `HashSet`: создай класс без `hashCode`, добавь два объекта с одинаковыми полями и посмотри размер сета (должен быть 1, а окажется 2!).",
      "Сгенерируй `equals` и `hashCode` через генератор IntelliJ IDEA (`Alt+Insert` → equals and hashCode) и изучи получившийся код.",
    ],
    resources: [
      baeldung("java-equals-hashcode-contracts", "Baeldung: Guide to equals() and hashCode() in Java"),
      javadoc("java/lang/Object"),
      book("Джошуа Блох — «Effective Java» (Статья 10: Подчиняйтесь контракту при переопределении equals)"),
    ],
  },

  /* ================================================================== */
  /*  DAY 18 — String, StringBuilder и String Pool                      */
  /* ================================================================== */
  18: {
    deepDive: [
      h("Неизменяемость строк (Immutability)"),
      p("Класс `String` в Java **неизменяем (immutable)** и объявлен как `final`. Любой метод (`replace`, `substring`, конкатенация `+`) не меняет исходную строку, а создаёт **новый объект в памяти**."),
      code(r`
String s = "Hello";
s.toUpperCase();               // Ничего не изменилось!
System.out.println(s);        // "Hello"

s = s.toUpperCase();          // Создан новый объект "HELLO", ссылка s перезаписана
`, "Неизменяемость"),
      h("String Pool (Пул строк)"),
      p("Для экономии памяти JVM хранит строковые литералы в специальном пуле в Heap. Одинаковые литералы указывают на один и тот же объект:"),
      code(r`
String a = "Java";
String b = "Java";
String c = new String("Java"); // Принудительно создаёт НОВЫЙ объект вне пула

System.out.println(a == b);       // true  (один объект из String Pool)
System.out.println(a == c);       // false (разные адреса!)
System.out.println(a.equals(c));  // true  (содержимое одинаковое)

String interned = c.intern();     // intern() возвращает ссылку из пула
System.out.println(a == interned);// true
`, "String Pool и intern()"),
      h("Почему конкатенация строк в цикле — катастрофа O(n²)"),
      code(r`
// УЖАСНО: O(n²) по времени и мусор в памяти
String result = "";
for (int i = 0; i < 10_000; i++) {
    result += i; // Создаётся 10 000 промежуточных объектов String!
}

// ПРАВИЛЬНО: O(n) через StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 10_000; i++) {
    sb.append(i); // Изменяет внутренний буфер char[]/byte[] без создания новых объектов
}
String result = sb.toString();
`, "StringBuilder против String +"),
      table(
        ["Класс", "Изменяемость", "Потокобезопасность", "Где использовать"],
        ["String", "Immutable", "Да (потокобезопасен)", "Везде для хранения неизменяемых данных"],
        ["StringBuilder", "Mutable", "❌ Нет (быстрый)", "Для сборки строк в одном потоке (99% случаев)"],
        ["StringBuffer", "Mutable", "✅ Да (синхронизированные методы, медленнее)", "Устарел, редко нужен"],
      ),
    ],
    interview: [
      { q: "Почему String в Java сделали immutable?", a: "1. Безопасность: строки используются для хранения паролей, URL соединений, параметров сети. 2. Кэширование hashCode: хэш вычисляется 1 раз при создании. 3. String Pool: экономия десятков мегабайт памяти. 4. Потокобезопасность: неизменяемые объекты можно безопасно делить между потоками." },
      { q: "Чем отличаются StringBuilder и StringBuffer?", a: "StringBuilder быстрее, но не потокобезопасен. StringBuffer потокобезопасен (его методы синхронизированы), но медленнее из-за накладных расходов на блокировки." },
      { q: "Что делает метод intern()?", a: "Ищет строку с таким содержимым в String Pool. Если есть — возвращает ссылку на неё. Если нет — добавляет строку в пул и возвращает ссылку." },
    ],
    selfStudy: [
      "Замерь время конкатенации 50 000 чисел через `+` и через `StringBuilder` с помощью `System.currentTimeMillis()` — почувствуй разницу в 1000 раз.",
      "Изучи полезные методы `String`: `trim()`, `strip()`, `split()`, `join()`, `repeat()`, `isBlank()`.",
    ],
    resources: [
      baeldung("string-pool-java", "Baeldung: Guide to Java String Pool"),
      baeldung("java-string-immutable", "Baeldung: Why String Is Immutable in Java?"),
      baeldung("java-string-builder-string-buffer", "Baeldung: String, StringBuilder and StringBuffer"),
      javadoc("java/lang/String"),
      javadoc("java/lang/StringBuilder"),
    ],
  },

  /* ================================================================== */
  /*  DAY 19 — Исключения: try, catch, finally                          */
  /* ================================================================== */
  19: {
    deepDive: [
      h("Иерархия исключений в Java"),
      table(
        ["Класс", "Тип", "Примеры", "Нужно ли ловить?"],
        ["Error", "Критические сбои JVM", "`OutOfMemoryError`, `StackOverflowError`", "❌ Ловить бессмысленно — приложение спасти нельзя"],
        ["RuntimeException (Unchecked)", "Ошибки программиста / логики", "`NullPointerException`, `IndexOutOfBoundsException`", "⚠️ Ловить редко, нужно исправлять сам код"],
        ["Exception (Checked)", "Ожидаемые сбои внешнего мира", "`IOException`, `SQLException`, `ClassNotFoundException`", "✅ Обязаны либо поймать в `try-catch`, либо объявить `throws`"],
      ),
      code(r`
try {
    // Код, который может выбросить ошибку
    int a = 10 / 0;
} catch (ArithmeticException e) {
    // Обработка конкретной ошибки
    System.err.println("Деление на ноль: " + e.getMessage());
} catch (Exception e) {
    // Общий перехватчик (ставится ПОСЛЕ конкретных!)
    e.printStackTrace();
} finally {
    // Выполняется ВСЕГДА, даже если был return или ошибка!
    System.out.println("Блок finally выполнен");
}
`, "try / catch / finally"),
      warn("Антипаттерн: Пустой catch", "Никогда не пиши `catch (Exception e) {}`! Это прячет ошибку. Программа продолжит работать в сломанном состоянии, и ты будешь часами искать баг. Минимум залогируй: `log.error(\"Ошибка\", e)`."),
    ],
    interview: [
      { q: "В чём разница между Checked и Unchecked исключениями?", a: "Checked (наследники Exception, кроме RuntimeException) проверяются компилятором — их обязан обработать try-catch или пробросить throws. Unchecked (RuntimeException и Error) компилятор не проверяет — они сигнализируют о багах кода или критических отказах JVM." },
      { q: "Выполнится ли блок finally, если в try написать return?", a: "Да! Блок finally выполнится перед фактическим возвратом из метода. Единственные случаи, когда finally НЕ выполнится: System.exit(0), крах JVM или бесконечный цикл в try." },
      { q: "Можно ли поймать Throwable или Error?", a: "Технически можно, но ловить Error (например, OutOfMemoryError) категорически не рекомендуется: JVM находится в нестабильном состоянии." },
    ],
    selfStudy: [
      "Напиши метод безопасного парсинга числа: `safeParseInt(String s, int defaultValue)` с перехватом `NumberFormatException`.",
      "Попробуй вернуть значение из блока `try` и другое значение из `finally` — посмотри, что вернёт метод (никогда так не делай в продакшене!).",
    ],
    resources: [
      oracle("java/essential/exceptions/index.html", "Oracle: Lesson: Exceptions"),
      baeldung("java-exceptions", "Baeldung: Exceptions in Java"),
      baeldung("java-checked-unchecked-exceptions", "Baeldung: Checked vs Unchecked Exceptions in Java"),
    ],
  },

  /* ================================================================== */
  /*  DAY 20 — Свои исключения и try-with-resources                     */
  /* ================================================================== */
  20: {
    deepDive: [
      h("Создание собственных бизнес-исключений"),
      p("В реальном бэкенде стандартных `IllegalArgumentException` не хватает: нужны говорящие доменные ошибки (`InsufficientFundsException`, `UserNotFoundException`), чтобы возвращать клиенту понятный HTTP-статус (день 55)."),
      code(r`
// Своё unchecked-исключение для бизнес-логики:
public class InsufficientFundsException extends RuntimeException {
    private final double deficit;

    public InsufficientFundsException(String message, double deficit) {
        super(message);
        this.deficit = deficit;
    }

    public double getDeficit() { return deficit; }
}

// Использование:
if (balance < amount) {
    throw new InsufficientFundsException("Недостаточно средств", amount - balance);
}
`, "Собственные исключения"),
      h("try-with-resources: забываем про ручной close()"),
      p("Раньше ресурсы (файлы, сокеты, соединения с БД) закрывали в `finally`. Начиная с Java 7 появился синтаксис **try-with-resources**: любой объект, реализующий интерфейс `AutoCloseable`, **закрывается автоматически**, даже при аварии!"),
      code(r`
// Старый ужасный способ:
Scanner s = null;
try {
    s = new Scanner(new File("data.txt"));
} finally {
    if (s != null) s.close(); // можно получить NPE или скрыть ошибку!
}

// Современный красивый способ (try-with-resources):
try (Scanner scanner = new Scanner(new File("data.txt"))) {
    while (scanner.hasNextLine()) {
        System.out.println(scanner.nextLine());
    }
} // scanner.close() вызовется автоматически прямо здесь!
`, "try-with-resources"),
    ],
    interview: [
      { q: "Какому интерфейсу должен удовлетворять объект для использования в try-with-resources?", a: "java.lang.AutoCloseable (или его подтипу java.io.Closeable), имеющему метод void close() throws Exception." },
      { q: "Что такое подавленные исключения (Suppressed Exceptions)?", a: "Если исключение возникло и в блоке try, и при автоматическом закрытии ресурса в close(), ошибка из try выбрасывается наружу, а ошибка из close() прикрепляется к ней как подавленная (доступна через e.getSuppressed())." },
      { q: "Когда делать собственное исключение checked, а когда unchecked?", a: "В современном бэкенде 95% бизнес-исключений делают unchecked (наследуют RuntimeException), чтобы не засорять сигнатуры методов десятками throws. Checked используют только когда вызывающая сторона РЕАЛЬНО может восстановиться после ошибки." },
    ],
    selfStudy: [
      "Создай свой класс `DatabaseConnection implements AutoCloseable` и протестируй его в `try-with-resources`.",
      "Создай цепочку исключений с сохранением причины: `new ServiceException(\"Сбой сервиса\", cause)`.",
    ],
    resources: [
      oracle("java/essential/exceptions/tryResourceClose.html", "Oracle: The try-with-resources Statement"),
      baeldung("java-custom-exception", "Baeldung: Custom Exceptions in Java"),
      baeldung("java-try-with-resources", "Baeldung: Java – Try with Resources"),
      javadoc("java/lang/AutoCloseable"),
    ],
  },

  /* ================================================================== */
  /*  DAY 21 — Итоговый проект модуля 2: «Банковская система»           */
  /* ================================================================== */
  21: {
    deepDive: [
      h("Архитектура проекта: собираем весь модуль ООП воедино"),
      p("В итоговом проекте ты строишь мини-бэкенд банка. Вот как соединяются все темы модуля:"),
      list(
        "**Инкапсуляция:** `Account` хранит приватный баланс, снять деньги можно только через метод `withdraw()` с валидацией.",
        "**Наследование и абстракция:** базовый `Account` и наследники: `DebitAccount`, `CreditAccount` (с кредитным лимитом), `SavingsAccount` (с начислением % годовых).",
        "**Полиморфизм:** список `List<Account>` обрабатывает любые счета одинаково через общий контракт.",
        "**Исключения:** `AccountNotFoundException`, `InsufficientFundsException` вместо кодов возврата `false`.",
        "**equals/hashCode:** сравнение счетов по уникальному `accountNumber`.",
      ),
      tip("Паттерн Transaction", "Перевод денег между счетами должен быть атомарным: либо сняли и зачислили оба счёта, либо откатили операцию, если на втором счёте произошла ошибка. Это первый шаг к пониманию транзакций в базах данных (день 43)."),
    ],
    interview: [
      { q: "Как защитить баланс в многопоточной среде?", a: "Использовать synchronized методы/блоки, ReentrantLock или атомарные классы из java.util.concurrent.atomic (например, AtomicLong для центов)." },
    ],
    selfStudy: [
      "Добавь историю транзакций: класс `Transaction` (id, timestamp, from, to, amount, type).",
      "Реализуй начисление процентов на остаток для накопительных счетов раз в месяц.",
    ],
    resources: [
      REFACTORING_GURU("refactoring", "Refactoring.Guru: Каталог рефакторинга"),
      JAVA_INTERVIEW_RU,
      ROADMAP_BACKEND,
    ],
  },
};
