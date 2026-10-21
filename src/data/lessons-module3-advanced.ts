import type { Lesson } from "./types";

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

export const module3AdvancedLessons: Lesson[] = [
  /* ------------------------------------------------------------------ */
  /*  DAY 29: Queue, Deque, PriorityQueue                               */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 29,
    moduleId: 3,
    title: "Queue, Deque и PriorityQueue: очереди и стеки",
    short: "FIFO, двусторонняя очередь Deque, приоритетная куча PriorityQueue",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["Queue и принцип FIFO", "Безопасные методы offer/poll/peek", "ArrayDeque vs Stack", "PriorityQueue (куча)"],
    videos: [
      { author: "Алишев", query: "Алишев Java Queue очередь", note: "Очереди в Java" },
      { author: "Заур Трегулов", query: "Заур Трегулов Queue Deque PriorityQueue", note: "Queue и Deque" },
    ],
    theory: [
      { type: "h", text: "Что такое очередь (Queue)?" },
      {
        type: "p",
        text: "Очередь работает по принципу **FIFO** (First In, First Out — «первым пришел, первым обслужен»). Кто первым встал в очередь в кассу супермаркета, тот первым оплатит покупку.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Труба и Кассовый чек",
        text: "**Queue** — это труба, открытая с двух концов: с одного конца шарики залетают (`offer()`), а с другого выкатываются (`poll()`). **Deque** — это труба, куда можно добавлять и забирать с обоих концов. **PriorityQueue** — это скорая помощь: пациенты с тяжелыми травмами (высокий приоритет) заходят к врачу первыми, независимо от времени прибытия.",
      },
      {
        type: "table",
        head: ["Действие", "Бросает исключение при неудаче", "Возвращает специальное значение (null / false)"],
        rows: [
          ["Вставить элемент в очередь", "`add(e)` (IllegalStateException)", "`offer(e)` (рекомендуется!)"],
          ["Забрать и удалить из начала", "`remove()` (NoSuchElementException)", "`poll()` (рекомендуется!)"],
          ["Посмотреть первый элемент", "`element()` (NoSuchElementException)", "`peek()` (рекомендуется!)"],
        ],
      },
      {
        type: "code",
        caption: "Работа со стандартной очередью на базе LinkedList или ArrayDeque",
        code: `Queue<String> queue = new ArrayDeque<>();
queue.offer("Алексей");
queue.offer("Мария");

System.out.println(queue.peek()); // Алексей (не удаляется)
System.out.println(queue.poll()); // Алексей (забрали из очереди)
System.out.println(queue.poll()); // Мария`,
      },
    ],
    tasks: [
      {
        id: "d29_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Электронная очередь в банке)",
        shortDesc: "Базовые операции offer и poll в интерфейсе Queue",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай очередь `Queue<String> queue = new ArrayDeque<>();`.\nПрочитай число $N$, а затем $N$ имен клиентов, встающих в очередь через `queue.offer(...)`.\nЗатем обслужи всех клиентов по очереди: пока очередь не пуста (`!queue.isEmpty()`), извлекай имя через `queue.poll()` и выводи `Обслужен клиент: <имя>`.",
        requirements: ["Интерфейс `Queue<String>`", "Методы `offer()` и `poll()`", "Обработка в цикле while"],
        exampleInput: "3\nАлишер\nНаргиза\nБобир",
        exampleOutput: "Обслужен клиент: Алишер\nОбслужен клиент: Наргиза\nОбслужен клиент: Бобир",
        sampleInput: "3\nАлишер\nНаргиза\nБобир",
        starterCode: `import java.util.ArrayDeque;
import java.util.Queue;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        Queue<String> queue = new ArrayDeque<>();
        // TODO: добавь через offer() и обслужи через poll()
    }
}
`,
        tests: [
          { label: "3 клиента", stdin: "3\nАлишер\nНаргиза\nБобир\n", expected: ["Обслужен клиент: Алишер", "Обслужен клиент: Наргиза", "Обслужен клиент: Бобир"] },
          { label: "2 клиента", stdin: "2\nАнна\nОлег\n", expected: ["Обслужен клиент: Анна", "Обслужен клиент: Олег"] },
        ],
        requiredCode: [
          { pattern: "Queue<String>", message: "Используй Queue<String>" },
          { pattern: "\\.offer\\(", message: "Добавляй через .offer()" },
          { pattern: "\\.poll\\(\\)", message: "Извлекай через .poll()" },
        ],
        hints: ["`while (!queue.isEmpty()) System.out.println(\"Обслужен клиент: \" + queue.poll());`"],
        solution: `import java.util.ArrayDeque;
import java.util.Queue;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        Queue<String> queue = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            queue.offer(scanner.nextLine());
        }

        while (!queue.isEmpty()) {
            System.out.println("Обслужен клиент: " + queue.poll());
        }
    }
}
`,
      },
      {
        id: "d29_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Приоритетная очередь задач)",
        shortDesc: "Сортировка по приоритету через PriorityQueue",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай класс `Task` с полями `String title`, `int priority` (чем меньше число, тем выше приоритет: 1 — срочно, 10 — не горит).\nСоздай `PriorityQueue<Task>` с компаратором по полю `priority` (`(a, b) -> Integer.compare(a.priority, b.priority)`).\nДобавь задачи в очередь и извлеки их все. Задачи должны выполниться строго в порядке возрастания приоритета!\nФормат вывода: `Задача [<priority>]: <title>`.",
        requirements: ["Класс `Task`", "Использование `PriorityQueue<Task>`", "Корректная сортировка по приоритету"],
        exampleInput: "3\nНаписать_код 2\nИсправить_баг_в_проде 1\nПопить_кофе 3",
        exampleOutput: "Задача [1]: Исправить_баг_в_проде\nЗадача [2]: Написать_код\nЗадача [3]: Попить_кофе",
        sampleInput: "3\nНаписать_код 2\nИсправить_баг_в_проде 1\nПопить_кофе 3",
        starterCode: `import java.util.PriorityQueue;
import java.util.Scanner;

class Task {
    String title;
    int priority;

    Task(String title, int priority) {
        this.title = title;
        this.priority = priority;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: PriorityQueue<Task> с компаратором
    }
}
`,
        tests: [
          { label: "3 задачи с разным приоритетом", stdin: "3\nНаписать_код 2\nИсправить_баг_в_проде 1\nПопить_кофе 3\n", expected: ["Задача [1]: Исправить_баг_в_проде", "Задача [2]: Написать_код", "Задача [3]: Попить_кофе"] },
          { label: "2 задачи", stdin: "2\nОбед 5\nДеплой 1\n", expected: ["Задача [1]: Деплой", "Задача [5]: Обед"] },
        ],
        requiredCode: [
          { pattern: "PriorityQueue<Task>", message: "Используй PriorityQueue<Task>" },
        ],
        hints: ["`PriorityQueue<Task> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.priority, b.priority));`"],
        solution: `import java.util.PriorityQueue;
import java.util.Scanner;

class Task {
    String title;
    int priority;

    Task(String title, int priority) {
        this.title = title;
        this.priority = priority;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        PriorityQueue<Task> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.priority, b.priority));

        for (int i = 0; i < n; i++) {
            String title = scanner.next();
            int prio = scanner.nextInt();
            pq.offer(new Task(title, prio));
        }

        while (!pq.isEmpty()) {
            Task t = pq.poll();
            System.out.println("Задача [" + t.priority + "]: " + t.title);
        }
    }
}
`,
      },
      {
        id: "d29_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Проверка палиндрома на Deque)",
        shortDesc: "Сравнение первого и последнего символа через pollFirst и pollLast",
        difficulty: "Средний",
        xp: 40,
        description:
          "Прочитай строку, удали пробелы и приведи к нижнему регистру.\nПомести каждый символ строки в двустороннюю очередь `Deque<Character> deque = new ArrayDeque<>();`.\nВ цикле извлекай и сравнивай `pollFirst()` и `pollLast()`. Если хоть раз символы не совпали — строка не палиндром!\nВыведи `Палиндром: да` или `Палиндром: нет`.",
        requirements: ["Использование `Deque<Character>`", "Методы `pollFirst()` и `pollLast()`", "Проверка на палиндром"],
        exampleInput: "радар",
        exampleOutput: "Палиндром: да",
        sampleInput: "радар",
        starterCode: `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine().trim().toLowerCase().replaceAll("\\s+", "");

        Deque<Character> deque = new ArrayDeque<>();
        // TODO: заполни deque и проверь через pollFirst / pollLast
    }
}
`,
        tests: [
          { label: "радар", stdin: "радар\n", expected: ["Палиндром: да"] },
          { label: "java", stdin: "java\n", expected: ["Палиндром: нет"] },
          { label: "а роза упала на лапу азора", stdin: "а роза упала на лапу азора\n", expected: ["Палиндром: да"] },
        ],
        requiredCode: [
          { pattern: "Deque<Character>", message: "Используй Deque<Character>" },
          { pattern: "pollFirst|pollLast", message: "Используй pollFirst() и pollLast()" },
        ],
        hints: ["`while (deque.size() > 1) { if (!deque.pollFirst().equals(deque.pollLast())) return false; }`"],
        solution: `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine().trim().toLowerCase().replaceAll("\\s+", "");

        Deque<Character> deque = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            deque.addLast(c);
        }

        boolean isPal = true;
        while (deque.size() > 1) {
            Character first = deque.pollFirst();
            Character last = deque.pollLast();
            if (!first.equals(last)) {
                isPal = false;
                break;
            }
        }

        System.out.println("Палиндром: " + (isPal ? "да" : "нет"));
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 30: Лямбды и функциональные интерфейсы                        */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 30,
    moduleId: 3,
    title: "Лямбда-выражения и функциональные интерфейсы: код как значение",
    short: "@FunctionalInterface, синтаксис лямбд, Predicate, Function, Consumer, Supplier",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["@FunctionalInterface", "Синтаксис (args) -> body", "Predicate<T>", "Function<T, R>", "Consumer<T> и Supplier<T>"],
    videos: [
      { author: "Алишев", query: "Алишев Java лямбда выражения", note: "Лямбды с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов лямбда выражения", note: "Predicate, Function, Consumer" },
    ],
    theory: [
      { type: "h", text: "Что такое лямбда-выражение?" },
      {
        type: "p",
        text: "До Java 8 для передачи куска логики в метод приходилось создавать громоздкие анонимные классы (`new Comparator() { ... }`). Лямбда-выражение — это компактный способ передать **функцию как аргумент** без создания лишних классов.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Курьер с запиской",
        text: "Анонимный класс — это нанять целого человека в костюме, который принесет одну записку. Лямбда — это отправить SMS с текстом `(x) -> x * 2`. Быстро, чисто, минимум бюрократии.",
      },
      {
        type: "table",
        head: ["Интерфейс", "Метод", "Сигнатура", "Смысл"],
        rows: [
          ["`Predicate<T>`", "`boolean test(T t)`", "`T -> boolean`", "Проверка условия (фильтр)"],
          ["`Function<T, R>`", "`R apply(T t)`", "`T -> R`", "Преобразование одного типа в другой"],
          ["`Consumer<T>`", "`void accept(T t)`", "`T -> void`", "Потребление (печать, сохранение)"],
          ["`Supplier<T>`", "`T get()`", "`() -> T`", "Поставка (генерация значения)"],
        ],
      },
      {
        type: "code",
        caption: "Примеры использования встроенных функциональных интерфейсов",
        code: `Predicate<Integer> isEven = x -> x % 2 == 0;
Function<String, Integer> stringLength = s -> s.length();
Consumer<String> printer = s -> System.out.println("Вывод: " + s);
Supplier<Double> randomValue = () -> Math.random();

System.out.println(isEven.test(4)); // true
System.out.println(stringLength.apply("Java")); // 4
printer.accept("Привет!");`,
      },
    ],
    tasks: [
      {
        id: "d30_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Фильтрация через Predicate)",
        shortDesc: "Метод фильтрации с аргументом Predicate<Integer>",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай метод `static void printFiltered(int[] numbers, java.util.function.Predicate<Integer> condition)`:\nВ цикле проверяй каждое число через `condition.test(n)`. Если условие выполнено — напечатай число.\nВ `main` прочитай 4 числа и используй метод с лямбдой `x -> x > 0` (только положительные числа).",
        requirements: ["Использование `Predicate<Integer>`", "Вызов `condition.test(n)`", "Лямбда `x -> x > 0`"],
        exampleInput: "-5 12 -3 8",
        exampleOutput: "12\n8",
        sampleInput: "-5 12 -3 8",
        starterCode: `import java.util.Scanner;
import java.util.function.Predicate;

public class Main {
    static void printFiltered(int[] numbers, Predicate<Integer> condition) {
        // TODO: пройди по массиву и выведи числа, прошедшие condition.test(n)
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int[] arr = new int[4];
        for (int i = 0; i < 4; i++) arr[i] = scanner.nextInt();

        // TODO: вызови printFiltered с лямбдой x -> x > 0
    }
}
`,
        tests: [
          { label: "-5 12 -3 8", stdin: "-5 12 -3 8\n", expected: ["12", "8"] },
          { label: "10 20 -1 0", stdin: "10 20 -1 0\n", expected: ["10", "20"] },
        ],
        requiredCode: [
          { pattern: "Predicate<Integer>", message: "Используй Predicate<Integer>" },
          { pattern: "condition\\.test", message: "Вызывай condition.test(...)" },
        ],
        hints: ["`printFiltered(arr, x -> x > 0);`"],
        solution: `import java.util.Scanner;
import java.util.function.Predicate;

public class Main {
    static void printFiltered(int[] numbers, Predicate<Integer> condition) {
        for (int n : numbers) {
            if (condition.test(n)) {
                System.out.println(n);
            }
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int[] arr = new int[4];
        for (int i = 0; i < 4; i++) {
            arr[i] = scanner.nextInt();
        }

        printFiltered(arr, x -> x > 0);
    }
}
`,
      },
      {
        id: "d30_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Трансформация через Function)",
        shortDesc: "Преобразование строк через Function<String, String>",
        difficulty: "Средний",
        xp: 35,
        description:
          "Создай метод `static void transformAndPrint(String[] words, java.util.function.Function<String, String> transformer)`:\nКаждое слово трансформируй через `transformer.apply(w)` и выведи в консоль.\nВ `main` прочитай строку слов через пробел. Передай в метод лямбду, которая переводит слово в верхний регистр и оборачивает в скобки: `w -> \"[\" + w.toUpperCase() + \"]\"`.",
        requirements: ["Использование `Function<String, String>`", "Вызов `transformer.apply(w)`"],
        exampleInput: "java spring boot",
        exampleOutput: "[JAVA]\n[SPRING]\n[BOOT]",
        sampleInput: "java spring boot",
        starterCode: `import java.util.Scanner;
import java.util.function.Function;

public class Main {
    static void transformAndPrint(String[] words, Function<String, String> transformer) {
        // TODO
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        String[] words = line.split("\\s+");

        // TODO: вызови transformAndPrint с лямбдой
    }
}
`,
        tests: [
          { label: "java spring boot", stdin: "java spring boot\n", expected: ["[JAVA]", "[SPRING]", "[BOOT]"] },
          { label: "clean code", stdin: "clean code\n", expected: ["[CLEAN]", "[CODE]"] },
        ],
        requiredCode: [
          { pattern: "Function<String,\\s*String>", message: "Используй Function<String, String>" },
          { pattern: "transformer\\.apply", message: "Используй transformer.apply(w)" },
        ],
        hints: ["`transformAndPrint(words, w -> \"[\" + w.toUpperCase() + \"]\");`"],
        solution: `import java.util.Scanner;
import java.util.function.Function;

public class Main {
    static void transformAndPrint(String[] words, Function<String, String> transformer) {
        for (String w : words) {
            System.out.println(transformer.apply(w));
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        String[] words = line.split("\\s+");

        transformAndPrint(words, w -> "[" + w.toUpperCase() + "]");
    }
}
`,
      },
      {
        id: "d30_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Свой функциональный интерфейс)",
        shortDesc: "Объявление @FunctionalInterface StringFilter",
        difficulty: "Средний",
        xp: 40,
        description:
          "Создай свой собственный функциональный интерфейс:\n```java\n@FunctionalInterface\ninterface StringProcessor {\n    String process(String a, String b);\n}\n```\nВ `main` создай экземпляр интерфейса через лямбду, которая объединяет две строки через дефис: `(a, b) -> a + \"-\" + b`.\nПрочитай две строки и выведи результат вызова `processor.process(s1, s2)`.",
        requirements: ["Аннотация `@FunctionalInterface`", "Свой интерфейс `StringProcessor`", "Лямбда `(a, b) -> a + \"-\" + b`"],
        exampleInput: "Java\nBackend",
        exampleOutput: "Java-Backend",
        sampleInput: "Java\nBackend",
        starterCode: `import java.util.Scanner;

// TODO: @FunctionalInterface
// interface StringProcessor { ... }

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s1 = scanner.nextLine();
        String s2 = scanner.nextLine();

        // TODO
    }
}
`,
        tests: [
          { label: "Java Backend", stdin: "Java\nBackend\n", expected: ["Java-Backend"] },
          { label: "Full Stack", stdin: "Full\nStack\n", expected: ["Full-Stack"] },
        ],
        requiredCode: [
          { pattern: "@FunctionalInterface", message: "Добавь аннотацию @FunctionalInterface" },
          { pattern: "interface\\s+StringProcessor", message: "Объяви interface StringProcessor" },
        ],
        hints: ["`StringProcessor sp = (a, b) -> a + \"-\" + b; System.out.println(sp.process(s1, s2));`"],
        solution: `import java.util.Scanner;

@FunctionalInterface
interface StringProcessor {
    String process(String a, String b);
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s1 = scanner.nextLine();
        String s2 = scanner.nextLine();

        StringProcessor sp = (a, b) -> a + "-" + b;
        System.out.println(sp.process(s1, s2));
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 32: Stream API: reduce, groupingBy, flatMap                   */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 32,
    moduleId: 3,
    title: "Stream API: свёртка reduce, группировка groupingBy и flatMap",
    short: "Сложные агрегации данных, группировка по ключу и сглаживание коллекций",
    difficulty: "Сложный",
    duration: "~2.5 часа",
    xp: 100,
    ready: true,
    topics: ["reduce (аккумулятор)", "Collectors.groupingBy", "flatMap", "Collectors.counting и summingInt"],
    videos: [
      { author: "Алишев", query: "Алишев Java Stream API reduce", note: "reduce и группировки" },
      { author: "Заур Трегулов", query: "Заур Трегулов stream groupingBy flatMap", note: "groupingBy и flatMap" },
    ],
    theory: [
      { type: "h", text: "Продвинутые операции Stream API" },
      {
        type: "p",
        text: "В реальных проектах данных много и они имеют вложенную структуру. Операции `reduce`, `groupingBy` и `flatMap` позволяют решать задачи уровня SQL-запросов (GROUP BY, JOIN, SUM) прямо в коде Java.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Коробки и плоский конвейер (flatMap)",
        text: "У вас есть 3 коробки с конфетами (`List<List<Candy>>`). Обычный `map` перемещает сами коробки. `flatMap` распаковывает каждую коробку и высыпает все конфеты на один общий плоский конвейер (`Stream<Candy>`).",
      },
      {
        type: "code",
        caption: "Примеры reduce, groupingBy и flatMap",
        code: `// 1. reduce: свертка в одно значение (произведение)
int product = list.stream().reduce(1, (acc, x) -> acc * x);

// 2. groupingBy: группировка по длине слова (как SQL GROUP BY)
Map<Integer, List<String>> byLength = words.stream()
    .collect(Collectors.groupingBy(String::length));

// 3. flatMap: сглаживание списка списков
List<List<String>> nested = List.of(List.of("a", "b"), List.of("c"));
List<String> flat = nested.stream().flatMap(List::stream).toList();`,
      },
    ],
    tasks: [
      {
        id: "d32_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Свёртка списка через reduce)",
        shortDesc: "Вычисление произведения чисел с помощью .reduce()",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Прочитай число $N$, а затем $N$ целых чисел в список `List<Integer>`.\nС помощью Stream API и метода `.reduce(1, (a, b) -> a * b)` найди произведение всех чисел.\nВыведи `Произведение: <результат>`.",
        requirements: ["Использование `.stream()`", "Метод `.reduce(1, (a, b) -> a * b)`"],
        exampleInput: "4\n2 3 4 5",
        exampleOutput: "Произведение: 120",
        sampleInput: "4\n2 3 4 5",
        starterCode: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(scanner.nextInt());

        // TODO: найди произведение через .stream().reduce(...)
    }
}
`,
        tests: [
          { label: "2 3 4 5", stdin: "4\n2 3 4 5\n", expected: ["Произведение: 120"] },
          { label: "10 20", stdin: "2\n10 20\n", expected: ["Произведение: 200"] },
        ],
        requiredCode: [
          { pattern: "\\.reduce\\s*\\(", message: "Используй метод .reduce(...)" },
          { pattern: "\\.stream\\(\\)", message: "Используй .stream()" },
        ],
        hints: ["`int prod = list.stream().reduce(1, (a, b) -> a * b);`"],
        solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            list.add(scanner.nextInt());
        }

        int prod = list.stream().reduce(1, (a, b) -> a * b);
        System.out.println("Произведение: " + prod);
    }
}
`,
      },
      {
        id: "d32_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Группировка слов по длине)",
        shortDesc: "Collectors.groupingBy для классификации строк",
        difficulty: "Средний",
        xp: 35,
        description:
          "Прочитай строку слов, разделенных пробелом. С помощью Stream API сгруппируй слова по их длине (`String::length` или `s -> s.length()`) в `Map<Integer, List<String>>` с помощью `Collectors.groupingBy(...)`.\nВыведи для каждой длины количество слов в группе (в порядке возрастания длины, используй `new TreeMap<>(map)`).\nФормат строки: `Длина <len>: <count> слов`.",
        requirements: ["Использование `Collectors.groupingBy`", "Подсчет размера списка для каждой длины"],
        exampleInput: "кот собака дом слон тигр",
        exampleOutput: "Длина 3: 2 слов\nДлина 4: 2 слов\nДлина 6: 1 слов",
        sampleInput: "кот собака дом слон тигр",
        starterCode: `import java.util.*;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        List<String> words = Arrays.asList(line.split("\\s+"));

        // TODO: сгруппируй через Collectors.groupingBy
    }
}
`,
        tests: [
          { label: "кот собака дом слон тигр", stdin: "кот собака дом слон тигр\n", expected: ["Длина 3: 2 слов", "Длина 4: 2 слов", "Длина 6: 1 слов"] },
          { label: "java go python rust", stdin: "java go python rust\n", expected: ["Длина 2: 1 слов", "Длина 4: 2 слов", "Длина 6: 1 слов"] },
        ],
        requiredCode: [
          { pattern: "Collectors\\.groupingBy", message: "Используй Collectors.groupingBy" },
        ],
        hints: ["`Map<Integer, List<String>> map = words.stream().collect(Collectors.groupingBy(String::length));`"],
        solution: `import java.util.*;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        List<String> words = Arrays.asList(line.split("\\s+"));

        Map<Integer, List<String>> map = words.stream()
            .collect(Collectors.groupingBy(String::length));

        new TreeMap<>(map).forEach((len, list) -> {
            System.out.println("Длина " + len + ": " + list.size() + " слов");
        });
    }
}
`,
      },
      {
        id: "d32_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Распаковка тегов через flatMap)",
        shortDesc: "Сглаживание вложенных тегов статей через flatMap и distinct",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Дано $N$ статей. Каждая статья содержит список тегов через запятую (например: `java,spring,backend`).\nПрочитай $N$ строк, разбей каждую строку на массив тегов (`line.split(\",\")`).\nС помощью `.flatMap(Arrays::stream)` сгладь все теги в один общий стрим, удали дубликаты методом `.distinct()` и отсортируй в алфавитном порядке (`.sorted()`).\nВыведи уникальные теги через запятую и пробел: `Уникальные теги: <tag1>, <tag2>...`.",
        requirements: ["Использование `.flatMap()`", "Методы `.distinct()` и `.sorted()`", "Сборка через `Collectors.joining(\", \")`"],
        exampleInput: "2\njava,spring,backend\nspring,docker,java",
        exampleOutput: "Уникальные теги: backend, docker, java, spring",
        sampleInput: "2\njava,spring,backend\nspring,docker,java",
        starterCode: `import java.util.*;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        List<List<String>> articles = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            articles.add(Arrays.asList(scanner.nextLine().split(",")));
        }

        // TODO: flatMap, distinct, sorted, joining
    }
}
`,
        tests: [
          { label: "2 статьи с пересечениями", stdin: "2\njava,spring,backend\nspring,docker,java\n", expected: ["Уникальные теги: backend, docker, java, spring"] },
          { label: "3 строки", stdin: "3\nsql,db\njava,sql\nkafka,db\n", expected: ["Уникальные теги: db, java, kafka, sql"] },
        ],
        requiredCode: [
          { pattern: "\\.flatMap\\(", message: "Используй метод .flatMap(...)" },
          { pattern: "\\.distinct\\(\\)", message: "Используй метод .distinct()" },
          { pattern: "\\.sorted\\(\\)", message: "Используй метод .sorted()" },
        ],
        hints: ["`articles.stream().flatMap(List::stream).distinct().sorted().collect(Collectors.joining(\", \"));`"],
        solution: `import java.util.*;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        List<List<String>> articles = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            articles.add(Arrays.asList(scanner.nextLine().split(",")));
        }

        String tags = articles.stream()
            .flatMap(List::stream)
            .distinct()
            .sorted()
            .collect(Collectors.joining(", "));

        System.out.println("Уникальные теги: " + tags);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 33: Optional и method references                              */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 33,
    moduleId: 3,
    title: "Optional и Method References: безопасный код без NullPointerException",
    short: "Борьба с null, orElse, orElseThrow, ссылки на методы ClassName::method",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["Класс Optional<T>", "orElse и orElseThrow", "Ссылки на методы (::)", "Избавление от NPE"],
    videos: [
      { author: "Алишев", query: "Алишев Java Optional", note: "Зачем нужен Optional" },
      { author: "Заур Трегулов", query: "Заур Трегулов method reference Optional", note: "Method References и Optional" },
    ],
    theory: [
      { type: "h", text: "Почему null называют «ошибкой на миллиард долларов»?" },
      {
        type: "p",
        text: "В 1965 году изобретатель `null` Тони Хоар назвал это своей фатальной ошибкой. `NullPointerException` (NPE) — самая частая причина падений продакшен-серверов в мире. В Java 8 появился класс-обертка `Optional<T>`, который явно сообщает разработчику: значение может отсутствовать!",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Коробка Шрёдингера",
        text: "**Optional** — это непрозрачная подарочная коробка. Прежде чем взять подарок, вы должны спросить: «Коробка полная или пустая?». Вы не можете случайно схватить воздух и сломать пальцы (`NPE`). Либо внутри лежит предмет (`Optional.of(\"iPhone\")`), либо коробка пуста (`Optional.empty()`).",
      },
      {
        type: "h",
        text: "Ссылки на методы (Method References ::)",
      },
      {
        type: "p",
        text: "Если лямбда-выражение просто вызывает существующий метод без дополнительной логики, её можно сократить оператором `::`:\n- `s -> System.out.println(s)` превращается в `System.out::println`\n- `s -> s.toUpperCase()` превращается в `String::toUpperCase`",
      },
      {
        type: "code",
        caption: "Пример чистой работы с Optional",
        code: `Optional<String> username = findUserById(42);

// Получить значение или дефолт:
String name = username.orElse("Гость");

// Выбросить ошибку, если нет:
String required = username.orElseThrow(() -> new RuntimeException("Пользователь не найден!"));`,
      },
    ],
    tasks: [
      {
        id: "d33_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Безопасный поиск с Optional.orElse)",
        shortDesc: "Метод возвращающий Optional<String>",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай метод `static Optional<String> findUser(int id)`:\n- Если `id == 1`, возвращает `Optional.of(\"Администратор\")`\n- Если `id == 2`, возвращает `Optional.of(\"Менеджер\")`\n- Иначе возвращает `Optional.empty()`.\nВ `main` прочитай $ID$, вызови метод и получи имя через `.orElse(\"Неизвестный пользователь\")`. Выведи `Пользователь: <имя>`.",
        requirements: ["Возвращаемый тип `Optional<String>`", "Использование `Optional.of` и `Optional.empty()`", "Метод `.orElse(...)`"],
        exampleInput: "1",
        exampleOutput: "Пользователь: Администратор",
        sampleInput: "5",
        starterCode: `import java.util.Optional;
import java.util.Scanner;

public class Main {
    static Optional<String> findUser(int id) {
        // TODO
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int id = scanner.nextInt();

        // TODO: orElse("Неизвестный пользователь")
    }
}
`,
        tests: [
          { label: "ID 1 (найден)", stdin: "1\n", expected: ["Пользователь: Администратор"] },
          { label: "ID 5 (пустой)", stdin: "5\n", expected: ["Пользователь: Неизвестный пользователь"] },
        ],
        requiredCode: [
          { pattern: "Optional<String>", message: "Используй Optional<String>" },
          { pattern: "\\.orElse\\(", message: "Используй .orElse(...)" },
        ],
        hints: ["`if (id == 1) return Optional.of(\"Администратор\"); return Optional.empty();`"],
        solution: `import java.util.Optional;
import java.util.Scanner;

public class Main {
    static Optional<String> findUser(int id) {
        if (id == 1) return Optional.of("Администратор");
        if (id == 2) return Optional.of("Менеджер");
        return Optional.empty();
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int id = scanner.nextInt();

        String user = findUser(id).orElse("Неизвестный пользователь");
        System.out.println("Пользователь: " + user);
    }
}
`,
      },
      {
        id: "d33_t2",
        type: "practice",
        title: "Задача 2: Основная практика (orElseThrow при отсутствии значения)",
        shortDesc: "Генерация исключения из пустого Optional",
        difficulty: "Средний",
        xp: 35,
        description:
          "Прочитай строку `text`. Если строка равна `null` или `\"none\"`, создай пустой `Optional.empty()`, иначе `Optional.of(text)`.\nС помощью цепочки методов `.map(String::toUpperCase)` и `.orElseThrow(() -> new IllegalArgumentException(\"Значение отсутствует\"))` получи результат в блоке `try-catch`.\nЕсли значение есть — напечатай `Значение: <result>`, если вылетело исключение — `Ошибка: <e.getMessage()>`.",
        requirements: ["Использование `Optional.map(String::toUpperCase)`", "Метод `.orElseThrow(...)`", "Перехват `IllegalArgumentException`"],
        exampleInput: "spring",
        exampleOutput: "Значение: SPRING",
        sampleInput: "none",
        starterCode: `import java.util.Optional;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine().trim();

        Optional<String> opt = s.equals("none") ? Optional.empty() : Optional.of(s);

        // TODO: map, orElseThrow, try-catch
    }
}
`,
        tests: [
          { label: "spring", stdin: "spring\n", expected: ["Значение: SPRING"] },
          { label: "none (ошибка)", stdin: "none\n", expected: ["Ошибка: Значение отсутствует"] },
        ],
        requiredCode: [
          { pattern: "\\.orElseThrow\\(", message: "Используй .orElseThrow(...)" },
          { pattern: "String::toUpperCase", message: "Используй Method Reference String::toUpperCase" },
        ],
        hints: ["`String res = opt.map(String::toUpperCase).orElseThrow(() -> new IllegalArgumentException(\"Значение отсутствует\"));`"],
        solution: `import java.util.Optional;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine().trim();

        Optional<String> opt = s.equals("none") ? Optional.empty() : Optional.of(s);

        try {
            String res = opt.map(String::toUpperCase)
                .orElseThrow(() -> new IllegalArgumentException("Значение отсутствует"));
            System.out.println("Значение: " + res);
        } catch (IllegalArgumentException e) {
            System.out.println("Ошибка: " + e.getMessage());
        }
    }
}
`,
      },
      {
        id: "d33_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Красивый конвейер с Method References)",
        shortDesc: "Замена всех лямбд на ссылки на методы ::",
        difficulty: "Средний",
        xp: 40,
        description:
          "Прочитай $N$ строк слов. С помощью Stream API:\n1. Приведи каждое слово к верхнему регистру с помощью `String::toUpperCase`\n2. Отсортируй в натуральном порядке с помощью `String::compareTo`\n3. Напечатай каждое слово в новой строке с помощью `System.out::println`.\nКод должен использовать ссылки на методы `::`!",
        requirements: ["Использование `String::toUpperCase`", "Использование `String::compareTo`", "Использование `System.out::println`"],
        exampleInput: "3\norange\napple\nbanana",
        exampleOutput: "APPLE\nBANANA\nORANGE",
        sampleInput: "3\norange\napple\nbanana",
        starterCode: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        List<String> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(scanner.nextLine());

        // TODO: stream, map, sorted, forEach с method references
    }
}
`,
        tests: [
          { label: "orange apple banana", stdin: "3\norange\napple\nbanana\n", expected: ["APPLE", "BANANA", "ORANGE"] },
          { label: "cat dog", stdin: "2\ndog\ncat\n", expected: ["CAT", "DOG"] },
        ],
        requiredCode: [
          { pattern: "String::toUpperCase", message: "Используй ссылку на метод String::toUpperCase" },
          { pattern: "System\\.out::println", message: "Используй System.out::println" },
        ],
        hints: ["`list.stream().map(String::toUpperCase).sorted(String::compareTo).forEach(System.out::println);`"],
        solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        List<String> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            list.add(scanner.nextLine());
        }

        list.stream()
            .map(String::toUpperCase)
            .sorted(String::compareTo)
            .forEach(System.out::println);
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 34: Java Time API                                             */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 34,
    moduleId: 3,
    title: "Java Time API: современная работа с датами и временем",
    short: "LocalDate, LocalDateTime, Period, Duration, DateTimeFormatter",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["LocalDate и LocalTime", "LocalDateTime", "Периоды и длительности", "DateTimeFormatter"],
    videos: [
      { author: "Алишев", query: "Java LocalDate LocalDateTime урок", note: "Time API в Java 8" },
      { author: "Заур Трегулов", query: "Заур Трегулов LocalDate Java", note: "Форматирование дат" },
    ],
    theory: [
      { type: "h", text: "Почему старый Date был ужасен?" },
      {
        type: "p",
        text: "До Java 8 разработчики страдали от `java.util.Date`: он был мутабельным (любой метод мог изменить дату задним числом), месяцы нумеровались с 0 (январь = 0), а форматирование через `SimpleDateFormat` было непотокобезопасным.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Неизменяемый снимок календаря",
        text: "Все классы `java.time` (`LocalDate`, `LocalDateTime`) являются **неизменяемыми (immutable)**. Если к сегодняшней дате добавить 5 дней (`today.plusDays(5)`), исходная дата не изменится — метод вернет совершенно новый объект. Это на 100% безопасно в многопоточности.",
      },
      {
        type: "table",
        head: ["Класс", "Что хранит", "Пример"],
        rows: [
          ["`LocalDate`", "Только дата (год, месяц, день)", "`2026-10-20`"],
          ["`LocalTime`", "Только время (часы, минуты, секунды)", "`14:30:00`"],
          ["`LocalDateTime`", "Дата + время", "`2026-10-20T14:30:00`"],
          ["`Period`", "Разница в днях, месяцах, годах", "`Period.between(d1, d2)`"],
          ["`ChronoUnit`", "Единицы измерения времени", "`ChronoUnit.DAYS.between(d1, d2)`"],
        ],
      },
      {
        type: "code",
        caption: "Форматирование даты",
        code: `LocalDate date = LocalDate.of(2026, 5, 9);
DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd.MM.yyyy");
System.out.println(date.format(dtf)); // "09.05.2026"`,
      },
    ],
    tasks: [
      {
        id: "d34_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Разница между датами в днях)",
        shortDesc: "Использование ChronoUnit.DAYS.between",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Прочитай две даты в формате `YYYY-MM-DD` (например, `2026-01-01` и `2026-01-10`). Распарси их через `LocalDate.parse(str)`.\nС помощью `java.time.temporal.ChronoUnit.DAYS.between(date1, date2)` вычисли количество дней между ними.\nВыведи `Разница: <days> дней`.",
        requirements: ["Использование `LocalDate.parse`", "Использование `ChronoUnit.DAYS.between`"],
        exampleInput: "2026-01-01\n2026-01-10",
        exampleOutput: "Разница: 9 дней",
        sampleInput: "2026-01-01\n2026-01-10",
        starterCode: `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s1 = scanner.nextLine().trim();
        String s2 = scanner.nextLine().trim();

        // TODO
    }
}
`,
        tests: [
          { label: "1 по 10 января", stdin: "2026-01-01\n2026-01-10\n", expected: ["Разница: 9 дней"] },
          { label: "Один месяц", stdin: "2026-02-01\n2026-03-01\n", expected: ["Разница: 28 дней"] },
        ],
        requiredCode: [
          { pattern: "LocalDate\\.parse", message: "Используй LocalDate.parse" },
          { pattern: "ChronoUnit\\.DAYS\\.between", message: "Используй ChronoUnit.DAYS.between" },
        ],
        hints: ["`long days = ChronoUnit.DAYS.between(d1, d2);`"],
        solution: `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s1 = scanner.nextLine().trim();
        String s2 = scanner.nextLine().trim();

        LocalDate d1 = LocalDate.parse(s1);
        LocalDate d2 = LocalDate.parse(s2);

        long days = ChronoUnit.DAYS.between(d1, d2);
        System.out.println("Разница: " + days + " дней");
    }
}
`,
      },
      {
        id: "d34_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Форматирование даты по шаблону)",
        shortDesc: "Парсинг и преобразование даты в формат dd.MM.yyyy",
        difficulty: "Средний",
        xp: 35,
        description:
          "Прочитай дату в стандартном формате ISO `YYYY-MM-DD` и целое число $X$ (количество дней, которые нужно прибавить).\nПрибавь $X$ дней через `.plusDays(x)`.\nС помощью `DateTimeFormatter.ofPattern(\"dd.MM.yyyy\")` отформатируй новую дату и напечатай результат: `Новая дата: <день.месяц.год>`.",
        requirements: ["Метод `.plusDays()`", "Форматтер `DateTimeFormatter.ofPattern(\"dd.MM.yyyy\")`"],
        exampleInput: "2026-12-25\n10",
        exampleOutput: "Новая дата: 04.01.2027",
        sampleInput: "2026-12-25\n10",
        starterCode: `import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String dateStr = scanner.nextLine().trim();
        int daysToAdd = scanner.nextInt();

        // TODO
    }
}
`,
        tests: [
          { label: "25 дек + 10 дней", stdin: "2026-12-25\n10\n", expected: ["Новая дата: 04.01.2027"] },
          { label: "1 мая + 8 дней", stdin: "2026-05-01\n8\n", expected: ["Новая дата: 09.05.2026"] },
        ],
        requiredCode: [
          { pattern: "\\.plusDays\\(", message: "Используй метод .plusDays(...)" },
          { pattern: "DateTimeFormatter\\.ofPattern", message: "Используй DateTimeFormatter.ofPattern" },
        ],
        hints: ["`DateTimeFormatter dtf = DateTimeFormatter.ofPattern(\"dd.MM.yyyy\"); System.out.println(\"Новая дата: \" + d.format(dtf));`"],
        solution: `import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String dateStr = scanner.nextLine().trim();
        int daysToAdd = scanner.nextInt();

        LocalDate date = LocalDate.parse(dateStr).plusDays(daysToAdd);
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd.MM.yyyy");

        System.out.println("Новая дата: " + date.format(dtf));
    }
}
`,
      },
      {
        id: "d34_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Калькулятор возраста и дней рождения)",
        shortDesc: "Расчет полных лет через Period.between",
        difficulty: "Средний",
        xp: 40,
        description:
          "Прочитай дату рождения человека `birthDate` и текущую дату `currentDate` в формате `YYYY-MM-DD`.\nС помощью `java.time.Period.between(birth, current)` рассчитай полных лет (`period.getYears()`) и месяцев (`period.getMonths()`).\nВыведи `Возраст: <years> лет, <months> мес.`.",
        requirements: ["Использование `Period.between`", "Методы `getYears()` и `getMonths()`"],
        exampleInput: "2000-05-15\n2026-10-20",
        exampleOutput: "Возраст: 26 лет, 5 мес.",
        sampleInput: "2000-05-15\n2026-10-20",
        starterCode: `import java.time.LocalDate;
import java.time.Period;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String birthStr = scanner.nextLine().trim();
        String currentStr = scanner.nextLine().trim();

        // TODO: Period.between
    }
}
`,
        tests: [
          { label: "2000-05-15 к 2026-10-20", stdin: "2000-05-15\n2026-10-20\n", expected: ["Возраст: 26 лет, 5 мес."] },
          { label: "1995-01-01 к 2026-04-01", stdin: "1995-01-01\n2026-04-01\n", expected: ["Возраст: 31 лет, 3 мес."] },
        ],
        requiredCode: [
          { pattern: "Period\\.between", message: "Используй Period.between" },
          { pattern: "getYears\\(\\)", message: "Используй getYears()" },
        ],
        hints: ["`Period p = Period.between(b, c); System.out.println(\"Возраст: \" + p.getYears() + \" лет, \" + p.getMonths() + \" мес.\");`"],
        solution: `import java.time.LocalDate;
import java.time.Period;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String birthStr = scanner.nextLine().trim();
        String currentStr = scanner.nextLine().trim();

        LocalDate birth = LocalDate.parse(birthStr);
        LocalDate current = LocalDate.parse(currentStr);

        Period p = Period.between(birth, current);
        System.out.println("Возраст: " + p.getYears() + " лет, " + p.getMonths() + " мес.");
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 35: Итоговый проект модуля 3: «Анализатор заказов»            */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 35,
    moduleId: 3,
    title: "Итоговый проект модуля 3: «Анализатор заказов интернет-магазина»",
    short: "Комплексный Stream API и сбор статистики по продажам",
    difficulty: "Сложный",
    duration: "~3 часа",
    xp: 100,
    ready: true,
    topics: ["Аналитика e-commerce", "Collectors.groupingBy и summingDouble", "Фильтрация и сортировка", "Полноценный отчет"],
    videos: [
      { author: "Алишев", query: "Алишев Java Stream практика", note: "Stream API на реальных задачах" },
      { author: "Заур Трегулов", query: "Заур Трегулов Stream API задачи", note: "Сложные стримы" },
    ],
    theory: [
      { type: "h", text: "Финальная битва с коллекциями и стримами" },
      {
        type: "p",
        text: "Поздравляем! Ты освоил всю мощь Java Collections Framework и декларативного стиля Stream API. В этом проекте мы построим аналитический движок интернет-магазина, способный обрабатывать поток заказов и формировать отчеты для бизнеса.",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Архитектура аналитического сервиса",
        text: "Каждый заказ `Order` имеет статус (`COMPLETED` или `CANCELLED`), категорию товара (`Электроника`, `Книги`, `Одежда`), имя клиента и сумму. Анализатор должен отфильтровать отмененные заказы, посчитать общую выручку и сгруппировать доходы по категориям.",
      },
      {
        type: "code",
        caption: "Структура модели Order",
        code: `class Order {
    String id;
    String customer;
    String category;
    double amount;
    String status; // "COMPLETED" / "CANCELLED"
}`,
      },
    ],
    tasks: [
      {
        id: "d35_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Сумма доставленных заказов)",
        shortDesc: "Фильтрация по статусу и подсчет суммы через mapToDouble",
        difficulty: "Лёгкий",
        xp: 25,
        description:
          "Создай класс `Order` с полями `String category`, `double amount`, `String status`.\nПрочитай $N$ заказов. С помощью Stream API:\n1. Оставь только заказы со статусом `COMPLETED` (`filter(o -> o.status.equals(\"COMPLETED\"))`)\n2. Посчитай общую выручку через `.mapToDouble(o -> o.amount).sum()`.\nВыведи `Выручка: <сумма>`.",
        requirements: ["Класс `Order`", "Фильтр `.filter(o -> o.status.equals(\"COMPLETED\"))`", "Сумма через `mapToDouble().sum()`"],
        exampleInput: "3\nЭлектроника 5000 COMPLETED\nКниги 1200 CANCELLED\nОдежда 3000 COMPLETED",
        exampleOutput: "Выручка: 8000.0",
        sampleInput: "3\nЭлектроника 5000 COMPLETED\nКниги 1200 CANCELLED\nОдежда 3000 COMPLETED",
        starterCode: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Order {
    String category;
    double amount;
    String status;

    Order(String category, double amount, String status) {
        this.category = category;
        this.amount = amount;
        this.status = status;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            orders.add(new Order(scanner.next(), scanner.nextDouble(), scanner.next()));
        }

        // TODO: stream, filter, mapToDouble, sum
    }
}
`,
        tests: [
          { label: "2 завершенных из 3", stdin: "3\nЭлектроника 5000 COMPLETED\nКниги 1200 CANCELLED\nОдежда 3000 COMPLETED\n", expected: ["Выручка: 8000.0"] },
          { label: "Все отменены", stdin: "2\nЕда 500 CANCELLED\nКофе 300 CANCELLED\n", expected: ["Выручка: 0.0"] },
        ],
        requiredCode: [
          { pattern: "mapToDouble", message: "Используй метод mapToDouble" },
          { pattern: "\\.sum\\(\\)", message: "Используй метод .sum()" },
        ],
        hints: ["`double revenue = orders.stream().filter(o -> o.status.equals(\"COMPLETED\")).mapToDouble(o -> o.amount).sum();`"],
        solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Order {
    String category;
    double amount;
    String status;

    Order(String category, double amount, String status) {
        this.category = category;
        this.amount = amount;
        this.status = status;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            orders.add(new Order(scanner.next(), scanner.nextDouble(), scanner.next()));
        }

        double revenue = orders.stream()
            .filter(o -> o.status.equals("COMPLETED"))
            .mapToDouble(o -> o.amount)
            .sum();

        System.out.println("Выручка: " + revenue);
    }
}
`,
      },
      {
        id: "d35_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Выручка по категориям groupingBy)",
        shortDesc: "Группировка с суммированием Collectors.summingDouble",
        difficulty: "Средний",
        xp: 35,
        description:
          "Используя список заказов `List<Order>` (только со статусом `COMPLETED`), сгруппируй их по категории с подсчетом суммы:\n`Collectors.groupingBy(o -> o.category, Collectors.summingDouble(o -> o.amount))`.\nВыведи в алфавитном порядке категорий (через `TreeMap`):\n`Категория <category>: <сумма>`.",
        requirements: ["Использование `Collectors.groupingBy`", "Использование `Collectors.summingDouble`", "Сортировка через TreeMap"],
        exampleInput: "4\nЭлектроника 5000 COMPLETED\nКниги 1200 COMPLETED\nЭлектроника 3000 COMPLETED\nОдежда 2000 CANCELLED",
        exampleOutput: "Категория Книги: 1200.0\nКатегория Электроника: 8000.0",
        sampleInput: "4\nЭлектроника 5000 COMPLETED\nКниги 1200 COMPLETED\nЭлектроника 3000 COMPLETED\nОдежда 2000 CANCELLED",
        starterCode: `import java.util.*;
import java.util.stream.Collectors;

class Order {
    String category;
    double amount;
    String status;

    Order(String category, double amount, String status) {
        this.category = category;
        this.amount = amount;
        this.status = status;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            orders.add(new Order(scanner.next(), scanner.nextDouble(), scanner.next()));
        }

        // TODO: groupingBy + summingDouble
    }
}
`,
        tests: [
          { label: "Электроника и Книги", stdin: "4\nЭлектроника 5000 COMPLETED\nКниги 1200 COMPLETED\nЭлектроника 3000 COMPLETED\nОдежда 2000 CANCELLED\n", expected: ["Категория Книги: 1200.0", "Категория Электроника: 8000.0"] },
          { label: "Один заказ", stdin: "1\nИгры 4500 COMPLETED\n", expected: ["Категория Игры: 4500.0"] },
        ],
        requiredCode: [
          { pattern: "Collectors\\.groupingBy", message: "Используй Collectors.groupingBy" },
          { pattern: "Collectors\\.summingDouble", message: "Используй Collectors.summingDouble" },
        ],
        hints: ["`Map<String, Double> map = orders.stream().filter(...).collect(Collectors.groupingBy(o -> o.category, Collectors.summingDouble(o -> o.amount)));`"],
        solution: `import java.util.*;
import java.util.stream.Collectors;

class Order {
    String category;
    double amount;
    String status;

    Order(String category, double amount, String status) {
        this.category = category;
        this.amount = amount;
        this.status = status;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            orders.add(new Order(scanner.next(), scanner.nextDouble(), scanner.next()));
        }

        Map<String, Double> map = orders.stream()
            .filter(o -> o.status.equals("COMPLETED"))
            .collect(Collectors.groupingBy(o -> o.category, Collectors.summingDouble(o -> o.amount)));

        new TreeMap<>(map).forEach((cat, sum) -> {
            System.out.println("Категория " + cat + ": " + sum);
        });
    }
}
`,
      },
      {
        id: "d35_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Топ-2 самых дорогих заказа)",
        shortDesc: "Сортировка по убыванию суммы и ограничение через .limit(2)",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Из завершенных заказов `COMPLETED` найди **топ-2 самых дорогих заказа**.\nИспользуй `.sorted((a, b) -> Double.compare(b.amount, a.amount))` и `.limit(2)`.\nВыведи их в формате: `Топ заказ: <category> на сумму <amount>`.",
        requirements: ["Сортировка по убыванию цены", "Ограничение `.limit(2)`", "Вывод топ-2 заказов"],
        exampleInput: "4\nЧехол 500 COMPLETED\nНоутбук 80000 COMPLETED\nКофеварка 15000 COMPLETED\nМышь 2000 CANCELLED",
        exampleOutput: "Топ заказ: Ноутбук на сумму 80000.0\nТоп заказ: Кофеварка на сумму 15000.0",
        sampleInput: "4\nЧехол 500 COMPLETED\nНоутбук 80000 COMPLETED\nКофеварка 15000 COMPLETED\nМышь 2000 CANCELLED",
        starterCode: `import java.util.*;

class Order {
    String category;
    double amount;
    String status;

    Order(String category, double amount, String status) {
        this.category = category;
        this.amount = amount;
        this.status = status;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            orders.add(new Order(scanner.next(), scanner.nextDouble(), scanner.next()));
        }

        // TODO: filter COMPLETED, sorted descending, limit(2)
    }
}
`,
        tests: [
          { label: "Ноутбук и Кофеварка", stdin: "4\nЧехол 500 COMPLETED\nНоутбук 80000 COMPLETED\nКофеварка 15000 COMPLETED\nМышь 2000 CANCELLED\n", expected: ["Топ заказ: Ноутбук на сумму 80000.0", "Топ заказ: Кофеварка на сумму 15000.0"] },
          { label: "2 заказа", stdin: "2\nКнига 1000 COMPLETED\nКурс 5000 COMPLETED\n", expected: ["Топ заказ: Курс на сумму 5000.0", "Топ заказ: Книга на сумму 1000.0"] },
        ],
        requiredCode: [
          { pattern: "\\.limit\\(2\\)", message: "Используй метод .limit(2)" },
          { pattern: "\\.sorted\\(", message: "Используй метод .sorted(...)" },
        ],
        hints: ["`orders.stream().filter(o -> o.status.equals(\"COMPLETED\")).sorted((a, b) -> Double.compare(b.amount, a.amount)).limit(2).forEach(...);`"],
        solution: `import java.util.*;

class Order {
    String category;
    double amount;
    String status;

    Order(String category, double amount, String status) {
        this.category = category;
        this.amount = amount;
        this.status = status;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            orders.add(new Order(scanner.next(), scanner.nextDouble(), scanner.next()));
        }

        orders.stream()
            .filter(o -> o.status.equals("COMPLETED"))
            .sorted((a, b) -> Double.compare(b.amount, a.amount))
            .limit(2)
            .forEach(o -> System.out.println("Топ заказ: " + o.category + " на сумму " + o.amount));
    }
}
`,
      },
    ],
  }),
];
