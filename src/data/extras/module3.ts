import type { LessonExtras } from "../types";
import {
  h, p, code, list, table, tip, warn, info, analogy,
  oracle, javadoc, baeldung, habr, leetcode, codingbat, book, link,
  JAVA_INTERVIEW_RU, DEV_JAVA, METANIT_JAVA, ROADMAP_JAVA, VISUALGO,
} from "./helpers";

const r = String.raw;

export const module3Extras: Record<number, LessonExtras> = {
  /* ================================================================== */
  /*  DAY 22 — Generics: обобщённые типы и безопасность типов           */
  /* ================================================================== */
  22: {
    deepDive: [
      h("Зачем нужны Generics и как работала Java до Java 5"),
      p("До появления Generics в Java 1.5 коллекции хранили обычные `Object`. Это приводило к двум катастрофическим проблемам: необходимость постоянного явного приведения типов `(String) list.get(0)` и риск получить `ClassCastException` во время выполнения (Runtime) вместо этапа компиляции."),
      code(r`
// До Java 5:
List oldList = new ArrayList();
oldList.add("Привет");
oldList.add(42); // Компилятор молчит!
for (Object o : oldList) {
    String s = (String) o; // Boom! ClassCastException на втором элементе!
}

// С Generics (Java 5+):
List<String> modernList = new ArrayList<>();
modernList.add("Привет");
// modernList.add(42); // ОШИБКА КОМПИЛЯЦИИ! Ловим ошибку до релиза!
`, "Безопасность типов"),
      h("Стирание типов (Type Erasure)"),
      p("В Java обобщения реализованы через **стирание типов**: компилятор проверяет типы и вставляет нужные касты, но в байт-коде `.class` информация о `<T>` стирается в `Object` (или в границу `extends`). Это было сделано для обратной совместимости со старыми библиотеками."),
      warn(
        "Последствия Type Erasure",
        "1. Нельзя создать массив дженериков: `new T[10]` — ошибка!\n" +
        "2. Нельзя создать инстанс: `new T()` — ошибка!\n" +
        "3. Нельзя использовать примитивы: `List<int>` нельзя, только `List<Integer>`.\n" +
        "4. В рантайме `list instanceof List<String>` проверить нельзя, только `list instanceof List<?>`."
      ),
      h("Ограничения типов (Bounded Types) и PECS"),
      p("Принцип PECS: **Producer Extends, Consumer Super** (производитель расширяет, потребитель супер)."),
      list(
        "`<? extends T>` — если коллекция только **отдаёт** данные (Producer / Read-Only). Мы можем безопасно читать `T`, но добавлять ничего кроме `null` нельзя!",
        "`<? super T>` — если коллекция только **принимает** данные (Consumer / Write-Only). Мы можем безопасно складывать туда элементы типа `T`.",
        "`<T extends Comparable<T>>` — ограничивает тип параметром, который умеет сравниваться."
      ),
      code(r`
// Пример метода копирования (классический PECS в Collections.copy):
public static <T> void copy(List<? super T> dest, List<? extends T> src) {
    for (T item : src) {
        dest.add(item); // Читаем из src (extends), пишем в dest (super)
    }
}
`, "Правило PECS на практике"),
    ],
    interview: [
      {
        q: "Что такое Type Erasure (стирание типов) в Java и зачем оно сделано?",
        a: "Стирание типов — это механизм компилятора, при котором вся информация о типах-дженериках используется только для проверок на этапе компиляции, а в скомпилированном байт-коде заменяется на Object (или верхнюю границу extends). Это было сделано в Java 5 для 100% обратной совместимости со старым кодом и библиотеками, написанными до появления дженериков.",
      },
      {
        q: "Что означает правило PECS (Producer Extends, Consumer Super)?",
        a: "Это правило выбора wildcard'ов. Если метод только читает элементы из коллекции (она является 'производителем' объектов для метода), используется `? extends T`. Если метод записывает элементы в коллекцию (она 'потребляет' объекты), используется `? super T`. Если метод и читает, и пишет — wildcard не нужен, используется точный тип `T`.",
      },
      {
        q: "Почему List<String> не является подтипом List<Object>?",
        a: "Дженерики инвариантны. Если бы `List<String>` наследовал `List<Object>`, то через ссылку `List<Object> list = stringList;` мы могли бы сделать `list.add(123);`, поместив число в список строк, что нарушило бы типобезопасность. Для полиморфизма коллекций используются вайлдкарды `List<?>` или `List<? extends Object>`.",
      },
    ],
    selfStudy: [
      "Прочитать главу 5 (Generics) в книге «Effective Java» Джошуа Блоха — правила с 26 по 33 обязательны к изучению",
      "Реализовать собственный дженерик-класс контейнера `Box<T>` с методами `set`, `get`, `isEmpty`",
      "Написать статический метод `findMax(List<T> list)`, где `T extends Comparable<T>`",
    ],
    resources: [
      oracle("java/generics/index.html", "Oracle Tutorial: Generics", "Официальное пошаговое руководство"),
      baeldung("java-generics", "The Basics of Java Generics", "Подробный разбор дженериков от Baeldung"),
      habr("Java Generics под капотом"),
      book("Effective Java (Джошуа Блох)", "Глава 5: Дженерики — почему не стоит использовать raw types"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 23 — ArrayList изнутри: динамический массив                    */
  /* ================================================================== */
  23: {
    deepDive: [
      h("Анатомия ArrayList: что у него под капотом"),
      p("`ArrayList<E>` — это обертка над обычным массивом `Object[] elementData`. Когда мы создаем `new ArrayList<>()`, начальный массив пустой `DEFAULTCAPACITY_EMPTY_ELEMENTDATA`. При первом вызове `add()` выделяется массив размером 10 элементов."),
      table(
        ["Поле в ArrayList", "Тип", "Назначение"],
        ["`elementData`", "`Object[]`", "Сам массив, где хранятся ссылки на объекты"],
        ["`size`", "`int`", "Реальное количество элементов, положенных пользователем"],
        ["`modCount`", "`int`", "Счетчик структурных изменений (для выявления параллельных модификаций)"],
        ["`DEFAULT_CAPACITY`", "`int = 10`", "Начальная емкость по умолчанию"]
      ),
      h("Формула расширения (Grow)"),
      p("Когда `size == elementData.length`, массив переполнен. Метод `grow()` создает новый массив большего размера и копирует элементы через быстрый нативный вызов `System.arraycopy()`:"),
      code(r`
// Формула расширения в исходниках JDK:
int newCapacity = oldCapacity + (oldCapacity >> 1); // Увеличение в 1.5 раза!
// (oldCapacity >> 1) — побитовый сдвиг вправо, эквивалентен делению на 2
`, "Формула расширения ArrayList"),
      h("Временная сложность операций (Big O)"),
      table(
        ["Операция", "Метод", "Сложность", "Пояснение"],
        ["Доступ по индексу", "`get(i)`, `set(i, val)`", "O(1)", "Мгновенно по формуле адреса в памяти `base + i * size`"],
        ["Добавление в конец", "`add(val)`", "O(1)* амортизированное", "Мгновенно, если есть место; при расширении O(n), но редко"],
        ["Вставка в середину/начало", "`add(0, val)`", "O(n)", "Требуется сдвинуть все последующие элементы вправо на 1"],
        ["Удаление по индексу", "`remove(i)`", "O(n)", "Требуется сдвинуть все элементы справа от индекса влево на 1"],
        ["Поиск по значению", "`indexOf(obj)`, `contains(obj)`", "O(n)", "Линейный перебор элементов в цикле через equals()"]
      ),
      tip(
        "Совет для Highload",
        "Если вы заранее знаете, что в списке будет 100 000 элементов, всегда задавайте начальный capacity: `new ArrayList<>(100_000);`. Это спасет от десятков циклов перевыделения памяти и копирования массивов!"
      ),
    ],
    interview: [
      {
        q: "Как устроен ArrayList и как он увеличивает размер?",
        a: "Внутри ArrayList лежит обычный массив Object[]. При первом добавлении создается массив на 10 элементов. При переполнении вызывается метод grow(), создающий новый массив размером в 1.5 раза больше исходного: newCapacity = oldCapacity + (oldCapacity >> 1), после чего данные копируются через System.arraycopy().",
      },
      {
        q: "В чем разница между size и capacity у ArrayList?",
        a: "size — это количество реально добавленных элементов (доступно через метод list.size()). capacity — это длина внутреннего массива elementData (физический размер выделенной памяти). capacity скрыт от прямого геттера, но может быть задан в конструкторе new ArrayList<>(initialCapacity).",
      },
      {
        q: "Что такое Fail-Fast итератор и modCount?",
        a: "Итератор ArrayList является fail-fast. При создании итератор запоминает текущее значение поля modCount (expectedModCount). Если во время обхода коллекция модифицируется извне (добавлен или удален элемент в обход методов итератора), modCount != expectedModCount, и итератор немедленно выбрасывает ConcurrentModificationException.",
      },
    ],
    selfStudy: [
      "Открыть исходный код `java.util.ArrayList` в IDE (Ctrl+клик или Cmd+клик) и изучить методы `add(E e)` и `grow(int minCapacity)`",
      "Написать бенчмарк: добавление 1 000 000 чисел в `new ArrayList<>()` против `new ArrayList<>(1_000_000)` с замером времени",
      "Решить задачу на LeetCode: 1. Two Sum (с использованием списков/массивов)",
    ],
    resources: [
      javadoc("java/util/ArrayList", "Официальный Javadoc ArrayList"),
      baeldung("java-arraylist", "Guide to the Java ArrayList", "Исчерпывающий обзор с примерами"),
      habr("Как устроен ArrayList внутри"),
      leetcode("two-sum", "Two Sum"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 24 — LinkedList и сравнение с ArrayList                       */
  /* ================================================================== */
  24: {
    deepDive: [
      h("Устройство LinkedList: двусвязный список"),
      p("`LinkedList<E>` не использует массив. Каждый элемент — это отдельный объект `Node<E>`, хранящий значение и две ссылки: на предыдущий узел (`prev`) и следующий (`next`). Сам список хранит ссылки на `first` и `last`."),
      code(r`
// Внутренний класс Node в java.util.LinkedList:
private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;

    Node(Node<E> prev, E element, Node<E> next) {
        this.item = element;
        this.next = next;
        this.prev = prev;
    }
}
`, "Узел связного списка Node"),
      h("Битва: ArrayList против LinkedList"),
      table(
        ["Критерий", "ArrayList", "LinkedList", "Победитель"],
        ["Доступ по индексу `get(i)`", "O(1) мгновенно", "O(n) перебор от начала/конца", "🏆 ArrayList"],
        ["Добавление в начало `addFirst()`", "O(n) сдвиг элементов", "O(1) переброс ссылок", "🏆 LinkedList"],
        ["Добавление в конец `add()`", "O(1) амортизированное", "O(1) ссылка на last", "Ничья (на практике ArrayList быстрее)"],
        ["Расход памяти на элемент", "Минимальный (только ссылки в массиве)", "Высокий (объект Node: 24-32 байта оверхеда на элемент!)", "🏆 ArrayList"],
        ["Кэш процессора (CPU Cache Locality)", "Идеальный (элементы лежат подряд в памяти)", "Плохой (узлы разбросаны по всей куче Heap)", "🏆 ArrayList"]
      ),
      tip(
        "Вердикт Senior разработчиков",
        "В 99.9% случаев в продакшене используется `ArrayList`. Даже для добавления в начало LinkedList проигрывает из-за огромного оверхеда по памяти и промахов кэша процессора. Для очередей вместо LinkedList сегодня используют `ArrayDeque`!"
      ),
    ],
    interview: [
      {
        q: "Как устроен LinkedList в Java?",
        a: "LinkedList реализован как двусвязный список (doubly-linked list). Он состоит из объектов Node, каждый из которых содержит значение элемента и две ссылки: prev на предыдущий узел и next на следующий. Класс реализует интерфейсы List, Deque и Queue.",
      },
      {
        q: "Почему get(index) в LinkedList работает медленно?",
        a: "У связного списка нет непрерывной области памяти и индексов. Чтобы получить элемент с номером i, LinkedList должен последовательно пройти по ссылкам от головы (first) или хвоста (last), проверяя, какой конец ближе к i. Это операция O(n).",
      },
      {
        q: "Что эффективнее по памяти: ArrayList или LinkedList?",
        a: "ArrayList значительно эффективнее. В ArrayList память тратится только на внутренний массив ссылок. В LinkedList для КАЖДОГО элемента создается отдельный объект Node в куче (Heap), который хранит 2 ссылки (prev, next), ссылку на данные и заголовок объекта (object header), что дает от 24 до 32 байт оверхеда на каждый элемент.",
      },
    ],
    selfStudy: [
      "Изучить реализацию метода `node(int index)` в исходниках `LinkedList` — обратить внимание на оптимизацию `index < (size >> 1)`",
      "Реализовать односвязный список `SimpleLinkedList<T>` вручную с методами `addFirst`, `addLast`, `printAll`",
      "Решить задачу на LeetCode: 206. Reverse Linked List",
    ],
    resources: [
      javadoc("java/util/LinkedList", "Официальный Javadoc LinkedList"),
      baeldung("java-linkedlist", "Guide to Java LinkedList", "Разбор методов и структуры"),
      VISUALGO("list", "Визуализация связных списков"),
      leetcode("reverse-linked-list", "Reverse Linked List"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 25 — Iterator, Comparable и Comparator                        */
  /* ================================================================== */
  25: {
    deepDive: [
      h("Паттерн Итератор (Iterator) и цикл for-each"),
      p("Цикл `for (String s : list)` — это просто синтаксический сахар для `Iterator<String>`. Любой класс, реализующий интерфейс `Iterable<T>`, может использоваться в цикле for-each."),
      code(r`
// Что мы пишем:
for (String s : list) {
    System.out.println(s);
}

// Во что это компилируется:
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String s = it.next();
    System.out.println(s);
}
`, "Трансформация for-each в Iterator"),
      warn(
        "Главная ловушка: удаление элементов в цикле",
        "Никогда не вызывайте `list.remove(...)` внутри цикла `for-each`! Это вызовет `ConcurrentModificationException`. Для безопасного удаления используйте метод `iterator.remove()` или метод `list.removeIf(s -> ...)`."
      ),
      h("Сортировка: Comparable против Comparator"),
      table(
        ["Критерий", "Comparable<T>", "Comparator<T>"],
        ["Смысл", "Естественный порядок сортировки (Natural Order)", "Внешний (настраиваемый) порядок сортировки"],
        ["Где объявляется", "Внутри самого класса: `class User implements Comparable<User>`", "В отдельном классе, лямбде или фабричном методе"],
        ["Метод", "`int compareTo(T o)`", "`int compare(T o1, T o2)`"],
        ["Правило знака", "< 0: this меньше o; 0: равны; > 0: this больше o", "< 0: o1 меньше o2; 0: равны; > 0: o1 больше o2"],
        ["Гибкость", "Один порядок на весь класс", "Сколько угодно компараторов (по имени, по возрасту, по убыванию)"]
      ),
      code(r`
// Современные Comparator в одну строчку (Java 8+):
List<User> users = ...;
// Сортировка по возрасту, а при равенстве — по имени без учета регистра:
users.sort(Comparator.comparingInt(User::getAge)
                     .thenComparing(User::getName, String.CASE_INSENSITIVE_ORDER));
`, "Современные компараторы через цепочки методов"),
    ],
    interview: [
      {
        q: "Почему при вызове list.remove() внутри цикла for-each падает ConcurrentModificationException?",
        a: "Цикл for-each транслируется в использование Iterator. У списка есть счетчик модификаций modCount, а у итератора — expectedModCount. Метод list.remove() увеличивает modCount списка. При следующем вызове it.next() итератор видит, что modCount != expectedModCount, и немедленно бросает исключение (fail-fast поведение).",
      },
      {
        q: "В чем разница между Comparable и Comparator?",
        a: "Comparable реализуется внутри самого сортируемого класса (метод compareTo), определяя его естественный порядок по умолчанию. Comparator — это внешний компаратор (метод compare), позволяющий задавать множество разных правил сортировки (по разным полям, по возрастанию, по убыванию) без изменения исходного класса.",
      },
      {
        q: "Каков контракт метода compareTo / compare?",
        a: "Метод должен возвращать отрицательное число, если первый элемент меньше второго; 0, если они равны; положительное число, если первый элемент больше второго. Должны соблюдаться свойства антисимметричности (sgn(x.compareTo(y)) == -sgn(y.compareTo(x))) и транзитивности.",
      },
    ],
    selfStudy: [
      "Изучить методы фабрики `Comparator`: `comparing`, `thenComparing`, `reversed`, `nullsLast`",
      "Написать программу сортировки списка студентов по 3 полям (факультет -> курс -> средний балл)",
      "Решить задачу на LeetCode: 242. Valid Anagram",
    ],
    resources: [
      oracle("java/collections/algorithms/index.html", "Oracle: Sorting Collections"),
      baeldung("java-comparator-comparable", "Comparable and Comparator in Java", "Отличные практические примеры"),
      habr("Разница между Comparable и Comparator в деталях"),
      leetcode("valid-anagram", "Valid Anagram"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 26 — HashMap изнутри: хеш-таблица и коллизии                 */
  /* ================================================================== */
  26: {
    deepDive: [
      h("Как устроен HashMap: массив корзин (Buckets)"),
      p("`HashMap<K, V>` — ключевая структура данных в бэкенде. Она обеспечивает доступ `put` и `get` в среднем за константное время **O(1)** благодаря хешированию."),
      code(r`
// Упрощенный внутренний массив HashMap:
Node<K,V>[] table; // Массив "корзин" (бакетов), размер всегда степень двойки (16, 32, 64...)

static class Node<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next; // Связный список при коллизиях!
}
`, "Массив корзин и класс Node"),
      h("Пошаговый алгоритм put(key, value)"),
      list(
        "1. Вычисляется `hashCode()` ключа. Для защиты от плохих хеш-функций применяется дополнительный сдвиг: `hash = (h = key.hashCode()) ^ (h >>> 16)`.",
        "2. Вычисляется номер корзины в массиве по битовой маске: `index = (n - 1) & hash` (это быстрый аналог `hash % n`, так как размер `n` всегда степень двойки).",
        "3. Если ячейка `table[index]` пуста — создается новый узел `Node` и помещается туда. O(1).",
        "4. Если ячейка занята (Коллизия!) — HashMap ищет по цепочке `Node` элемент с таким же хешем и `key.equals(existingKey)`.",
        "5. Если ключ найден — старое значение перезаписывается. Если нет — новый узел добавляется в конец списка.",
        "6. **Деревонизация (Treeify)**: Если длина цепочки в корзине достигает **8** элементов (и общий размер таблицы >= 64), связный список превращается в **Красно-чёрное сбалансированное дерево (TreeNode)**. Время поиска в худшем случае улучшается с O(n) до **O(log n)**!"
      ),
      h("Коэффициент загрузки (Load Factor) и Rehash"),
      p("По умолчанию начальная емкость `capacity = 16`, а коэффициент загрузки `loadFactor = 0.75`. Когда количество элементов превышает порог `threshold = capacity * loadFactor` (т.е. 16 * 0.75 = 12), таблица увеличивается в **2 раза** (до 32) и происходит **rehash** (перераспределение элементов по новым бакетам)."),
    ],
    interview: [
      {
        q: "Как работает метод put() в HashMap?",
        a: "1. Вычисляется hash ключа через key.hashCode() и дополнительный сдвиг. 2. Находится индекс бакета: (n-1) & hash. 3. Если бакет пуст, узел просто сохраняется. 4. При коллизии происходит обход списка/дерева в бакете: если ключ совпал по hash и equals, значение заменяется. Если не совпал — элемент добавляется. При длине цепочки >= 8 список трансформируется в красно-черное дерево. 5. Если size превысил threshold (capacity * loadFactor), происходит resize в 2 раза.",
      },
      {
        q: "Почему в качестве ключей HashMap рекомендуется использовать String или иммутабельные объекты?",
        a: "Если объект мутабельный, изменение его полей изменит его hashCode(). Если ключ изменится после помещения в HashMap, при вызове get(key) мы обратимся не в тот бакет и объект будет 'потерян' в мапе, вызывая утечки памяти и сбои поиска.",
      },
      {
        q: "Что происходит в HashMap при коллизии?",
        a: "Коллизия — это ситуация, когда разные ключи попадают в одну и ту же корзину. Элементы организуются в связный список. Начиная с Java 8, если в одном бакете накапливается 8 или более узлов (при общем capacity >= 64), список превращается в красно-чёрное дерево TreeNode с временем поиска O(log n) вместо O(n).",
      },
    ],
    selfStudy: [
      "Изучить исходный код метода `putVal` в `java.util.HashMap`",
      "Проверить работу битовой маски `(n - 1) & hash` на калькуляторе для n = 16 и разных чисел",
      "Решить задачу на LeetCode: 1. Two Sum (через HashMap за O(n))",
    ],
    resources: [
      javadoc("java/util/HashMap", "Официальный Javadoc HashMap"),
      baeldung("java-hashmap", "How Does HashMap Work in Java?", "Один из лучших разборов архитектуры"),
      habr("Как работает HashMap в Java с картинками"),
      leetcode("two-sum", "Two Sum — решение через HashMap"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 27 — HashSet, TreeMap, TreeSet                                */
  /* ================================================================== */
  27: {
    deepDive: [
      h("HashSet: магия на базе HashMap"),
      p("`HashSet<E>` на самом деле **не хранит элементы самостоятельно**! Внутри он создает обычный `HashMap<E, Object>`, где ваши элементы становятся **ключами**, а значением является одна общая статическая константа-заглушка `PRESENT = new Object()`."),
      code(r`
// Исходники java.util.HashSet:
private transient HashMap<E,Object> map;
private static final Object PRESENT = new Object();

public boolean add(E e) {
    return map.put(e, PRESENT) == null;
}
`, "Как устроен HashSet внутри"),
      h("TreeSet и TreeMap: красно-чёрные деревья"),
      p("В отличие от `HashMap`, который не гарантирует порядок элементов, `TreeMap<K, V>` и `TreeSet<E>` поддерживают элементы в **строго отсортированном порядке** (по `Comparable` или переданному `Comparator`)."),
      table(
        ["Коллекция", "Основа", "Сложность поиска", "Порядок элементов", "null-ключи"],
        ["`HashSet`", "Хеш-таблица (`HashMap`)", "O(1)", "Хаотичный (не гарантирован)", "Разрешен 1 null"],
        ["`LinkedHashSet`", "`HashMap` + двусвязный список", "O(1)", "Порядок вставки (Insertion order)", "Разрешен 1 null"],
        ["`TreeSet`", "Красно-чёрное дерево (`TreeMap`)", "O(log n)", "Отсортированный порядок", "Запрещен (бросает NPE!)"]
      ),
      tip(
        "Навигационные методы TreeSet",
        "`first()`, `last()` — минимум и максимум.\n" +
        "`higher(val)`, `lower(val)` — строго больше / меньше.\n" +
        "`ceiling(val)`, `floor(val)` — больше либо равно / меньше либо равно."
      ),
    ],
    interview: [
      {
        q: "Как устроен HashSet изнутри?",
        a: "HashSet является обёрткой над HashMap. Добавляемые элементы помещаются в качестве ключей HashMap, а в поле значения кладется статическая фиктивная константа-заглушка private static final Object PRESENT = new Object(). По этой причине уникальность и производительность HashSet полностью зависят от методов hashCode и equals элементов.",
      },
      {
        q: "В чем разница между HashMap и TreeMap?",
        a: "HashMap основан на хеш-таблице, операции put/get выполняются за O(1), порядок ключей не гарантируется. TreeMap основан на красно-чёрном сбалансированном дереве поиска, операции выполняются за O(log n), ключи хранятся в строго отсортированном порядке (согласно Comparable или переданному Comparator). В TreeMap null в качестве ключа запрещен.",
      },
    ],
    selfStudy: [
      "Сравнить производительность поиска в `HashSet` и `TreeSet` на 1 000 000 элементов",
      "Написать программу, которая удаляет дубликаты из списка с сохранением исходного порядка элементов (использовать `LinkedHashSet`)",
      "Решить задачу на LeetCode: 217. Contains Duplicate",
    ],
    resources: [
      javadoc("java/util/TreeSet", "Официальный Javadoc TreeSet"),
      baeldung("java-tree-set", "A Guide to TreeSet in Java"),
      habr("Красно-черные деревья в Java: TreeMap и TreeSet"),
      leetcode("contains-duplicate", "Contains Duplicate"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 28 — Спринт: «Телефонная книга»                               */
  /* ================================================================== */
  28: {
    deepDive: [
      h("Проектирование структур данных: One-to-Many на Map"),
      p("В реальном бэкенде у одного контакта может быть несколько номеров телефона (мобильный, рабочий, домашний). Для такой модели идеальна связка `Map<String, List<String>>` или `Map<String, Set<String>>`."),
      code(r`
public class PhoneBook {
    // Контакт -> Множество уникальных номеров:
    private final Map<String, Set<String>> storage = new HashMap<>();

    public void addNumber(String name, String phone) {
        // computeIfAbsent атомарно создаст HashSet, если имени еще нет:
        storage.computeIfAbsent(name, k -> new HashSet<>()).add(phone);
    }

    public Set<String> getNumbers(String name) {
        return storage.getOrDefault(name, Collections.emptySet());
    }
}
`, "Телефонная книга на computeIfAbsent"),
      tip(
        "Метод Map.computeIfAbsent",
        "Вместо устаревшего кода с `if (!map.containsKey(key)) { map.put(key, new ArrayList<>()); }` всегда используйте современный метод `map.computeIfAbsent(key, k -> new ArrayList<>())`!"
      ),
    ],
    interview: [
      {
        q: "Как правильно организовать связь 'один ко многим' в памяти без баз данных?",
        a: "Используется структура `Map<Key, Collection<Value>>`, например `Map<String, List<String>>` или `Map<String, Set<String>>`. Для наполнения рекомендуется использовать методы Map.computeIfAbsent() или Map.merge(), которые обеспечивают чистый и лаконичный код без лишних проверок на null.",
      },
    ],
    selfStudy: [
      "Добавить в телефонную книгу поиск контакта по номеру телефона (обратный индекс `Map<String, String>`: номер -> имя)",
      "Сделать экспорт книги в алфавитном порядке имен (использовать `TreeMap`)",
    ],
    resources: [
      baeldung("java-map-computeifabsent", "Guide to Map.computeIfAbsent"),
      habr("Полезные методы интерфейса Map в Java 8+"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 29 — Queue, Deque, PriorityQueue                              */
  /* ================================================================== */
  29: {
    deepDive: [
      h("Иерархия очередей: FIFO и LIFO"),
      p("Интерфейс `Queue` задает поведение FIFO (First-In-First-Out — первый пришел, первый ушел). Интерфейс `Deque` (Double Ended Queue) позволяет добавлять и забирать элементы с обоих концов."),
      table(
        ["Действие", "Бросает исключение при ошибке", "Возвращает специальное значение (null / false)"],
        ["Вставить в очередь", "`add(e)`", "`offer(e)` (рекомендуется)"],
        ["Забрать и удалить из очереди", "`remove()`", "`poll()` (рекомендуется)"],
        ["Посмотреть первый элемент без удаления", "`element()`", "`peek()` (рекомендуется)"]
      ),
      h("Почему устарел класс Stack и что использовать вместо него"),
      warn(
        "Не используйте java.util.Stack!",
        "Класс `Stack` наследует `Vector`, и все его методы синхронизированы (`synchronized`), что дает огромную просадку производительности. По официальной рекомендации Java API, в качестве стека (LIFO) нужно использовать `Deque`: `Deque<String> stack = new ArrayDeque<>()` с методами `push()` и `pop()`."
      ),
      h("PriorityQueue: очередь с приоритетом"),
      p("`PriorityQueue` извлекает элементы не по порядку поступления, а по их приоритету (наименьший элемент первым — Min-Heap). Внутри используется сбалансированная двоичная куча на базе массива. Сложность вставки и удаления — **O(log n)**, доступ к вершине `peek()` — **O(1)**."),
    ],
    interview: [
      {
        q: "В чем разница между методами poll() и remove() у Queue?",
        a: "Оба метода извлекают и удаляют элемент из головы очереди. Разница в поведении на пустой очереди: remove() бросает NoSuchElementException, а poll() безопасно возвращает null.",
      },
      {
        q: "Почему вместо класса Stack рекомендуется использовать Deque?",
        a: "Класс Stack является устаревшим наследником Vector. Все его методы содержат мониторы синхронизации (synchronized), что замедляет работу в однопоточных сценариях. ArrayDeque не имеет лишней блокировки и работает значительно быстрее.",
      },
    ],
    selfStudy: [
      "Реализовать алгоритм проверки правильной скобочной последовательности с помощью `Deque` как стека",
      "Решить задачу на LeetCode: 20. Valid Parentheses",
      "Решить задачу на LeetCode: 215. Kth Largest Element in an Array (через `PriorityQueue`)",
    ],
    resources: [
      javadoc("java/util/ArrayDeque", "Официальный Javadoc ArrayDeque"),
      baeldung("java-priority-queue", "Guide to Java PriorityQueue"),
      leetcode("valid-parentheses", "Valid Parentheses"),
      leetcode("kth-largest-element-in-an-array", "Kth Largest Element"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 30 — Лямбды и функциональные интерфейсы                       */
  /* ================================================================== */
  30: {
    deepDive: [
      h("Что такое лямбда-выражение"),
      p("Лямбда в Java — это компактный способ передать блок кода (поведение) как параметр в метод. Лямбду можно передавать туда, где ожидается **функциональный интерфейс** (интерфейс ровно с одним абстрактным методом, аннотированный `@FunctionalInterface`)."),
      h("Четверка главных функциональных интерфейсов Java (java.util.function)"),
      table(
        ["Интерфейс", "Сигнатура метода", "Смысл", "Пример применения"],
        ["`Predicate<T>`", "`boolean test(T t)`", "Проверка условия (фильтр)", "`s -> s.length() > 5`"],
        ["`Function<T, R>`", "`R apply(T t)`", "Трансформация объекта из типа T в тип R", "`user -> user.getName()`"],
        ["`Consumer<T>`", "`void accept(T t)`", "Действие над объектом (потребитель)", "`System.out::println`"],
        ["`Supplier<T>`", "`T get()`", "Поставщик / генератор данных без аргументов", "`() -> UUID.randomUUID()`"]
      ),
      code(r`
// До Java 8 (громоздкий анонимный класс):
Runnable r1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello");
    }
};

// С лямбдами:
Runnable r2 = () -> System.out.println("Hello");

// Примеры 4 китов:
Predicate<Integer> isPositive = x -> x > 0;
Function<String, Integer> lengthFunc = s -> s.length();
Consumer<String> printer = s -> System.out.println("Log: " + s);
Supplier<Double> randomGen = () -> Math.random();
`, "4 базовых функциональных интерфейса"),
      tip(
        "Effectively Final переменные",
        "Лямбда может обращаться к локальным переменным из внешнего метода, только если они не изменяются после инициализации (являются фактически финальными — effectively final)."
      ),
    ],
    interview: [
      {
        q: "Что такое функциональный интерфейс и зачем нужна аннотация @FunctionalInterface?",
        a: "Функциональный интерфейс — это интерфейс, содержащий ровно один абстрактный метод (Single Abstract Method, SAM). При этом он может содержать любое количество default и static методов. Аннотация @FunctionalInterface сообщает компилятору о необходимости проверить это правило и выдать ошибку, если в интерфейсе случайно появится второй абстрактный метод.",
      },
      {
        q: "Назовите 4 основных функциональных интерфейса из пакета java.util.function.",
        a: "1. Predicate<T> — метод boolean test(T t), проверяет условие. 2. Function<T, R> — метод R apply(T t), преобразует объект одного типа в другой. 3. Consumer<T> — метод void accept(T t), выполняет действие над объектом без возврата. 4. Supplier<T> — метод T get(), поставляет новый объект без входных параметров.",
      },
    ],
    selfStudy: [
      "Изучить специализированные примитивные интерфейсы: `IntPredicate`, `LongConsumer`, `DoubleFunction` (позволяют избежать автобоксинга)",
      "Написать свой метод `filterList(List<T> list, Predicate<T> condition)`",
    ],
    resources: [
      oracle("java/javaOO/lambdaexpressions.html", "Oracle: Lambda Expressions"),
      baeldung("java-8-functional-interfaces", "Functional Interfaces in Java 8"),
      habr("Функциональные интерфейсы в Java 8 просто и понятно"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 31 — Stream API: основы                                       */
  /* ================================================================== */
  31: {
    deepDive: [
      h("Конвейер Stream API: декларативная обработка данных"),
      p("`Stream` — это не структура данных и не коллекция, он не хранит элементы. Стрим — это поток данных, передающийся по конвейеру операций. Стримы делают код лаконичным, читаемым и легко параллелизуемым."),
      h("Промежуточные (Intermediate) против Терминальных (Terminal) операций"),
      table(
        ["Тип операции", "Примеры методов", "Поведение"],
        ["**Промежуточные** (Lazy)", "`filter`, `map`, `sorted`, `distinct`, `limit`, `skip`", "Ленивые: возвращают новый `Stream<T>`, не выполняются, пока не вызван терминальный метод!"],
        ["**Терминальные** (Eager)", "`collect`, `forEach`, `count`, `reduce`, `findFirst`, `anyMatch`", "Запускают обработку данных по цепочке, закрывают стрим и возвращают результат или void"]
      ),
      code(r`
List<String> names = List.of("Али", "Анна", "Борис", "Алексей", "Виктор");

List<String> result = names.stream()
    .filter(name -> name.startsWith("А")) // Оставляем только на букву 'А'
    .map(String::toUpperCase)             // Переводим в верхний регистр
    .sorted()                             // Сортируем по алфавиту
    .collect(Collectors.toList());        // Терминальная операция: собираем в List

System.out.println(result); // [АЛЕКСЕЙ, АЛИ, АННА]
`, "Базовый конвейер Stream API"),
      warn(
        "Стрим одноразовый!",
        "После вызова терминальной операции стрим закрывается. Если попытаться вызвать на нем операцию повторно, вылетит `IllegalStateException: stream has already been operated upon or closed`."
      ),
    ],
    interview: [
      {
        q: "В чем разница между промежуточными и терминальными операциями стрима?",
        a: "Промежуточные операции (filter, map, sorted) являются ленивыми (lazy): они не выполняют реальной обработки, а лишь формируют цепочку преобразований и возвращают новый Stream. Терминальные операции (collect, forEach, count) инициируют реальное прохождение данных через конвейер, вычисляют финальный результат и закрывают стрим.",
      },
      {
        q: "Можно ли переиспользовать один и тот же Stream?",
        a: "Нет. Стрим в Java одноразовый. Как только на нем была вызвана терминальная операция, стрим считается закрытым. Любая попытка повторного использования приведет к IllegalStateException.",
      },
    ],
    selfStudy: [
      "Потренироваться в отладке стримов с помощью метода `.peek(System.out::println)`",
      "Изучить методы `IntStream.range(1, 100)` и `Stream.iterate`",
    ],
    resources: [
      oracle("collections/streams/index.html", "Oracle: Aggregate Operations (Streams)"),
      baeldung("java-8-streams", "The Java 8 Stream API Tutorial"),
      habr("Шпаргалка по Java Stream API"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 32 — Stream API: reduce, groupingBy, flatMap                  */
  /* ================================================================== */
  32: {
    deepDive: [
      h("Продвинутые операции: flatMap"),
      p("`map` превращает один элемент в один элемент (`T -> R`). `flatMap` превращает один элемент в поток элементов (`T -> Stream<R>`) и «разглаживает» (схлопывает) их в единый плоский поток."),
      code(r`
// Пример: список заказов, у каждого список товаров
List<List<String>> matrix = List.of(
    List.of("A", "B"),
    List.of("C", "D")
);
List<String> flatList = matrix.stream()
    .flatMap(Collection::stream) // Разглаживаем список списков!
    .toList(); // [A, B, C, D]
`, "Применение flatMap"),
      h("Группировка с помощью Collectors.groupingBy"),
      p("Аналог SQL `GROUP BY`. Позволяет классифицировать элементы по ключу в `Map<Key, List<T>>`."),
      code(r`
record Employee(String name, String department, int salary) {}

List<Employee> emps = ...;

// 1. Простая группировка по отделам: Map<String, List<Employee>>
Map<String, List<Employee>> byDept = emps.stream()
    .collect(Collectors.groupingBy(Employee::department));

// 2. Группировка с подсчетом средней зарплаты по отделу: Map<String, Double>
Map<String, Double> avgSalaryByDept = emps.stream()
    .collect(Collectors.groupingBy(
        Employee::department,
        Collectors.averagingInt(Employee::salary)
    ));
`, "Мощные группировки через Collectors"),
    ],
    interview: [
      {
        q: "В чем разница между map() и flatMap()?",
        a: "Метод map() преобразует каждый элемент типа T в один элемент типа R (связь 1:1). Метод flatMap() преобразует каждый элемент в поток Stream<R>, после чего объединяет (схлопывает) все полученные потоки в один плоский поток (связь 1:many). Применяется для разворачивания списков списков, работы с Optional внутри стрима и т.д.",
      },
      {
        q: "Как работает метод Collectors.groupingBy()?",
        a: "Он группирует элементы стрима по заданному классификатору в Map. Первым параметром передается функция извлечения ключа (Function<T, K>). Вторым (опциональным) параметром может передаваться downstream коллектор для дальнейшей агрегации значений каждой группы (например, counting(), summingInt(), toSet()).",
      },
    ],
    selfStudy: [
      "Реализовать вычисление факториала числа с помощью `IntStream.rangeClosed(1, n).reduce(1, (a, b) -> a * b)`",
      "Написать группировку заказов по статусу с подсчетом общей выручки для каждого статуса",
    ],
    resources: [
      baeldung("java-groupingby-collector", "Guide to Java 8 groupingBy Collector"),
      baeldung("java-difference-map-and-flatmap", "Difference Between map() and flatMap()"),
      habr("Магия Collectors в Java Stream API"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 33 — Optional и ссылки на методы (Method References)          */
  /* ================================================================== */
  33: {
    deepDive: [
      h("Optional<T>: победа над NullPointerException"),
      p("`Optional<T>` — это контейнер, который может содержать объект типа `T` или быть пустым. Он был создан для возвращаемых значений методов, чтобы заставить вызывающий код явно обработать сценарий отсутствия значения."),
      table(
        ["Как делать ПРАВИЛЬНО", "Как делать НЕПРАВИЛЬНО"],
        ["`opt.orElse(\"default\")`", "`if (opt.isPresent()) opt.get()` (это тот же if != null)"],
        ["`opt.orElseGet(() -> computeDefault())`", "`opt.get()` без проверки isPresent()"],
        ["`opt.orElseThrow(() -> new NotFoundException())`", "Использовать Optional в качестве полей сущностей"],
        ["`opt.map(User::getAddress).filter(...)`", "Передавать `Optional` как аргумент в методы"]
      ),
      h("Ссылки на методы (Method References `::`)"),
      p("Синтаксический сахар над лямбдами, когда лямбда просто передает свои аргументы в существующий метод без изменений:"),
      list(
        "Ссылка на статический метод: `Math::max` эквивалентно `(a, b) -> Math.max(a, b)`",
        "Ссылка на метод конкретного объекта: `System.out::println` эквивалентно `x -> System.out.println(x)`",
        "Ссылка на метод произвольного объекта типа: `String::toUpperCase` эквивалентно `s -> s.toUpperCase()`",
        "Ссылка на конструктор: `ArrayList::new` эквивалентно `() -> new ArrayList<>()`"
      ),
    ],
    interview: [
      {
        q: "В чем разница между orElse() и orElseGet() в Optional?",
        a: "В методе orElse(value) значение по умолчанию вычисляется ВСЕГДА, даже если в Optional есть значение (так как аргумент передается по значению). В orElseGet(Supplier) лямбда поставщика вычисляется ЛЕНИВО — только тогда, когда Optional действительно пуст. Если получение дефолтного значения ресурсоемкое (запрос в БД, создание тяжелого объекта), нужно ВСЕГДА использовать orElseGet.",
      },
      {
        q: "Почему не стоит сохранять Optional в поля классов и передавать как аргументы методов?",
        a: "Optional не реализует Serializable (могут сломаться фреймворки сериализации, RMI, сессии). Кроме того, создание объекта-обертки на каждое поле создает лишнюю нагрузку на Garbage Collector. Для параметров метода это создает неудобство: вызывающей стороне придется каждый раз делать Optional.ofNullable().",
      },
    ],
    selfStudy: [
      "Переписать цепочку вложенных `if (user != null && user.getProfile() != null)` на функциональный стиль с `Optional`",
      "Изучить метод `Optional.flatMap()` для разворачивания вложенных Optional",
    ],
    resources: [
      oracle("java/javase/8/docs/api/java/util/Optional.html", "Javadoc: java.util.Optional"),
      baeldung("java-optional", "Guide to Java 8 Optional"),
      habr("Как правильно использовать Optional в Java"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 34 — Java Time API (java.time)                                */
  /* ================================================================== */
  34: {
    deepDive: [
      h("Почему старые Date и Calendar считаются плохими"),
      p("До Java 8 работа со временем (`java.util.Date`, `Calendar`) была источником бесконечных багов: `Date` мутабелен (любой поток мог изменить дату), месяцы нумеровались с 0 (январь = 0!), `SimpleDateFormat` был не потокобезопасен."),
      h("Современное API (JSR-310, пакет java.time)"),
      p("Все классы `java.time` **неизменяемы (immutable)** и абсолютно **потокобезопасны (thread-safe)**."),
      table(
        ["Класс", "Что хранит", "Пример"],
        ["`LocalDate`", "Только дата (год, месяц, день) без времени и таймзоны", "`2026-10-21` (День рождения)"],
        ["`LocalTime`", "Только время (часы, минуты, секунды, наносекунды)", "`14:30:00` (Время начала совещания)"],
        ["`LocalDateTime`", "Дата + время без таймзоны", "`2026-10-21T14:30:00`"],
        ["`Instant`", "Точка на временной шкале UTC (epoch timestamp)", "`2026-10-21T09:30:00.123Z` (для логов и БД)"],
        ["`ZonedDateTime`", "Дата + время + конкретный часовой пояс (ZoneId)", "`2026-10-21T14:30:00+05:00[Asia/Tashkent]`"],
        ["`Duration` / `Period`", "`Duration` — разница во времени (секунды), `Period` — в календарных днях", "`Duration.ofHours(3)`, `Period.ofMonths(2)`"]
      ),
      code(r`
LocalDate today = LocalDate.now();
LocalDate nextWeek = today.plusDays(7);

// Форматирование:
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
LocalDateTime now = LocalDateTime.now();
String formatted = now.format(fmt); // "21.10.2026 14:30"
`, "Работа с датами в современном стиле"),
    ],
    interview: [
      {
        q: "В чем преимущества java.time перед старым java.util.Date?",
        a: "1. Неизменяемость и потокобезопасность: все классы java.time immutable. 2. Четкое разделение концепций: отдельный класс для даты без времени (LocalDate), для момента в UTC (Instant), для часовых поясов (ZonedDateTime). 3. Интуитивная нумерация: месяцы с 1 по 12. 4. Потокобезопасный DateTimeFormatter взамен проблемного SimpleDateFormat.",
      },
      {
        q: "Что такое Instant и чем он отличается от LocalDateTime?",
        a: "Instant представляет собой однозначную физическую точку на универсальной временной шкале (количество секунд и наносекунд с Unix-эпохи 1970 UTC). LocalDateTime — это дата и время для человека (например, '21 октября 2026 года, 14:00'), но без контекста часового пояса невозможно определить точный физический момент времени во всем мире.",
      },
    ],
    selfStudy: [
      "Написать утилиту для расчета точного возраста человека в годах, месяцах и днях (`Period.between`)",
      "Разобраться с переводом времени между часовыми поясами (например, Ташкент -> Лондон -> Нью-Йорк)",
    ],
    resources: [
      oracle("java/time/index.html", "Oracle Tutorial: Date Time API"),
      baeldung("java-8-date-time-intro", "Introduction to the Java 8 Date/Time API"),
      habr("Java 8 Date-Time API: практическое руководство"),
      JAVA_INTERVIEW_RU,
    ],
  },

  /* ================================================================== */
  /*  DAY 35 — Итоговый проект: «Анализатор заказов»                    */
  /* ================================================================== */
  35: {
    deepDive: [
      h("Архитектура проекта: обработка потоков бизнес-данных"),
      p("В этом проекте объединяются все знания модуля 3: коллекции, компараторы, лямбды, Stream API, Optional и Time API. Цель — построить движок аналитики интернет-магазина."),
      code(r`
record OrderItem(String product, String category, int quantity, double price) {}

record Order(
    Long id,
    String customerEmail,
    LocalDateTime createdAt,
    List<OrderItem> items,
    OrderStatus status
) {}

// Задачи аналитики:
// 1. Выручка по категориям товаров:
Map<String, Double> revenueByCategory = orders.stream()
    .flatMap(o -> o.items().stream())
    .collect(Collectors.groupingBy(
        OrderItem::category,
        Collectors.summingDouble(item -> item.price() * item.quantity())
    ));

// 2. Топ-3 самых преданных покупателя по сумме покупок:
List<String> topCustomers = orders.stream()
    .collect(Collectors.groupingBy(
        Order::customerEmail,
        Collectors.summingDouble(o -> o.items().stream()
            .mapToDouble(i -> i.price() * i.quantity()).sum())
    ))
    .entrySet().stream()
    .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
    .limit(3)
    .map(Map.Entry::getKey)
    .toList();
`, "Аналитика заказов на чистом Stream API"),
    ],
    interview: [
      {
        q: "Когда стоит использовать Stream API, а когда обычный цикл for?",
        a: "Stream API идеален для цепочек трансформаций данных: фильтрация, маппинг, группировка, подсчет статистик. Он более декларативен и выразителен. Обычный цикл for-each предпочтительнее, если: 1) нужна высокая производительность в критической секции (меньше аллокаций объектов); 2) требуется ранний выход по break/continue; 3) в цикле вызываются методы, бросающие проверяемые исключения (checked exceptions).",
      },
    ],
    selfStudy: [
      "Добавить фильтрацию заказов за последние 30 дней с помощью `order.createdAt().isAfter(LocalDateTime.now().minusDays(30))`",
      "Экспортировать отчет в формат CSV",
    ],
    resources: [
      baeldung("java-streams-analytics", "Data Analytics with Java Streams"),
      habr("Stream API в реальных Enterprise-проектах"),
      ROADMAP_JAVA,
      JAVA_INTERVIEW_RU,
    ],
  },
};
