import type { PracticeTask } from "./types";

export const module3PracticeTasks: PracticeTask[] = [
  {
    id: "pr_m3_fizzbuzz_pro",
    moduleId: 3,
    moduleName: "Модуль 3: Циклы и массивы",
    topic: "Цикл for и условия делимости",
    title: "FizzBuzzJazz: расширенный классический тест",
    difficulty: "Лёгкий",
    xp: 25,
    description: `Классическая задача FizzBuzz с расширенным правилом для числа 7.

Программа считывает целое число N (от 1 до 50) и в цикле от 1 до N выводит для каждого числа:
- Если число делится на 3 и на 5 и на 7: "FizzBuzzJazz"
- Если делится на 3 и 5: "FizzBuzz"
- Если делится на 3 и 7: "FizzJazz"
- Если делится на 5 и 7: "BuzzJazz"
- Если только на 3: "Fizz"
- Если только на 5: "Buzz"
- Если только на 7: "Jazz"
- Иначе: само число.

Каждый элемент выводится на новой строке.

Формат:
\`\`\`text
1
2
Fizz
4
Buzz
Fizz
Jazz
...
\`\`\``,
    exampleInput: "15",
    exampleOutput: "1\n2\nFizz\n4\nBuzz\nFizz\nJazz\n8\nFizz\nBuzz\n11\nFizz\n13\nJazz\nFizzBuzz",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        
        // TODO: выведи в цикле от 1 до n Fizz/Buzz/Jazz или число
        
    }
}`,
    theory: {
      title: "Паттерн конкатенации в FizzBuzz",
      summary: "Как избежать десятка вложенных if-else с помощью склеивания строк.",
      keyPoints: [
        "Вместо проверки всех комбинаций (3*5*7, 3*5, 3*7...) можно завести пустую строку String res = \"\";",
        "if (i % 3 == 0) res += \"Fizz\";",
        "if (i % 5 == 0) res += \"Buzz\";",
        "if (i % 7 == 0) res += \"Jazz\";",
        "if (res.isEmpty()) System.out.println(i); else System.out.println(res);"
      ],
      codeExample: `for (int i = 1; i <= n; i++) {
    StringBuilder sb = new StringBuilder();
    if (i % 3 == 0) sb.append("Fizz");
    if (i % 5 == 0) sb.append("Buzz");
    if (i % 7 == 0) sb.append("Jazz");
    System.out.println(sb.length() == 0 ? i : sb.toString());
}`,
      pitfalls: [
        "Не забывай проверять число 105 или комбинации 3, 5, 7 в правильном порядке, если используешь классические if-else."
      ]
    },
    tests: [
      {
        label: "N = 7",
        stdin: "7\n",
        expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "Jazz"]
      },
      {
        label: "N = 15",
        stdin: "15\n",
        expected: ["FizzBuzz"]
      }
    ],
    hints: [
      "Красивое решение: заводи пустую строку, добавляй Fizz при делимости на 3, Buzz на 5, Jazz на 7."
    ]
  },
  {
    id: "pr_m3_min_max_diff",
    moduleId: 3,
    moduleName: "Модуль 3: Циклы и массивы",
    topic: "Одномерные массивы и поиск экстремумов",
    title: "Размах массива: разность максимума и минимума",
    difficulty: "Лёгкий",
    xp: 25,
    description: `В статистике размах выборки — это разность между наибольшим и наименьшим значением.

Программа считывает из System.in:
1. Количество элементов массива N (int, N >= 1)
2. N целых чисел (элементы массива)

Программа должна за один проход по массиву найти:
- Минимальный элемент (min)
- Максимальный элемент (max)
- Размах (max - min)
- Среднее арифметическое элементов (double)

Формат вывода:
\`\`\`text
Размер массива: [n]
Минимум: [min]
Максимум: [max]
Размах: [max - min]
Среднее: [среднее]
\`\`\``,
    exampleInput: "5\n12 45 7 23 89",
    exampleOutput: "Размер массива: 5\nМинимум: 7\nМаксимум: 89\nРазмах: 82\nСреднее: 35.2",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        
        // TODO: найди min, max, размах и среднее значение
        
    }
}`,
    theory: {
      title: "Инициализация экстремумов массива",
      summary: "Как правильно задавать начальные значения для поиска минимума и максимума.",
      keyPoints: [
        "Не инициализируй min нулем, если в массиве могут быть положительные числа больше нуля!",
        "Лучший способ: int min = arr[0]; int max = arr[0];",
        "Для среднего значения считай сумму в переменной double sum, чтобы избежать потери точности при делении sum / n."
      ],
      codeExample: `int min = arr[0];
int max = arr[0];
double sum = 0;
for (int x : arr) {
    if (x < min) min = x;
    if (x > max) max = x;
    sum += x;
}
double avg = sum / arr.length;`,
      pitfalls: [
        "Если sum будет целым int, то avg = sum / n выполнит целочисленное деление с отбрасыванием дробной части."
      ]
    },
    tests: [
      {
        label: "Массив [12, 45, 7, 23, 89]",
        stdin: "5\n12 45 7 23 89\n",
        expected: ["Минимум: 7", "Максимум: 89", "Размах: 82", "Среднее: 35.2"]
      },
      {
        label: "Один элемент [42]",
        stdin: "1\n42\n",
        expected: ["Минимум: 42", "Максимум: 42", "Размах: 0", "Среднее: 42"]
      }
    ],
    hints: [
      "Инициализируй `min = arr[0]` и `max = arr[0]`.",
      "Сумму накапливай в `double sum = 0`."
    ]
  },
  {
    id: "pr_m3_array_reverse",
    moduleId: 3,
    moduleName: "Модуль 3: Циклы и массивы",
    topic: "Алгоритмы: два указателя (Two Pointers)",
    title: "Разворот массива на месте (In-Place Reverse)",
    difficulty: "Средний",
    xp: 30,
    description: `На собеседованиях часто требуют развернуть массив без создания второго вспомогательного массива, чтобы не расходовать дополнительную оперативную память (in-place алгоритм с памятью O(1)).

Алгоритм двух указателей:
- Заведи указатель \`left = 0\` и \`right = arr.length - 1\`.
- Пока \`left < right\`, поменяй местами \`arr[left]\` и \`arr[right]\` через временную переменную \`temp\`, затем \`left++\` и \`right--\`.

Входные данные:
1. Число N (размер массива)
2. N целых чисел

Формат вывода:
\`\`\`text
Исходный: [arr[0], arr[1], ...]
Перевернутый: [arr[0], arr[1], ...]
\`\`\``,
    exampleInput: "5\n1 2 3 4 5",
    exampleOutput: "Исходный: [1, 2, 3, 4, 5]\nПеревернутый: [5, 4, 3, 2, 1]",
    starterCode: `import java.util.Scanner;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        
        System.out.println("Исходный: " + Arrays.toString(arr));
        
        // TODO: выполни in-place реверс двумя указателями left и right
        
        System.out.println("Перевернутый: " + Arrays.toString(arr));
    }
}`,
    theory: {
      title: "Паттерн двух указателей и Swap",
      summary: "Обмен элементов с противоположных концов массива.",
      keyPoints: [
        "Обмен двух переменных в Java требует временной переменной: int tmp = a; a = b; b = tmp;",
        "Указатели сходятся к центру за N / 2 итераций.",
        "Arrays.toString(arr) превращает массив в красивую строку вида [1, 2, 3]."
      ],
      codeExample: `int left = 0;
int right = arr.length - 1;
while (left < right) {
    int tmp = arr[left];
    arr[left] = arr[right];
    arr[right] = tmp;
    left++;
    right--;
}`,
      pitfalls: [
        "Не делай цикл до самого конца arr.length, иначе элементы поменяются местами дважды и массив вернется в исходное состояние!"
      ]
    },
    tests: [
      {
        label: "Массив [1, 2, 3, 4, 5]",
        stdin: "5\n1 2 3 4 5\n",
        expected: ["Исходный: [1, 2, 3, 4, 5]", "Перевернутый: [5, 4, 3, 2, 1]"]
      },
      {
        label: "Массив четной длины [10, 20, 30, 40]",
        stdin: "4\n10 20 30 40\n",
        expected: ["Перевернутый: [40, 30, 20, 10]"]
      }
    ],
    hints: [
      "Используй `while (left < right)`.",
      "Меняй элементы через `int tmp = arr[left]; arr[left] = arr[right]; arr[right] = tmp;`."
    ]
  },
  {
    id: "pr_m3_remove_duplicates",
    moduleId: 3,
    moduleName: "Модуль 3: Циклы и массивы",
    topic: "Алгоритмы: сдвиг элементов и сжатие",
    title: "Удаление дубликатов из отсортированного массива",
    difficulty: "Средний",
    xp: 35,
    description: `Классическая задача с LeetCode (#26 Remove Duplicates from Sorted Array).

Дан отсортированный по возрастанию массив целых чисел.
Необходимо удалить все дубликаты так, чтобы каждый уникальный элемент встречался только один раз, и подсчитать количество уникальных элементов K.

Алгоритм:
- Если массив пуст, вернуть 0.
- Заведи указатель на позицию последнего уникального элемента \`int writeIdx = 0\`.
- Пройди циклом от 1 до конца: если \`arr[i] != arr[writeIdx]\`, сдвинь \`writeIdx++\` и запиши \`arr[writeIdx] = arr[i]\`.
- Уникальных элементов: \`writeIdx + 1\`.

Формат вывода:
\`\`\`text
Исходный размер: [n]
Уникальных элементов: [k]
Уникальные значения: [значение1, значение2, ...]
\`\`\``,
    exampleInput: "6\n1 1 2 2 3 4",
    exampleOutput: "Исходный размер: 6\nУникальных элементов: 4\nУникальные значения: 1 2 3 4",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt();
        }
        
        // TODO: найди уникальные элементы и выведи их
        
    }
}`,
    theory: {
      title: "Паттерн медленного и быстрого указателя",
      summary: "Сжатие массива на месте без использования коллекций.",
      keyPoints: [
        "Поскольку массив отсортирован, все дубликаты находятся рядом друг с другом.",
        "Быстрый указатель i бежит вперед и ищет новые значения.",
        "Медленный указатель writeIdx сохраняет только новые найденные уникальные элементы."
      ],
      codeExample: `int writeIdx = 0;
for (int i = 1; i < n; i++) {
    if (arr[i] != arr[writeIdx]) {
        writeIdx++;
        arr[writeIdx] = arr[i];
    }
}
int uniqueCount = n > 0 ? writeIdx + 1 : 0;`,
      pitfalls: [
        "Не забывай, что массив уже отсортирован. Этот метод работает за O(N) времени и O(1) памяти."
      ]
    },
    tests: [
      {
        label: "Массив [1, 1, 2, 2, 3, 4]",
        stdin: "6\n1 1 2 2 3 4\n",
        expected: ["Исходный размер: 6", "Уникальных элементов: 4", "Уникальные значения: 1 2 3 4"]
      },
      {
        label: "Все одинаковые [5, 5, 5, 5]",
        stdin: "4\n5 5 5 5\n",
        expected: ["Уникальных элементов: 1", "Уникальные значения: 5"]
      }
    ],
    hints: [
      "Сравнивай `arr[i]` с `arr[writeIdx]`.",
      "Выводи от 0 до `writeIdx` включительно через пробел."
    ]
  },
  {
    id: "pr_m3_matrix_trace",
    moduleId: 3,
    moduleName: "Модуль 3: Циклы и массивы",
    topic: "Двумерные массивы int[][] и диагонали",
    title: "След квадратной матрицы и сумма диагоналей",
    difficulty: "Средний",
    xp: 35,
    description: `В линейной алгебре следом (trace) квадратной матрицы называют сумму элементов её главной диагонали (где индекс строки равен индексу столбца: \`row == col\`).
Побочная диагональ соединяет правый верхний угол с левым нижним (\`col == N - 1 - row\`).

Программа считывает:
1. Размер квадратной матрицы N (N x N)
2. N * N целых чисел матрицы

Программа должна рассчитать:
- След матрицы (сумму главной диагонали)
- Сумму побочной диагонали
- Абсолютную разность между суммами диагоналей (\`Math.abs(trace - secondarySum)\`)

Формат вывода:
\`\`\`text
Размер матрицы: [N]x[N]
Главная диагональ (след): [сумма1]
Побочная диагональ: [сумма2]
Разность диагоналей: [разность]
\`\`\``,
    exampleInput: "3\n1 2 3\n4 5 6\n7 8 9",
    exampleOutput: "Размер матрицы: 3x3\nГлавная диагональ (след): 15\nПобочная диагональ: 15\nРазность диагоналей: 0",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[][] matrix = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                matrix[i][j] = scanner.nextInt();
            }
        }
        
        // TODO: вычисли суммы главной и побочной диагоналей
        
    }
}`,
    theory: {
      title: "Индексация в двумерных массивах int[][]",
      summary: "Как обходить квадратные матрицы за один цикл O(N) вместо вложенного O(N²).",
      keyPoints: [
        "Главная диагональ: элемент matrix[i][i].",
        "Побочная диагональ: элемент matrix[i][n - 1 - i].",
        "Обе диагонали можно вычислить в одном цикле: for (int i = 0; i < n; i++)."
      ],
      codeExample: `int mainSum = 0;
int secSum = 0;
for (int i = 0; i < n; i++) {
    mainSum += matrix[i][i];
    secSum += matrix[i][n - 1 - i];
}
int diff = Math.abs(mainSum - secSum);`,
      pitfalls: [
        "Побочная диагональ: индекс столбца равен `n - 1 - i`, а не `n - i` (так как индексация с нуля)."
      ]
    },
    tests: [
      {
        label: "Матрица 3x3: [1 2 3, 4 5 6, 7 8 9]",
        stdin: "3\n1 2 3\n4 5 6\n7 8 9\n",
        expected: ["Главная диагональ (след): 15", "Побочная диагональ: 15", "Разность диагоналей: 0"]
      },
      {
        label: "Матрица 3x3: [11 2 4, 4 5 6, 10 8 -12]",
        stdin: "3\n11 2 4\n4 5 6\n10 8 -12\n",
        expected: ["Главная диагональ (след): 4", "Побочная диагональ: 19", "Разность диагоналей: 15"]
      }
    ],
    hints: [
      "В цикле `for (int i = 0; i < n; i++)` бери `matrix[i][i]` и `matrix[i][n - 1 - i]`."
    ]
  },
  {
    id: "pr_m3_prime_numbers",
    moduleId: 3,
    moduleName: "Модуль 3: Циклы и массивы",
    topic: "Вложенные циклы и алгоритмы теории чисел",
    title: "Генератор простых чисел до N (Решето)",
    difficulty: "Средний",
    xp: 35,
    description: `Простое число — это целое число больше 1, которое имеет ровно два различных натуральных делителя: 1 и само себя (2, 3, 5, 7, 11, 13...).

Напиши программу, которая:
1. Считывает целое число N (N >= 2).
2. Находит все простые числа в диапазоне от 2 до N включительно.
3. Выводит их количество и список через пробел.

Формат вывода:
\`\`\`text
Диапазон: от 2 до [N]
Количество простых чисел: [count]
Простые числа: [p1 p2 p3 ...]
\`\`\``,
    exampleInput: "20",
    exampleOutput: "Диапазон: от 2 до 20\nКоличество простых чисел: 8\nПростые числа: 2 3 5 7 11 13 17 19",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        
        // TODO: найди все простые числа от 2 до n
        
    }
}`,
    theory: {
      title: "Проверка числа на простоту",
      summary: "Оптимизация деления до квадратного корня числа.",
      keyPoints: [
        "Число 2 — единственное четное простое число.",
        "Для проверки, простое ли число x, достаточно проверять делители d от 2 до Math.sqrt(x) (или d * d <= x).",
        "Если ни один d не делит x без остатка (x % d == 0), то число x простое."
      ],
      codeExample: `boolean isPrime(int x) {
    if (x < 2) return false;
    for (int d = 2; d * d <= x; d++) {
        if (x % d == 0) return false;
    }
    return true;
}`,
      pitfalls: [
        "Не забудь, что 1 не является простым числом."
      ]
    },
    tests: [
      {
        label: "N = 20",
        stdin: "20\n",
        expected: ["Диапазон: от 2 до 20", "Количество простых чисел: 8", "Простые числа: 2 3 5 7 11 13 17 19"]
      },
      {
        label: "N = 10",
        stdin: "10\n",
        expected: ["Количество простых чисел: 4", "Простые числа: 2 3 5 7"]
      }
    ],
    hints: [
      "Проверяй делители до `d * d <= x`.",
      "Собирай строку простых чисел через `StringBuilder`."
    ]
  },
  {
    id: "pr_m3_running_sum",
    moduleId: 3,
    moduleName: "Модуль 3: Циклы и массивы",
    topic: "Префиксные суммы (Running Sum)",
    title: "Накопительный баланс (Running Sum) транзакций",
    difficulty: "Лёгкий",
    xp: 25,
    description: `В банковских выписках после каждой операции отображается текущий остаток на счете — так называемый накопительный итог (Running Sum или префиксная сумма).

Программа считывает:
1. Число транзакций N
2. N целых чисел (суммы операций: положительные для пополнений, отрицательные для списаний)

Программа должна вычислить массив балансов:
\`balance[i] = balance[i-1] + transaction[i]\`
И определить:
- Итоговый баланс
- Минимальный зафиксированный баланс (просадка)
- Максимальный зафиксированный баланс

Формат вывода:
\`\`\`text
Транзакции: [t1, t2, ...]
Баланс по шагам: [b1, b2, ...]
Итоговый баланс: [баланс]
Минимальный баланс: [min]
Максимальный баланс: [max]
\`\`\``,
    exampleInput: "4\n100 -30 50 -10",
    exampleOutput: "Транзакции: [100, -30, 50, -10]\nБаланс по шагам: [100, 70, 120, 110]\nИтоговый баланс: 110\nМинимальный баланс: 70\nМаксимальный баланс: 120",
    starterCode: `import java.util.Scanner;
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] trans = new int[n];
        for (int i = 0; i < n; i++) {
            trans[i] = scanner.nextInt();
        }
        
        // TODO: вычисли массив накопительного баланса
        
    }
}`,
    theory: {
      title: "Префиксные суммы в алгоритмах",
      summary: "Базовый алгоритмический инструмент для быстрых запросов на отрезке.",
      keyPoints: [
        "int[] running = new int[n];",
        "running[0] = trans[0];",
        "for (int i = 1; i < n; i++) running[i] = running[i - 1] + trans[i];",
        "Позволяет за O(1) отвечать на вопрос о сумме транзакций за любой период."
      ],
      codeExample: `int[] running = new int[n];
int current = 0;
for (int i = 0; i < n; i++) {
    current += trans[i];
    running[i] = current;
}`,
      pitfalls: [
        "Первый элемент накопительного массива равен первой транзакции: running[0] = trans[0]."
      ]
    },
    tests: [
      {
        label: "Транзакции [100, -30, 50, -10]",
        stdin: "4\n100 -30 50 -10\n",
        expected: ["Баланс по шагам: [100, 70, 120, 110]", "Итоговый баланс: 110", "Минимальный баланс: 70", "Максимальный баланс: 120"]
      },
      {
        label: "Транзакции [50, 50, 50]",
        stdin: "3\n50 50 50\n",
        expected: ["Баланс по шагам: [50, 100, 150]", "Итоговый баланс: 150"]
      }
    ],
    hints: [
      "Каждый следующий баланс равен предыдущему балансу плюс текущая транзакция."
    ]
  },
  {
    id: "pr_m3_matrix_transpose",
    moduleId: 3,
    moduleName: "Модуль 3: Циклы и массивы",
    topic: "Двумерные массивы и трансформация",
    title: "Транспонирование прямоугольной матрицы N×M",
    difficulty: "Средний",
    xp: 35,
    description: `Транспонирование матрицы — это операция, при которой строки исходной матрицы становятся столбцами новой матрицы.
Если исходная матрица имела размер N строк на M столбцов, то транспонированная будет иметь размер M строк на N столбцов:
\`transposed[j][i] = matrix[i][j]\`.

Программа считывает:
1. Количество строк N и столбцов M
2. N строк по M чисел в каждой

Программа должна:
1. Создать матрицу размером M×N
2. Заполнить её транспонированными значениями
3. Вывести результат построчно (элементы строки через пробел)

Формат вывода:
\`\`\`text
Исходный размер: [N]x[M]
Транспонированный размер: [M]x[N]
Результат:
[элементы строки 1]
[элементы строки 2]
...
\`\`\``,
    exampleInput: "2 3\n1 2 3\n4 5 6",
    exampleOutput: "Исходный размер: 2x3\nТранспонированный размер: 3x2\nРезультат:\n1 4\n2 5\n3 6",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        int[][] matrix = new int[n][m];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                matrix[i][j] = scanner.nextInt();
            }
        }
        
        // TODO: создай транспонированную матрицу размером m x n и заполни её
        
    }
}`,
    theory: {
      title: "Геометрия матриц в Java",
      summary: "В прямоугольной матрице N != M размеры меняются местами: new int[m][n].",
      keyPoints: [
        "Количество строк = matrix.length (N).",
        "Количество столбцов = matrix[0].length (M).",
        "Транспонированная: int[][] res = new int[m][n];",
        "Формула: res[j][i] = matrix[i][j];"
      ],
      codeExample: `int[][] transposed = new int[m][n];
for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
        transposed[j][i] = matrix[i][j];
    }
}`,
      pitfalls: [
        "Не перепутай индексы при выводе: теперь внешний цикл идёт до m, а внутренний до n."
      ]
    },
    tests: [
      {
        label: "Матрица 2x3 в 3x2",
        stdin: "2 3\n1 2 3\n4 5 6\n",
        expected: ["Исходный размер: 2x3", "Транспонированный размер: 3x2", "1 4", "2 5", "3 6"]
      },
      {
        label: "Матрица 1x3: [10 20 30]",
        stdin: "1 3\n10 20 30\n",
        expected: ["Транспонированный размер: 3x1", "10", "20", "30"]
      }
    ],
    hints: [
      "Создавай матрицу `new int[m][n]`.",
      "Присваивай `transposed[j][i] = matrix[i][j]`."
    ]
  }
];

