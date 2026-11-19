import type { QuizQuestion } from "./types";

export const ADVANCED_QUESTIONS: QuizQuestion[] = [
  // =========================================================================
  // CATEGORY: COLLECTIONS & STREAM API (12 questions)
  // =========================================================================
  {
    id: "q_col_1",
    category: "collections",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Какова асимптотическая сложность (Big-O) получения элемента по индексу list.get(i) в ArrayList и в LinkedList?",
    options: [
      "ArrayList: O(1), LinkedList: O(1)",
      "ArrayList: O(1), LinkedList: O(N)",
      "ArrayList: O(N), LinkedList: O(1)",
      "ArrayList: O(log N), LinkedList: O(N)",
    ],
    correctIndex: 1,
    explanation:
      "ArrayList построен на обычном массиве Object[], поэтому доступ по индексу мгновенный — O(1). LinkedList — двусвязный список: чтобы дойти до индекса i, ему приходится перебирать узлы с начала или с конца за O(N).",
    theoryHint: "Как устроены ArrayList (массив) и LinkedList (цепочка узлов) внутри?",
    relatedLinks: [
      { title: "День 41: ArrayList изнутри", url: "/?day=41", type: "lesson", day: 41 },
      { title: "День 42: LinkedList и сравнение Big-O", url: "/?day=42", type: "lesson", day: 42 },
    ],
  },
  {
    id: "q_col_2",
    category: "collections",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Что гарантирует коллекция HashSet в Java?",
    options: [
      "Сохраняет порядок вставки элементов",
      "Автоматически сортирует элементы по возрастанию",
      "Хранит только уникальные элементы (без дубликатов)",
      "Позволяет получать элементы по индексу set.get(0)",
    ],
    correctIndex: 2,
    explanation:
      "HashSet хранит только уникальные элементы (под капотом он использует HashMap, где элементы лежат в качестве ключей) и не гарантирует порядок итерации. Для сортировки используют TreeSet, для порядка вставки — LinkedHashSet.",
    theoryHint: "Set — это множество. Что является его главным свойством?",
    relatedLinks: [
      { title: "День 45: HashSet, TreeMap, TreeSet", url: "/?day=45", type: "lesson", day: 45 },
    ],
  },
  {
    id: "q_col_3",
    category: "collections",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Какой метод Stream API преобразует каждый элемент потока в другой тип/вид (например, User в String email)?",
    options: ["filter()", "map()", "forEach()", "reduce()"],
    correctIndex: 1,
    explanation:
      "Операция map(Function<T, R>) применяет переданную функцию преобразования к каждому элементу потока (1-к-1). filter() отсеивает элементы, reduce() сворачивает в одно значение.",
    theoryHint: "Вспомни базовый конвейер Stream: фильтрация -> трансформация -> сборка.",
    relatedLinks: [
      { title: "День 49: Stream API — базовые операции", url: "/?day=49", type: "lesson", day: 49 },
    ],
  },
  {
    id: "q_col_4",
    category: "collections",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Зачем в Java 8 был добавлен класс Optional<T>?",
    options: [
      "Для ускорения работы с массивами",
      "Чтобы явно показать, что возвращаемое значение может отсутствовать, и безопасно избежать NullPointerException",
      "Для замены списка ArrayList",
      "Чтобы сериализовать JSON без библиотек",
    ],
    correctIndex: 1,
    explanation:
      "Optional<T> — это контейнер-обёртка, который может либо содержать непустое значение, либо быть пустым. Он заставляет вызывающий код обработать случай отсутствия значения через orElse(), orElseThrow(), ifPresent() и уменьшает риск NPE.",
    theoryHint: "От какого самого частого RuntimeException защищает Optional?",
    relatedLinks: [
      { title: "День 51: Optional и Method References", url: "/?day=51", type: "lesson", day: 51 },
    ],
  },
  {
    id: "q_col_5",
    category: "collections",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что произойдёт при попытке удалить элемент из ArrayList внутри обычного цикла for-each?",
    codeSnippet: `List<String> list = new ArrayList<>(List.of("A", "B", "C"));
for (String s : list) {
    if (s.equals("B")) list.remove(s);
}`,
    options: [
      "Элемент B успешно удалится",
      "Выбросится ConcurrentModificationException",
      "Цикл просто пропустит следующий элемент без ошибки",
      "Код не скомпилируется",
    ],
    correctIndex: 1,
    explanation:
      "Внутри for-each работает скрытый Iterator со счётчиком modCount. Прямой вызов list.remove() меняет структуру списка в обход итератора, и при следующем шаге next() выбрасывается ConcurrentModificationException (fail-fast поведение). Правильно: использовать list.removeIf(...) или iterator.remove().",
    theoryHint: "Как ведёт себя fail-fast Iterator при модификации коллекции напрямую?",
    relatedLinks: [
      { title: "День 43: Iterator и ConcurrentModificationException", url: "/?day=43", type: "lesson", day: 43 },
    ],
  },
  {
    id: "q_col_6",
    category: "collections",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Какие значения имеют начальная ёмкость (capacity) и коэффициент загрузки (load factor) у HashMap по умолчанию?",
    options: [
      "Capacity: 10, Load Factor: 0.5",
      "Capacity: 16, Load Factor: 0.75",
      "Capacity: 32, Load Factor: 1.0",
      "Capacity: 8, Load Factor: 0.8",
    ],
    correctIndex: 1,
    explanation:
      "По умолчанию HashMap создаёт таблицу из 16 корзин (buckets). Как только количество элементов достигает threshold = 16 * 0.75 = 12, размер таблицы удваивается (32, 64...) и выполняется rehashing.",
    theoryHint: "16 корзин и порог заполнения в 3/4 (75%).",
    relatedLinks: [
      { title: "День 44: HashMap изнутри", url: "/?day=44", type: "lesson", day: 44 },
    ],
  },
  {
    id: "q_col_7",
    category: "collections",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что такое стирание типов (Type Erasure) в Java Generics?",
    options: [
      "Удаление неиспользуемых переменных сборщиком мусора",
      "На этапе компиляции обобщённые параметры <T> заменяются на Object (или верхнюю границу), а в байткоде проверок <T> уже нет",
      "Запрет на использование примитивов в циклах",
      "Очистка памяти Heap после завершения метода",
    ],
    correctIndex: 1,
    explanation:
      "Generics обеспечивают безопасность типов только на этапе компиляции (compile-time). Для обратной совместимости компилятор стирает параметры типов (List<String> и List<Integer> в рантайме превращаются в обычный List).",
    theoryHint: "Существует ли разница между ArrayList<String> и ArrayList<Integer> в байткоде JVM?",
    relatedLinks: [
      { title: "День 40: Generics и Type Erasure", url: "/?day=40", type: "lesson", day: 40 },
    ],
  },
  {
    id: "q_col_8",
    category: "collections",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что выведет этот фрагмент со Stream API? (Понимание ленивости Streams)",
    codeSnippet: `List<String> items = List.of("a", "b", "c");
items.stream()
     .filter(s -> {
         System.out.print(s + " ");
         return s.equals("b");
     });
System.out.print("done");`,
    options: ["a b c done", "b done", "done", "a done"],
    correctIndex: 2,
    explanation:
      "Промежуточные операции Stream (filter, map, sorted) ленивые (lazy): они НЕ выполняются, пока не вызвана терминальная операция (collect, count, findFirst, forEach). Поэтому фильтр ни разу не запустился — напечатается только \"done\".",
    theoryHint: "Есть ли здесь терминальная (завершающая) операция Stream?",
    relatedLinks: [
      { title: "День 49: Stream API — intermediate vs terminal", url: "/?day=49", type: "lesson", day: 49 },
    ],
  },
  {
    id: "q_col_9",
    category: "collections",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "В чём разница между Comparable и Comparator?",
    options: [
      "Comparable меняет сам класс (метод compareTo), задавая естественный порядок; Comparator — отдельный внешний объект (метод compare) для разных вариантов сортировки",
      "Comparable работает только с числами, Comparator — только со строками",
      "Comparator быстрее работает за O(1)",
      "Разницы нет, это синонимы",
    ],
    correctIndex: 0,
    explanation:
      "Comparable<T> реализуется внутри самого класса (определяет естественный порядок сортировки, например по id). Comparator<T> позволяет создавать сколько угодно внешних стратегий сортировки (по имени, по цене, по дате) и легко передаётся как лямбда.",
    theoryHint: "Один интерфейс реализует сам объект («умеет сравнивать себя»), а второй — это внешний «компаратор-судья».",
    relatedLinks: [
      { title: "День 43: Comparable и Comparator", url: "/?day=43", type: "lesson", day: 43 },
    ],
  },
  {
    id: "q_col_10",
    category: "collections",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Что происходит в HashMap (Java 8+), когда количество элементов с коллизиями в одной корзине превышает порог TREEIFY_THRESHOLD (8)?",
    options: [
      "HashMap выбрасывает OutOfMemoryError",
      "Связный список внутри корзины преобразуется в сбалансированное красно-чёрное дерево (если общая таблица >= 64), снижая поиск с O(N) до O(log N)",
      "Старые элементы в корзине перезаписываются",
      "Все ключи автоматически перемещаются в TreeSet",
    ],
    correctIndex: 1,
    explanation:
      "До Java 8 коллизии хранились только в связном списке O(N). Начиная с Java 8, при >= 8 элементах в корзине (и размере таблицы >= 64) список превращается в красно-чёрное дерево, гарантируя сложность поиска O(log N) в худшем случае.",
    theoryHint: "Какая древовидная структура данных спасает HashMap от деградации поиска до O(N) при массовых коллизиях?",
    relatedLinks: [
      { title: "День 44: HashMap изнутри и красно-чёрные деревья", url: "/?day=44", type: "lesson", day: 44 },
    ],
  },
  {
    id: "q_col_11",
    category: "collections",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Что произойдёт, если положить изменяемый (mutable) объект в качестве ключа в HashMap, а затем изменить поле, участвующее в hashCode()?",
    options: [
      "HashMap автоматически пересчитает индекс корзины",
      "Объект станет «потерянным»: map.get(key) вернёт null, так как поиск пойдёт уже в другую корзину",
      "Выбросится IllegalStateException",
      "Объект удалится из памяти сборщиком мусора",
    ],
    correctIndex: 1,
    explanation:
      "HashMap запоминает положение узла по старому хешу на момент вставки put(). После мутации объекта его новый hashCode указывает в другую корзину, и map.get(key) вернёт null (утечка памяти в мапе). Поэтому ключами рекомендуют делать immutable-классы (String, Integer, Record).",
    theoryHint: "Пересчитывает ли HashMap местоположение уже вставленного ключа, если изменить его поля?",
    relatedLinks: [
      { title: "День 36: equals и hashCode", url: "/?day=36", type: "lesson", day: 36 },
      { title: "День 44: Ловушка изменяемых ключей в HashMap", url: "/?day=44", type: "lesson", day: 44 },
    ],
  },
  {
    id: "q_col_12",
    category: "collections",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Для чего в Java Generics применяется правило PECS (Producer Extends, Consumer Super)?",
    options: [
      "Чтобы можно было читать элементы из `List<? extends Number>` (Producer) и безопасно записывать элементы типа Integer в `List<? super Integer>` (Consumer)",
      "Чтобы ускорить Stream API в многопоточных задачах",
      "Для создания потокобезопасных коллекций",
      "Для автоматического приведения Object к String",
    ],
    correctIndex: 0,
    explanation:
      "Если коллекция только отдаёт элементы (Producer), используйте `? extends T` — можно читать как T, но нельзя добавлять элементы (кроме null). Если коллекция только принимает элементы (Consumer), используйте `? super T` — можно безопасно добавлять T и его подтипы.",
    theoryHint: "Вспомни wildcards `? extends` (чтение/производитель) и `? super` (запись/потребитель).",
    relatedLinks: [
      { title: "День 40: Generics и Wildcards (? extends / ? super)", url: "/?day=40", type: "lesson", day: 40 },
    ],
  },

  // =========================================================================
  // CATEGORY: SQL, БАЗЫ ДАННЫХ & GIT (12 questions)
  // =========================================================================
  {
    id: "q_sql_1",
    category: "sql",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Какой тип JOIN возвращает все строки из левой таблицы, даже если в правой таблице нет совпадений (заполняя их NULL)?",
    options: ["INNER JOIN", "LEFT OUTER JOIN (LEFT JOIN)", "CROSS JOIN", "SELF JOIN"],
    correctIndex: 1,
    explanation:
      "LEFT JOIN сохраняет абсолютно все записи из левой таблицы. Если для строки слева не нашлось пары справа по условию ON, колонки правой таблицы заполняются значениями NULL.",
    theoryHint: "Какой JOIN сохраняет 100% строк левой таблицы?",
    relatedLinks: [
      { title: "День 58: JOIN — объединение таблиц", url: "/?day=58", type: "lesson", day: 58 },
    ],
  },
  {
    id: "q_sql_2",
    category: "sql",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "В чём основная разница между WHERE и HAVING в SQL-запросе?",
    options: [
      "WHERE фильтрует строки ДО группировки GROUP BY, а HAVING — уже сгруппированные агрегаты ПОСЛЕ GROUP BY",
      "HAVING работает только с числами, а WHERE со строками",
      "WHERE можно писать только после ORDER BY",
      "Разницы нет, HAVING — устаревшее слово",
    ],
    correctIndex: 0,
    explanation:
      "WHERE отсеивает исходные строки таблицы до агрегации (и в нём нельзя использовать SUM, COUNT, AVG). HAVING применяется уже после GROUP BY для фильтрации готовых групп (например, HAVING COUNT(*) > 5).",
    theoryHint: "Какой оператор позволяет фильтровать результат агрегатных функций (COUNT, SUM) после GROUP BY?",
    relatedLinks: [
      { title: "День 57: WHERE, GROUP BY и HAVING", url: "/?day=57", type: "lesson", day: 57 },
    ],
  },
  {
    id: "q_sql_3",
    category: "sql",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Какие SQL команды относятся к группе DDL (Data Definition Language)?",
    options: [
      "SELECT, INSERT, UPDATE, DELETE",
      "CREATE, ALTER, DROP, TRUNCATE",
      "COMMIT, ROLLBACK, SAVEPOINT",
      "GRANT, REVOKE",
    ],
    correctIndex: 1,
    explanation:
      "DDL отвечает за структуру самой схемы базы данных (таблицы, столбцы, индексы): CREATE, ALTER, DROP, TRUNCATE. А SELECT/INSERT/UPDATE/DELETE — это DML (манипуляция данными).",
    theoryHint: "DDL определяет структуру (таблицы), а DML работает со строками данных.",
    relatedLinks: [
      { title: "День 55: DDL (CREATE, ALTER, DROP TABLE)", url: "/?day=55", type: "lesson", day: 55 },
      { title: "День 56: DML (INSERT, UPDATE, DELETE, SELECT)", url: "/?day=56", type: "lesson", day: 56 },
    ],
  },
  {
    id: "q_sql_4",
    category: "sql",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "В чём главная причина использовать PreparedStatement вместо обычного Statement в JDBC?",
    options: [
      "Statement не поддерживает SELECT запросы",
      "PreparedStatement параметризует входные данные, полностью защищая приложение от SQL-инъекций (SQL Injection), а также кэширует план запроса",
      "PreparedStatement работает только с PostgreSQL",
      "Statement не возвращает ResultSet",
    ],
    correctIndex: 1,
    explanation:
      "При конкатенации строк в обычном Statement злоумышленник может передать в поле логина код вроде `' OR '1'='1` и взломать базу. PreparedStatement передаёт параметры с плейсхолдерами `?` отдельно от SQL-кода.",
    theoryHint: "Как защититься от атак SQL Injection при передаче пользовательского ввода в SQL?",
    relatedLinks: [
      { title: "День 63: JDBC PreparedStatement и защита от SQL Injection", url: "/?day=63", type: "lesson", day: 63 },
    ],
  },
  {
    id: "q_sql_5",
    category: "sql",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "В таблице users 5 строк, причём у 2 пользователей поле email равно NULL. Что вернут COUNT(*) и COUNT(email)?",
    codeSnippet: `SELECT COUNT(*), COUNT(email) FROM users;`,
    options: ["5 и 5", "5 и 3", "3 и 3", "Ошибка NULL"],
    correctIndex: 1,
    explanation:
      "COUNT(*) подсчитывает общее количество строк в таблице независимо от NULL значений (вернёт 5). COUNT(имя_колонки) подсчитывает только НЕ-NULL значения в указанном столбце (вернёт 3).",
    theoryHint: "Игнорирует ли `COUNT(column)` значения `NULL`?",
    relatedLinks: [
      { title: "День 57: Агрегатные функции COUNT, SUM, AVG", url: "/?day=57", type: "lesson", day: 57 },
    ],
  },
  {
    id: "q_sql_6",
    category: "sql",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Что означает буква A (Atomicity) в аббревиатуре транзакций ACID?",
    options: [
      "База данных автоматически создаёт резервные копии",
      "Атомарность: либо выполнятся ВСЕ операции внутри транзакции (Commit), либо НИ ОДНА (Rollback)",
      "Доступ к данным открыт для всех пользователей",
      "Все запросы выполняются асинхронно",
    ],
    correctIndex: 1,
    explanation:
      "ACID = Atomicity (Атомарность — всё или ничего), Consistency (Согласованность ограничений), Isolation (Изолированность параллельных транзакций), Durability (Долговечность сохранённых данных).",
    theoryHint: "При переводе денег со счёта на счёт нельзя списать средства без их зачисления на второй счёт.",
    relatedLinks: [
      { title: "День 61: Индексы и транзакции (ACID)", url: "/?day=61", type: "lesson", day: 61 },
    ],
  },
  {
    id: "q_sql_7",
    category: "sql",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Почему не стоит добавлять B-Tree индекс на КАЖДУЮ колонку таблицы?",
    options: [
      "PostgreSQL разрешает не более 2 индексов на таблицу",
      "Индексы ускоряют SELECT, но замедляют INSERT/UPDATE/DELETE (требуют перестройки дерева) и занимают дополнительное место на диске",
      "Индексы ломают внешние ключи (Foreign Key)",
      "Индексы нельзя использовать с типом VARCHAR",
    ],
    correctIndex: 1,
    explanation:
      "Каждый индекс — это отдельная структура данных (обычно B-Tree). При чтении (SELECT с WHERE/JOIN) поиск идёт за O(log N), но при каждой записи или обновлении базе приходится обновлять и все затронутые индексы.",
    theoryHint: "Ускоряя чтение (SELECT), чем мы расплачиваемся при записи (INSERT/UPDATE/DELETE)?",
    relatedLinks: [
      { title: "День 61: B-tree индексы и EXPLAIN ANALYZE", url: "/?day=61", type: "lesson", day: 61 },
    ],
  },
  {
    id: "q_sql_8",
    category: "sql",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "В чём принципиальная разница между `git merge` и `git rebase` при интеграции веток?",
    options: [
      "git merge удаляет старую ветку, а git rebase нет",
      "git merge сохраняет историю как есть и создаёт merge-коммит, а git rebase переписывает историю коммитов поверх целевой ветки в одну ровную линию",
      "git rebase нельзя отменить, а merge нельзя разрешать при конфликтах",
      "Они выполняют абсолютно одно и то же действие",
    ],
    correctIndex: 1,
    explanation:
      "merge объединяет ветки новым коммитом слияния, сохраняя хронологию ветвлений. rebase переносит твои коммиты на верхушку другой ветки с новыми хешами, делая историю линейной (но rebase нельзя делать на общих публичных ветках вроде main).",
    theoryHint: "Какая команда создаёт merge-коммит с двумя родителями, а какая выстраивает коммиты в линейную цепочку?",
    relatedLinks: [
      { title: "День 67: Git ветки, merge и rebase", url: "/?day=67", type: "lesson", day: 67 },
    ],
  },
  {
    id: "q_sql_9",
    category: "sql",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Зачем в проекте на PostgreSQL/Spring Boot используют инструменты миграций вроде Flyway или Liquibase вместо `ddl-auto=update`?",
    options: [
      "Чтобы компилировать Java код в байткод",
      "Для версионированного, предсказуемого и воспроизводимого изменения схемы БД в продакшене через SQL-скрипты (V1__init.sql)",
      "Чтобы не писать SQL-запросы вообще",
      "Для балансировки нагрузки между серверами",
    ],
    correctIndex: 1,
    explanation:
      "Автоматическая генерация от Hibernate (`ddl-auto=update`) небезопасна в продакшене (не умеет удалять колонки, переименовывать поля и заполнять данные). Flyway применяет пронумерованные SQL-скрипты строго по порядку и хранит историю в таблице flyway_schema_history.",
    theoryHint: "Как команда разработчиков синхронизирует изменения таблиц БД между локальными машинами, тестом и продакшеном?",
    relatedLinks: [
      { title: "День 65: Flyway — миграции схемы БД", url: "/?day=65", type: "lesson", day: 65 },
    ],
  },
  {
    id: "q_sql_10",
    category: "sql",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Какой уровень изоляции транзакций стоит по умолчанию в PostgreSQL, и от каких аномалий он защищает?",
    options: [
      "READ UNCOMMITTED — не защищает ни от чего",
      "READ COMMITTED — полностью защищает от Dirty Read (грязного чтения), но допускает Non-Repeatable Read и Phantom Read",
      "REPEATABLE READ — защищает от всех аномалий без исключения",
      "SERIALIZABLE — стоит по умолчанию везде",
    ],
    correctIndex: 1,
    explanation:
      "В PostgreSQL по умолчанию используется уровень READ COMMITTED: транзакция видит только уже зафиксированные (committed) данные других транзакций, поэтому Dirty Read невозможен (в отличие от MySQL InnoDB, где по умолчанию стоит REPEATABLE READ).",
    theoryHint: "Какой уровень изоляции гарантирует, что вы никогда не прочитаете незафиксированные (uncommitted) данные другой транзакции?",
    relatedLinks: [
      { title: "День 61: Уровни изоляции транзакций", url: "/?day=61", type: "lesson", day: 61 },
    ],
  },
  {
    id: "q_sql_11",
    category: "sql",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Что такое связь «многие-ко-многим» (M:N) в реляционных БД (например, Студенты и Курсы) и как она реализуется?",
    options: [
      "Добавлением массива ID внутрь таблицы студентов",
      "Через промежуточную (связующую) таблицу (junction table), содержащую два Foreign Key на обе основные таблицы",
      "Достаточно одного PRIMARY KEY в первой таблице",
      "С помощью триггера ON UPDATE CASCADE",
    ],
    correctIndex: 1,
    explanation:
      "В реляционной модели связь M:N всегда разбивается на две связи 1:N через промежуточную таблицу (например, student_courses с колонками student_id и course_id, образующими составной первичный ключ).",
    theoryHint: "В классическом SQL строка в ячейке хранит одно атомарное значение (1NF) — как тогда связать много студентов со многими курсами?",
    relatedLinks: [
      { title: "День 59: Ключи, ограничения и нормализация (1NF–3NF)", url: "/?day=59", type: "lesson", day: 59 },
      { title: "День 60: Проектирование схемы интернет-магазина", url: "/?day=60", type: "lesson", day: 60 },
    ],
  },
  {
    id: "q_sql_12",
    category: "sql",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Какой логический порядок выполнения инструкций в SQL-запросе (внутри движка БД), а не порядок их написания?",
    options: [
      "SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY",
      "FROM / JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT",
      "WHERE -> FROM -> SELECT -> GROUP BY -> ORDER BY",
      "FROM -> SELECT -> WHERE -> HAVING -> ORDER BY",
    ],
    correctIndex: 1,
    explanation:
      "БД сначала берёт таблицы (FROM/JOIN), затем фильтрует строки (WHERE), группирует (GROUP BY), фильтрует группы (HAVING), вычисляет колонки/алиасы (SELECT), удаляет дубли (DISTINCT), сортирует (ORDER BY) и отрезает нужное число строк (LIMIT). Именно поэтому алиас из SELECT нельзя использовать в WHERE!",
    theoryHint: "Вспомни, почему алиас (AS total) из SELECT можно использовать в ORDER BY, но нельзя в WHERE.",
    relatedLinks: [
      { title: "День 57: Логика фильтрации, группировки и сортировки", url: "/?day=57", type: "lesson", day: 57 },
    ],
  },

  // =========================================================================
  // CATEGORY: SPRING BOOT, REST API & DOCKER (12 questions)
  // =========================================================================
  {
    id: "q_spring_1",
    category: "spring",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Какой HTTP статус-код корректно возвращать при успешном создании нового ресурса через POST запрос (например, создание пользователя)?",
    options: ["200 OK", "201 Created", "204 No Content", "400 Bad Request"],
    correctIndex: 1,
    explanation:
      "201 Created сигнализирует клиенту, что запрос выполнен и на сервере создан новый ресурс (часто вместе с заголовком Location). 204 No Content обычно возвращают при DELETE без тела ответа.",
    theoryHint: "Коды 2xx означают успех. Какой именно код закреплён за созданием (Created) новой сущности?",
    relatedLinks: [
      { title: "День 69: HTTP методы и статус-коды REST API", url: "/?day=69", type: "lesson", day: 69 },
    ],
  },
  {
    id: "q_spring_2",
    category: "spring",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "В чём разница между аннотациями @Controller и @RestController в Spring MVC?",
    options: [
      "@Controller только для БД, @RestController для веб-сокетов",
      "@RestController = @Controller + @ResponseBody (ответ методов сразу сериализуется в JSON/XML, а не ищется HTML-шаблон)",
      "@RestController работает только с GET запросами",
      "Разницы нет",
    ],
    correctIndex: 1,
    explanation:
      "Обычный @Controller возвращает имя view-шаблона (Thymeleaf/JSP). @RestController добавляет @ResponseBody к каждому методу, чтобы объекты возвращались клиенту прямо в теле ответа в формате JSON.",
    theoryHint: "Какая аннотация объединяет @Controller и @ResponseBody?",
    relatedLinks: [
      { title: "День 72: Spring Web — создание REST контроллеров", url: "/?day=72", type: "lesson", day: 72 },
    ],
  },
  {
    id: "q_spring_3",
    category: "spring",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Какой способ внедрения зависимостей (Dependency Injection) официально рекомендуется командой Spring?",
    options: [
      "Внедрение в поле (@Autowired private UserRepo repo;)",
      "Внедрение через конструктор класса (Constructor Injection)",
      "Через статическое поле",
      "Через new UserRepository() внутри метода",
    ],
    correctIndex: 1,
    explanation:
      "Внедрение через конструктор позволяет делать поля `final` (иммутабельность), гарантирует, что бин не создастся в неполном состоянии, упрощает unit-тестирование без Spring-контекста и сразу выявляет циклические зависимости.",
    theoryHint: "Какой вид DI позволяет объявлять поля зависимостей как `private final` и легко писать JUnit-тесты без поднятия Spring?",
    relatedLinks: [
      { title: "День 70: Spring Core — IoC и Dependency Injection", url: "/?day=70", type: "lesson", day: 70 },
    ],
  },
  {
    id: "q_spring_4",
    category: "spring",
    difficulty: "Лёгкий",
    xp: 10,
    timeLimitSec: 30,
    question: "Зачем в REST контроллерах используют DTO (Data Transfer Object), вместо того чтобы напрямую возвращать Entity-классы из базы данных?",
    options: [
      "Spring Data JPA запрещает возвращать Entity",
      "Чтобы отделить внутреннюю схему БД от внешнего API, скрыть чувствительные поля (passwordHash), избежать бесконечной рекурсии в JSON и гибко валидировать вход",
      "DTO автоматически шифруют трафик вместо HTTPS",
      "Чтобы увеличить размер JSON-ответа",
    ],
    correctIndex: 1,
    explanation:
      "Возврат JPA @Entity напрямую в JSON опасен: вы можете случайно отдать пароль/токены, словить LazyInitializationException вне транзакции, получить StackOverflow при двунаправленных связях и сломать API при любом рефакторинге таблиц БД.",
    theoryHint: "Подумай про безопасность полей (passwordHash), ленивые коллекции Hibernate и разделение слоёв.",
    relatedLinks: [
      { title: "День 73: Паттерн DTO, валидация и @ControllerAdvice", url: "/?day=73", type: "lesson", day: 73 },
    ],
  },
  {
    id: "q_spring_5",
    category: "spring",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Какой Scope (область видимости) имеет Spring Bean по умолчанию?",
    options: ["prototype", "request", "singleton", "session"],
    correctIndex: 2,
    explanation:
      "По умолчанию все бины в Spring имеют scope `singleton` — Spring IoC-контейнер создаёт ровно один экземпляр бина на весь ApplicationContext и переиспользует его везде, поэтому бины должны быть stateless (без изменяемого пользовательского состояния в полях).",
    theoryHint: "Сколько экземпляров @Service по умолчанию создаётся в контейнере Spring?",
    relatedLinks: [
      { title: "День 70: Spring Container и Bean Scopes", url: "/?day=70", type: "lesson", day: 70 },
    ],
  },
  {
    id: "q_spring_6",
    category: "spring",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "В чём суть проблемы N+1 запросов в Hibernate / Spring Data JPA?",
    options: [
      "Ошибка при создании 101-й таблицы в базе",
      "Когда при выборке списка из N сущностей (1 SELECT) для каждой из них выполняется отдельный дополнительный SELECT для загрузки связанной коллекции (итого N+1 SQL-запросов)",
      "Переполнение пула соединений HikariCP при одном запросе",
      "Двойной вызов метода save() в репозитории",
    ],
    correctIndex: 1,
    explanation:
      "Например, мы загрузили 100 заказов (1 запрос), а затем в цикле обращаемся к order.getItems(). Hibernate делает по 1 отдельному SELECT на каждый заказ — итого 101 запрос вместо одного! Лечится через `JOIN FETCH`, `@EntityGraph` или DTO-проекции.",
    theoryHint: "1 запрос за родителями + N запросов за дочерними объектами. Как это исправить?",
    relatedLinks: [
      { title: "День 75: Hibernate связи и проблема N+1", url: "/?day=75", type: "lesson", day: 75 },
    ],
  },
  {
    id: "q_spring_7",
    category: "spring",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Какой тип загрузки (FetchType) установлен по умолчанию в JPA для связей @OneToMany и @ManyToOne?",
    options: [
      "@OneToMany: EAGER, @ManyToOne: LAZY",
      "@OneToMany: LAZY, @ManyToOne: EAGER",
      "Обе по умолчанию LAZY",
      "Обе по умолчанию EAGER",
    ],
    correctIndex: 1,
    explanation:
      "Все связи на коллекцию (`*-to-Many`: @OneToMany, @ManyToMany) по умолчанию LAZY. Все связи на одиночный объект (`*-to-One`: @ManyToOne, @OneToOne) по умолчанию EAGER (в продакшене рекомендуется явно ставить LAZY на @ManyToOne и @OneToOne).",
    theoryHint: "Правило JPA: связи, оканчивающиеся на `ToMany` ленивые, а на `ToOne` — жадные по умолчанию.",
    relatedLinks: [
      { title: "День 75: LAZY vs EAGER загрузка в Hibernate", url: "/?day=75", type: "lesson", day: 75 },
    ],
  },
  {
    id: "q_spring_8",
    category: "spring",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Какие HTTP методы в REST API считаются идемпотентными (повторный вызов даёт тот же результат состояния сервера)?",
    options: [
      "Только GET",
      "POST и PATCH",
      "GET, PUT и DELETE",
      "POST и GET",
    ],
    correctIndex: 2,
    explanation:
      "GET не меняет состояние. PUT полностью заменяет ресурс по URL — 10 одинаковых PUT оставят ресурс в том же состоянии. DELETE удаляет ресурс (повторный DELETE тоже оставляет ресурс удалённым). А вот два одинаковых POST создадут 2 разных заказа!",
    theoryHint: "Если повторить запрос 5 раз подряд, только какой метод создаст 5 разных дубликатов?",
    relatedLinks: [
      { title: "День 69: HTTP и архитектура REST API", url: "/?day=69", type: "lesson", day: 69 },
    ],
  },
  {
    id: "q_spring_9",
    category: "spring",
    difficulty: "Средний",
    xp: 15,
    timeLimitSec: 45,
    question: "Из каких 3 частей (разделённых точками) состоит стандартный JWT-токен?",
    options: [
      "Username.Password.Salt",
      "Header.Payload.Signature",
      "Protocol.Domain.Token",
      "Issuer.Expiry.Hash",
    ],
    correctIndex: 1,
    explanation:
      "JWT (JSON Web Token) состоит из: Header (алгоритм и тип токена), Payload (данные/claims пользователя в Base64Url — НЕ зашифрованы!) и Signature (криптографическая подпись, гарантирующая что токен не подделали).",
    theoryHint: "Первая часть — заголовок с алгоритмом, вторая — полезная нагрузка (claims), третья — подпись.",
    relatedLinks: [
      { title: "День 79: Spring Security и авторизация по JWT", url: "/?day=79", type: "lesson", day: 79 },
    ],
  },
  {
    id: "q_spring_10",
    category: "spring",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Почему аннотация @Transactional НЕ сработает, если вызвать метод B() с @Transactional из метода A() того же самого сервиса (this.B())?",
    options: [
      "В одном классе не может быть двух транзакционных методов",
      "Spring реализует @Transactional через Proxy-обёртку; при внутреннем вызове this.B() обращение идёт напрямую к целевому объекту, минуя Proxy",
      "@Transactional работает только в @RestController",
      "Метод B() должен быть static",
    ],
    correctIndex: 1,
    explanation:
      "Это знаменитый эффект self-invocation (самовызова). Spring AOP оборачивает сервис в прокси. Когда другой бин вызывает service.method(), вызов проходит через прокси и открывает транзакцию. Когда метод вызывает `this.innerMethod()` внутри себя, прокси обходится и транзакция не стартует.",
    theoryHint: "Как Spring AOP технически перехватывает вызов метода с аннотацией `@Transactional`?",
    relatedLinks: [
      { title: "День 77: @Transactional и транзакции в Spring", url: "/?day=77", type: "lesson", day: 77 },
    ],
  },
  {
    id: "q_spring_11",
    category: "spring",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "При каком исключении Spring @Transactional по умолчанию ОТКАТИТ (rollback) транзакцию, а при каком — закоммитит?",
    options: [
      "Откатывает при любых исключениях (и Checked, и Unchecked)",
      "По умолчанию откатывает только при Unchecked (RuntimeException и Error), а при Checked (IOException, SQLException и т.д.) — коммитит, если не указано rollbackFor",
      "Откатывает только при Checked исключениях",
      "Никогда не откатывает автоматически",
    ],
    correctIndex: 1,
    explanation:
      "Это частая ошибка на собеседовании: по умолчанию @Transactional откатывается ТОЛЬКО при RuntimeException и Error. Если выбросить проверяемое исключение (Checked Exception) без `@Transactional(rollbackFor = Exception.class)`, изменения в БД сохранятся!",
    theoryHint: "Как различается поведение rollback в `@Transactional` для `RuntimeException` и проверяемого `Exception`?",
    relatedLinks: [
      { title: "День 77: @Transactional Rollback rules", url: "/?day=77", type: "lesson", day: 77 },
    ],
  },
  {
    id: "q_spring_12",
    category: "spring",
    difficulty: "Сложный",
    xp: 25,
    timeLimitSec: 60,
    question: "Зачем в Dockerfile для Spring Boot приложения используют многоэтапную сборку (Multi-stage build)?",
    options: [
      "Чтобы запускать две базы данных в одном контейнере",
      "Чтобы собрать проект в первом образе с JDK и Maven (который весит ~600MB), а в финальный лёгкий образ (~150MB с JRE/Alpine) скопировать только готовый .jar без исходников и компилятора",
      "Чтобы ускорить выполнение SQL-запросов",
      "Docker требует минимум 2 инструкции FROM в любом файле",
    ],
    correctIndex: 1,
    explanation:
      "Multi-stage build резко уменьшает размер продакшен-образа и повышает безопасность: внутри итогового контейнера нет ни исходного кода, ни Maven, ни лишних инструментов сборки — только лёгкий JRE и скомпилированный app.jar.",
    theoryHint: "Нужны ли Maven, исходники `src/` и компилятор `javac` в финальном продакшен-контейнере после того, как `.jar` уже собран?",
    relatedLinks: [
      { title: "День 80: Docker и многоэтапный Dockerfile", url: "/?day=80", type: "lesson", day: 80 },
      { title: "День 81: Docker Compose", url: "/?day=81", type: "lesson", day: 81 },
    ],
  },
];
