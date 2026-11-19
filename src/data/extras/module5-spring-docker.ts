import type { LessonExtras } from "../types";
import {
  h, p, code, list, table, tip, warn, info, analogy,
  baeldung, habr, javadoc, book, link,
  JAVA_INTERVIEW_RU, ROADMAP_BACKEND, ROADMAP_JAVA,
} from "./helpers";

const r = String.raw;

export const module5SpringDockerExtras: Record<number, LessonExtras> = {
  /* ================================================================== */
  /*  DAY 69 — HTTP и архитектура REST API                              */
  /* ================================================================== */
  69: {
    deepDive: [
      h("Как общается современный веб: протокол HTTP и JSON"),
      p("Ваш Spring Boot бэкенд не рисует кнопки на экране — с ними работают фронтенд (React), мобильные приложения (iOS/Android) и другие сервисы. Все они общаются с бэкендом по протоколу **HTTP/HTTPS** (запрос **Request** → ответ **Response**), обмениваясь структурированными текстовыми данными в формате **JSON**."),
      h("HTTP-методы, безопасность и идемпотентность (частый вопрос собесов!)"),
      p("**Идемпотентность** — свойство запроса, при котором **10 одинаковых повторов оставляют сервер в том же состоянии, что и 1 вызов** (критично при обрыве Wi-Fi и повторной отправке!)."),
      table(
        ["Метод", "CRUD роль", "Идемпотентный?", "Пример REST URL"],
        ["**`GET`**", "Чтение данных (без тела)", "✅ Да (и безопасный: ничего не меняет)", "`GET /api/v1/books/42`"],
        ["**`POST`**", "Создание нового ресурса", "❌ **Нет!** (3 одинаковых POST создадут 3 разных заказа!)", "`POST /api/v1/orders`"],
        ["**`PUT`**", "Полная замена/перезапись ресурса", "✅ Да (заменяет ресурс целиком на новый)", "`PUT /api/v1/books/42`"],
        ["**`PATCH`**", "Частичное обновление (напр., только цены)", "⚠️ Обычно нет / зависит от реализации", "`PATCH /api/v1/books/42`"],
        ["**`DELETE`**", "Удаление ресурса", "✅ Да (состояние сервера: ресурса больше нет)", "`DELETE /api/v1/books/42`"],
      ),
      h("Главные HTTP статус-коды, которые должен знать каждый Junior"),
      table(
        ["Диапазон / Код", "Значение и когда возвращать"],
        ["`200 OK`", "Успешный `GET`, `PUT` или бизнес-операция с телом ответа"],
        ["`201 Created`", "Успешно создан **новый ресурс** (на `POST`) + обычно заголовок `Location`"],
        ["`204 No Content`", "Успех без тела ответа (идеально для `DELETE`)"],
        ["`400 Bad Request`", "Ошибка клиента: невалидный JSON, пустое обязательное поле"],
        ["`401 Unauthorized`", "Клиент **не аутентифицирован** (нет/истёк JWT-токен или неверный пароль)"],
        ["`403 Forbidden`", "Клиент известен, но **нет прав доступа** (студент стучится в админку)"],
        ["`404 Not Found`", "Запрошенный ресурс (например, `/books/9999`) не найден в БД"],
        ["`409 Conflict`", "Конфликт состояния (регистрация с уже занятым email)"],
        ["`500 Internal Server Error`", "Необработанное падение на стороне сервера (баг/упала БД)"],
      ),
      h("6 принципов REST и правила красивых URL"),
      list(
        "**Stateless (без сохранения состояния):** сервер НЕ помнит предыдущие запросы в памяти между вызовами — каждый запрос несёт в себе все нужные данные (например, JWT-токен).",
        "**Ресурсы — существительные во множественном числе:** используйте `DELETE /api/users/5`, а НЕ глаголы в URL вроде `GET /api/deleteUser?id=5`!",
      ),
      code(r`
// В Main.java можно потренироваться формировать валидный JSON и HTTP-ответ:
public class Main {
    public static void main(String[] args) {
        int status = 201;
        String jsonBody = """
                {
                  "id": 101,
                  "title": "Effective Java",
                  "status": "CREATED"
                }
                """;
        System.out.println("HTTP/1.1 " + status + " Created\nContent-Type: application/json\n\n" + jsonBody);
    }
}`, "Анатомия HTTP-ответа с JSON в Main.java"),
      warn("Разница между 401 и 403", "На каждом втором собеседовании путают: **401 Unauthorized** на самом деле означает *«Кто ты? Авторизуйся / войди!»* (Authentication), а **403 Forbidden** — *«Я знаю кто ты, но сюда тебе нельзя!»* (Authorization)."),
      tip("Задание в песочнице справа", "Смоделируйте в `Main.java` простой роутер `handleRequest(String method, String path)`: при `GET /books` верните статус `200`, при `POST /books` — `201`, при `DELETE /books/1` — `204`, а для неизвестного пути — `404`!"),
    ],
    interview: [
      { q: "Какие HTTP методы считаются идемпотентными и почему POST не относится к ним?", a: "Идемпотентны `GET`, `PUT`, `DELETE`, `HEAD`, `OPTIONS` — повторное выполнение запроса оставляет состояние сервера неизменным. `POST` не идемпотентен, так как повторная отправка `POST /orders` создаст дубликат заказа (для защиты от дублей используют `Idempotency-Key`)." },
      { q: "В чём разница между HTTP статусами 401 и 403?", a: "`401 Unauthorized` — пользователь не прошёл аутентификацию (невалидный/отсутствующий токен). `403 Forbidden` — пользователь аутентифицирован, но у его роли недостаточно прав для данного ресурса." },
      { q: "Что означает принцип Stateless в архитектуре REST API?", a: "Сервер не хранит состояние клиентской сессии между запросами; каждый HTTP-запрос полностью самодостаточен (идентификация передаётся в заголовке `Authorization` с каждым запросом), благодаря чему сервис легко масштабируется горизонтально на десятки серверов." },
    ],
    selfStudy: [
      "Открой DevTools в браузере (F12 → вкладка Network) на любом сайте и рассмотри реальные заголовки `Request Headers` и `Response Headers`.",
      "Установи бесплатный клиент **Postman** или **Insomnia** для тестирования HTTP API.",
      "Изучи разницу между `PUT` (полная замена ресурса) и `PATCH` (точечное изменение нескольких полей).",
    ],
    resources: [
      baeldung("spring-rest-api-metrics", "Baeldung: REST API Concepts & Best Practices"),
      link("docs", "MDN: Обзор HTTP и статус-кодов", "https://developer.mozilla.org/ru/docs/Web/HTTP/Overview", "Отличный справочник по HTTP на русском", "ru"),
      ROADMAP_BACKEND,
    ],
  },

  /* ================================================================== */
  /*  DAY 70 — Spring Core: IoC и Dependency Injection                  */
  /* ================================================================== */
  70: {
    deepDive: [
      h("Проблема жёсткой связности (Tight Coupling) и философия IoC"),
      p("Представьте `class OrderService`, который внутри себя делает `private EmailSender sender = new EmailSender();`. Теперь, чтобы протестировать `OrderService` или заменить отправку писем на Telegram-уведомления, придётся лезть и переписывать код внутри `OrderService`! **IoC (Inversion of Control — инверсия управления)** переворачивает схему: класс больше сам ничего не создаёт через `new` — за созданием, связыванием и жизненным циклом объектов следит специальный **Spring IoC-контейнер (`ApplicationContext`)**."),
      analogy("Ресторан и официант вместо самостоятельной готовки", "Вместо того чтобы гость сам бежал на ферму за помидорами (`new Repository()`), он просто садится за столик и говорит: «Мне нужна зависимость `UserRepository`». Шеф-повар (Spring Container) сам всё подготавливает и подаёт готовый объект (**Dependency Injection**)."),
      h("Что такое Bean (Бин) и основные стереотипные аннотации"),
      p("**Spring Bean** — это обычный Java-объект, которым управляет Spring-контейнер. Чтобы Spring сам нашёл класс при старте (Component Scan) и создал его бин, ставят одну из аннотаций:"),
      table(
        ["Аннотация", "Слой архитектуры", "Особое поведение"],
        ["`@Component`", "Универсальный компонент/утилита", "Базовая аннотация регистрации бина"],
        ["`@Service`", "Слой бизнес-логики", "Специализация `@Component` (улучшает читаемость)"],
        ["`@Repository`", "Слой работы с БД (DAO)", "Автоматически переводит сырые `SQLException` в spring `DataAccessException`!"],
        ["`@RestController`", "Веб-слой (HTTP API)", "Регистрирует контроллер для обработки HTTP-запросов"],
        ["`@Bean` (в `@Configuration`)", "Метод-фабрика внутри конфиг-класса", "Используется для подключения **чужих классов из библиотек** (`PasswordEncoder`, `ObjectMapper`)"],
      ),
      h("3 способа Dependency Injection: почему выбирают Constructor DI!"),
      p("Внедрить зависимость можно в поле (`@Autowired private Repo repo;`), через сеттер или **через конструктор**. Официальная документация Spring рекомендует **строго Constructor Injection** (причём если у класса один конструктор, писать `@Autowired` даже не обязательно!):"),
      list(
        "**Иммутабельность (`final`):** Поле можно объявить `private final` — зависимость никогда не исчезнет в рантайме.",
        "**Легко тестировать без Spring:** В JUnit вы просто делаете `new OrderService(mockRepo)` без рефлексии и старта контейнера.",
        "**Защита от `NullPointerException` и быстрое обнаружение циклических зависимостей** (`A` зависит от `B`, а `B` от `A`).",
      ),
      code(r`
interface Notifier { void send(String msg); }

class EmailNotifier implements Notifier {
    @Override public void send(String msg) { System.out.println("[EMAIL] " + msg); }
}

// С Constructor Injection класс OrderService НЕ зависит от конкретной реализации!
class OrderService {
    private final Notifier notifier; // В идеале внедряем интерфейс (принцип D из SOLID)

    OrderService(Notifier notifier) { // Spring IoC сам передаст сюда бин при запуске!
        this.notifier = notifier;
    }

    public void completeOrder(long id) {
        notifier.send("Заказ #" + id + " оформлен!");
    }
}

public class Main {
    public static void main(String[] args) {
        // Имитация работы IoC-контейнера: создаём зависимости и "вкалываем" их в конструктор:
        Notifier bean = new EmailNotifier();
        OrderService service = new OrderService(bean);
        service.completeOrder(42);
    }
}`, "Constructor Dependency Injection в действии (Main.java)"),
      h("Bean Scopes (Области видимости бинов)"),
      table(
        ["Scope", "Сколько объектов создаётся", "Когда применять"],
        ["**`singleton`** *(по умолчанию!)*", "Ровно **1 экземпляр** на весь Spring `ApplicationContext`", "99% всех `@Service`, `@Repository`, `@Controller` (должны быть stateless!)"],
        ["`prototype`", "Новый объект создаётся **каждый раз** при обращении к контейнеру", "Объекты с уникальным изменяемым состоянием на каждую задачу"],
        ["`request` / `session`", "1 на HTTP-запрос / 1 на веб-сессию пользователя", "Веб-специфичные контекстные данные"],
      ),
      warn("Ловушка многопоточности в Singleton-бинах!", "Поскольку все `@Service` по умолчанию **`singleton`**, 1000 пользователей одновременно вызывают один и тот же экземпляр объекта в разных потоках! Никогда не храните пользовательские данные (`currentUser`, `orderSum`) в полях класса `@Service` — используйте локальные переменные внутри методов!"),
      tip("Задание в песочнице справа", "Создайте вторую реализацию `SmsNotifier implements Notifier` в `Main.java` и переключите поведение `OrderService`, передав в его конструктор новый объект без единого изменения внутри самого класса `OrderService`!"),
    ],
    interview: [
      { q: "В чём разница между понятиями IoC (Inversion of Control) и DI (Dependency Injection)?", a: "IoC — это общий архитектурный принцип (управление созданием объектов и потоком выполнения передаётся внешнему фреймворку/контейнеру вместо самого кода). DI — это конкретный паттерн реализации IoC, при котором контейнер «внедряет» нужные зависимости в класс извне (через конструктор, сеттер или поле)." },
      { q: "Почему команда Spring настоятельно рекомендует внедрение через конструктор, а не `@Autowired` над полем?", a: "1) Позволяет делать поля `private final` (неизменяемость); 2) Гарантирует, что объект не может быть создан в неполном состоянии без зависимостей; 3) Упрощает unit-тестирование без поднятия Spring-контекста; 4) Явно сигнализирует, если у класса слишком много зависимостей (пора рефакторить)." },
      { q: "Какой Scope у Spring Bean по умолчанию и что нужно помнить о его полях?", a: "По умолчанию scope — **`singleton`** (один экземпляр на весь `ApplicationContext`). Поэтому бины не должны хранить изменяемое состояние конкретного клиента в своих полях (должны быть stateless), иначе возникнет гонка потоков." },
      { q: "Как Spring разруливает ситуацию, если у одного интерфейса `Notifier` есть 2 бина-реализации?", a: "По умолчанию Spring выбросит `NoUniqueBeanDefinitionException`. Решается аннотациями `@Primary` (выбор по умолчанию), `@Qualifier(\"beanName\")` (точное указание имени нужного бина) либо внедрением `List<Notifier>`." },
    ],
    selfStudy: [
      "Посмотри жизненный цикл Spring Bean: `@PostConstruct` (инициализация сразу после DI) и `@PreDestroy` (очистка перед остановкой сервера).",
      "Узнай, как Spring решает проблему внедрения бина со scope `prototype` внутрь `singleton` (`@Lookup` или `ObjectProvider`).",
      "Познакомься с интерфейсом `ApplicationContext` в Spring.",
    ],
    resources: [
      baeldung("inversion-control-and-dependency-injection-in-spring", "Baeldung: IoC and Dependency Injection in Spring"),
      baeldung("spring-bean-scopes", "Baeldung: Guide to Spring Bean Scopes"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 71 — Spring Boot: стартеры и конфигурация                     */
  /* ================================================================== */
  71: {
    deepDive: [
      h("От боли «классического Spring» к магии Spring Boot"),
      p("Раньше, чтобы запустить веб-сервер на Spring, разработчики писали сотни строк XML-файлов, вручную настраивали Tomcat, пул соединений, парсер Jackson и боролись с несовместимыми версиями библиотек. **Spring Boot** появился по принципу **Convention over Configuration** (соглашение важнее ручной настройки): за 3 минуты на **`start.spring.io`** вы получаете готовый сервис со встроенным веб-сервером Tomcat и автоконфигурацией!"),
      h("Три главных столпа Spring Boot"),
      list(
        "**1. Стартеры (`spring-boot-starter-*`):** Готовые «наборы» совместимых зависимостей (например, `spring-boot-starter-web` сам подтянет Spring MVC, JSON-парсер Jackson и встроенный сервер Tomcat без конфликтов версий).",
        "**2. Автоконфигурация (`@SpringBootApplication`):** Spring Boot сканирует ваши подключённые библиотеки в classpath: увидел драйвер PostgreSQL + настройки в `application.yml` → **сам автоматически поднял** пул подключений HikariCP и JPA!",
        "**3. Встроенный сервер (Embedded Tomcat/Jetty/Undertow):** Приложение упаковывается в единый **Fat JAR** и запускается простой командой `java -jar app.jar`.",
      ),
      h("Что на самом деле скрывает аннотация @SpringBootApplication?"),
      table(
        ["Внутренняя аннотация", "Роль при старте приложения"],
        ["`@SpringBootConfiguration`", "Помечает главный класс как источник конфигурации бинов (`@Configuration`)"],
        ["`@EnableAutoConfiguration`", "Включает умную автоконфигурацию стартеров по зависимостям в classpath"],
        ["`@ComponentScan`", "Сканирует текущий пакет и **все вложенные подпакеты** в поисках `@Service`, `@Repository`, `@RestController`!"],
      ),
      h("Конфигурация application.yml и Spring Profiles (dev vs prod)"),
      p("Настройки приложения (порт сервера, строка подключения к БД, логирование) хранятся в **`src/main/resources/application.yml`** (или `.properties`). Секреты никогда не вшивают жёстко в файл — подставляют через переменные окружения **`${DB_PASS}`**! А с помощью профилей (**`application-dev.yml`**, **`application-prod.yml`**) можно переключать настройки локальной разработки и продакшена одной переменной `SPRING_PROFILES_ACTIVE=prod`."),
      code(`
# Файл: src/main/resources/application.yml
server:
  port: 8080

spring:
  application:
    name: javaforge-api
  profiles:
    active: \${SPRING_PROFILES_ACTIVE:dev} # По умолчанию включается dev!
  datasource:
    url: jdbc:postgresql://\${DB_HOST:localhost}:5432/shop_db
    username: \${DB_USER:postgres}
    password: \${DB_PASS:secret}
`, "Структура application.yml с подстановкой переменных окружения"),
      code(`
// В Java-коде значения из YAML считывают через @Value или @ConfigurationProperties:
// @Value("\${server.port}") private int port;

// Имитация загрузки профилей и env-переменных в Main.java:
public class Main {
    public static void main(String[] args) {
        String activeProfile = System.getenv().getOrDefault("SPRING_PROFILE", "dev");
        int port = "prod".equals(activeProfile) ? 80 : 8080;
        System.out.println("Spring Boot стартует в профиле [" + activeProfile + "] на порту " + port);
    }
}`, "Имитация переключения профилей Spring Boot в Main.java"),
      warn("Ловушка размещения главного класса Application!", "Поскольку `@ComponentScan` сканирует **только пакет главного класса и его подпакеты**, файл `DemoApplication.java` ОБЯЗАН лежать в **корневом пакете** проекта (например, `com.example.shop`), а `controller`, `service`, `repository` — внутри него (`com.example.shop.service`), иначе Spring просто «не увидит» ваши контроллеры!"),
      tip("Задание в песочнице справа", "Зайдите в свободное время на `start.spring.io` (Spring Initializr), соберите шаблон проекта с зависимостями Web, Data JPA, PostgreSQL, Flyway и посмотрите структуру сгенерированного `pom.xml`!"),
    ],
    interview: [
      { q: "Какие 3 аннотации объединяет в себе `@SpringBootApplication`?", a: "`@SpringBootConfiguration`, `@EnableAutoConfiguration` и `@ComponentScan`." },
      { q: "Что такое Spring Boot Starter и зачем они нужны?", a: "Преднастроенные дескрипторы зависимостей (например, `spring-boot-starter-web`, `spring-boot-starter-data-jpa`), объединяющие проверенные на совместимость библиотеки под конкретную задачу, избавляя от ручного подбора десятков версий." },
      { q: "Как в Spring Boot безопасно настроить разные параметры для разработки (dev) и продакшена (prod)?", a: "Через **Spring Profiles**: создают файлы `application-dev.yml` и `application-prod.yml`, переключая их через `spring.profiles.active` (или env-переменную `SPRING_PROFILES_ACTIVE`), а пароли и URL передают через переменные окружения `${DB_PASS}`." },
    ],
    selfStudy: [
      "Сгенерируй проект на `start.spring.io` (Java 21, Maven, Spring Boot 3.x, Web) и открой в IntelliJ IDEA.",
      "Узнай про удобный и типобезопасный способ маппинга настроек — `@ConfigurationProperties(prefix = \"app\")` вместо множества `@Value`.",
      "Познакомься со Spring Boot Actuator (`/actuator/health`) для мониторинга состояния продакшен-сервиса.",
    ],
    resources: [
      link("tool", "Spring Initializr (start.spring.io)", "https://start.spring.io/", "Официальный генератор Spring Boot проектов", "en"),
      baeldung("spring-boot-application-annotation", "Baeldung: The @SpringBootApplication Annotation"),
      baeldung("spring-profiles", "Baeldung: Spring Profiles Guide"),
    ],
  },

  /* ================================================================== */
  /*  DAY 72 — Spring Web: создание REST контроллеров                   */
  /* ================================================================== */
  72: {
    deepDive: [
      h("Слой веб-контроллеров: точка входа HTTP-запросов в приложение"),
      p("Контроллер — это «ресепшен» вашего бэкенда. Он принимает входящий HTTP-запрос от клиента, вытаскивает параметры (из пути URL, query-параметров или JSON-тела), вызывает соответствующий метод сервисного слоя (`@Service`) и упаковывает ответ в JSON с нужным HTTP-статусом!"),
      h("@Controller vs @RestController — ключевое отличие"),
      p("Классический `@Controller` возвращает имя HTML-шаблона (Thymeleaf/JSP). В современных REST API используют **`@RestController`**, который объединяет `@Controller` и **`@ResponseBody`**: любые возвращаемые Java-объекты автоматически превращаются библиотекой **Jackson** в JSON прямо в теле ответа!"),
      h("Как достать данные из HTTP-запроса: 3 главные аннотации"),
      table(
        ["Аннотация", "Откуда берёт данные", "Пример HTTP-запроса и метода Java"],
        ["**`@PathVariable`**", "Прямо из сегмента пути URL (`/books/42`)", "`@GetMapping(\"/{id}\") public Book get(@PathVariable Long id)`"],
        ["**`@RequestParam`**", "Из параметров после `?` (`/books?author=Bloch&page=0`)", "`@GetMapping public List<Book> find(@RequestParam(required=false) String author)`"],
        ["**`@RequestBody`**", "Из JSON-тела запроса `POST` / `PUT`", "`@PostMapping public Book create(@RequestBody CreateBookDto dto)`"],
      ),
      h("Полный пример REST-контроллера с ResponseEntity<T>"),
      p("Обёртка **`ResponseEntity<T>`** даёт полный контроль над ответом: она позволяет задать не только тело JSON, но и конкретный HTTP-статус (`201 Created`, `404 Not Found`, `204 No Content`) и собственные HTTP-заголовки."),
      code(r`
@RestController
@RequestMapping("/api/v1/books") // Общий базовый префикс URL для всех методов
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) { // Constructor Injection!
        this.bookService = bookService;
    }

    @GetMapping("/{id}") // GET /api/v1/books/10
    public ResponseEntity<BookDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.findById(id));
    }

    @GetMapping // GET /api/v1/books?limit=10
    public List<BookDto> getAll(@RequestParam(defaultValue = "20") int limit) {
        return bookService.findAll(limit);
    }

    @PostMapping // POST /api/v1/books + JSON body
    public ResponseEntity<BookDto> create(@RequestBody CreateBookDto dto) {
        BookDto created = bookService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created); // 201 Created!
    }

    @DeleteMapping("/{id}") // DELETE /api/v1/books/10 -> 204 No Content
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}`, "Чистый CRUD REST-контроллер на Spring Web"),
      warn("Не пишите SQL и бизнес-логику прямо в @RestController!", "Контроллер должен быть максимально «тонким»: только принять HTTP-запрос, провалидировать входные данные, передать их в `@Service` и красиво отдать `ResponseEntity`."),
      code(r`
import java.util.*;

// Имитация маршрутизации @RestController в Main.java:
public class Main {
    public static void main(String[] args) {
        Map<Long, String> books = new HashMap<>(Map.of(1L, "Clean Code", 2L, "Effective Java"));
        long pathId = 2L;
        System.out.println("GET /api/v1/books/" + pathId + " -> 200 OK: " + books.get(pathId));
    }
}`, "Имитация @GetMapping(\"/{id}\") в Main.java"),
      tip("Задание в песочнице справа", "Смоделируйте в `Main.java` класс-контроллер `MockBookController` с методами `getById(long id)`, `create(String title)` и `delete(long id)` поверх `Map<Long, String>`, возвращая коды 200 / 201 / 204 / 404!"),
    ],
    interview: [
      { q: "В чём разница между `@Controller` и `@RestController`?", a: "`@RestController` — это мета-аннотация, включающая `@Controller` и `@ResponseBody`. Обычный `@Controller` возвращает имя View-шаблона (HTML), а `@RestController` сразу сериализует возвращаемый объект в JSON/XML в тело HTTP-ответа (через Jackson HttpMessageConverter)." },
      { q: "Когда использовать `@PathVariable`, а когда `@RequestParam`?", a: "`@PathVariable` вытаскивает обязательный идентификатор конкретного ресурса прямо из URL (`/users/{id}`). `@RequestParam` читает query-параметры после `?` (`/users?role=admin&page=1`) и хорошо подходит для фильтрации, сортировки и пагинации." },
      { q: "Зачем возвращать `ResponseEntity<T>`, если можно вернуть просто `T`?", a: "`ResponseEntity<T>` позволяет динамически управлять HTTP статус-кодом (например, `201 Created` или `204 No Content`) и добавлять кастомные HTTP-заголовки ответа." },
    ],
    selfStudy: [
      "Познакомься с библиотекой **Swagger / OpenAPI (`springdoc-openapi`)**, которая сама генерирует интерактивную веб-документацию по всем вашим `@RestController`!",
      "Узнай, как библиотека **Jackson** превращает Java-объекты и `record` в JSON и зачем нужны геттеры или `@JsonProperty`.",
      "Разберись с `@CrossOrigin` (CORS), когда к вашему Spring Boot API обращается браузер с другого порта (например, React на localhost:3000).",
    ],
    resources: [
      baeldung("spring-controller-vs-restcontroller", "Baeldung: @Controller vs @RestController"),
      baeldung("building-a-restful-web-service-with-spring", "Baeldung: REST API with Spring"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 73 — DTO, валидация и @ControllerAdvice                       */
  /* ================================================================== */
  73: {
    deepDive: [
      h("Почему КАТЕГОРИЧЕСКИ нельзя отдавать @Entity базы данных в REST API?"),
      p("Новички часто принимают и возвращают из контроллера сам класс базы данных (`@Entity User`). Это приводит к 4 серьёзным проблемам: 1) **Утечка секретов** (`passwordHash` попадёт в JSON ответа!); 2) **Манипуляция полями** (клиент сможет прислать `{\"role\": \"ADMIN\", \"balance\": 999999}` в JSON регистрации!); 3) Падения Hibernate `LazyInitializationException` и бесконечная рекурсия JSON при двусторонних связях; 4) Жёсткая привязка внешнего контракта к схеме БД."),
      p("Решение: паттерн **DTO (Data Transfer Object)** — отдельные лёгкие объекты (в Java 17+ идеально подходят **`record`**!) отдельно для входящего запроса (`CreateUserRequest`) и исходящего ответа (`UserResponse`)."),
      analogy("Таможенная декларация на границе API", "Внутри ресторана/завода (`@Entity`) хранятся внутренние секретные рецепты, закупочная себестоимость и пароли. Наружу клиенту отдают только аккуратное меню (`ResponseDTO`), а от клиента принимают строго проверенный бланк заказа (`RequestDTO`), исключая лишние поля!"),
      h("Декларативная валидация (Bean Validation + @Valid)"),
      p("Вместо 15 ручных `if (dto.email() == null || !dto.email().contains(\"@\"))` в контроллере достаточно поставить аннотацию **`@Valid`** перед `@RequestBody` и описать правила аннотациями прямо на полях DTO:"),
      table(
        ["Аннотация валидации", "Что проверяет"],
        ["`@NotNull`", "Поле не равно `null`"],
        ["`@NotBlank`", "Строка не `null`, не пустая и содержит хотя бы 1 не-пробельный символ!"],
        ["`@Size(min = 3, max = 50)`", "Длина строки или размер коллекции"],
        ["`@Email`", "Корректность формата email"],
        ["`@Positive` / `@Min(1)`", "Число строго больше 0 / не меньше указанного"],
      ),
      h("Глобальный перехват ошибок: @RestControllerAdvice"),
      p("Если клиент отправит невалидный JSON или запросит несуществующий ID, приложение не должно отдавать ужасный стектрейс Tomcat (код 500)! Класс с аннотацией **`@RestControllerAdvice`** централизованно перехватывает исключения из **всех контроллеров сразу** и возвращает аккуратный JSON с кодом `400` или `404`:"),
      code(r`
// 1. DTO с валидацией (Java 17+ record идеально подходит для DTO!):
public record CreateUserRequest(
    @NotBlank(message = "Имя обязательно") @Size(min = 2, max = 50) String username,
    @NotBlank @Email(message = "Некорректный email") String email,
    @Size(min = 8, message = "Пароль минимум 8 символов") String password
) {}

// 2. Глобальный обработчик исключений (единый формат ошибок для всего API):
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(404, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(new ErrorResponse(400, msg));
    }
}`, "DTO на базе record + валидация + @RestControllerAdvice"),
      code(r`
// В Main.java проверим паттерн скрытия чувствительных полей через Entity -> Response DTO:
record UserEntity(long id, String email, String passwordHash, String role) {}
record UserResponseDto(long id, String email) {} // Без passwordHash и внутренней роли!

public class Main {
    public static void main(String[] args) {
        UserEntity dbUser = new UserEntity(1L, "ali@java.ru", "$2a$10$SECRET_HASH", "ADMIN");
        UserResponseDto safeResponse = new UserResponseDto(dbUser.id(), dbUser.email());
        System.out.println("Безопасный ответ API: " + safeResponse);
    }
}`, "Преобразование Entity -> Safe DTO в Main.java"),
      tip("Задание в песочнице справа", "Создайте в `Main.java` два класса `CreateProductDto` и `ProductResponse`, добавьте метод-валидатор, собирающий список ошибок полей в `Map<String, String>` (имитируя `MethodArgumentNotValidException`), и верните код `400` при ошибке!"),
    ],
    interview: [
      { q: "Зачем в REST API используют DTO вместо прямого возврата `@Entity`?", a: "1) Безопасность (исключаем утечку паролей/токенов и подмену защищённых полей при вводе — Mass Assignment vulnerability); 2) Разделение контракта API и структуры БД (можно менять таблицы без поломки клиентов); 3) Защита от `LazyInitializationException` и бесконечной рекурсии Jackson при двусторонних связях JPA." },
      { q: "В чём разница между `@NotNull`, `@NotEmpty` и `@NotBlank`?", a: "`@NotNull` запрещает только `null` (пропустит `\"\"`). `@NotEmpty` запрещает `null` и пустую строку/коллекцию (но пропустит пробелы `\"   \"`). `@NotBlank` работает только со строками и требует минимум один не-пробельный символ." },
      { q: "Как работает глобальная обработка ошибок через `@RestControllerAdvice`?", a: "Spring AOP перехватывает необработанные исключения из любого `@RestController`, ищет подходящий метод с `@ExceptionHandler(ExceptionClass.class)` и преобразует его ответ в аккуратный JSON с нужным HTTP-статусом." },
    ],
    selfStudy: [
      "Познакомься с библиотекой **MapStruct** — она генерирует быстрый код маппинга `Entity <-> DTO` прямо на этапе компиляции без медленной рефлексии.",
      "Узнай о стандарте **RFC 7807 (`ProblemDetail`)** для единообразных JSON-ответов об ошибках, встроенном в Spring Boot 3!",
      "Поэкспериментируй с аннотацией `@JsonIgnore` и разберись, почему отдельный DTO надёжнее `@JsonIgnore`.",
    ],
    resources: [
      baeldung("entity-to-and-from-dto-for-a-java-spring-application", "Baeldung: Entity To DTO Conversion"),
      baeldung("spring-boot-bean-validation", "Baeldung: Validation in Spring Boot"),
      baeldung("exception-handling-for-rest-with-spring", "Baeldung: Error Handling with @ControllerAdvice"),
    ],
  },

  /* ================================================================== */
  /*  DAY 74 — Spring Data JPA: сущности и репозитории                  */
  /* ================================================================== */
  74: {
    deepDive: [
      h("Что такое ORM и Spring Data JPA: работа с БД в стиле ООП"),
      p("Писать вручную десятки однотипных `INSERT INTO ...`, маппить 20 колонок `rs.getString(...)` в объект для каждой таблицы скучно и чревато опечатками. **ORM (Object-Relational Mapping)** связывает Java-классы с таблицами базы данных: стандарт **JPA** задаёт правила и аннотации (`@Entity`, `@Id`, `@Table`), **Hibernate** реализует сам движок преобразования Java ↔ SQL, а **Spring Data JPA** убирает вообще весь шаблонный код DAO!"),
      analogy("Переводчик между миром Java-объектов и реляционных таблиц", "В Java данные живут в графах объектов со ссылками (`User -> List<Order>`), а в PostgreSQL — в плоских строках таблиц со внешними ключами. Hibernate выступает в роли синхронного переводчика, превращая методы Java в SQL и строки `ResultSet` в готовые объекты."),
      h("Аннотации JPA-сущности (@Entity) и важные правила"),
      list(
        "**`@Entity` и `@Table(name = \"products\")`**: связывают класс с конкретной таблицей PostgreSQL.",
        "**`@Id` + `@GeneratedValue(strategy = GenerationType.IDENTITY)`**: первичный ключ с автоинкрементом БД.",
        "**Пустой конструктор (`protected Product() {}`) обязателен для Hibernate** — он создаёт объекты при чтении из БД через рефлексию.",
        "**Никогда не ставьте Lombok `@Data` на JPA `@Entity`!** Автогенерируемые `toString()`, `equals()` и `hashCode()` в `@Data` тянут все ленивые связи и ломают `HashSet`/производительность! Определяйте `equals/hashCode` осторожно (или по business key / id).",
      ),
      h("Магия JpaRepository: как работают Derived Queries и @Query"),
      p("Достаточно объявить **интерфейс**, унаследованный от `JpaRepository<Product, Long>` — и Spring при старте **сам сгенерирует рабочий класс реализации**! Более того, по одному названию метода (**Derived Query**) Spring сам сгенерирует нужный SQL-запрос:"),
      code(r`
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    protected Product() {} // Обязательный конструктор для JPA
    // Геттеры, сеттеры...
}

public interface ProductRepository extends JpaRepository<Product, Long> {
    // 1. Derived Query — Spring сам построит: WHERE LOWER(title) LIKE LOWER('%...%')
    List<Product> findByTitleContainingIgnoreCase(String keyword);

    // 2. Пагинация из коробки!
    Page<Product> findByPriceGreaterThan(BigDecimal minPrice, Pageable pageable);

    // 3. Явный JPQL-запрос (по именам Java-класса и полей, а не таблицы!):
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max ORDER BY p.price ASC")
    List<Product> findInPriceRange(@Param("min") BigDecimal min, @Param("max") BigDecimal max);
}`, "JPA @Entity + Spring Data JpaRepository с Derived Query и @Query"),
      h("4 состояния сущности в жизненном цикле Hibernate (Entity States)"),
      table(
        ["Состояние", "Что значит для Persistence Context"],
        ["**Transient (Новый)**", "Создан через `new Product()`, база о нём ничего не знает."],
        ["**Managed / Persistent (Управляемый)**", "Загружен в текущей транзакции или передан в `save()`. **Любое изменение сеттером `p.setPrice(...)` Hibernate сохранит в БД автоматически при `COMMIT` (Dirty Checking!)** даже без повторного вызова `save()`!"],
        ["**Detached (Отсоединённый)**", "Транзакция закрылась — изменения объекта больше не уходят в базу."],
        ["**Removed (Удалённый)**", "Помечен к удалению (`delete()`), удалится при коммите."],
      ),
      h("Как работает save() под капотом: INSERT (persist) или UPDATE (merge)?"),
      p("Если у сущности поле `@Id` равно `null` (новый объект), вызов `repository.save(entity)` вызывает `EntityManager.persist()` (выполнит `INSERT`). Если `id` уже заполнен (отсоединённый объект), `save()` делает `EntityManager.merge()` — сначала грузит текущую запись из БД (`SELECT`) и затем обновляет поля (`UPDATE`)."),
      tip("Задание в песочнице справа", "Смоделируйте в `Main.java` логику простого `DerivedQuery` парсера или `Dirty Checking`: сохраните начальный «снимок» полей объекта при открытии сессии и при коммите определите, какие поля изменились, сгенерировав для них только нужный `UPDATE`!"),
    ],
    interview: [
      { q: "В чём разница между JPA, Hibernate и Spring Data JPA?", a: "**JPA** — это только спецификация (набор стандартов и аннотаций в Java, без реализации). **Hibernate** — самая популярная реализация стандарта JPA (ORM-движок). **Spring Data JPA** — надстройка над JPA, которая убирает шаблонный код работы с `EntityManager`, предоставляя готовые интерфейсы `JpaRepository`, пагинацию и генерацию запросов по именам методов." },
      { q: "Что такое механизм Dirty Checking в Hibernate?", a: "Внутри транзакции все загруженные Entity находятся в состоянии Managed и отслеживаются контекстом постоянства (1st Level Cache). Перед коммитом Hibernate сравнивает текущие поля объекта с исходным снимком — если что-то изменилось, автоматически генерирует SQL `UPDATE` без явного вызова `repository.save()`." },
      { q: "Почему не рекомендуется вешать Lombok `@Data` на `@Entity` классы?", a: "`@Data` включает `@ToString` (вызовет обращение ко всем ленивым полям и приведёт к `LazyInitializationException` или лишним SQL-запросам) и `@EqualsAndHashCode` по всем полям, включая сгенерированный `id`, что нарушает контракт `equals/hashCode` при переходе объекта из Transient (`id == null`) в Managed (`id = 1`)." },
    ],
    selfStudy: [
      "Узнай разницу между JPQL (запросы по именам Java Entity классов) и Native SQL (`nativeQuery = true`).",
      "Познакомься с DTO-проекциями (Interface-based & Class-based projections) в Spring Data JPA — чтобы SELECT вытаскивал из базы только 2 нужные колонки вместо всей таблицы.",
      "Разберись, как работает Кэш 1-го уровня (Persistence Context) в рамках одной транзакции.",
    ],
    resources: [
      baeldung("the-persistence-layer-with-spring-data-jpa", "Baeldung: Guide to Spring Data JPA"),
      baeldung("jpa-entity-lifecycle-events", "Baeldung: Hibernate Entity Lifecycle"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 75 — Hibernate: связи сущностей и проблема N+1                */
  /* ================================================================== */
  75: {
    deepDive: [
      h("Отображение связей таблиц в JPA: @ManyToOne, @OneToMany и @ManyToMany"),
      p("В объектах Java нет внешних ключей `long authorId` — вместо них классы ссылаются прямо друг на друга (`Author author`, `List<Book> books`). При этом сторона со многими строками всегда владеет внешним ключом в таблице (`@JoinColumn`), а обратная сторона использует атрибут **`mappedBy`**, чтобы Hibernate не создавал лишнюю промежуточную таблицу!"),
      table(
        ["Аннотация связи", "FetchType **по умолчанию**", "Практическое правило продакшена"],
        ["`@OneToMany`", "**`LAZY`** (грузит список только при обращении)", "Оставляем `LAZY`! Всегда ставим `mappedBy = \"...\"`."],
        ["`@ManyToMany`", "**`LAZY`**", "Для `ManyToMany` на практике часто создают отдельную промежуточную `@Entity` (как `OrderItem`), чтобы добавлять доп. поля."],
        ["`@ManyToOne`", "**`EAGER`!** (жадная загрузка сразу через JOIN/SELECT!)", "**ОБЯЗАТЕЛЬНО меняйте на `fetch = FetchType.LAZY`!** Дефолтный `EAGER` убивает производительность при выборке списков!"],
        ["`@OneToOne`", "**`EAGER`!**", "Меняем на `LAZY` (где возможно) или храним общий ключ `@MapsId`."],
      ),
      h("Знаменитая проблема N+1 запросов — вопрос №1 по Hibernate на собесах!"),
      p("Представьте: вы загрузили список из **100** авторов одним запросом: `SELECT * FROM authors;` (**1 запрос**). Затем при маппинге в DTO или цикле вызываете `author.getBooks().size()`. Поскольку книги ленивые (`LAZY`), Hibernate вынужден сходить в базу **100 дополнительных раз** — отдельно для КАЖДОГО автора (`SELECT * FROM books WHERE author_id = ?`)! Итого **1 + 100 = 101 SQL-запрос** вместо одного! При 10 000 авторах бэкенд умирает."),
      h("Как вылечить проблему N+1 (3 главных способа)"),
      code(r`
public interface AuthorRepository extends JpaRepository<Author, Long> {

    // СПОСОБ 1: LEFT JOIN FETCH прямо в JPQL — загрузит авторов и их книги за 1 SQL-запрос!
    @Query("SELECT DISTINCT a FROM Author a LEFT JOIN FETCH a.books")
    List<Author> findAllWithBooks();

    // СПОСОБ 2: @EntityGraph — декларативно говорит Spring Data JPA подгрузить поле books:
    @EntityGraph(attributePaths = {"books"})
    List<Author> findAll();
}
// СПОСОБ 3: @BatchSize(size = 50) (или spring.jpa.properties.hibernate.default_batch_fetch_size: 50)
// Склеит 100 мелких запросов в 2 запроса с WHERE author_id IN (1, 2, ..., 50) — спасает при пагинации!
`, "3 способа решения проблемы N+1 в Spring Data JPA"),
      h("Что такое LazyInitializationException?"),
      p("Если вы закрыли транзакцию в `@Service`, отдали объект `Author` наружу в `@RestController`, и уже там Jackson пытается сериализовать неинициализированное `LAZY`-поле `author.getBooks()` — сессия Hibernate уже закрыта, выгрузить данные неоткуда, и сервер падает с **`LazyInitializationException: failed to lazily initialize a collection of role`**! Лечение простое: конвертировать сущность в безопасный **DTO внутри транзакционного сервиса**, предварительно вытянув нужные связи через `JOIN FETCH`!"),
      warn("Ловушка совместного использования JOIN FETCH и пагинации (Pageable)", "Если в одном запросе совместить `JOIN FETCH` по коллекции `@OneToMany` и `Pageable` (лимит страниц), Hibernate не сможет сделать SQL `LIMIT` по авторам и **выгрузит ВСЮ таблицу в оперативную память Java**, фильтруя страницы в RAM (предупреждение `HHH90003004: firstResult/maxResults specified with collection fetch`)! Для пагинации с коллекциями используют `@BatchSize` или 2-шаговую выборку ID."),
      code(r`
import java.util.*;

// Демонстрация проблемы N+1 в Main.java: подсчёт запросов к «базе данных»!
public class Main {
    static int sqlQueriesCount = 0;

    static List<String> selectAllAuthors() { sqlQueriesCount++; return List.of("Толстой", "Блох", "Мартин"); }
    static List<String> selectBooksForAuthor(String a) { sqlQueriesCount++; return List.of("Книга от " + a); }
    static void selectAllJoinedOnce() { sqlQueriesCount++; }

    public static void main(String[] args) {
        List<String> authors = selectAllAuthors(); // 1 запрос
        for (String a : authors) selectBooksForAuthor(a); // + N запросов!
        System.out.println("При N+1 выполнено SQL-запросов: " + sqlQueriesCount + " (вместо 1!)");

        sqlQueriesCount = 0;
        selectAllJoinedOnce(); // С JOIN FETCH ровно 1 запрос!
        System.out.println("С JOIN FETCH выполнено SQL-запросов: " + sqlQueriesCount);
    }
}`, "Наглядная симуляция N+1 против JOIN FETCH в Main.java"),
      tip("Задание в песочнице справа", "Расширьте симулятор N+1 в `Main.java`: реализуйте способ №3 (**`@BatchSize(2)`**) — сгруппируйте N авторов в пачки по 2 ID (`WHERE author_id IN (...)`) и убедитесь, как число SQL-запросов резко падает!"),
    ],
    interview: [
      { q: "Объясните проблему N+1 в Hibernate и способы её решения.", a: "Возникает при выборке N родительских сущностей (1 запрос `SELECT *`) с последующим обращением к их `LAZY`-коллекциям/связям в цикле (+ N отдельных запросов `WHERE parent_id = ?`). Решения: 1) `JOIN FETCH` в JPQL; 2) `@EntityGraph`; 3) `@BatchSize` / `default_batch_fetch_size` (`IN (...)`, особенно важно при пагинации); 4) Плоская DTO-проекция." },
      { q: "Какой FetchType по умолчанию у `@OneToMany`, `@ManyToMany`, `@ManyToOne` и `@OneToOne`?", a: "Связи `*ToMany` ленивые (`LAZY`), а `*ToOne` — жадные (`EAGER`). В коммерческом коде принято явно указывать `fetch = FetchType.LAZY` даже на `@ManyToOne`." },
      { q: "Из-за чего возникает `LazyInitializationException` и как его правильно исправлять?", a: "Из-за попытки обратиться к неинициализированной `LAZY`-связи после закрытия Hibernate Session / транзакции (например, при сериализации Entity в JSON в контроллере). Правильное решение — всегда возвращать из `@Service` готовый **DTO**, загрузив нужные связи внутри транзакции через `JOIN FETCH`, а НЕ включать `spring.jpa.open-in-view=true`!" },
    ],
    selfStudy: [
      "Включи логирование реальных SQL-запросов в `application.yml` (`spring.jpa.show-sql: true`) и посчитай их количество при реальном вызове.",
      "Узнай, почему настройку `spring.jpa.open-in-view` (OSIV) на продакшен-проектах принято явно отключать (`false`).",
      "Познакомься со свойствами `cascade = CascadeType.ALL` и `orphanRemoval = true` на `@OneToMany`.",
    ],
    resources: [
      baeldung("hibernate-n-plus-1-problem", "Baeldung: Solving the N+1 Problem in Hibernate"),
      baeldung("hibernate-lazy-eager-loading", "Baeldung: Eager vs Lazy Loading in Hibernate"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 76 — Спринт: CRUD API «Онлайн-библиотека»                     */
  /* ================================================================== */
  76: {
    deepDive: [
      h("Классическая трёхслойная архитектура Spring Boot сервиса (Layered Architecture)"),
      p("В этом спринте вы собираете воедино весь веб-стек Spring: БД (PostgreSQL/JPA) → Сервисный слой с бизнес-логикой → REST-контроллеры → DTO и валидация. Чтобы код большого проекта не превратился в кашу, его строго делят на **три горизонтальных слоя**, где каждый верхний слой зависит только от нижнего:"),
      analogy("Три отдела компании: Ресепшен → Операционный отдел → Архив", "Клиент общается только с ресепшеном (`@RestController` принимает заявку и проверяет заполнение бланка `@Valid`), ресепшен передаёт задачу в операционный отдел (`@Service` проверяет правила бизнеса и транзакции), а тот запрашивает папки в архиве (`@Repository` — SQL к БД). Никто не пускает клиента прямо в архив!"),
      h("Карта HTTP-статусов для операций CRUD библиотеки"),
      list(
        "**`200 OK`** — книга найдена (`GET`) или успешно выдана/обновлена (`PUT`/`PATCH`).",
        "**`201 Created`** — новая книга создана (`POST`, часто с заголовком `Location`).",
        "**`204 No Content`** — книга успешно удалена (`DELETE`), тело ответа пустое.",
        "**`400 Bad Request`** — провалена `@Valid` валидация DTO (пустой заголовок, отрицательный год).",
        "**`404 Not Found`** / **`409 Conflict`** — книги нет в каталоге (`404`) или закончились свободные экземпляры (`409`).",
      ),
      warn("Две типичные ошибки при сборке 3-слойного API", "1) Не возвращайте `Book` (`@Entity`) напрямую из `@RestController` — преобразуйте в `BookResponseDto` на уровне `@Service` или маппера.\n2) Никогда не позволяйте `@Repository` вызывать `@Service` или контроллер: зависимости должны течь строго **сверху вниз** (`Controller -> Service -> Repository`)."),
      table(
        ["Слой архитектуры", "Аннотация", "Единственная зона ответственности"],
        ["**1. Presentation / Web (`Controller`)**", "`@RestController`", "Принимает HTTP-запросы, запускает `@Valid` на DTO, вызывает Service и отдаёт `ResponseEntity<DTO>`."],
        ["**2. Business Logic (`Service`)**", "`@Service`", "Главный «мозг»: транзакции (`@Transactional`), бизнес-проверки (можно ли выдать книгу?), маппинг `Entity <-> DTO`."],
        ["**3. Persistence / Data (`Repository`)**", "`@Repository` / `JpaRepository`", "Только чтение и запись в БД. Никакой бизнес-логики и HTTP-кодов внутри!"],
      ),
      h("Чек-лист эндпоинтов и пагинация через Pageable"),
      p("В онлайн-библиотеке могут быть 100 000 книг — нельзя отдавать их одним JSON-массивом по `GET /api/books`! В Spring Data JPA достаточно принять аргумент `Pageable pageable` в контроллере (`GET /api/books?page=0&size=20&sort=title,asc`) и передать его в `bookRepository.findAll(pageable)` — вернётся объект `Page<BookDto>` со списком, общим числом страниц и флагом `hasNext`!"),
      code(r`
// Мини-архитектура сервиса выдачи книги (Layered Architecture):
@Service
public class LibraryService {
    private final BookRepository bookRepo;

    public LibraryService(BookRepository bookRepo) { this.bookRepo = bookRepo; }

    public BookResponseDto borrowBook(Long id) {
        Book book = bookRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Книга не найдена: " + id));
        if (book.getCopiesAvailable() <= 0) {
            throw new BusinessConflictException("Все экземпляры уже на руках!");
        }
        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        return toDto(bookRepo.save(book));
    }
}`, "Трёхслойная логика выдачи книги в сервисе"),
      code(r`
import java.util.*;

// Полноценная рабочая модель 3-слойного API в Main.java:
record BookDto(long id, String title, int copies) {}

class BookRepositoryMock {
    private final Map<Long, BookDto> storage = new LinkedHashMap<>();
    BookRepositoryMock() {
        storage.put(1L, new BookDto(1L, "Effective Java", 3));
        storage.put(2L, new BookDto(2L, "Spring in Action", 1));
    }
    Optional<BookDto> findById(long id) { return Optional.ofNullable(storage.get(id)); }
    void save(BookDto b) { storage.put(b.id(), b); }
}

class BookServiceMock {
    private final BookRepositoryMock repo;
    BookServiceMock(BookRepositoryMock repo) { this.repo = repo; }
    String borrow(long id) {
        BookDto b = repo.findById(id).orElse(null);
        if (b == null) return "HTTP 404: Книга не найдена";
        if (b.copies() <= 0) return "HTTP 409: Экземпляры закончились";
        repo.save(new BookDto(b.id(), b.title(), b.copies() - 1));
        return "HTTP 200 OK: Выдана книга '" + b.title() + "' (осталось " + (b.copies() - 1) + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        BookServiceMock service = new BookServiceMock(new BookRepositoryMock());
        System.out.println(service.borrow(2L)); // 200 OK (осталось 0)
        System.out.println(service.borrow(2L)); // 409 Conflict!
    }
}`, "Рабочий прототип 3-слойного сервиса «Онлайн-библиотека» в Main.java"),
      tip("Задание в песочнице справа", "Допишите в симулятор в `Main.java` третий слой — `BookControllerMock` (принимающий команду и путь), метод `returnBook(long id)` и постраничный вывод `getAll(int page, int size)` с помощью `Stream.skip(page * size).limit(size)`!"),
    ],
    interview: [
      { q: "Почему не стоит вызывать `Repository` напрямую из `@RestController` без `@Service`?", a: "Контроллер отвечает только за транспорт HTTP, а не бизнес-правила и транзакции. Слой `@Service` позволяет объединять несколько вызовов репозиториев в одну `@Transactional`, переиспользовать логику из других сервисов или планировщиков задач и легко покрывать бизнес-логику unit-тестами." },
      { q: "Как устроена встроенная пагинация и сортировка в Spring Data JPA (`Pageable`)?", a: "В контроллере в параметры метода добавляют `Pageable pageable` (Spring MVC сам распарсит `?page=0&size=20&sort=price,desc`), а в репозитории метод возвращает `Page<T>` или `Slice<T>`. `Slice` не делает второй тяжёлый запрос `SELECT COUNT(*)`, поэтому быстрее для бесконечного скролла!" },
      { q: "Какой статус-код корректно отдавать при попытке взять книгу, если `copies == 0`?", a: "`409 Conflict` (конфликт текущего состояния ресурса) или `422 Unprocessable Entity`." },
    ],
    selfStudy: [
      "Поэкспериментируй с разницей между `Page<T>` (знает общее число страниц, делает `COUNT(*)`) и `Slice<T>` (только знает, есть ли следующая страница).",
      "Спроектируй эндпоинты для выдачи/возврата книги пользователю (таблица `loans`: `user_id`, `book_id`, `borrowed_at`, `returned_at`).",
      "Подключи к учебному Spring-проекту аннотации OpenAPI `@Operation(summary = \"...\")` из `springdoc-openapi`.",
    ],
    resources: [
      baeldung("spring-data-jpa-pagination-and-sorting", "Baeldung: Pagination and Sorting using Spring Data JPA"),
      ROADMAP_BACKEND,
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 77 — @Transactional и транзакции в Spring                     */
  /* ================================================================== */
  77: {
    deepDive: [
      h("Как работает магия @Transactional: Spring AOP Proxy!"),
      p("Когда вы ставите над методом сервиса аннотацию **`@Transactional`**, Spring при запуске заворачивает ваш реальный бин в незаметную **прокси-обёртку (Dynamic Proxy / CGLIB)**. Когда контроллер вызывает `bankService.transfer(...)`, запрос сначала попадает в **Прокси**:"),
      analogy("Охранник-аудитор перед входом в бухгалтерию", "Вы заходите не в сам кабинет бухгалтера (`target`), а проходите через приёмную охранника (`Proxy`), который открывает журнал транзакции (`BEGIN`), запускает вас внутрь, а на выходе ставит печать `COMMIT` или рвёт весь черновик `ROLLBACK` при тревоге! Если бухгалтер внутри звонит сам себе по внутреннему телефону (`this.method()`), охранник этого вызова не видит."),
      list(
        "1. Прокси открывает соединение с БД и выполняет SQL `BEGIN` (`setAutoCommit(false)`).",
        "2. Вызывает реальный метод вашего класса `bankService.transfer(...)`.",
        "3. Если метод завершился без ошибок → Прокси делает **`COMMIT`**. Если вылетело исключение → Прокси делает **`ROLLBACK`**!",
      ),
      h("Две главные ловушки @Transactional, на которых валят 80% кандидатов!"),
      warn("Ловушка №1: Self-Invocation (Вызов через this.method() не работает!)", "Если из метода A того же самого класса вызвать внутренний метод `this.B()`, помеченный `@Transactional`, **транзакция НЕ откроется!** Почему? Потому что `this` обращается напрямую к целевому объекту, **в обход Spring Proxy**! Решение: вынести `B` в другой сервис или внедрить бин через другой слой.\nТакже `@Transactional` на `private` методах работать не будет (прокси видит только `public` методы снаружи!)."),
      warn("Ловушка №2: Checked-исключения НЕ откатывают транзакцию по умолчанию!", "По умолчанию Spring делает `ROLLBACK` **ТОЛЬКО при Unchecked-исключениях** (`RuntimeException` и `Error`)! Если в транзакционном методе выбросить проверяемое (Checked) исключение вроде `IOException` или свой `class BankCheckedException extends Exception`, Spring подумает, что это штатный выход и **ЗАКОММИТИТ половину неполной операции**! Чтобы откатываться при любом `Exception`, обязательно пишите **`@Transactional(rollbackFor = Exception.class)`**!"),
      h("Опция readOnly = true, Propagation и Isolation"),
      table(
        ["Параметр `@Transactional`", "Ключевые значения и смысл"],
        ["**`readOnly = true`**", "Указывает Spring/Hibernate, что транзакция только читает (`SELECT`). Отключает накладной Dirty Checking и помогает балансировать запросы на Read-реплики БД! Ставят над всеми `get/find` методами."],
        ["**`rollbackFor = Exception.class`**", "Гарантирует откат даже при Checked-исключениях."],
        ["**`propagation`**", "`REQUIRED` *(по умолчанию — присоединиться к текущей, если есть, или открыть новую)*; `REQUIRES_NEW` *(всегда приостанавливает текущую и открывает независимую транзакцию — напр. для записи аудита/логов даже при откате основной!)*."],
        ["**`isolation`**", "По умолчанию `DEFAULT` (берёт уровень изоляции вашей БД, в PostgreSQL — `READ_COMMITTED`)."],
      ),
      code(r`
@Service
public class TransferService {
    private final AccountRepository repo;

    public TransferService(AccountRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true) // Оптимизация: отключает Hibernate Dirty Checking!
    public BigDecimal getBalance(Long id) {
        return repo.findById(id).orElseThrow().getBalance();
    }

    @Transactional(rollbackFor = Exception.class) // Безопасный откат на любые ошибки!
    public void transfer(Long fromId, Long toId, BigDecimal amount) throws CheckedLimitException {
        Account from = repo.findById(fromId).orElseThrow();
        Account to = repo.findById(toId).orElseThrow();
        from.withdraw(amount);
        to.deposit(amount);
    }
}`, "Идеальное применение @Transactional(readOnly) и rollbackFor"),
      code(r`
import java.util.*;

// Демонстрация ловушки Self-Invocation Proxy в Main.java:
class RealService {
    public void outerMethod() {
        System.out.println("outerMethod вызвал this.innerMethod() НАПРЯМУЮ (в обход прокси!):");
        this.innerMethod();
    }
    public void innerMethod() {
        System.out.println(" -> Выполнено БЕЗ открытия транзакции прокси!");
    }
}

class SpringProxy extends RealService {
    private final RealService target;
    SpringProxy(RealService target) { this.target = target; }

    @Override
    public void innerMethod() {
        System.out.println("[PROXY: BEGIN TRANSACTION]");
        target.innerMethod();
        System.out.println("[PROXY: COMMIT TRANSACTION]");
    }
}

public class Main {
    public static void main(String[] args) {
        RealService proxyBean = new SpringProxy(new RealService());
        System.out.println("1. Внешний вызов через прокси:");
        proxyBean.innerMethod();

        System.out.println("\n2. Внутренний self-invocation вызов из outerMethod:");
        proxyBean.outerMethod(); // Показывает, почему this обходит прокси!
    }
}`, "Воспроизведение механизма Spring Proxy и Self-Invocation в Main.java"),
      tip("Задание в песочнице справа", "Запустите модель `SpringProxy` в `Main.java`, а затем добавьте в `SpringProxy` имитацию `try / catch (Exception e)` — сделайте откат транзакции только для `RuntimeException`, если не задан флаг `rollbackForAll = true`!"),
    ],
    interview: [
      { q: "Как Spring реализует работу `@Transactional` под капотом?", a: "Через **Spring AOP Proxy** (динамические прокси CGLIB или JDK). Вокруг целевого бина создаётся обёртка, которая перехватывает вызовы публичных методов снаружи, открывает транзакцию через `PlatformTransactionManager`, вызывает метод и делает `commit` или `rollback`." },
      { q: "При каких исключениях Spring по умолчанию откатывает транзакцию, а при каких коммитит?", a: "Откатывает только при **Unchecked (`RuntimeException` и `Error`)**. При **Checked (`Exception`)** по умолчанию транзакция **коммитится**, если явно не указано `rollbackFor = Exception.class`." },
      { q: "Почему `@Transactional` не сработает на private-методе и при self-invocation (`this.otherMethod()`)?", a: "Прокси перехватывает вызовы только через внешний интерфейс/наследника (для `private` методов это невозможно), а при `this.otherMethod()` вызов идёт напрямую к экземпляру `target`, полностью минуя прокси-обёртку." },
      { q: "Зачем ставить `@Transactional(readOnly = true)` на методы чтения?", a: "Отключает отслеживание изменений в Hibernate (Dirty Checking + flush), экономя CPU и память, а в кластере БД с репликацией позволяет направлять запросы на Read-реплики." },
    ],
    selfStudy: [
      "Разбери все 7 уровней `Propagation` (особенно `REQUIRED`, `REQUIRES_NEW`, `NESTED`, `SUPPORTS`).",
      "Узнай о разнице между JDK Dynamic Proxy (только по интерфейсам) и CGLIB Proxy (наследованием от класса, поэтому проксируемые классы/методы не могут быть `final`!).",
      "Посмотри на паттерн Transactional Outbox (как надёжно отправить сообщение в Kafka при коммите БД).",
    ],
    resources: [
      baeldung("transaction-configuration-with-jpa-and-spring", "Baeldung: Transactions with Spring and JPA"),
      baeldung("spring-transactional-propagation-isolation", "Baeldung: Transaction Propagation and Isolation"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 78 — Тестирование: JUnit 5 и Mockito                          */
  /* ================================================================== */
  78: {
    deepDive: [
      h("Зачем нужны автотесты и как устроена Пирамида тестирования"),
      p("Проверять каждый из 50 эндпоинтов вручную в Postman после каждого мелкого рефакторинга невозможно — баги неизбежно уйдут в продакшен. Автотесты за 5 секунд доказывают, что ваш код работает! В Java-проектах выстраивают **пирамиду тестирования**:"),
      analogy("Испытательный стенд двигателя (@Mock) vs реальный полёт (@SpringBootTest)", "Чтобы проверить логику расчёта скидки в `OrderService`, не нужно поднимать тяжёлый Boeing со всеми БД и очередями. В Unit-тесте вы подключаете мотор к лёгкому эмулятору топливного насоса (`@Mock OrderRepository`) и за 5 миллисекунд проверяете десятки граничных сценариев!"),
      list(
        "**1. Unit-тесты (70% — фундамент):** тестируют один конкретный метод/класс в полной изоляции за миллисекунды (библиотеки **JUnit 5** + **Mockito** + **AssertJ**).",
        "**2. Slice-тесты (20%):** поднимают только часть контекста Spring — например, только веб-слой (`@WebMvcTest` с `MockMvc`) или только JPA (`@DataJpaTest`).",
        "**3. Интеграционные / E2E-тесты (10%):** поднимают весь сервис (`@SpringBootTest`) вместе с реальной базой PostgreSQL в Docker (**Testcontainers**)!",
      ),
      h("Паттерн AAA (Arrange — Act — Assert) и аннотации JUnit 5"),
      p("Каждый чистый тест читается в 3 шага: **Arrange** (подготовить входные данные и моки), **Act** (вызвать тестируемый метод), **Assert** (проверить результат или выброс ожидаемого исключения `assertThrows`)."),
      h("Зачем нужен Mockito (@Mock и @InjectMocks)?"),
      p("Чтобы в Unit-тесте проверить `OrderService`, не подключаясь к реальной базе PostgreSQL и не отправляя настоящих писем клиентам, реальные зависимости заменяют **заглушками (Mocks)**! Вы просто программируете поведение заглушки: `when(repo.findById(1L)).thenReturn(Optional.of(order))` и затем проверяете `verify(repo).save(...)`."),
      code(r`
@ExtendWith(MockitoExtension.class) // Запускает тест за миллисекунды БЕЗ поднятия Spring!
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepo; // Поддельный репозиторий (в БД не ходит!)

    @InjectMocks
    private OrderService orderService; // Автоматически внедряет мок в конструктор OrderService!

    @Test
    @DisplayName("Должен успешно рассчитать скидку VIP-клиенту и сохранить заказ")
    void shouldApplyDiscountAndSaveOrder() {
        // 1. Arrange (Подготовка):
        Order existing = new Order(1L, "NEW", 1000.0);
        when(orderRepo.findById(1L)).thenReturn(Optional.of(existing));

        // 2. Act (Действие):
        double finalSum = orderService.applyVipDiscount(1L);

        // 3. Assert (Проверка результата и факта вызова):
        assertEquals(850.0, finalSum);
        verify(orderRepo, times(1)).save(existing); // Убеждаемся, что save() вызвался ровно 1 раз!
    }

    @Test
    void shouldThrowWhenOrderNotFound() {
        when(orderRepo.findById(99L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> orderService.applyVipDiscount(99L));
    }
}`, "Эталонный Unit-тест с JUnit 5 + Mockito"),
      warn("Ловушка: проверять моки вместо реальной бизнес-логики", "Если тест замокировал 5 классов так, что проверяет только «вызвался ли метод Х с точным аргументом Y», при первом рефакторинге тест сломается, даже если код работает правильно. Тестируйте **поведение и результат**, а `@SpringBootTest` используйте с реальной БД в **Testcontainers**, а не со встроенной H2 (у H2 другой диалект SQL!)."),
      code(r`
// В Main.java напишем собственный мини-движок assertion тестов в стиле JUnit 5!
public class Main {
    static void assertEquals(Object expected, Object actual, String testName) {
        if (!java.util.Objects.equals(expected, actual)) {
            throw new AssertionError("FAIL [" + testName + "]: ждали " + expected + ", получили " + actual);
        }
        System.out.println("PASS: " + testName);
    }

    static double calcDiscount(double price, boolean vip) { return vip ? price * 0.85 : price; }

    public static void main(String[] args) {
        assertEquals(850.0, calcDiscount(1000.0, true), "VIP скидка 15%");
        assertEquals(1000.0, calcDiscount(1000.0, false), "Обычный клиент без скидки");
    }
}`, "Самописный мини-тест раннер в стиле JUnit 5 для Main.java"),
      tip("Задание в песочнице справа", "Допишите в `Main.java` реализацию метода `assertThrows(Class<? extends Throwable> expectedType, Runnable code)` (используя функциональный интерфейс `Runnable`!), чтобы проверять выброс исключений при отрицательной цене — прямо как в JUnit 5!"),
    ],
    interview: [
      { q: "В чём разница между `@Mock` и `@MockBean` (в новых версиях `@MockitoBean`), и когда нужен `@SpringBootTest`?", a: "`@Mock` из Mockito работает в обычных быстрых JUnit-тестах без Spring-контекста (вместе с `@InjectMocks`). `@MockBean` / `@MockitoBean` подменяет реальный бин прямо внутри поднятого Spring `ApplicationContext` (при использовании `@WebMvcTest` или `@SpringBootTest`)." },
      { q: "Объясните разницу между Unit-тестом и Интеграционным тестом.", a: "Unit-тест проверяет один изолированный компонент/метод, заменяя все внешние зависимости (БД, сеть) на моки за миллисекунды. Интеграционный тест проверяет взаимодействие нескольких слоёв или сервиса с реальной БД/брокером (например, через Testcontainers + MockMvc)." },
      { q: "Почему для интеграционных тестов PostgreSQL лучше использовать Testcontainers вместо in-memory базы H2?", a: "Синтаксис и поведение H2 заметно отличаются от PostgreSQL (JSONB, оконные функции, `ON CONFLICT`, типы изоляции, Flyway-миграции под Postgres). Тест на H2 может пройти зелёным, а в продакшене на PostgreSQL всё упадёт." },
    ],
    selfStudy: [
      "Познакомься с библиотекой **AssertJ** (`assertThat(list).hasSize(3).contains(\"Java\")`) — она делает ассерты намного читаемее стандартного `JUnit Assertions`.",
      "Узнай про параметризованные тесты `@ParameterizedTest` + `@CsvSource` в JUnit 5.",
      "Посмотри сайт `testcontainers.com` — как в 3 строчки поднимать реальный PostgreSQL для интеграционных тестов.",
    ],
    resources: [
      baeldung("junit-5", "Baeldung: A Guide to JUnit 5"),
      baeldung("mockito-series", "Baeldung: Mockito Series"),
      baeldung("spring-boot-testing", "Baeldung: Testing in Spring Boot"),
    ],
  },

  /* ================================================================== */
  /*  DAY 79 — Spring Security и авторизация по JWT                     */
  /* ================================================================== */
  79: {
    deepDive: [
      h("Аутентификация vs Авторизация и как устроен Spring Security"),
      p("Любой коммерческий API нужно защищать: нельзя позволить анонимному запросу удалить чужой заказ. Сначала чётко разделяйте два термина (спрашивают всегда!): **Authentication (Аутентификация)** — проверка «кто ты?» по логину/паролю или токену (`401`), а **Authorization (Авторизация)** — проверка «есть ли у тебя права / роль на это действие?» (`403`)."),
      p("В Spring Security каждый входящий запрос проходит через цепочку сервлет-фильтров **`SecurityFilterChain`**, ещё **до попадания в ваш `@RestController`**!"),
      h("Почему пароли НИКОГДА не хранят в открытом виде (и даже в MD5) — BCrypt"),
      p("Если базу украдут через бэкап или SQL-инъекцию, пароли в открытом виде подарят злоумышленникам доступ ко всем аккаунтам. Вместо шифрования применяют **одностороннее медленное хеширование с уникальной «солью»** — в Spring Security стандартом де-факто является **`BCryptPasswordEncoder`** (`passwordEncoder.encode(raw)`). Расшифровать BCrypt-хеш обратно нельзя — при логине вызывается `matches(rawPassword, storedHash)`."),
      h("Как работает Stateless авторизация по JWT (JSON Web Token)"),
      p("Чтобы не хранить миллионы сессий в памяти сервера (нарушая принцип REST Stateless), используют подписанные токены **JWT**. Токен состоит из 3 частей в формате Base64Url через точку — **`Header.Payload.Signature`**:"),
      table(
        ["Часть JWT", "Что внутри", "Критично важно знать!"],
        ["**1. Header**", "Тип токена (`JWT`) и алгоритм подписи (`HS256` / `RS256`)", "Кодируется Base64Url"],
        ["**2. Payload**", "Полезная нагрузка (Claims): `sub` (userId), `role`, `exp` (срок истечения)", "**НЕ зашифровано!** Любой может прочитать Base64! Никогда не кладите в JWT пароли и секреты!"],
        ["**3. Signature**", "`HMACSHA256(header + '.' + payload, SERVER_SECRET_KEY)`", "Гарантирует, что никто не подделал `role: ADMIN` в Payload без знания ключа сервера!"],
      ),
      code(r`
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtFilter) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable) // Для stateless REST API с JWT в заголовке (не в cookie!)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/swagger-ui/**").permitAll() // Открыто всем!
                .requestMatchers("/api/admin/**").hasRole("ADMIN")              // Только ADMIN!
                .anyRequest().authenticated()                                  // Всё остальное требует JWT!
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}`, "Современная конфигурация SecurityFilterChain в Spring Security 6 / Boot 3"),
      warn("3 частые уязвимости безопасности новичков", "1) Полагать, что JWT шифрует данные в Payload (нет, он только *подписывает* целостность!).\n2) Доверять заголовкам от клиента вроде `X-User-Id` или доверять токену без проверки `Signature` и срока жизни `exp`.\n3) Отключать CSRF-защиту, если вы при этом передаёте JWT в обычных Cookie с `SameSite=None`!"),
      code(r`
import java.util.Base64;

// В Main.java можно наглядно декодировать реальную структуру JWT-токена Header.Payload.Signature!
public class Main {
    public static void main(String[] args) {
        String header = Base64.getUrlEncoder().withoutPadding().encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}".getBytes());
        String payload = Base64.getUrlEncoder().withoutPadding().encodeToString("{\"sub\":\"42\",\"role\":\"STUDENT\"}".getBytes());
        String mockJwt = header + "." + payload + ".fakeSignatureHash";
        System.out.println("Сгенерированный JWT: " + mockJwt);

        // Как злоумышленник/клиент легко читает Payload без ключа (Base64 != шифрование!):
        String decoded = new String(Base64.getUrlDecoder().decode(mockJwt.split("\\.")[1]));
        System.out.println("Декодированный Payload: " + decoded);
    }
}`, "Разбор структуры JWT Header.Payload.Signature прямо в Main.java"),
      tip("Задание в песочнице справа", "Запустите декодер JWT в `Main.java`, а затем добавьте имитацию проверки роли: распарсите поле `role` из декодированного Payload и смоделируйте возврат `401` при пустом токене, `403` для `STUDENT` на `/admin` и `200` для `ADMIN`!"),
    ],
    interview: [
      { q: "В чём разница между аутентификацией и авторизацией?", a: "Аутентификация — проверка подлинности личности пользователя (вход по логину/паролю или токену → 401 при ошибке). Авторизация — проверка прав доступа уже аутентифицированного пользователя к конкретному ресурсу (роли/permissions → 403 при отказе)." },
      { q: "Из каких 3 частей состоит JWT и зашифрован ли Payload?", a: "`Header.Payload.Signature`. **Нет**, Header и Payload просто закодированы в Base64Url — любой может их декодировать! Подпись Signature защищает токен не от прочтения, а от **подделки/изменения**." },
      { q: "Почему для паролей используют BCrypt, а не быстрые SHA-256 или MD5?", a: "MD5 и SHA-256 созданы быть максимально быстрыми (видеокарта перебирает миллиарды комбинаций в секунду). `BCrypt` преднамеренно вычислительно тяжёлый (настраиваемый cost factor) и автоматически добавляет к каждому паролю уникальную случайную соль, защищая от радужных таблиц и брутфорса." },
    ],
    selfStudy: [
      "Вставь любой тестовый JWT на сайте `jwt.io` и посмотри на визуальный разбор Header, Payload и Signature.",
      "Узнай о паре `Access Token` (короткий, 5–15 минут) + `Refresh Token` (длинный, позволяет перевыпустить Access Token и при необходимости отозвать доступ в БД).",
      "Посмотри, как в Spring Security работает `OncePerRequestFilter` и `SecurityContextHolder.getContext().setAuthentication(...)`.",
    ],
    resources: [
      link("tool", "JWT.io — интерактивный отладчик токенов", "https://jwt.io/", "Визуальное декодирование и проверка подписи JWT", "en"),
      baeldung("spring-security-authentication-with-jwt", "Baeldung: Spring Security with JWT"),
      baeldung("spring-security-registration-password-encoding-bcrypt", "Baeldung: Password Encoding with BCrypt"),
    ],
  },

  /* ================================================================== */
  /*  DAY 80 — Docker: контейнеризация Java-приложений                  */
  /* ================================================================== */
  80: {
    deepDive: [
      h("Зачем нужен Docker: «На моей машине всё работало!» в прошлом"),
      p("Вы написали проект на Java 21 с PostgreSQL 16 и переменными среды на Windows. Выкладываете `.jar` на сервер заказчика, а там стоит старая Java 11, конфликт библиотек и другая версия ОС — всё падает! **Docker** упаковывает ваше приложение вместе с **точной версией JRE, системными библиотеками и настройками** в изолированный легковесный **контейнер**, который запускается одинаково на любом ноутбуке и облачном сервере!"),
      h("Docker Image vs Docker Container vs Виртуальная машина"),
      table(
        ["Понятие", "Аналогия из ООП (День 26!)", "Что это технически"],
        ["**Dockerfile**", "Исходный код чертежа", "Текстовая инструкция сборки образа шаг за шагом (`FROM`, `COPY`, `RUN`)."],
        ["**Docker Image (Образ)**", "**Класс (`User.class`)**", "Неизменяемый шаблон из слоёв (ОС + Java + ваш `app.jar`)."],
        ["**Docker Container (Контейнер)**", "**Объект (`new User()`)**", "Запущенный в реальном времени изолированный процесс из Образа (использует общее ядро Linux хоста — стартует за миллисекунды и ест минимум RAM, в отличие от тяжёлых VM!)."],
      ),
      h("Multi-stage Dockerfile для Spring Boot — стандарт продакшена!"),
      p("Если собирать проект в обычном образе с полным JDK и Maven, образ будет весить **650+ МБ** и тащить в продакшен исходный код и компилятор. **Многоэтапная сборка (Multi-stage build)** решает это красиво:"),
      list(
        "**Этап 1 (`builder`):** Берём образ с Maven + JDK 21, скачиваем зависимости (кэшируем `pom.xml` отдельным слоем!) и компилируем `app.jar`.",
        "**Этап 2 (финальный образ):** Берём лёгкий **`eclipse-temurin:21-jre-alpine`** (без Maven и компилятора, всего ~150 МБ!), копируем **ТОЛЬКО** готовый `app.jar` из этапа `builder` и запускаем от непривилегированного пользователя!",
      ),
      code(r`
# === ЭТАП 1: Сборка приложения ===
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
# Сначала копируем только pom.xml и качаем зависимости — этот слой закэшируется!
COPY pom.xml .
RUN mvn dependency:go-offline
# Затем копируем исходники и собираем jar без повторного скачивания Maven-библиотек
COPY src ./src
RUN mvn clean package -DskipTests

# === ЭТАП 2: Минимальный безопасный продакшен-образ ===
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
`, "Промышленный Multi-stage Dockerfile для Spring Boot"),
      h("Главные команды Docker CLI"),
      code(r`
docker build -t my-shop-api:1.0 .       # Собрать образ из Dockerfile
docker run -d -p 8080:8080 my-shop-api:1.0 # Запустить контейнер в фоне (-d) с пробросом порта (-p)
docker ps                               # Список запущенных контейнеров
docker logs -f <container_id>           # Читать живые логи Spring Boot
docker exec -it <container_id> sh       # Зайти внутрь терминала контейнера
`, "Базовые команды Docker CLI", "bash"),
      warn("Важно: порядок слоёв в Dockerfile и .dockerignore!", "1) Каждый `RUN`/`COPY` создаёт новый кэшируемый слой. Если сначала сделать `COPY . .`, то при правке 1 строчки Java-кода Docker заново скачает все Maven-зависимости! Всегда копируйте `pom.xml` и качайте зависимости ДО `COPY src`.\n2) Обязательно добавьте `.dockerignore` (с `target/`, `.git/`, `.env`), чтобы мусор не летел в контекст сборки."),
      tip("Задание в песочнице справа", "Вспомните аналогию «Класс → Объект» из Дня 26: попрактикуйтесь в `Main.java` в настройке JVM флагов ограничения памяти для контейнера (`Runtime.getRuntime().maxMemory()`) — в Docker крайне важно ограничивать кучу JVM флагами `-XX:MaxRAMPercentage=75.0`!"),
    ],
    interview: [
      { q: "В чём разница между Docker Image и Docker Container?", a: "Docker Image — неизменяемый шаблон/пакет файловой системы и инструкций запуска (как `class` в Java). Docker Container — запущенный, изолированный экземпляр этого образа (как объект `new` в памяти)." },
      { q: "Зачем используется Multi-stage build (многоэтапная сборка) в Dockerfile для Java?", a: "Чтобы на первом этапе использовать тяжёлый образ с JDK и Maven для компиляции `.jar`, а в финальный образ перенести только готовый `.jar` на лёгкую базу с JRE Alpine. Это уменьшает размер образа в 3–4 раза, ускоряет деплой и убирает исходники и лишние утилиты из продакшена (безопасность)." },
      { q: "Чем Docker-контейнер отличается от классической виртуальной машины (VM)?", a: "Виртуальная машина запускает целую гостевую ОС со своим ядром через гипервизор (долго стартует, расходует гигабайты RAM). Контейнеры делят **общее ядро Linux хоста**, изолируясь через namespaces и cgroups — поэтому стартуют за секунды и почти не создают накладных расходов." },
    ],
    selfStudy: [
      "Установи Docker Desktop и запусти свой первый `Hello World` / PostgreSQL контейнер.",
      "Изучи разницу между командами `CMD` и `ENTRYPOINT` в Dockerfile.",
      "Узнай про Layers Spring Boot (`spring-boot:build-image` или `jarmode=layertools`) для мгновенной пересборки образов без копирования 50МБ библиотек.",
    ],
    resources: [
      baeldung("dockerizing-spring-boot-application", "Baeldung: Dockerizing a Spring Boot Application"),
      link("docs", "Docker Docs: Multi-stage builds", "https://docs.docker.com/build/building/multi-stage/", "Официальная документация Docker", "en"),
      ROADMAP_BACKEND,
    ],
  },

  /* ================================================================== */
  /*  DAY 81 — Docker Compose: связка Spring Boot + PostgreSQL          */
  /* ================================================================== */
  81: {
    deepDive: [
      h("Оркестрация локального стека: от 10 длинных команд к `docker compose up`"),
      p("Бэкенд никогда не живёт в вакууме — рядом с вашим Spring Boot приложением почти всегда работают **PostgreSQL**, кэш **Redis**, брокер **Kafka** и панель **pgAdmin**. Запускать их по очереди длинными командами `docker run`, настраивая сети и прокидывая IP-адреса вручную, неудобно. **Docker Compose** описывает весь зоопарк связанных контейнеров в одном файле **`docker-compose.yml`** и поднимает всю инфраструктуру одной командой!"),
      analogy("Дирижёрская партитура для целого оркестра сервисов", "Обычный `Dockerfile` учит играть одного музыканта (ваше Java-приложение). **`docker-compose.yml`** — это общая партитура, где сказано: сначала вступает ударная секция (`postgres` с `healthcheck`), на них настраивается скрипка (`backend` по DNS-имени `postgres`), и все играют в общем зале (виртуальной сети Docker)."),
      h("Переменные окружения и `.env` файл рядом с docker-compose.yml"),
      p("Секреты (пароль от Postgres, секретный ключ JWT) никогда не хардкодят в `docker-compose.yml` при пуше в Git! Их выносят в локальный файл **`.env`** (добавленный в `.gitignore`), который Compose читает автоматически и подставляет в конструкции `${DB_PASS:-secret}`."),
      h("4 кита файла docker-compose.yml"),
      list(
        "**`services`:** описание всех контейнеров (`backend`, `postgres`, `redis`).",
        "**Встроенный DNS и общая сеть (`networks`):** внутри общей Docker-сети контейнеры видят друг друга **не по `localhost`, а по имени сервиса!** То есть Spring Boot подключается к базе по URL **`jdbc:postgresql://postgres:5432/shop_db`**!",
        "**Постоянное хранилище (`volumes`):** без тома (volume) при удалении контейнера `postgres` все данные таблицы сотрутся навсегда! `volumes: pg_data:/var/lib/postgresql/data` сохраняет файлы БД на хосте.",
        "**`depends_on` + `healthcheck`:** гарантирует, что Spring Boot начнёт старт только ПОСЛЕ того, как PostgreSQL реально готов принимать подключения (`pg_isready`), а не просто запустил процесс!",
      ),
      code(`
services:
  postgres:
    image: postgres:16-alpine
    container_name: shop-postgres
    environment:
      POSTGRES_DB: shop_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: \${DB_PASS:-secret}
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d shop_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: .
    container_name: shop-backend
    depends_on:
      postgres:
        condition: service_healthy # Ждём реальной готовности Postgres!
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/shop_db # Имя сервиса postgres!
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: \${DB_PASS:-secret}

volumes:
  pg_data:
`, "Готовый docker-compose.yml для связки Spring Boot + PostgreSQL"),
      warn("Ловушка №1 при первом запуске в Docker: Connection refused к localhost:5432!", "Когда Spring Boot запущен **внутри контейнера**, адрес `localhost` означает **сам контейнер бэкенда**, а НЕ компьютер-хост и НЕ соседний контейнер БД! В Docker Compose в JDBC URL всегда указывают имя сервиса из `docker-compose.yml` (`jdbc:postgresql://postgres:5432/...`), а для локального запуска из IDE оставляют `localhost` через профили или env-переменные!"),
      code(r`
# Основные команды Docker Compose:
docker compose up -d --build    # Собрать и поднять весь стек в фоне
docker compose logs -f backend  # Смотреть логи конкретного сервиса
docker compose down             # Остановить и удалить контейнеры (данные в volume СОХРАНЯЮТСЯ!)
docker compose down -v          # Осторожно: удалит ещё и тома с данными БД!
`, "Команды управления Docker Compose", "bash"),
      code(r`
import java.util.*;

// В Main.java видно разницу JDBC URL локально (IDE) и внутри сети Docker Compose:
public class Main {
    public static void main(String[] args) {
        String dbHost = System.getenv().getOrDefault("DB_HOST", "localhost");
        String jdbcUrl = String.format("jdbc:postgresql://%s:5432/shop_db", dbHost);
        System.out.println("Итоговый JDBC URL: " + jdbcUrl);
    }
}`, "Динамическая сборка JDBC URL для Docker и локальной IDE в Main.java"),
      tip("Задание в песочнице справа", "Возьмите шаблон динамической сборки конфигурации из `Main.java` и добавьте проверку наличия обязательной переменной окружения (`Objects.requireNonNull` / `System.getenv`) — как это делают в продакшен-приложениях перед подключением к базе!"),
    ],
    interview: [
      { q: "Почему внутри контейнера Spring Boot нельзя подключаться к БД по `localhost:5432`, а нужно писать имя сервиса?", a: "У каждого Docker-контейнера свой изолированный сетевой интерфейс (`localhost` внутри контейнера указывает только на него самого). В единой сети Docker Compose работает встроенный DNS, разрешающий имена сервисов (`postgres`) во внутренний IP контейнера БД." },
      { q: "Зачем в Docker Compose нужны `volumes` для контейнера с базой данных?", a: "Файловая система контейнера эфемерна: при `docker compose down` и пересоздании контейнера всё содержимое его диска исчезает. Именованный `volume` монтирует каталог хранения БД (`/var/lib/postgresql/data`) вне контейнера, гарантируя сохранность данных." },
      { q: "Зачем сочетать `depends_on` с `healthcheck` (`service_healthy`)?", a: "Обычный `depends_on` ждёт лишь *факта старта* контейнера, а PostgreSQL внутри может инициализироваться ещё 2–3 секунды. `condition: service_healthy` гарантирует, что Spring Boot стартанёт строго после того, как Postgres начнёт реально принимать соединения." },
    ],
    selfStudy: [
      "Запусти связку PostgreSQL + pgAdmin через `docker compose up -d` локально и посмотри на созданный `volume` командой `docker volume ls`.",
      "Узнай о Spring Boot 3.1+ **Docker Compose Support** (`spring-boot-docker-compose`), который сам автоматически стартует `compose.yml` при запуске проекта из IDE!",
      "Познакомься с `.env` файлом рядом с `docker-compose.yml` для хранения локальных переменных без хардкода паролей.",
    ],
    resources: [
      link("docs", "Docker Docs: Docker Compose Overview", "https://docs.docker.com/compose/", "Официальная документация Docker Compose", "en"),
      baeldung("spring-boot-docker-compose-support", "Baeldung: Docker Compose Support in Spring Boot"),
      ROADMAP_BACKEND,
    ],
  },

  /* ================================================================== */
  /*  DAY 82 — Подготовка к техническому собеседованию                */
  /* ================================================================== */
  82: {
    deepDive: [
      h("Карта технического собеседования на позицию Java Junior"),
      p("К 82-му дню вы освоили весь технологический стек Junior Java Backend разработчика! Но знать тему на практике и чётко сформулировать ответ под давлением за 1–2 минуты на интервью — разные навыки. Типичное собеседование длится 60–90 минут и состоит из 5 блоков:"),
      analogy("Экзамен в автошколе: теория, площадка и город", "Мало просто водить машину у себя во дворе (писать рабочий код в IDE) — на экзамене проверяют, знаете ли вы ПДД терминологией (`equals/hashCode`, `ACID`, `@Transactional` proxy) и умеете ли за 15 минут проехать стандартный маршрут (**Live Coding** вроде Two Sum / Valid Parentheses) с комментариями вслух."),
      table(
        ["Блок собеседования", "Что спрашивают чаще всего", "Где потренироваться в JavaForge"],
        ["**1. Java Core & ООП** *(15 мин)*", "`Object` (`equals/hashCode`), 4 принципа ООП, `abstract` vs `interface`, `String Pool`, `Checked/Unchecked`, `finally`, `Generics`", "Дни 26–39 + раздел **«Квизы & Собес»** (`/quiz`)"],
        ["**2. Коллекции & Streams** *(15 мин)*", "`ArrayList` vs `LinkedList`, **`HashMap` изнутри**, `HashSet`/`TreeMap`, `Comparable/Comparator`, Stream `map` vs `flatMap`, `Optional`", "Дни 40–53 + квиз по Коллекциям"],
        ["**3. SQL & Базы данных** *(15 мин)*", "`JOIN` (задача найти клиентов без заказов через `LEFT JOIN`), `WHERE` vs `HAVING`, `ACID`, уровни изоляции, B-Tree индексы, нормализация", "Дни 54–65 + квиз по SQL"],
        ["**4. Spring & Hibernate** *(15 мин)*", "IoC/DI (Constructor DI), `singleton` бины, HTTP методы и коды `401/403`, **`@Transactional` (Proxy + Checked rollback)**, **проблема N+1** и DTO", "Дни 69–79 + квиз по Spring"],
        ["**5. Live Coding** *(20 мин)*", "Простые алгоритмы на строки/массивы/Map (частота слов, палиндром, валидация скобок на стеке, поиск двух чисел Two Sum за $O(N)$)", "Раздел **«Доп. задания» (`/practice`)** — 55+ задач в стиле Codewars!"],
      ),
      h("Золотая стратегия ответа на технический вопрос"),
      list(
        "**1. Чёткое определение в 1 предложении:** сразу дайте суть («`HashMap` — структура данных ключ-значение на базе массива корзин со сложностью $O(1)$ в среднем»).",
        "**2. Как устроено под капотом / Зачем нужно:** упомяните ключевые детали (хеш-функция, коллизии, красно-чёрное дерево в Java 8+ при пороге 8, `loadFactor 0.75`).",
        "**3. Подводный камень / Пример из кода:** добавьте то, о чём интервьюер хотел спросить следующим вопросом (ловушка изменяемых ключей и контракт `equals/hashCode`). Это сразу выделяет сильного кандидата!",
      ),
      h("Live Coding классика №1: Two Sum за O(N) с помощью HashMap"),
      p("На лайвкодинге часто дают задачу **Two Sum**: найти индексы двух чисел в массиве, дающих в сумме `target`. Решение двумя вложенными циклами за $O(N^2)$ на «тройку», а решение через `HashMap` за один проход **$O(N)$** — сразу ставит жирный плюс!"),
      code(r`
import java.util.*;

public class Main {
    // Two Sum за O(N) вместо O(N^2) — визитная карточка грамотного джуна на Live Coding!
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>(); // число -> его индекс
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] res = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println("Индексы Two Sum: " + Arrays.toString(res)); // [0, 1]
    }
}`, "Классическая задача Live Coding Two Sum за O(N) в Main.java"),
      h("Чек-лист резюме и поведения на интервью"),
      list(
        "**Не молчите на Live Coding:** проговаривайте вслух ход мыслей, краевые случаи (`null`, пустой массив, отрицательные числа) и оценку по Big-O.",
        "**Не выдумывайте ответы:** если не знаете деталь (например, тонкость Garbage Collector G1), честно скажите: «В продакшене с этим не сталкивался, предполагаю, что работает так..., могу уточнить после собеса».",
        "**Вопросы к компании в конце:** обязательно спросите про команду, архитектуру, процессы Code Review и стек — это показывает зрелую мотивацию!",
      ),
      tip("Проверьте себя прямо сейчас в тренажёре квизов!", "Перейдите на новую вкладку **«Квизы & Собес» (`/quiz`)** и запустите **Экзамен на время (Микс 20 вопросов)** — это идеальная репетиция темпа реального технического интервью!"),
    ],
    interview: [
      { q: "Как оптимизировать поиск пары чисел с заданной суммой `target` в массиве с $O(N^2)$ до $O(N)$?", a: "Использовать `HashMap<Integer, Integer>` (значение → индекс): для каждого элемента проверять наличие `target - nums[i]` в мапе за $O(1)$ и при отсутствии класть текущий элемент в мапу." },
      { q: "Что спрашивать у интервьюеров в конце технического собеседования?", a: "Как устроен процесс онбординга джуна, какие задачи ждут первые 3 месяца, как проходят Code Review и тестирование, на какой версии Java/Spring работает проект, какие перспективы роста в команде." },
      { q: "Какой проект лучше всего указать в разделе «Опыт / Пет-проекты» в резюме?", a: "Самостоятельно написанный REST API на Spring Boot 3 + PostgreSQL + Flyway + Spring Security JWT + JUnit/Mockito/Testcontainers тесты + `Dockerfile`/`docker-compose.yml` с качественным `README.md` и Swagger-документацией на GitHub." },
    ],
    selfStudy: [
      "Пройди 2–3 полных экзамена на время в разделе `/quiz` платформы и закрой все попавшие в «Работу над ошибками» темы.",
      "Реши 10 ключевых алгоритмических задач в `/practice` без единой подсказки.",
      "Подготовь короткую 2-минутную самопрезентацию («Расскажите о себе и вашем опыте разработки»).",
    ],
    resources: [
      JAVA_INTERVIEW_RU,
      ROADMAP_JAVA,
      baeldung("java-interview-questions", "Baeldung: Java Interview Questions"),
    ],
  },

  /* ================================================================== */
  /*  DAY 83 — Финальный дипломный проект: REST API «Task Tracker»      */
  /* ================================================================== */
  83: {
    deepDive: [
      h("Финал 84-дневного буткемпа: создаём портфолио-проект уровня Middle/Junior+"),
      p("Поздравляем с выходом на финишную прямую! Ваша цель на завершающем этапе — объединить **все модули курса** (ООП, Collections, Stream API, PostgreSQL, Flyway, Git, Spring Boot, JPA, Security JWT, JUnit/Mockito и Docker Compose) в единый, готовый к коммерческому показу пет-проект для резюме: **REST API трекер задач «Task Tracker»** (аналог мини-Jira / Trello бэкенда)."),
      h("Техническое задание (ТЗ) и архитектура Task Tracker"),
      table(
        ["Модуль / Технология", "Как применяется в «Task Tracker»"],
        ["**PostgreSQL + Flyway**", "Миграции `V1__init.sql` (таблицы `users`, `projects`, `tasks`), внешние ключи, `CHECK` на статус (`TODO`, `IN_PROGRESS`, `DONE`), индексы по `assignee_id` и `status`."],
        ["**Spring Security + JWT**", "Эндпоинты `/api/v1/auth/register` и `/api/v1/auth/login` с BCrypt-хешированием, выдача JWT-токена и защита `/api/v1/tasks/**` фильтром."],
        ["**Spring Data JPA + DTO**", "Entity с `LAZY`-связями + `@EntityGraph`/`JOIN FETCH` без N+1; `record` DTO с Bean Validation (`@NotBlank`, `@FutureOrPresent` на `dueDate`) и глобальным `@RestControllerAdvice`."],
        ["**Spring Web + Swagger**", "CRUD задач, фильтрация по статусу/приоритету, смена статуса (`PATCH /api/v1/tasks/{id}/status`), пагинация `Pageable` + живая документация `/swagger-ui.html`."],
        ["**JUnit 5 + Mockito + Docker**", "Unit-тесты на `TaskService` и `AuthService`, интеграционные тесты, `Multi-stage Dockerfile` и `docker-compose.yml` для запуска 1 командой!"],
      ),
      h("Проектирование эндпоинтов REST API"),
      code(r`
POST   /api/v1/auth/register      -> 201 Created (регистрация + JWT)
POST   /api/v1/auth/login         -> 200 OK (логин + JWT)
GET    /api/v1/tasks?status=TODO&page=0&size=20 -> 200 OK (страница задач текущего юзера)
POST   /api/v1/tasks              -> 201 Created (создание новой задачи)
PATCH  /api/v1/tasks/{id}/status  -> 200 OK (переход TODO -> IN_PROGRESS -> DONE)
DELETE /api/v1/tasks/{id}         -> 204 No Content (удаление владельцем или ADMIN)
`, "Спецификация REST API дипломного проекта Task Tracker", "text"),
      h("Проверка бизнес-логики переходов статусов прямо в песочнице!"),
      p("Отличная практика для дипломного проекта — проверять допустимые переходы статусов (State Machine) и права владения задачей прямо в доменной модели / сервисе. Например, нельзя вернуть уже закрытую (`DONE`) задачу сразу в `TODO` в обход правил, или чужой пользователь не должен удалить вашу задачу (`403 Forbidden`)!"),
      code(r`
import java.time.LocalDate;
import java.util.*;

enum TaskStatus { TODO, IN_PROGRESS, DONE }

class TaskModel {
    final long id;
    final String owner;
    String title;
    TaskStatus status = TaskStatus.TODO;
    final LocalDate dueDate;

    TaskModel(long id, String owner, String title, LocalDate dueDate) {
        this.id = id; this.owner = owner; this.title = title; this.dueDate = dueDate;
    }

    public void moveTo(TaskStatus next, String caller) {
        if (!owner.equals(caller)) {
            throw new SecurityException("403 Forbidden: менять статус может только владелец задачи!");
        }
        if (this.status == TaskStatus.DONE && next == TaskStatus.TODO) {
            throw new IllegalStateException("409 Conflict: закрытую задачу нельзя вернуть напрямую в TODO!");
        }
        this.status = next;
    }
}

public class Main {
    public static void main(String[] args) {
        TaskModel t = new TaskModel(1L, "ali", "Настроить Docker Compose", LocalDate.now().plusDays(2));
        t.moveTo(TaskStatus.IN_PROGRESS, "ali");
        t.moveTo(TaskStatus.DONE, "ali");
        System.out.println("Задача #" + t.id + " (" + t.title + ") -> " + t.status);

        try {
            t.moveTo(TaskStatus.TODO, "other_user");
        } catch (RuntimeException e) {
            System.out.println("Защита сработала: " + e.getMessage());
        }
    }
}`, "Доменная модель State Machine и проверки владельца для Task Tracker в Main.java"),
      h("План деплоя и презентации проекта работодателю"),
      list(
        "**1. Соберите локально** на Spring Initializr (`start.spring.io`) с PostgreSQL и Flyway.",
        "**2. Покройте тестами** минимум ключевые сценарии сервиса (`create`, `changeStatus`, `unauthorizedAccess`).",
        "**3. Оформите GitHub репозиторий:** добавьте схему БД, примеры cURL/JSON запросов в `README.md`, `Dockerfile` и `docker-compose.yml`.",
        "**4. Задеплойте** на бесплатный/доступный облачный хостинг (Railway, Render, VPS) с Swagger UI, чтобы рекрутер и техлид могли потыкать ваш живой API прямо в браузере!",
      ),
      tip("Поздравляем с прохождением полного курса JavaForge (84 дня)!", "Обязательно закрепите теорию в разделе **«Квизы & Собес» (`/quiz`)**, добейте практику в **`/practice`** и смело откликайтесь на вакансии **Java Junior Developer**!"),
    ],
    interview: [
      { q: "Как гарантировать, что пользователь `A` не сможет удалить или отредактировать задачу пользователя `B` (IDOR vulnerability)?", a: "Никогда не доверять `userId` из тела запроса. Извлекать текущего `authenticatedUserId` строго из проверенного JWT в `SecurityContext`, сравнивать его с `task.getOwner().getId()` в сервисном слое (или в SQL `WHERE id = ? AND owner_id = ?`) и отдавать `403 Forbidden` при несовпадении." },
      { q: "Какие инструменты документации REST API используют в Spring Boot 3?", a: "`springdoc-openapi-starter-webmvc-ui` (стандарт OpenAPI 3 / Swagger UI), позволяющий тестировать защищённые JWT-эндпоинты прямо через веб-интерфейс." },
      { q: "Расскажите о вашем проекте «Task Tracker» за 1 минуту (как на собеседовании).", a: "«Это REST API бэкенд для управления задачами на Java 21 и Spring Boot 3. Использовал PostgreSQL со схемой версионирования через Flyway, Spring Data JPA с контролем N+1 через JOIN FETCH, Stateless аутентификацию по JWT и BCrypt. Реализована валидация DTO, глобальный @RestControllerAdvice, Unit-тесты на JUnit 5/Mockito, Swagger и запуск всего стека одной командой в Docker Compose»." },
    ],
    selfStudy: [
      "Создай репозиторий `task-tracker-api` на GitHub и реализуй его поэтапно по чеклисту выше.",
      "Подключи **Springdoc OpenAPI** и протестируй регистрацию и авторизацию по Bearer-токену прямо в Swagger UI.",
      "Убедись, что весь проект поднимается с нуля на чистой машине одной командой `docker compose up --build`!",
    ],
    resources: [
      link("docs", "Springdoc OpenAPI (Swagger UI for Spring Boot 3)", "https://springdoc.org/", "Автодокументация вашего REST API", "en"),
      ROADMAP_BACKEND,
      JAVA_INTERVIEW_RU,
    ],
  },
};
