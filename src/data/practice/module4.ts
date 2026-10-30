import type { PracticeTask } from "./types";

export const module4PracticeTasks: PracticeTask[] = [
  {
    id: "pr_m4_overload_calc",
    moduleId: 4,
    moduleName: "Модуль 4: Методы и рекурсия",
    topic: "Перегрузка методов (Overloading)",
    title: "Калькулятор доставки с перегрузкой методов",
    difficulty: "Лёгкий",
    xp: 25,
    description: `В логистическом сервисе стоимость доставки рассчитывается по разным правилам в зависимости от переданных данных.

Реализуй три перегруженные версии статического метода \`calculateShipping\`:
1. \`calculateShipping(double weight)\`
   - Базовая доставка в пределах города: вес * 50 руб (но не менее 200 руб).
2. \`calculateShipping(double weight, int distanceKm)\`
   - Междугородняя доставка: базовая доставка по весу + (расстояние * 10 руб).
3. \`calculateShipping(double weight, int distanceKm, boolean isExpress)\`
   - Экспресс-доставка: если isExpress == true, итоговая сумма увеличивается в 1.5 раза (умножение на 1.5).

В main():
Считай: вес (double), расстояние (int), экспресс-флаг (boolean).
Вызови все три версии метода и выведи результаты.

Формат вывода:
\`\`\`text
По городу: [цена1] руб
Межгород ([distance] км): [цена2] руб
Экспресс: [цена3] руб
\`\`\``,
    exampleInput: "3.5\n40\ntrue",
    exampleOutput: "По городу: 200.0 руб\nМежгород (40 км): 600.0 руб\nЭкспресс: 900.0 руб",
    starterCode: `import java.util.Scanner;

public class Main {
    // TODO: объяви 3 перегруженных метода calculateShipping
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double weight = scanner.nextDouble();
        int distance = scanner.nextInt();
        boolean express = scanner.nextBoolean();
        
        // TODO: вызови методы и выведи результаты
        
    }
}`,
    theory: {
      title: "Перегрузка методов (Method Overloading)",
      summary: "Методы с одинаковым именем, но разным списком параметров.",
      keyPoints: [
        "Перегрузка определяется сигнатурой: имя метода + типы и порядок параметров.",
        "Тип возвращаемого значения не участвует в разрешении перегрузки.",
        "Перегруженные методы могут вызывать друг друга для повторного использования логики."
      ],
      codeExample: `public static double calculateShipping(double weight) {
    return Math.max(200.0, weight * 50.0);
}
public static double calculateShipping(double weight, int distance) {
    return calculateShipping(weight) + (distance * 10.0);
}
public static double calculateShipping(double weight, int distance, boolean express) {
    double base = calculateShipping(weight, distance);
    return express ? base * 1.5 : base;
}`,
      pitfalls: [
        "Не дублируй логику: более сложная версия метода должна вызывать более простую версию."
      ]
    },
    tests: [
      {
        label: "Вес 3.5 кг, Расстояние 40 км, Экспресс true",
        stdin: "3.5\n40\ntrue\n",
        expected: ["По городу: 200", "Межгород (40 км): 600", "Экспресс: 900"]
      },
      {
        label: "Вес 10.0 кг, Расстояние 100 км, Экспресс false",
        stdin: "10.0\n100\nfalse\n",
        expected: ["По городу: 500", "Межгород (100 км): 1500", "Экспресс: 1500"]
      }
    ],
    hints: [
      "Базовая цена: `Math.max(200.0, weight * 50.0)`.",
      "Вторая версия: `calculateShipping(weight) + distance * 10.0`."
    ]
  },
  {
    id: "pr_m4_recursive_factorial",
    moduleId: 4,
    moduleName: "Модуль 4: Методы и рекурсия",
    topic: "Рекурсия и базовый случай (Base Case)",
    title: "Рекурсивный факториал и числа Фибоначчи",
    difficulty: "Средний",
    xp: 30,
    description: `Рекурсия — это вызов методом самого себя для решения меньшей подзадачи.
Каждый рекурсивный метод обязан иметь базовый случай (base case) для остановки, иначе возникнет \`StackOverflowError\`.

Напиши два статических рекурсивных метода:
1. \`public static long factorial(int n)\`:
   - Базовый случай: если n <= 1, вернуть 1.
   - Рекурсивный шаг: \`n * factorial(n - 1)\`.
2. \`public static long fibonacci(int n)\`:
   - Базовый случай: если n == 0, вернуть 0; если n == 1, вернуть 1.
   - Рекурсивный шаг: \`fibonacci(n - 1) + fibonacci(n - 2)\`.

В main() считывается число N (от 0 до 15).
Выведи факториал N и N-е число Фибоначчи.

Формат вывода:
\`\`\`text
N: [n]
Факториал: [результат]
Фибоначчи: [результат]
\`\`\``,
    exampleInput: "6",
    exampleOutput: "N: 6\nФакториал: 720\nФибоначчи: 8",
    starterCode: `import java.util.Scanner;

public class Main {
    // TODO: напиши рекурсивные методы factorial и fibonacci
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        
        // TODO: вызови методы и выведи ответ
        
    }
}`,
    theory: {
      title: "Анатомия рекурсивного метода",
      summary: "Базовый случай и рекурсивный спуск.",
      keyPoints: [
        "Базовый случай проверяется в самом начале метода (if (n <= 1) return ...).",
        "Факториал быстро растёт, поэтому возвращаемый тип должен быть long.",
        "Числа Фибоначчи: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34..."
      ],
      codeExample: `public static long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

public static long fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
      pitfalls: [
        "Если забыть базовый случай, программа упадет с java.lang.StackOverflowError из-за переполнения стека вызовов!"
      ]
    },
    tests: [
      {
        label: "N = 6 (Факториал 720, Фибоначчи 8)",
        stdin: "6\n",
        expected: ["N: 6", "Факториал: 720", "Фибоначчи: 8"]
      },
      {
        label: "N = 10 (Факториал 3628800, Фибоначчи 55)",
        stdin: "10\n",
        expected: ["Факториал: 3628800", "Фибоначчи: 55"]
      },
      {
        label: "N = 0 (Крайний случай)",
        stdin: "0\n",
        expected: ["Факториал: 1", "Фибоначчи: 0"]
      }
    ],
    hints: [
      "Базовый случай факториала для 0 и 1 возвращает 1.",
      "Для Фибоначчи при n == 0 возвращай 0, при n == 1 возвращай 1."
    ]
  },
  {
    id: "pr_m4_string_compress",
    moduleId: 4,
    moduleName: "Модуль 4: Методы и рекурсия",
    topic: "Декомпозиция на методы и алгоритмы сжатия",
    title: "Сжатие строки алгоритмом RLE (Run-Length Encoding)",
    difficulty: "Средний",
    xp: 35,
    description: `Алгоритм RLE (Run-Length Encoding) сжимает повторяющиеся подряд символы, заменяя их на символ и количество повторений (например, \`"aaabbcaaa"\` -> \`"a3b2c1a3"\`).

Реализуй статический метод \`public static String compressRLE(String text)\`:
- Метод проходит по строке и подсчитывает подряд идущие одинаковые символы.
- Когда символ меняется (или строка закончилась), дописывает символ и счетчик в \`StringBuilder\`.
- Если строка пустая, возвращает пустую строку \`""\`.

В main(): считай строку, вызови метод \`compressRLE\` и выведи коэффициент сжатия (отношение длины сжатой строки к исходной в процентах).

Формат вывода:
\`\`\`text
Исходная строка: [текст]
Сжатая RLE: [результат]
Длина до: [len1]
Длина после: [len2]
\`\`\``,
    exampleInput: "aaabbcaaa",
    exampleOutput: "Исходная строка: aaabbcaaa\nСжатая RLE: a3b2c1a3\nДлина до: 9\nДлина после: 8",
    starterCode: `import java.util.Scanner;

public class Main {
    // TODO: реализуй статический метод compressRLE
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        
        // TODO: вызови метод и выведи результат
        
    }
}`,
    theory: {
      title: "Алгоритм Run-Length Encoding",
      summary: "Базовый алгоритм сжатия данных без потерь.",
      keyPoints: [
        "Используй счетчик int count = 1;",
        "Сравнивай текущий символ с следующим: text.charAt(i) == text.charAt(i + 1);",
        "Используй StringBuilder для эффективного склеивания сжатой строки."
      ],
      codeExample: `public static String compressRLE(String text) {
    if (text == null || text.isEmpty()) return "";
    StringBuilder sb = new StringBuilder();
    int count = 1;
    for (int i = 0; i < text.length(); i++) {
        if (i + 1 < text.length() && text.charAt(i) == text.charAt(i + 1)) {
            count++;
        } else {
            sb.append(text.charAt(i)).append(count);
            count = 1;
        }
    }
    return sb.toString();
}`,
      pitfalls: [
        "Не выходи за границы массива: условие i + 1 < text.length() обязательно должно стоять перед проверкой charAt(i + 1)."
      ]
    },
    tests: [
      {
        label: "Строка aaabbcaaa",
        stdin: "aaabbcaaa\n",
        expected: ["Исходная строка: aaabbcaaa", "Сжатая RLE: a3b2c1a3", "Длина до: 9", "Длина после: 8"]
      },
      {
        label: "Строка aaaaa",
        stdin: "aaaaa\n",
        expected: ["Сжатая RLE: a5", "Длина до: 5", "Длина после: 2"]
      }
    ],
    hints: [
      "Проверяй `i + 1 < text.length()` и равенство соседних символов.",
      "В конце серии символов сбрасывай `count = 1`."
    ]
  },
  {
    id: "pr_m4_binary_search",
    moduleId: 4,
    moduleName: "Модуль 4: Методы и рекурсия",
    topic: "Алгоритмы: бинарный поиск (Binary Search)",
    title: "Бинарный поиск элемента в отсортированном массиве",
    difficulty: "Средний",
    xp: 35,
    description: `Бинарный поиск находит позицию искомого элемента за время O(log N), деля область поиска пополам на каждом шаге.

Реализуй метод:
\`public static int binarySearch(int[] arr, int target)\`
- Возвращает индекс найденного элемента (0..N-1).
- Если элемент отсутствует в массиве, возвращает -1.
- Метод также подсчитывает количество совершенных итераций (шагов деления пополам).

Входные данные:
1. Размер отсортированного массива N
2. N целых чисел
3. Искомое число target

Формат вывода:
\`\`\`text
Массив: [элементы]
Искомое число: [target]
Индекс: [индекс или -1]
Найдено: [true/false]
\`\`\``,
    exampleInput: "7\n2 5 8 12 16 23 38\n16",
    exampleOutput: "Массив: [2, 5, 8, 12, 16, 23, 38]\nИскомое число: 16\nИндекс: 4\nНайдено: true",
    starterCode: `import java.util.Scanner;
import java.util.Arrays;

public class Main {
    // TODO: реализуй статический метод binarySearch
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        int target = scanner.nextInt();
        
        // TODO: вызови binarySearch и выведи результат
        
    }
}`,
    theory: {
      title: "Алгоритм бинарного поиска",
      summary: "Как делить отрезок поиска пополам.",
      keyPoints: [
        "Массив ОБЯЗАН быть отсортирован.",
        "Указатели: int low = 0, high = arr.length - 1;",
        "Средний индекс: int mid = low + (high - low) / 2; (защита от переполнения int).",
        "Если arr[mid] == target, вернуть mid; если arr[mid] < target, low = mid + 1; иначе high = mid - 1."
      ],
      codeExample: `public static int binarySearch(int[] arr, int target) {
    int low = 0;
    int high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      pitfalls: [
        "Не пиши `(low + high) / 2`, так как при больших индексах сумма может переполниться в отрицательное число. Пиши `low + (high - low) / 2`."
      ]
    },
    tests: [
      {
        label: "Поиск 16 в [2, 5, 8, 12, 16, 23, 38]",
        stdin: "7\n2 5 8 12 16 23 38\n16\n",
        expected: ["Искомое число: 16", "Индекс: 4", "Найдено: true"]
      },
      {
        label: "Поиск отсутствующего числа 10",
        stdin: "5\n1 3 5 7 9\n10\n",
        expected: ["Искомое число: 10", "Индекс: -1", "Найдено: false"]
      }
    ],
    hints: [
      "Используй цикл `while (low <= high)`.",
      "Если элемент найден, верни его индекс, иначе после цикла верни -1."
    ]
  },
  {
    id: "pr_m4_recursive_power",
    moduleId: 4,
    moduleName: "Модуль 4: Методы и рекурсия",
    topic: "Быстрое возведение в степень (Binary Exponentiation)",
    title: "Быстрое возведение числа в степень за O(log P)",
    difficulty: "Средний",
    xp: 35,
    description: `Обычное возведение в степень через цикл требует P умножений. Алгоритм быстрого возведения в степень (Fast Pow) сокращает число умножений до логарифма:
- Если power == 0 -> 1.
- Если power четное -> \`fastPow(base * base, power / 2)\`.
- Если power нечетное -> \`base * fastPow(base, power - 1)\`.

Реализуй статический метод:
\`public static long fastPow(long base, int power)\`

Программа считывает base и power (power >= 0).
Вычисляет степень быстрым методом и выводит результат.

Формат вывода:
\`\`\`text
Основание: [base]
Степень: [power]
Результат: [значение]
\`\`\``,
    exampleInput: "2 10",
    exampleOutput: "Основание: 2\nСтепень: 10\nРезультат: 1024",
    starterCode: `import java.util.Scanner;

public class Main {
    // TODO: реализуй рекурсивный fastPow
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long base = scanner.nextLong();
        int power = scanner.nextInt();
        
        // TODO: вызови fastPow и выведи результат
        
    }
}`,
    theory: {
      title: "Быстрое возведение в степень",
      summary: "Основа современной криптографии (RSA, Diffie-Hellman).",
      keyPoints: [
        "Четная степень: a^8 = (a^2)^4 = (a^4)^2. Всего 3 умножения вместо 8!",
        "Базовый случай: if (power == 0) return 1L;",
        "При нечетной степени: return base * fastPow(base, power - 1);"
      ],
      codeExample: `public static long fastPow(long base, int power) {
    if (power == 0) return 1L;
    if (power % 2 == 0) {
        long half = fastPow(base, power / 2);
        return half * half;
    } else {
        return base * fastPow(base, power - 1);
    }
}`,
      pitfalls: [
        "Сохраняй результат `fastPow(base, power / 2)` в переменную half, чтобы не вызывать рекурсию дважды!"
      ]
    },
    tests: [
      {
        label: "2^10 = 1024",
        stdin: "2 10\n",
        expected: ["Основание: 2", "Степень: 10", "Результат: 1024"]
      },
      {
        label: "3^5 = 243",
        stdin: "3 5\n",
        expected: ["Основание: 3", "Степень: 5", "Результат: 243"]
      },
      {
        label: "5^0 = 1",
        stdin: "5 0\n",
        expected: ["Степень: 0", "Результат: 1"]
      }
    ],
    hints: [
      "Если power == 0, возвращай 1.",
      "Для четной степени сохраняй `long half = fastPow(base, power / 2)` и возвращай `half * half`."
    ]
  },
  {
    id: "pr_m4_valid_parentheses",
    moduleId: 4,
    moduleName: "Модуль 4: Методы и рекурсия",
    topic: "Методы валидации и структуры данных",
    title: "Валидатор баланса скобок () и []",
    difficulty: "Средний",
    xp: 35,
    description: `Напиши статический метод проверки корректности расстановки круглых \`()\` и квадратных \`[]\` скобок в выражении.

Метод:
\`public static boolean isValidParentheses(String s)\`

Правила валидности:
1. Каждая открывающая скобка должна закрываться скобкой того же типа.
2. Скобки должны закрываться в правильном порядке (например, \`"([()])"\` валидно, а \`"([)]"\` — нет).
3. Лишние закрывающие или незакрытые открывающие скобки делают строку невалидной.

В main(): считай строку, вызови метод и выведи вердикт.

Формат вывода:
\`\`\`text
Выражение: [строка]
Сбалансировано: [true/false]
\`\`\``,
    exampleInput: "([()])",
    exampleOutput: "Выражение: ([()])\nСбалансировано: true",
    starterCode: `import java.util.Scanner;
import java.util.Stack;

public class Main {
    // TODO: напиши статический метод isValidParentheses
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine().trim();
        
        // TODO: вызови метод и выведи результат
        
    }
}`,
    theory: {
      title: "Стек (Stack) для проверки парных скобок",
      summary: "Классическая задача с использованием принципа LIFO (Last In, First Out).",
      keyPoints: [
        "При встрече открывающей скобки ('(' или '[') помещаем её в стек: stack.push(ch).",
        "При встрече закрывающей скобки проверяем, пуст ли стек (если пуст -> false).",
        "Снимаем верхний элемент ch = stack.pop() и проверяем соответствие пар: '(' с ')' и '[' с ']'.",
        "В конце выражения стек обязан быть пустым: return stack.isEmpty();"
      ],
      codeExample: `public static boolean isValidParentheses(String s) {
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[') {
            stack.push(c);
        } else if (c == ')' || c == ']') {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
        }
    }
    return stack.isEmpty();
}`,
      pitfalls: [
        "Не забудь проверить stack.isEmpty() в самом конце — незакрытая открывающая скобка делает строку невалидной!"
      ]
    },
    tests: [
      {
        label: "Валидное выражение: ([()])",
        stdin: "([()])\n",
        expected: ["Выражение: ([()])", "Сбалансировано: true"]
      },
      {
        label: "Невалидное выражение: ([)]",
        stdin: "([)]\n",
        expected: ["Сбалансировано: false"]
      },
      {
        label: "Лишняя закрывающая: ())",
        stdin: "())\n",
        expected: ["Сбалансировано: false"]
      }
    ],
    hints: [
      "Используй `Stack<Character>`.",
      "Помещай открывающие в стек, при закрывающих доставай и сравнивай тип."
    ]
  },
  {
    id: "pr_m4_caesar_cipher",
    moduleId: 4,
    moduleName: "Модуль 4: Методы и рекурсия",
    topic: "Работа с символами char и остаток по модулю",
    title: "Криптографический шифр Цезаря со сдвигом k",
    difficulty: "Средний",
    xp: 35,
    description: `Шифр Цезаря — древнейший способ симметричного шифрования: каждая буква сдвигается по циклу алфавита на K позиций вправо.

Реализуй метод:
\`public static String caesarCipher(String text, int shift)\`
- Сдвигает строчные английские буквы ('a'..'z') и заглавные ('A'..'Z').
- Сдвиг циклический: после 'z' снова идёт 'a'.
- Формула для строчных: \`(char) ('a' + (ch - 'a' + shift % 26 + 26) % 26)\`.
- Пробелы, цифры и знаки препинания остаются без изменений.

В main(): считай строку текста и целое число сдвига K. Вызови метод и выведи зашифрованный текст.

Формат вывода:
\`\`\`text
Оригинал: [текст]
Сдвиг: [k]
Шифротекст: [зашифрованный_текст]
\`\`\``,
    exampleInput: "Hello World!\n3",
    exampleOutput: "Оригинал: Hello World!\nСдвиг: 3\nШифротекст: Khoor Zruog!",
    starterCode: `import java.util.Scanner;

public class Main {
    // TODO: реализуй статический метод caesarCipher
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text = scanner.nextLine();
        int shift = scanner.nextInt();
        
        // TODO: вызови caesarCipher и выведи результат
        
    }
}`,
    theory: {
      title: "Арифметика символов char и модуль алфавита",
      summary: "В английском алфавите 26 букв. Сдвиг вычисляется по модулю 26.",
      keyPoints: [
        "char в Java — это 16-битное число Unicode. С ним можно выполнять арифметические операции.",
        "Для сохранения регистра отдельно обрабатывай Character.isUpperCase и Character.isLowerCase.",
        "Формула: (ch - 'A' + shift) % 26 + 'A'."
      ],
      codeExample: `public static String caesarCipher(String text, int shift) {
    StringBuilder sb = new StringBuilder();
    for (char c : text.toCharArray()) {
        if (c >= 'a' && c <= 'z') {
            sb.append((char) ('a' + (c - 'a' + shift % 26 + 26) % 26));
        } else if (c >= 'A' && c <= 'Z') {
            sb.append((char) ('A' + (c - 'A' + shift % 26 + 26) % 26));
        } else {
            sb.append(c);
        }
    }
    return sb.toString();
}`,
      pitfalls: [
        "Сдвиг может быть больше 26, поэтому всегда используй остаток от деления `% 26`."
      ]
    },
    tests: [
      {
        label: "Hello World! со сдвигом 3",
        stdin: "Hello World!\n3\n",
        expected: ["Оригинал: Hello World!", "Сдвиг: 3", "Шифротекст: Khoor Zruog!"]
      },
      {
        label: "abc со сдвигом 1",
        stdin: "abc\n1\n",
        expected: ["Шифротекст: bcd"]
      }
    ],
    hints: [
      "Проверяй диапазон `c >= 'a' && c <= 'z'`.",
      "Используй формулу `(char) ('a' + (c - 'a' + shift % 26 + 26) % 26)`."
    ]
  },
  {
    id: "pr_m4_array_stats",
    moduleId: 4,
    moduleName: "Модуль 4: Методы и рекурсия",
    topic: "Чистые методы (Pure Functions) и статистика",
    title: "Статистический агрегатор: среднее и медиана",
    difficulty: "Средний",
    xp: 30,
    description: `Напиши библиотеку чистых статистических функций для анализа массива данных:

1. \`public static double mean(int[] arr)\`:
   - Возвращает среднее арифметическое.
2. \`public static double median(int[] arr)\`:
   - Создает копию массива (\`arr.clone()\`), сортирует ее (\`Arrays.sort(copy)\`).
   - Если количество элементов нечетное, медиана — центральный элемент: \`copy[n / 2]\`.
   - Если четное, медиана — среднее двух центральных: \`(copy[n/2 - 1] + copy[n/2]) / 2.0\`.

В main(): считай размер массива N и N целых чисел. Выведи среднее и медиану.

Формат вывода:
\`\`\`text
Элементов: [n]
Среднее: [значение]
Медиана: [значение]
\`\`\``,
    exampleInput: "5\n7 1 3 4 9",
    exampleOutput: "Элементов: 5\nСреднее: 4.8\nМедиана: 4.0",
    starterCode: `import java.util.Scanner;
import java.util.Arrays;

public class Main {
    // TODO: реализуй статические методы mean и median
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        
        // TODO: вызови методы и выведи статистику
        
    }
}`,
    theory: {
      title: "Чистые методы и неизменяемость аргументов",
      summary: "Метод median не должен изменять порядок элементов в исходном массиве.",
      keyPoints: [
        "Чистая функция (pure function) не производит побочных эффектов.",
        "Для сортировки создавай копию: int[] copy = arr.clone(); Arrays.sort(copy);",
        "Для четной длины медиана рассчитывается как полусумма двух центральных элементов."
      ],
      codeExample: `public static double median(int[] arr) {
    int[] copy = arr.clone();
    Arrays.sort(copy);
    int n = copy.length;
    if (n % 2 != 0) {
        return copy[n / 2];
    } else {
        return (copy[n / 2 - 1] + copy[n / 2]) / 2.0;
    }
}`,
      pitfalls: [
        "При делении на 2.0 обязательно ставь точку, иначе полусумма выполнит целочисленное деление."
      ]
    },
    tests: [
      {
        label: "Нечетный массив [7, 1, 3, 4, 9]",
        stdin: "5\n7 1 3 4 9\n",
        expected: ["Элементов: 5", "Среднее: 4.8", "Медиана: 4.0"]
      },
      {
        label: "Четный массив [10, 20, 30, 40]",
        stdin: "4\n10 20 30 40\n",
        expected: ["Элементов: 4", "Среднее: 25.0", "Медиана: 25.0"]
      }
    ],
    hints: [
      "Копируй массив через `arr.clone()` перед сортировкой.",
      "Для нечетной длины: `copy[n / 2]`, для четной: `(copy[n/2 - 1] + copy[n/2]) / 2.0`."
    ]
  }
];

