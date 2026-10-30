import type { PracticeTask } from "./types";

export const module6PracticeTasks: PracticeTask[] = [
  {
    id: "pr_m6_arraylist_filter",
    moduleId: 6,
    moduleName: "Модуль 6: Коллекции и Stream API",
    topic: "ArrayList и безопасное удаление (removeIf)",
    title: "Фильтрация спам-сообщений из ArrayList",
    difficulty: "Лёгкий",
    xp: 25,
    description: `Попытка удалить элемент из списка \`ArrayList\` внутри обычного цикла \`for-each\` приводит к падению с \`ConcurrentModificationException\`. В современной Java для безопасного удаления элементов по условию используется метод \`list.removeIf(predicate)\`.

Напиши фильтр сообщений чата:
1. Считывает количество сообщений N.
2. Считывает N строк сообщений и добавляет их в \`ArrayList<String>\`.
3. Считывает стоп-слово (например "спам").
4. С помощью метода \`messages.removeIf(msg -> msg.toLowerCase().contains(stopWord.toLowerCase()))\` удаляет все нежелательные сообщения.
5. Выводит количество оставшихся сообщений и сами сообщения.

Формат вывода:
\`\`\`text
Осталось сообщений: [count]
[сообщение 1]
[сообщение 2]
...
\`\`\``,
    exampleInput: "4\nПривет всем!\nКупите дешевый СПАМ товар\nКак дела?\nЕще один спам здесь\nспам",
    exampleOutput: "Осталось сообщений: 2\nПривет всем!\nКак дела?",
    starterCode: `import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        List<String> messages = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            messages.add(scanner.nextLine());
        }
        String stopWord = scanner.nextLine().trim();
        
        // TODO: удали сообщения с помощью removeIf и выведи результат
        
    }
}`,
    theory: {
      title: "ConcurrentModificationException и метод removeIf",
      summary: "Как безопасно удалять элементы из коллекций в Java 8+.",
      keyPoints: [
        "Нельзя вызывать list.remove(...) внутри цикла for (String s : list).",
        "Безопасные варианты: 1) list.removeIf(predicate), 2) явный Iterator iterator.remove().",
        "Лямбда msg -> msg.toLowerCase().contains(...) проверяет условие для каждого элемента."
      ],
      codeExample: `messages.removeIf(m -> m.toLowerCase().contains(stopWord.toLowerCase()));
System.out.println("Осталось сообщений: " + messages.size());
for (String m : messages) {
    System.out.println(m);
}`,
      pitfalls: [
        "Не забудь перевести и сообщение, и стоп-слово в нижний регистр, чтобы поиск был регистронезависимым."
      ]
    },
    tests: [
      {
        label: "Удаление сообщений со словом 'спам'",
        stdin: "4\nПривет всем!\nКупите дешевый СПАМ товар\nКак дела?\nЕще один спам здесь\nспам\n",
        expected: ["Осталось сообщений: 2", "Привет всем!", "Как дела?"]
      },
      {
        label: "Нет спам-сообщений",
        stdin: "2\nПривет\nМир\nреклама\n",
        expected: ["Осталось сообщений: 2", "Привет", "Мир"]
      }
    ],
    hints: [
      "Используй `messages.removeIf(msg -> msg.toLowerCase().contains(stopWord.toLowerCase()))`.",
      "Выведи `messages.size()`, а затем в цикле элементы списка."
    ]
  },
  {
    id: "pr_m6_unique_words",
    moduleId: 6,
    moduleName: "Модуль 6: Коллекции и Stream API",
    topic: "Коллекция HashSet и TreeSet",
    title: "Уникальные хэштеги поста через Set",
    difficulty: "Лёгкий",
    xp: 25,
    description: `Коллекция \`Set\` хранит только уникальные элементы (дубликаты автоматически отбрасываются). \`TreeSet\` дополнительно гарантирует сортировку элементов в естественном (алфавитном) порядке.

Напиши парсер хэштегов из поста блога:
1. Программа считывает строку текста, содержащую слова и хэштеги через пробел (например: \`"java spring java backend docker spring kubernetes"\`).
2. Разбивает строку на слова через \`text.toLowerCase().split("\\\\s+")\`.
3. Помещает все слова в \`TreeSet<String>\`.
4. Выводит общее число исходных слов, число уникальных слов и список уникальных слов в алфавитном порядке через пробел.

Формат вывода:
\`\`\`text
Всего слов: [total]
Уникальных: [uniqueCount]
Список: [слово1 слово2 ...]
\`\`\``,
    exampleInput: "java spring java backend docker spring kubernetes",
    exampleOutput: "Всего слов: 7\nУникальных: 5\nСписок: backend docker java kubernetes spring",
    starterCode: `import java.util.Scanner;
import java.util.TreeSet;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine().trim();
        
        // TODO: разбей на слова и собери в TreeSet
        
    }
}`,
    theory: {
      title: "Коллекции Set: HashSet vs TreeSet",
      summary: "Как хранить уникальные значения без дубликатов.",
      keyPoints: [
        "HashSet: быстрый O(1) поиск и добавление, порядок элементов не гарантируется.",
        "TreeSet: логарифмическая O(log N) вставка на основе красно-черного дерева, элементы автоматически отсортированы.",
        "String.join(\" \", set) — склеивает элементы коллекции через пробел."
      ],
      codeExample: `String[] words = input.toLowerCase().split("\\\\s+");
Set<String> unique = new TreeSet<>();
for (String w : words) {
    if (!w.isEmpty()) unique.add(w);
}
System.out.println("Всего слов: " + words.length);
System.out.println("Уникальных: " + unique.size());
System.out.println("Список: " + String.join(" ", unique));`,
      pitfalls: [
        "При разбиении пустой строки split(\"\\\\s+\") может вернуть массив из одного пустого элемента. Проверяй !w.isEmpty()."
      ]
    },
    tests: [
      {
        label: "Строка: java spring java backend docker spring kubernetes",
        stdin: "java spring java backend docker spring kubernetes\n",
        expected: ["Всего слов: 7", "Уникальных: 5", "Список: backend docker java kubernetes spring"]
      },
      {
        label: "Все одинаковые: test test test",
        stdin: "test test test\n",
        expected: ["Всего слов: 3", "Уникальных: 1", "Список: test"]
      }
    ],
    hints: [
      "Используй `new TreeSet<String>()` для автоматической сортировки.",
      "Склей результат: `String.join(\" \", unique)`."
    ]
  },
  {
    id: "pr_m6_word_frequency",
    moduleId: 6,
    moduleName: "Модуль 6: Коллекции и Stream API",
    topic: "Ассоциативные массивы: HashMap",
    title: "Частотный словарь слов текста через HashMap",
    difficulty: "Средний",
    xp: 35,
    description: `Частотный анализ — фундаментальная задача в обработке текста и поиске.

Напиши программу, которая:
1. Считывает строку текста.
2. Приводит текст к нижнему регистру и удаляет знаки препинания (точки, запятые, восклицательные знаки): \`text.replaceAll("[.,!?:]", "")\`.
3. Разбивает текст на слова и с помощью \`Map<String, Integer>\` подсчитывает, сколько раз каждое слово встретилось в тексте (используй \`map.getOrDefault(word, 0) + 1\` или \`map.merge(word, 1, Integer::sum)\`).
4. Находит слово, которое встретилось чаще всего.

Формат вывода:
\`\`\`text
Слово 'java': [кол-во] раз
Слово 'код': [кол-во] раз
...
Самое частое слово: '[слово]' ([макс_кол-во] раз)
\`\`\``,
    exampleInput: "Java это круто, Java это мощно, учи Java каждый день!",
    exampleOutput: "Самое частое слово: 'java' (3 раз)",
    starterCode: `import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        
        // TODO: очисти знаки, посчитай частоты через HashMap и найди самое частое слово
        
    }
}`,
    theory: {
      title: "Паттерн частотного словаря на HashMap",
      summary: "Как подсчитывать количество вхождений с помощью getOrDefault.",
      keyPoints: [
        "Map<String, Integer> freq = new HashMap<>();",
        "Для каждого слова: freq.put(w, freq.getOrDefault(w, 0) + 1);",
        "В Java 8+ еще лаконичнее: freq.merge(w, 1, Integer::sum);",
        "Обход карты: for (Map.Entry<String, Integer> entry : freq.entrySet())."
      ],
      codeExample: `Map<String, Integer> map = new HashMap<>();
for (String w : words) {
    if (!w.isEmpty()) {
        map.put(w, map.getOrDefault(w, 0) + 1);
    }
}
String topWord = "";
int maxCount = 0;
for (var entry : map.entrySet()) {
    if (entry.getValue() > maxCount) {
        maxCount = entry.getValue();
        topWord = entry.getKey();
    }
}`,
      pitfalls: [
        "Не забывай очищать знаки препинания перед разбиением на слова, иначе 'java,' и 'java' посчитаются как два разных слова!"
      ]
    },
    tests: [
      {
        label: "Текст с повторением 'Java'",
        stdin: "Java это круто, Java это мощно, учи Java каждый день!\n",
        expected: ["Самое частое слово: 'java' (3 раз)"]
      },
      {
        label: "Текст с повторением 'код'",
        stdin: "чистый код и надежный код всегда в цене\n",
        expected: ["Самое частое слово: 'код' (2 раз)"]
      }
    ],
    hints: [
      "Очисти знаки: `text.replaceAll(\"[.,!?:]\", \"\")`.",
      "Подсчитывай: `map.put(w, map.getOrDefault(w, 0) + 1)`."
    ]
  },
  {
    id: "pr_m6_phonebook_multimap",
    moduleId: 6,
    moduleName: "Модуль 6: Коллекции и Stream API",
    topic: "Сложные структуры данных: Map<String, List<String>>",
    title: "Телефонная книга: один контакт — много номеров",
    difficulty: "Средний",
    xp: 35,
    description: `В реальных базах данных у одного клиента может быть несколько контактных номеров. В Java это моделируется картой списков \`Map<String, List<String>>\`.

Напиши справочник контактов:
1. Считывает число записей N.
2. Считывает N строк вида \`"Имя Номер"\` (например \`"Иван +79991112233"\`).
3. Метод добавления: если имени еще нет в карте, создает новый \`ArrayList\`, иначе добавляет номер в существующий список (\`map.computeIfAbsent(name, k -> new ArrayList<>()).add(phone)\`).
4. После ввода всех записей считывает имя для поиска (например "Иван").
5. Выводит все найденные номера контакта или \`"Контакт не найден"\`.

Формат вывода:
\`\`\`text
Контакт: [имя]
Номеров телефона: [count]
- [номер 1]
- [номер 2]
\`\`\``,
    exampleInput: "3\nИван +79991112233\nАнна +79995556677\nИван +79998889900\nИван",
    exampleOutput: "Контакт: Иван\nНомеров телефона: 2\n- +79991112233\n- +79998889900",
    starterCode: `import java.util.Scanner;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        Map<String, List<String>> phoneBook = new HashMap<>();
        
        // TODO: заполни телефонную книгу с помощью computeIfAbsent
        
        // TODO: найди контакт и выведи все его номера
    }
}`,
    theory: {
      title: "Метод computeIfAbsent в Map",
      summary: "Элегантное добавление элементов во вложенные коллекции.",
      keyPoints: [
        "Метод map.computeIfAbsent(key, mappingFunction) создает значение только если ключ еще отсутствует в карте.",
        "phoneBook.computeIfAbsent(name, k -> new ArrayList<>()).add(phone); заменяет 5 строк громоздкого if-else кода!",
        "Возвращает созданный или уже существующий список для указанного имени."
      ],
      codeExample: `phoneBook.computeIfAbsent(name, k -> new ArrayList<>()).add(phone);
List<String> phones = phoneBook.get(searchName);
if (phones == null || phones.isEmpty()) {
    System.out.println("Контакт не найден");
} else {
    System.out.println("Контакт: " + searchName);
    System.out.println("Номеров телефона: " + phones.size());
    for (String p : phones) System.out.println("- " + p);
}`,
      pitfalls: [
        "Всегда проверяй результат map.get() на null перед обращением к методам списка."
      ]
    },
    tests: [
      {
        label: "Поиск контакта с двумя номерами (Иван)",
        stdin: "3\nИван +79991112233\nАнна +79995556677\nИван +79998889900\nИван\n",
        expected: ["Контакт: Иван", "Номеров телефона: 2", "- +79991112233", "- +79998889900"]
      },
      {
        label: "Поиск отсутствующего контакта",
        stdin: "1\nОльга +79990001122\nПетр\n",
        expected: ["Контакт не найден"]
      }
    ],
    hints: [
      "Используй `phoneBook.computeIfAbsent(name, k -> new ArrayList<>()).add(phone)`.",
      "Проверь `if (!phoneBook.containsKey(searchName))`."
    ]
  },
  {
    id: "pr_m6_stream_filter_sort",
    moduleId: 6,
    moduleName: "Модуль 6: Коллекции и Stream API",
    topic: "Stream API: filter, sorted, map, toList",
    title: "Stream API: отбор отличников и рейтинг",
    difficulty: "Средний",
    xp: 35,
    description: `Stream API позволяет декларативно обрабатывать потоки данных цепочкой операций.

Дан класс студента:
\`class Student { String name; int score; }\`

Напиши конвейер Stream API, который:
1. Фильтрует студентов: оставляет только тех, у кого балл >= 75 (\`.filter(s -> s.score >= 75)\`).
2. Сортирует студентов по убыванию балла (\`.sorted(Comparator.comparingInt((Student s) -> s.score).reversed())\`).
3. Преобразует каждого студента в форматированную строку вида \`"[name]: [score] баллов"\` (\`.map(...)\`).
4. Собирает результат в список (\`.toList()\`).

В main(): считай N студентов, примени Stream и выведи итоговый рейтинг отличников.

Формат вывода:
\`\`\`text
Всего кандидатов: [n]
Прошли отбор: [count]
Рейтинг:
1. [name]: [score] баллов
2. [name]: [score] баллов
\`\`\``,
    exampleInput: "4\nАлексей 85\nМария 60\nДмитрий 95\nЕлена 78",
    exampleOutput: "Всего кандидатов: 4\nПрошли отбор: 3\nРейтинг:\n1. Дмитрий: 95 баллов\n2. Алексей: 85 баллов\n3. Елена: 78 баллов",
    starterCode: `import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;
import java.util.Comparator;

class Student {
    String name;
    int score;
    public Student(String name, int score) {
        this.name = name;
        this.score = score;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Student> students = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            students.add(new Student(scanner.next(), scanner.nextInt()));
        }
        
        // TODO: напиши Stream конвейер с filter, sorted, toList
        
    }
}`,
    theory: {
      title: "Конвейер Stream API в Java",
      summary: "Декларативная фильтрация и сортировка без промежуточных циклов.",
      keyPoints: [
        "students.stream() — открывает поток данных.",
        ".filter(s -> s.score >= 75) — оставляет элементы, удовлетворяющие условию.",
        ".sorted(Comparator.comparingInt((Student s) -> s.score).reversed()) — сортирует по убыванию.",
        ".toList() — терминальная операция сборки в неизменяемый список (Java 16+)."
      ],
      codeExample: `List<Student> passed = students.stream()
    .filter(s -> s.score >= 75)
    .sorted(Comparator.comparingInt((Student s) -> s.score).reversed())
    .toList();

System.out.println("Всего кандидатов: " + students.size());
System.out.println("Прошли отбор: " + passed.size());
System.out.println("Рейтинг:");
for (int i = 0; i < passed.size(); i++) {
    Student s = passed.get(i);
    System.out.println((i + 1) + ". " + s.name + ": " + s.score + " баллов");
}`,
      pitfalls: [
        "Не забывай вызывать терминальную операцию (toList(), count(), forEach()), иначе промежуточные операции фильтрации и сортировки даже не запустятся (ленивые вычисления)!"
      ]
    },
    tests: [
      {
        label: "4 студента: Алексей 85, Мария 60, Дмитрий 95, Елена 78",
        stdin: "4\nАлексей 85\nМария 60\nДмитрий 95\nЕлена 78\n",
        expected: ["Всего кандидатов: 4", "Прошли отбор: 3", "1. Дмитрий: 95 баллов", "2. Алексей: 85 баллов", "3. Елена: 78 баллов"]
      }
    ],
    hints: [
      "Используй `students.stream().filter(s -> s.score >= 75).sorted(...).toList()`.",
      "Для нумерации рейтинга используй обычный цикл for по результатам."
    ]
  },
  {
    id: "pr_m6_stream_stats",
    moduleId: 6,
    moduleName: "Модуль 6: Коллекции и Stream API",
    topic: "Примитивные стримы: IntStream и summaryStatistics",
    title: "Stream API: статистика продаж (summaryStatistics)",
    difficulty: "Лёгкий",
    xp: 25,
    description: `Для работы с числами в Java существуют специализированные стримы \`IntStream\`, \`DoubleStream\`, \`LongStream\`, которые исключают накладные расходы на автоупаковку (boxing/unboxing) в объекты-обёртки.

У класса \`IntStream\` есть мощный метод \`.summaryStatistics()\`, который за один проход вычисляет все базовые числовые метрики.

Программа считывает:
1. Количество продаж N
2. N целых чисел (суммы чеков)

С помощью \`Arrays.stream(sales).summaryStatistics()\` программа должна получить:
- Количество операций (count)
- Сумму всех продаж (sum)
- Минимальный чек (min)
- Максимальный чек (max)
- Средний чек (average)

Формат вывода:
\`\`\`text
Чеков: [count]
Сумма продаж: [sum] руб
Минимальный чек: [min] руб
Максимальный чек: [max] руб
Средний чек: [avg] руб
\`\`\``,
    exampleInput: "5\n1200 450 3200 890 2100",
    exampleOutput: "Чеков: 5\nСумма продаж: 7840 руб\nМинимальный чек: 450 руб\nМаксимальный чек: 3200 руб\nСредний чек: 1568.0 руб",
    starterCode: `import java.util.Scanner;
import java.util.Arrays;
import java.util.IntSummaryStatistics;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] sales = new int[n];
        for (int i = 0; i < n; i++) {
            sales[i] = scanner.nextInt();
        }
        
        // TODO: получи IntSummaryStatistics через Arrays.stream(sales)
        
    }
}`,
    theory: {
      title: "Числовая статистика с IntSummaryStatistics",
      summary: "Как вычислить сумму, среднее, минимум и максимум без 4 отдельных циклов.",
      keyPoints: [
        "Arrays.stream(sales) создает IntStream.",
        "IntSummaryStatistics stats = Arrays.stream(sales).summaryStatistics();",
        "Методы stats: getCount(), getSum(), getMin(), getMax(), getAverage()."
      ],
      codeExample: `IntSummaryStatistics stats = Arrays.stream(sales).summaryStatistics();
System.out.println("Чеков: " + stats.getCount());
System.out.println("Сумма продаж: " + stats.getSum() + " руб");
System.out.println("Минимальный чек: " + stats.getMin() + " руб");
System.out.println("Максимальный чек: " + stats.getMax() + " руб");
System.out.println("Средний чек: " + stats.getAverage() + " руб");`,
      pitfalls: [
        "Не вызывай stream().min() и stream().max() по отдельности, иначе массив будет обходиться несколько раз. summaryStatistics делает все за один проход!"
      ]
    },
    tests: [
      {
        label: "5 продаж [1200, 450, 3200, 890, 2100]",
        stdin: "5\n1200 450 3200 890 2100\n",
        expected: ["Чеков: 5", "Сумма продаж: 7840 руб", "Минимальный чек: 450 руб", "Максимальный чек: 3200 руб", "Средний чек: 1568"]
      }
    ],
    hints: [
      "Используй `Arrays.stream(sales).summaryStatistics()`.",
      "Печатай значения методов `stats.getSum()`, `stats.getMin()` и т.д."
    ]
  },
  {
    id: "pr_m6_stream_grouping",
    moduleId: 6,
    moduleName: "Модуль 6: Коллекции и Stream API",
    topic: "Группировка данных: Collectors.groupingBy",
    title: "Stream API: группировка заказов по статусам",
    difficulty: "Средний",
    xp: 35,
    description: `В backend-разработке группировка сущностей — одна из самых частых задач (аналог GROUP BY в SQL).

Дан заказ:
\`class Order { String id; String status; double amount; }\`

С помощью \`Collectors.groupingBy\` сгруппируй заказы по их статусу (например "PAID", "PENDING", "CANCELLED"):
1. Сгруппируй заказы по статусу и подсчитай количество заказов в каждом статусе:
   \`Map<String, Long> counts = orders.stream().collect(Collectors.groupingBy(o -> o.status, Collectors.counting()));\`
2. Сгруппируй заказы по статусу и посчитай суммарную стоимость заказов в статусе:
   \`Map<String, Double> sums = orders.stream().collect(Collectors.groupingBy(o -> o.status, Collectors.summingDouble(o -> o.amount)));\`

В main(): считай N заказов и выведи сводку по каждому встреченному статусу.

Формат вывода:
\`\`\`text
Статус [STATUS]: [кол-во] шт на сумму [сумма] руб
...
\`\`\``,
    exampleInput: "3\nORD-1 PAID 1500.0\nORD-2 PENDING 800.0\nORD-3 PAID 2500.0",
    exampleOutput: "Статус PAID: 2 шт на сумму 4000.0 руб\nСтатус PENDING: 1 шт на сумму 800.0 руб",
    starterCode: `import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

class Order {
    String id;
    String status;
    double amount;
    public Order(String id, String status, double amount) {
        this.id = id;
        this.status = status;
        this.amount = amount;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            orders.add(new Order(scanner.next(), scanner.next(), scanner.nextDouble()));
        }
        
        // TODO: сгруппируй заказы по статусу через Collectors.groupingBy
        
    }
}`,
    theory: {
      title: "Паттерн Collectors.groupingBy в Stream API",
      summary: "Мощный инструмент агрегации данных по ключу классификатора.",
      keyPoints: [
        "Collectors.groupingBy(Function classifier) группирует объекты в Map<K, List<T>>.",
        "Downstream коллекторы: Collectors.counting() подсчитывает элементы.",
        "Collectors.summingDouble(ToDoubleFunction) суммирует числовые поля.",
        "Downstream коллекторы позволяют производить аналитику в один проход без повторных фильтраций."
      ],
      codeExample: `Map<String, Long> counts = orders.stream()
    .collect(Collectors.groupingBy(o -> o.status, Collectors.counting()));

Map<String, Double> sums = orders.stream()
    .collect(Collectors.groupingBy(o -> o.status, Collectors.summingDouble(o -> o.amount)));`,
      pitfalls: [
        "Не забывай импортировать java.util.stream.Collectors."
      ]
    },
    tests: [
      {
        label: "3 заказа (PAID 1500, PENDING 800, PAID 2500)",
        stdin: "3\nORD-1 PAID 1500.0\nORD-2 PENDING 800.0\nORD-3 PAID 2500.0\n",
        expected: ["Статус PAID: 2 шт на сумму 4000", "Статус PENDING: 1 шт на сумму 800"]
      }
    ],
    hints: [
      "Сгруппируй отдельно количество через `counting()` и сумму через `summingDouble()`.",
      "Обойди множество статусов и выведи форматированную строку."
    ]
  },
  {
    id: "pr_m6_stream_top_n",
    moduleId: 6,
    moduleName: "Модуль 6: Коллекции и Stream API",
    topic: "Stream API: ограничение выборки limit()",
    title: "Stream API: ТОП-3 самых дорогих товаров в наличии",
    difficulty: "Лёгкий",
    xp: 25,
    description: `В интернет-магазине на витрину выводятся топовые товары в наличии.

Дан класс:
\`class Product { String name; double price; boolean inStock; }\`

Напиши конвейер Stream API, который:
1. Оставляет только товары в наличии (\`.filter(p -> p.inStock)\`).
2. Сортирует товары по убыванию цены (\`.sorted(Comparator.comparingDouble((Product p) -> p.price).reversed())\`).
3. Ограничивает выборку первыми 3 товарами (\`.limit(3)\`).
4. Преобразует товары в список (\`.toList()\`).

В main(): считай N товаров, примени Stream и выведи ТОП товаров.

Формат вывода:
\`\`\`text
ТОП-3 товаров в наличии:
1. [name]: [price] руб
2. [name]: [price] руб
3. [name]: [price] руб
\`\`\``,
    exampleInput: "5\nНоутбук 80000.0 true\nСмартфон 65000.0 true\nТелевизор 95000.0 false\nПланшет 45000.0 true\nЧасы 25000.0 true",
    exampleOutput: "ТОП-3 товаров в наличии:\n1. Ноутбук: 80000.0 руб\n2. Смартфон: 65000.0 руб\n3. Планшет: 45000.0 руб",
    starterCode: `import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;
import java.util.Comparator;

class Product {
    String name;
    double price;
    boolean inStock;
    public Product(String name, double price, boolean inStock) {
        this.name = name;
        this.price = price;
        this.inStock = inStock;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Product> products = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            products.add(new Product(scanner.next(), scanner.nextDouble(), scanner.nextBoolean()));
        }
        
        // TODO: отфильтруй inStock, отсортируй по убыванию цены и возьми limit(3)
        
    }
}`,
    theory: {
      title: "Метод limit() в Stream API",
      summary: "Короткозамкнутые (short-circuiting) операции в потоках.",
      keyPoints: [
        ".limit(maxSize) обрезает поток, пропуская не более maxSize элементов.",
        "Это эффективная операция: стрим перестает запрашивать новые элементы после достижения лимита.",
        "Для сортировки по убыванию цены: Comparator.comparingDouble((Product p) -> p.price).reversed()."
      ],
      codeExample: `List<Product> top3 = products.stream()
    .filter(p -> p.inStock)
    .sorted(Comparator.comparingDouble((Product p) -> p.price).reversed())
    .limit(3)
    .toList();`,
      pitfalls: [
        "Обрати внимание на товар Телевизор за 95000: у него inStock == false, поэтому он не должен попасть в топ!"
      ]
    },
    tests: [
      {
        label: "5 товаров (Телевизор 95000 нет в наличии)",
        stdin: "5\nНоутбук 80000.0 true\nСмартфон 65000.0 true\nТелевизор 95000.0 false\nПланшет 45000.0 true\nЧасы 25000.0 true\n",
        expected: ["ТОП-3 товаров в наличии:", "1. Ноутбук: 80000", "2. Смартфон: 65000", "3. Планшет: 45000"]
      }
    ],
    hints: [
      "Фильтруй: `.filter(p -> p.inStock)`.",
      "Сортируй по убыванию цены и вызывай `.limit(3)`."
    ]
  }
];

