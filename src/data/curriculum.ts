import { module1Lessons } from "./lessons-module1";
import { module2Lessons } from "./lessons-module2";
import { module3Lessons } from "./lessons-module3";
import { module4Lessons } from "./lessons-module4";
import { module5Lessons } from "./lessons-module5";
import { allExtras } from "./extras";
import type { Lesson, Module, VideoRef, LessonTask } from "./types";

export type { Lesson, Module, LessonTask, TaskType } from "./types";

export const PLATFORM_NAME = "JavaForge";
export const XP_PER_DAY = 100;

export const modules: Module[] = [
  {
    id: 1,
    title: "Базовый синтаксис и переменные",
    shortTitle: "Основы Java",
    description: "JVM, типы данных, условия, циклы, массивы и первые методы.",
    fromDay: 1,
    toDay: 7,
    color: "#fb923c",
  },
  {
    id: 2,
    title: "Объектно-ориентированное программирование",
    shortTitle: "ООП",
    description: "Классы, инкапсуляция, наследование, полиморфизм, интерфейсы и исключения.",
    fromDay: 8,
    toDay: 21,
    color: "#a78bfa",
  },
  {
    id: 3,
    title: "Коллекции и Stream API",
    shortTitle: "Коллекции",
    description: "ArrayList, LinkedList, HashMap изнутри, HashSet, лямбды и стримы.",
    fromDay: 22,
    toDay: 35,
    color: "#38bdf8",
  },
  {
    id: 4,
    title: "Базы данных, SQL и Git",
    shortTitle: "SQL & Git",
    description: "PostgreSQL, DDL/DML, JOIN, транзакции, JDBC, Flyway, Maven и Git.",
    fromDay: 36,
    toDay: 50,
    color: "#34d399",
  },
  {
    id: 5,
    title: "Spring Boot и REST API",
    shortTitle: "Spring Boot",
    description: "DI, Spring Web, Spring Data JPA, Hibernate, тесты, Security и Docker.",
    fromDay: 51,
    toDay: 65,
    color: "#f472b6",
  },
];

type Outline = [day: number, title: string, short: string, topics: string[], alishev: string, tregulov: string];

const outlines: Outline[] = [
  // Module 2 outlines (remaining days)
  [11, "static, final и пакеты", "Общее для всех объектов", ["static поля и методы", "final", "пакеты и import", "константы"], "Алишев Java ключевое слово static", "Заур Трегулов static final Java"],
  [12, "Наследование и super", "Повторное использование кода", ["extends", "super", "иерархии классов", "композиция vs наследование"], "Алишев Java наследование", "Заур Трегулов наследование super Java"],
  [13, "Полиморфизм", "Один интерфейс — много реализаций", ["@Override", "upcasting / downcasting", "instanceof", "позднее связывание"], "Алишев Java полиморфизм", "Заур Трегулов полиморфизм Java"],
  [14, "Спринт: мини-проект «Зоопарк»", "Практика ООП-моделирования", ["моделирование предметной области", "иерархия животных", "буферный день"], "Алишев Java ООП практика", "Заур Трегулов ООП задачи Java"],
  [15, "Абстрактные классы", "Частично готовые чертежи", ["abstract class", "abstract методы", "шаблонный метод"], "Алишев Java абстрактные классы", "Заур Трегулов abstract class Java"],
  [16, "Интерфейсы", "Контракты поведения", ["interface", "implements", "default-методы", "множественная реализация"], "Алишев Java интерфейсы", "Заур Трегулов интерфейсы Java"],
  [17, "equals и hashCode", "Контракт сравнения объектов", ["Object", "equals", "hashCode", "контракт equals/hashCode"], "Алишев Java equals hashCode", "Заур Трегулов equals hashCode Java"],
  [18, "String, StringBuilder и toString", "Неизменяемые строки", ["String pool", "immutability", "StringBuilder", "toString"], "Алишев Java String StringBuilder", "Заур Трегулов String pool Java"],
  [19, "Исключения: try / catch / finally", "Обработка ошибок", ["Throwable", "checked vs unchecked", "try / catch / finally", "throw / throws"], "Алишев Java исключения", "Заур Трегулов исключения Java exceptions"],
  [20, "Свои исключения и try-with-resources", "Чистая работа с ресурсами", ["custom exceptions", "try-with-resources", "AutoCloseable"], "Алишев Java собственные исключения", "Заур Трегулов try with resources"],
  [21, "Итоговый проект: «Банковская система»", "ООП на практике", ["счета и клиенты", "переводы", "исключения бизнес-логики"], "Алишев Java ООП проект", "Заур Трегулов ООП практика банковский счёт"],
  // Module 3 outlines (remaining days)
  [22, "Generics", "Обобщённые типы", ["<T>", "bounded types", "wildcards ? extends / ? super"], "Алишев Java generics", "Заур Трегулов generics Java"],
  [24, "LinkedList и сравнение с ArrayList", "Связный список", ["узлы и ссылки", "Big O", "когда что выбирать"], "Алишев Java LinkedList", "Заур Трегулов LinkedList"],
  [25, "Iterator, Comparable и Comparator", "Сортировка и обход", ["Iterator", "Comparable", "Comparator", "ConcurrentModificationException"], "Алишев Java Comparable Comparator", "Заур Трегулов Comparator Iterator"],
  [27, "HashSet, TreeMap, TreeSet", "Множества и упорядоченные структуры", ["Set", "TreeMap", "красно-чёрное дерево", "LinkedHashMap"], "Алишев Java Set HashSet TreeSet", "Заур Трегулов TreeMap TreeSet"],
  [28, "Спринт: «Телефонная книга»", "Практика коллекций", ["Map<String, List<String>>", "поиск и сортировка", "буферный день"], "Алишев Java коллекции практика", "Заур Трегулов коллекции задачи"],
  [29, "Queue, Deque, PriorityQueue", "Очереди и стеки", ["Queue", "ArrayDeque", "PriorityQueue", "стек на Deque"], "Алишев Java Queue очередь", "Заур Трегулов Queue Deque PriorityQueue"],
  [30, "Лямбды и функциональные интерфейсы", "Код как значение", ["лямбда-выражения", "Predicate / Function / Consumer / Supplier", "@FunctionalInterface"], "Алишев Java лямбда выражения", "Заур Трегулов лямбда выражения"],
  [32, "Stream API: reduce, groupingBy, flatMap", "Продвинутые стримы", ["reduce", "Collectors.groupingBy", "flatMap", "sorted / distinct"], "Алишев Java Stream API reduce", "Заур Трегулов stream groupingBy flatMap"],
  [33, "Optional и method references", "Без NullPointerException", ["Optional", "orElse / orElseThrow", "String::length"], "Алишев Java Optional", "Заур Трегулов method reference Optional"],
  [34, "Java Time API", "Даты и время правильно", ["LocalDate", "LocalDateTime", "Duration / Period", "форматирование"], "Java LocalDate LocalDateTime урок", "Заур Трегулов LocalDate Java"],
  [35, "Итоговый проект: «Анализатор заказов»", "Stream API на практике", ["агрегации", "группировки", "отчёты"], "Алишев Java Stream практика", "Заур Трегулов Stream API задачи"],
  // Module 4 — Databases, SQL & Git
  [36, "Введение в базы данных и PostgreSQL", "Установка и первые шаги", ["реляционная модель", "установка PostgreSQL", "psql / DBeaver"], "PostgreSQL для начинающих установка", "Заур Трегулов SQL для начинающих"],
  [37, "DDL: CREATE, ALTER, DROP", "Создаём структуру", ["CREATE TABLE", "типы данных PostgreSQL", "ALTER TABLE"], "SQL DDL CREATE TABLE PostgreSQL урок", "Заур Трегулов SQL CREATE TABLE"],
  [38, "DML: INSERT, UPDATE, DELETE, SELECT", "Работаем с данными", ["INSERT", "UPDATE", "DELETE", "SELECT"], "SQL INSERT UPDATE DELETE PostgreSQL", "Заур Трегулов SQL SELECT"],
  [39, "WHERE, ORDER BY, GROUP BY", "Фильтрация и агрегаты", ["WHERE / LIKE / IN", "ORDER BY", "COUNT / SUM / AVG", "GROUP BY / HAVING"], "SQL GROUP BY HAVING урок", "Заур Трегулов SQL GROUP BY"],
  [40, "JOIN", "Соединяем таблицы", ["INNER JOIN", "LEFT / RIGHT JOIN", "FULL JOIN", "self join"], "SQL JOIN объяснение", "Заур Трегулов SQL JOIN"],
  [41, "Ключи, ограничения и нормализация", "Правильная схема", ["PRIMARY / FOREIGN KEY", "UNIQUE / NOT NULL / CHECK", "1NF–3NF"], "SQL нормализация баз данных", "SQL foreign key primary key урок"],
  [42, "Спринт: схема интернет-магазина", "Проектирование БД", ["ER-диаграмма", "связи 1:N и M:N", "буферный день"], "проектирование базы данных интернет магазин", "ER диаграмма SQL урок"],
  [43, "Индексы и транзакции", "Скорость и надёжность", ["B-tree индексы", "EXPLAIN", "ACID", "уровни изоляции"], "SQL индексы и транзакции ACID", "PostgreSQL EXPLAIN индексы"],
  [44, "JDBC: подключение и Statement", "Java ↔ PostgreSQL", ["DriverManager", "Connection", "ResultSet"], "Алишев JDBC", "Заур Трегулов JDBC"],
  [45, "JDBC: PreparedStatement и DAO", "Безопасные запросы", ["PreparedStatement", "SQL-инъекции", "паттерн DAO"], "Алишев JDBC PreparedStatement DAO", "JDBC SQL injection PreparedStatement"],
  [46, "Maven", "Сборка и зависимости", ["pom.xml", "dependencies", "жизненный цикл сборки"], "Алишев Maven", "Заур Трегулов Maven"],
  [47, "Flyway: миграции", "Версионирование схемы БД", ["V1__init.sql", "flyway migrate", "откаты"], "Flyway миграции Java урок", "Flyway Spring Boot миграции"],
  [48, "Git: основы", "init, commit, история", ["git init / add / commit", "git log / diff", ".gitignore"], "Git для начинающих основы", "Git с нуля commit"],
  [49, "Git: ветки, merge и rebase", "Командная работа", ["branch / checkout / switch", "merge", "rebase", "конфликты"], "Git ветки merge rebase", "Git конфликты слияния"],
  [50, "GitHub и Pull Requests", "Итог модуля", ["remote / push / pull", "Pull Request", "code review"], "GitHub pull request для начинающих", "GitHub для начинающих"],
  // Module 5 — Spring Boot & REST
  [51, "HTTP и REST", "Как общаются клиент и сервер", ["HTTP методы", "коды ответа", "REST принципы", "JSON"], "HTTP REST API для начинающих", "Алишев REST API"],
  [52, "Spring Core: IoC и DI", "Инверсия управления", ["Bean", "ApplicationContext", "@Component", "внедрение через конструктор"], "Алишев Spring IoC DI", "Заур Трегулов Spring IoC DI"],
  [53, "Spring Boot", "Стартеры и автоконфигурация", ["start.spring.io", "starters", "application.yml", "профили"], "Алишев Spring Boot", "Заур Трегулов Spring Boot"],
  [54, "Spring Web: контроллеры", "Первый REST API", ["@RestController", "@GetMapping / @PostMapping", "@PathVariable / @RequestBody"], "Алишев Spring REST контроллер", "Заур Трегулов Spring REST"],
  [55, "DTO, валидация и ошибки", "Чистый контракт API", ["DTO", "@Valid", "@ControllerAdvice", "ResponseEntity"], "Spring Boot валидация ControllerAdvice", "Spring Boot DTO урок"],
  [56, "Spring Data JPA", "Entity и Repository", ["@Entity", "JpaRepository", "derived queries", "@Query"], "Алишев Spring Data JPA", "Заур Трегулов Spring Data JPA"],
  [57, "Hibernate: связи и N+1", "Отношения между сущностями", ["@OneToMany / @ManyToOne", "@ManyToMany", "LAZY / EAGER", "проблема N+1"], "Алишев Hibernate связи", "Заур Трегулов Hibernate OneToMany"],
  [58, "Спринт: CRUD API «Библиотека»", "Полноценный REST-сервис", ["CRUD", "слои controller-service-repository", "буферный день"], "Spring Boot CRUD REST API с нуля", "Spring Boot проект для начинающих"],
  [59, "@Transactional и слои приложения", "Целостность данных", ["@Transactional", "propagation", "архитектура слоёв"], "Spring Transactional объяснение", "Заур Трегулов Spring Transactional"],
  [60, "Тестирование: JUnit 5 и Mockito", "Уверенность в коде", ["JUnit 5", "Mockito", "@SpringBootTest", "@WebMvcTest"], "JUnit 5 Mockito урок", "Spring Boot тестирование"],
  [61, "Spring Security и JWT", "Аутентификация", ["SecurityFilterChain", "пароли и BCrypt", "JWT"], "Алишев Spring Security", "Spring Security JWT урок"],
  [62, "Docker", "Образы и контейнеры", ["image / container", "Dockerfile", "docker build / run"], "Docker для начинающих", "Docker Spring Boot Dockerfile"],
  [63, "Docker Compose", "Приложение + PostgreSQL", ["docker-compose.yml", "сети и volumes", "переменные окружения"], "Docker Compose Spring Boot PostgreSQL", "Docker Compose для начинающих"],
  [64, "Деплой и подготовка к собеседованию", "Путь к офферу", ["резюме Java Junior", "частые вопросы", "деплой на сервер"], "собеседование Java Junior вопросы", "Java Junior собеседование разбор"],
  [65, "Финальный проект: REST API «Task Tracker»", "Портфолио-проект", ["Spring Boot + PostgreSQL + Docker", "README", "деплой"], "Spring Boot pet project с нуля", "Java backend pet проект"],
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
  ...module5Lessons.map((l) => l.day),
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
      difficulty: isSprint ? "Сложный" : mod.id >= 4 ? "Сложный" : "Средний",
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
      difficulty: isSprint ? "Сложный" : mod.id >= 4 ? "Сложный" : "Средний",
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
  ...module1Lessons,
  ...module2Lessons,
  ...module3Lessons,
  ...module4Lessons,
  ...module5Lessons,
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

  const tasks = hasTasks ? l.tasks : [fallbackTask];
  const mainTask = tasks[0];

  return {
    ...l,
    task: mainTask,
    tasks,
    starterCode: l.starterCode || mainTask.starterCode,
    sampleInput: l.sampleInput || mainTask.sampleInput,
    tests: l.tests && l.tests.length > 0 ? l.tests : mainTask.tests,
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
