/**
 * Java autocompletion, live templates, parameter hints, and hover provider for Monaco Editor.
 * Delivers an IntelliJ IDEA-like developer experience right in the browser.
 */

// Monaco API types (lightweight interface for runtime safety)
/* eslint-disable @typescript-eslint/no-explicit-any */

let isRegistered = false;

interface MethodDef {
  name: string;
  signature: string;
  insertText: string;
  doc: string;
  returnType?: string;
  kind?: number; // Monaco CompletionItemKind
}

const SCANNER_METHODS: MethodDef[] = [
  {
    name: "nextLine()",
    signature: "String nextLine()",
    insertText: "nextLine()",
    doc: "Считывает всю текущую строку до символа перевода строки (Enter).",
    returnType: "String",
  },
  {
    name: "nextInt()",
    signature: "int nextInt()",
    insertText: "nextInt()",
    doc: "Считывает следующее целое число (int) из стандартного потока ввода.",
    returnType: "int",
  },
  {
    name: "nextDouble()",
    signature: "double nextDouble()",
    insertText: "nextDouble()",
    doc: "Считывает следующее дробное число с плавающей точкой (double).",
    returnType: "double",
  },
  {
    name: "next()",
    signature: "String next()",
    insertText: "next()",
    doc: "Считывает следующее отдельное слово/токен (до первого пробела или перевода строки).",
    returnType: "String",
  },
  {
    name: "nextLong()",
    signature: "long nextLong()",
    insertText: "nextLong()",
    doc: "Считывает следующее большое целое число (long).",
    returnType: "long",
  },
  {
    name: "nextBoolean()",
    signature: "boolean nextBoolean()",
    insertText: "nextBoolean()",
    doc: "Считывает логическое значение (true или false).",
    returnType: "boolean",
  },
  {
    name: "hasNext()",
    signature: "boolean hasNext()",
    insertText: "hasNext()",
    doc: "Проверяет, есть ли ещё входные токены во входном потоке.",
    returnType: "boolean",
  },
  {
    name: "hasNextLine()",
    signature: "boolean hasNextLine()",
    insertText: "hasNextLine()",
    doc: "Проверяет, есть ли ещё строка во входном потоке.",
    returnType: "boolean",
  },
  {
    name: "hasNextInt()",
    signature: "boolean hasNextInt()",
    insertText: "hasNextInt()",
    doc: "Проверяет, является ли следующий токен целым числом.",
    returnType: "boolean",
  },
  {
    name: "hasNextDouble()",
    signature: "boolean hasNextDouble()",
    insertText: "hasNextDouble()",
    doc: "Проверяет, является ли следующий токен дробным числом.",
    returnType: "boolean",
  },
  {
    name: "close()",
    signature: "void close()",
    insertText: "close();",
    doc: "Закрывает сканнер и освобождает поток ввода System.in.",
    returnType: "void",
  },
];

const PRINT_STREAM_METHODS: MethodDef[] = [
  {
    name: "println()",
    signature: "void println(Object x)",
    insertText: "println(${1});",
    doc: "Выводит значение в консоль с автоматическим переводом на новую строку.",
    returnType: "void",
  },
  {
    name: "print()",
    signature: "void print(Object x)",
    insertText: "print(${1});",
    doc: "Выводит значение в консоль без перевода строки.",
    returnType: "void",
  },
  {
    name: "printf()",
    signature: 'void printf(String format, Object... args)',
    insertText: 'printf("${1:%s}\\n", ${2});',
    doc: "Форматированный вывод в консоль (как в Си / printf).",
    returnType: "void",
  },
  {
    name: "format()",
    signature: 'PrintStream format(String format, Object... args)',
    insertText: 'format("${1:%s}\\n", ${2});',
    doc: "Форматирует и выводит строку в поток.",
    returnType: "PrintStream",
  },
];

const STRING_METHODS: MethodDef[] = [
  {
    name: "length()",
    signature: "int length()",
    insertText: "length()",
    doc: "Возвращает количество символов (длину) строки.",
    returnType: "int",
  },
  {
    name: "charAt(index)",
    signature: "char charAt(int index)",
    insertText: "charAt(${1:0})",
    doc: "Возвращает символ по указанному индексу (нумерация с 0).",
    returnType: "char",
  },
  {
    name: "substring(begin, end)",
    signature: "String substring(int beginIndex, int endIndex)",
    insertText: "substring(${1:beginIndex}, ${2:endIndex})",
    doc: "Возвращает подстроку от beginIndex (включительно) до endIndex (не включая).",
    returnType: "String",
  },
  {
    name: "substring(begin)",
    signature: "String substring(int beginIndex)",
    insertText: "substring(${1:beginIndex})",
    doc: "Возвращает подстроку от указанного индекса до конца строки.",
    returnType: "String",
  },
  {
    name: "equals(other)",
    signature: "boolean equals(Object anObject)",
    insertText: "equals(${1:other})",
    doc: "Сравнивает содержимое строк на точное равенство (по значению, а не по ссылке).",
    returnType: "boolean",
  },
  {
    name: "equalsIgnoreCase(other)",
    signature: "boolean equalsIgnoreCase(String anotherString)",
    insertText: "equalsIgnoreCase(${1:other})",
    doc: "Сравнивает строки без учёта регистра символов (A == a).",
    returnType: "boolean",
  },
  {
    name: "contains(s)",
    signature: "boolean contains(CharSequence s)",
    insertText: "contains(${1:target})",
    doc: "Проверяет, содержит ли строка указанную подстроку.",
    returnType: "boolean",
  },
  {
    name: "startsWith(prefix)",
    signature: "boolean startsWith(String prefix)",
    insertText: "startsWith(${1:prefix})",
    doc: "Проверяет, начинается ли строка с указанного префикса.",
    returnType: "boolean",
  },
  {
    name: "endsWith(suffix)",
    signature: "boolean endsWith(String suffix)",
    insertText: "endsWith(${1:suffix})",
    doc: "Проверяет, заканчивается ли строка указанным суффиксом.",
    returnType: "boolean",
  },
  {
    name: "toLowerCase()",
    signature: "String toLowerCase()",
    insertText: "toLowerCase()",
    doc: "Возвращает новую строку в нижнем регистре (все буквы строчные).",
    returnType: "String",
  },
  {
    name: "toUpperCase()",
    signature: "String toUpperCase()",
    insertText: "toUpperCase()",
    doc: "Возвращает новую строку в верхнем регистре (все буквы заглавные).",
    returnType: "String",
  },
  {
    name: "trim()",
    signature: "String trim()",
    insertText: "trim()",
    doc: "Удаляет пробельные символы в начале и в конце строки.",
    returnType: "String",
  },
  {
    name: "strip()",
    signature: "String strip()",
    insertText: "strip()",
    doc: "Удаляет все пробелы Unicode в начале и конце строки (Java 11+).",
    returnType: "String",
  },
  {
    name: "replace(old, new)",
    signature: "String replace(CharSequence target, CharSequence replacement)",
    insertText: "replace(${1:target}, ${2:replacement})",
    doc: "Заменяет все вхождения target на replacement.",
    returnType: "String",
  },
  {
    name: "split(regex)",
    signature: "String[] split(String regex)",
    insertText: 'split("${1:\\\\s+}")',
    doc: "Разбивает строку на массив строк по регулярному выражению/разделителю.",
    returnType: "String[]",
  },
  {
    name: "isEmpty()",
    signature: "boolean isEmpty()",
    insertText: "isEmpty()",
    doc: "Возвращает true, если длина строки равна 0 (строка пустая).",
    returnType: "boolean",
  },
  {
    name: "isBlank()",
    signature: "boolean isBlank()",
    insertText: "isBlank()",
    doc: "Возвращает true, если строка пуста или состоит только из пробелов (Java 11+).",
    returnType: "boolean",
  },
  {
    name: "indexOf(str)",
    signature: "int indexOf(String str)",
    insertText: "indexOf(${1:str})",
    doc: "Возвращает индекс первого вхождения подстроки, либо -1, если не найдена.",
    returnType: "int",
  },
  {
    name: "lastIndexOf(str)",
    signature: "int lastIndexOf(String str)",
    insertText: "lastIndexOf(${1:str})",
    doc: "Возвращает индекс последнего вхождения подстроки, либо -1.",
    returnType: "int",
  },
  {
    name: "toCharArray()",
    signature: "char[] toCharArray()",
    insertText: "toCharArray()",
    doc: "Преобразует строку в массив символов char[].",
    returnType: "char[]",
  },
  {
    name: "repeat(count)",
    signature: "String repeat(int count)",
    insertText: "repeat(${1:count})",
    doc: "Повторяет строку count раз (Java 11+).",
    returnType: "String",
  },
];

const MATH_METHODS: MethodDef[] = [
  {
    name: "max(a, b)",
    signature: "int/double max(a, b)",
    insertText: "max(${1:a}, ${2:b})",
    doc: "Возвращает максимальное из двух значений.",
  },
  {
    name: "min(a, b)",
    signature: "int/double min(a, b)",
    insertText: "min(${1:a}, ${2:b})",
    doc: "Возвращает минимальное из двух значений.",
  },
  {
    name: "abs(a)",
    signature: "int/double abs(a)",
    insertText: "abs(${1:a})",
    doc: "Возвращает модуль (абсолютную величину) числа.",
  },
  {
    name: "pow(a, b)",
    signature: "double pow(double a, double b)",
    insertText: "pow(${1:a}, ${2:b})",
    doc: "Возводит число a в степень b.",
  },
  {
    name: "sqrt(a)",
    signature: "double sqrt(double a)",
    insertText: "sqrt(${1:a})",
    doc: "Возвращает квадратный корень из положительного числа a.",
  },
  {
    name: "round(a)",
    signature: "long round(double a)",
    insertText: "round(${1:a})",
    doc: "Округляет число до ближайшего целого.",
  },
  {
    name: "ceil(a)",
    signature: "double ceil(double a)",
    insertText: "ceil(${1:a})",
    doc: "Округляет дробное число вверх до ближайшего целого.",
  },
  {
    name: "floor(a)",
    signature: "double floor(double a)",
    insertText: "floor(${1:a})",
    doc: "Округляет дробное число вниз до ближайшего целого.",
  },
  {
    name: "random()",
    signature: "double random()",
    insertText: "random()",
    doc: "Возвращает псевдослучайное double число в диапазоне [0.0, 1.0).",
  },
  {
    name: "PI",
    signature: "double PI = 3.141592653589793",
    insertText: "PI",
    doc: "Математическая константа π (число Пи).",
  },
  {
    name: "E",
    signature: "double E = 2.718281828459045",
    insertText: "E",
    doc: "Основание натурального логарифма (число Эйлера e).",
  },
];

const LIST_METHODS: MethodDef[] = [
  {
    name: "add(element)",
    signature: "boolean add(E e)",
    insertText: "add(${1:element})",
    doc: "Добавляет элемент в конец списка.",
  },
  {
    name: "add(index, element)",
    signature: "void add(int index, E element)",
    insertText: "add(${1:index}, ${2:element})",
    doc: "Вставляет элемент по указанному индексу со сдвигом остальных вправо.",
  },
  {
    name: "get(index)",
    signature: "E get(int index)",
    insertText: "get(${1:index})",
    doc: "Возвращает элемент по указанному индексу.",
  },
  {
    name: "set(index, element)",
    signature: "E set(int index, E element)",
    insertText: "set(${1:index}, ${2:element})",
    doc: "Заменяет элемент по индексу новым значением.",
  },
  {
    name: "remove(index)",
    signature: "E remove(int index)",
    insertText: "remove(${1:index})",
    doc: "Удаляет элемент по индексу или по значению.",
  },
  {
    name: "size()",
    signature: "int size()",
    insertText: "size()",
    doc: "Возвращает количество элементов в коллекции.",
  },
  {
    name: "isEmpty()",
    signature: "boolean isEmpty()",
    insertText: "isEmpty()",
    doc: "Возвращает true, если список пуст.",
  },
  {
    name: "contains(o)",
    signature: "boolean contains(Object o)",
    insertText: "contains(${1:element})",
    doc: "Проверяет, содержится ли элемент в списке.",
  },
  {
    name: "clear()",
    signature: "void clear()",
    insertText: "clear();",
    doc: "Очищает список, удаляя все элементы.",
  },
  {
    name: "stream()",
    signature: "Stream<E> stream()",
    insertText: "stream()",
    doc: "Создает Stream для функциональной обработки списка.",
  },
  {
    name: "forEach(action)",
    signature: "void forEach(Consumer<? super T> action)",
    insertText: "forEach(${1:item} -> ${2:System.out.println(item)});",
    doc: "Выполняет действие для каждого элемента списка.",
  },
];

const MAP_METHODS: MethodDef[] = [
  {
    name: "put(key, value)",
    signature: "V put(K key, V value)",
    insertText: "put(${1:key}, ${2:value})",
    doc: "Добавляет пару «ключ-значение» в ассоциативный массив.",
  },
  {
    name: "get(key)",
    signature: "V get(Object key)",
    insertText: "get(${1:key})",
    doc: "Возвращает значение по ключу, либо null, если ключ отсутствует.",
  },
  {
    name: "getOrDefault(key, defaultVal)",
    signature: "V getOrDefault(Object key, V defaultValue)",
    insertText: "getOrDefault(${1:key}, ${2:defaultValue})",
    doc: "Возвращает значение по ключу или defaultValue, если ключ не найден.",
  },
  {
    name: "containsKey(key)",
    signature: "boolean containsKey(Object key)",
    insertText: "containsKey(${1:key})",
    doc: "Проверяет наличие ключа в мапе.",
  },
  {
    name: "containsValue(value)",
    signature: "boolean containsValue(Object value)",
    insertText: "containsValue(${1:value})",
    doc: "Проверяет наличие значения в мапе.",
  },
  {
    name: "remove(key)",
    signature: "V remove(Object key)",
    insertText: "remove(${1:key})",
    doc: "Удаляет запись с указанным ключом.",
  },
  {
    name: "size()",
    signature: "int size()",
    insertText: "size()",
    doc: "Возвращает количество пар ключ-значение.",
  },
  {
    name: "keySet()",
    signature: "Set<K> keySet()",
    insertText: "keySet()",
    doc: "Возвращает множество всех ключей мапы.",
  },
  {
    name: "values()",
    signature: "Collection<V> values()",
    insertText: "values()",
    doc: "Возвращает коллекцию всех значений мапы.",
  },
  {
    name: "entrySet()",
    signature: "Set<Map.Entry<K, V>> entrySet()",
    insertText: "entrySet()",
    doc: "Возвращает множество всех пар Map.Entry (ключ + значение).",
  },
  {
    name: "putIfAbsent(key, value)",
    signature: "V putIfAbsent(K key, V value)",
    insertText: "putIfAbsent(${1:key}, ${2:value})",
    doc: "Добавляет запись, только если ключ отсутствует или его значение null.",
  },
  {
    name: "isEmpty()",
    signature: "boolean isEmpty()",
    insertText: "isEmpty()",
    doc: "Проверяет, пуста ли мапа.",
  },
];

const ARRAYS_METHODS: MethodDef[] = [
  {
    name: "toString(arr)",
    signature: "String toString(Object[] a / int[] a)",
    insertText: "toString(${1:array})",
    doc: "Красиво преобразует массив в строку формата [elem1, elem2, ...].",
  },
  {
    name: "sort(arr)",
    signature: "void sort(Object[] a / int[] a)",
    insertText: "sort(${1:array});",
    doc: "Сортирует массив по возрастанию (in-place).",
  },
  {
    name: "binarySearch(arr, key)",
    signature: "int binarySearch(int[] a, int key)",
    insertText: "binarySearch(${1:sortedArray}, ${2:key})",
    doc: "Бинарный поиск элемента в предварительно отсортированном массиве.",
  },
  {
    name: "copyOf(original, newLength)",
    signature: "T[] copyOf(T[] original, int newLength)",
    insertText: "copyOf(${1:original}, ${2:newLength})",
    doc: "Копирует массив в новый с изменением длины.",
  },
  {
    name: "asList(elements)",
    signature: "List<T> asList(T... a)",
    insertText: "asList(${1:elements})",
    doc: "Оборачивает переданные элементы или массив в фиксированный List.",
  },
  {
    name: "fill(arr, val)",
    signature: "void fill(int[] a, int val)",
    insertText: "fill(${1:array}, ${2:value});",
    doc: "Заполняет весь массив указанным значением.",
  },
  {
    name: "stream(arr)",
    signature: "IntStream/Stream stream(int[] a)",
    insertText: "stream(${1:array})",
    doc: "Создает Stream из массива для фильтрации и преобразований.",
  },
];

const COLLECTIONS_METHODS: MethodDef[] = [
  {
    name: "sort(list)",
    signature: "void sort(List<T> list)",
    insertText: "sort(${1:list});",
    doc: "Сортирует список по возрастанию.",
  },
  {
    name: "reverse(list)",
    signature: "void reverse(List<?> list)",
    insertText: "reverse(${1:list});",
    doc: "Разворачивает порядок элементов в списке задом наперед.",
  },
  {
    name: "shuffle(list)",
    signature: "void shuffle(List<?> list)",
    insertText: "shuffle(${1:list});",
    doc: "Случайным образом перемешивает элементы в списке.",
  },
  {
    name: "max(coll)",
    signature: "T max(Collection<? extends T> coll)",
    insertText: "max(${1:collection})",
    doc: "Находит максимальный элемент в коллекции.",
  },
  {
    name: "min(coll)",
    signature: "T min(Collection<? extends T> coll)",
    insertText: "min(${1:collection})",
    doc: "Находит минимальный элемент в коллекции.",
  },
  {
    name: "frequency(coll, o)",
    signature: "int frequency(Collection<?> c, Object o)",
    insertText: "frequency(${1:collection}, ${2:target})",
    doc: "Подсчитывает количество вхождений указанного объекта в коллекции.",
  },
];

const STRING_BUILDER_METHODS: MethodDef[] = [
  {
    name: "append(str)",
    signature: "StringBuilder append(Object obj)",
    insertText: "append(${1:str})",
    doc: "Добавляет строку или объект в конец билдера.",
  },
  {
    name: "toString()",
    signature: "String toString()",
    insertText: "toString()",
    doc: "Преобразует накопленное содержимое StringBuilder в неизменяемый String.",
  },
  {
    name: "reverse()",
    signature: "StringBuilder reverse()",
    insertText: "reverse()",
    doc: "Разворачивает последовательность символов в билдере задом наперед.",
  },
  {
    name: "length()",
    signature: "int length()",
    insertText: "length()",
    doc: "Возвращает текущую длину символов в билдере.",
  },
  {
    name: "delete(start, end)",
    signature: "StringBuilder delete(int start, int end)",
    insertText: "delete(${1:start}, ${2:end})",
    doc: "Удаляет подстроку с позиции start до end.",
  },
];

/**
 * Heuristically infers variable type from code declaration or variable naming convention.
 */
function inferTargetType(code: string, targetName: string): string {
  const t = targetName.toLowerCase();

  // Known global classes
  if (targetName === "System") return "System";
  if (targetName === "Math") return "Math";
  if (targetName === "Arrays") return "Arrays";
  if (targetName === "Collections") return "Collections";
  if (targetName === "Integer") return "IntegerClass";
  if (targetName === "Double") return "DoubleClass";
  if (targetName === "Character") return "CharacterClass";

  // Check extracted code symbols first for exact declared type
  const symbols = extractCodeSymbols(code, Number.MAX_SAFE_INTEGER, 1);
  const foundSymbol = symbols.find((s) => s.name === targetName);
  if (foundSymbol) {
    const dt = foundSymbol.type.trim();
    if (dt.endsWith("[]")) return "Array";
    if (dt.startsWith("Scanner")) return "Scanner";
    if (dt.startsWith("String")) return "String";
    if (dt.startsWith("List") || dt.startsWith("ArrayList") || dt.startsWith("LinkedList")) return "List";
    if (dt.startsWith("Map") || dt.startsWith("HashMap") || dt.startsWith("TreeMap") || dt.startsWith("LinkedHashMap")) return "Map";
    if (dt.startsWith("Set") || dt.startsWith("HashSet") || dt.startsWith("TreeSet")) return "Set";
    if (dt.startsWith("StringBuilder") || dt.startsWith("StringBuffer")) return "StringBuilder";
    if (dt.startsWith("PrintStream")) return "PrintStream";
  }

  // Common naming heuristics
  if (t === "out" || t.endsWith(".out")) return "PrintStream";
  if (t.includes("scanner") || t === "sc" || t === "in" || t === "input") return "Scanner";
  if (t === "sb" || t.includes("builder")) return "StringBuilder";
  if (
    t.includes("str") ||
    t.includes("name") ||
    t.includes("text") ||
    t.includes("line") ||
    t.includes("word") ||
    t.includes("city") ||
    t.includes("msg") ||
    t.includes("greeting") ||
    t.includes("title")
  ) {
    return "String";
  }
  if (t.includes("list") || t.includes("items") || t.includes("numbers") || t.includes("names") || t.includes("users")) {
    return "List";
  }
  if (t.includes("map") || t.includes("dict") || t.includes("scores") || t.includes("counts")) {
    return "Map";
  }
  if (t.includes("set") || t.includes("unique")) {
    return "Set";
  }

  // Scan code for variable declaration: `Type varName` or `Type<...> varName` or `type[] varName`
  const esc = targetName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const arrayDeclRegex = new RegExp(`\\b(?:byte|short|int|long|float|double|boolean|char|[A-Z][a-zA-Z0-9_<>]*)\\s*(?:\\[\\s*\\])+\\s+${esc}\\b|\\b(?:byte|short|int|long|float|double|boolean|char|[A-Z][a-zA-Z0-9_<>]*)\\s+${esc}\\s*\\[\\s*\\]`);
  if (arrayDeclRegex.test(code)) {
    return "Array";
  }

  const declRegex = new RegExp(`\\b([A-Z][a-zA-Z0-9_<>]*)\\s+${esc}\\b`);
  const match = code.match(declRegex);
  if (match) {
    const declaredType = match[1];
    if (declaredType.startsWith("Scanner")) return "Scanner";
    if (declaredType.startsWith("String")) return "String";
    if (declaredType.startsWith("List") || declaredType.startsWith("ArrayList")) return "List";
    if (declaredType.startsWith("Map") || declaredType.startsWith("HashMap")) return "Map";
    if (declaredType.startsWith("Set") || declaredType.startsWith("HashSet")) return "Set";
    if (declaredType.startsWith("StringBuilder")) return "StringBuilder";
    if (declaredType.startsWith("PrintStream")) return "PrintStream";
  }

  return "Unknown";
}

const JAVA_RESERVED_WORDS = new Set([
  "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
  "class", "const", "continue", "default", "do", "double", "else", "enum",
  "extends", "false", "final", "finally", "float", "for", "goto", "if",
  "implements", "import", "instanceof", "int", "interface", "long", "native",
  "new", "null", "package", "private", "protected", "public", "record",
  "return", "short", "static", "strictfp", "super", "switch", "synchronized",
  "this", "throw", "throws", "transient", "true", "try", "var", "void",
  "volatile", "while", "yield",
]);

const NON_TYPE_KEYWORDS = new Set([
  "return", "case", "throw", "throws", "new", "import", "package", "class",
  "interface", "enum", "record", "extends", "implements", "if", "else",
  "for", "while", "do", "switch", "try", "catch", "finally", "break",
  "continue", "goto", "const", "assert", "instanceof",
]);

export interface ExtractedSymbol {
  name: string;
  kind: "variable" | "parameter" | "constant" | "method" | "class";
  type: string;
  value?: string;
  line: number;
  signature?: string;
  insertText?: string;
  isSnippet?: boolean;
  doc?: string;
}

/**
 * Strips single-line and multi-line comments while preserving exact line breaks and character offsets.
 */
function stripCommentsPreservingLayout(code: string): string {
  const chars = code.split("");
  let inString = false;
  let inChar = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const next = chars[i + 1];

    if (inLineComment) {
      if (ch === "\n") {
        inLineComment = false;
      } else if (ch !== "\r") {
        chars[i] = " ";
      }
      continue;
    }

    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        chars[i] = " ";
        chars[i + 1] = " ";
        i++;
        inBlockComment = false;
      } else if (ch !== "\n" && ch !== "\r") {
        chars[i] = " ";
      }
      continue;
    }

    if (inString) {
      if (ch === "\\" && i + 1 < chars.length) {
        i++;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (inChar) {
      if (ch === "\\" && i + 1 < chars.length) {
        i++;
      } else if (ch === "'") {
        inChar = false;
      }
      continue;
    }

    if (ch === "/" && next === "/") {
      chars[i] = " ";
      chars[i + 1] = " ";
      i++;
      inLineComment = true;
    } else if (ch === "/" && next === "*") {
      chars[i] = " ";
      chars[i + 1] = " ";
      i++;
      inBlockComment = true;
    } else if (ch === '"') {
      inString = true;
    } else if (ch === "'") {
      inChar = true;
    }
  }

  return chars.join("");
}

/**
 * Splits a string by top-level delimiter (e.g. `,` or `;`), ignoring delimiters inside `()`, `[]`, `{}`, `<>`, or quotes.
 */
function splitTopLevel(input: string, delimiter: string): Array<{ text: string; startOffset: number; endOffset: number }> {
  const result: Array<{ text: string; startOffset: number; endOffset: number }> = [];
  let depthParen = 0;
  let depthBracket = 0;
  let depthBrace = 0;
  let depthAngle = 0;
  let inString = false;
  let inChar = false;
  let start = 0;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inString) {
      if (ch === "\\") i++;
      else if (ch === '"') inString = false;
      continue;
    }
    if (inChar) {
      if (ch === "\\") i++;
      else if (ch === "'") inChar = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === "'") {
      inChar = true;
    } else if (ch === "(") {
      depthParen++;
    } else if (ch === ")") {
      depthParen = Math.max(0, depthParen - 1);
    } else if (ch === "[") {
      depthBracket++;
    } else if (ch === "]") {
      depthBracket = Math.max(0, depthBracket - 1);
    } else if (ch === "{") {
      depthBrace++;
    } else if (ch === "}") {
      depthBrace = Math.max(0, depthBrace - 1);
    } else if (ch === "<") {
      depthAngle++;
    } else if (ch === ">") {
      depthAngle = Math.max(0, depthAngle - 1);
    } else if (
      ch === delimiter &&
      depthParen === 0 &&
      depthBracket === 0 &&
      depthBrace === 0 &&
      depthAngle === 0
    ) {
      result.push({ text: input.slice(start, i), startOffset: start, endOffset: i });
      start = i + 1;
    }
  }

  result.push({ text: input.slice(start), startOffset: start, endOffset: input.length });
  return result;
}

/**
 * Extracts all user-declared variables, constants, parameters, methods, and classes from the current Java code.
 */
export function extractCodeSymbols(
  code: string,
  cursorLine: number,
  cursorColumn: number
): ExtractedSymbol[] {
  const cleanCode = stripCommentsPreservingLayout(code);
  const lines = cleanCode.split("\n");
  const symbolMap = new Map<string, ExtractedSymbol>();

  const addSymbol = (sym: ExtractedSymbol) => {
    if (!sym.name || JAVA_RESERVED_WORDS.has(sym.name)) return;
    const existing = symbolMap.get(sym.name);
    // Prefer declarations closer to or above the cursor, or upgrade with initial value
    if (!existing || (sym.line <= cursorLine && sym.line >= existing.line)) {
      symbolMap.set(sym.name, {
        ...existing,
        ...sym,
        value: sym.value ?? existing?.value,
      });
    }
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const lineNum = idx + 1;
    const rawLine = lines[idx];
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith("import ") || trimmed.startsWith("package ") || trimmed.startsWith("@")) {
      continue;
    }

    // 1. User-defined classes / interfaces / enums / records
    const classMatch = trimmed.match(/\b(class|interface|enum|record)\s+([A-Z][a-zA-Z0-9_$]*)\b/);
    if (classMatch) {
      const kindWord = classMatch[1];
      const className = classMatch[2];
      if (className !== "Main") {
        addSymbol({
          name: className,
          kind: "class",
          type: kindWord,
          line: lineNum,
          doc: `Объявленный в коде ${kindWord} ${className} (строка ${lineNum}).`,
        });
      }
    }

    // 2. Method declarations & their parameters
    const methodMatch = trimmed.match(
      /^(?:(?:public|private|protected|static|final|synchronized|abstract|default|native)\s+)*((?:byte|short|int|long|float|double|boolean|char|void|[A-Z][a-zA-Z0-9_$]*(?:\s*<[^{};()]*?>)?)(?:\s*\[\s*\])*)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(([^)]*)\)/
    );
    if (methodMatch && !NON_TYPE_KEYWORDS.has(methodMatch[1]) && !JAVA_RESERVED_WORDS.has(methodMatch[2])) {
      const returnType = methodMatch[1].replace(/\s+/g, " ").trim();
      const methodName = methodMatch[2];
      const paramsRaw = methodMatch[3].trim();

      const paramParts = paramsRaw ? splitTopLevel(paramsRaw, ",") : [];
      const paramNames: string[] = [];

      for (const part of paramParts) {
        const pTrim = part.text.trim();
        if (!pTrim) continue;
        const pMatch = pTrim.match(
          /^(?:final\s+)?((?:byte|short|int|long|float|double|boolean|char|[A-Z][a-zA-Z0-9_$]*(?:\s*<[^>]*>)?)(?:\s*\[\s*\])*(?:\s*\.\.\.)?)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*\[\s*\])*$/
        );
        if (pMatch) {
          const pType = (pMatch[1] + (pMatch[3] || "")).replace(/\s+/g, " ").trim();
          const pName = pMatch[2];
          paramNames.push(pName);
          if (!(lineNum === cursorLine && rawLine.indexOf(pName) <= cursorColumn && cursorColumn <= rawLine.indexOf(pName) + pName.length + 1)) {
            addSymbol({
              name: pName,
              kind: "parameter",
              type: pType,
              line: lineNum,
              doc: `Параметр метода ${methodName} типа ${pType} (строка ${lineNum}).`,
            });
          }
        }
      }

      if (methodName !== "main") {
        const snippetArgs = paramNames.map((p, i) => `\${${i + 1}:${p}}`).join(", ");
        addSymbol({
          name: methodName,
          kind: "method",
          type: returnType,
          line: lineNum,
          signature: `${returnType} ${methodName}(${paramsRaw})`,
          insertText: paramNames.length > 0 ? `${methodName}(${snippetArgs})` : `${methodName}()`,
          isSnippet: paramNames.length > 0,
          doc: `Метод ${methodName}, объявленный в файле (строка ${lineNum}).`,
        });
      }
      continue;
    }

    // 3. Enhanced for-each loop: `for (Type item : collection)`
    const forEachMatch = trimmed.match(
      /\bfor\s*\(\s*(?:final\s+)?((?:byte|short|int|long|float|double|boolean|char|var|[A-Z][a-zA-Z0-9_$]*(?:\s*<[^>]*>)?)(?:\s*\[\s*\])*)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*([^)]+)\)/
    );
    if (forEachMatch) {
      const vType = forEachMatch[1].replace(/\s+/g, " ").trim();
      const vName = forEachMatch[2];
      const iterable = forEachMatch[3].trim();
      if (lineNum !== cursorLine) {
        addSymbol({
          name: vName,
          kind: "variable",
          type: vType,
          value: `из ${iterable}`,
          line: lineNum,
          doc: `Переменная цикла for-each типа ${vType} (строка ${lineNum}).`,
        });
      }
      continue;
    }

    // 4. Classic for loop: `for (int i = 0, j = 10; i < n; i++)`
    const forInitMatch = trimmed.match(
      /\bfor\s*\(\s*(?:final\s+)?((?:byte|short|int|long|float|double|boolean|char|var|[A-Z][a-zA-Z0-9_$]*(?:\s*<[^>]*>)?)(?:\s*\[\s*\])*)\s+([^;:]+);/
    );
    if (forInitMatch) {
      const vType = forInitMatch[1].replace(/\s+/g, " ").trim();
      const decls = splitTopLevel(forInitMatch[2], ",");
      for (const d of decls) {
        const dm = d.text.trim().match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*=\s*(.+))?$/);
        if (dm) {
          addSymbol({
            name: dm[1],
            kind: "variable",
            type: vType,
            value: dm[2]?.trim(),
            line: lineNum,
            doc: `Индексная переменная цикла for типа ${vType} (строка ${lineNum}).`,
          });
        }
      }
      continue;
    }

    // 5. Catch block parameter: `catch (Exception e)`
    const catchMatch = trimmed.match(
      /\bcatch\s*\(\s*(?:final\s+)?([A-Za-z0-9_$|.\s]+?)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\)/
    );
    if (catchMatch) {
      const excType = catchMatch[1].trim();
      const excName = catchMatch[2];
      if (lineNum !== cursorLine) {
        addSymbol({
          name: excName,
          kind: "parameter",
          type: excType,
          line: lineNum,
          doc: `Переменная исключения типа ${excType} (строка ${lineNum}).`,
        });
      }
      continue;
    }

    // 6. Standard variable / constant / field declarations (supports single and comma-separated multi-declarations)
    const statements = splitTopLevel(rawLine, ";");
    for (const stmt of statements) {
      // On the current cursor line, do not extract variables from the statement the user is actively editing
      // unless there are comma-separated declarators declared fully to the left of the cursor.
      const stmtStartCol = stmt.startOffset + 1;
      const stmtEndCol = stmt.endOffset + 1;
      const cursorInStmt = lineNum === cursorLine && cursorColumn >= stmtStartCol && cursorColumn <= stmtEndCol + 1;

      const cleanedStmt = stmt.text.replace(/^[{}()\s]+/, "");
      const leadingOffsetInStmt = stmt.text.length - cleanedStmt.length;

      const modMatch = cleanedStmt.match(
        /^((?:(?:public|private|protected|static|final|volatile|transient)\s+)*)((?:byte|short|int|long|float|double|boolean|char|var|[A-Z][a-zA-Z0-9_$]*(?:\.[A-Z][a-zA-Z0-9_$]*)*)(?:\s*<[^{};=()]*?>)?(?:\s*\[\s*\])*)\s+(.+)$/
      );
      if (!modMatch) continue;

      const modifiers = modMatch[1] || "";
      const isFinal = /\bfinal\b/.test(modifiers);
      const baseType = modMatch[2].replace(/\s+/g, " ").trim();
      const restDecls = modMatch[3];

      if (NON_TYPE_KEYWORDS.has(baseType)) continue;

      const prefixLen = modMatch[0].length - restDecls.length;
      const declParts = splitTopLevel(restDecls, ",");

      for (const declPart of declParts) {
        const partStartCol = stmtStartCol + leadingOffsetInStmt + prefixLen + declPart.startOffset;
        const partEndCol = stmtStartCol + leadingOffsetInStmt + prefixLen + declPart.endOffset;

        // Skip the declarator currently being edited at the cursor so `long time = dis` does not suggest `time` or `dis`
        if (cursorInStmt && cursorColumn >= partStartCol) {
          continue;
        }

        const dTrim = declPart.text.trim();
        const varMatch = dTrim.match(
          /^([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*\[\s*\])*(?:\s*=\s*(.+))?$/
        );
        if (!varMatch) continue;

        const varName = varMatch[1];
        const extraBrackets = (varMatch[2] || "").replace(/\s+/g, "");
        const initValue = varMatch[3]?.trim();

        if (JAVA_RESERVED_WORDS.has(varName)) continue;

        let resolvedType = baseType + extraBrackets;
        if (resolvedType === "var" && initValue) {
          if (/^".*"$/.test(initValue)) resolvedType = "var (String)";
          else if (/^'.*'$/.test(initValue)) resolvedType = "var (char)";
          else if (/^(true|false)$/.test(initValue)) resolvedType = "var (boolean)";
          else if (/^-?\d+[lL]$/.test(initValue)) resolvedType = "var (long)";
          else if (/^-?\d+\.\d+[fF]$/.test(initValue)) resolvedType = "var (float)";
          else if (/^-?\d+\.\d+([dD])?$/.test(initValue)) resolvedType = "var (double)";
          else if (/^-?\d+$/.test(initValue)) resolvedType = "var (int)";
        }

        addSymbol({
          name: varName,
          kind: isFinal ? "constant" : "variable",
          type: resolvedType,
          value: initValue,
          line: lineNum,
          doc: `${isFinal ? "Константа" : "Переменная"} типа ${resolvedType} (строка ${lineNum})${
            initValue ? `\nЗначение: ${initValue}` : ""
          }`,
        });

        // Suppress unused warning for partEndCol
        void partEndCol;
      }
    }
  }

  // Sort symbols so variables declared closest above cursorLine come first
  return Array.from(symbolMap.values()).sort((a, b) => {
    const aAbove = a.line <= cursorLine ? 0 : 1;
    const bAbove = b.line <= cursorLine ? 0 : 1;
    if (aAbove !== bAbove) return aAbove - bAbove;
    return Math.abs(cursorLine - a.line) - Math.abs(cursorLine - b.line);
  });
}

/**
 * Registers Java autocomplete, IntelliJ templates, and documentation in Monaco Editor.
 */
export function registerJavaCompletions(monaco: any): void {
  if (isRegistered || !monaco || !monaco.languages) return;
  isRegistered = true;

  const CompletionItemKind = monaco.languages.CompletionItemKind;
  const InsertAsSnippet = monaco.languages.CompletionItemInsertTextRule?.InsertAsSnippet ?? 4;

  // 1. Completion Provider
  monaco.languages.registerCompletionItemProvider("java", {
    triggerCharacters: [".", " ", "(", "<"],

    provideCompletionItems: (model: any, position: any) => {
      const lineContent = model.getLineContent(position.lineNumber);
      const lineUntilPos = lineContent.substring(0, position.column - 1);
      const word = model.getWordUntilPosition(position);

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const textBeforeWord = lineUntilPos.slice(0, word.startColumn - 1).trimEnd();
      const code = model.getValue();

      // CASE A: User typed a dot '.' -> Member completions!
      if (textBeforeWord.endsWith(".")) {
        const exprBeforeDot = textBeforeWord.slice(0, -1).trim();

        // Check for System.out.
        if (exprBeforeDot === "System.out" || exprBeforeDot.endsWith(".out")) {
          return {
            suggestions: PRINT_STREAM_METHODS.map((m, idx) => ({
              label: m.name,
              kind: CompletionItemKind.Method,
              insertText: m.insertText,
              insertTextRules: InsertAsSnippet,
              detail: m.signature,
              documentation: m.doc,
              range,
              sortText: `0_${String(idx).padStart(2, "0")}`,
            })),
          };
        }

        // Check for System.
        if (exprBeforeDot === "System") {
          return {
            suggestions: [
              {
                label: "out",
                kind: CompletionItemKind.Field,
                insertText: "out",
                detail: "PrintStream out",
                documentation: "Стандартный поток вывода Java (консоль).",
                range,
                sortText: "0_01",
              },
              {
                label: "out.println()",
                kind: CompletionItemKind.Method,
                insertText: "out.println(${1});",
                insertTextRules: InsertAsSnippet,
                detail: "void println(Object x)",
                documentation: "Быстрый вывод в консоль с новой строки.",
                range,
                sortText: "0_02",
              },
              {
                label: "out.print()",
                kind: CompletionItemKind.Method,
                insertText: "out.print(${1});",
                insertTextRules: InsertAsSnippet,
                detail: "void print(Object x)",
                documentation: "Вывод в консоль без перехода на новую строку.",
                range,
                sortText: "0_03",
              },
              {
                label: "err",
                kind: CompletionItemKind.Field,
                insertText: "err",
                detail: "PrintStream err",
                documentation: "Стандартный поток ошибок (выводится красным цветом).",
                range,
                sortText: "0_04",
              },
              {
                label: "currentTimeMillis()",
                kind: CompletionItemKind.Method,
                insertText: "currentTimeMillis()",
                detail: "long currentTimeMillis()",
                documentation: "Текущее время в миллисекундах (Unix timestamp).",
                range,
                sortText: "0_05",
              },
              {
                label: "nanoTime()",
                kind: CompletionItemKind.Method,
                insertText: "nanoTime()",
                detail: "long nanoTime()",
                documentation: "Высокоточное системное время в наносекундах для бенчмарков.",
                range,
                sortText: "0_06",
              },
            ],
          };
        }

        // Extract identifier before dot
        const targetMatch = exprBeforeDot.match(/([a-zA-Z0-9_$]+)$/);
        const targetName = targetMatch ? targetMatch[1] : "";
        const targetType = inferTargetType(code, targetName);

        if (targetType === "Array") {
          return {
            suggestions: [
              {
                label: "length",
                kind: CompletionItemKind.Field,
                insertText: "length",
                detail: "final int length",
                documentation: "Количество элементов в массиве (свойство массива, пишется без скобок).",
                range,
                sortText: "0_00",
              },
              {
                label: "clone()",
                kind: CompletionItemKind.Method,
                insertText: "clone()",
                detail: "T[] clone()",
                documentation: "Создаёт поверхностную копию массива.",
                range,
                sortText: "0_01",
              },
            ],
          };
        }

        if (targetType === "IntegerClass") {
          return {
            suggestions: [
              {
                label: "parseInt(s)",
                kind: CompletionItemKind.Method,
                insertText: "parseInt(${1:str})",
                insertTextRules: InsertAsSnippet,
                detail: "static int parseInt(String s)",
                documentation: "Преобразует строку в целое число int.",
                range,
                sortText: "0_00",
              },
              {
                label: "MAX_VALUE",
                kind: CompletionItemKind.Constant,
                insertText: "MAX_VALUE",
                detail: "static final int MAX_VALUE = 2147483647",
                documentation: "Максимальное значение типа int (2^31 - 1).",
                range,
                sortText: "0_01",
              },
              {
                label: "MIN_VALUE",
                kind: CompletionItemKind.Constant,
                insertText: "MIN_VALUE",
                detail: "static final int MIN_VALUE = -2147483648",
                documentation: "Минимальное значение типа int (-2^31).",
                range,
                sortText: "0_02",
              },
              {
                label: "toString(i)",
                kind: CompletionItemKind.Method,
                insertText: "toString(${1:num})",
                insertTextRules: InsertAsSnippet,
                detail: "static String toString(int i)",
                documentation: "Преобразует число int в строку.",
                range,
                sortText: "0_03",
              },
            ],
          };
        }

        if (targetType === "DoubleClass") {
          return {
            suggestions: [
              {
                label: "parseDouble(s)",
                kind: CompletionItemKind.Method,
                insertText: "parseDouble(${1:str})",
                insertTextRules: InsertAsSnippet,
                detail: "static double parseDouble(String s)",
                documentation: "Преобразует строку в вещественное число double.",
                range,
                sortText: "0_00",
              },
              {
                label: "isNaN(v)",
                kind: CompletionItemKind.Method,
                insertText: "isNaN(${1:val})",
                insertTextRules: InsertAsSnippet,
                detail: "static boolean isNaN(double v)",
                documentation: "Проверяет, является ли значение NaN (Not-a-Number).",
                range,
                sortText: "0_01",
              },
            ],
          };
        }

        if (targetType === "CharacterClass") {
          return {
            suggestions: [
              {
                label: "isDigit(ch)",
                kind: CompletionItemKind.Method,
                insertText: "isDigit(${1:ch})",
                insertTextRules: InsertAsSnippet,
                detail: "static boolean isDigit(char ch)",
                documentation: "Проверяет, является ли символ цифрой.",
                range,
                sortText: "0_00",
              },
              {
                label: "isLetter(ch)",
                kind: CompletionItemKind.Method,
                insertText: "isLetter(${1:ch})",
                insertTextRules: InsertAsSnippet,
                detail: "static boolean isLetter(char ch)",
                documentation: "Проверяет, является ли символ буквой.",
                range,
                sortText: "0_01",
              },
              {
                label: "toLowerCase(ch)",
                kind: CompletionItemKind.Method,
                insertText: "toLowerCase(${1:ch})",
                insertTextRules: InsertAsSnippet,
                detail: "static char toLowerCase(char ch)",
                documentation: "Переводит символ в нижний регистр.",
                range,
                sortText: "0_02",
              },
              {
                label: "toUpperCase(ch)",
                kind: CompletionItemKind.Method,
                insertText: "toUpperCase(${1:ch})",
                insertTextRules: InsertAsSnippet,
                detail: "static char toUpperCase(char ch)",
                documentation: "Переводит символ в верхний регистр.",
                range,
                sortText: "0_03",
              },
            ],
          };
        }

        let methodList: MethodDef[] = [];

        if (targetType === "Scanner") {
          methodList = SCANNER_METHODS;
        } else if (targetType === "PrintStream") {
          methodList = PRINT_STREAM_METHODS;
        } else if (targetType === "String") {
          methodList = STRING_METHODS;
        } else if (targetType === "Math") {
          methodList = MATH_METHODS;
        } else if (targetType === "Arrays") {
          methodList = ARRAYS_METHODS;
        } else if (targetType === "Collections") {
          methodList = COLLECTIONS_METHODS;
        } else if (targetType === "List" || targetType === "Set") {
          methodList = LIST_METHODS;
        } else if (targetType === "Map") {
          methodList = MAP_METHODS;
        } else if (targetType === "StringBuilder") {
          methodList = STRING_BUILDER_METHODS;
        } else {
          // Fallback when type is generic or unknown: provide union of Scanner + String + common methods!
          methodList = [
            ...SCANNER_METHODS.slice(0, 4),
            ...STRING_METHODS.slice(0, 6),
            ...LIST_METHODS.slice(0, 4),
            {
              name: "toString()",
              signature: "String toString()",
              insertText: "toString()",
              doc: "Возвращает строковое представление объекта.",
            },
            {
              name: "equals(obj)",
              signature: "boolean equals(Object obj)",
              insertText: "equals(${1:other})",
              doc: "Сравнивает два объекта на логическое равенство.",
            },
          ];
        }

        return {
          suggestions: methodList.map((m, idx) => ({
            label: m.name,
            kind: CompletionItemKind.Method,
            insertText: m.insertText,
            insertTextRules: InsertAsSnippet,
            detail: m.signature,
            documentation: m.doc,
            range,
            sortText: `0_${String(idx).padStart(2, "0")}`,
          })),
        };
      }

      // Avoid auto-popping suggestions when the user just typed a space after a type/modifier to name a new variable
      if (
        word.word === "" &&
        /\b(?:byte|short|int|long|float|double|boolean|char|var|void|String|Scanner|class|interface|enum|record|public|private|protected|static|final)\s+$/.test(
          lineUntilPos
        )
      ) {
        return { suggestions: [] };
      }

      // Extract user-defined variables, constants, parameters, methods, and classes from current code
      const extractedSymbols = extractCodeSymbols(code, position.lineNumber, position.column);
      const userSymbolSuggestions = extractedSymbols.map((sym, idx) => {
        const priorityPrefix = `00_${String(idx).padStart(3, "0")}_${sym.name}`;

        if (sym.kind === "method") {
          return {
            label: sym.signature ? `${sym.name}(...)` : `${sym.name}()`,
            filterText: sym.name,
            kind: CompletionItemKind.Method,
            insertText: sym.insertText || `${sym.name}()`,
            ...(sym.isSnippet ? { insertTextRules: InsertAsSnippet } : {}),
            detail: sym.signature || `${sym.type} ${sym.name}()`,
            documentation: sym.doc,
            sortText: priorityPrefix,
            range,
          };
        }

        if (sym.kind === "class") {
          return {
            label: sym.name,
            kind: CompletionItemKind.Class,
            insertText: sym.name,
            detail: `${sym.type} ${sym.name}`,
            documentation: sym.doc,
            sortText: priorityPrefix,
            range,
          };
        }

        if (sym.kind === "constant") {
          return {
            label: sym.name,
            kind: CompletionItemKind.Constant,
            insertText: sym.name,
            detail: sym.value ? `final ${sym.type} = ${sym.value}` : `final ${sym.type}`,
            documentation: sym.doc,
            sortText: priorityPrefix,
            range,
          };
        }

        if (sym.kind === "parameter") {
          return {
            label: sym.name,
            kind: CompletionItemKind.Variable,
            insertText: sym.name,
            detail: `${sym.type} ${sym.name} (параметр)`,
            documentation: sym.doc,
            sortText: priorityPrefix,
            range,
          };
        }

        return {
          label: sym.name,
          kind: CompletionItemKind.Variable,
          insertText: sym.name,
          detail: sym.value ? `${sym.type} = ${sym.value}` : sym.type,
          documentation: sym.doc,
          sortText: priorityPrefix,
          range,
        };
      });

      // CASE B: Top-level expressions, IntelliJ Live Templates & keywords
      const templates: any[] = [
        // IntelliJ Live Templates
        {
          label: "sout",
          kind: CompletionItemKind.Snippet,
          insertText: "System.out.println(${1});",
          insertTextRules: InsertAsSnippet,
          detail: "System.out.println() (IntelliJ template)",
          documentation: "Вставляет System.out.println() с курсором внутри скобок.",
          sortText: "0_01",
          range,
        },
        {
          label: "souf",
          kind: CompletionItemKind.Snippet,
          insertText: 'System.out.printf("${1:%s}\\n", ${2});',
          insertTextRules: InsertAsSnippet,
          detail: "System.out.printf() (IntelliJ template)",
          documentation: "Вставляет форматированный вывод в консоль.",
          sortText: "0_02",
          range,
        },
        {
          label: "psvm",
          kind: CompletionItemKind.Snippet,
          insertText: "public static void main(String[] args) {\n    ${1}\n}",
          insertTextRules: InsertAsSnippet,
          detail: "public static void main(String[] args)",
          documentation: "Шаблон главной точки входа в Java-программу.",
          sortText: "0_03",
          range,
        },
        {
          label: "main",
          kind: CompletionItemKind.Snippet,
          insertText: "public static void main(String[] args) {\n    ${1}\n}",
          insertTextRules: InsertAsSnippet,
          detail: "public static void main(String[] args)",
          documentation: "Шаблон главной точки входа в Java-программу.",
          sortText: "0_04",
          range,
        },
        {
          label: "scanner",
          kind: CompletionItemKind.Snippet,
          insertText: "Scanner scanner = new Scanner(System.in);",
          insertTextRules: InsertAsSnippet,
          detail: "Scanner scanner = new Scanner(System.in);",
          documentation: "Создает объект Scanner для чтения из консоли (System.in).",
          sortText: "0_05",
          range,
        },
        {
          label: "fori",
          kind: CompletionItemKind.Snippet,
          insertText: "for (int ${1:i} = 0; ${1:i} < ${2:10}; ${1:i}++) {\n    ${3}\n}",
          insertTextRules: InsertAsSnippet,
          detail: "for (int i = 0; i < n; i++) (IntelliJ template)",
          documentation: "Классический цикл for с индексной переменной.",
          sortText: "0_06",
          range,
        },
        {
          label: "iter",
          kind: CompletionItemKind.Snippet,
          insertText: "for (${1:String} ${2:item} : ${3:collection}) {\n    ${4}\n}",
          insertTextRules: InsertAsSnippet,
          detail: "for (Type item : collection) (IntelliJ template)",
          documentation: "Цикл for-each для перебора элементов массива или коллекции.",
          sortText: "0_07",
          range,
        },
        {
          label: "while",
          kind: CompletionItemKind.Snippet,
          insertText: "while (${1:condition}) {\n    ${2}\n}",
          insertTextRules: InsertAsSnippet,
          detail: "while (condition) { ... }",
          documentation: "Цикл с предусловием.",
          sortText: "0_08",
          range,
        },
        {
          label: "ifelse",
          kind: CompletionItemKind.Snippet,
          insertText: "if (${1:condition}) {\n    ${2}\n} else {\n    ${3}\n}",
          insertTextRules: InsertAsSnippet,
          detail: "if (...) { } else { }",
          documentation: "Условная конструкция if-else.",
          sortText: "0_09",
          range,
        },
        {
          label: "trycatch",
          kind: CompletionItemKind.Snippet,
          insertText: "try {\n    ${1}\n} catch (${2:Exception} e) {\n    ${3:e.printStackTrace();}\n}",
          insertTextRules: InsertAsSnippet,
          detail: "try { ... } catch (...) { }",
          documentation: "Блок обработки исключений try-catch.",
          sortText: "0_10",
          range,
        },

        // Classes & Standard Types
        {
          label: "Scanner",
          kind: CompletionItemKind.Class,
          insertText: "Scanner",
          detail: "java.util.Scanner",
          documentation: "Класс для парсинга и считывания примитивов и строк из потоков ввода.",
          sortText: "1_01",
          range,
        },
        {
          label: "String",
          kind: CompletionItemKind.Class,
          insertText: "String",
          detail: "java.lang.String",
          documentation: "Неизменяемый класс символьных строк в Java.",
          sortText: "1_02",
          range,
        },
        {
          label: "System",
          kind: CompletionItemKind.Class,
          insertText: "System",
          detail: "java.lang.System",
          documentation: "Системный класс со стандартными потоками in, out, err и утилитами.",
          sortText: "1_03",
          range,
        },
        {
          label: "Math",
          kind: CompletionItemKind.Class,
          insertText: "Math",
          detail: "java.lang.Math",
          documentation: "Математические функции (max, min, pow, sqrt, abs, random).",
          sortText: "1_04",
          range,
        },
        {
          label: "ArrayList",
          kind: CompletionItemKind.Snippet,
          insertText: "List<${1:String}> ${2:list} = new ArrayList<>();",
          insertTextRules: InsertAsSnippet,
          detail: "List<T> list = new ArrayList<>()",
          documentation: "Создание динамического массива ArrayList.",
          sortText: "1_05",
          range,
        },
        {
          label: "HashMap",
          kind: CompletionItemKind.Snippet,
          insertText: "Map<${1:String}, ${2:Integer}> ${3:map} = new HashMap<>();",
          insertTextRules: InsertAsSnippet,
          detail: "Map<K, V> map = new HashMap<>()",
          documentation: "Создание ассоциативного массива HashMap.",
          sortText: "1_06",
          range,
        },
        {
          label: "HashSet",
          kind: CompletionItemKind.Snippet,
          insertText: "Set<${1:String}> ${2:set} = new HashSet<>();",
          insertTextRules: InsertAsSnippet,
          detail: "Set<T> set = new HashSet<>()",
          documentation: "Создание множества уникальных элементов HashSet.",
          sortText: "1_07",
          range,
        },
        {
          label: "Arrays",
          kind: CompletionItemKind.Class,
          insertText: "Arrays",
          detail: "java.util.Arrays",
          documentation: "Утилиты для массивов (toString, sort, binarySearch, copyOf).",
          sortText: "1_08",
          range,
        },
        {
          label: "Collections",
          kind: CompletionItemKind.Class,
          insertText: "Collections",
          detail: "java.util.Collections",
          documentation: "Статические методы для работы с коллекциями (sort, reverse, max, min).",
          sortText: "1_09",
          range,
        },

        // Java Keywords & Primitives
        { label: "int", kind: CompletionItemKind.Keyword, insertText: "int", detail: "32-bit signed integer", sortText: "2_01", range },
        { label: "double", kind: CompletionItemKind.Keyword, insertText: "double", detail: "64-bit IEEE 754 floating point", sortText: "2_02", range },
        { label: "boolean", kind: CompletionItemKind.Keyword, insertText: "boolean", detail: "true or false", sortText: "2_03", range },
        { label: "char", kind: CompletionItemKind.Keyword, insertText: "char", detail: "16-bit Unicode character", sortText: "2_04", range },
        { label: "long", kind: CompletionItemKind.Keyword, insertText: "long", detail: "64-bit signed integer", sortText: "2_05", range },
        { label: "float", kind: CompletionItemKind.Keyword, insertText: "float", detail: "32-bit floating point", sortText: "2_06", range },
        { label: "byte", kind: CompletionItemKind.Keyword, insertText: "byte", detail: "8-bit signed integer", sortText: "2_07", range },
        { label: "short", kind: CompletionItemKind.Keyword, insertText: "short", detail: "16-bit signed integer", sortText: "2_08", range },
        { label: "void", kind: CompletionItemKind.Keyword, insertText: "void", detail: "Specifies that method does not return a value", sortText: "2_09", range },
        { label: "public", kind: CompletionItemKind.Keyword, insertText: "public ", detail: "Access modifier", sortText: "2_10", range },
        { label: "private", kind: CompletionItemKind.Keyword, insertText: "private ", detail: "Access modifier", sortText: "2_11", range },
        { label: "protected", kind: CompletionItemKind.Keyword, insertText: "protected ", detail: "Access modifier", sortText: "2_12", range },
        { label: "static", kind: CompletionItemKind.Keyword, insertText: "static ", detail: "Belongs to the class, not instances", sortText: "2_13", range },
        { label: "final", kind: CompletionItemKind.Keyword, insertText: "final ", detail: "Cannot be modified or inherited", sortText: "2_14", range },
        { label: "class", kind: CompletionItemKind.Keyword, insertText: "class ", detail: "Class declaration", sortText: "2_15", range },
        { label: "return", kind: CompletionItemKind.Keyword, insertText: "return ", detail: "Return from method", sortText: "2_16", range },
        { label: "new", kind: CompletionItemKind.Keyword, insertText: "new ", detail: "Instantiates an object", sortText: "2_17", range },
        { label: "true", kind: CompletionItemKind.Keyword, insertText: "true", detail: "boolean literal", sortText: "2_18", range },
        { label: "false", kind: CompletionItemKind.Keyword, insertText: "false", detail: "boolean literal", sortText: "2_19", range },
        { label: "null", kind: CompletionItemKind.Keyword, insertText: "null", detail: "null reference", sortText: "2_20", range },
        { label: "import java.util.Scanner;", kind: CompletionItemKind.Snippet, insertText: "import java.util.Scanner;\n", detail: "Import Scanner", sortText: "2_21", range },
      ];

      return { suggestions: [...userSymbolSuggestions, ...templates] };
    },
  });

  // 2. Hover Provider (Documentation Tooltips)
  monaco.languages.registerHoverProvider("java", {
    provideHover: (model: any, position: any) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const w = word.word;

      // Check user-declared symbols first so hovering over any variable/method shows its type and value
      const symbols = extractCodeSymbols(model.getValue(), Number.MAX_SAFE_INTEGER, 1);
      const userSym = symbols.find((s) => s.name === w);
      if (userSym) {
        const title =
          userSym.kind === "method"
            ? userSym.signature || `${userSym.type} ${userSym.name}()`
            : userSym.kind === "constant"
            ? `final ${userSym.type} ${userSym.name}${userSym.value ? ` = ${userSym.value}` : ""}`
            : `${userSym.type} ${userSym.name}${userSym.value ? ` = ${userSym.value}` : ""}`;
        return {
          range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
          contents: [
            { value: "```java\n" + title + "\n```" },
            { value: userSym.doc || `Объявлено на строке ${userSym.line}` },
          ],
        };
      }

      const hoverDocs: Record<string, { title: string; desc: string }> = {
        Scanner: {
          title: "java.util.Scanner",
          desc: "Универсальный класс для синтаксического анализа и считывания примитивов и строк из входного потока (например, `System.in`).",
        },
        nextLine: {
          title: "String Scanner.nextLine()",
          desc: "Считывает всю текущую строку до перевода строки (`\\n`).",
        },
        nextInt: {
          title: "int Scanner.nextInt()",
          desc: "Считывает следующее целое 32-битное число.",
        },
        nextDouble: {
          title: "double Scanner.nextDouble()",
          desc: "Считывает следующее число с плавающей точкой двойной точности.",
        },
        println: {
          title: "void System.out.println(Object x)",
          desc: "Выводит строковое представление объекта в стандартный вывод с переводом строки в конце.",
        },
        print: {
          title: "void System.out.print(Object x)",
          desc: "Выводит строковое представление объекта в стандартный вывод без переноса строки.",
        },
        printf: {
          title: "PrintStream printf(String format, Object... args)",
          desc: "Форматированный вывод по шаблону (например `%s` для строк, `%d` для чисел, `%.2f` для дробей).",
        },
        Math: {
          title: "java.lang.Math",
          desc: "Класс со статическими математическими функциями (`max`, `min`, `abs`, `pow`, `sqrt`, `round`).",
        },
        String: {
          title: "java.lang.String",
          desc: "Неизменяемый класс строк в Java. Строки хранятся в String Pool и сравниваются методом `.equals()`.",
        },
        length: {
          title: "int length() / int length",
          desc: "Для строк `str.length()` возвращает длину в символах. Для массивов `arr.length` — количество элементов.",
        },
        charAt: {
          title: "char charAt(int index)",
          desc: "Возвращает символ строки по указанному индексу (начиная с 0).",
        },
        equals: {
          title: "boolean equals(Object anObject)",
          desc: "Сравнивает два объекта по значению (содержимому), в отличие от `==`, который сравнивает ссылки в памяти.",
        },
      };

      const doc = hoverDocs[w];
      if (!doc) return null;

      return {
        range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
        contents: [
          { value: `**${doc.title}**` },
          { value: doc.desc },
        ],
      };
    },
  });
}
