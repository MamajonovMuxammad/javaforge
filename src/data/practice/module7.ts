import type { PracticeTask } from "./types";

export const module7PracticeTasks: PracticeTask[] = [
  {
    id: "pr_m7_log_parser",
    moduleId: 7,
    moduleName: "Модуль 7 и 8: Архитектура, SQL и Backend-практика",
    topic: "Анализ логов и парсинг строк",
    title: "Анализатор логов доступа веб-сервера NGINX",
    difficulty: "Средний",
    xp: 35,
    description: `Напиши утилиту мониторинга, которая анализирует строки логов веб-сервера.

Формат каждой строки лога:
\`METHOD /path HTTP_STATUS DURATION_MS\`
Пример: \`GET /api/users 200 45\`

Программа считывает количество строк N и N строк логов.
Программа рассчитывает:
- Общее количество запросов
- Количество успешных ответов (статус 200..299)
- Количество клиентских ошибок (статус 400..499)
- Количество серверных ошибок (статус 500..599)
- Среднее время ответа сервером (среднее DURATION_MS в double)

Формат вывода:
\`\`\`text
Всего запросов: [total]
Успешно (2xx): [count2xx]
Ошибки клиента (4xx): [count4xx]
Ошибки сервера (5xx): [count5xx]
Среднее время ответа: [avg] ms
\`\`\``,
    exampleInput: "4\nGET /api/users 200 50\nPOST /api/login 200 120\nGET /api/profile 401 20\nGET /api/pay 500 250",
    exampleOutput: "Всего запросов: 4\nУспешно (2xx): 2\nОшибки клиента (4xx): 1\nОшибки сервера (5xx): 1\nСреднее время ответа: 110.0 ms",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        
        // TODO: считай N строк логов, распарси статус и длительность и посчитай метрики
        
    }
}`,
    theory: {
      title: "Парсинг серверных логов в Java",
      summary: "Разбор текстовых протоколов и сбор метрик.",
      keyPoints: [
        "String[] parts = line.split(\"\\\\s+\"); разбивает строку на токены: метод, путь, статус, длительность.",
        "int status = Integer.parseInt(parts[2]);",
        "int duration = Integer.parseInt(parts[3]);",
        "Классификация HTTP статусов: 200..299 (2xx), 400..499 (4xx), 500..599 (5xx)."
      ],
      codeExample: `int count2xx = 0, count4xx = 0, count5xx = 0;
double totalDuration = 0;
for (int i = 0; i < n; i++) {
    String[] parts = sc.nextLine().trim().split("\\\\s+");
    int status = Integer.parseInt(parts[2]);
    int dur = Integer.parseInt(parts[3]);
    if (status >= 200 && status < 300) count2xx++;
    else if (status >= 400 && status < 500) count4xx++;
    else if (status >= 500 && status < 600) count5xx++;
    totalDuration += dur;
}
double avg = n > 0 ? totalDuration / n : 0.0;`,
      pitfalls: [
        "Используй Double для среднего времени ответа, чтобы не терять точность."
      ]
    },
    tests: [
      {
        label: "4 запроса (200, 200, 401, 500)",
        stdin: "4\nGET /api/users 200 50\nPOST /api/login 200 120\nGET /api/profile 401 20\nGET /api/pay 500 250\n",
        expected: ["Всего запросов: 4", "Успешно (2xx): 2", "Ошибки клиента (4xx): 1", "Ошибки сервера (5xx): 1", "Среднее время ответа: 110.0 ms"]
      }
    ],
    hints: [
      "Разбивай строку методом `line.split(\"\\\\s+\")`.",
      "Статус — это `parts[2]`, а время — `parts[3]`."
    ]
  },
  {
    id: "pr_m7_lru_cache",
    moduleId: 7,
    moduleName: "Модуль 7 и 8: Архитектура, SQL и Backend-практика",
    topic: "Алгоритмы кэширования: LinkedHashMap",
    title: "LRU-кэш на основе LinkedHashMap",
    difficulty: "Сложный",
    xp: 45,
    description: `LRU (Least Recently Used) кэш — популярный алгоритм кэширования: при превышении лимита емкости вытесняется элемент, к которому дольше всего не обращались.

Реализуй класс \`SimpleLRUCache<K, V>\` на базе \`LinkedHashMap\`:
- Конструктор: \`public SimpleLRUCache(int capacity)\`
- В конструкторе вызови \`super(capacity, 0.75f, true)\` — третий аргумент \`accessOrder = true\` переставляет элемент в конец при каждом вызове \`get()\` или \`put()\`.
- Переопредели метод:
  \`protected boolean removeEldestEntry(Map.Entry<K, V> eldest) { return size() > capacity; }\`
- Методы:
  - \`public void put(K key, V value)\`
  - \`public V get(K key)\`
  - \`public Set<K> getKeys()\` — возвращает ключи в текущем порядке кэша.

В main():
Создай кэш емкостью 3 элемента.
Выполни команды добавления и чтения:
- PUT user1 Alice
- PUT user2 Bob
- PUT user3 Charlie
- GET user1 (обращение к user1 делает его самым свежим!)
- PUT user4 David (должен вытеснить user2, так как к нему не обращались!)

Формат вывода:
\`\`\`text
Емкость кэша: 3
После вставок и обращений:
Ключи в кэше: [список ключей]
Вытеснен: [ключ]
\`\`\``,
    exampleInput: "3\nPUT user1 Alice\nPUT user2 Bob\nPUT user3 Charlie\nGET user1\nPUT user4 David",
    exampleOutput: "Емкость кэша: 3\nПосле вставок и обращений:\nКлючи в кэше: [user3, user1, user4]\nВытеснен: user2",
    starterCode: `import java.util.Scanner;
import java.util.LinkedHashMap;
import java.util.Map;

class SimpleLRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public SimpleLRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // TODO: инициализируй кэш и выполни команды
        
    }
}`,
    theory: {
      title: "Архитектура LRU-кэша в стандартной библиотеке Java",
      summary: "Как устроен LinkedHashMap с режимом accessOrder = true.",
      keyPoints: [
        "LinkedHashMap совмещает хэш-таблицу для поиска за O(1) и двусвязный список для сохранения порядка.",
        "Флаг accessOrder = true: любое чтение через map.get(k) перемещает запись в хвост списка как самую свежую.",
        "removeEldestEntry вызывается после каждого put: если возвращает true, голова списка (самый старый элемент) удаляется автоматически."
      ],
      codeExample: `SimpleLRUCache<String, String> cache = new SimpleLRUCache<>(3);
cache.put("user1", "Alice");
cache.put("user2", "Bob");
cache.put("user3", "Charlie");
cache.get("user1"); // user1 теперь свежий
cache.put("user4", "David"); // user2 удален`,
      pitfalls: [
        "Не забудь передать accessOrder = true в конструктор super()."
      ]
    },
    tests: [
      {
        label: "Базовый тест LRU на 3 элемента",
        stdin: "3\nPUT user1 Alice\nPUT user2 Bob\nPUT user3 Charlie\nGET user1\nPUT user4 David\n",
        expected: ["Емкость кэша: 3", "Ключи в кэше: [user3, user1, user4]", "Вытеснен: user2"]
      }
    ],
    hints: [
      "Удалится `user2`, потому что после `get(\"user1\")` порядок стал `user2, user3, user1`."
    ]
  },
  {
    id: "pr_m7_http_router",
    moduleId: 7,
    moduleName: "Модуль 7 и 8: Архитектура, SQL и Backend-практика",
    topic: "Маршрутизация HTTP и Path Variables",
    title: "HTTP роутер: извлечение path-переменных /users/{id}",
    difficulty: "Средний",
    xp: 35,
    description: `В Spring MVC аннотация \`@GetMapping("/users/{id}")\` автоматически извлекает переменную пути.

Напиши упрощенный маршрутизатор:
- Задан шаблон пути: \`/api/users/{id}/orders/{orderId}\`
- Входящий запрос: \`/api/users/42/orders/999\`

Программа должна:
1. Сопоставить части пути по разделителю \`/\`.
2. Если длина сегментов не совпадает, вывести: \`Маршрут не совпадает\`.
3. Извлечь имена параметров из фигурных скобок \`{param}\` и их фактические значения из входящего запроса.
4. Вывести все найденные пары \`param = value\`.

Формат вывода:
\`\`\`text
Шаблон: /api/users/{id}/orders/{orderId}
Запрос: [запрос]
Параметры:
- id = [val1]
- orderId = [val2]
\`\`\``,
    exampleInput: "/api/users/42/orders/999",
    exampleOutput: "Шаблон: /api/users/{id}/orders/{orderId}\nЗапрос: /api/users/42/orders/999\nПараметры:\n- id = 42\n- orderId = 999",
    starterCode: `import java.util.Scanner;
import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String template = "/api/users/{id}/orders/{orderId}";
        String request = scanner.nextLine().trim();
        
        // TODO: разбей оба пути на сегменты через split("/") и сопоставь переменные {param}
        
    }
}`,
    theory: {
      title: "Паттерн Path Matching в веб-фреймворках",
      summary: "Как Spring MVC сопоставляет URL и переменные @PathVariable.",
      keyPoints: [
        "Строка пути разбивается на сегменты: path.split(\"/\").",
        "Сегмент шаблона проверяется на наличие фигурных скобок: segment.startsWith(\"{\") && segment.endsWith(\"}\").",
        "Имя переменной извлекается через segment.substring(1, segment.length() - 1)."
      ],
      codeExample: `String[] tParts = template.split("/");
String[] rParts = request.split("/");
if (tParts.length != rParts.length) {
    System.out.println("Маршрут не совпадает");
    return;
}
Map<String, String> params = new LinkedHashMap<>();
for (int i = 0; i < tParts.length; i++) {
    if (tParts[i].startsWith("{") && tParts[i].endsWith("}")) {
        String key = tParts[i].substring(1, tParts[i].length() - 1);
        params.put(key, rParts[i]);
    }
}`,
      pitfalls: [
        "Не забудь проверить равенство длины массивов частей пути перед циклом."
      ]
    },
    tests: [
      {
        label: "Запрос /api/users/42/orders/999",
        stdin: "/api/users/42/orders/999\n",
        expected: ["Шаблон: /api/users/{id}/orders/{orderId}", "Запрос: /api/users/42/orders/999", "- id = 42", "- orderId = 999"]
      },
      {
        label: "Несовпадающий маршрут /api/products",
        stdin: "/api/products\n",
        expected: ["Маршрут не совпадает"]
      }
    ],
    hints: [
      "Разбей строки методом `split(\"/\")`.",
      "Извлекай имя параметра `tParts[i].substring(1, tParts[i].length() - 1)`."
    ]
  },
  {
    id: "pr_m7_dto_validator",
    moduleId: 7,
    moduleName: "Модуль 7 и 8: Архитектура, SQL и Backend-практика",
    topic: "Валидация DTO (Data Transfer Object)",
    title: "Валидатор входящего DTO регистрации пользователя",
    difficulty: "Средний",
    xp: 35,
    description: `В Spring Boot за валидацию DTO отвечает Hibernate Validator (\`@Valid\`, \`@NotNull\`, \`@Email\`).

Напиши кастомный валидатор DTO для формы регистрации:
Поля DTO:
- \`username\` (строка)
- \`email\` (строка)
- \`age\` (целое число)
- \`password\` (строка)

Правила валидации:
1. \`username\`: не пустой, длина от 3 до 20 символов.
2. \`email\`: содержит символ \`@\` и хотя бы одну точку \`.\` после собаки.
3. \`age\`: должен быть от 18 до 100 лет включительно.
4. \`password\`: длина не менее 8 символов.

Программа считывает поля DTO.
Если все правила соблюдены, выводит: \`DTO валиден: пользователь успешно зарегистрирован\`.
Если есть ошибки, выводит список всех нарушенных правил.

Формат вывода:
\`\`\`text
Результат валидации:
- [ошибка 1]
- [ошибка 2]
...
Итог: [УСПЕХ / ОТКЛОНЕНО]
\`\`\``,
    exampleInput: "alex\nalex.dev@javaforge.ru\n24\nsuperSecret123",
    exampleOutput: "Результат валидации:\nИтог: УСПЕХ",
    starterCode: `import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String username = scanner.nextLine().trim();
        String email = scanner.nextLine().trim();
        int age = scanner.nextInt();
        scanner.nextLine();
        String password = scanner.nextLine().trim();
        
        // TODO: проверь 4 правила и собери ошибки в List<String>
        
    }
}`,
    theory: {
      title: "Паттерн валидации DTO в Backend",
      summary: "Сбор всех ошибок валидации вместо мгновенного падения на первой же ошибке.",
      keyPoints: [
        "Пользователю нужно вернуть список ВСЕХ ошибок формы за один раз, а не заставлять его отправлять форму по 10 раз.",
        "Используй список List<String> errors = new ArrayList<>() для накопления ошибок.",
        "Проверка email: int at = email.indexOf('@'); boolean validEmail = at > 0 && email.indexOf('.', at) > at;"
      ],
      codeExample: `List<String> errors = new ArrayList<>();
if (username.length() < 3 || username.length() > 20) {
    errors.add("Неверная длина username (от 3 до 20)");
}
int at = email.indexOf('@');
if (at <= 0 || email.indexOf('.', at) <= at) {
    errors.add("Некорректный email адрес");
}
if (age < 18 || age > 100) {
    errors.add("Возраст должен быть от 18 до 100");
}
if (password.length() < 8) {
    errors.add("Пароль короче 8 символов");
}`,
      pitfalls: [
        "Не забудь очистить буфер scanner.nextLine() после scanner.nextInt() перед считыванием пароля."
      ]
    },
    tests: [
      {
        label: "Валидный DTO",
        stdin: "alex\nalex.dev@javaforge.ru\n24\nsuperSecret123\n",
        expected: ["Результат валидации:", "Итог: УСПЕХ"]
      },
      {
        label: "Невалидный возраст и пароль",
        stdin: "al\nbademail\n16\n123\n",
        expected: ["Итог: ОТКЛОНЕНО"]
      }
    ],
    hints: [
      "Добавляй ошибки в `List<String> errors`.",
      "Если `errors.isEmpty()`, выводи `Итог: УСПЕХ`."
    ]
  },
  {
    id: "pr_m7_rate_limiter",
    moduleId: 7,
    moduleName: "Модуль 7 и 8: Архитектура, SQL и Backend-практика",
    topic: "Алгоритм Token Bucket (Rate Limiter)",
    title: "Ограничитель частоты запросов (Rate Limiter: Token Bucket)",
    difficulty: "Средний",
    xp: 35,
    description: `Для защиты API от DDoS-атак и спама используется алгоритм Token Bucket (корзина токенов).

Правила корзины:
- Корзина вмещает максимум \`capacity\` токенов (например 5).
- Каждый разрешенный запрос списывает 1 токен (\`tokens--\`).
- Если токенов 0, запрос отклоняется со статусом 429 Too Many Requests.
- Каждую секунду в корзину добавляется \`refillRate\` токенов (не превышая \`capacity\`).

Напиши симулятор:
1. Считывает: capacity = 5, refillRate = 2 токена/сек.
2. Считывает число входящих запросов N.
3. Для каждого запроса передается время его поступления в секундах (например: 0, 0, 0, 1, 1).
4. Программа обновляет количество токенов с учетом прошедшего времени и принимает решение: \`200 OK\` или \`429 LIMIT\`.

Формат вывода:
\`\`\`text
Запрос 1 (сек 0): 200 OK (токенов: [остаток])
...
\`\`\``,
    exampleInput: "3\n0\n0\n0",
    exampleOutput: "Запрос 1 (сек 0): 200 OK (токенов: 4)\nЗапрос 2 (сек 0): 200 OK (токенов: 3)\nЗапрос 3 (сек 0): 200 OK (токенов: 2)",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int capacity = 5;
        int refillRate = 2;
        int tokens = capacity;
        int lastTime = 0;
        
        int n = scanner.nextInt();
        for (int i = 1; i <= n; i++) {
            int time = scanner.nextInt();
            // TODO: рассчитай пополнение токенов за время (time - lastTime)
            // TODO: разреши (200 OK) или отклони (429 LIMIT)
        }
    }
}`,
    theory: {
      title: "Алгоритм Token Bucket в продакшене",
      summary: "Стандарт де-факто для rate-limiting в шлюзах Spring Cloud Gateway и NGINX.",
      keyPoints: [
        "Пополнение: tokens = Math.min(capacity, tokens + (time - lastTime) * refillRate);",
        "lastTime = time;",
        "Списание: if (tokens >= 1) { tokens--; allow(); } else { deny(); }"
      ],
      codeExample: `int timePassed = time - lastTime;
tokens = Math.min(capacity, tokens + timePassed * refillRate);
lastTime = time;

if (tokens >= 1) {
    tokens--;
    System.out.printf("Запрос %d (сек %d): 200 OK (токенов: %d)%n", i, time, tokens);
} else {
    System.out.printf("Запрос %d (сек %d): 429 LIMIT (токенов: %d)%n", i, time, tokens);
}`,
      pitfalls: [
        "Не забудь ограничить пополнение токенов максимальной вместимостью корзины (capacity)."
      ]
    },
    tests: [
      {
        label: "3 запроса подряд в секунду 0",
        stdin: "3\n0\n0\n0\n",
        expected: ["Запрос 1 (сек 0): 200 OK (токенов: 4)", "Запрос 2 (сек 0): 200 OK (токенов: 3)", "Запрос 3 (сек 0): 200 OK (токенов: 2)"]
      }
    ],
    hints: [
      "Обновляй `tokens = Math.min(capacity, tokens + (time - lastTime) * refillRate)`.",
      "Списывай `tokens--` только если `tokens >= 1`."
    ]
  },
  {
    id: "pr_m7_json_extractor",
    moduleId: 7,
    moduleName: "Модуль 7 и 8: Архитектура, SQL и Backend-практика",
    topic: "Парсинг конфигурации application.properties",
    title: "Парсер конфигурационного файла application.properties",
    difficulty: "Лёгкий",
    xp: 25,
    description: `В Spring Boot конфигурация задаётся в файле \`application.properties\`.

Правила формата:
1. Строки вида \`key=value\` задают свойства конфигурации.
2. Пробелы вокруг ключа и значения должны обрезаться (\`trim()\`).
3. Строки, начинающиеся со знака \`#\` или пустые строки, являются комментариями и должны игнорироваться.

Напиши парсер:
- Считывает число строк N.
- Считывает N строк конфигурации.
- Сохраняет параметры в \`Map<String, String>\`.
- Выводит количество загруженных параметров и их значения в формате \`[key] -> [value]\`.

Формат вывода:
\`\`\`text
Загружено параметров: [count]
server.port -> 8080
spring.datasource.url -> jdbc:postgresql://localhost:5432/db
...
\`\`\``,
    exampleInput: "4\n# Настройки сервера\nserver.port = 8080\n\nspring.datasource.url = jdbc:postgresql://localhost:5432/db",
    exampleOutput: "Загружено параметров: 2\nserver.port -> 8080\nspring.datasource.url -> jdbc:postgresql://localhost:5432/db",
    starterCode: `import java.util.Scanner;
import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        Map<String, String> config = new LinkedHashMap<>();
        
        // TODO: считай строки, отфильтруй комментарии и заполни карту key=value
        
    }
}`,
    theory: {
      title: "Парсинг файлов свойств (.properties)",
      summary: "Как Java читает конфигурационные файлы через ключ-значение.",
      keyPoints: [
        "Проверка комментария: line.startsWith(\"#\") || line.isEmpty().",
        "Поиск знака равенства: int eq = line.indexOf('=');",
        "Ключ: line.substring(0, eq).trim();",
        "Значение: line.substring(eq + 1).trim();"
      ],
      codeExample: `if (line.isEmpty() || line.startsWith("#")) continue;
int eq = line.indexOf('=');
if (eq > 0) {
    String key = line.substring(0, eq).trim();
    String val = line.substring(eq + 1).trim();
    config.put(key, val);
}`,
      pitfalls: [
        "Не используй line.split(\"=\"), так как значение может содержать дополнительные знаки равенства (например jdbc url или токены)!"
      ]
    },
    tests: [
      {
        label: "4 строки с комментарием и пустой строкой",
        stdin: "4\n# Настройки сервера\nserver.port = 8080\n\nspring.datasource.url = jdbc:postgresql://localhost:5432/db\n",
        expected: ["Загружено параметров: 2", "server.port -> 8080", "spring.datasource.url -> jdbc:postgresql://localhost:5432/db"]
      }
    ],
    hints: [
      "Проверяй `line.startsWith(\"#\")`.",
      "Разделяй через `indexOf('=')` и `substring`."
    ]
  },
  {
    id: "pr_m7_two_sum",
    moduleId: 7,
    moduleName: "Модуль 7 и 8: Архитектура, SQL и Backend-практика",
    topic: "Алгоритмы и сложность O(N): Two Sum",
    title: "Two Sum: поиск пары с целевой суммой за O(N)",
    difficulty: "Средний",
    xp: 35,
    description: `Классическая задача с технических собеседований (LeetCode #1).

Дан массив целых чисел и целевое число \`target\`.
Необходимо найти индексы двух чисел в массиве, сумма которых равна \`target\`.

Требование:
Решение за линейное время O(N) с использованием \`HashMap<Integer, Integer>\` (где ключ — число, а значение — его индекс).

Алгоритм:
- Для каждого элемента \`arr[i]\` вычисляем требуемое дополнение: \`complement = target - arr[i]\`.
- Если \`map.containsKey(complement)\`, мы нашли решение: индексы \`[map.get(complement), i]\`.
- Иначе сохраняем текущее число: \`map.put(arr[i], i)\`.

Формат вывода:
\`\`\`text
Массив: [элементы]
Цель: [target]
Найдена пара: arr[[idx1]] = [val1] и arr[[idx2]] = [val2] (сумма [target])
Индексы: [idx1] и [idx2]
\`\`\``,
    exampleInput: "4\n2 7 11 15\n9",
    exampleOutput: "Массив: [2, 7, 11, 15]\nЦель: 9\nНайдена пара: arr[0] = 2 и arr[1] = 7 (сумма 9)\nИндексы: 0 и 1",
    starterCode: `import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        int target = scanner.nextInt();
        
        // TODO: найди индексы двух чисел за O(N) с помощью HashMap
        
    }
}`,
    theory: {
      title: "Оптимизация с O(N²) до O(N) через хэш-таблицу",
      summary: "Вместо двух вложенных циклов ищем complement в HashMap за O(1).",
      keyPoints: [
        "Наивное решение вложенными циклами требует O(N²) времени.",
        "Использование HashMap позволяет найти дополнение target - x за O(1).",
        "Общее время работы алгоритма сокращается до строгого O(N)."
      ],
      codeExample: `Map<Integer, Integer> map = new HashMap<>();
for (int i = 0; i < n; i++) {
    int comp = target - arr[i];
    if (map.containsKey(comp)) {
        int prevIdx = map.get(comp);
        System.out.printf("Найдена пара: arr[%d] = %d и arr[%d] = %d (сумма %d)%n",
            prevIdx, comp, i, arr[i], target);
        System.out.println("Индексы: " + prevIdx + " и " + i);
        return;
    }
    map.put(arr[i], i);
}`,
      pitfalls: [
        "Не клади все элементы в HashMap заранее, иначе одно и то же число может использовать само себя (например target=6 и arr[0]=3)."
      ]
    },
    tests: [
      {
        label: "Массив [2, 7, 11, 15] с целью 9",
        stdin: "4\n2 7 11 15\n9\n",
        expected: ["Цель: 9", "Найдена пара: arr[0] = 2 и arr[1] = 7 (сумма 9)", "Индексы: 0 и 1"]
      },
      {
        label: "Массив [3, 2, 4] с целью 6",
        stdin: "3\n3 2 4\n6\n",
        expected: ["Цель: 6", "Найдена пара: arr[1] = 2 и arr[2] = 4 (сумма 6)", "Индексы: 1 и 2"]
      }
    ],
    hints: [
      "Вычисляй `int comp = target - arr[i]`.",
      "Проверяй `map.containsKey(comp)`."
    ]
  }
];

