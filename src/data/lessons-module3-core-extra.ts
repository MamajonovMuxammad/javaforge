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

/* ------------------------------------------------------------------ */
/*  DAY 22: Generics (Обобщения)                                      */
/* ------------------------------------------------------------------ */
export const day22Lesson: Lesson = withDefaults({
  day: 22,
  moduleId: 3,
  title: "Generics: обобщенные типы и безопасность компиляции",
  short: "Параметризация классов <T>, стирание типов, устранение ClassCastException",
  difficulty: "Средний",
  duration: "~2 часа",
  xp: 100,
  ready: true,
  topics: ["Зачем нужны Generics", "Параметризованный класс Box<T>", "Обобщенные методы", "Стирание типов (Type Erasure)"],
  videos: [
    { author: "Алишев", query: "Алишев Java generics", note: "Дженерики с нуля" },
    { author: "Заур Трегулов", query: "Заур Трегулов generics Java", note: "Параметризованные классы и методы" },
  ],
  theory: [
    { type: "h", text: "Что такое Generics и зачем они нужны?" },
    {
      type: "p",
      text: "До Java 5 все коллекции хранили ссылки типа `Object`. Чтобы достать строку из списка, требовалось явное приведение: `String s = (String) list.get(0);`. Если по ошибке туда попадало число, программа падала во время работы с `ClassCastException`. **Generics** переносят эти ошибки на этап компиляции!",
    },
    {
      type: "callout",
      variant: "analogy",
      title: "Аналогия: Подписанные контейнеры на складе",
      text: "Без дженериков склад хранит одинаковые серые коробки с надписью «Что-то». Чтобы достать груз, приходится угадывать. С дженериками на коробке написано `Box<Apple>`: компилятор физически не позволит положить туда гаечный ключ `Wrench`.",
    },
    {
      type: "code",
      caption: "Синтаксис Generic класса и метода",
      code: `class Box<T> {
    private T value;

    public void set(T val) { this.value = val; }
    public T get() { return value; }
}

// Обобщенный метод:
public static <T> void printElement(T item) {
    System.out.println("Элемент: " + item);
}`,
    },
  ],
  tasks: [
    {
      id: "d22_t1",
      type: "warmup",
      title: "Задача 1: Разминка (Обобщенный класс Box<T>)",
      shortDesc: "Создание параметризованного контейнера",
      difficulty: "Лёгкий",
      xp: 25,
      description:
        "Создай класс `Box<T>` с приватным полем `private T item`.\nДобавь методы:\n- `void set(T item)`\n- `T get()`\nВ `main` создай `Box<String>` и положи туда прочитанную строку. Затем создай `Box<Integer>` и положи туда прочитанное число.\nВыведи:\n`Строка в коробке: <значение>`\n`Число в коробке: <значение>`.",
      requirements: ["Класс `Box<T>`", "Приватное поле `private T item`", "Использование `Box<String>` и `Box<Integer>`"],
      exampleInput: "Привет\n42",
      exampleOutput: "Строка в коробке: Привет\nЧисло в коробке: 42",
      sampleInput: "Привет\n42",
      starterCode: `import java.util.Scanner;

// TODO: class Box<T>

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        int num = scanner.nextInt();

        // TODO: Box<String> и Box<Integer>
    }
}
`,
      tests: [
        { label: "Привет, 42", stdin: "Привет\n42\n", expected: ["Строка в коробке: Привет", "Число в коробке: 42"] },
        { label: "Java, 100", stdin: "Java\n100\n", expected: ["Строка в коробке: Java", "Число в коробке: 100"] },
      ],
      requiredCode: [
        { pattern: "class\\s+Box<T>", message: "Объяви class Box<T>" },
        { pattern: "Box<String>", message: "Используй Box<String>" },
        { pattern: "Box<Integer>", message: "Используй Box<Integer>" },
      ],
      hints: ["`Box<String> strBox = new Box<>(); strBox.set(s);`"],
      solution: `import java.util.Scanner;

class Box<T> {
    private T item;

    public void set(T item) {
        this.item = item;
    }

    public T get() {
        return item;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        int num = scanner.nextInt();

        Box<String> strBox = new Box<>();
        strBox.set(s);

        Box<Integer> intBox = new Box<>();
        intBox.set(num);

        System.out.println("Строка в коробке: " + strBox.get());
        System.out.println("Число в коробке: " + intBox.get());
    }
}
`,
    },
    {
      id: "d22_t2",
      type: "practice",
      title: "Задача 2: Основная практика (Обобщенный метод swap)",
      shortDesc: "Обмен элементов в массиве любого ссылочного типа",
      difficulty: "Средний",
      xp: 35,
      description:
        "Создай статический обобщенный метод:\n`public static <T> void swap(T[] array, int i, int j)`:\nМеняет местами элементы с индексами $i$ и $j$ в массиве.\nВ `main` прочитай 4 строки в массив `String[]`, а затем два индекса `i` и `j`. Поменяй элементы местами через `swap` и напечатай обновленный массив через пробел.",
      requirements: ["Обобщенный метод `<T> void swap`", "Корректный обмен элементов"],
      exampleInput: "A B C D\n1 3",
      exampleOutput: "A D C B",
      sampleInput: "A B C D\n1 3",
      starterCode: `import java.util.Scanner;

public class Main {
    // TODO: public static <T> void swap(T[] array, int i, int j)

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] arr = new String[4];
        for (int k = 0; k < 4; k++) arr[k] = scanner.next();
        int i = scanner.nextInt();
        int j = scanner.nextInt();

        // TODO
    }
}
`,
      tests: [
        { label: "A B C D, swap(1, 3)", stdin: "A B C D\n1 3\n", expected: ["A D C B"] },
        { label: "10 20 30 40, swap(0, 2)", stdin: "10 20 30 40\n0 2\n", expected: ["30 20 10 40"] },
      ],
      requiredCode: [
        { pattern: "<T>\\s+void\\s+swap\\s*\\(\\s*T\\[\\]", message: "Объяви обобщенный метод <T> void swap(T[] array, int i, int j)" },
      ],
      hints: ["`T temp = array[i]; array[i] = array[j]; array[j] = temp;`"],
      solution: `import java.util.Scanner;

public class Main {
    public static <T> void swap(T[] array, int i, int j) {
        T temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] arr = new String[4];
        for (int k = 0; k < 4; k++) {
            arr[k] = scanner.next();
        }
        int i = scanner.nextInt();
        int j = scanner.nextInt();

        swap(arr, i, j);

        for (int k = 0; k < 4; k++) {
            System.out.print(arr[k] + (k < 3 ? " " : ""));
        }
        System.out.println();
    }
}
`,
    },
    {
      id: "d22_t3",
      type: "homework",
      title: "Задача 3: Домашнее задание (Универсальная пара Pair<K, V>)",
      shortDesc: "Класс с двумя generic-параметрами",
      difficulty: "Средний",
      xp: 40,
      description:
        "Создай класс `Pair<K, V>` с двумя типами параметров: приватными полями `private K first;` и `private V second;`.\nДобавь конструктор `Pair(K first, V second)`, геттеры `getFirst()` и `getSecond()`, а также метод `void printPair()`, выводящий `Pair[key=<first>, value=<second>]`.\nВ `main` создай пару `Pair<String, Integer>`, где ключ — имя студента, а значение — его балл.",
      requirements: ["Класс `Pair<K, V>`", "Два параметра типа", "Геттеры и метод `printPair()`"],
      exampleInput: "Амир 95",
      exampleOutput: "Pair[key=Амир, value=95]",
      sampleInput: "Амир 95",
      starterCode: `import java.util.Scanner;

// TODO: class Pair<K, V>

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.next();
        int score = scanner.nextInt();

        // TODO
    }
}
`,
      tests: [
        { label: "Амир 95", stdin: "Амир 95\n", expected: ["Pair[key=Амир, value=95]"] },
        { label: "Мария 100", stdin: "Мария 100\n", expected: ["Pair[key=Мария, value=100]"] },
      ],
      requiredCode: [
        { pattern: "class\\s+Pair<K,\\s*V>", message: "Объяви класс Pair<K, V>" },
        { pattern: "Pair<String,\\s*Integer>", message: "Используй Pair<String, Integer>" },
      ],
      hints: ["`Pair<String, Integer> p = new Pair<>(name, score); p.printPair();`"],
      solution: `import java.util.Scanner;

class Pair<K, V> {
    private K first;
    private V second;

    public Pair(K first, V second) {
        this.first = first;
        this.second = second;
    }

    public K getFirst() {
        return first;
    }

    public V getSecond() {
        return second;
    }

    public void printPair() {
        System.out.println("Pair[key=" + first + ", value=" + second + "]");
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.next();
        int score = scanner.nextInt();

        Pair<String, Integer> pair = new Pair<>(name, score);
        pair.printPair();
    }
}
`,
    },
  ],
});

/* ------------------------------------------------------------------ */
/*  DAY 24: LinkedList и сравнение с ArrayList                        */
/* ------------------------------------------------------------------ */
export const day24Lesson: Lesson = withDefaults({
  day: 24,
  moduleId: 3,
  title: "LinkedList и сравнение с ArrayList: связный список",
  short: "Узлы Node, вставка в начало O(1), доступ по индексу O(n), Deque методы",
  difficulty: "Средний",
  duration: "~2 часа",
  xp: 100,
  ready: true,
  topics: ["Двусвязный список Node", "addFirst и addLast", "Сравнение Big-O с ArrayList", "Расход памяти"],
  videos: [
    { author: "Алишев", query: "Алишев Java LinkedList", note: "LinkedList изнутри" },
    { author: "Заур Трегулов", query: "Заур Трегулов LinkedList", note: "ArrayList vs LinkedList" },
  ],
  theory: [
    { type: "h", text: "Как устроен LinkedList?" },
    {
      type: "p",
      text: "`LinkedList` устроен как цепочка узлов (`Node`). Каждый узел хранит само значение и две ссылки: на предыдущий узел (`prev`) и на следующий (`next`). В отличие от `ArrayList`, элементы не лежат в памяти единым сплошным блоком.",
    },
    {
      type: "table",
      head: ["Операция", "ArrayList", "LinkedList"],
      rows: [
        ["`get(i)` (доступ по индексу)", "$O(1)$ — мгновенно", "$O(N)$ — нужно перебирать ссылки"],
        ["`add(0, elem)` (вставка в начало)", "$O(N)$ — сдвиг всего массива", "$O(1)$ — смена двух ссылок"],
        ["`add(elem)` (вставка в конец)", "$O(1)$ амортизированное", "$O(1)$"],
        ["Расход памяти", "Минимальный (сплошной массив)", "Высокий (на каждый элемент создается Node)"],
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Что выбирать в 99% случаев?",
      text: "В реальном бэкенде практически **всегда выбирают `ArrayList`**! Благодаря кэшу процессора (CPU Cache Locality) непрерывный массив в памяти работает в разы быстрее, даже при сдвигах элементов. `LinkedList` используют только как очередь (`Queue/Deque`).",
    },
  ],
  tasks: [
    {
      id: "d24_t1",
      type: "warmup",
      title: "Задача 1: Разминка (Добавление в начало и конец)",
      shortDesc: "Методы addFirst и addLast в LinkedList",
      difficulty: "Лёгкий",
      xp: 25,
      description:
        "Создай `LinkedList<String> list = new LinkedList<>();`.\nПрочитай две строки: первую добавь в начало (`addFirst`), вторую — в конец (`addLast`).\nВыведи содержимое списка: `Список: <list>`.",
      requirements: ["Использование `LinkedList<String>`", "Методы `addFirst()` и `addLast()`"],
      exampleInput: "Конец\nНачало",
      exampleOutput: "Список: [Начало, Конец]",
      sampleInput: "Конец\nНачало",
      starterCode: `import java.util.LinkedList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s1 = scanner.nextLine();
        String s2 = scanner.nextLine();

        // TODO: LinkedList, addFirst(s2), addLast(s1)
    }
}
`,
      tests: [
        { label: "Конец, Начало", stdin: "Конец\nНачало\n", expected: ["Список: [Начало, Конец]"] },
        { label: "World, Hello", stdin: "World\nHello\n", expected: ["Список: [Hello, World]"] },
      ],
      requiredCode: [
        { pattern: "LinkedList<String>", message: "Используй LinkedList<String>" },
        { pattern: "\\.addFirst\\(", message: "Используй метод addFirst()" },
        { pattern: "\\.addLast\\(", message: "Используй метод addLast()" },
      ],
      hints: ["`list.addLast(s1); list.addFirst(s2);`"],
      solution: `import java.util.LinkedList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s1 = scanner.nextLine();
        String s2 = scanner.nextLine();

        LinkedList<String> list = new LinkedList<>();
        list.addLast(s1);
        list.addFirst(s2);

        System.out.println("Список: " + list);
    }
}
`,
    },
    {
      id: "d24_t2",
      type: "practice",
      title: "Задача 2: Основная практика (Удаление с обоих концов)",
      shortDesc: "Методы removeFirst и removeLast",
      difficulty: "Средний",
      xp: 35,
      description:
        "Прочитай число $N$, а затем $N$ слов в `LinkedList<String>`.\nУдали первый элемент через `removeFirst()` и последний через `removeLast()`.\nВыведи:\n`Удален первый: <первый>`\n`Удален последний: <последний>`\n`Осталось элементов: <size>`.",
      requirements: ["Методы `removeFirst()` и `removeLast()`", "Проверка оставшегося размера"],
      exampleInput: "4\nAlpha\nBeta\nGamma\nDelta",
      exampleOutput: "Удален первый: Alpha\nУдален последний: Delta\nОсталось элементов: 2",
      sampleInput: "4\nAlpha\nBeta\nGamma\nDelta",
      starterCode: `import java.util.LinkedList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        LinkedList<String> list = new LinkedList<>();
        for (int i = 0; i < n; i++) list.add(scanner.nextLine());

        // TODO
    }
}
`,
      tests: [
        { label: "4 греческие буквы", stdin: "4\nAlpha\nBeta\nGamma\nDelta\n", expected: ["Удален первый: Alpha", "Удален последний: Delta", "Осталось элементов: 2"] },
        { label: "3 слова", stdin: "3\nРаз\nДва\nТри\n", expected: ["Удален первый: Раз", "Удален последний: Три", "Осталось элементов: 1"] },
      ],
      requiredCode: [
        { pattern: "\\.removeFirst\\(\\)", message: "Используй removeFirst()" },
        { pattern: "\\.removeLast\\(\\)", message: "Используй removeLast()" },
      ],
      hints: ["`String f = list.removeFirst(); String l = list.removeLast();`"],
      solution: `import java.util.LinkedList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        LinkedList<String> list = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            list.add(scanner.nextLine());
        }

        String first = list.removeFirst();
        String last = list.removeLast();

        System.out.println("Удален первый: " + first);
        System.out.println("Удален последний: " + last);
        System.out.println("Осталось элементов: " + list.size());
    }
}
`,
    },
    {
      id: "d24_t3",
      type: "homework",
      title: "Задача 3: Домашнее задание (История вкладок браузера)",
      shortDesc: "Симулятор навигации назад и вперед",
      difficulty: "Средний",
      xp: 40,
      description:
        "Создай класс `BrowserHistory` на базе `LinkedList<String>`:\n- `void visit(String url)`: добавляет страницу в конец истории\n- `String back()`: если в истории больше 1 страницы, удаляет текущую (`removeLast`) и возвращает предыдущую (`getLast`). Если осталась одна — возвращает её.\nВ `main` обработай команды:\n`VISIT <url>` — переход по ссылке\n`BACK` — возврат назад с выводом `Текущая: <url>`.",
      requirements: ["Класс `BrowserHistory`", "Методы `visit` и `back`", "Корректная обработка граничных случаев"],
      exampleInput: "4\nVISIT google.com\nVISIT github.com\nVISIT spring.io\nBACK",
      exampleOutput: "Текущая: github.com",
      sampleInput: "4\nVISIT google.com\nVISIT github.com\nVISIT spring.io\nBACK",
      starterCode: `import java.util.LinkedList;
import java.util.Scanner;

class BrowserHistory {
    private LinkedList<String> history = new LinkedList<>();

    public void visit(String url) {
        // TODO
    }

    public String back() {
        // TODO
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        BrowserHistory browser = new BrowserHistory();
        // TODO
    }
}
`,
      tests: [
        { label: "Переход и назад", stdin: "4\nVISIT google.com\nVISIT github.com\nVISIT spring.io\nBACK\n", expected: ["Текущая: github.com"] },
        { label: "Два раза назад", stdin: "5\nVISIT a.com\nVISIT b.com\nVISIT c.com\nBACK\nBACK\n", expected: ["Текущая: b.com", "Текущая: a.com"] },
      ],
      requiredCode: [
        { pattern: "LinkedList<String>", message: "Используй LinkedList<String> для истории" },
      ],
      hints: ["`if (history.size() > 1) { history.removeLast(); } return history.getLast();`"],
      solution: `import java.util.LinkedList;
import java.util.Scanner;

class BrowserHistory {
    private LinkedList<String> history = new LinkedList<>();

    public void visit(String url) {
        history.addLast(url);
    }

    public String back() {
        if (history.size() > 1) {
            history.removeLast();
        }
        return history.getLast();
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        BrowserHistory browser = new BrowserHistory();
        for (int i = 0; i < n; i++) {
            String cmd = scanner.next();
            if (cmd.equals("VISIT")) {
                browser.visit(scanner.next());
            } else if (cmd.equals("BACK")) {
                System.out.println("Текущая: " + browser.back());
            }
        }
    }
}
`,
    },
  ],
});

/* ------------------------------------------------------------------ */
/*  DAY 25: Iterator, Comparable и Comparator                         */
/* ------------------------------------------------------------------ */
export const day25Lesson: Lesson = withDefaults({
  day: 25,
  moduleId: 3,
  title: "Iterator, Comparable и Comparator: безопасный обход и сортировка",
  short: "ConcurrentModificationException, Comparable compareTo, кастомные Comparator",
  difficulty: "Средний",
  duration: "~2 часа",
  xp: 100,
  ready: true,
  topics: ["Iterator и it.remove()", "ConcurrentModificationException", "Comparable<T>", "Comparator<T>"],
  videos: [
    { author: "Алишев", query: "Алишев Java Comparable Comparator", note: "Сортировка объектов" },
    { author: "Заур Трегулов", query: "Заур Трегулов Comparator Iterator", note: "Iterator и Comparator" },
  ],
  theory: [
    { type: "h", text: "Почему нельзя удалять элементы в for-each?" },
    {
      type: "p",
      text: "Внутри цикла `for (String s : list)` коллекция отслеживает счетчик модификаций (`modCount`). Если вызвать `list.remove(s)` напрямую, счетчик изменится, и цикл немедленно упадет с ошибкой `ConcurrentModificationException`! Единственный безопасный способ — использовать `Iterator`.",
    },
    {
      type: "callout",
      variant: "analogy",
      title: "Аналогия: Парадная шеренга",
      text: "Если солдат во время марша внезапно выбежит из строя (`list.remove`), командир собьется со счета шагов (`ConcurrentModificationException`). `Iterator` — это регламентированная команда: командир аккуратно выводит одного человека из строя через `iterator.remove()`, пересчитывает строй и продолжает марш.",
    },
    {
      type: "code",
      caption: "Безопасное удаление через Iterator",
      code: `Iterator<Integer> it = numbers.iterator();
while (it.hasNext()) {
    int val = it.next();
    if (val < 0) {
        it.remove(); // БЕЗОПАСНОЕ удаление
    }
}`,
    },
  ],
  tasks: [
    {
      id: "d25_t1",
      type: "warmup",
      title: "Задача 1: Разминка (Очистка отрицательных чисел через Iterator)",
      shortDesc: "Безопасное удаление из списка через it.remove()",
      difficulty: "Лёгкий",
      xp: 25,
      description:
        "Прочитай число $N$, затем $N$ целых чисел в `ArrayList<Integer>`.\nС помощью `Iterator<Integer>` удали из списка все отрицательные числа (`val < 0`).\nВыведи оставшийся список: `Положительные: <list>`.",
      requirements: ["Использование `Iterator<Integer>`", "Вызов `it.remove()`", "Отсутствие ConcurrentModificationException"],
      exampleInput: "5\n10 -4 25 -8 30",
      exampleOutput: "Положительные: [10, 25, 30]",
      sampleInput: "5\n10 -4 25 -8 30",
      starterCode: `import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(scanner.nextInt());

        // TODO: Iterator<Integer> it = list.iterator();
    }
}
`,
      tests: [
        { label: "10 -4 25 -8 30", stdin: "5\n10 -4 25 -8 30\n", expected: ["Положительные: [10, 25, 30]"] },
        { label: "Все отрицательные", stdin: "3\n-1 -2 -3\n", expected: ["Положительные: []"] },
      ],
      requiredCode: [
        { pattern: "Iterator<Integer>", message: "Используй Iterator<Integer>" },
        { pattern: "\\.remove\\(\\)", message: "Используй метод it.remove()" },
      ],
      hints: ["`while (it.hasNext()) { if (it.next() < 0) it.remove(); }`"],
      solution: `import java.util.ArrayList;
import java.util.Iterator;
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

        Iterator<Integer> it = list.iterator();
        while (it.hasNext()) {
            if (it.next() < 0) {
                it.remove();
            }
        }

        System.out.println("Положительные: " + list);
    }
}
`,
    },
    {
      id: "d25_t2",
      type: "practice",
      title: "Задача 2: Основная практика (Сортировка студентов по GPA)",
      shortDesc: "Реализация интерфейса Comparable<Student>",
      difficulty: "Средний",
      xp: 35,
      description:
        "Создай класс `Student implements Comparable<Student>` с полями `String name`, `double gpa`.\nРеализуй `compareTo` так, чтобы студенты сортировались **по убыванию GPA** (`Double.compare(other.gpa, this.gpa)`).\nПрочитай 3 студентов, отсортируй их через `Collections.sort(list)` и выведи каждого в формате: `<name>: <gpa>`.",
      requirements: ["Интерфейс `Comparable<Student>`", "Сортировка по убыванию GPA", "Метод `Collections.sort`"],
      exampleInput: "Амир 4.2\nОлег 4.9\nДиана 4.6",
      exampleOutput: "Олег: 4.9\nДиана: 4.6\nАмир: 4.2",
      sampleInput: "Амир 4.2\nОлег 4.9\nДиана 4.6",
      starterCode: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

class Student implements Comparable<Student> {
    String name;
    double gpa;

    Student(String name, double gpa) {
        this.name = name;
        this.gpa = gpa;
    }

    // TODO: compareTo
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<Student> list = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            list.add(new Student(scanner.next(), scanner.nextDouble()));
        }

        // TODO: Collections.sort
    }
}
`,
      tests: [
        { label: "3 студента", stdin: "Амир 4.2\nОлег 4.9\nДиана 4.6\n", expected: ["Олег: 4.9", "Диана: 4.6", "Амир: 4.2"] },
        { label: "Другие оценки", stdin: "Иван 3.8\nАнна 5.0\nСергей 4.0\n", expected: ["Анна: 5.0", "Сергей: 4.0", "Иван: 3.8"] },
      ],
      requiredCode: [
        { pattern: "implements\\s+Comparable<Student>", message: "Реализуй Comparable<Student>" },
        { pattern: "compareTo\\s*\\(", message: "Переопредели compareTo" },
      ],
      hints: ["`return Double.compare(o.gpa, this.gpa);`"],
      solution: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

class Student implements Comparable<Student> {
    String name;
    double gpa;

    Student(String name, double gpa) {
        this.name = name;
        this.gpa = gpa;
    }

    @Override
    public int compareTo(Student o) {
        return Double.compare(o.gpa, this.gpa);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<Student> list = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            list.add(new Student(scanner.next(), scanner.nextDouble()));
        }

        Collections.sort(list);

        for (Student s : list) {
            System.out.println(s.name + ": " + s.gpa);
        }
    }
}
`,
    },
    {
      id: "d25_t3",
      type: "homework",
      title: "Задача 3: Домашнее задание (Кастомный Comparator книг)",
      shortDesc: "Сортировка по цене, затем по названию в алфавитном порядке",
      difficulty: "Средний",
      xp: 40,
      description:
        "Создай класс `Book` с полями `String title`, `int price`.\nОтсортируй список книг с помощью кастомного `Comparator<Book>`:\n1. По возрастанию цены `price`\n2. Если цены равны — по алфавиту названий (`title.compareTo`).\nВ `main` прочитай 3 книги, отсортируй и выведи каждую: `<title> (<price> руб.)`.",
      requirements: ["Использование `Comparator<Book>`", "Двухуровневая сортировка", "Вывод результата"],
      exampleInput: "Java 900\nAlgorithms 900\nSQL 500",
      exampleOutput: "SQL (500 руб.)\nAlgorithms (900 руб.)\nJava (900 руб.)",
      sampleInput: "Java 900\nAlgorithms 900\nSQL 500",
      starterCode: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

class Book {
    String title;
    int price;

    Book(String title, int price) {
        this.title = title;
        this.price = price;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<Book> books = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            books.add(new Book(scanner.next(), scanner.nextInt()));
        }

        // TODO: books.sort(...)
    }
}
`,
      tests: [
        { label: "Двухуровневая сортировка", stdin: "Java 900\nAlgorithms 900\nSQL 500\n", expected: ["SQL (500 руб.)", "Algorithms (900 руб.)", "Java (900 руб.)"] },
        { label: "Разные цены", stdin: "C 300\nB 200\nA 100\n", expected: ["A (100 руб.)", "B (200 руб.)", "C (300 руб.)"] },
      ],
      requiredCode: [
        { pattern: "sort\\s*\\(", message: "Используй метод sort()" },
      ],
      hints: ["`books.sort((b1, b2) -> b1.price != b2.price ? Integer.compare(b1.price, b2.price) : b1.title.compareTo(b2.title));`"],
      solution: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Scanner;

class Book {
    String title;
    int price;

    Book(String title, int price) {
        this.title = title;
        this.price = price;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<Book> books = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            books.add(new Book(scanner.next(), scanner.nextInt()));
        }

        books.sort((b1, b2) -> {
            if (b1.price != b2.price) {
                return Integer.compare(b1.price, b2.price);
            }
            return b1.title.compareTo(b2.title);
        });

        for (Book b : books) {
            System.out.println(b.title + " (" + b.price + " руб.)");
        }
    }
}
`,
    },
  ],
});

/* ------------------------------------------------------------------ */
/*  DAY 27: HashSet, TreeSet, TreeMap                                 */
/* ------------------------------------------------------------------ */
export const day27Lesson: Lesson = withDefaults({
  day: 27,
  moduleId: 3,
  title: "HashSet, TreeSet и TreeMap: уникальность и сортированные структуры",
  short: "Множества Set, логарифмический поиск O(log n) в красно-черном дереве",
  difficulty: "Средний",
  duration: "~2 часа",
  xp: 100,
  ready: true,
  topics: ["HashSet (уникальность за O(1))", "TreeSet (отсортированное множество)", "TreeMap", "Красно-черное дерево"],
  videos: [
    { author: "Алишев", query: "Алишев Java Set HashSet TreeSet", note: "Множества Set" },
    { author: "Заур Трегулов", query: "Заур Трегулов TreeMap TreeSet", note: "TreeSet и TreeMap" },
  ],
  theory: [
    { type: "h", text: "Что такое Set и почему там нет дубликатов?" },
    {
      type: "p",
      text: "`Set` — это коллекция, моделирующая математическое множество: каждый элемент может присутствовать **только один раз**. При повторном добавлении метод `add()` просто вернет `false` и ничего не изменит.",
    },
    {
      type: "table",
      head: ["Коллекция", "Сложность поиска", "Порядок элементов", "Под капотом"],
      rows: [
        ["`HashSet`", "$O(1)$", "Случайный (хэш-таблица)", "`HashMap`"],
        ["`LinkedHashSet`", "$O(1)$", "Порядок добавления", "`LinkedHashMap`"],
        ["`TreeSet`", "$O(\\log N)$", "Отсортированный порядок", "`TreeMap` (Красно-черное дерево)"],
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: "Быстрое удаление дубликатов",
      text: "Если вам нужно оставить в списке только уникальные значения, просто передайте список в конструктор `HashSet`: `Set<String> unique = new HashSet<>(myList);`.",
    },
  ],
  tasks: [
    {
      id: "d27_t1",
      type: "warmup",
      title: "Задача 1: Разминка (Удаление дубликатов через HashSet)",
      shortDesc: "Подсчет количества уникальных слов",
      difficulty: "Лёгкий",
      xp: 25,
      description:
        "Прочитай число $N$, а затем $N$ слов (некоторые могут повторяться).\nДобавь все слова в `Set<String> set = new HashSet<>();`.\nВыведи `Уникальных слов: <size>`.",
      requirements: ["Использование `HashSet<String>`", "Вывод размера множества"],
      exampleInput: "5\nяблоко\nгруша\nяблоко\nбанан\nгруша",
      exampleOutput: "Уникальных слов: 3",
      sampleInput: "5\nяблоко\nгруша\nяблоко\nбанан\nгруша",
      starterCode: `import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        Set<String> set = new HashSet<>();
        // TODO: добавь слова в set и выведи размер
    }
}
`,
      tests: [
        { label: "5 слов (3 уникальных)", stdin: "5\nяблоко\nгруша\nяблоко\nбанан\nгруша\n", expected: ["Уникальных слов: 3"] },
        { label: "Все одинаковые", stdin: "3\nтест\nтест\nтест\n", expected: ["Уникальных слов: 1"] },
      ],
      requiredCode: [
        { pattern: "HashSet<String>", message: "Используй HashSet<String>" },
        { pattern: "\\.add\\(", message: "Используй метод .add()" },
      ],
      hints: ["`for (int i = 0; i < n; i++) set.add(scanner.nextLine());`"],
      solution: `import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        scanner.nextLine();

        Set<String> set = new HashSet<>();
        for (int i = 0; i < n; i++) {
            set.add(scanner.nextLine());
        }

        System.out.println("Уникальных слов: " + set.size());
    }
}
`,
    },
    {
      id: "d27_t2",
      type: "practice",
      title: "Задача 2: Основная практика (Автосортировка чисел в TreeSet)",
      shortDesc: "Хранение уникальных элементов в отсортированном порядке",
      difficulty: "Средний",
      xp: 35,
      description:
        "Прочитай число $N$, а затем $N$ целых чисел в случайном порядке с повторениями.\nПомести их в `TreeSet<Integer>`.\nВыведи элементы `TreeSet` через пробел. Они автоматически окажутся отсортированными по возрастанию без дубликатов!",
      requirements: ["Использование `TreeSet<Integer>`", "Вывод отсортированных чисел через пробел"],
      exampleInput: "6\n42 10 5 42 10 99",
      exampleOutput: "5 10 42 99",
      sampleInput: "6\n42 10 5 42 10 99",
      starterCode: `import java.util.Scanner;
import java.util.TreeSet;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        TreeSet<Integer> set = new TreeSet<>();
        // TODO: добавь числа и выведи через пробел
    }
}
`,
      tests: [
        { label: "42 10 5 42 10 99", stdin: "6\n42 10 5 42 10 99\n", expected: ["5 10 42 99"] },
        { label: "1 3 2 1", stdin: "4\n1 3 2 1\n", expected: ["1 2 3"] },
      ],
      requiredCode: [
        { pattern: "TreeSet<Integer>", message: "Используй TreeSet<Integer>" },
      ],
      hints: ["`for (int x : set) System.out.print(x + \" \");`"],
      solution: `import java.util.Scanner;
import java.util.TreeSet;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        TreeSet<Integer> set = new TreeSet<>();
        for (int i = 0; i < n; i++) {
            set.add(scanner.nextInt());
        }

        int count = 0;
        for (int val : set) {
            System.out.print(val + (++count < set.size() ? " " : ""));
        }
        System.out.println();
    }
}
`,
    },
    {
      id: "d27_t3",
      type: "homework",
      title: "Задача 3: Домашнее задание (Частотный словарь на TreeMap)",
      shortDesc: "Подсчет частоты слов и вывод по алфавиту",
      difficulty: "Средний",
      xp: 40,
      description:
        "Прочитай строку текста. Разбей её на слова (`split(\"\\\\s+\")`).\nИспользуя `TreeMap<String, Integer>`, подсчитай сколько раз встретилось каждое слово.\nВыведи слова в алфавитном порядке: `<слово>: <количество>`.",
      requirements: ["Использование `TreeMap<String, Integer>`", "Подсчет через `getOrDefault`", "Алфавитный вывод"],
      exampleInput: "яблоко груша яблоко слива груша яблоко",
      exampleOutput: "груша: 2\nслива: 1\nяблоко: 3",
      sampleInput: "яблоко груша яблоко слива груша яблоко",
      starterCode: `import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();

        TreeMap<String, Integer> freq = new TreeMap<>();
        // TODO
    }
}
`,
      tests: [
        { label: "яблоко груша слива", stdin: "яблоко груша яблоко слива груша яблоко\n", expected: ["груша: 2", "слива: 1", "яблоко: 3"] },
        { label: "java spring java", stdin: "java spring java\n", expected: ["java: 2", "spring: 1"] },
      ],
      requiredCode: [
        { pattern: "TreeMap<String,\\s*Integer>", message: "Используй TreeMap<String, Integer>" },
        { pattern: "getOrDefault", message: "Используй метод getOrDefault" },
      ],
      hints: ["`freq.put(w, freq.getOrDefault(w, 0) + 1);`"],
      solution: `import java.util.Map;
import java.util.Scanner;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        String[] words = text.split("\\s+");

        TreeMap<String, Integer> freq = new TreeMap<>();
        for (String w : words) {
            freq.put(w, freq.getOrDefault(w, 0) + 1);
        }

        for (Map.Entry<String, Integer> entry : freq.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
`,
    },
  ],
});

/* ------------------------------------------------------------------ */
/*  DAY 28: Спринт: «Телефонная книга»                                */
/* ------------------------------------------------------------------ */
export const day28Lesson: Lesson = withDefaults({
  day: 28,
  moduleId: 3,
  title: "Спринт: «Телефонная книга» (практика коллекций)",
  short: "Map<String, List<String>>, группировка телефонов, прямой и обратный поиск",
  difficulty: "Сложный",
  duration: "~3 часа",
  xp: 100,
  ready: true,
  topics: ["Комбинированные коллекции", "Map<String, List<String>>", "computeIfAbsent()", "Обратный поиск по номеру"],
  videos: [
    { author: "Алишев", query: "Алишев Java коллекции практика", note: "Практика по коллекциям" },
    { author: "Заур Трегулов", query: "Заур Трегулов коллекции задачи", note: "Задачи на Map и List" },
  ],
  theory: [
    { type: "h", text: "Спринт: комбинирование коллекций" },
    {
      type: "p",
      text: "В реальных проектах сущности редко бывают плоскими. У одного контакта может быть несколько телефонных номеров: мобильный, домашний, рабочий. Для этого используют вложенные структуры данных: `Map<String, List<String>>`.",
    },
    {
      type: "callout",
      variant: "tip",
      title: "Метод computeIfAbsent",
      text: "Вместо длинной проверки `if (!map.containsKey(name)) map.put(name, new ArrayList<>()); map.get(name).add(phone);` в Java 8 пишут в одну строчку: `map.computeIfAbsent(name, k -> new ArrayList<>()).add(phone);`.",
    },
    {
      type: "code",
      caption: "Схема хранения контактов",
      code: `Map<String, List<String>> phoneBook = new HashMap<>();

// Добавление:
phoneBook.computeIfAbsent("Алексей", k -> new ArrayList<>()).add("+7-900-111");
phoneBook.computeIfAbsent("Алексей", k -> new ArrayList<>()).add("+7-900-222");

// Результат: Алексей -> [+7-900-111, +7-900-222]`,
    },
  ],
  tasks: [
    {
      id: "d28_t1",
      type: "warmup",
      title: "Задача 1: Разминка (Добавление телефонов к контакту)",
      shortDesc: "Использование Map<String, List<String>>",
      difficulty: "Лёгкий",
      xp: 25,
      description:
        "Создай `Map<String, List<String>> book = new HashMap<>();`.\nПрочитай 3 записи в формате `Имя Номер`.\nДля каждого имени добавь номер в его список номеров (используй `computeIfAbsent`).\nПрочитай имя для поиска и выведи все его номера: `<имя>: <список_номеров>`.",
      requirements: ["Использование `Map<String, List<String>>`", "Метод `computeIfAbsent`"],
      exampleInput: "Амир 111\nОлег 222\nАмир 333\nАмир",
      exampleOutput: "Амир: [111, 333]",
      sampleInput: "Амир 111\nОлег 222\nАмир 333\nАмир",
      starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Map<String, List<String>> book = new HashMap<>();

        for (int i = 0; i < 3; i++) {
            String name = scanner.next();
            String phone = scanner.next();
            // TODO: computeIfAbsent
        }

        String search = scanner.next();
        // TODO: вывод номеров search
    }
}
`,
      tests: [
        { label: "Амир (2 номера)", stdin: "Амир 111\nОлег 222\nАмир 333\nАмир\n", expected: ["Амир: [111, 333]"] },
        { label: "Олег (1 номер)", stdin: "Амир 111\nОлег 222\nАмир 333\nОлег\n", expected: ["Олег: [222]"] },
      ],
      requiredCode: [
        { pattern: "Map<String,\\s*List<String>>", message: "Используй Map<String, List<String>>" },
      ],
      hints: ["`book.computeIfAbsent(name, k -> new ArrayList<>()).add(phone);`"],
      solution: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Map<String, List<String>> book = new HashMap<>();

        for (int i = 0; i < 3; i++) {
            String name = scanner.next();
            String phone = scanner.next();
            book.computeIfAbsent(name, k -> new ArrayList<>()).add(phone);
        }

        String search = scanner.next();
        System.out.println(search + ": " + book.getOrDefault(search, Collections.emptyList()));
    }
}
`,
    },
    {
      id: "d28_t2",
      type: "practice",
      title: "Задача 2: Основная практика (Безопасный поиск с сообщением)",
      shortDesc: "Обработка случая, когда контакт не найден в справочнике",
      difficulty: "Средний",
      xp: 35,
      description:
        "Создай структуру `Map<String, List<String>>`.\nПрочитай число записей $N$, затем $N$ пар `Имя Номер`.\nЗатем прочитай имя для поиска. Если контакт есть в базе, выведи `Номера <имя>: <список>`. Если контакта нет — выведи `Контакт <имя> не найден!`.",
      requirements: ["Проверка наличия контакта через `containsKey`", "Корректный вывод для отсутствующего контакта"],
      exampleInput: "2\nАнна 555-11\nБорис 777-22\nВиктор",
      exampleOutput: "Контакт Виктор не найден!",
      sampleInput: "2\nАнна 555-11\nБорис 777-22\nВиктор",
      starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        Map<String, List<String>> book = new HashMap<>();
        // TODO: заполни контакты и проверь имя через containsKey
    }
}
`,
      tests: [
        { label: "Виктор не найден", stdin: "2\nАнна 555-11\nБорис 777-22\nВиктор\n", expected: ["Контакт Виктор не найден!"] },
        { label: "Анна найдена", stdin: "2\nАнна 555-11\nБорис 777-22\nАнна\n", expected: ["Номера Анна: [555-11]"] },
      ],
      requiredCode: [
        { pattern: "containsKey", message: "Используй метод containsKey" },
      ],
      hints: ["`if (book.containsKey(search)) { ... } else { System.out.println(\"Контакт \" + search + \" не найден!\"); }`"],
      solution: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        Map<String, List<String>> book = new HashMap<>();
        for (int i = 0; i < n; i++) {
            String name = scanner.next();
            String phone = scanner.next();
            book.computeIfAbsent(name, k -> new ArrayList<>()).add(phone);
        }

        String search = scanner.next();
        if (book.containsKey(search)) {
            System.out.println("Номера " + search + ": " + book.get(search));
        } else {
            System.out.println("Контакт " + search + " не найден!");
        }
    }
}
`,
    },
    {
      id: "d28_t3",
      type: "homework",
      title: "Задача 3: Домашнее задание (Обратный поиск по номеру телефона)",
      shortDesc: "Поиск владельца номера среди всех списков контактов",
      difficulty: "Сложный",
      xp: 40,
      description:
        "Создай класс `PhoneBook`:\n- `void add(String name, String phone)`\n- `String findByPhone(String phone)`: перебирает все контакты и возвращает имя человека, чей список содержит этот номер. Если номер не найден ни у кого — возвращает `\"Неизвестный номер\"`.\nВ `main` добавь 3 записи и найди имя по заданному номеру: `Владелец <phone>: <имя>`.",
      requirements: ["Класс `PhoneBook`", "Метод `findByPhone` с перебором `entrySet()`"],
      exampleInput: "3\nАлиса 101\nБоб 202\nАлиса 303\n202",
      exampleOutput: "Владелец 202: Боб",
      sampleInput: "3\nАлиса 101\nБоб 202\nАлиса 303\n202",
      starterCode: `import java.util.*;

class PhoneBook {
    private Map<String, List<String>> data = new HashMap<>();

    public void add(String name, String phone) {
        // TODO
    }

    public String findByPhone(String phone) {
        // TODO: перебор entrySet
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        PhoneBook pb = new PhoneBook();
        // TODO
    }
}
`,
      tests: [
        { label: "Поиск 202 (Боб)", stdin: "3\nАлиса 101\nБоб 202\nАлиса 303\n202\n", expected: ["Владелец 202: Боб"] },
        { label: "Поиск 999 (Неизвестный)", stdin: "2\nОлег 111\nИван 222\n999\n", expected: ["Владелец 999: Неизвестный номер"] },
      ],
      requiredCode: [
        { pattern: "class\\s+PhoneBook", message: "Создай класс PhoneBook" },
        { pattern: "findByPhone", message: "Создай метод findByPhone" },
      ],
      hints: ["`for (Map.Entry<String, List<String>> entry : data.entrySet()) { if (entry.getValue().contains(phone)) return entry.getKey(); }`"],
      solution: `import java.util.*;

class PhoneBook {
    private Map<String, List<String>> data = new HashMap<>();

    public void add(String name, String phone) {
        data.computeIfAbsent(name, k -> new ArrayList<>()).add(phone);
    }

    public String findByPhone(String phone) {
        for (Map.Entry<String, List<String>> entry : data.entrySet()) {
            if (entry.getValue().contains(phone)) {
                return entry.getKey();
            }
        }
        return "Неизвестный номер";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        PhoneBook pb = new PhoneBook();
        for (int i = 0; i < n; i++) {
            pb.add(scanner.next(), scanner.next());
        }

        String targetPhone = scanner.next();
        System.out.println("Владелец " + targetPhone + ": " + pb.findByPhone(targetPhone));
    }
}
`,
    },
  ],
});
