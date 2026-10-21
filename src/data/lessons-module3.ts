import type { Lesson, LessonTask } from "./types";
import {
  day22Lesson,
  day24Lesson,
  day25Lesson,
  day27Lesson,
  day28Lesson,
} from "./lessons-module3-core-extra";
import { module3AdvancedLessons } from "./lessons-module3-advanced";

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

const coreModule3Lessons: Lesson[] = [
  /* ------------------------------------------------------------------ */
  /*  DAY 23: ArrayList изнутри                                         */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 23,
    moduleId: 3,
    title: "ArrayList изнутри: динамический массив",
    short: "Устройство массива с авторасширением, методы List",
    difficulty: "Средний",
    duration: "~2 часа",
    xp: 100,
    ready: true,
    topics: ["ArrayList", "capacity и авторасширение", "Методы add, get, remove, size", "Сложность O(1) и O(n)"],
    videos: [
      { author: "Алишев", query: "Алишев Java ArrayList", note: "Динамический массив" },
      { author: "Заур Трегулов", query: "Заур Трегулов ArrayList методы Java", note: "ArrayList изнутри" },
    ],
    theory: [
      { type: "h", text: "Почему обычного массива int[] недостаточно?" },
      {
        type: "p",
        text: "Обычный массив имеет **фиксированную длину**, заданную при создании. Если мы не знаем заранее, сколько пользователей придет на сайт, обычный массив придется вручную пересоздавать и копировать элементы. `ArrayList` делает это автоматически!",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Папка с файлами",
        text: "Обычный массив — это коробка с ровно 5 отделениями. `ArrayList` — это органайзер: когда место заканчивается, он мгновенно берет органайзер в 1.5 раза больше (`newCapacity = oldCapacity + (oldCapacity >> 1)`), перекладывает всё туда и продолжает работать.",
      },
      {
        type: "code",
        code: `import java.util.ArrayList;
import java.util.List;

List<String> cities = new ArrayList<>();
cities.add("Ташкент");
cities.add("Самарканд");
cities.add("Бухара");

System.out.println(cities.size());    // 3
System.out.println(cities.get(0));     // Ташкент
cities.remove(1);                     // удаление Самарканда`,
      },
    ],
    tasks: [
      {
        id: "d23_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Список имен в ArrayList)",
        shortDesc: "Базовые операции со списком строк",
        difficulty: "Лёгкий",
        xp: 25,
        description: "Считай число n, затем n имен. Сохрани их в `ArrayList<String>`. Выведи размер списка и все имена через запятую.",
        requirements: ["Используй `ArrayList<String>`", "Выведи `Всего: <размер>`", "Выведи `Список: [элементы]`"],
        exampleInput: "3\nАнна\nБорис\nВиктор",
        exampleOutput: "Всего: 3\nСписок: [Анна, Борис, Виктор]",
        sampleInput: "3\nАнна\nБорис\nВиктор",
        starterCode: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        List<String> list = new ArrayList<>();
        // TODO: добавь n имен в list
        // TODO: выведи размер и список
    }
}
`,
        tests: [{ label: "3 имени", stdin: "3\nАнна\nБорис\nВиктор\n", expected: ["Всего: 3", "Список: [Анна, Борис, Виктор]"] }],
        requiredCode: [{ pattern: "new\\s+ArrayList", message: "Используй new ArrayList<>()" }],
        hints: ["`list.add(scanner.nextLine());`", "`System.out.println(\"Список: \" + list);`"],
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

        System.out.println("Всего: " + list.size());
        System.out.println("Список: " + list);
    }
}
`,
      },
      {
        id: "d23_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Фильтрация четных чисел)",
        shortDesc: "Удаление и фильтрация в ArrayList<Integer>",
        difficulty: "Средний",
        xp: 35,
        description:
          "Считай число n, затем n целых чисел. Сохрани их в `ArrayList<Integer>`. Сформируй новый список, содержащий только четные числа, умноженные на 2. Выведи `Чётные x2: [числа]`.",
        requirements: ["Используй `ArrayList<Integer>`", "Фильтрация `x % 2 == 0` и умножение на 2"],
        exampleInput: "5\n1 2 3 4 5",
        exampleOutput: "Чётные x2: [4, 8]",
        sampleInput: "5\n1 2 3 4 5",
        starterCode: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        // TODO
    }
}
`,
        tests: [{ label: "1 2 3 4 5", stdin: "5\n1 2 3 4 5\n", expected: ["Четные x2: [4, 8]"] }],
        requiredCode: [{ pattern: "ArrayList", message: "Используй ArrayList" }],
        hints: ["Создай `List<Integer> evens = new ArrayList<>();` и добавляй `x * 2`."],
        solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int val = scanner.nextInt();
            if (val % 2 == 0) {
                result.add(val * 2);
            }
        }
        System.out.println("Чётные x2: " + result);
    }
}
`,
      },
      {
        id: "d23_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Список задач TodoList)",
        shortDesc: "Методы поиска, добавления и отметки выполненных",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Напиши программу учета задач. Программа считывает число n команд. Доступные команды:\n- `ADD <текст>`: добавляет задачу в список\n- `COUNT`: выводит `Задач: <количество>`\n- `PRINT`: выводит список задач в формате `1. <текст>\\n2. <текст>`\nРеализуй хранение в `ArrayList<String>`.",
        requirements: ["Обработка команд ADD, COUNT, PRINT"],
        exampleInput: "4\nADD Выучить Java\nADD Сделать ДЗ\nCOUNT\nPRINT",
        exampleOutput: "Задач: 2\n1. Выучить Java\n2. Сделать ДЗ",
        sampleInput: "4\nADD Выучить Java\nADD Сделать ДЗ\nCOUNT\nPRINT",
        starterCode: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        // TODO
    }
}
`,
        tests: [
          {
            label: "ADD, COUNT, PRINT",
            stdin: "4\nADD Выучить Java\nADD Сделать ДЗ\nCOUNT\nPRINT\n",
            expected: ["Задач: 2", "1. Выучить Java", "2. Сделать ДЗ"],
          },
        ],
        requiredCode: [{ pattern: "ArrayList", message: "Используй ArrayList" }],
        hints: ["`if (cmd.startsWith(\"ADD \")) list.add(cmd.substring(4));`"],
        solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        List<String> todos = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            String line = scanner.nextLine();
            if (line.startsWith("ADD ")) {
                todos.add(line.substring(4));
            } else if (line.equals("COUNT")) {
                System.out.println("Задач: " + todos.size());
            } else if (line.equals("PRINT")) {
                for (int j = 0; j < todos.size(); j++) {
                    System.out.println((j + 1) + ". " + todos.get(j));
                }
            }
        }
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 26: HashMap: внутреннее устройство                             */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 26,
    moduleId: 3,
    title: "HashMap: устройство внутри (бакеты, хэши, коллизии)",
    short: "Ассоциативный массив, O(1) доступ по ключу",
    difficulty: "Сложный",
    duration: "~2.5 часа",
    xp: 100,
    ready: true,
    topics: ["Key-Value структура", "hashCode() и equals()", "Бакеты и коллизии", "getOrDefault и put"],
    videos: [
      { author: "Алишев", query: "Алишев Java HashMap", note: "HashMap с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов HashMap устройство внутри", note: "Бакеты и коллизии" },
    ],
    theory: [
      { type: "h", text: "Как устроен HashMap под капотом?" },
      {
        type: "p",
        text: "`HashMap` хранит пары **Ключ → Значение**. Внутри него находится массив бакетов `Node<K,V>[] table`. При добавлении пары вычисляется `hashCode()` ключа, по которому определяется номер ячейки (бакета). Благодаря этому поиск по ключу выполняется практически мгновенно: **O(1)**!",
      },
      {
        type: "callout",
        variant: "analogy",
        title: "Аналогия: Камера хранения",
        text: "Ты отдаешь сумку и получаешь номерок (хэш ключа). Чтобы забрать сумку, сотруднику не нужно перебирать все 10 000 сумок — он сразу идет к ячейке с твоим номером.",
      },
      {
        type: "code",
        code: `import java.util.HashMap;
import java.util.Map;

Map<String, Integer> stock = new HashMap<>();
stock.put("MacBook", 10);
stock.put("iPhone", 25);

int count = stock.getOrDefault("iPad", 0); // 0
System.out.println(stock.containsKey("MacBook")); // true`,
      },
    ],
    tasks: [
      {
        id: "d26_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Телефонная книга)",
        shortDesc: "Добавление и поиск по ключу в Map",
        difficulty: "Лёгкий",
        xp: 25,
        description: "Считай число n записей (имя и номер телефона). Сохрани их в `HashMap<String, String>`. Затем считай имя для поиска и выведи `Номер: <телефон>` или `Не найден`.",
        requirements: ["Используй `HashMap<String, String>`"],
        exampleInput: "2\nАлиса 12345\nБоб 67890\nАлиса",
        exampleOutput: "Номер: 12345",
        sampleInput: "2\nАлиса 12345\nБоб 67890\nАлиса",
        starterCode: `import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        // TODO
    }
}
`,
        tests: [
          { label: "Алиса 12345", stdin: "2\nАлиса 12345\nБоб 67890\nАлиса\n", expected: ["Номер: 12345"] },
          { label: "Не найден", stdin: "1\nОлег 555\nИван\n", expected: ["Не найден"] },
        ],
        requiredCode: [{ pattern: "HashMap", message: "Используй HashMap" }],
        hints: ["`if (map.containsKey(target)) System.out.println(\"Номер: \" + map.get(target));`"],
        solution: `import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        Map<String, String> book = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String name = scanner.next();
            String phone = scanner.next();
            book.put(name, phone);
        }

        String search = scanner.next();
        if (book.containsKey(search)) {
            System.out.println("Номер: " + book.get(search));
        } else {
            System.out.println("Не найден");
        }
    }
}
`,
      },
      {
        id: "d26_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Частотный словарь слов)",
        shortDesc: "Подсчет частоты вхождений элементов через HashMap",
        difficulty: "Средний",
        xp: 35,
        description:
          "Программа считывает число n, затем n слов. Посчитай, сколько раз каждое слово встречается в наборе, используя `map.getOrDefault(word, 0) + 1`. Выведи слова и их частоту.",
        requirements: ["Используй `HashMap<String, Integer>`", "Используй `getOrDefault`"],
        exampleInput: "5\njava python java go java",
        exampleOutput: "java: 3\npython: 1\ngo: 1",
        sampleInput: "5\njava python java go java",
        starterCode: `import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: используй Map для подсчета частоты слов
    }
}
`,
        tests: [{ label: "java python java go java", stdin: "5\njava python java go java\n", expected: ["java: 3", "python: 1", "go: 1"] }],
        requiredCode: [{ pattern: "getOrDefault", message: "Используй map.getOrDefault" }],
        hints: ["`map.put(word, map.getOrDefault(word, 0) + 1);`"],
        solution: `import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        Map<String, Integer> freq = new LinkedHashMap<>();
        for (int i = 0; i < n; i++) {
            String w = scanner.next();
            freq.put(w, freq.getOrDefault(w, 0) + 1);
        }

        for (Map.Entry<String, Integer> e : freq.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
    }
}
`,
      },
      {
        id: "d26_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Инвентарь склада с обновлением)",
        shortDesc: "Обновление значений и поиск максимального остатка",
        difficulty: "Сложный",
        xp: 40,
        description:
          "Программа ведет учет товаров на складе (`Map<String, Integer>`). На вход подается n операций:\n- `ADD <товар> <кол-во>`: увеличивает остаток товара\n- `GET <товар>`: выводит `<товар>: <кол-во>` (или 0, если нет)\nВ конце программа выводит товар с максимальным остатком: `Максимум: <товар> (<кол-во>)`.",
        requirements: ["Хранение в `Map`", "Определение максимального остатка"],
        exampleInput: "3\nADD Яблоки 50\nADD Бананы 80\nADD Яблоки 40\nGET Яблоки",
        exampleOutput: "Яблоки: 90\nМаксимум: Бананы (80) или Яблоки (90)",
        sampleInput: "4\nADD Яблоки 50\nADD Бананы 80\nADD Яблоки 40\nGET Яблоки",
        starterCode: `import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO
    }
}
`,
        tests: [
          {
            label: "Склад яблок и бананов",
            stdin: "4\nADD Яблоки 50\nADD Бананы 80\nADD Яблоки 40\nGET Яблоки\n",
            expected: ["Яблоки: 90", "Максимум: Яблоки (90)"],
          },
        ],
        requiredCode: [{ pattern: "Map", message: "Используй Map" }],
        hints: ["`stock.put(item, stock.getOrDefault(item, 0) + qty);`"],
        solution: `import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        Map<String, Integer> stock = new LinkedHashMap<>();

        for (int i = 0; i < n; i++) {
            String op = scanner.next();
            if (op.equals("ADD")) {
                String item = scanner.next();
                int qty = scanner.nextInt();
                stock.put(item, stock.getOrDefault(item, 0) + qty);
            } else if (op.equals("GET")) {
                String item = scanner.next();
                System.out.println(item + ": " + stock.getOrDefault(item, 0));
            }
        }

        String maxItem = "";
        int maxQty = -1;
        for (Map.Entry<String, Integer> e : stock.entrySet()) {
            if (e.getValue() > maxQty) {
                maxQty = e.getValue();
                maxItem = e.getKey();
            }
        }
        System.out.println("Максимум: " + maxItem + " (" + maxQty + ")");
    }
}
`,
      },
    ],
  }),

  /* ------------------------------------------------------------------ */
  /*  DAY 31: Stream API: filter, map, collect                          */
  /* ------------------------------------------------------------------ */
  withDefaults({
    day: 31,
    moduleId: 3,
    title: "Stream API: filter, map, collect",
    short: "Декларативная функциональная обработка коллекций",
    difficulty: "Средний",
    duration: "~2.5 часа",
    xp: 100,
    ready: true,
    topics: ["stream() конвейеры", "filter (фильтрация)", "map (преобразование)", "Collectors.toList()", "Ленивые вычисления"],
    videos: [
      { author: "Алишев", query: "Алишев Java Stream API", note: "Stream API с нуля" },
      { author: "Заур Трегулов", query: "Заур Трегулов Stream API filter map", note: "Конвейер операций" },
    ],
    theory: [
      { type: "h", text: "Что такое Stream API?" },
      {
        type: "p",
        text: "Вместо громоздких циклов `for` со счетчиками и ветвлениями `if`, Stream API позволяет обрабатывать данные **декларативно** — описывая **что** сделать с данными, а не **как** шагать по ячейкам.",
      },
      {
        type: "code",
        code: `List<String> names = List.of("алексей", "иван", "анна", "борис");

List<String> result = names.stream()
    .filter(name -> name.startsWith("а")) // фильтр
    .map(String::toUpperCase)             // трансформация
    .sorted()                             // сортировка
    .toList();                            // сборка в список

System.out.println(result); // [АЛЕКСЕЙ, АННА]`,
      },
    ],
    tasks: [
      {
        id: "d31_t1",
        type: "warmup",
        title: "Задача 1: Разминка (Фильтрация положительных чисел через Stream)",
        shortDesc: "stream().filter(...).toList()",
        difficulty: "Лёгкий",
        xp: 25,
        description: "Считай число n, затем n целых чисел. Используя Stream API (`stream().filter(x -> x > 0)`), отфильтруй только положительные числа и выведи `Положительные: [числа]`.",
        requirements: ["Используй Stream API (`.stream()`)", "Используй `.filter(...)`"],
        exampleInput: "5\n-3 10 -1 7 0",
        exampleOutput: "Положительные: [10, 7]",
        sampleInput: "5\n-3 10 -1 7 0",
        starterCode: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(scanner.nextInt());

        // TODO: list.stream().filter(...).collect(...)
    }
}
`,
        tests: [{ label: "-3 10 -1 7 0", stdin: "5\n-3 10 -1 7 0\n", expected: ["Положительные: [10, 7]"] }],
        requiredCode: [
          { pattern: "\\.stream\\s*\\(", message: "Используй метод .stream()" },
          { pattern: "\\.filter\\s*\\(", message: "Используй операцию .filter()" },
        ],
        hints: ["`List<Integer> pos = list.stream().filter(x -> x > 0).collect(Collectors.toList());`"],
        solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(scanner.nextInt());

        List<Integer> pos = list.stream()
                .filter(x -> x > 0)
                .collect(Collectors.toList());

        System.out.println("Положительные: " + pos);
    }
}
`,
      },
      {
        id: "d31_t2",
        type: "practice",
        title: "Задача 2: Основная практика (Квадраты четных чисел)",
        shortDesc: "Комбинация filter и map",
        difficulty: "Средний",
        xp: 35,
        description:
          "Программа считывает n чисел. С помощью Stream API оставь только четные числа, возведи каждое в квадрат и отсортируй по возрастанию: `.filter(x -> x % 2 == 0).map(x -> x * x).sorted()`.",
        requirements: ["Используй `.filter()`, `.map()`, `.sorted()`"],
        exampleInput: "5\n5 2 4 1 6",
        exampleOutput: "Результат: [4, 16, 36]",
        sampleInput: "5\n5 2 4 1 6",
        starterCode: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> numbers = new ArrayList<>();
        for (int i = 0; i < n; i++) numbers.add(scanner.nextInt());

        // TODO
    }
}
`,
        tests: [{ label: "5 2 4 1 6", stdin: "5\n5 2 4 1 6\n", expected: ["Результат: [4, 16, 36]"] }],
        requiredCode: [
          { pattern: "\\.filter\\s*\\(", message: "Используй filter" },
          { pattern: "\\.map\\s*\\(", message: "Используй map" },
        ],
        hints: ["`numbers.stream().filter(x -> x % 2 == 0).map(x -> x * x).sorted().collect(Collectors.toList())`"],
        solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> numbers = new ArrayList<>();
        for (int i = 0; i < n; i++) numbers.add(scanner.nextInt());

        List<Integer> result = numbers.stream()
                .filter(x -> x % 2 == 0)
                .map(x -> x * x)
                .sorted()
                .collect(Collectors.toList());

        System.out.println("Результат: " + result);
    }
}
`,
      },
      {
        id: "d31_t3",
        type: "homework",
        title: "Задача 3: Домашнее задание (Форматирование имен и фильтрация)",
        shortDesc: "Комплексный Stream-конвейер для строк",
        difficulty: "Сложный",
        xp: 40,
        description:
          "На вход подается число n, затем n строк с именами в разном регистре. С помощью Stream API:\n1) Отфильтруй имена длиннее 3 символов (`length() > 3`)\n2) Приведи их к верхнему регистру (`toUpperCase()`)\n3) Оставь только уникальные (`distinct()`)\n4) Отсортируй по алфавиту (`sorted()`)\nВыведи `Топ: [имена]`.",
        requirements: ["Используй `.filter()`, `.map()`, `.distinct()`, `.sorted()`"],
        exampleInput: "5\nян\nалекс\nмария\nалекс\nиван",
        exampleOutput: "Топ: [АЛЕКС, ИВАН, МАРИЯ]",
        sampleInput: "5\nян\nалекс\nмария\nалекс\nиван",
        starterCode: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        List<String> names = new ArrayList<>();
        for (int i = 0; i < n; i++) names.add(scanner.nextLine());

        // TODO: stream pipeline
    }
}
`,
        tests: [{ label: "ян алекс мария алекс иван", stdin: "5\nян\nалекс\nмария\nалекс\nиван\n", expected: ["Топ: [АЛЕКС, ИВАН, МАРИЯ]"] }],
        requiredCode: [
          { pattern: "\\.distinct\\s*\\(", message: "Используй .distinct()" },
          { pattern: "\\.sorted\\s*\\(", message: "Используй .sorted()" },
        ],
        hints: ["`names.stream().filter(s -> s.length() > 3).map(String::toUpperCase).distinct().sorted().collect(Collectors.toList())`"],
        solution: `import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        List<String> names = new ArrayList<>();
        for (int i = 0; i < n; i++) names.add(scanner.nextLine());

        List<String> top = names.stream()
                .filter(s -> s.length() > 3)
                .map(String::toUpperCase)
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        System.out.println("Топ: " + top);
    }
}
`,
      },
    ],
  }),
];

export const module3Lessons: Lesson[] = [
  day22Lesson,
  day24Lesson,
  day25Lesson,
  day27Lesson,
  day28Lesson,
  ...coreModule3Lessons,
  ...module3AdvancedLessons,
].sort((a, b) => a.day - b.day);

