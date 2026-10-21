import type { Lesson, LessonTask } from "./types";

function withDefaults(
  l: Omit<Lesson, "starterCode" | "tests" | "requiredCode" | "hints" | "solution" | "sampleInput" | "theory"> & {
    theory?: Lesson["theory"];
  }
): Lesson {
  const mainTask = l.tasks[0];
  return {
    ...l,
    theory: l.theory ?? [],
    task: mainTask,
    starterCode: mainTask.starterCode,
    sampleInput: mainTask.sampleInput,
    tests: mainTask.tests,
    requiredCode: mainTask.requiredCode,
    hints: mainTask.hints,
    solution: mainTask.solution,
  };
}

export const module5Lessons: Lesson[] = [
  /* ------------------------------------------------------------------ */
  /*  DAY 51: HTTP и REST API                                           */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 51,
    moduleId: 5,
    title: "HTTP и REST: архитектура веб-сервисов",
    short: "HTTP методы, статус-коды, JSON и принципы построения REST API",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["HTTP методы", "Статус-коды", "REST", "JSON сериализация"],
    videos: [
      { author: "Алишев", query: "Алишев REST API что это такое", note: "Архитектура REST API" },
      { author: "Заур Трегулов", query: "Заур Трегулов HTTP протокол методы коды", note: "Методы и коды HTTP" },
    ],
    theory: [
      { type: "h", text: "Как общаются клиент и бэкенд по HTTP" },
      {
        type: "p",
        text: "HTTP — это текстовый протокол формата «запрос-ответ». Клиент шлет HTTP-метод (GET, POST, PUT, DELETE) и URL ресурса. Сервер возвращает числовой код статуса и тело ответа (чаще всего JSON).",
      },
      {
        type: "table",
        head: ["Метод", "Операция CRUD", "Статус успешного ответа"],
        rows: [
          ["GET", "Read (чтение списка или объекта)", "200 OK"],
          ["POST", "Create (создание нового ресурса)", "201 Created"],
          ["PUT / PATCH", "Update (обновление данных)", "200 OK"],
          ["DELETE", "Delete (удаление ресурса)", "204 No Content / 200 OK"],
        ],
      },
    ],
    tasks: [
      {
        id: "d51_t1",
        type: "warmup",
        title: "Задача 1: Разминка (HTTP Status Code Resolver)",
        shortDesc: "Определение статуса ответа по типу операции",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Напиши программу, определяющую правильный HTTP статус-код по имени действия.\n" +
          "• `READ_SUCCESS` -> `200 OK`\n" +
          "• `CREATED` -> `201 Created`\n" +
          "• `BAD_REQUEST` -> `400 Bad Request`\n" +
          "• `UNAUTHORIZED` -> `401 Unauthorized`\n" +
          "• `FORBIDDEN` -> `403 Forbidden`\n" +
          "• `NOT_FOUND` -> `404 Not Found`\n" +
          "• `SERVER_ERROR` -> `500 Internal Server Error`\n" +
          "Если действие неизвестно, выведи `Unknown`.",
        sampleInput: "CREATED",
        exampleOutput: "201 Created",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String action = scanner.nextLine().trim();

        // TODO: выведи соответствующий HTTP код и описание
    }
}
`,
        hints: ["Используй switch-case по строке action."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String action = scanner.nextLine().trim();

        String status = switch (action) {
            case "READ_SUCCESS" -> "200 OK";
            case "CREATED" -> "201 Created";
            case "BAD_REQUEST" -> "400 Bad Request";
            case "UNAUTHORIZED" -> "401 Unauthorized";
            case "FORBIDDEN" -> "403 Forbidden";
            case "NOT_FOUND" -> "404 Not Found";
            case "SERVER_ERROR" -> "500 Internal Server Error";
            default -> "Unknown";
        };

        System.out.println(status);
    }
}
`,
        tests: [
          { label: "Успешное создание", stdin: "CREATED\n", expected: ["201 Created"] },
          { label: "Ресурс не найден", stdin: "NOT_FOUND\n", expected: ["404 Not Found"] },
          { label: "Ошибка сервера", stdin: "SERVER_ERROR\n", expected: ["500 Internal Server Error"] },
        ],
      },
      {
        id: "d51_t2",
        type: "practice",
        title: "Задача 2: Практика (Парсер URL REST эндпоинта)",
        shortDesc: "Извлечение ресурса и идентификатора из URL",
        difficulty: "Средний",
        xp: 35,
        description:
          "Дан путь эндпоинта вида `/api/v1/{resource}/{id}` (например, `/api/v1/users/42`).\n" +
          "Извлеки и выведи ресурс и числовой ID в формате `Ресурс: <resource>, ID: <id>`.\n" +
          "Если путь не содержит числового ID (например `/api/v1/users`), выведи `Ресурс: <resource>, ID: ALL`.",
        sampleInput: "/api/v1/products/108",
        exampleOutput: "Ресурс: products, ID: 108",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String path = scanner.nextLine().trim();

        // TODO: разбей path по '/' и извлеки ресурс и id
    }
}
`,
        hints: ["Используй path.split(\"/\"). Проверь длину полученного массива."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String path = scanner.nextLine().trim();
        String[] parts = path.split("/");

        // parts[0] = "", parts[1] = "api", parts[2] = "v1", parts[3] = resource, parts[4] = id (если есть)
        if (parts.length >= 4) {
            String resource = parts[3];
            String id = (parts.length >= 5) ? parts[4] : "ALL";
            System.out.println("Ресурс: " + resource + ", ID: " + id);
        }
    }
}
`,
        tests: [
          { label: "С конкретным ID", stdin: "/api/v1/products/108\n", expected: ["Ресурс: products, ID: 108"] },
          { label: "Общий список", stdin: "/api/v1/users\n", expected: ["Ресурс: users, ID: ALL"] },
        ],
      },
      {
        id: "d51_t3",
        type: "homework",
        title: "Задача 3: Домашка (JSON сериализатор ответа API)",
        shortDesc: "Формирование стандартизированного JSON объекта ответа",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Напиши генератор JSON ответа API. На вход подаются: `statusCode` (int), `message` (строка), `success` (boolean).\n" +
          "Сформируй и выведи валидный JSON без внешних библиотек:\n" +
          `{"status":<statusCode>,"success":<success>,"message":"<message>"}\``,
        sampleInput: "200 true Operation completed successfully",
        exampleOutput: "{\"status\":200,\"success\":true,\"message\":\"Operation completed successfully\"}",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int status = scanner.nextInt();
        boolean success = scanner.nextBoolean();
        String message = scanner.nextLine().trim();

        // TODO: сформируй JSON строку
    }
}
`,
        hints: ["Экранируй кавычки в Java: \\\"."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int status = scanner.nextInt();
        boolean success = scanner.nextBoolean();
        String message = scanner.nextLine().trim();

        String json = "{\"status\":" + status + ",\"success\":" + success + ",\"message\":\"" + message + "\"}";
        System.out.println(json);
    }
}
`,
        tests: [
          {
            label: "Успешный JSON",
            stdin: "200 true Operation completed successfully\n",
            expected: ["{\"status\":200,\"success\":true,\"message\":\"Operation completed successfully\"}"],
          },
        ],
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 52: Spring Core: IoC и DI                                     */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 52,
    moduleId: 5,
    title: "Spring Core: IoC и Dependency Injection",
    short: "Инверсия управления, Spring бины, внедрение через конструктор",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["Inversion of Control", "Dependency Injection", "ApplicationContext", "Singleton"],
    videos: [
      { author: "Алишев", query: "Алишев Spring IoC DI внедрение зависимостей", note: "IoC и DI с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов Spring Dependency Injection", note: "Spring Bean и конфигурация" },
    ],
    tasks: [
      {
        id: "d52_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Ручной симулятор DI контейнера)",
        shortDesc: "Регистрация и получение бинов из реестра",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "В Spring бины регистрируются в `ApplicationContext`. Смоделируй простейший контекст бинов на основе `Map<String, Object>`.\n" +
          "Считай N регистраций `бин_имя значение` и M запросов на получение бина.\n" +
          "Для каждого запроса выведи `BEAN <name>: <value>` или `NO SUCH BEAN`.",
        sampleInput: "2\nmailService MailSenderImpl\nuserRepo PostgresUserRepo\n2\nmailService\norderRepo",
        exampleOutput: "BEAN mailService: MailSenderImpl\nNO SUCH BEAN",
        starterCode: `import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Map<String, String> context = new HashMap<>();

        for (int i = 0; i < n; i++) {
            context.put(scanner.next(), scanner.next());
        }

        int m = scanner.nextInt();
        for (int i = 0; i < m; i++) {
            String beanName = scanner.next();
            // TODO: найди бин в context и выведи результат
        }
    }
}
`,
        hints: ["Проверяй context.containsKey(beanName)."],
        solution: `import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Map<String, String> context = new HashMap<>();

        for (int i = 0; i < n; i++) {
            context.put(scanner.next(), scanner.next());
        }

        int m = scanner.nextInt();
        for (int i = 0; i < m; i++) {
            String beanName = scanner.next();
            if (context.containsKey(beanName)) {
                System.out.println("BEAN " + beanName + ": " + context.get(beanName));
            } else {
                System.out.println("NO SUCH BEAN");
            }
        }
    }
}
`,
        tests: [
          {
            label: "Реестр бинов",
            stdin: "2\nmailService MailSenderImpl\nuserRepo PostgresUserRepo\n2\nmailService\norderRepo\n",
            expected: ["BEAN mailService: MailSenderImpl", "NO SUCH BEAN"],
          },
        ],
      },
      {
        id: "d52_t2",
        type: "practice",
        title: "Задача 2: Практика (Внедрение зависимости через конструктор)",
        shortDesc: "Сборка сервиса с инжектом репозитория без new внутри",
        difficulty: "Средний",
        xp: 35,
        description:
          "По правилам Clean Architecture сервис не должен создавать репозиторий через `new`, он принимает его через конструктор.\n" +
          "Создай класс `Service`, принимающий строку `dependency` в конструкторе. Метод `execute()` выводит `Service executed using: <dependency>`.\n" +
          "Считай имя зависимости и вызови метод.",
        sampleInput: "JdbcUserRepository",
        exampleOutput: "Service executed using: JdbcUserRepository",
        starterCode: `import java.util.Scanner;

public class Main {
    static class Service {
        private final String dependency;

        public Service(String dependency) {
            this.dependency = dependency;
        }

        public void execute() {
            // TODO: выведи строку с зависимостью
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String dep = scanner.nextLine().trim();

        Service service = new Service(dep);
        service.execute();
    }
}
`,
        hints: ["Выведи System.out.println(\"Service executed using: \" + dependency);"],
        solution: `import java.util.Scanner;

public class Main {
    static class Service {
        private final String dependency;

        public Service(String dependency) {
            this.dependency = dependency;
        }

        public void execute() {
            System.out.println("Service executed using: " + dependency);
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String dep = scanner.nextLine().trim();

        Service service = new Service(dep);
        service.execute();
    }
}
`,
        tests: [
          { label: "Инжект репозитория", stdin: "JdbcUserRepository\n", expected: ["Service executed using: JdbcUserRepository"] },
        ],
      },
      {
        id: "d52_t3",
        type: "homework",
        title: "Задача 3: Домашка (Singleton vs Prototype Scope)",
        shortDesc: "Сравнение ссылок для разных скоупов бинов в Spring",
        difficulty: "Сложный",
        xp: 40,
        description:
          "В Spring бины со скоупом `singleton` создаются 1 раз (ссылки равны `b1 == b2`).\n" +
          "Бины со скоупом `prototype` создаются заново при каждом обращении (`p1 != p2`).\n" +
          "Считай имя скоупа (`singleton` или `prototype`) и количество обращений K.\n" +
          "Для `singleton` выведи `Instance ID: 1` для всех K обращений.\n" +
          "Для `prototype` выведи `Instance ID: 1`, `Instance ID: 2` ... `Instance ID: K`.",
        sampleInput: "prototype 3",
        exampleOutput: "Instance ID: 1\nInstance ID: 2\nInstance ID: 3",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String scope = scanner.next();
        int k = scanner.nextInt();

        // TODO: смоделируй поведение singleton и prototype
    }
}
`,
        hints: ["Для singleton выводи всегда 1, для prototype инкрементируй счетчик."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String scope = scanner.next();
        int k = scanner.nextInt();

        for (int i = 1; i <= k; i++) {
            int instanceId = scope.equalsIgnoreCase("singleton") ? 1 : i;
            System.out.println("Instance ID: " + instanceId);
        }
    }
}
`,
        tests: [
          {
            label: "Тест prototype",
            stdin: "prototype 3\n",
            expected: ["Instance ID: 1", "Instance ID: 2", "Instance ID: 3"],
          },
          {
            label: "Тест singleton",
            stdin: "singleton 3\n",
            expected: ["Instance ID: 1", "Instance ID: 1", "Instance ID: 1"],
          },
        ],
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 55: DTO, валидация и ошибки                                   */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 55,
    moduleId: 5,
    title: "DTO, валидация и глобальная обработка ошибок",
    short: "Data Transfer Object, Jakarta Bean Validation, @ControllerAdvice",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["DTO pattern", "Bean Validation", "@Valid", "@ControllerAdvice"],
    videos: [
      { author: "Алишев", query: "Алишев Spring Boot валидация DTO", note: "Валидация аннотациями в Spring" },
      { author: "Заур Трегулов", query: "Заур Трегулов Spring ControllerAdvice обработка ошибок", note: "Глобальный ExceptionHandler" },
    ],
    tasks: [
      {
        id: "d55_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Валидатор DTO пользователя)",
        shortDesc: "Проверка правил @NotBlank, @Email и @Min(18)",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Смоделируй валидацию `@Valid` для DTO: имя не должно быть пустым, email должен содержать `@` и возраст должен быть от 18 лет.\n" +
          "Считай `name`, `email`, `age`. Если все валидно, выведи `VALID DTO`. Если есть ошибка, выведи `VALIDATION FAILED: <причина>`.",
        sampleInput: "Alex alex@mail.com 20",
        exampleOutput: "VALID DTO",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.next();
        String email = scanner.next();
        int age = scanner.nextInt();

        // TODO: проверь поля DTO на валидность
    }
}
`,
        hints: ["Проверяй name.isEmpty(), !email.contains(\"@\") и age < 18."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.next();
        String email = scanner.next();
        int age = scanner.nextInt();

        if (name.trim().isEmpty()) {
            System.out.println("VALIDATION FAILED: name cannot be blank");
        } else if (!email.contains("@")) {
            System.out.println("VALIDATION FAILED: invalid email format");
        } else if (age < 18) {
            System.out.println("VALIDATION FAILED: age must be at least 18");
        } else {
            System.out.println("VALID DTO");
        }
    }
}
`,
        tests: [
          { label: "Корректный DTO", stdin: "Alex alex@mail.com 20\n", expected: ["VALID DTO"] },
          { label: "Ошибочный возраст", stdin: "Alex alex@mail.com 16\n", expected: ["VALIDATION FAILED: age must be at least 18"] },
          { label: "Кривой email", stdin: "Alex bademail 25\n", expected: ["VALIDATION FAILED: invalid email format"] },
        ],
      },
      {
        id: "d55_t2",
        type: "practice",
        title: "Задача 2: Практика (Маппер Entity -> DTO)",
        shortDesc: "Скрытие конфиденциальных полей (password) при отдаче наружу",
        difficulty: "Средний",
        xp: 35,
        description:
          "Сущность `UserEntity` содержит: `id`, `username`, `password_hash`, `email`.\n" +
          "При отдаче в контроллер пароль должен скрываться в `UserResponseDto(id, username, email)`.\n" +
          "Считай 4 поля сущности и выведи публичный DTO в формате `DTO[id=<id>, username=<name>, email=<email>]`.",
        sampleInput: "1 Alex $2a$12$e0M2/q... alex@mail.com",
        exampleOutput: "DTO[id=1, username=Alex, email=alex@mail.com]",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long id = scanner.nextLong();
        String username = scanner.next();
        String passwordHash = scanner.next(); // Секретный пароль!
        String email = scanner.next();

        // TODO: собери и выведи DTO без пароля
    }
}
`,
        hints: ["Не включай passwordHash в итоговую строку вывода."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long id = scanner.nextLong();
        String username = scanner.next();
        String passwordHash = scanner.next();
        String email = scanner.next();

        System.out.println("DTO[id=" + id + ", username=" + username + ", email=" + email + "]");
    }
}
`,
        tests: [
          {
            label: "Маппинг без пароля",
            stdin: "1 Alex $2a$12$e0M2/q... alex@mail.com\n",
            expected: ["DTO[id=1, username=Alex, email=alex@mail.com]"],
          },
        ],
      },
      {
        id: "d55_t3",
        type: "homework",
        title: "Задача 3: Домашка (Глобальный перехватчик исключений)",
        shortDesc: "Симулятор @ControllerAdvice с преобразованием ошибок в JSON",
        difficulty: "Сложный",
        xp: 40,
        description:
          "В Spring `@ControllerAdvice` перехватывает исключения и отдает клиенту структурированный JSON с ошибкой.\n" +
          "Считай тип исключения: `EntityNotFoundException` или `IllegalArgumentException` и текст сообщения.\n" +
          "Для `EntityNotFoundException` выведи HTTP статус `404` и JSON `{\"error\":\"Not Found\",\"message\":\"<msg>\"}`.\n" +
          "Для `IllegalArgumentException` выведи `400` и JSON `{\"error\":\"Bad Request\",\"message\":\"<msg>\"}`.",
        sampleInput: "EntityNotFoundException User with id 99 not found",
        exampleOutput: "HTTP 404\n{\"error\":\"Not Found\",\"message\":\"User with id 99 not found\"}",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String exType = scanner.next();
        String msg = scanner.nextLine().trim();

        // TODO: сформируй HTTP статус и JSON ошибки
    }
}
`,
        hints: ["Используй switch по exType."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String exType = scanner.next();
        String msg = scanner.nextLine().trim();

        if (exType.equals("EntityNotFoundException")) {
            System.out.println("HTTP 404");
            System.out.println("{\"error\":\"Not Found\",\"message\":\"" + msg + "\"}");
        } else {
            System.out.println("HTTP 400");
            System.out.println("{\"error\":\"Bad Request\",\"message\":\"" + msg + "\"}");
        }
    }
}
`,
        tests: [
          {
            label: "404 Not Found",
            stdin: "EntityNotFoundException User with id 99 not found\n",
            expected: [
              "HTTP 404",
              "{\"error\":\"Not Found\",\"message\":\"User with id 99 not found\"}",
            ],
          },
          {
            label: "400 Bad Request",
            stdin: "IllegalArgumentException Negative amount is not allowed\n",
            expected: [
              "HTTP 400",
              "{\"error\":\"Bad Request\",\"message\":\"Negative amount is not allowed\"}",
            ],
          },
        ],
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 61: Spring Security и JWT                                     */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 61,
    moduleId: 5,
    title: "Spring Security и JWT: защита REST API",
    short: "Аутентификация, авторизация, структура токенов JWT, BCrypt",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["SecurityFilterChain", "JWT", "BCrypt", "Ролевая модель"],
    videos: [
      { author: "Алишев", query: "Алишев Spring Security JWT", note: "Spring Security и авторизация токенами" },
      { author: "Заур Трегулов", query: "Заур Трегулов Spring Security основы", note: "Аутентификация и BCrypt" },
    ],
    tasks: [
      {
        id: "d61_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Валидатор формата JWT токена)",
        shortDesc: "Проверка наличия 3 частей токена, разделенных точками",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "JWT токен всегда состоит ровно из трех частей (Header.Payload.Signature), разделенных символом точки `.`, закодированных в Base64.\n" +
          "Считай строку токена. Если она содержит ровно 2 точки (3 части) и ни одна из частей не пустая, выведи `VALID JWT FORMAT`, иначе `MALFORMED JWT`.",
        sampleInput: "eyJhbGciOi...eyJzdWIiOi...SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        exampleOutput: "VALID JWT FORMAT",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String token = scanner.nextLine().trim();

        // TODO: проверь разделение на 3 непустые части точками
    }
}
`,
        hints: ["Используй token.split(\"\\\\.\", -1) и проверь parts.length == 3."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String token = scanner.nextLine().trim();

        String[] parts = token.split("\\\\.", -1);
        boolean isValid = parts.length == 3 && !parts[0].isEmpty() && !parts[1].isEmpty() && !parts[2].isEmpty();

        if (isValid) {
            System.out.println("VALID JWT FORMAT");
        } else {
            System.out.println("MALFORMED JWT");
        }
    }
}
`,
        tests: [
          {
            label: "Корректный JWT",
            stdin: "header.payload.signature\n",
            expected: ["VALID JWT FORMAT"],
          },
          {
            label: "Ошибочный JWT из 2 частей",
            stdin: "header.payload\n",
            expected: ["MALFORMED JWT"],
          },
        ],
      },
      {
        id: "d61_t2",
        type: "practice",
        title: "Задача 2: Практика (Проверка ролей авторизации @PreAuthorize)",
        shortDesc: "Контроль доступа к эндпоинту по списку ролей пользователя",
        difficulty: "Средний",
        xp: 35,
        description:
          "Эндпоинт удаления пользователей требует роль `ROLE_ADMIN`.\n" +
          "На вход подается список ролей пользователя через пробел (например, `ROLE_USER ROLE_MODERATOR`).\n" +
          "Если среди ролей есть `ROLE_ADMIN`, выведи `ACCESS GRANTED: 200 OK`. Иначе выведи `ACCESS DENIED: 403 Forbidden`.",
        sampleInput: "ROLE_USER ROLE_ADMIN",
        exampleOutput: "ACCESS GRANTED: 200 OK",
        starterCode: `import java.util.Scanner;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String rolesLine = scanner.nextLine();

        // TODO: проверь наличие ROLE_ADMIN
    }
}
`,
        hints: ["Используй rolesLine.contains(\"ROLE_ADMIN\")."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String rolesLine = scanner.nextLine();

        if (rolesLine.contains("ROLE_ADMIN")) {
            System.out.println("ACCESS GRANTED: 200 OK");
        } else {
            System.out.println("ACCESS DENIED: 403 Forbidden");
        }
    }
}
`,
        tests: [
          { label: "Админ роль", stdin: "ROLE_USER ROLE_ADMIN\n", expected: ["ACCESS GRANTED: 200 OK"] },
          { label: "Обычный юзер", stdin: "ROLE_USER\n", expected: ["ACCESS DENIED: 403 Forbidden"] },
        ],
      },
      {
        id: "d61_t3",
        type: "homework",
        title: "Задача 3: Домашка (Парсинг Payload JWT: извлечение username)",
        shortDesc: "Base64 декодирование полезной нагрузки токена",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Вторая часть токена (Payload) закодирована в Base64. Внутри находится JSON со строкой `\"sub\":\"<username>\"`.\n" +
          "Дана строка `Payload` в Base64 (например, декодированная строка содержит `{\"sub\":\"timur_dev\",\"exp\":1700000000}`).\n" +
          "Считай Base64 строку, раскодируй ее через `java.util.Base64` и извлеки имя пользователя, выводя `Subject: <username>`.",
        sampleInput: "eyJzdWIiOiJhbGV4X2p1bmlvciJ9", // {"sub":"alex_junior"}
        exampleOutput: "Subject: alex_junior",
        starterCode: `import java.util.Scanner;
import java.util.Base64;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String base64Payload = scanner.nextLine().trim();

        // TODO: декодируй base64 и найди "sub":"<name>"
    }
}
`,
        hints: [
          "byte[] decoded = Base64.getUrlDecoder().decode(base64Payload);",
          "String json = new String(decoded);",
          "Используй регулярное выражение или substring для поиска между '\"sub\":\"' и '\"'",
        ],
        solution: `import java.util.Scanner;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String base64Payload = scanner.nextLine().trim();

        try {
            byte[] decoded = Base64.getUrlDecoder().decode(base64Payload);
            String json = new String(decoded);

            Pattern p = Pattern.compile("\"sub\":\"([^\"]+)\"");
            Matcher m = p.matcher(json);
            if (m.find()) {
                System.out.println("Subject: " + m.group(1));
            } else {
                System.out.println("Subject: not found");
            }
        } catch (Exception e) {
            System.out.println("Subject: decode error");
        }
    }
}
`,
        tests: [
          {
            label: "Декодирование alex_junior",
            stdin: "eyJzdWIiOiJhbGV4X2p1bmlvciJ9\n",
            expected: ["Subject: alex_junior"],
          },
        ],
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 62: Docker: контейнеризация приложений                        */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 62,
    moduleId: 5,
    title: "Docker: контейнеризация приложений",
    short: "Образы, контейнеры, multi-stage Dockerfile для Spring Boot",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["image / container", "Dockerfile", "Multi-stage build", "docker run"],
    videos: [
      { author: "Алишев", query: "Алишев Docker для начинающих", note: "Контейнеризация и Dockerfile" },
      { author: "Заур Трегулов", query: "Заур Трегулов Docker основы", note: "Docker образы и запуск" },
    ],
    tasks: [
      {
        id: "d62_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Валидатор проброса портов Docker)",
        shortDesc: "Проверка синтаксиса флага -p host:container",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Команда запуска `docker run -p 8080:8080` пробрасывает порт хоста на порт контейнера.\n" +
          "Считай строку порта вида `<host_port>:<container_port>`. Если оба порта являются корректными числами от 1 до 65535, выведи `PORT MAPPING VALID`, иначе `INVALID PORT`.",
        sampleInput: "8080:8080",
        exampleOutput: "PORT MAPPING VALID",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String portMap = scanner.nextLine().trim();

        // TODO: проверь формат port1:port2
    }
}
`,
        hints: ["Разбей по ':' и проверь Integer.parseInt в диапазоне 1..65535."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String portMap = scanner.nextLine().trim();

        try {
            String[] parts = portMap.split(":");
            if (parts.length == 2) {
                int p1 = Integer.parseInt(parts[0]);
                int p2 = Integer.parseInt(parts[1]);
                if (p1 >= 1 && p1 <= 65535 && p2 >= 1 && p2 <= 65535) {
                    System.out.println("PORT MAPPING VALID");
                    return;
                }
            }
            System.out.println("INVALID PORT");
        } catch (Exception e) {
            System.out.println("INVALID PORT");
        }
    }
}
`,
        tests: [
          { label: "Валидный порт 8080:8080", stdin: "8080:8080\n", expected: ["PORT MAPPING VALID"] },
          { label: "Неверный порт 99999", stdin: "99999:80\n", expected: ["INVALID PORT"] },
        ],
      },
      {
        id: "d62_t2",
        type: "practice",
        title: "Задача 2: Практика (Генератор multi-stage Dockerfile)",
        shortDesc: "Построение оптимального Dockerfile для Java 21",
        difficulty: "Средний",
        xp: 35,
        description:
          "На вход подается имя JAR файла (например `app.jar`) и порт (например `8080`).\n" +
          "Сформируй две завершающие строки production Dockerfile:\n" +
          "`EXPOSE <port>`\n" +
          "`ENTRYPOINT [\"java\", \"-jar\", \"<jarName>\"]`",
        sampleInput: "app.jar 8080",
        exampleOutput: "EXPOSE 8080\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String jarName = scanner.next();
        int port = scanner.nextInt();

        // TODO: выведи EXPOSE и ENTRYPOINT
    }
}
`,
        hints: ["Экранируй кавычки в Java для ENTRYPOINT."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String jarName = scanner.next();
        int port = scanner.nextInt();

        System.out.println("EXPOSE " + port);
        System.out.println("ENTRYPOINT [\\\"java\\\", \\\"-jar\\\", \\\"" + jarName + "\\\"]");
    }
}
`,
        tests: [
          {
            label: "Генерация директив",
            stdin: "app.jar 8080\n",
            expected: [
              "EXPOSE 8080",
              "ENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]",
            ],
          },
        ],
      },
      {
        id: "d62_t3",
        type: "homework",
        title: "Задача 3: Домашка (Симулятор Docker Containers Status)",
        shortDesc: "Фильтрация списка контейнеров по статусу Up / Exited",
        difficulty: "Сложный",
        xp: 40,
        description:
          "На вход подается число контейнеров N, затем N строк вида `name status` (например `postgres Up`, `redis Exited`).\n" +
          "Выведи количество работающих контейнеров в формате `RUNNING CONTAINERS: <count>` и их имена через запятую.",
        sampleInput: "3\npostgres Up\nbackend Up\nredis Exited",
        exampleOutput: "RUNNING CONTAINERS: 2\npostgres, backend",
        starterCode: `import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<String> running = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            String name = scanner.next();
            String status = scanner.next();
            // TODO: если status равен "Up", добавь в running
        }

        // TODO: выведи количество и список
    }
}
`,
        hints: ["Используй String.join(\", \", running) для красивого вывода."],
        solution: `import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<String> running = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            String name = scanner.next();
            String status = scanner.next();
            if (status.equalsIgnoreCase("Up")) {
                running.add(name);
            }
        }

        System.out.println("RUNNING CONTAINERS: " + running.size());
        System.out.println(String.join(", ", running));
    }
}
`,
        tests: [
          {
            label: "2 из 3 работают",
            stdin: "3\npostgres Up\nbackend Up\nredis Exited\n",
            expected: [
              "RUNNING CONTAINERS: 2",
              "postgres, backend",
            ],
          },
        ],
      },
    ],
  }),
];
