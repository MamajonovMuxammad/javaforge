import type { LessonExtras } from "../types";
import {
  h, p, code, list, table, tip, warn, info, analogy,
  pgdocs, oracle, javadoc, baeldung, habr, book, link,
  JAVA_INTERVIEW_RU, ROADMAP_BACKEND, ROADMAP_JAVA,
} from "./helpers";

const r = String.raw;

export const module4SqlGitExtras: Record<number, LessonExtras> = {
  /* ================================================================== */
  /*  DAY 54 — Введение в реляционные БД и PostgreSQL                   */
  /* ================================================================== */
  54: {
    deepDive: [
      h("Зачем бэкенду базы данных: почему памяти Java (RAM) недостаточно?"),
      p("Все объекты `List`, `HashMap` и переменные в Java живут в оперативной памяти (RAM). Стоит перезагрузить сервер или выключить питание — и все пользователи, заказы и балансы **бесследно исчезнут**! Чтобы данные сохранялись навсегда (**персистентность**), выдерживали одновременную работу тысяч клиентов и не ломались при сбоях, используют **Системы Управления Базами Данных (СУБД / DBMS)**."),
      analogy("Электронный Excel с железной дисциплиной", "Реляционную базу данных можно представить как набор жёстко связанных между собой таблиц (пользователи, товары, заказы), где каждый столбец имеет строгий тип данных, миллионы строк ищутся за миллисекунды, а правила целостности не дадут записать заказ на несуществующего клиента."),
      h("Почему PostgreSQL — стандарт №1 для Java-разработчика"),
      list(
        "**ACID-надёжность:** строгая гарантия сохранности транзакций и денег даже при падении сервера.",
        "**Open-source без платных лицензий:** бесплатен в продакшене и поддерживается всеми облаками.",
        "**Богатые возможности:** JSONB, полнотекстовый поиск, оконные функции, геоданные PostGIS.",
        "**Лидер рынка:** подавляющее большинство вакансий Java Junior/Middle требуют именно PostgreSQL.",
      ),
      h("Клиент-серверная архитектура PostgreSQL и базовый терминал psql"),
      p("PostgreSQL запускается как отдельный фоновый процесс-сервер на стандартном TCP-порту **5432**. Ваш бэкенд на Java (или графический клиент DBeaver, IntelliJ Database Tool, утилита `psql`) подключается к нему по сети, отправляет SQL-запросы и получает результирующие строки."),
      table(
        ["Компонент / Понятие", "Назначение", "Пример / Команда"],
        ["**База данных (Database)**", "Изолированный контейнер схем и таблиц проекта", "`CREATE DATABASE shop_db;`"],
        ["**Схема (Schema)**", "Пространство имён для таблиц (по умолчанию `public`)", "`public.users`"],
        ["**Таблица (Table / Relation)**", "Строки (кортежи/записи) и столбцы (атрибуты)", "`users (id, username, email)`"],
        ["**Утилита `psql`**", "Официальная консольная утилита PostgreSQL", "`\\l` (список БД), `\\dt` (таблицы), `\\q` (выход)"],
      ),
      h("Реляционные СУБД (SQL) vs NoSQL"),
      table(
        ["Критерий", "SQL (PostgreSQL, MySQL)", "NoSQL (MongoDB, Redis)"],
        ["Модель хранения", "Связанные таблицы со строгой схемой", "Документы JSON, ключ-значение, графы"],
        ["Транзакции (ACID)", "Полноценные строгие транзакции из коробки", "Ограниченные (часто жертвуют в пользу скорости / Base)"],
        ["Применение", "Финтех, e-commerce, CRM, основной бэкенд", "Кэширование (`Redis`), сессии, неструктурированные логи"],
      ),
      h("Моделируем связь с БД прямо в Java-песочнице"),
      p("Пока вы учите синтаксис SQL, в нашей онлайн-песочнице `Main.java` можно смоделировать таблицу базы данных в виде списка записей и понять, как бэкенд формирует SQL-строки и читает строки ответа:"),
      code(r`
import java.util.*;

record UserRow(long id, String username, String role) {}

public class Main {
    public static void main(String[] args) {
        List<UserRow> usersTable = List.of(
            new UserRow(1L, "ali_dev", "STUDENT"),
            new UserRow(2L, "nazar", "ADMIN")
        );
        System.out.println("Имитация SELECT * FROM users WHERE role = 'STUDENT':");
        usersTable.stream()
                  .filter(u -> "STUDENT".equals(u.role()))
                  .forEach(u -> System.out.println(u.id() + " | " + u.username()));
    }
}`, "Модель таблицы PostgreSQL внутри Main.java"),
      tip("Быстрый запуск PostgreSQL локально через Docker", "Самый чистый способ поставить Postgres за 10 секунд без захламления Windows/macOS: `docker run --name pg-java -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:16`, а подключиться удобно через бесплатный GUI клиент **DBeaver**."),
      tip("Задание в песочнице справа", "Смоделируйте в `Main.java` две таблицы (`UserRow` и `ProductRow` с помощью Java `record` или классов) и реализуйте простую фильтрацию строк, чтобы прочувствовать реляционную структуру до написания реальных JDBC-запросов!"),
    ],
    interview: [
      { q: "В чём главная разница между реляционными (SQL) и нереляционными (NoSQL) БД?", a: "Реляционные БД (PostgreSQL) хранят данные в строго типизированных таблицах со связями (Foreign Key), поддерживают сложные JOIN и строгий ACID. NoSQL (Redis, MongoDB) используют гибкие документы/ключ-значение/графы, проще горизонтально масштабируются (шардинг), но обычно уступают в сложных транзакционных связях." },
      { q: "На каком стандартном порту слушает подключения PostgreSQL?", a: "Порт `5432`." },
      { q: "Что такое схема (Schema) в PostgreSQL и чем она отличается от базы данных?", a: "Внутри одного сервера (кластера) может быть несколько изолированных баз данных (`shop_db`, `analytics_db`), а внутри каждой базы данных таблицы группируются в логические папки — схемы (по умолчанию `public`)." },
    ],
    selfStudy: [
      "Установи DBeaver Community Edition (бесплатный) и изучи, как выглядят таблицы и ER-диаграммы.",
      "Запусти локально PostgreSQL (напрямую или через Docker) и выполни команду `SELECT version();`.",
      "Разберись, какие команды метаданных есть в `psql`: `\\l`, `\\c db_name`, `\\dt`, `\\d table_name`.",
    ],
    resources: [
      pgdocs("tutorial-start.html", "PostgreSQL Tutorial: Getting Started"),
      baeldung("postgresql-get-started", "Baeldung: Introduction to PostgreSQL"),
      ROADMAP_BACKEND,
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 55 — DDL: CREATE, ALTER, DROP TABLE                           */
  /* ================================================================== */
  55: {
    deepDive: [
      h("Что такое DDL (Data Definition Language) и зачем он нужен"),
      p("Язык SQL делится на несколько категорий команд. **DDL (язык определения данных)** отвечает за **чертёж и структуру** самой базы: создание, изменение и удаление таблиц, колонок и ограничений — но НЕ работу со строками данных. В DDL входят команды `CREATE`, `ALTER`, `DROP` и `TRUNCATE`."),
      h("Типы данных PostgreSQL и их точное соответствие в Java"),
      table(
        ["Тип в PostgreSQL", "Тип в Java", "Когда использовать и особенности"],
        ["`BIGSERIAL` / `BIGINT GENERATED ALWAYS AS IDENTITY`", "`Long` / `long`", "64-битный автоинкрементный первичный ключ (ID до 9 квинтиллионов). Для продакшена лучше `BIGINT`, а не `INT` (`SERIAL`), чтобы ID не кончились!"],
        ["`INTEGER` / `INT`", "`Integer` / `int`", "Целое 4-байтное число (количество, возраст, год)"],
        ["`NUMERIC(12, 2)` / `DECIMAL`", "`java.math.BigDecimal`", "**Деньги и финансы!** 12 цифр всего, 2 после запятой — без погрешностей округления!"],
        ["`VARCHAR(n)` / `TEXT`", "`String`", "Строки текста. В PostgreSQL внутри движка `VARCHAR(n)` и `TEXT` работают одинаково быстро; `(n)` лишь добавляет ограничение длины."],
        ["`BOOLEAN`", "`Boolean` / `boolean`", "Истина или ложь (`TRUE` / `FALSE`)"],
        ["`TIMESTAMPTZ` (`TIMESTAMP WITH TIME ZONE`)", "`java.time.Instant`", "Точная метка даты и времени с учётом часового пояса UTC!"],
      ),
      h("Создание и модификация таблиц (CREATE / ALTER / DROP)"),
      code(r`
-- 1. Создаём таблицу пользователей со строгими ограничениями (Constraints):
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Изменение существующей таблицы без потери данных (ALTER TABLE):
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users RENAME COLUMN phone TO contact_phone;

-- 3. Удаление колонки или всей таблицы целиком:
ALTER TABLE users DROP COLUMN contact_phone;
-- DROP TABLE IF EXISTS users CASCADE; -- Осторожно: удаляет таблицу и данные навсегда!
`, "Сценарий SQL DDL для PostgreSQL"),
      h("Ловушка финансовой точности и именование в SQL"),
      p("В Java мы привыкли к `camelCase` (`createdAt`), но в PostgreSQL все неэкранированные имена автоматически приводятся к нижнему регистру (`createdat`). Поэтому в SQL **общепринятый стандарт именования — `snake_case`** (`users`, `order_items`, `created_at`)."),
      warn("Никогда не используйте REAL или DOUBLE PRECISION для денег в SQL!", "Как `float`/`double` в Java имеют погрешность IEEE 754, так и `REAL`/`FLOAT8` в PostgreSQL теряют копейки. Все финансовые столбцы обязаны иметь тип **`NUMERIC(12, 2)`** или храниться в целых копейках (`BIGINT`)."),
      h("Ограничение CHECK и значения DEFAULT прямо на уровне базы"),
      p("Ограничения в DDL (например `CHECK (price > 0)`) — последний рубеж защиты данных: даже если баг в Java-коде попытается записать отрицательную цену или `balance = -100`, сам PostgreSQL отклонит транзакцию и сохранит чистоту базы."),
      code(r`
// В Java-песочнице можно создать генератор DDL или валидатор схемы таблицы:
public class Main {
    public static void main(String[] args) {
        String ddl = """
                CREATE TABLE products (
                    id BIGSERIAL PRIMARY KEY,
                    title VARCHAR(100) NOT NULL,
                    price NUMERIC(10, 2) CHECK (price > 0),
                    created_at TIMESTAMPTZ DEFAULT NOW()
                );
                """;
        System.out.println("Готовая DDL-миграция:\n" + ddl);
    }
}`, "Текстовые блоки (Text Blocks Java 15+) для SQL в Main.java"),
      tip("Задание в песочнице справа", "Изучите использование Java Text Blocks (`\"\"\" ... \"\"\"`) в `Main.java`: соберите DDL-описание таблицы `products` (`id`, `title`, `price`, `stock`), а также напишите валидирующий сеттер Java-модели, который повторяет логику SQL `CHECK (price > 0)`."),
    ],
    interview: [
      { q: "Какие команды относятся к DDL, а какие к DML?", a: "DDL (Data Definition Language) управляет структурой схемы и таблиц: `CREATE`, `ALTER`, `DROP`, `TRUNCATE`. DML (Data Manipulation Language) работает со строками внутри таблиц: `SELECT`, `INSERT`, `UPDATE`, `DELETE`." },
      { q: "В чём разница между `DROP TABLE` и `TRUNCATE TABLE`?", a: "`DROP TABLE` полностью уничтожает и данные, и саму структуру таблицы из каталога БД. `TRUNCATE TABLE` мгновенно очищает все строки (освобождая страницы диска), но оставляет пустую таблицу и её колонки нетронутыми." },
      { q: "Какой тип данных выбирать в PostgreSQL и Java для цены товара?", a: "`NUMERIC(precision, scale)` (или `DECIMAL`) в PostgreSQL и `java.math.BigDecimal` в Java." },
      { q: "Почему в новом проекте на PostgreSQL предпочтительнее использовать `BIGINT GENERATED ALWAYS AS IDENTITY` вместо устаревшего `SERIAL`?", a: "`GENERATED ... IDENTITY` соответствует официальному стандарту SQL, запрещает случайную ручную подмену автоинкрементного ID без `OVERRIDING SYSTEM VALUE` и корректнее работает с правами доступа к последовательности (`SEQUENCE`)." },
    ],
    selfStudy: [
      "Попробуй создать таблицу `orders` в DBeaver / psql с ограничением `CHECK` и проверь, какая ошибка вернётся при нарушении.",
      "Узнай про разницу между `VARCHAR(255)` и `TEXT` в документации PostgreSQL.",
      "Изучи Java 15 Text Blocks (`\"\"\"`) — они незаменимы при написании многострочного SQL прямо внутри Java кода.",
    ],
    resources: [
      pgdocs("ddl.html", "PostgreSQL Docs: Data Definition (DDL)"),
      baeldung("sql-ddl-dml-dql-dcl-tcl", "Baeldung: DDL, DML, DQL, DCL, TCL"),
      ROADMAP_BACKEND,
    ],
  },

  /* ================================================================== */
  /*  DAY 56 — DML: INSERT, UPDATE, DELETE, SELECT                      */
  /* ================================================================== */
  56: {
    deepDive: [
      h("Что такое DML и четвёрка операций CRUD на чистом SQL"),
      p("Когда таблицы созданы через DDL, нужно наполнять их данными и работать со строками. За это отвечает **DML (Data Manipulation Language)** — четыре базовые операции любого бэкенда (**CRUD**: Create, Read, Update, Delete): `INSERT`, `SELECT`, `UPDATE`, `DELETE`."),
      table(
        ["CRUD", "SQL команда", "Ключевой синтаксис", "Фишка PostgreSQL"],
        ["**Create**", "`INSERT INTO ... VALUES ...`", "Вставка одной или сразу пачки строк", "`RETURNING id` сразу отдаёт сгенерированный `id` без второго запроса!"],
        ["**Read**", "`SELECT ... FROM ...`", "Чтение нужных столбцов и строк", "Поддерживает алиасы `AS`, расчёты и `LIMIT/OFFSET`"],
        ["**Update**", "`UPDATE ... SET ... WHERE ...`", "Изменение колонок у выбранных строк", "`RETURNING *` показывает обновлённые строки"],
        ["**Delete**", "`DELETE FROM ... WHERE ...`", "Удаление строк с записью в лог транзакций WAL", "Поддерживает откат (`ROLLBACK`) внутри транзакции"],
      ),
      h("Практические примеры INSERT, SELECT, UPDATE, DELETE и UPSERT"),
      code(r`
-- 1. CREATE: вставка и мгновенное получение созданного id (RETURNING id):
INSERT INTO users (username, email, balance)
VALUES ('alex', 'alex@mail.com', 1500.00),
       ('maria', 'maria@mail.com', 2500.00)
RETURNING id, created_at;

-- 2. READ: выбирайте ТОЛЬКО нужные колонки (SELECT * в продакшене антипаттерн!):
SELECT id, username, balance FROM users WHERE is_active = TRUE;

-- 3. UPDATE: пополнение баланса на 500 руб. конкретному пользователю:
UPDATE users
SET balance = balance + 500.00
WHERE id = 1;

-- 4. DELETE: удаление одной конкретной записи:
DELETE FROM users
WHERE id = 2;

-- 5. UPSERT (PostgreSQL): вставить или обновить при конфликте уникального email!
INSERT INTO users (username, email, balance)
VALUES ('alex', 'alex@mail.com', 3000.00)
ON CONFLICT (email) DO UPDATE SET balance = EXCLUDED.balance;
`, "Полный цикл DML операций и UPSERT в PostgreSQL"),
      warn("Кошмар продакшена №1: UPDATE или DELETE без условия WHERE!", "Если вы забудете написать `WHERE id = ...;` и выполните `DELETE FROM users;` или `UPDATE users SET balance = 0;`, база данных **без единого переспроса удалит или обнулит ВСЕ миллион строк таблицы**! Привыкайте сначала писать `WHERE ...` (и проверять его через `SELECT`), а только потом — `DELETE` или `UPDATE`."),
      h("Почему `DELETE FROM` и `TRUNCATE` работают совершенно по-разному"),
      p("`DELETE FROM users` удаляет строки по одной, записывая каждую в журнал отката WAL, проверяет триггеры удаления и работает медленно на больших таблицах (даже без `WHERE`), причём счётчик `id` продолжается дальше. `TRUNCATE TABLE users RESTART IDENTITY` мгновенно сбрасывает физические страницы таблицы на диске и обнуляет автоинкремент `id` обратно в 1."),
      h("Почему не стоит злоупотреблять `SELECT *` в Java-коде"),
      p("Если написать `SELECT * FROM articles`, вы вытягиваете по сети тяжёлые текстовые поля, которые даже не нужны в списке заголовков, и рискуете сломать парсинг по номерам колонок при добавлении новых столбцов. Указывайте конкретные поля: `SELECT id, title, price`."),
      code(r`
import java.util.*;

public class Main {
    public static void main(String[] args) {
        // Практикуем безопасный CRUD-контракт в памяти Java:
        Map<Long, Integer> balances = new HashMap<>(Map.of(1L, 1500, 2L, 2500));
        // Имитация UPDATE balances SET balance = balance + 500 WHERE id = 1
        balances.computeIfPresent(1L, (id, b) -> b + 500);
        // Безопасная проверка существования (аналог WHERE id = 99):
        int affectedRows = balances.containsKey(99L) ? 1 : 0;
        System.out.println("Обновлено строк для id=99: " + affectedRows + ", Баланс #1: " + balances.get(1L));
    }
}`, "Имитация affectedRows и безопасного UPDATE в Main.java"),
      tip("Задание в песочнице справа", "Смоделируйте таблицу товаров в `Map<Long, String>` в `Main.java` и напишите 4 метода (`insert`, `selectAll`, `updateById`, `deleteById`), возвращающие количество затронутых строк (как настоящий драйвер PostgreSQL!) и логирующие сформированный SQL."),
    ],
    interview: [
      { q: "В чём принципиальная разница между DELETE, TRUNCATE и DROP?", a: "`DELETE` — DML-операция, удаляет строки по одной с проверкой WHERE и записью в WAL, триггеры срабатывают, автоинкремент не сбрасывается. `TRUNCATE` — DDL-операция, мгновенно очищает всю таблицу целиком (без WHERE), освобождает память на диске. `DROP` уничтожает саму таблицу и её структуру." },
      { q: "Как в одном SQL-запросе PostgreSQL вставить строку и сразу узнать присвоенный ей автоинкрементный id?", a: "Добавить ключевое слово `RETURNING id` в конец запроса `INSERT INTO ... VALUES (...) RETURNING id;`." },
      { q: "Что такое UPSERT и как он пишется в PostgreSQL?", a: "Атомарная операция «вставить новую запись, а если такой ключ уже существует — обновить существующую». В PostgreSQL пишется через `INSERT ... ON CONFLICT (unique_col) DO UPDATE SET col = EXCLUDED.col;`." },
    ],
    selfStudy: [
      "Выполни цепочку `BEGIN; DELETE FROM users; SELECT * FROM users; ROLLBACK;` в psql/DBeaver — посмотри, как транзакция спасает от случайного удаления!",
      "Поэкспериментируй с `INSERT ... ON CONFLICT DO NOTHING` и `ON CONFLICT DO UPDATE`.",
      "Узнай о концепции Soft Delete (`deleted_at TIMESTAMPTZ` / `is_deleted BOOLEAN`) вместо физического `DELETE` в реальных проектах.",
    ],
    resources: [
      pgdocs("dml.html", "PostgreSQL Docs: Data Manipulation (DML)"),
      baeldung("sql-delete-vs-truncate", "Baeldung: Difference Between DELETE and TRUNCATE"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 57 — WHERE, ORDER BY, GROUP BY, HAVING                        */
  /* ================================================================== */
  57: {
    deepDive: [
      h("Аналитика и агрегация в SQL: почему не нужно тащить всю таблицу в Java"),
      p("Новички иногда загружают `SELECT * FROM orders` (1 000 000 строк) в `List<Order>` и затем фильтруют его через Stream API — это кладёт сеть и память сервера. **Правильный путь:** фильтровать, группировать и сортировать данные на стороне PostgreSQL через `WHERE`, `GROUP BY`, `HAVING` и `ORDER BY`, передавая по сети только готовые агрегированные цифры!"),
      h("Реальный порядок выполнения SQL-запроса внутри движка БД!"),
      p("Мы *пишем* запрос начиная со слова `SELECT`, но сам PostgreSQL исполняет инструкции в совершенно другом порядке — понимание этого порядка снимает 90% ошибок:"),
      table(
        ["Порядок", "Инструкция", "Что делает на этом шаге"],
        ["1", "`FROM` / `JOIN`", "Берёт таблицы и объединяет строки-источники"],
        ["2", "`WHERE`", "**Фильтрует исходные строки** ДО группировки (агрегаты `COUNT`/`SUM` здесь ещё не существуют!)"],
        ["3", "`GROUP BY`", "Схлопывает строки с одинаковым значением колонки в группы"],
        ["4", "`HAVING`", "**Фильтрует уже сгруппированные агрегаты** (например `HAVING SUM(amount) > 10000`)!"],
        ["5", "`SELECT` (+ `DISTINCT`)", "Вычисляет итоговые колонки, агрегатные функции и задаёт алиасы (`AS total`)"],
        ["6", "`ORDER BY`", "Сортирует результат (уже знает алиасы из `SELECT`!)"],
        ["7", "`LIMIT` / `OFFSET`", "Отрезает нужную страницу результата (пагинация)"],
      ),
      h("Главные агрегатные функции и ловушка NULL в COUNT"),
      list(
        "**`COUNT(*)`** считает **все строки** в группе (включая те, где поля равны `NULL`).",
        "**`COUNT(column)`** считает только строки, где `column IS NOT NULL`!",
        "**`SUM(x)`**, **`AVG(x)`**, **`MIN(x)`**, **`MAX(x)`** также игнорируют `NULL` значения.",
      ),
      code(r`
-- Пример аналитического запроса: топ-5 категорий со статусом PAID и суммой продаж > 50 000:
SELECT category,
       COUNT(*) AS orders_count,
       SUM(total_price) AS total_revenue,
       ROUND(AVG(total_price), 2) AS avg_check
FROM orders
WHERE status = 'PAID'              -- 1. Сначала отсекаем отменённые строки
GROUP BY category                  -- 2. Группируем по категории
HAVING SUM(total_price) > 50000    -- 3. Оставляем только прибыльные группы!
ORDER BY total_revenue DESC        -- 4. Сортируем по алиасу от большего к меньшему
LIMIT 5;                           -- 5. Берём топ-5
`, "GROUP BY, HAVING, WHERE и ORDER BY в одном запросе"),
      warn("Две частые ошибки на собеседованиях с WHERE / NULL / GROUP BY", "1) Нельзя писать `WHERE email = NULL` — результат в SQL всегда `UNKNOWN` (ложно)! Для проверки на пустоту обязательно пишут **`WHERE email IS NULL`** или **`IS NOT NULL`**.\n2) Каждая неагрегированная колонка из `SELECT` обязана быть перечислена в `GROUP BY`!"),
      h("Сопоставление SQL-запроса и Stream API в Main.java"),
      code(r`
import java.util.*;
import java.util.stream.*;

record Sale(String category, String status, int amount) {}

public class Main {
    public static void main(String[] args) {
        List<Sale> orders = List.of(
            new Sale("Tech", "PAID", 40000),
            new Sale("Tech", "PAID", 20000),
            new Sale("Food", "PAID", 3000),
            new Sale("Tech", "CANCELLED", 90000)
        );
        // Эквивалент WHERE status='PAID' GROUP BY category HAVING SUM > 50000:
        orders.stream()
              .filter(s -> "PAID".equals(s.status()))
              .collect(Collectors.groupingBy(Sale::category, Collectors.summingInt(Sale::amount)))
              .entrySet().stream()
              .filter(e -> e.getValue() > 50000)
              .forEach(System.out::println);
    }
}`, "Аналогия WHERE + GROUP BY + HAVING на Stream API в Main.java"),
      tip("Задание в песочнице справа", "Потренируйтесь в `Main.java` фильтровать и сортировать коллекцию `Sale` через Stream API, точно повторяя логический порядок `WHERE -> GROUP BY -> HAVING -> ORDER BY -> LIMIT`!"),
    ],
    interview: [
      { q: "В чём принципиальная разница между `WHERE` и `HAVING`?", a: "`WHERE` фильтрует отдельные строки таблицы **до** группировки и не может содержать агрегатных функций (`SUM`, `COUNT`). `HAVING` применяется **после** `GROUP BY` и фильтрует уже готовые группы на основе агрегатов." },
      { q: "Каков логический порядок выполнения инструкций SQL внутри СУБД?", a: "`FROM / JOIN` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT` -> `DISTINCT` -> `ORDER BY` -> `LIMIT / OFFSET`. Именно поэтому алиас из `SELECT` нельзя использовать в `WHERE`, но можно в `ORDER BY`." },
      { q: "В чём разница между `COUNT(*)` и `COUNT(email)`?", a: "`COUNT(*)` подсчитывает общее число строк (включая строки со значением `NULL`), а `COUNT(email)` считает только те строки, где колонка `email` не равна `NULL`." },
      { q: "Почему выражение `WHERE phone = NULL` не находит строки с NULL?", a: "В SQL используется трёхзначная логика (TRUE, FALSE, UNKNOWN). Любое сравнение с `NULL` через `=` или `!=` даёт `UNKNOWN` (не находит ничего). Нужно писать строго `IS NULL` или `IS NOT NULL`." },
    ],
    selfStudy: [
      "Выполни запрос `SELECT COUNT(*), COUNT(col)` на таблице со строками NULL и убедись в разнице.",
      "Разберись с операторами `LIKE` / `ILIKE` (`%` и `_`), `BETWEEN a AND b` и `IN (1, 2, 3)`.",
      "Изучи проблему производительности глубокой пагинации (`OFFSET 1000000`) и альтернативу — Keyset / Cursor Pagination (`WHERE id > last_id LIMIT 20`).",
    ],
    resources: [
      pgdocs("queries-table-expressions.html", "PostgreSQL Docs: Table Expressions (WHERE, GROUP BY, HAVING)"),
      baeldung("sql-having-vs-where", "Baeldung: HAVING vs WHERE in SQL"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 58 — JOIN: объединение таблиц                                 */
  /* ================================================================== */
  58: {
    deepDive: [
      h("Зачем нужны JOIN и почему данные не хранят в одной гигантской таблице?"),
      p("Если хранить имя и email клиента в каждой строчке таблицы `orders`, то при 100 заказах одного клиента его email повторится 100 раз — при смене email придётся обновлять 100 строк! В реляционных БД данные разбивают по отдельным таблицам (`users` и `orders`, связанных по `orders.user_id = users.id`), а при чтении склеивают их обратно с помощью оператора **`JOIN`**."),
      analogy("Ведомость заказов и картотека клиентов на заводе", "Вместо того чтобы переписывать домашний адрес клиента в каждой новой накладной, в накладную (`orders`) ставят только короткий номерок клиента (`user_id = 42`). Когда бухгалтерии нужен полный отчёт, она соединяет (`JOIN`) оба списка по номеру клиента!"),
      h("Все виды JOIN и диаграммы Венна — шпаргалка к собеседованию"),
      table(
        ["Тип JOIN", "Что попадает в результат", "Где `NULL`", "Когда применять"],
        ["**`INNER JOIN`** (просто `JOIN`)", "Только строки, у которых **нашлась пара в ОБЕИХ таблицах**", "Нигде по ключу связи", "Список заказов вместе с именами сделавших их клиентов"],
        ["**`LEFT JOIN`** (`LEFT OUTER JOIN`)", "**ВСЕ строки левой** таблицы + совпавшие из правой", "В полях правой таблицы, если пары нет", "Найти ВСЕХ пользователей, включая тех, у кого **0 заказов**!"],
        ["**`RIGHT JOIN`** (`RIGHT OUTER JOIN`)", "**ВСЕ строки правой** таблицы + совпавшие из левой", "В полях левой таблицы, если пары нет", "Зеркало `LEFT JOIN` (в реальном коде обычно меняют таблицы местами и пишут `LEFT JOIN`)"],
        ["**`FULL OUTER JOIN`**", "Абсолютно все строки обеих таблиц (совпавшие склеиваются)", "С любой стороны, где нет пары", "Сверка двух отчётов/справочников (найти расхождения с обеих сторон)"],
        ["**`CROSS JOIN`**", "Декартово произведение (каждая строка слева × каждая справа)", "— (пишется без `ON`)", "Генерация комбинаций (все размеры × все цвета товаров)"],
      ),
      code(r`
-- 1. INNER JOIN: пользователи И их заказы (пользователи без заказов не попадут)
SELECT u.username, o.id AS order_id, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id;

-- 2. КЛАССИЧЕСКИЙ ВОПРОС СОБЕСА: найти пользователей, у которых НЕТ ни одного заказа!
SELECT u.id, u.username
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL; -- Если заказа нет, LEFT JOIN подставит NULL в поля таблицы orders!
`, "INNER JOIN и классический поиск отсутствующих связей через LEFT JOIN"),
      h("Что такое SELF JOIN (связь таблицы с самой собой)?"),
      p("Если в таблице сотрудников `employees` есть колонка `manager_id`, ссылающаяся на `employees.id` начальника, вы можете объединить таблицу с ней же самой через разные алиасы: `FROM employees e LEFT JOIN employees m ON e.manager_id = m.id`."),
      warn("Коварный баг: условие по правой таблице в WHERE после LEFT JOIN!", "Если вы написали `LEFT JOIN orders o ON ... WHERE o.status = 'PAID'`, база сначала приклеит `NULL` пользователям без заказов, а потом **`WHERE o.status = 'PAID'` отбросит всех без заказов**, незаметно превратив ваш `LEFT JOIN` обратно в `INNER JOIN`! Фильтры по правой опциональной таблице ставьте прямо в **`ON o.user_id = u.id AND o.status = 'PAID'`**!"),
      h("Имитация INNER и LEFT JOIN в Main.java"),
      code(r`
import java.util.*;

record DbUser(long id, String name) {}
record DbOrder(long id, long userId, int total) {}

public class Main {
    public static void main(String[] args) {
        List<DbUser> users = List.of(new DbUser(1, "Али"), new DbUser(2, "Борис"));
        List<DbOrder> orders = List.of(new DbOrder(101, 1, 5000));

        System.out.println("=== Имитация LEFT JOIN + WHERE order IS NULL ===");
        for (DbUser u : users) {
            List<DbOrder> userOrders = orders.stream().filter(o -> o.userId() == u.id()).toList();
            if (userOrders.isEmpty()) {
                System.out.println(u.name() + " -> заказов нет (NULL)!");
            } else {
                userOrders.forEach(o -> System.out.println(u.name() + " -> заказ #" + o.id() + " (" + o.total() + ")"));
            }
        }
    }
}`, "Механика LEFT JOIN на коллекциях Java в Main.java"),
      tip("Задание в песочнице справа", "Реализуйте в `Main.java` аналог `INNER JOIN` и `LEFT JOIN` для списков `DbUser` и `DbOrder` (с 3 пользователями и 4 заказами), подсчитав сумму заказов каждого пользователя (включая `0` для тех, у кого заказов нет)."),
    ],
    interview: [
      { q: "В таблице A — 5 строк, в таблице B — 4 строки. Сколько строк минимум и максимум может вернуть INNER JOIN и LEFT JOIN?", a: "`INNER JOIN`: минимум 0 (нет совпадений), максимум $5 \\times 4 = 20$ (если все ключи одинаковы). `LEFT JOIN (A LEFT JOIN B)`: минимум 5 (все строки левой A сохраняются), максимум 20. `CROSS JOIN`: всегда ровно $5 \\times 4 = 20$." },
      { q: "Как через LEFT JOIN найти записи в левой таблице, для которых нет ни одной строки в правой?", a: "Сделать `LEFT JOIN right_table r ON ... WHERE r.id IS NULL;`." },
      { q: "Почему нельзя фильтровать колонки правой таблицы в WHERE после LEFT JOIN?", a: "Условие `WHERE r.col = 'X'` отфильтрует строки, в которых справа подставился `NULL`, фактически превратив `LEFT JOIN` в `INNER JOIN`. Условия фильтрации правой таблицы нужно переносить в секцию `ON`." },
      { q: "Какие алгоритмы физически использует PostgreSQL внутри для выполнения JOIN?", a: "Nested Loop Join (для малых выборок с индексом), Hash Join (строит хеш-таблицу по меньшей выборке за O(N+M)) и Merge Join (когда оба набора уже отсортированы)." },
    ],
    selfStudy: [
      "Потренируйся визуально на SQL Joins Visualizer — разбери каждый из 5 типов JOIN.",
      "Напиши SQL-запрос с `SELF JOIN` для дерева категорий (`parent_id -> id`).",
      "Сравни на практике перенос условия правой таблицы из `WHERE` в `ON` при `LEFT JOIN`.",
    ],
    resources: [
      pgdocs("tutorial-join.html", "PostgreSQL Tutorial: Joins Between Tables"),
      baeldung("sql-join-types", "Baeldung: Types of JOIN in SQL"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 59 — Ключи, ограничения и нормализация (1NF–3NF)              */
  /* ================================================================== */
  59: {
    deepDive: [
      h("Ключи и ограничения (Constraints): иммунитет базы данных"),
      p("Правильная схема базы данных сама не даёт плохим данным попасть внутрь, даже если программист забыл проверку в Java. Для этого существуют ключи и ограничения целостности:"),
      table(
        ["Ограничение", "Что гарантирует", "Пример"],
        ["**`PRIMARY KEY` (PK)**", "Уникально идентифицирует каждую строку (`UNIQUE + NOT NULL`). В таблице может быть только 1 PK.", "`id BIGINT PRIMARY KEY`"],
        ["**`FOREIGN KEY` (FK)**", "Ссылочная целостность: нельзя записать `user_id = 999`, если пользователя 999 нет в таблице `users`!", "`user_id BIGINT REFERENCES users(id)`"],
        ["**`UNIQUE`**", "Запрещает дубликаты значений в столбце (допускает разные NULL)", "`email VARCHAR(120) UNIQUE`"],
        ["**`NOT NULL`**", "Запрещает оставлять ячейку пустой", "`username VARCHAR(50) NOT NULL`"],
        ["**`CHECK (...)`**", "Произвольное булево условие бизнес-логики", "`CHECK (price > 0 AND discount < price)`"],
      ),
      h("Действия при удалении родителя: ON DELETE RESTRICT vs CASCADE vs SET NULL"),
      p("Что произойдёт, если удалить пользователя из `users`, когда у него в `orders` уже лежат 10 заказов? По умолчанию PostgreSQL заблокирует удаление (**`NO ACTION / RESTRICT`**), чтобы заказы не осиротели. Опция **`ON DELETE CASCADE`** автоматически удалит все заказы вместе с пользователем (отлично для корзины или дочерних позиций, но смертельно опасно для финансовой истории заказов!), а **`ON DELETE SET NULL`** обнулит `user_id`."),
      h("Нормализация баз данных: 1NF, 2NF, 3NF (простым языком к собесу)"),
      p("**Нормализация** — это правила проектирования таблиц, избавляющие от дублирования данных и аномалий при обновлении/удалении:"),
      list(
        "**Первая нормальная форма (1NF):** В каждой ячейке только **одно атомарное значение** (никаких списков вида `'phone1, phone2'` через запятую в одной колонке!) и все строки уникальны (есть Primary Key).",
        "**Вторая нормальная форма (2NF):** Таблица уже в 1NF + каждая неключевая колонка зависит от **всего составного ключа целиком**, а не от его части (актуально для составных ключей).",
        "**Третья нормальная форма (3NF):** Таблица в 2NF + **нет транзитивных зависимостей** между неключевыми столбцами («неключевые колонки зависят только от ключа, всего ключа и ничего кроме ключа»!). Например, если в `orders` хранить `city_id` И `city_name`, название города зависит от `city_id`, а не от заказа — его выносят в справочник `cities`!",
      ),
      code(r`
-- Пример схемы в 3NF с внешним ключом:
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT
);
`, "Схема таблиц в 3-й нормальной форме (3NF)"),
      h("Когда на практике делают осознанную Денормализацию?"),
      p("Иногда правила 3NF специально нарушают (хранят `total_amount` прямо в заказе или `price_at_purchase` в `order_items`), либо чтобы избежать тяжёлых `JOIN` в аналитике, либо чтобы зафиксировать **историческую цену на момент покупки** — ведь завтра товар подорожает, а старый чек меняться не должен!"),
      code(r`
// В Main.java видно важность фиксации исторических данных при денормализации:
public class Main {
    public static void main(String[] args) {
        double currentCatalogPrice = 1500.0;
        double priceAtPurchaseMoment = 1200.0; // Сохранено отдельно в order_items!
        System.out.println("Текущая цена в каталоге: " + currentCatalogPrice);
        System.out.println("Чек прошлого месяца (не сломался!): " + priceAtPurchaseMoment);
    }
}`, "Почему price_at_purchase хранят в строке заказа (Main.java)"),
      tip("Задание в песочнице справа", "Подумайте над ошибками 1NF/3NF: в `Main.java` напишите пример плохой «плоской» строки заказа `(orderId, clientName, clientCity, itemsCsv, pricesCsv)` и покажите с помощью классов/record, как она распадается на нормализованные таблицы (`Client`, `Order`, `OrderItem`)."),
    ],
    interview: [
      { q: "Объясните суть 1NF, 2NF и 3NF своими словами.", a: "1NF: атомарные значения в ячейках (без списков через запятую) + уникальный ключ. 2NF: в 1NF и при составном ключе нет зависимости полей только от *части* ключа. 3NF: в 2NF и нет транзитивных зависимостей — неключевые поля зависят исключительно от первичного ключа, а не друг от друга." },
      { q: "Что такое Foreign Key (внешний ключ) и зачем он нужен?", a: "Ограничение, связывающее поле одной таблицы с `PRIMARY KEY` (или `UNIQUE`) другой таблицы. Оно гарантирует ссылочную целостность: в БД физически невозможно добавить запись с ID несуществующего родителя." },
      { q: "Когда в реальных системах осознанно идут на денормализацию?", a: "1) Для кэширования вычисляемых полей и ускорения тяжёлых чтений без множества JOIN; 2) Для фиксации исторического снимка данных (например, адрес доставки и цена товара на момент покупки)." },
    ],
    selfStudy: [
      "Найди в интернете задачу «Приведи таблицу с заказами из Excel к 3NF» и пошагово разбей её.",
      "Разберись с суррогатными ключами (`id BIGSERIAL / UUID`) против естественных ключей (`email`, `passport_number`) — почему в 99% используют суррогатные.",
      "Проверь в Postgres, создаёт ли `FOREIGN KEY` автоматически индекс на колонке (спойлер: НЕТ — на FK-колонку индекс нужно вешать отдельно!).",
    ],
    resources: [
      pgdocs("ddl-constraints.html", "PostgreSQL Docs: Constraints"),
      baeldung("sql-normalization", "Baeldung: Database Normalization (1NF–3NF)"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 60 — Спринт: проектирование схемы интернет-магазина           */
  /* ================================================================== */
  60: {
    deepDive: [
      h("Практикум системного архитектора: проектируем БД E-Commerce"),
      p("На техническом собеседовании или при старте реального проекта вам ставят задачу: «Спроектируй схему базы данных для интернет-магазина / доставки / маркетплейса». Главный навык здесь — увидеть **типы связей между сущностями** (One-to-One, One-to-Many, Many-to-Many) и грамотно разложить их на таблицы."),
      analogy("Магазинный чек и каталог склада", "Каждая строчка в бумажном чеке (`order_items`) указывает на конкретный товар со склада (`product_id`), количество штук и **зафиксированную цену покупки**. Даже если завтра на складе изменится ценник, старый бумажный чек в архиве останется правдивым!"),
      h("Три типа связей на ER-диаграммах"),
      table(
        ["Связь", "Где ставится `FOREIGN KEY`", "Пример в интернет-магазине"],
        ["**1 : 1** (One-to-One)", "`FK` с ограничением `UNIQUE` (или общий `PK`) в зависимой таблице", "Пользователь ↔ Паспортные данные / Профиль настроек"],
        ["**1 : N** (One-to-Many)", "Всегда на стороне **«Многие» (N)**!", "Один клиент `customers` делает много заказов `orders` (`orders.customer_id`)"],
        ["**M : N** (Many-to-Many)", "**Промежуточная таблица (Junction Table)** с двумя FK!", "Заказы и Товары: в одном заказе много товаров, один товар в многих заказах → таблица **`order_items`**!"],
      ),
      h("Полная SQL-схема интернет-магазина (ER-модель в коде)"),
      code(r`
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(id),
    title VARCHAR(150) NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    stock_qty INT NOT NULL DEFAULT 0 CHECK (stock_qty >= 0)
);

CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Промежуточная таблица (M:N между orders и products) + дополнительные атрибуты позиции!
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price > 0), -- Фиксация цены на момент покупки!
    UNIQUE (order_id, product_id) -- Нельзя дважды добавить один и тот же товар отдельной строкой
);
`, "Промышленная схема таблиц интернет-магазина"),
      h("Почему в order_items обязательно копируют unit_price?"),
      p("Обратите внимание на деталь, которую обожают интервьюеры: у `products` уже есть поле `price`, но в `order_items` добавляют `unit_price`. Зачем? Если продавец завтра поднимет цену на ноутбук с 80 000 до 95 000 руб., без `unit_price` сумма всех **прошлых** оплаченных заказов в бухгалтерии внезапно вырастет задним числом!"),
      h("Моделирование ER-схемы в Java-сущностях (подготовка к Spring Data JPA)"),
      code(r`
import java.util.*;

record Category(long id, String name) {}
record ShopProduct(long id, long categoryId, String title, double price) {}
record OrderLine(long orderId, long productId, int qty, double unitPrice) {}

public class Main {
    public static void main(String[] args) {
        List<OrderLine> orderItems = List.of(
            new OrderLine(10L, 1L, 2, 1500.0),
            new OrderLine(10L, 2L, 1, 22000.0)
        );
        double orderTotal = orderItems.stream().mapToDouble(i -> i.qty() * i.unitPrice()).sum();
        System.out.println("Итоговая сумма заказа #10 по позициям order_items: " + orderTotal);
    }
}`, "Расчёт чека заказа из промежуточных позиций OrderLine в Main.java"),
      tip("Задание в песочнице справа", "Соберите полную Java-модель магазина (`Customer`, `Product`, `Order`, `OrderLine`), пропишите проверку остатка `stockQty` при оформлении заказа и выведите сводный чек с названиями товаров (имитируя `JOIN products ON product_id = products.id`)."),
    ],
    interview: [
      { q: "Как в реляционной базе данных реализуется связь «многие-ко-многим» (Many-to-Many)?", a: "Через создание промежуточной (связующей) таблицы, содержащей два внешних ключа `FOREIGN KEY` на обе основные таблицы (и часто дополнительные поля самой связи, например `quantity` и `unit_price` в `order_items`)." },
      { q: "На какой стороне таблицы всегда располагается Foreign Key при связи «один-ко-многим» (1:N)?", a: "Всегда на стороне «многие» (N): у заказа есть `customer_id`, а не у клиента список `order_ids`." },
      { q: "Почему в `order_items` стоит дублировать цену товара на момент покупки, даже если она есть в `products`?", a: "Чтобы изменение цены товара в каталоге в будущем не переписывало задним числом суммы уже совершённых и оплаченных заказов." },
    ],
    selfStudy: [
      "Построй визуальную ER-диаграмму этой схемы магазина на бесплатном сайте `dbdiagram.io`.",
      "Подумай, какие дополнительные таблицы понадобятся для доставки (`addresses`, `payments`) и промокодов.",
      "Напиши SQL-запрос, считающий итоговую выручку по заказам, объединяя `orders`, `order_items` и `customers` через `JOIN`.",
    ],
    resources: [
      pgdocs("ddl-constraints.html#DDL-CONSTRAINTS-FK", "PostgreSQL Docs: Foreign Keys"),
      ROADMAP_BACKEND,
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 61 — Индексы и транзакции (ACID)                              */
  /* ================================================================== */
  61: {
    deepDive: [
      h("1. Зачем нужны индексы (B-Tree) и как они ускоряют поиск в 1000 раз"),
      p("Без индекса запрос `SELECT * FROM users WHERE email = 'ali@mail.ru'` вынужден читать всю таблицу с диска от первой строки до последней — это **`Seq Scan`** (последовательное сканирование за $O(N)$). На 10 миллионах строк такой запрос может выполняться секунды! **Индекс (`CREATE INDEX`)** строит отсортированное сбалансированное дерево (**B-Tree**) по значениям колонки, снижая поиск до **$O(\\log N)$** — для 10 миллионов строк требуется всего **~3–4 прыжка по веткам дерева** (менее 1 миллисекунды)!"),
      table(
        ["Индекс B-Tree", "Плюсы", "Цена (минусы)"],
        ["По умолчанию для `PRIMARY KEY` и `UNIQUE`, вручную на часто фильтруемых колонках (`WHERE`, `JOIN`, `ORDER BY`)", "Ускоряет `SELECT`, `=`, `<`, `>`, `BETWEEN`, `LIKE 'abc%'` до $O(\\log N)$", "Занимает место на диске и **замедляет `INSERT / UPDATE / DELETE`** (дерево приходится перебалансировать при каждой записи)!"],
      ),
      code(r`
-- Создаём индекс для ускорения поиска по email или внешнему ключу:
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Составной индекс (порядок колонок КРИТИЧЕН: правило крайнего левого префикса!):
CREATE INDEX idx_orders_status_date ON orders(status, created_at);

-- Смотрим реальный план выполнения запроса (Seq Scan vs Index Scan):
EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'PAID';
`, "Индексы и анализ плана EXPLAIN ANALYZE в PostgreSQL"),
      h("2. Транзакции и 4 свойства ACID"),
      p("**Транзакция (`BEGIN ... COMMIT / ROLLBACK`)** объединяет несколько SQL-запросов в одну неделимую логическую операцию (например, перевод 1000 руб. со счёта А на счёт Б):"),
      list(
        "**A — Atomicity (Атомарность):** «Всё или ничего» — если при зачислении на счёт Б произошёл сбой, списание со счёта А автоматически откатывается (`ROLLBACK`).",
        "**C — Consistency (Согласованность):** База переходит из одного валидного состояния в другое без нарушения `CHECK`, `FK` и баланса денег.",
        "**I — Isolation (Изолированность):** Параллельно работающие транзакции не ломают и не мешают друг другу (настраивается уровнями изоляции).",
        "**D — Durability (Долговечность):** После ответа `COMMIT` данные гарантированно записаны в журнал WAL на диск и не потеряются даже при отключении света через миллисекунду.",
      ),
      h("3. Уровни изоляции транзакций и аномалии параллельного чтения"),
      table(
        ["Уровень изоляции", "Dirty Read (грязное чтение)", "Non-Repeatable Read (неповторяющееся)", "Phantom Read (фантомы)", "В PostgreSQL"],
        ["`READ UNCOMMITTED`", "Возможно", "Возможно", "Возможно", "Ведёт себя как `READ COMMITTED`"],
        ["**`READ COMMITTED`** *(по умолчанию в PostgreSQL)*", "❌ Защищено", "Возможно", "Возможно", "**По умолчанию!** Видит только зафиксированные данные."],
        ["`REPEATABLE READ` *(по умолчанию в MySQL)*", "❌ Защищено", "❌ Защищено", "❌ Защищено в Postgres (Snapshot Isolation!)", "Строго фиксированный снимок БД на старт транзакции"],
        ["`SERIALIZABLE`", "❌ Защищено", "❌ Защищено", "❌ Защищено", "Максимальная защита (риск `serialization failure` + ретраи)"],
      ),
      warn("Порядок колонок в составном индексе и ловушка функций в WHERE", "1) Составной индекс `(a, b)` ускоряет поиск по `(a)` и `(a, b)`, но **бесполезен**, если искать только по второму полю `WHERE b = 5`!\n2) Если написать `WHERE LOWER(email) = 'a@b.ru'`, обычный индекс на `email` **НЕ сработает** — для этого создают функциональный индекс `CREATE INDEX ... ON users(LOWER(email))`."),
      code(r`
import java.util.*;

public class Main {
    // Демонстрация разницы поиска за O(N) vs B-Tree / binarySearch за O(log N):
    public static void main(String[] args) {
        int[] sortedIds = new int[1_000_000];
        for (int i = 0; i < sortedIds.length; i++) sortedIds[i] = i;

        int target = 999_999;
        long t1 = System.nanoTime();
        for (int id : sortedIds) { if (id == target) break; } // Seq Scan O(N)
        long seqTime = System.nanoTime() - t1;

        long t2 = System.nanoTime();
        Arrays.binarySearch(sortedIds, target);               // Index Scan O(log N)
        long idxTime = System.nanoTime() - t2;

        System.out.println("Seq Scan (нс): " + seqTime + " | Index Search (нс): " + idxTime);
    }
}`, "Сравнение Seq Scan vs Index Search в Main.java"),
      tip("Задание в песочнице справа", "Запустите тест скорости `Seq Scan` vs `binarySearch` в `Main.java` и смоделируйте простой транзакционный перевод между двумя объектами счёта с откатом (`rollback`) при исключении!"),
    ],
    interview: [
      { q: "Как устроен стандартный индекс в PostgreSQL и почему нельзя индексировать каждую колонку таблицы?", a: "Обычно это сбалансированное B-Tree дерево, дающее поиск за $O(\\log N)$. Нельзя вешать индекс на всё подряд, потому что каждый индекс занимает память и замедляет операции записи (`INSERT`, `UPDATE`, `DELETE`) из-за необходимости обновлять деревья." },
      { q: "Расшифруйте ACID своими словами.", a: "Atomicity (всё или ничего), Consistency (сохранение правил и ограничений целостности), Isolation (независимость параллельных транзакций), Durability (сохранность зафиксированных данных после сбоя питания)." },
      { q: "Какой уровень изоляции транзакций стоит по умолчанию в PostgreSQL, и какие аномалии в нём возможны?", a: "`READ COMMITTED` — полностью исключает грязное чтение (Dirty Read), но допускает неповторяющееся чтение (Non-Repeatable Read) и фантомное чтение (Phantom Read), так как каждый запрос внутри транзакции видит свежие закоммиченные к моменту этого запроса данные." },
      { q: "Когда индекс не сработает, даже если он создан на колонку?", a: "1) Таблица крошечная (Seq Scan быстрее); 2) В условии `WHERE` колонка обёрнута в функцию (`LOWER(name)`); 3) `LIKE '%abc'` с `%` в начале; 4) Поиск по 2-й колонке составного индекса без 1-й; 5) Запрос выбирает >15–20% всех строк таблицы." },
    ],
    selfStudy: [
      "Запусти `EXPLAIN ANALYZE SELECT ...` в PostgreSQL до и после создания индекса `CREATE INDEX` на таблице со 100 000 строк.",
      "Узнай о других типах индексов в PostgreSQL помимо B-Tree: `GIN` (для JSONB и массивов), `Hash`, `Partial Index` (`WHERE is_active = true`).",
      "Познакомься со статистикой MVCC в PostgreSQL (как Postgres реализует изоляцию без блокировок чтения).",
    ],
    resources: [
      pgdocs("indexes.html", "PostgreSQL Docs: Indexes"),
      pgdocs("transaction-iso.html", "PostgreSQL Docs: Transaction Isolation"),
      habr("Индексы в PostgreSQL и EXPLAIN ANALYZE"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 62 — JDBC: подключение и Statement                            */
  /* ================================================================== */
  62: {
    deepDive: [
      h("Что такое JDBC (Java Database Connectivity) и как Java общается с СУБД"),
      p("**JDBC** — это стандартный низкоуровневый API в самой JDK (`java.sql.*`), который описывает единые правила общения Java-программы с любой реляционной БД (PostgreSQL, MySQL, Oracle). Каждая СУБД поставляет свой **драйвер** (JAR-библиотеку, например `org.postgresql:postgresql`), который реализует интерфейсы JDBC под сетевой протокол конкретной базы."),
      analogy("Единый электрический стандарт (JDBC) и сменные адаптеры (драйверы)", "Ваш Java-код написан под универсальные интерфейсы `Connection`, `Statement`, `ResultSet`. Если завтра компания сменит PostgreSQL на MySQL или H2, вам достаточно поменять JAR-драйвер и строку URL — основной Java-код JDBC останется тем же!"),
      h("Четыре ключевых объекта JDBC"),
      table(
        ["Интерфейс / Класс", "За что отвечает", "Важное правило"],
        ["**`DriverManager` / `DataSource`**", "Устанавливает подключение по URL-строке `jdbc:postgresql://host:port/db`", "В реальных сервисах используют пул подключений **`HikariCP` (`DataSource`)**!"],
        ["**`Connection`**", "Открытое сетевое TCP-соединение и сессия транзакции с БД", "Очень дорогой ресурс! Обязательно закрывать в `try-with-resources`."],
        ["**`Statement`**", "Отправляет простой статический SQL-запрос без параметров", "`executeQuery()` для `SELECT`, `executeUpdate()` для `INSERT/UPDATE/DELETE`."],
        ["**`ResultSet`**", "Табличный курсор, позволяющий читать ответ БД построчно", "Изначально стоит ДО первой строки: цикл идёт через `while (rs.next())`!"],
      ),
      h("Классический пример JDBC-запроса (с try-with-resources)"),
      code(r`
import java.sql.*;

public class JdbcDemo {
    public static void main(String[] args) {
        String url = "jdbc:postgresql://localhost:5432/shop_db";
        String user = "postgres";
        String pass = "secret";

        // ВАЖНО: все три ресурса реализуют AutoCloseable и закроются автоматически!
        try (Connection conn = DriverManager.getConnection(url, user, pass);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT id, username FROM users")) {

            while (rs.next()) { // Сдвигаем курсор на следующую строку таблицы
                long id = rs.getLong("id");
                String name = rs.getString("username");
                System.out.println("User #" + id + ": " + name);
            }
        } catch (SQLException e) {
            System.err.println("Ошибка БД (" + e.getSQLState() + "): " + e.getMessage());
        }
    }
}`, "Базовая работа с JDBC Connection, Statement и ResultSet"),
      h("Почему в продакшене запрещён DriverManager.getConnection() и нужен HikariCP"),
      p("Открытие нового TCP-соединения + TLS + авторизация в PostgreSQL занимает 20–50 мс! При 1000 запросов в секунду сервер просто задохнётся. Поэтому используют **Connection Pool** (в Spring Boot по умолчанию самый быстрый в мире пул — **HikariCP**): он держит заранее открытыми 10–20 соединений, а `conn.close()` не разрывает TCP-сокет, а просто **возвращает соединение обратно в пул** за 0.01 мс!"),
      warn("Ловушки ResultSet и незакрытых соединений", "1) Если не закрывать `Connection` (забыть `try-with-resources`), пул соединений исчерпается и весь бэкенд зависнет намертво (**Connection Leak**)!\n2) Попытка прочитать `rs.getString(...)` до первого вызова `rs.next()` вызовет `SQLException: ResultSet not positioned properly`."),
      code(r`
import java.util.*;

// Имитация работы ResultSet-курсора в памяти Main.java:
class MockResultSet {
    private final List<Map<String, Object>> rows;
    private int cursor = -1;

    MockResultSet(List<Map<String, Object>> rows) { this.rows = rows; }
    public boolean next() { return ++cursor < rows.size(); }
    public long getLong(String col) { return ((Number) rows.get(cursor).get(col)).longValue(); }
    public String getString(String col) { return String.valueOf(rows.get(cursor).get(col)); }
}

public class Main {
    public static void main(String[] args) {
        MockResultSet rs = new MockResultSet(List.of(
            Map.of("id", 1L, "username", "Али"),
            Map.of("id", 2L, "username", "Мария")
        ));
        while (rs.next()) {
            System.out.println("Строка: #" + rs.getLong("id") + " -> " + rs.getString("username"));
        }
    }
}`, "Имитация курсора ResultSet для тестирования в Main.java"),
      tip("Задание в песочнице справа", "Расширьте `MockResultSet` в `Main.java`, добавив поддержку `AutoCloseable` (чтобы отработать конструкцию `try (MockResultSet rs = ...)`) и безопасное чтение колонок!"),
    ],
    interview: [
      { q: "Назовите основные интерфейсы JDBC API и порядок их использования.", a: "`DriverManager`/`DataSource` -> `Connection` (сессия БД) -> `Statement`/`PreparedStatement` (SQL-команда) -> `ResultSet` (курсор таблицы ответа). Все они реализуют `AutoCloseable` и закрываются в `try-with-resources`." },
      { q: "В чём разница между `executeQuery()`, `executeUpdate()` и `execute()` в Statement?", a: "`executeQuery()` используется для `SELECT` и возвращает `ResultSet`. `executeUpdate()` — для `INSERT`, `UPDATE`, `DELETE` или DDL и возвращает `int` (число затронутых строк). `execute()` — универсальный метод, возвращающий `boolean` (есть ли ResultSet)." },
      { q: "Что такое Connection Pool (HikariCP) и зачем он нужен?", a: "Пул заранее открытых TCP-соединений с базой данных. Вместо дорогого создания нового соединения на каждый HTTP-запрос приложение берёт свободное из пула и по `close()` возвращает его назад." },
    ],
    selfStudy: [
      "Запусти реальное локальное подключение из IntelliJ IDEA к своему PostgreSQL через JDBC драйвер.",
      "Узнай, что означает флаг `connection.setAutoCommit(false)` для ручного управления транзакциями (`conn.commit()` / `conn.rollback()`) в JDBC.",
      "Посмотри документацию HikariCP — изучи параметры `maximum-pool-size` и `connection-timeout`.",
    ],
    resources: [
      oracle("jdbc/basics/index.html", "Oracle: JDBC Basics Tutorial"),
      baeldung("java-jdbc", "Baeldung: Introduction to JDBC"),
      baeldung("hikaricp", "Baeldung: Introduction to HikariCP"),
    ],
  },

  /* ================================================================== */
  /*  DAY 63 — JDBC: PreparedStatement и паттерн DAO                    */
  /* ================================================================== */
  63: {
    deepDive: [
      h("Уязвимость века: SQL Injection в обычном Statement"),
      p("Если вы склеиваете пользовательский ввод прямо в SQL-строку обычного `Statement` (`\"SELECT * FROM users WHERE login = '\" + input + \"'\"`), злоумышленник вводит вместо логина текст **`' OR '1'='1`**, или даже **`'; DROP TABLE users; --`**. База данных воспринимает этот ввод **как часть исполняемого SQL-кода** и отдаёт все чужие данные или удаляет таблицы!"),
      h("PreparedStatement: 100% защита и ускорение"),
      p("**`PreparedStatement`** решает проблему кардинально: SQL-шаблон отправляется в базу заранее с вопросительными знаками `?` (**плейсхолдерами**). Значения параметров передаются отдельным бинарным каналом (`ps.setString(1, input)` — нумерация параметров с **1**!), поэтому любой злонамеренный SQL внутри строки будет прочитан строго как **обычный текст**, а сама СУБД ещё и кэширует скомпилированный план выполнения запроса!"),
      code(r`
// СМЕРТЕЛЬНО ОПАСНО (SQL Injection!):
String badSql = "SELECT * FROM users WHERE login = '" + userInput + "'";

// 100% БЕЗОПАСНО (PreparedStatement):
String safeSql = "SELECT id, login FROM users WHERE login = ? AND is_active = ?";
try (PreparedStatement ps = conn.prepareStatement(safeSql)) {
    ps.setString(1, userInput); // Нумерация '?' начинается с 1!
    ps.setBoolean(2, true);
    try (ResultSet rs = ps.executeQuery()) {
        // ...
    }
}
`, "Сравнение Statement и PreparedStatement"),
      h("Паттерн DAO (Data Access Object): отделяем SQL от бизнес-логики"),
      p("Писать SQL-запросы прямо в коде обработчиков меню или веб-контроллеров — плохая архитектура. **DAO (Data Access Object)** — это отдельный класс/интерфейс-прослойка, который прячет все детали работы с базой (`Connection`, `PreparedStatement`, маппинг `ResultSet` -> объект `User`) и предоставляет сервисам чистые Java-методы: `findById(long id)`, `save(User u)`, `delete(long id)`."),
      code(r`
import java.util.*;

record AccountDto(long id, String owner, double balance) {}

interface AccountDao {
    Optional<AccountDto> findById(long id);
    void save(AccountDto account);
    List<AccountDto> findAll();
}

// In-Memory реализация интерфейса AccountDao (идеально для тестов и песочницы!):
class InMemoryAccountDao implements AccountDao {
    private final Map<Long, AccountDto> db = new LinkedHashMap<>();

    @Override
    public Optional<AccountDto> findById(long id) { return Optional.ofNullable(db.get(id)); }

    @Override
    public void save(AccountDto a) { db.put(a.id(), a); }

    @Override
    public List<AccountDto> findAll() { return new ArrayList<>(db.values()); }
}

public class Main {
    public static void main(String[] args) {
        AccountDao dao = new InMemoryAccountDao();
        dao.save(new AccountDto(1L, "Али", 5000));
        dao.findById(1L).ifPresent(a -> System.out.println("Найдено через DAO: " + a));
    }
}`, "Паттерн DAO (интерфейс + реализация) в Main.java"),
      h("Пакетная вставка (Batching): addBatch() и executeBatch()"),
      p("Если нужно вставить 10 000 строк в цикле, делать 10 000 отдельных сетевых запросов займёт десятки секунд. В `PreparedStatement` вызывают `ps.addBatch()` в цикле (каждые 500–1000 строк) и отправляют одной пачкой через `ps.executeBatch()` — это ускоряет импорт данных в 50–100 раз!"),
      warn("Ошибки с нумерацией в PreparedStatement", "В Java массивы и списки нумеруются с `0`, а параметры `?` в `PreparedStatement` и столбцы в `ResultSet` нумеруются **с единицы `1`**! Передача `ps.setString(0, ...)` сразу выбросит `SQLException: Parameter index out of range`."),
      tip("Задание в песочнице справа", "Реализуйте в `Main.java` простой защищённый конструктор параметров `prepareQuery(String template, Object... params)` и расширьте `InMemoryAccountDao` методом `updateBalance(long id, double delta)`!"),
    ],
    interview: [
      { q: "Чем `PreparedStatement` отличается от обычного `Statement`?", a: "1) Защищает от SQL-инъекций, передавая параметры `?` отдельно от структуры SQL-команды; 2) Позволяет БД предварительно скомпилировать и переиспользовать план выполнения запроса (быстрее при повторных вызовах); 3) Удобнее передавать даты, числа и байты без ручного экранирования кавычек." },
      { q: "Объясните принцип работы SQL-инъекции на примере формы входа.", a: "Если SQL строится конкатенацией `\"SELECT * FROM users WHERE name = '\" + name + \"'\"`, злоумышленник передаёт строку `' OR '1'='1`. Запрос превращается в `WHERE name = '' OR '1'='1'`, условие становится всегда истинным, и база выдаёт все записи или позволяет войти без пароля." },
      { q: "Что такое паттерн DAO и в чём разница между DAO и Repository (в Spring Data JPA)?", a: "DAO (Data Access Object) — низкоуровневая абстракция над таблицей БД (скрывает JDBC/SQL за CRUD-методами). Repository — более высокоуровневая концепция из DDD/Spring, работающая ближе к коллекции доменных объектов (агрегатов), хотя на практике в Spring Boot эти понятия тесно пересекаются." },
    ],
    selfStudy: [
      "Узнай о методе `conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)` для получения ID вставленной строки в JDBC.",
      "Познакомься со Spring `JdbcTemplate` — лёгкой обёрткой над JDBC, избавляющей от рутины `try-catch` и `while(rs.next())`.",
      "Пройди интерактивное задание по SQL Injection на сайте PortSwigger Web Security Academy.",
    ],
    resources: [
      baeldung("java-statement-preparedstatement", "Baeldung: Statement vs PreparedStatement"),
      baeldung("java-dao-pattern", "Baeldung: The DAO Pattern in Java"),
      oracle("jdbc/basics/prepared.html", "Oracle: Using Prepared Statements"),
    ],
  },

  /* ================================================================== */
  /*  DAY 64 — Maven: управление сборкой и зависимостями                */
  /* ================================================================== */
  64: {
    deepDive: [
      h("Проблема «JAR Hell» и зачем нужен инструмент сборки (Maven / Gradle)"),
      p("Реальный Java-проект использует десятки сторонних библиотек: драйвер PostgreSQL, Spring Boot, Jackson для JSON, JUnit для тестов, и каждая из них зависит ещё от 10 других библиотек (**транзитивные зависимости**)! Скачивать десятки `.jar` файлов вручную в папку `lib/`, следить за их версиями и компилировать сотни `.java` файлов командой `javac` вручную невозможно. Для автоматизации сборки и скачивания библиотек из **Maven Central** созданы **Apache Maven** и **Gradle**."),
      h("Анатомия главного файла конфигурации: pom.xml"),
      p("Maven описывает весь проект в XML-файле **`pom.xml`** (Project Object Model). Каждая библиотека и ваш собственный проект однозначно определяются **GAV-координатами**: `groupId` (организация, например `org.postgresql`), `artifactId` (имя библиотеки: `postgresql`) и `version` (`42.7.3`)."),
      code(r`
<project>
    <modelVersion>4.0.0</modelVersion>
    <!-- Координаты нашего проекта (GAV) -->
    <groupId>com.javaforge</groupId>
    <artifactId>shop-backend</artifactId>
    <version>1.0.0</version>

    <properties>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- Драйвер PostgreSQL скачается автоматически из Maven Central! -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>42.7.3</version>
        </dependency>
        <!-- JUnit 5 только для тестов (scope test не попадёт в финальный .jar!) -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
`, "Базовая структура pom.xml в Maven"),
      h("Стандартная структура папок Maven-проекта"),
      table(
        ["Директория", "Назначение"],
        ["`src/main/java`", "Весь продакшен-код проекта (классы, контроллеры, сервисы)"],
        ["`src/main/resources`", "Конфиги (`application.yml`), SQL-миграции Flyway, шаблоны"],
        ["`src/test/java`", "Модульные и интеграционные тесты (JUnit 5 / Mockito)"],
        ["`target/`", "Сгенерированные `.class` файлы, отчёты тестов и итоговый `.jar` (НЕ коммитить в Git!)"],
      ),
      h("Жизненный цикл сборки (Maven Lifecycle) и области видимости (Scopes)"),
      p("Основные команды запуска: **`mvn clean`** (очищает папку `target/`), **`mvn compile`** (компилирует код), **`mvn test`** (запускает тесты), **`mvn package`** (собирает `.jar` / `.war`), **`mvn install`** (кладёт `.jar` в локальный кэш `~/.m2/repository`, чтобы другие ваши локальные проекты могли его подключать)."),
      table(
        ["Scope зависимости", "Где видна", "Попадает в итоговый `.jar`?"],
        ["`compile` *(по умолчанию)*", "Везде (код, тесты, рантайм)", "✅ Да"],
        ["`test` (`JUnit`, `Mockito`)", "Только при компиляции и запуске тестов (`src/test`)", "❌ Нет (экономит место в продакшене!)"],
        ["`runtime` (`postgresql` драйвер)", "Не нужна при компиляции (достаточно интерфейсов `java.sql`), нужна при запуске", "✅ Да"],
        ["`provided` (`Lombok`, `Servlet API`)", "При компиляции и тестах (во время работы её предоставит сервер/JVM)", "❌ Нет"],
      ),
      warn("Что такое конфликт версий транзитивных зависимостей?", "Если Библиотека А хочет `jackson 2.15`, а Библиотека Б хочет `jackson 2.17`, Maven выбирает версию, которая **ближе по глубине дерева зависимостей** к вашему `pom.xml` (Nearest Definition). Если версии несовместимы, случаются `NoSuchMethodError` в рантайме — это чинят через `<exclusions>` или `<dependencyManagement>`."),
      code(r`
// В Main.java можно смоделировать разрешение транзитивных зависимостей Maven:
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<String, List<String>> deps = Map.of(
            "spring-boot-starter-web", List.of("spring-webmvc", "jackson-databind", "tomcat-embed"),
            "spring-boot-starter-data-jpa", List.of("hibernate-core", "spring-data-jpa", "hikariCP")
        );
        System.out.println("Транзитивные библиотеки для starter-web: " + deps.get("spring-boot-starter-web"));
    }
}`, "Транзитивные зависимости стартеров Maven в Main.java"),
      tip("Maven Wrapper (./mvnw) вместо глобального mvn", "В Spring Boot проектах в корне всегда лежит скрипт **`mvnw` / `mvnw.cmd`** (Maven Wrapper). Запуск `./mvnw package` сам скачает ровно ту версию Maven, которая нужна проекту — никакой ошибки «у коллеги другая версия Maven»!"),
      tip("Задание в песочнице справа", "Напишите в `Main.java` граф зависимостей `Map<String, List<String>>` и рекурсивную функцию (применяя День 25!), которая печатает дерево всех транзитивных зависимостей проекта без дубликатов."),
    ],
    interview: [
      { q: "Какие 3 главные координаты однозначно определяют любой артефакт в Maven?", a: "GAV: `groupId` (домен/компания), `artifactId` (имя библиотеки/модуля), `version` (версия релиза)." },
      { q: "Чем отличаются команды `mvn package`, `mvn install` и `mvn deploy`?", a: "`package` компилирует код, прогоняет тесты и собирает `.jar`/`.war` внутри папки `target/` проекта. `install` дополнительно копирует этот артефакт в локальный кэш `~/.m2/repository` на вашей машине. `deploy` загружает его на удалённый корпоративный репозиторий (Nexus/Artifactory)." },
      { q: "Объясните разницу между Dependency Scopes: compile, test, runtime и provided.", a: "`compile` — везде (по умолчанию); `test` — только для тестов, не попадает в артефакт; `runtime` — не нужна для компиляции (например JDBC драйвер или Flyway), но упаковывается для запуска; `provided` — нужна для компиляции (напр. Lombok), но в финальный архив не кладётся." },
    ],
    selfStudy: [
      "Загляни в папку `~/.m2/repository` на своём компьютере и посмотри, где Maven локально кэширует скачанные библиотеки.",
      "Выполни команду `mvn dependency:tree` на любом учебном проекте, чтобы увидеть всё дерево транзитивных библиотек.",
      "Сравни Maven (`pom.xml`) и Gradle (`build.gradle` / `build.gradle.kts`).",
    ],
    resources: [
      baeldung("maven", "Baeldung: Apache Maven Tutorials"),
      link("docs", "Apache Maven: Introduction to the Build Lifecycle", "https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html", "Официальная документация Maven", "en"),
      ROADMAP_JAVA,
    ],
  },

  /* ================================================================== */
  /*  DAY 65 — Flyway: миграции схемы БД                                */
  /* ================================================================== */
  65: {
    deepDive: [
      h("Почему нельзя менять таблицы руками в DBeaver или через hibernate.ddl-auto=update?"),
      p("Представьте команду из 5 разработчиков: Петя добавил в таблицу `users` колонку `phone` у себя на ноутбуке, а Катя — нет. Когда код Пети выложат на тестовый или продакшен-сервер, приложение **упадёт** с `ERROR: column \"phone\" does not exist`! А автоматика Hibernate (`ddl-auto=update`) в продакшене смертельно опасна: она не умеет безопасно переименовывать колонки, переносить данные и портит схему без контроля. Поэтому для базы данных нужен свой «Git» — **инструмент миграций Flyway** (или Liquibase)."),
      analogy("Журнал коммитов Git, но для структуры таблиц БД", "Каждая миграция `V1__...`, `V2__...` — это подписанный и запечатанный «патч» структуры базы. Как только сервер запускается, Flyway сверяет журнал выполненных патчей `flyway_schema_history` и накатывает недостающие скрипты строго по порядку номеров."),
      h("Как работает Flyway: магия версионированных SQL-файлов"),
      p("Все изменения схемы базы описываются строгими пронумерованными `.sql` файлами в папке `src/main/resources/db/migration`. При каждом старте Java-приложения (или команде `mvn flyway:migrate`) Flyway:"),
      list(
        "Проверяет системную таблицу **`flyway_schema_history`** внутри вашей базы данных.",
        "Сравнивает список уже применённых скриптов и их криптографические контрольные суммы (**checksum**).",
        "Находит новые миграции (например, `V2__add_phone_column.sql`), последовательно запускает их в транзакции и ставит отметку о выполнении!",
      ),
      h("Строгое соглашение об именовании файлов Flyway!"),
      table(
        ["Компонент имени `V1__create_users_table.sql`", "Смысл", "Правило (нарушение сломает старт!)"],
        ["**`V`** (заглавная буква `V`)", "Versioned Migration (выполняется ровно 1 раз)", "Есть также `R__` (Repeatable — перезапускается при изменении файла, для SQL View)."],
        ["**`1`** (или `1.2`, `20261119_01`)", "Порядковый номер версии", "Миграции применяются строго по возрастанию номера!"],
        ["**`__`** (**ДВА** нижних подчёркивания!)", "Обязательный разделитель версии и описания", "Одна черта `_` вызовет ошибку Flyway!"],
        ["`create_users_table.sql`", "Понятное описание миграции", "Только латиница, цифры и `_`."],
      ),
      code(r`
-- Файл: src/main/resources/db/migration/V1__init_schema.sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Файл: src/main/resources/db/migration/V2__add_user_role.sql
ALTER TABLE users ADD COLUMN role VARCHAR(30) NOT NULL DEFAULT 'STUDENT';
`, "Последовательные SQL-миграции Flyway"),
      warn("Главное правило миграций: НИКОГДА не редактируйте уже применённый файл V1__!", "Если миграция `V1` уже накатилась на сервер или коллегам, её хеш `checksum` записан в `flyway_schema_history`. Изменение даже одного пробела в `V1__` приведёт к ошибке **`FlywayValidateException: Migration checksum mismatch`** и сервер не запустится! Для любого изменения или исправления всегда создавайте **новую** миграцию `V3__...`!"),
      code(r`
import java.util.*;

// Имитация трекера применённых миграций Flyway в Main.java:
public class Main {
    public static void main(String[] args) {
        Set<String> schemaHistory = new LinkedHashSet<>(List.of("V1__init_schema.sql"));
        List<String> migrationFolder = List.of("V1__init_schema.sql", "V2__add_user_role.sql", "V3__create_orders.sql");

        for (String file : migrationFolder) {
            if (schemaHistory.contains(file)) {
                System.out.println("[SKIP] Уже применено: " + file);
            } else {
                System.out.println("[MIGRATE] Применяем новую миграцию: " + file);
                schemaHistory.add(file);
            }
        }
    }
}`, "Механизм работы таблицы flyway_schema_history в Main.java"),
      tip("Задание в песочнице справа", "Допишите в симулятор Flyway (`Main.java`) проверку контрольных сумм (`fileContent.hashCode()`) для уже применённых файлов, чтобы воспроизвести исключение `Checksum mismatch` при изменении старой миграции!"),
    ],
    interview: [
      { q: "Почему в продакшене вместо `spring.jpa.hibernate.ddl-auto=update` используют Flyway или Liquibase?", a: "`ddl-auto=update` не отслеживает историю, не умеет безопасно переименовывать колонки (удаляет старую и создаёт пустую новую с потерей данных), не умеет заполнять справочники и не проверяется при код-ревью. Flyway даёт детерминированное, версионируемое через Git обновление схемы." },
      { q: "Как работает таблица `flyway_schema_history` и что произойдёт, если поправить уже накатанный файл `V1__init.sql`?", a: "Flyway сохраняет версию, имя и контрольную сумму (CRC32 checksum) каждого выполненного скрипта в этой таблице. При изменении уже выполненного скрипта приложение при старте упадёт с ошибкой несовпадения контрольной суммы (`Migration checksum mismatch`)." },
      { q: "Какие правила именования файлов миграций в Flyway?", a: "Формат `V<НомерВерсии>__<Описание>.sql` — заглавная `V`, номер версии, обязательно **два** нижних подчёркивания `__`, описание и расширение `.sql`." },
    ],
    selfStudy: [
      "Познакомься с конкурентом Flyway — **Liquibase** (миграции в YAML/XML/SQL формата `changelog` и встроенными тегами отката `rollback`).",
      "Разберись с настройкой `spring.flyway.baseline-on-migrate=true` (когда Flyway подключают к уже существующей непустой базе данных).",
      "Подумай, как делать zero-downtime миграцию переименования колонки без падения работающей старой версии бэкенда (паттерн Expand and Contract).",
    ],
    resources: [
      baeldung("database-migrations-with-flyway", "Baeldung: Database Migrations with Flyway"),
      link("docs", "Flyway Documentation: Migrations", "https://documentation.red-gate.com/fd/migrations-184127470.html", "Официальная документация Flyway", "en"),
      ROADMAP_BACKEND,
    ],
  },

  /* ================================================================== */
  /*  DAY 66 — Git: основы версионирования                              */
  /* ================================================================== */
  66: {
    deepDive: [
      h("Зачем нужен Git: машина времени для кода и командной работы"),
      p("Представьте папку с дипломным проектом: `Project_final`, `Project_final_v2`, `Project_rabotaet_ne_trogat`. Стоит ошибиться и удалить нужный файл — и работа потеряна. **Git** — распределённая система контроля версий (VCS), которая хранит полную историю каждого изменения в проекте, позволяет мгновенно откатиться на любую прошлую точку, сравнивать правки по строкам и работать десяткам программистов над одним файлом одновременно."),
      h("Три главных области (состояния) локального репозитория Git"),
      table(
        ["Область Git", "Где физически", "Что происходит и какая команда переводит дальше"],
        ["**1. Working Directory (Рабочая папка)**", "Файлы на вашем диске (в IDE)", "Вы редактируете `.java` файлы. Команда **`git status`** показывает статус, а **`git diff`** — что именно изменилось."],
        ["**2. Staging Area / Index (Индекс)**", "Скрытый файл `.git/index`", "Черновик следующего снимка. Вы вручную отбираете готовые файлы командой **`git add <file>`** (или `git add .`)."],
        ["**3. Local Repository (`.git` История)**", "База объектов в папке `.git`", "Постоянный снимок (коммит) в истории с уникальным SHA-1 хешем: **`git commit -m \"feat: add order service\"`**."],
      ),
      h("Базовый ежедневный цикл команд Git"),
      code(r`
git init                              # 1. Инициализировать репозиторий в папке
git status                            # 2. Увидеть изменённые и неотслеживаемые файлы
git add src/Main.java                 # 3. Поместить файл в Staging (индекс)
git commit -m "feat: add user login"  # 4. Зафиксировать коммит в локальной истории
git log --oneline --graph             # 5. Красивый граф истории коммитов
git diff                              # 6. Посмотреть построчные изменения до git add
`, "Ежедневные команды Git в терминале", "bash"),
      h("Что такое .gitignore и что КАТЕГОРИЧЕСКИ нельзя коммитить!"),
      p("Файл **`.gitignore`** в корне проекта говорит Git, какие файлы и папки нужно игнорировать навсегда, чтобы не захламлять историю и не слить пароли на весь интернет:"),
      list(
        "**Секреты и ключи:** `.env`, `application-prod.yml` с паролями БД, приватные ключи `*.pem` (если они попали в Git — их сразу считают скомпрометированными!).",
        "**Артефакты сборки и кэши:** `target/`, `build/`, `out/`, `.next/`, `node_modules/`, `*.class`, `*.jar`.",
        "**Локальные настройки IDE:** `.idea/`, `*.iml`, `.vscode/`, `.DS_Store`.",
      ),
      warn("Отмена ошибок новичков: reset vs revert vs restore", "Если вы изменили файл, но ещё не делали `git add` — вернуть исходный вид можно через `git restore Main.java`. Если нужно отменить старый коммит, который **уже отправлен в общий GitHub**, никогда не переписывайте историю через `git reset --hard` — создайте новый «отменяющий» коммит командой **`git revert <hash>`**!"),
      code(r`
import java.util.*;

// Симулятор состояний Git (Working Tree -> Staging -> Commit History) в Main.java:
public class Main {
    public static void main(String[] args) {
        List<String> workingChanges = new ArrayList<>(List.of("Main.java", ".env", "target/app.jar"));
        Set<String> gitIgnore = Set.of(".env", "target/");

        List<String> staged = workingChanges.stream()
                .filter(f -> gitIgnore.stream().noneMatch(f::startsWith))
                .toList();
        System.out.println("Попало в Staging (учитывая .gitignore): " + staged);
    }
}`, "Фильтрация Staging с учётом .gitignore в Main.java"),
      tip("Задание в песочнице справа", "Убедитесь, что понимаете разницу между тремя областями Git: допишите в симуляторе `Main.java` методы `add(file)`, `commit(message)` (с генерацией хеша коммита) и `log()`!"),
    ],
    interview: [
      { q: "Назовите 3 основных состояния файлов (области) в Git и как между ними перемещаться.", a: "1) Working Directory (рабочая папка с правками) → `git add` переводит файл в 2) Staging Area (индекс / подготовка к снимку) → `git commit` сохраняет постоянный снимок в 3) Local Repository (`.git` историю)." },
      { q: "В чём разница между `git reset` и `git revert`?", a: "`git reset` передвигает указатель ветки назад и переписывает историю (допустимо только для локальных неопубликованных коммитов). `git revert <commit>` создаёт **новый** коммит, который аккуратно откатывает изменения указанного старого коммита, не ломая историю команды." },
      { q: "Что обязательно добавляют в `.gitignore` в Java/Maven/Spring проектах?", a: "Файлы секретов (`.env`, ключи), папку сборки `target/` (или `build/`), скомпилированные `.class`/`.jar`, настройки IDE (`.idea/`, `*.iml`, `.vscode/`) и системные файлы (`.DS_Store`)." },
    ],
    selfStudy: [
      "Прочитай стандарт написания коммитов **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`).",
      "Узнай, что делать, если `.env` с паролем уже случайно попал в Git (`git rm --cached .env` + смена всех паролей!).",
      "Пройди первые 5 интерактивных уровней тренажёра `learngitbranching.js.org`.",
    ],
    resources: [
      link("docs", "Pro Git Book (бесплатная официальная книга на RU)", "https://git-scm.com/book/ru/v2", "Лучший учебник по устройству Git от основ до внутренностей", "ru"),
      link("practice", "Learn Git Branching — интерактивный визуализатор", "https://learngitbranching.js.org/?locale=ru_RU", "Наглядный тренажёр команд Git", "ru"),
      ROADMAP_JAVA,
    ],
  },

  /* ================================================================== */
  /*  DAY 67 — Git: ветки, merge и rebase                               */
  /* ================================================================== */
  67: {
    deepDive: [
      h("Зачем нужны ветки (Branches) и что такое HEAD"),
      p("Нельзя писать новую сложную фичу в той же ветке `main`, с которой прямо сейчас деплоится продакшен: половина кода ещё не работает и всё сломает коллегам. **Ветка (branch)** в Git — это не копия всех файлов проекта, а крошечный **указатель (файл в 41 байт с хешем коммита)**! Специальный указатель **`HEAD`** показывает, на какой ветке (или конкретном коммите) вы сейчас работаете."),
      code(r`
git branch                     # Посмотреть все локальные ветки
git switch -c feat/auth        # Создать новую ветку feat/auth и сразу переключиться (современная замена checkout -b)
git switch main                # Переключиться обратно на main
`, "Создание и переключение веток через git switch", "bash"),
      h("Сравнение git merge и git rebase — вопрос №1 по Git на собеседованиях!"),
      table(
        ["Критерий", "`git merge feature`", "`git rebase main` (находясь в `feature`)"],
        ["Как работает", "Соединяет 2 ветки новым специальным **merge-коммитом** (с 2 родителями) — либо Fast-Forward, если `main` не ушла вперёд.", "Берёт ваши коммиты из `feature`, временно снимает их и **переигрывает (применяет заново с новыми хешами)** поверх свежего конца `main`."],
        ["История коммитов", "Сохраняет реальное дерево ветвлений и слияний как было.", "Делает историю **идеально прямой (линейной)**, без лишних merge-коммитов."],
        ["Опасность (Золотое правило!)", "Безопасен всегда — историю не переписывает.", "**ЗАПРЕЩЕНО делать `rebase` на общих публичных ветках (`main`)!** Меняются SHA-1 хеши коммитов, и история у коллег разойдётся!"],
      ),
      h("Как разрешать конфликты слияния (Merge Conflicts)?"),
      p("Если и вы в ветке `feature`, и коллега в `main` отредактировали **одни и те же строки** одного файла, Git остановит слияние и вставит в файл маркеры конфликта, попросив вас вручную выбрать финальный вариант:"),
      code(r`
<<<<<<< HEAD (ваша текущая ветка)
int timeoutMs = 5000;
=======
int timeoutMs = 10000;
>>>>>>> feat/increase-timeout
`, "Маркеры конфликта слияния в файле", "text"),
      p("Шаги решения конфликта: 1) Выбираете правильный код (удаляя строки `<<<<<<<`, `=======`, `>>>>>>>`). 2) Выполняете `git add <файл>`. 3) Завершаете слияние (`git commit` при merge или `git rebase --continue` при rebase). Если передумали — откат одной командой `git merge --abort` или `git rebase --abort`."),
      h("Что такое git stash и git cherry-pick?"),
      list(
        "**`git stash`** — прячет незавершённые нескоммиченные правки на временную «полку», чтобы чисто переключиться на срочную задачу (затем возвращают через `git stash pop`).",
        "**`git cherry-pick <hash>`** — точечно копирует **один конкретный коммит** из другой ветки (например, срочный фикс бага в релиз).",
      ),
      tip("Задание в песочнице справа", "Разберите структуру коммитов: в `Main.java` можно смоделировать односвязный список коммитов (`record Commit(String hash, String parentHash, String msg)`) и проследить, почему при `rebase` меняются `hash` и `parentHash` переносимых коммитов!"),
    ],
    interview: [
      { q: "В чём главное отличие `git merge` от `git rebase` и почему нельзя делать rebase общей ветки?", a: "`merge` объединяет истории, создавая новый коммит слияния (или Fast-Forward). `rebase` переносит коммиты вашей ветки поверх целевой, **перезаписывая их SHA-1 хеши** в ровную линию. Делать rebase на общей ветке вроде `main` нельзя, потому что у других разработчиков останутся старые хеши, и при `git pull`/`push` история сломается и продублируется." },
      { q: "Что такое указатель HEAD и состояние Detached HEAD?", a: "`HEAD` — указатель на текущую активную ветку (через неё — на последний коммит). Если сделать `checkout` напрямую на старый хеш коммита вместо имени ветки, возникает состояние `Detached HEAD` — новые коммиты не привязаны ни к одной ветке и потеряются при переключении, если не создать от них ветку." },
      { q: "Как отменить начатый merge или rebase, если конфликтов оказалось слишком много?", a: "Командами `git merge --abort` или `git rebase --abort`." },
    ],
    selfStudy: [
      "Пройди в `learngitbranching.js.org` уровни про `merge`, `rebase`, `cherry-pick` и `HEAD~1`.",
      "Смоделируй конфликт на тестовом репозитории: поправь 1 строку в 2 ветках и реши конфликт в IDE или редакторе.",
      "Узнай про `git rebase -i` (Interactive Rebase) для склейки (`squash`) нескольких мелких черновых коммитов в один красивый перед Pull Request.",
    ],
    resources: [
      link("practice", "Learn Git Branching: Ветвление, Merge и Rebase", "https://learngitbranching.js.org/?locale=ru_RU", "Интерактивный тренажёр", "ru"),
      link("docs", "Pro Git: Ветвление и слияние в Git", "https://git-scm.com/book/ru/v2/Ветвление-в-Git-О-ветвлении-в-двух-словах", "Официальная книга Pro Git", "ru"),
      baeldung("ops/git-merge-vs-rebase", "Baeldung: Git Merge vs Rebase"),
    ],
  },

  /* ================================================================== */
  /*  DAY 68 — GitHub, Pull Requests и Code Review                      */
  /* ================================================================== */
  68: {
    deepDive: [
      h("Удалённые репозитории и синхронизация: Git vs GitHub"),
      p("Частая путаница новичков: **Git** — это программа на вашем компьютере, а **GitHub / GitLab / Bitbucket** — облачный веб-сервер (хостинг) для хранения удалённой копии репозитория (**`origin`**) и совместной работы команды."),
      analogy("Локальная папка черновиков vs общий сейф команды", "Вы можете сколько угодно коммитить локально в метро без интернета (`git commit`), а когда подключитесь к сети — отправляете свои ветки на ревью через `git push`, чтобы коллеги проверили их в Pull Request до попадания в главный продакшен-код `main`."),
      table(
        ["Команда", "Что делает"],
        ["`git remote -v`", "Показывает адреса подключённых удалённых серверов (`origin`)"],
        ["`git push -u origin feat/login`", "Отправляет вашу локальную ветку на GitHub и связывает их (`-u`)"],
        ["`git fetch`", "Безопасно **скачивает** свежую историю с сервера в `.git`, **НЕ трогая ваши файлы и локальные ветки**"],
        ["`git pull`", "Делает `git fetch` + сразу сливает изменения в текущую ветку (`merge` или `--rebase`)"],
      ),
      h("Рабочий процесс команды: GitHub Flow и Pull Request (PR)"),
      p("В коммерческих компаниях **ветка `main` защищена** — в неё **запрещено** делать `git push` напрямую! Вся новая функциональность попадает в `main` только через **Pull Request (PR)** (в GitLab называется **Merge Request / MR**):"),
      list(
        "**1.** От актуального `main` создаёте ветку `feat/payment-api`.",
        "**2.** Пишете код и тесты, коммитите, отправляете ветку: `git push -u origin feat/payment-api`.",
        "**3.** На GitHub открываете **Pull Request** (`feat/payment-api` → `main`) с понятным описанием, что сделано.",
        "**4.** Запускается **CI (GitHub Actions)**: сервер автоматически собирает `mvn test`, проверяя тесты и компиляцию.",
        "**5.** Коллеги проводят **Code Review**: оставляют комментарии по архитектуре, неймингу, обработке ошибок и граничных случаев.",
        "**6.** После исправления замечаний и получения **Approve** PR вливается в `main`, а рабочая ветка удаляется.",
      ),
      h("Чем запомниться на собеседовании: культура портфолио на GitHub"),
      p("Первое, куда заходит техлид или HR, открыв ваше резюме — это ссылка на ваш GitHub. Хороший профиль Java-джуна отличается: 1) Чистым `README.md` с описанием проекта, стеком, схемой БД и командой запуска (`docker compose up`); 2) Отсутствием закоммиченных папок `target/`, `.idea/` и файлов с паролями `.env`; 3) Аккуратной историей осмысленных коммитов (а не 1 коммит `\"all files\"`)."),
      code(r`
# Проверка перед пушем на GitHub:
git status                   # Нет ли секретов .env или папки target/?
./mvnw test                  # Проходят ли все тесты локально?
git pull --rebase origin main # Подтянуть свежие правки коллег перед PR
git push origin feat/my-task # Отправить ветку и открыть Pull Request
`, "Чеклист разработчика перед открытием Pull Request", "bash"),
      warn("Разница между `git push --force` и `git push --force-with-lease`", "После `rebase` личной ветки история изменилась, и обычный `push` будет отклонён. Вместо опасного `--force` (способного затереть чужие коммиты, если кто-то дописал в ту же ветку) всегда используйте **`--force-with-lease`**: он отменит пуш, если на сервере появились неизвестные вам коммиты!"),
      tip("Задание в песочнице справа", "Подготовьтесь к финальному модулю: сформулируйте чек-лист README для будущего Spring Boot проекта и посмотрите в `Main.java`, как GitHub Flow защищает основную ветку от поломки продакшена."),
    ],
    interview: [
      { q: "В чём разница между `git fetch` и `git pull`?", a: "`git fetch` только загружает новые коммиты и ветки с удалённого сервера в локальную базу `.git` для просмотра, не меняя рабочие файлы и текущую ветку. `git pull` — это комбинация `git fetch` + немедленный `git merge` (или `rebase`) в вашу текущую ветку." },
      { q: "Зачем нужен Pull Request (Merge Request) и Code Review?", a: "PR — механизм контроля качества перед вливанием кода в основную ветку: 1) Прогоняются автоматические тесты и линтеры в CI; 2) Другие разработчики проверяют архитектуру, логику, безопасность и читаемость кода, делясь опытом и снижая риск багов в продакшене." },
      { q: "Почему в защищённых ветках запрещают `git push --force`, а при rebase своей ветки советуют `--force-with-lease`?", a: "`--force` слепо перезаписывает удалённую ветку на сервере, рискуя уничтожить коммиты коллеги. `--force-with-lease` проверяет, что удалённая ветка не обновилась с момента вашего последнего fetch, и только тогда разрешает пуш." },
    ],
    selfStudy: [
      "Напиши шаблон качественного `README.md` со структурой: Описание, Технологический стек, Архитектура, Быстрый старт через Docker Compose.",
      "Изучи базовый workflow GitHub Actions (`.github/workflows/ci.yml`), который автоматически запускает `mvn test` при каждом Pull Request.",
      "Создай на GitHub пробный PR между двумя ветками и оставь сам себе review-комментарий на конкретную строку кода.",
    ],
    resources: [
      link("docs", "GitHub Docs: About Pull Requests", "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests", "Официальный гайд GitHub по PR", "en"),
      ROADMAP_BACKEND,
      JAVA_INTERVIEW_RU,
    ],
  },
};
