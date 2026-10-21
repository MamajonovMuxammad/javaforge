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

export const module4Lessons: Lesson[] = [
  /* ------------------------------------------------------------------ */
  /*  DAY 36: Введение в базы данных и PostgreSQL                       */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 36,
    moduleId: 4,
    title: "Введение в базы данных и PostgreSQL",
    short: "Реляционные СУБД, клиент-серверная архитектура, маппинг типов данных",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["RDBMS vs NoSQL", "PostgreSQL", "Типы данных SQL и Java", "Персистентность"],
    videos: [
      { author: "Алишев", query: "Алишев базы данных PostgreSQL для начинающих", note: "Основы баз данных" },
      { author: "Заур Трегулов", query: "Заур Трегулов SQL базы данных основы", note: "Реляционные базы данных" },
    ],
    theory: [
      { type: "h", text: "Зачем бэкенду базы данных?" },
      {
        type: "p",
        text: "Переменные в памяти Java живут только до перезапуска JVM. СУБД (PostgreSQL) сохраняет данные на диск с гарантиями надежности ACID. Каждому типу данных в PostgreSQL соответствует определенный ссылочный тип в Java.",
      },
      {
        type: "table",
        head: ["PostgreSQL тип", "Java тип", "Назначение"],
        rows: [
          ["BIGSERIAL / BIGINT", "Long", "Идентификаторы ID, первичные ключи"],
          ["INT / INTEGER", "Integer", "Количество, возраст, счетчики"],
          ["VARCHAR(n) / TEXT", "String", "Строки, имена, описания"],
          ["BOOLEAN", "Boolean", "Флаги true / false"],
          ["NUMERIC(12, 2)", "BigDecimal", "Деньги, финансовые расчеты"],
        ],
      },
    ],
    tasks: [
      {
        id: "d36_t1",
        type: "warmup",
        title: "Задача 1: Разминка (SQL-маппер типов данных)",
        shortDesc: "Преобразование типов данных PostgreSQL в типы Java",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Напиши программу, которая считывает имя типа данных PostgreSQL со стандартного ввода и выводит соответствующий ему тип в Java.\n" +
          "Поддерживаемые типы:\n" +
          "• `BIGINT` -> `Long`\n" +
          "• `INT` -> `Integer`\n" +
          "• `VARCHAR` -> `String`\n" +
          "• `BOOLEAN` -> `Boolean`\n" +
          "• `NUMERIC` -> `BigDecimal`\n" +
          "Если тип неизвестен, выведи `Unknown`.",
        sampleInput: "BIGINT",
        exampleOutput: "Тип в Java: Long",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String pgType = scanner.nextLine().trim().toUpperCase();

        // TODO: сопоставь pgType и выведи "Тип в Java: <JavaType>"
    }
}
`,
        hints: [
          "Используй конструкцию switch-case или if-else для сопоставления строки pgType.",
          "Формат вывода: System.out.println(\"Тип в Java: \" + javaType);",
        ],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String pgType = scanner.nextLine().trim().toUpperCase();

        String javaType = switch (pgType) {
            case "BIGINT" -> "Long";
            case "INT" -> "Integer";
            case "VARCHAR" -> "String";
            case "BOOLEAN" -> "Boolean";
            case "NUMERIC" -> "BigDecimal";
            default -> "Unknown";
        };

        System.out.println("Тип в Java: " + javaType);
    }
}
`,
        tests: [
          { label: "Тест BIGINT", stdin: "BIGINT\n", expected: ["Тип в Java: Long"] },
          { label: "Тест NUMERIC", stdin: "NUMERIC\n", expected: ["Тип в Java: BigDecimal"] },
          { label: "Тест VARCHAR", stdin: "varchar\n", expected: ["Тип в Java: String"] },
        ],
      },
      {
        id: "d36_t2",
        type: "practice",
        title: "Задача 2: Практика (Валидатор имени таблицы SQL)",
        shortDesc: "Проверка snake_case и запрещенных ключевых слов",
        difficulty: "Средний",
        xp: 35,
        description:
          "В PostgreSQL имена таблиц принято именовать в snake_case (строчные английские буквы и подчеркивания, начинается с буквы).\n" +
          "Также запрещено использовать ключевые зарезервированные слова SQL: `USER`, `ORDER`, `TABLE`, `SELECT`.\n" +
          "Считай строку и выведи `OK`, если имя корректно, либо `INVALID`.",
        sampleInput: "order_items",
        exampleOutput: "OK",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine().trim();

        // TODO: проверь name на соответствие snake_case и отсутствие зарезервированных слов
    }
}
`,
        hints: [
          "Регулярное выражение для snake_case: ^[a-z][a-z0-9_]*$",
          "Проверь также, что name.toUpperCase() не совпадает с зарезервированными словами.",
        ],
        solution: `import java.util.Scanner;
import java.util.Set;

public class Main {
    private static final Set<String> RESERVED = Set.of("USER", "ORDER", "TABLE", "SELECT");

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine().trim();

        boolean isSnakeCase = name.matches("^[a-z][a-z0-9_]*$");
        boolean isReserved = RESERVED.contains(name.toUpperCase());

        if (isSnakeCase && !isReserved) {
            System.out.println("OK");
        } else {
            System.out.println("INVALID");
        }
    }
}
`,
        tests: [
          { label: "Корректное имя order_items", stdin: "order_items\n", expected: ["OK"] },
          { label: "Зарезервированное слово order", stdin: "order\n", expected: ["INVALID"] },
          { label: "Неверный формат с заглавной OrderItems", stdin: "OrderItems\n", expected: ["INVALID"] },
        ],
      },
      {
        id: "d36_t3",
        type: "homework",
        title: "Задача 3: Домашка (Генератор DDL CREATE TABLE)",
        shortDesc: "Построение DDL скрипта по списку колонок",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Напиши генератор DDL таблицы. Программа считывает имя таблицы и количество полей N, затем N строк вида `имя_колонки тип_колонки`.\n" +
          "Программа должна вывести SQL-запрос `CREATE TABLE <имя> (id BIGSERIAL PRIMARY KEY, <поля>);` с полями через запятую.",
        sampleInput: "products\n2\ntitle VARCHAR(100)\nprice NUMERIC(10, 2)",
        exampleOutput: "CREATE TABLE products (id BIGSERIAL PRIMARY KEY, title VARCHAR(100), price NUMERIC(10, 2));",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String tableName = scanner.nextLine().trim();
        int n = Integer.parseInt(scanner.nextLine().trim());

        // TODO: прочитай n колонок и собери SQL DDL строку
    }
}
`,
        hints: [
          "Используй StringBuilder или String.join для объединения колонок.",
          "Первой колонкой всегда идет 'id BIGSERIAL PRIMARY KEY'.",
        ],
        solution: `import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String tableName = scanner.nextLine().trim();
        int n = Integer.parseInt(scanner.nextLine().trim());

        List<String> columns = new ArrayList<>();
        columns.add("id BIGSERIAL PRIMARY KEY");
        for (int i = 0; i < n; i++) {
            columns.add(scanner.nextLine().trim());
        }

        String sql = "CREATE TABLE " + tableName + " (" + String.join(", ", columns) + ");";
        System.out.println(sql);
    }
}
`,
        tests: [
          {
            label: "Таблица товаров",
            stdin: "products\n2\ntitle VARCHAR(100)\nprice NUMERIC(10, 2)\n",
            expected: ["CREATE TABLE products (id BIGSERIAL PRIMARY KEY, title VARCHAR(100), price NUMERIC(10, 2));"],
          },
          {
            label: "Таблица пользователей",
            stdin: "users\n1\nemail VARCHAR(255)\n",
            expected: ["CREATE TABLE users (id BIGSERIAL PRIMARY KEY, email VARCHAR(255));"],
          },
        ],
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 37: DDL: CREATE, ALTER, DROP                                  */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 37,
    moduleId: 4,
    title: "DDL: CREATE, ALTER, DROP",
    short: "Ограничения целостности PRIMARY KEY, UNIQUE, NOT NULL, CHECK",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["CREATE TABLE", "ALTER TABLE", "CHECK", "UNIQUE / NOT NULL"],
    videos: [
      { author: "Заур Трегулов", query: "Заур Трегулов SQL CREATE TABLE", note: "Создание таблиц и ключей" },
      { author: "Алишев", query: "Алишев SQL DDL таблицы ограничения", note: "Ограничения целостности" },
    ],
    tasks: [
      {
        id: "d37_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Валидатор CHECK ограничения)",
        shortDesc: "Проверка бизнес-правил перед сохранением в базу данных",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "В таблице задано ограничение `CHECK (age >= 18 AND balance >= 0)`. Считай с консоли `age` (int) и `balance` (double). Выведи `ALLOWED`, если значения удовлетворяют ограничению, иначе `VIOLATION`.",
        sampleInput: "20 150.5",
        exampleOutput: "ALLOWED",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int age = scanner.nextInt();
        double balance = scanner.nextDouble();

        // TODO: проверь age >= 18 и balance >= 0
    }
}
`,
        hints: ["Используй оператор && для проверки обоих условий одновременно."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int age = scanner.nextInt();
        double balance = scanner.nextDouble();

        if (age >= 18 && balance >= 0) {
            System.out.println("ALLOWED");
        } else {
            System.out.println("VIOLATION");
        }
    }
}
`,
        tests: [
          { label: "Корректный возраст и баланс", stdin: "20 150.5\n", expected: ["ALLOWED"] },
          { label: "Несовершеннолетний age=17", stdin: "17 100\n", expected: ["VIOLATION"] },
          { label: "Отрицательный баланс", stdin: "25 -10\n", expected: ["VIOLATION"] },
        ],
      },
      {
        id: "d37_t2",
        type: "practice",
        title: "Задача 2: Практика (ALTER TABLE: добавление колонки)",
        shortDesc: "Генератор команды ALTER TABLE ADD COLUMN",
        difficulty: "Средний",
        xp: 35,
        description:
          "Напиши программу, генерирующую SQL запрос для добавления колонки.\n" +
          "На вход подаются: `имя_таблицы`, `имя_колонки`, `тип_колонки`, `значение_по_умолчанию`.\n" +
          "Выведи: `ALTER TABLE <table_name> ADD COLUMN <col_name> <col_type> DEFAULT <default_val>;`",
        sampleInput: "users is_active BOOLEAN true",
        exampleOutput: "ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String table = scanner.next();
        String col = scanner.next();
        String type = scanner.next();
        String defVal = scanner.next();

        // TODO: выведи SQL команду ALTER TABLE
    }
}
`,
        hints: ["Склей параметры в строку согласно шаблону ALTER TABLE."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String table = scanner.next();
        String col = scanner.next();
        String type = scanner.next();
        String defVal = scanner.next();

        System.out.println("ALTER TABLE " + table + " ADD COLUMN " + col + " " + type + " DEFAULT " + defVal + ";");
    }
}
`,
        tests: [
          {
            label: "Добавление is_active",
            stdin: "users is_active BOOLEAN true\n",
            expected: ["ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT true;"],
          },
        ],
      },
      {
        id: "d37_t3",
        type: "homework",
        title: "Задача 3: Домашка (Проверка уникальности UNIQUE)",
        shortDesc: "Симулятор UNIQUE ограничения с помощью Set",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Смоделируй работу UNIQUE индекса. На вход подается число N, затем N email-адресов.\n" +
          "Для каждого адреса выведи `INSERT OK`, если email еще не встречался в базе, либо `ERROR: duplicate key value`.",
        sampleInput: "4\nalex@mail.com\nbob@mail.com\nalex@mail.com\ncat@mail.com",
        exampleOutput: "INSERT OK\nINSERT OK\nERROR: duplicate key value\nINSERT OK",
        starterCode: `import java.util.Scanner;
import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        Set<String> uniqueEmails = new HashSet<>();

        // TODO: проверь каждый email через set.add()
    }
}
`,
        hints: ["Метод set.add(item) возвращает true, если элемент новый, и false, если дубликат."],
        solution: `import java.util.Scanner;
import java.util.HashSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        Set<String> uniqueEmails = new HashSet<>();

        for (int i = 0; i < n; i++) {
            String email = scanner.nextLine().trim().toLowerCase();
            if (uniqueEmails.add(email)) {
                System.out.println("INSERT OK");
            } else {
                System.out.println("ERROR: duplicate key value");
            }
        }
    }
}
`,
        tests: [
          {
            label: "Дубликаты email",
            stdin: "4\nalex@mail.com\nbob@mail.com\nalex@mail.com\ncat@mail.com\n",
            expected: [
              "INSERT OK",
              "INSERT OK",
              "ERROR: duplicate key value",
              "INSERT OK",
            ],
          },
        ],
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 38: DML: INSERT, UPDATE, DELETE, SELECT                       */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 38,
    moduleId: 4,
    title: "DML: INSERT, UPDATE, DELETE, SELECT",
    short: "Базовый CRUD в SQL, RETURNING и транзакционная безопасность",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["INSERT", "UPDATE", "DELETE", "SELECT", "CRUD"],
    videos: [
      { author: "Заур Трегулов", query: "Заур Трегулов SQL INSERT UPDATE DELETE", note: "Манипуляция данными DML" },
      { author: "Алишев", query: "Алишев SQL запросы SELECT", note: "Выборка и фильтрация строк" },
    ],
    tasks: [
      {
        id: "d38_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Параметризованный INSERT)",
        shortDesc: "Генератор безопасного SQL INSERT запроса",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Считай со стандартного ввода имя пользователя и баланс. Сформируй и выведи SQL-запрос вида:\n" +
          "`INSERT INTO users (username, balance) VALUES ('<name>', <balance>) RETURNING id;`",
        sampleInput: "timur 2500.50",
        exampleOutput: "INSERT INTO users (username, balance) VALUES ('timur', 2500.50) RETURNING id;",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.next();
        String balance = scanner.next();

        // TODO: собери INSERT запрос с RETURNING id;
    }
}
`,
        hints: ["Одинарные кавычки обязательны вокруг строковых литералов в SQL."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.next();
        String balance = scanner.next();

        System.out.println("INSERT INTO users (username, balance) VALUES ('" + name + "', " + balance + ") RETURNING id;");
    }
}
`,
        tests: [
          {
            label: "Создание тимура",
            stdin: "timur 2500.50\n",
            expected: ["INSERT INTO users (username, balance) VALUES ('timur', 2500.50) RETURNING id;"],
          },
        ],
      },
      {
        id: "d38_t2",
        type: "practice",
        title: "Задача 2: Практика (Защита от UPDATE без WHERE)",
        shortDesc: "Валидатор условий в деструктивных запросах",
        difficulty: "Средний",
        xp: 35,
        description:
          "Выполнение `UPDATE` или `DELETE` без условия `WHERE` может стереть всю базу данных!\n" +
          "Напиши валидатор: считай SQL-запрос. Если запрос начинается с `UPDATE` или `DELETE`, но в нем отсутствует слово `WHERE`, выведи `DANGER: missing WHERE clause!`. Иначе выведи `SAFE: query approved`.",
        sampleInput: "UPDATE users SET balance = 0;",
        exampleOutput: "DANGER: missing WHERE clause!",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String sql = scanner.nextLine().trim();

        // TODO: проверь наличие WHERE при операциях UPDATE / DELETE
    }
}
`,
        hints: ["Приведи sql к верхнему регистру sql.toUpperCase() для надежной проверки."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String sql = scanner.nextLine().trim();
        String upper = sql.toUpperCase();

        boolean isDestructive = upper.startsWith("UPDATE") || upper.startsWith("DELETE");
        boolean hasWhere = upper.contains("WHERE");

        if (isDestructive && !hasWhere) {
            System.out.println("DANGER: missing WHERE clause!");
        } else {
            System.out.println("SAFE: query approved");
        }
    }
}
`,
        tests: [
          { label: "Опасный UPDATE", stdin: "UPDATE users SET balance = 0;\n", expected: ["DANGER: missing WHERE clause!"] },
          { label: "Безопасный DELETE", stdin: "DELETE FROM users WHERE id = 5;\n", expected: ["SAFE: query approved"] },
          { label: "Обычный SELECT", stdin: "SELECT * FROM users;\n", expected: ["SAFE: query approved"] },
        ],
      },
      {
        id: "d38_t3",
        type: "homework",
        title: "Задача 3: Домашка (In-Memory симулятор таблицы CRUD)",
        shortDesc: "Реализация операций в памяти на основе Map",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Реализуй простой симулятор таблицы пользователей на Java.\n" +
          "Команды:\n" +
          "• `INSERT <name>` — сохраняет пользователя и присваивает автоинкрементный ID (начиная с 1). Выводит `CREATED <id>`.\n" +
          "• `SELECT <id>` — выводит `USER <id>: <name>`, либо `NOT FOUND`.\n" +
          "• `DELETE <id>` — удаляет пользователя и выводит `DELETED <id>`, либо `NOT FOUND`.\n" +
          "Команда `EXIT` завершает программу.",
        sampleInput: "INSERT Alice\nINSERT Bob\nSELECT 1\nDELETE 1\nSELECT 1\nEXIT",
        exampleOutput: "CREATED 1\nCREATED 2\nUSER 1: Alice\nDELETED 1\nNOT FOUND",
        starterCode: `import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Map<Integer, String> table = new HashMap<>();
        int idSeq = 1;

        // TODO: обрабатывай команды в цикле
    }
}
`,
        hints: ["Используй бесконечный цикл while(scanner.hasNext()), выходящий при команде EXIT."],
        solution: `import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Map<Integer, String> table = new HashMap<>();
        int idSeq = 1;

        while (scanner.hasNext()) {
            String cmd = scanner.next();
            if (cmd.equals("EXIT")) break;

            if (cmd.equals("INSERT")) {
                String name = scanner.next();
                int newId = idSeq++;
                table.put(newId, name);
                System.out.println("CREATED " + newId);
            } else if (cmd.equals("SELECT")) {
                int id = scanner.nextInt();
                if (table.containsKey(id)) {
                    System.out.println("USER " + id + ": " + table.get(id));
                } else {
                    System.out.println("NOT FOUND");
                }
            } else if (cmd.equals("DELETE")) {
                int id = scanner.nextInt();
                if (table.remove(id) != null) {
                    System.out.println("DELETED " + id);
                } else {
                    System.out.println("NOT FOUND");
                }
            }
        }
    }
}
`,
        tests: [
          {
            label: "CRUD цикл",
            stdin: "INSERT Alice\nINSERT Bob\nSELECT 1\nDELETE 1\nSELECT 1\nEXIT\n",
            expected: ["CREATED 1", "CREATED 2", "USER 1: Alice", "DELETED 1", "NOT FOUND"],
          },
        ],
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 40: JOIN: соединяем таблицы                                   */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 40,
    moduleId: 4,
    title: "JOIN: соединяем таблицы",
    short: "INNER JOIN, LEFT JOIN, связывание реляционных данных",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["INNER JOIN", "LEFT JOIN", "ON условие", "Связи таблиц"],
    videos: [
      { author: "Заур Трегулов", query: "Заур Трегулов SQL JOIN", note: "Все виды JOIN наглядное объяснение" },
      { author: "Алишев", query: "Алишев SQL JOIN объединение таблиц", note: "Практика соединений" },
    ],
    tasks: [
      {
        id: "d40_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Симулятор INNER JOIN)",
        shortDesc: "Объединение строк двух таблиц по общему ключу user_id",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "На вход подаются две сущности: пользователь `User(id, name)` и заказ `Order(orderId, userId, amount)`.\n" +
          "Считай `user_id` пользователя и `user_id` заказа. Если они совпадают (INNER JOIN совпал), выведи `MATCH: <name> сделал заказ на <amount>`. Иначе выведи `NO MATCH`.",
        sampleInput: "1 Alex\n101 1 500",
        exampleOutput: "MATCH: Alex сделал заказ на 500",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int uId = scanner.nextInt();
        String uName = scanner.next();
        int oId = scanner.nextInt();
        int oUserId = scanner.nextInt();
        int amount = scanner.nextInt();

        // TODO: сравни uId и oUserId
    }
}
`,
        hints: ["Если uId == oUserId, совпадение найдено."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int uId = scanner.nextInt();
        String uName = scanner.next();
        int oId = scanner.nextInt();
        int oUserId = scanner.nextInt();
        int amount = scanner.nextInt();

        if (uId == oUserId) {
            System.out.println("MATCH: " + uName + " сделал заказ на " + amount);
        } else {
            System.out.println("NO MATCH");
        }
    }
}
`,
        tests: [
          { label: "Совпадение по ключу", stdin: "1 Alex 101 1 500\n", expected: ["MATCH: Alex сделал заказ на 500"] },
          { label: "Разные ключи", stdin: "1 Alex 102 2 300\n", expected: ["NO MATCH"] },
        ],
      },
      {
        id: "d40_t2",
        type: "practice",
        title: "Задача 2: Практика (Симулятор LEFT JOIN)",
        shortDesc: "Включение всех левых записей с NULL для пустых заказов",
        difficulty: "Средний",
        xp: 35,
        description:
          "LEFT JOIN гарантирует, что все пользователи из левой таблицы попадут в результат, даже если заказов у них нет.\n" +
          "Даны пользователи: `Map<Integer, String> users` (id -> name) и заказы `Map<Integer, Integer> orders` (userId -> totalAmount).\n" +
          "Для каждого пользователя выведи `User: <name>, Заказы: <amount>` (если заказа нет — `Заказы: NULL`).",
        sampleInput: "2\n1 Alex\n2 Bob\n1\n1 1200",
        exampleOutput: "User: Alex, Заказы: 1200\nUser: Bob, Заказы: NULL",
        starterCode: `import java.util.Scanner;
import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int numUsers = scanner.nextInt();
        Map<Integer, String> users = new LinkedHashMap<>();
        for (int i = 0; i < numUsers; i++) {
            users.put(scanner.nextInt(), scanner.next());
        }

        int numOrders = scanner.nextInt();
        Map<Integer, Integer> orders = new LinkedHashMap<>();
        for (int i = 0; i < numOrders; i++) {
            orders.put(scanner.nextInt(), scanner.nextInt());
        }

        // TODO: выполни LEFT JOIN по ключу userId
    }
}
`,
        hints: ["Используй orders.get(userId), если вернется null — выведи 'NULL'."],
        solution: `import java.util.Scanner;
import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int numUsers = scanner.nextInt();
        Map<Integer, String> users = new LinkedHashMap<>();
        for (int i = 0; i < numUsers; i++) {
            users.put(scanner.nextInt(), scanner.next());
        }

        int numOrders = scanner.nextInt();
        Map<Integer, Integer> orders = new LinkedHashMap<>();
        for (int i = 0; i < numOrders; i++) {
            orders.put(scanner.nextInt(), scanner.nextInt());
        }

        for (Map.Entry<Integer, String> entry : users.entrySet()) {
            Integer amount = orders.get(entry.getKey());
            String amountStr = (amount != null) ? String.valueOf(amount) : "NULL";
            System.out.println("User: " + entry.getValue() + ", Заказы: " + amountStr);
        }
    }
}
`,
        tests: [
          {
            label: "Один с заказом, второй без",
            stdin: "2\n1 Alex\n2 Bob\n1\n1 1200\n",
            expected: [
              "User: Alex, Заказы: 1200",
              "User: Bob, Заказы: NULL",
            ],
          },
        ],
      },
      {
        id: "d40_t3",
        type: "homework",
        title: "Задача 3: Домашка (Агрегация суммы покупок через JOIN)",
        shortDesc: "Подсчет итоговой выручки по каждому клиенту",
        difficulty: "Сложный",
        xp: 40,
        description:
          "На вход подается количество заказов N, далее N строк вида `client_name order_amount`.\n" +
          "Один клиент мог сделать несколько заказов. Выведи список всех клиентов в алфавитном порядке и их общую сумму покупок вида `<client>: <total>`.",
        sampleInput: "4\nAlex 500\nBob 300\nAlex 1500\nBob 200",
        exampleOutput: "Alex: 2000\nBob: 500",
        starterCode: `import java.util.Scanner;
import java.util.TreeMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        Map<String, Integer> totals = new TreeMap<>(); // TreeMap автоматически сортирует ключи!

        // TODO: считай n строк и аккумулируй суммы
    }
}
`,
        hints: ["Используй totals.merge(name, amount, Integer::sum) для быстрого сложения."],
        solution: `import java.util.Scanner;
import java.util.TreeMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        Map<String, Integer> totals = new TreeMap<>();

        for (int i = 0; i < n; i++) {
            String name = scanner.next();
            int amount = scanner.nextInt();
            totals.merge(name, amount, Integer::sum);
        }

        for (Map.Entry<String, Integer> entry : totals.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
`,
        tests: [
          {
            label: "Агрегация сумм заказов",
            stdin: "4\nAlex 500\nBob 300\nAlex 1500\nBob 200\n",
            expected: ["Alex: 2000", "Bob: 500"],
          },
        ],
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 45: JDBC: PreparedStatement и DAO                             */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 45,
    moduleId: 4,
    title: "JDBC: PreparedStatement и DAO",
    short: "Защита от SQL-инъекций и архитектурный паттерн доступа к данным",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["PreparedStatement", "SQL Injection", "DAO паттерн"],
    videos: [
      { author: "Алишев", query: "Алишев JDBC PreparedStatement DAO", note: "PreparedStatement и защита от инъекций" },
      { author: "Заур Трегулов", query: "Заур Трегулов JDBC DAO", note: "Паттерн Data Access Object" },
    ],
    tasks: [
      {
        id: "d45_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Детектор SQL-инъекций)",
        shortDesc: "Обнаружение опасных символов конкатенации в запросе",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Злоумышленники используют кавычки `'`, оператор `--` (комментарий в SQL) и `OR 1=1` для обхода аутентификации.\n" +
          "Напиши валидатор: если строка ввода содержит `'` или `--` или `OR 1=1` (без учета регистра), выведи `ATTACK DETECTED!`. Иначе выведи `INPUT SAFE`.",
        sampleInput: "admin' OR 1=1--",
        exampleOutput: "ATTACK DETECTED!",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();

        // TODO: проверь на наличие признаков SQL инъекции
    }
}
`,
        hints: ["Проверь input.contains(\"'\") || input.contains(\"--\") || input.toUpperCase().contains(\"OR 1=1\")"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        String upper = input.toUpperCase();

        if (input.contains("'") || input.contains("--") || upper.contains("OR 1=1")) {
            System.out.println("ATTACK DETECTED!");
        } else {
            System.out.println("INPUT SAFE");
        }
    }
}
`,
        tests: [
          { label: "Классическая атака", stdin: "admin' OR 1=1--\n", expected: ["ATTACK DETECTED!"] },
          { label: "Безопасный ввод", stdin: "alexander_ivanov\n", expected: ["INPUT SAFE"] },
        ],
      },
      {
        id: "d45_t2",
        type: "practice",
        title: "Задача 2: Практика (Эмуляция параметров PreparedStatement)",
        shortDesc: "Подстановка параметров вместо плейсхолдеров '?'",
        difficulty: "Средний",
        xp: 35,
        description:
          "PreparedStatement принимает шаблон запроса со знаками `?` и подставляет значения с экранированием.\n" +
          "Дана строка `SELECT * FROM users WHERE email = ? AND status = ?;` и два параметра: `test@mail.com` и `ACTIVE`.\n" +
          "Считай два параметра и выведи итоговый скомпилированный запрос с одинарными кавычками вокруг строковых параметров.",
        sampleInput: "test@mail.com ACTIVE",
        exampleOutput: "SELECT * FROM users WHERE email = 'test@mail.com' AND status = 'ACTIVE';",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String email = scanner.next();
        String status = scanner.next();

        // TODO: сформируй параметризованную строку
    }
}
`,
        hints: ["Подставь email и status в одинарные кавычки в шаблон."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String email = scanner.next();
        String status = scanner.next();

        System.out.println("SELECT * FROM users WHERE email = '" + email + "' AND status = '" + status + "';");
    }
}
`,
        tests: [
          {
            label: "Подстановка параметров",
            stdin: "test@mail.com ACTIVE\n",
            expected: ["SELECT * FROM users WHERE email = 'test@mail.com' AND status = 'ACTIVE';"],
          },
        ],
      },
      {
        id: "d45_t3",
        type: "homework",
        title: "Задача 3: Домашка (Реализация паттерна DAO в памяти)",
        shortDesc: "Интерфейс UserDao и реализация InMemoryUserDao",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Паттерн DAO изолирует бизнес-логику от способа хранения данных.\n" +
          "Создай класс `User(Long id, String name)` и DAO с методами `save(User u)` и `findById(Long id)`.\n" +
          "Считай число пользователей N, сохрани их через DAO и затем выполни поиск по ID M раз, выводя найденные имена или `User not found`.",
        sampleInput: "2\n1 Timur\n2 Alina\n2\n1\n3",
        exampleOutput: "Timur\nUser not found",
        starterCode: `import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Map<Long, String> dao = new HashMap<>();

        for (int i = 0; i < n; i++) {
            long id = scanner.nextLong();
            String name = scanner.next();
            dao.put(id, name);
        }

        int m = scanner.nextInt();
        for (int i = 0; i < m; i++) {
            long searchId = scanner.nextLong();
            // TODO: найди пользователя в dao или выведи "User not found"
        }
    }
}
`,
        hints: ["Проверяй наличие ключа через dao.get(searchId)."],
        solution: `import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Map<Long, String> dao = new HashMap<>();

        for (int i = 0; i < n; i++) {
            long id = scanner.nextLong();
            String name = scanner.next();
            dao.put(id, name);
        }

        int m = scanner.nextInt();
        for (int i = 0; i < m; i++) {
            long searchId = scanner.nextLong();
            String found = dao.get(searchId);
            if (found != null) {
                System.out.println(found);
            } else {
                System.out.println("User not found");
            }
        }
    }
}
`,
        tests: [
          {
            label: "Поиск через DAO",
            stdin: "2\n1 Timur\n2 Alina\n2\n1\n3\n",
            expected: ["Timur", "User not found"],
          },
        ],
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 48: Git: основы                                               */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 48,
    moduleId: 4,
    title: "Git: основы (init, add, commit, .gitignore)",
    short: "Состояния файлов, слепки репозитория, SHA-1 хеширование коммитов",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["git init", "git add", "git commit", ".gitignore", "SHA-1"],
    videos: [
      { author: "Алишев", query: "Алишев Git с нуля основы", note: "Основы контроля версий Git" },
      { author: "Заур Трегулов", query: "Заур Трегулов Git для начинающих", note: "Коммиты и состояния файлов" },
    ],
    tasks: [
      {
        id: "d48_t1",
        type: "warmup",
        title: "Задача 1: Разминка (.gitignore валидатор)",
        shortDesc: "Фильтрация мусорных файлов от попадания в репозиторий",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "В Git репозиторий нельзя коммитить файлы сборки и настройки IDE.\n" +
          "Если имя файла заканчивается на `.class` или `.log` либо содержит `target/` или `.idea/`, программа должна вывести `IGNORED`.\n" +
          "Иначе выведи `TRACKED`.",
        sampleInput: "target/classes/Main.class",
        exampleOutput: "IGNORED",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String path = scanner.nextLine().trim();

        // TODO: проверь, должен ли файл игнорироваться
    }
}
`,
        hints: ["Используй path.endsWith(\".class\"), path.contains(\"target/\") и т.д."],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String path = scanner.nextLine().trim();

        if (path.endsWith(".class") || path.endsWith(".log") || path.contains("target/") || path.contains(".idea/")) {
            System.out.println("IGNORED");
        } else {
            System.out.println("TRACKED");
        }
    }
}
`,
        tests: [
          { label: "Игнорируемый class файл", stdin: "target/classes/Main.class\n", expected: ["IGNORED"] },
          { label: "Исходный java файл", stdin: "src/main/java/Main.java\n", expected: ["TRACKED"] },
          { label: "Лог файл", stdin: "app.log\n", expected: ["IGNORED"] },
        ],
      },
      {
        id: "d48_t2",
        type: "practice",
        title: "Задача 2: Практика (Валидатор Conventional Commits)",
        shortDesc: "Проверка стандарта оформления коммит-сообщений",
        difficulty: "Средний",
        xp: 35,
        description:
          "В профессиональных командах сообщения коммитов оформляются по стандарту Conventional Commits:\n" +
          "`<тип>: <описание>`\n" +
          "Разрешенные типы: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.\n" +
          "Если коммит соответствует стандарту, выведи `COMMIT VALID`, иначе `INVALID FORMAT`.",
        sampleInput: "feat: add user authentication via JWT",
        exampleOutput: "COMMIT VALID",
        starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String message = scanner.nextLine().trim();

        // TODO: проверь префикс типа коммита
    }
}
`,
        hints: ["Регулярное выражение: ^(feat|fix|docs|refactor|test|chore): .+$"],
        solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String message = scanner.nextLine().trim();

        if (message.matches("^(feat|fix|docs|refactor|test|chore): .+$")) {
            System.out.println("COMMIT VALID");
        } else {
            System.out.println("INVALID FORMAT");
        }
    }
}
`,
        tests: [
          { label: "Корректный feat", stdin: "feat: add user authentication via JWT\n", expected: ["COMMIT VALID"] },
          { label: "Неверный префикс", stdin: "fixed bug in service\n", expected: ["INVALID FORMAT"] },
          { label: "Пропущен пробел после двоеточия", stdin: "fix:bug\n", expected: ["INVALID FORMAT"] },
        ],
      },
      {
        id: "d48_t3",
        type: "homework",
        title: "Задача 3: Домашка (Хеш-дерево коммитов в Git)",
        shortDesc: "Связный список коммитов со ссылкой на родителя parent_hash",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Каждый коммит в Git ссылается на предыдущий (parent). Считай N коммитов вида `hash parent_hash message`.\n" +
          "Выведи историю в обратном порядке от последнего коммита (HEAD) к первому (у первого parent_hash = 'null').",
        sampleInput: "3\na1 null Initial commit\nb2 a1 Add database schema\nc3 b2 Implement REST controller",
        exampleOutput: "c3 -> b2 -> a1 -> ROOT",
        starterCode: `import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        Map<String, String> parentMap = new HashMap<>(); // commit -> parent
        String head = null;

        for (int i = 0; i < n; i++) {
            String hash = scanner.next();
            String parent = scanner.next();
            scanner.nextLine(); // skip message
            parentMap.put(hash, parent);
            head = hash; // последний коммит становится HEAD
        }

        // TODO: пройди по цепочке от head до "null" и выведи историю
    }
}
`,
        hints: ["В цикле переходи curr = parentMap.get(curr), пока curr не равен 'null'."],
        solution: `import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        Map<String, String> parentMap = new HashMap<>();
        String head = null;

        for (int i = 0; i < n; i++) {
            String hash = scanner.next();
            String parent = scanner.next();
            scanner.nextLine();
            parentMap.put(hash, parent);
            head = hash;
        }

        List<String> chain = new ArrayList<>();
        String curr = head;
        while (curr != null && !curr.equals("null")) {
            chain.add(curr);
            curr = parentMap.get(curr);
        }
        chain.add("ROOT");

        System.out.println(String.join(" -> ", chain));
    }
}
`,
        tests: [
          {
            label: "Цепочка коммитов",
            stdin: "3\na1 null Initial commit\nb2 a1 Add database schema\nc3 b2 Implement REST controller\n",
            expected: ["c3 -> b2 -> a1 -> ROOT"],
          },
        ],
      },
    ],
  }),
];
