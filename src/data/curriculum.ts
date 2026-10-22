import { module0Lesson } from "./lessons-module0";
import { module1Lessons } from "./lessons-module1";
import { module2Lessons } from "./lessons-module2";
import { module3Lessons } from "./lessons-module3";
import { module4Lessons } from "./lessons-module4";
import { allExtras } from "./extras";
import type { Lesson, Module, VideoRef, LessonTask } from "./types";

export type { Lesson, Module, LessonTask, TaskType } from "./types";

export const PLATFORM_NAME = "JavaForge";
export const XP_PER_DAY = 100;

export const modules: Module[] = [
  {
    id: 0,
    title: "Анатомия Java & Фундамент с нуля",
    shortTitle: "Модуль 0 (Введение)",
    description: "Зачем нужно каждое слово: public, class, static, void, main, String[] args, import и Scanner.",
    fromDay: 0,
    toDay: 0,
    color: "#38bdf8",
  },
  {
    id: 1,
    title: "Базовый синтаксис, вывод и переменные",
    shortTitle: "Основы Java (W3Schools)",
    description: "Синтаксис, System.out.println, комментарии, переменные, 8 примитивных типов, кастинг, операторы и Scanner.",
    fromDay: 1,
    toDay: 7,
    color: "#fb923c",
  },
  {
    id: 2,
    title: "Строки, математика и логика ветвлений",
    shortTitle: "Строки и Условия",
    description: "Методы String, класс Math, случайные числа, булевы выражения, if...else и оператор switch.",
    fromDay: 8,
    toDay: 12,
    color: "#f59e0b",
  },
  {
    id: 3,
    title: "Циклы и массивы",
    shortTitle: "Циклы и Массивы",
    description: "Циклы while, do-while, for, break/continue, одномерные и двумерные массивы, for-each и алгоритмы.",
    fromDay: 13,
    toDay: 20,
    color: "#10b981",
  },
  {
    id: 4,
    title: "Методы (Функции) в Java",
    shortTitle: "Методы и Рекурсия",
    description: "Создание и вызов методов, параметры, возвращаемые значения (return), перегрузка (overloading), scope и рекурсия.",
    fromDay: 21,
    toDay: 25,
    color: "#06b6d4",
  },
  {
    id: 5,
    title: "Объектно-ориентированное программирование",
    shortTitle: "ООП",
    description: "Классы, конструкторы, инкапсуляция, static/final, наследование, полиморфизм, интерфейсы и исключения.",
    fromDay: 26,
    toDay: 39,
    color: "#a78bfa",
  },
  {
    id: 6,
    title: "Коллекции и Stream API",
    shortTitle: "Коллекции & Streams",
    description: "Generics, ArrayList, LinkedList, HashMap изнутри, HashSet, очереди, лямбды, Stream API и Java Time.",
    fromDay: 40,
    toDay: 53,
    color: "#38bdf8",
  },
  {
    id: 7,
    title: "Базы данных, SQL и Git",
    shortTitle: "SQL & Git",
    description: "PostgreSQL, DDL/DML, JOIN, индексы, транзакции (ACID), JDBC, Maven, Flyway, Git и GitHub PR.",
    fromDay: 54,
    toDay: 68,
    color: "#34d399",
  },
  {
    id: 8,
    title: "Spring Boot, REST API и Docker",
    shortTitle: "Spring Boot & REST",
    description: "HTTP/REST, Spring IoC/DI, Spring Web, Spring Data JPA, Hibernate, JUnit 5, Security JWT, Docker и дипломный проект.",
    fromDay: 69,
    toDay: 83,
    color: "#f472b6",
  },
];

type Outline = [day: number, title: string, short: string, topics: string[], alishev: string, tregulov: string];

const outlines: Outline[] = [
  // Module 5: ООП (Дни 26–39)
  [26, "Классы и объекты: чертёж и экземпляры", "Создание собственных типов данных, поля и методы", ["class и new", "Поля (состояние)", "Методы (поведение)", "Ссылки в памяти Heap"], "Алишев Java классы и объекты", "Заур Трегулов классы и объекты Java"],
  [27, "Конструкторы и инициализация объектов", "Создание объектов с начальными данными", ["Конструктор по умолчанию", "Конструктор с параметрами", "Перегрузка конструкторов"], "Алишев Java конструкторы", "Заур Трегулов конструкторы Java"],
  [28, "Инкапсуляция и модификаторы доступа", "Защита данных и сокрытие реализации", ["private, public, protected", "Геттеры и сеттеры", "Валидация в сеттерах"], "Алишев Java инкапсуляция", "Заур Трегулов инкапсуляция get set Java"],
  [29, "Ключевое слово this", "Ссылка на текущий экземпляр", ["this.field", "Вызов конструктора this()", "Затенение имен"], "Алишев Java ключевое слово this", "Заур Трегулов this Java"],
  [30, "static, final и константы", "Общее для всех объектов класса", ["static поля и методы", "final переменные и методы", "Константы в Java"], "Алишев Java ключевое слово static", "Заур Трегулов static final Java"],
  [31, "Наследование и super", "Повторное использование кода и иерархии", ["extends", "super()", "super.method()", "Композиция vs наследование"], "Алишев Java наследование", "Заур Трегулов наследование super Java"],
  [32, "Полиморфизм и @Override", "Один интерфейс — много реализаций", ["@Override", "Позднее связывание", "Upcasting / downcasting", "instanceof"], "Алишев Java полиморфизм", "Заур Трегулов полиморфизм Java"],
  [33, "Спринт ООП: мини-проект «Зоопарк»", "Моделирование предметной области", ["Иерархия животных", "Полиморфное кормление", "Буферный спринт"], "Алишев Java ООП практика", "Заур Трегулов ООП задачи Java"],
  [34, "Абстрактные классы", "Частично готовые чертежи", ["abstract class", "abstract методы", "Паттерн «Шаблонный метод»"], "Алишев Java абстрактные классы", "Заур Трегулов abstract class Java"],
  [35, "Интерфейсы", "Контракты поведения и множественная реализация", ["interface", "implements", "default-методы", "Маркерные интерфейсы"], "Алишев Java интерфейсы", "Заур Трегулов интерфейсы Java"],
  [36, "equals и hashCode", "Контракт сравнения объектов", ["Класс Object", "equals", "hashCode", "Почему переопределять вместе"], "Алишев Java equals hashCode", "Заур Трегулов equals hashCode Java"],
  [37, "String, StringBuilder и String Pool", "Неизменяемые строки и оптимизация", ["String pool", "Immutability", "StringBuilder vs StringBuffer"], "Алишев Java String StringBuilder", "Заур Трегулов String pool Java"],
  [38, "Исключения: try / catch / finally", "Обработка ошибок и надёжность", ["Throwable", "Checked vs Unchecked", "try / catch / finally", "throw / throws"], "Алишев Java исключения", "Заур Трегулов исключения Java exceptions"],
  [39, "Итоговый проект: «Банковская система»", "Полноценное ООП-приложение", ["Счета и клиенты", "Транзакции и переводы", "Бизнес-исключения"], "Алишев Java ООП проект", "Заур Трегулов ООП практика банковский счёт"],

  // Module 6: Коллекции и Stream API (Дни 40–53)
  [40, "Generics", "Обобщённые типы данных", ["Параметризованные классы <T>", "Bounded types <T extends Number>", "Wildcards ? extends / ? super"], "Алишев Java generics", "Заур Трегулов generics Java"],
  [41, "ArrayList", "Динамический массив изнутри", ["Внутренний массив Object[]", "Автоматическое расширение (grow)", "Сложность операций O(1) и O(N)"], "Алишев Java ArrayList", "Заур Трегулов ArrayList Java"],
  [42, "LinkedList и сравнение с ArrayList", "Двусвязный список", ["Узлы Node, prev и next", "Вставка и удаление в середину", "Сравнение Big-O"], "Алишев Java LinkedList", "Заур Трегулов LinkedList Java"],
  [43, "Iterator, Comparable и Comparator", "Обход и сортировка коллекций", ["Интерфейс Iterator", "ConcurrentModificationException", "Comparable compareTo", "Comparator compare"], "Алишев Java Comparable Comparator", "Заур Трегулов Comparator Iterator"],
  [44, "HashMap изнутри", "Устройство хеш-таблицы", ["Корзины (buckets)", "Хеш-функция и коллизии", "Красно-чёрные деревья в Java 8+", "Load Factor"], "Алишев Java HashMap", "Заур Трегулов HashMap изнутри"],
  [45, "HashSet, TreeMap, TreeSet", "Множества и упорядоченные структуры", ["Set", "TreeMap", "Красно-чёрное дерево", "LinkedHashMap"], "Алишев Java Set HashSet TreeSet", "Заур Трегулов TreeMap TreeSet"],
  [46, "Спринт коллекций: «Телефонная книга»", "Практика сложных структур", ["Map<String, List<String>>", "Быстрый поиск и фильтрация", "Буферный спринт"], "Алишев Java коллекции практика", "Заур Трегулов коллекции задачи"],
  [47, "Queue, Deque, PriorityQueue", "Очереди и стеки", ["Queue FIFO", "ArrayDeque как стек и очередь", "PriorityQueue приоритетная куча"], "Алишев Java Queue очередь", "Заур Трегулов Queue Deque PriorityQueue"],
  [48, "Лямбда-выражения и функциональные интерфейсы", "Функциональный стиль в Java", ["Лямбды", "Predicate, Consumer, Function, Supplier", "@FunctionalInterface"], "Алишев Java лямбда выражения", "Заур Трегулов лямбда выражения"],
  [49, "Stream API: базовые операции", "Конвейерная обработка данных", ["filter", "map", "collect", "toList / toSet / toMap"], "Алишев Java Stream API", "Заур Трегулов Stream API основы"],
  [50, "Stream API: reduce, groupingBy, flatMap", "Продвинутая аналитика", ["reduce", "Collectors.groupingBy", "flatMap", "sorted и distinct"], "Алишев Java Stream API reduce", "Заур Трегулов stream groupingBy flatMap"],
  [51, "Optional и ссылки на методы (::)", "Код без NullPointerException", ["Optional", "orElse / orElseThrow", "Method references Class::method"], "Алишев Java Optional", "Заур Трегулов method reference Optional"],
  [52, "Java Time API", "Современная работа с датами и временем", ["LocalDate", "LocalDateTime", "Duration и Period", "DateTimeFormatter"], "Java LocalDate LocalDateTime урок", "Заур Трегулов LocalDate Java"],
  [53, "Итоговый проект: «Анализатор заказов на Streams»", "Аналитика данных на практике", ["Группировка продаж", "Поиск топ-товаров", "Статистические отчёты"], "Алишев Java Stream практика", "Заур Трегулов Stream API задачи"],

  // Module 7: Базы данных, SQL и Git (Дни 54–68)
  [54, "Введение в реляционные БД и PostgreSQL", "Архитектура и первый запуск", ["Реляционная модель", "Установка PostgreSQL", "DBeaver и psql"], "PostgreSQL для начинающих установка", "Заур Трегулов SQL для начинающих"],
  [55, "DDL: CREATE, ALTER, DROP TABLE", "Создание схемы базы данных", ["CREATE TABLE", "Типы данных PostgreSQL", "ALTER TABLE", "DROP TABLE"], "SQL DDL CREATE TABLE PostgreSQL урок", "Заур Трегулов SQL CREATE TABLE"],
  [56, "DML: INSERT, UPDATE, DELETE, SELECT", "Манипуляция данными", ["INSERT INTO", "UPDATE", "DELETE", "Базовый SELECT"], "SQL INSERT UPDATE DELETE PostgreSQL", "Заур Трегулов SQL SELECT"],
  [57, "WHERE, ORDER BY, GROUP BY, HAVING", "Фильтрация и агрегаты", ["Фильтрация WHERE", "Сортировка ORDER BY", "COUNT, SUM, AVG", "Группировка GROUP BY и HAVING"], "SQL GROUP BY HAVING урок", "Заур Трегулов SQL GROUP BY"],
  [58, "JOIN: объединение таблиц", "Связи между таблицами", ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], "SQL JOIN объяснение", "Заур Трегулов SQL JOIN"],
  [59, "Ключи, ограничения и нормализация", "Проектирование надежной схемы", ["PRIMARY KEY", "FOREIGN KEY", "UNIQUE / NOT NULL / CHECK", "1NF–3NF нормализация"], "SQL нормализация баз данных", "SQL foreign key primary key урок"],
  [60, "Спринт: проектирование схемы интернет-магазина", "Практическое моделирование БД", ["ER-диаграмма", "Связи 1:N и M:N", "Таблицы заказов и товаров"], "проектирование базы данных интернет магазин", "ER диаграмма SQL урок"],
  [61, "Индексы и транзакции (ACID)", "Скорость и надёжность", ["B-tree индексы", "EXPLAIN ANALYZE", "ACID", "Уровни изоляции транзакций"], "SQL индексы и транзакции ACID", "PostgreSQL EXPLAIN индексы"],
  [62, "JDBC: подключение и Statement", "Связываем Java с базой данных", ["DriverManager", "Connection", "Statement", "ResultSet"], "Алишев JDBC", "Заур Трегулов JDBC"],
  [63, "JDBC: PreparedStatement и паттерн DAO", "Безопасность и архитектура", ["PreparedStatement", "Защита от SQL Injection", "Паттерн DAO (Data Access Object)"], "Алишев JDBC PreparedStatement DAO", "JDBC SQL injection PreparedStatement"],
  [64, "Maven: управление сборкой и зависимостями", "Сборка проекта", ["pom.xml", "Зависимости dependencies", "Плагины и жизненный цикл сборки"], "Алишев Maven", "Заур Трегулов Maven"],
  [65, "Flyway: миграции схемы БД", "Версионирование базы данных", ["V1__init.sql", "flyway:migrate", "Откаты и история миграций"], "Flyway миграции Java урок", "Flyway Spring Boot миграции"],
  [66, "Git: основы версионирования", "Локальная история", ["git init, add, commit", "git status, log, diff", ".gitignore"], "Git для начинающих основы", "Git с нуля commit"],
  [67, "Git: ветки, merge и rebase", "Командная разработка", ["git branch, checkout, switch", "git merge", "git rebase", "Разрешение конфликтов"], "Git ветки merge rebase", "Git конфликты слияния"],
  [68, "GitHub, Pull Requests и Code Review", "Публикация кода и портфолио", ["git remote, push, pull", "Создание Pull Request", "Code Review"], "GitHub pull request для начинающих", "GitHub для начинающих"],

  // Module 8: Spring Boot, REST API и Docker (Дни 69–83)
  [69, "HTTP и архитектура REST API", "Как устроен современный веб", ["HTTP методы GET, POST, PUT, DELETE", "Статус-коды", "Формат JSON", "REST принципы"], "HTTP REST API для начинающих", "Алишев REST API"],
  [70, "Spring Core: IoC и Dependency Injection", "Инверсия управления", ["Spring Container", "Bean", "@Component, @Service, @Repository", "Внедрение через конструктор"], "Алишев Spring IoC DI", "Заур Трегулов Spring IoC DI"],
  [71, "Spring Boot: стартеры и конфигурация", "Быстрый старт бэкенда", ["start.spring.io", "Starters", "application.yml", "Профили dev и prod"], "Алишев Spring Boot", "Заур Трегулов Spring Boot"],
  [72, "Spring Web: создание REST контроллеров", "Первый рабочий API", ["@RestController", "@GetMapping, @PostMapping", "@PathVariable, @RequestParam, @RequestBody"], "Алишев Spring REST контроллер", "Заур Трегулов Spring REST"],
  [73, "DTO, валидация и @ControllerAdvice", "Надежный контракт данных", ["Паттерн DTO", "@Valid и Hibernate Validator", "Централизованный @ControllerAdvice", "ResponseEntity"], "Spring Boot валидация ControllerAdvice", "Spring Boot DTO урок"],
  [74, "Spring Data JPA: сущности и репозитории", "Работа с БД без SQL", ["@Entity и @Id", "JpaRepository", "Derived query methods", "@Query"], "Алишев Spring Data JPA", "Заур Трегулов Spring Data JPA"],
  [75, "Hibernate: связи сущностей и проблема N+1", "Связи в реляционной БД", ["@OneToMany и @ManyToOne", "@ManyToMany", "LAZY vs EAGER загрузка", "Проблема N+1 и JOIN FETCH"], "Алишев Hibernate связи", "Заур Трегулов Hibernate OneToMany"],
  [76, "Спринт: CRUD API «Онлайн-библиотека»", "Полноценный микросервис", ["Полный CRUD", "Слои Controller -> Service -> Repository", "Буферный спринт"], "Spring Boot CRUD REST API с нуля", "Spring Boot проект для начинающих"],
  [77, "@Transactional и транзакции в Spring", "Целостность бизнес-операций", ["Аннотация @Transactional", "Propagation и Isolation", "Rollback rules"], "Spring Transactional объяснение", "Заур Трегулов Spring Transactional"],
  [78, "Тестирование: JUnit 5 и Mockito", "Автоматические тесты бэкенда", ["JUnit 5 assertions", "Мокирование с Mockito (@Mock, @InjectMocks)", "@SpringBootTest и @WebMvcTest"], "JUnit 5 Mockito урок", "Spring Boot тестирование"],
  [79, "Spring Security и авторизация по JWT", "Защита API", ["SecurityFilterChain", "Хеширование паролей BCrypt", "Генерация и валидация JWT токенов"], "Алишев Spring Security", "Spring Security JWT урок"],
  [80, "Docker: контейнеризация Java-приложений", "Упаковка сервиса", ["Docker images и containers", "Многоэтапный Dockerfile (multi-stage)", "docker build и run"], "Docker для начинающих", "Docker Spring Boot Dockerfile"],
  [81, "Docker Compose: связка Spring Boot + PostgreSQL", "Оркестрация стека локально", ["docker-compose.yml", "Сети, volumes и переменные окружения", "Связка бэкенда с СУБД"], "Docker Compose Spring Boot PostgreSQL", "Docker Compose для начинающих"],
  [82, "Подготовка к техническому собеседованию", "Путь к офферу Junior", ["Топ вопросов по Core Java, Collections, Spring, SQL", "Архитектурные вопросы", "Составление резюме"], "собеседование Java Junior вопросы", "Java Junior собеседование разбор"],
  [83, "Финальный дипломный проект: REST API «Task Tracker»", "Портфолио-проект для резюме", ["Spring Boot + PostgreSQL + Docker Compose", "Swagger/OpenAPI документация", "Деплой на сервер"], "Spring Boot pet project с нуля", "Java backend pet проект"],
];

function moduleForDay(day: number): Module {
  const found = modules.find((m) => day >= m.fromDay && day <= m.toDay);
  if (!found) throw new Error(`No module for day ${day}`);
  return found;
}

const sandboxStarter = (title: string) => `public class Main {
    public static void main(String[] args) {
        // Песочница: ${title.replace(/[`$\\]/g, "")}
        // Экспериментируй с кодом из лекций и видео!
        System.out.println("Hello, JavaForge!");
    }
}
`;

const interactiveDays = new Set([
  ...module1Lessons.map((l) => l.day),
  ...module2Lessons.map((l) => l.day),
  ...module3Lessons.map((l) => l.day),
  ...module4Lessons.map((l) => l.day),
]);

const outlineLessons: Lesson[] = outlines
  .filter(([day]) => !interactiveDays.has(day))
  .map(([day, title, short, topics, alishev, tregulov]) => {
    const mod = moduleForDay(day);
    const isSprint = title.startsWith("Спринт") || title.startsWith("Итоговый") || title.startsWith("Финальный");
    const videos: VideoRef[] = [
      { author: "Алишев", query: alishev },
      { author: "Заур Трегулов", query: tregulov },
    ];
    const defaultTask: LessonTask = {
      id: `d${day}_t1`,
      type: "practice",
      title: `Практика: ${title}`,
      shortDesc: short,
      difficulty: isSprint ? "Сложный" : mod.id >= 6 ? "Сложный" : "Средний",
      xp: XP_PER_DAY,
      description: `Закрепи знания по теме «${title}». Изучи теорию и видео-уроки, затем напиши и протестируй решение в онлайн-песочнице.`,
      requirements: topics.map((t) => `Применить на практике: ${t}`),
      starterCode: sandboxStarter(title),
      tests: [],
      hints: [`Используй примеры из раздела теории и материалов выше.`],
    };

    return {
      day,
      moduleId: mod.id,
      title,
      short,
      difficulty: isSprint ? "Сложный" : mod.id >= 6 ? "Сложный" : "Средний",
      duration: isSprint ? "~3 часа" : "~2 часа",
      xp: XP_PER_DAY,
      topics,
      videos,
      ready: true,
      theory: [],
      tasks: [defaultTask],
      starterCode: sandboxStarter(title),
      tests: [],
      hints: [],
    };
  });

const rawLessons: Lesson[] = [
  module0Lesson,
  ...module1Lessons,
  ...module2Lessons,
  ...module3Lessons,
  ...module4Lessons,
  ...outlineLessons,
].sort((a, b) => a.day - b.day);

export const lessons: Lesson[] = rawLessons.map((l) => {
  const extra = allExtras[l.day];
  const hasOwnTheory = Array.isArray(l.theory) && l.theory.length > 0;
  const theory = hasOwnTheory ? l.theory : (extra?.deepDive ?? []);

  const hasTasks = Array.isArray(l.tasks) && l.tasks.length > 0;
  const fallbackTask: LessonTask = {
    id: `d${l.day}_t1`,
    type: "practice",
    title: `Практика: ${l.title}`,
    shortDesc: l.short,
    difficulty: l.difficulty,
    xp: l.xp,
    description: `Закрепи знания по теме «${l.title}». Изучи теорию и видео-уроки, затем напиши и протестируй решение в онлайн-песочнице.`,
    requirements: (l.topics || []).map((t) => `Применить на практике: ${t}`),
    starterCode: l.starterCode || sandboxStarter(l.title),
    tests: [],
    hints: [`Используй примеры из раздела теории и материалов выше.`],
  };

  const tasks = l.day === 0 ? [] : (hasTasks ? l.tasks : [fallbackTask]);
  const mainTask = tasks[0] || fallbackTask;

  return {
    ...l,
    task: mainTask,
    tasks,
    starterCode: l.day === 0 ? "" : (l.starterCode || mainTask.starterCode),
    sampleInput: l.day === 0 ? "" : (l.sampleInput || mainTask.sampleInput),
    tests: l.day === 0 ? [] : (l.tests && l.tests.length > 0 ? l.tests : mainTask.tests),
    requiredCode: l.requiredCode || mainTask.requiredCode,
    hints: l.hints && l.hints.length > 0 ? l.hints : mainTask.hints,
    solution: l.solution || mainTask.solution,
    theory,
    ready: true,
    deepDive: extra?.deepDive,
    interview: extra?.interview,
    selfStudy: extra?.selfStudy,
    resources: extra?.resources,
  };
});

export const TOTAL_DAYS = lessons.length;

export function getLesson(day: number): Lesson | undefined {
  return lessons.find((l) => l.day === day);
}

export function getModule(id: number): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function lessonsOfModule(id: number): Lesson[] {
  return lessons.filter((l) => l.moduleId === id);
}

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
