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

  // Scan code for variable declaration: `Type varName` or `Type<...> varName`
  const esc = targetName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
        } else if (targetType === "List") {
          methodList = LIST_METHODS;
        } else if (targetType === "Map") {
          methodList = MAP_METHODS;
        } else if (targetType === "StringBuilder") {
          methodList = STRING_BUILDER_METHODS;
        } else {
          // Fallback when type is generic or unknown: provide union of Scanner + String + common methods!
          // This guarantees that typing `scanner.` or `str.` or `x.` ALWAYS offers the most helpful methods!
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
        { label: "int", kind: CompletionItemKind.Keyword, insertText: "int", detail: "32-bit signed integer", range },
        { label: "double", kind: CompletionItemKind.Keyword, insertText: "double", detail: "64-bit IEEE 754 floating point", range },
        { label: "boolean", kind: CompletionItemKind.Keyword, insertText: "boolean", detail: "true or false", range },
        { label: "char", kind: CompletionItemKind.Keyword, insertText: "char", detail: "16-bit Unicode character", range },
        { label: "long", kind: CompletionItemKind.Keyword, insertText: "long", detail: "64-bit signed integer", range },
        { label: "float", kind: CompletionItemKind.Keyword, insertText: "float", detail: "32-bit floating point", range },
        { label: "void", kind: CompletionItemKind.Keyword, insertText: "void", detail: "Specifies that method does not return a value", range },
        { label: "public", kind: CompletionItemKind.Keyword, insertText: "public ", detail: "Access modifier", range },
        { label: "private", kind: CompletionItemKind.Keyword, insertText: "private ", detail: "Access modifier", range },
        { label: "protected", kind: CompletionItemKind.Keyword, insertText: "protected ", detail: "Access modifier", range },
        { label: "static", kind: CompletionItemKind.Keyword, insertText: "static ", detail: "Belongs to the class, not instances", range },
        { label: "final", kind: CompletionItemKind.Keyword, insertText: "final ", detail: "Cannot be modified or inherited", range },
        { label: "class", kind: CompletionItemKind.Keyword, insertText: "class ", detail: "Class declaration", range },
        { label: "return", kind: CompletionItemKind.Keyword, insertText: "return ", detail: "Return from method", range },
        { label: "new", kind: CompletionItemKind.Keyword, insertText: "new ", detail: "Instantiates an object", range },
        { label: "import java.util.Scanner;", kind: CompletionItemKind.Snippet, insertText: "import java.util.Scanner;\n", detail: "Import Scanner", range },
      ];

      return { suggestions: templates };
    },
  });

  // 2. Hover Provider (Documentation Tooltips)
  monaco.languages.registerHoverProvider("java", {
    provideHover: (model: any, position: any) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const w = word.word;
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
          title: "int length()",
          desc: "Возвращает длину строки в символах.",
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
