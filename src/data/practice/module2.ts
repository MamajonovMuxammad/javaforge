import type { PracticeTask } from "./types";

export const module2PracticeTasks: PracticeTask[] = [
  {
    id: "pr_m2_slug_generator",
    moduleId: 2,
    moduleName: "Модуль 2: Строки, условия и switch",
    topic: "Методы String: trim, toLowerCase, replace",
    title: "Генератор SEO-slug из заголовка статьи",
    difficulty: "Лёгкий",
    xp: 25,
    description: `В веб-разработке "slug" — это часть URL статьи, составленная из заголовка строчными буквами через дефис (например: "Java Quick Start" -> "java-quick-start").

Напиши генератор slug, который принимает строку заголовка из System.in и выполняет:
1. Удаляет начальные и конечные пробелы (\`trim()\`).
2. Приводит все символы к нижнему регистру (\`toLowerCase()\`).
3. Заменяет все последовательности пробелов на один дефис \`-\` (\`replaceAll("\\\\s+", "-")\`).

Формат вывода:
\`\`\`text
Исходный заголовок: [исходный]
Длина заголовка: [длина_исходного]
Сформированный slug: [slug]
Длина slug: [длина_slug]
\`\`\``,
    exampleInput: "   Learn Spring Boot Today   ",
    exampleOutput: "Исходный заголовок: Learn Spring Boot Today\nДлина заголовка: 29\nСформированный slug: learn-spring-boot-today\nДлина slug: 22",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String rawTitle = scanner.nextLine();
        
        // TODO: сформируй slug с помощью trim(), toLowerCase() и replaceAll()
        
    }
}`,
    theory: {
      title: "Основные методы класса String в Java",
      summary: "Строки в Java неизменяемы (immutable). Любой метод String возвращает новую строку.",
      keyPoints: [
        "str.trim() — удаляет пробелы в начале и в конце строки.",
        "str.toLowerCase() — переводит всю строку в нижний регистр.",
        "str.replaceAll(\"\\\\s+\", \"-\") — заменяет один или несколько подряд идущих пробелов на дефис.",
        "str.length() — возвращает длину строки."
      ],
      codeExample: `String raw = sc.nextLine();
int rawLen = raw.length();
String slug = raw.trim().toLowerCase().replaceAll("\\\\s+", "-");
int slugLen = slug.length();`,
      pitfalls: [
        "Поскольку строки неизменяемы, вызов raw.trim() сам по себе не меняет переменную raw — нужно присвоить результат: raw = raw.trim() или String res = raw.trim()."
      ]
    },
    tests: [
      {
        label: "Заголовок '   Learn Spring Boot Today   '",
        stdin: "   Learn Spring Boot Today   \n",
        expected: ["Сформированный slug: learn-spring-boot-today", "Длина slug: 22"]
      },
      {
        label: "Заголовок 'Java 21 Virtual Threads'",
        stdin: "Java 21 Virtual Threads\n",
        expected: ["Сформированный slug: java-21-virtual-threads", "Длина slug: 23"]
      }
    ],
    hints: [
      "Объедини вызовы: `String slug = rawTitle.trim().toLowerCase().replaceAll(\"\\\\s+\", \"-\");`."
    ]
  },
  {
    id: "pr_m2_domain_extract",
    moduleId: 2,
    moduleName: "Модуль 2: Строки, условия и switch",
    topic: "Поиск подстрок: indexOf и substring",
    title: "Парсер сетевого адреса: протокол и домен",
    difficulty: "Средний",
    xp: 35,
    description: `Напиши парсер сетевых ссылок (URL), который извлекает протокол и доменное имя.

Пример ссылки: \`https://api.github.com/v1/users\`
- Протокол: всё до \`://\` (в данном случае \`https\`)
- Доменное имя: всё между \`://\` и следующим слешем \`/\` (в данном случае \`api.github.com\`). Если после домена больше нет слешей, домен идёт до самого конца строки.

Входные данные:
- Строка URL (например \`https://api.github.com/v1/users\` или \`http://localhost:8080/metrics\`).

Формат вывода:
\`\`\`text
URL: [исходный url]
Протокол: [протокол]
Домен: [домен]
Защищенное соединение (HTTPS): [true/false]
\`\`\``,
    exampleInput: "https://api.github.com/v1/users",
    exampleOutput: "URL: https://api.github.com/v1/users\nПротокол: https\nДомен: api.github.com\nЗащищенное соединение (HTTPS): true",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String url = scanner.nextLine().trim();
        
        // TODO: найди индекс "://" и выдели протокол и домен с помощью indexOf и substring
        
    }
}`,
    theory: {
      title: "Нарезка строк с indexOf и substring",
      summary: "Как безопасно парсить структуру текста по разделителям.",
      keyPoints: [
        "str.indexOf(\"://\") находит индекс начала разделителя протокола.",
        "str.substring(0, protoEnd) извлекает протокол.",
        "Индекс начала домена = protoEnd + 3 (так как длина \"://\" равна 3).",
        "Для поиска окончания домена используем str.indexOf('/', domainStart). Если слеша нет (-1), берем до конца строки str.substring(domainStart)."
      ],
      codeExample: `int sep = url.indexOf("://");
String proto = url.substring(0, sep);
int domainStart = sep + 3;
int pathSlash = url.indexOf("/", domainStart);
String domain = pathSlash == -1 ? url.substring(domainStart) : url.substring(domainStart, pathSlash);
boolean isSecure = proto.equalsIgnoreCase("https");`,
      pitfalls: [
        "Всегда проверяй случай, когда после домена нет следующего слэша: indexOf(\"/\", domainStart) вернёт -1."
      ]
    },
    tests: [
      {
        label: "URL: https://api.github.com/v1/users",
        stdin: "https://api.github.com/v1/users\n",
        expected: ["Протокол: https", "Домен: api.github.com", "Защищенное соединение (HTTPS): true"]
      },
      {
        label: "URL: http://site.org",
        stdin: "http://site.org\n",
        expected: ["Протокол: http", "Домен: site.org", "Защищенное соединение (HTTPS): false"]
      }
    ],
    hints: [
      "Разделитель \"://\" имеет длину 3 символа.",
      "Для безопасного соединения сравни `proto.equalsIgnoreCase(\"https\")`."
    ]
  },
  {
    id: "pr_m2_palindrome",
    moduleId: 2,
    moduleName: "Модуль 2: Строки, условия и switch",
    topic: "Сравнение строк и алгоритмы",
    title: "Детектор палиндромов с очисткой от пробелов",
    difficulty: "Лёгкий",
    xp: 30,
    description: `Палиндром — это слово или фраза, которая читается одинаково слева направо и справа налево (например "топот", "радар", "а роза упала на лапу азора").

Напиши детектор палиндромов:
1. Считывает строку текста.
2. Приводит строку к нижнему регистру и удаляет все пробелы.
3. Разворачивает строку (например, через \`new StringBuilder(cleaned).reverse().toString()\`).
4. Сравнивает очищенную строку с её перевернутой копией через \`.equals()\`.

Формат вывода:
\`\`\`text
Оригинал: [исходная_строка]
Очищенная: [очищенная_строка]
Реверс: [перевернутая_строка]
Палиндром: [true/false]
\`\`\``,
    exampleInput: "А роза упала на лапу Азора",
    exampleOutput: "Оригинал: А роза упала на лапу Азора\nОчищенная: арозаупаланалапуазора\nРеверс: арозаупаланалапуазора\nПалиндром: true",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        
        // TODO: очисти строку от пробелов, приведи к нижнему регистру и проверь на палиндром
        
    }
}`,
    theory: {
      title: "StringBuilder и разворот строк",
      summary: "Использование StringBuilder.reverse() для зеркального отражения текста.",
      keyPoints: [
        "String cleaned = input.toLowerCase().replace(\" \", \"\");",
        "StringBuilder sb = new StringBuilder(cleaned);",
        "String reversed = sb.reverse().toString();",
        "Никогда не сравнивай строки через ==, всегда используй cleaned.equals(reversed)!"
      ],
      codeExample: `String cleaned = input.toLowerCase().replace(" ", "");
String reversed = new StringBuilder(cleaned).reverse().toString();
boolean isPalindrome = cleaned.equals(reversed);`,
      pitfalls: [
        "Сравнение `cleaned == reversed` сравнивает ссылки на объекты в памяти и всегда вернет false. Используй `cleaned.equals(reversed)`!"
      ]
    },
    tests: [
      {
        label: "Фраза 'А роза упала на лапу Азора'",
        stdin: "А роза упала на лапу Азора\n",
        expected: ["Очищенная: арозаупаланалапуазора", "Палиндром: true"]
      },
      {
        label: "Слово 'Java'",
        stdin: "Java\n",
        expected: ["Очищенная: java", "Реверс: avaj", "Палиндром: false"]
      },
      {
        label: "Слово 'Шалаш'",
        stdin: "Шалаш\n",
        expected: ["Очищенная: шалаш", "Палиндром: true"]
      }
    ],
    hints: [
      "Удали пробелы: `input.toLowerCase().replace(\" \", \"\")`.",
      "Переверни: `new StringBuilder(cleaned).reverse().toString()`."
    ]
  },
  {
    id: "pr_m2_password_check",
    moduleId: 2,
    moduleName: "Модуль 2: Строки, условия и switch",
    topic: "Условия if-else и символы char",
    title: "Валидатор надежности мастер-пароля",
    difficulty: "Средний",
    xp: 35,
    description: `В корпоративных системах к паролям предъявляются строгие требования безопасности.

Напиши сервис проверки пароля. Пароль считывается из System.in.
Критерии надежности:
1. Длина пароля не менее 8 символов (\`password.length() >= 8\`).
2. Содержит хотя бы одну цифру (от '0' до '9').
3. Содержит хотя бы одну заглавную букву (от 'A' до 'Z' или русские 'А'..'Я').
4. Содержит хотя бы один специальный символ: \`!\`, \`@\`, \`#\`, \`$\`, \`%\` или \`*\`.

Программа проверяет выполнение каждого критерия и выводит итоговый вердикт.

Формат вывода:
\`\`\`text
Длина >= 8: [true/false]
Есть цифра: [true/false]
Есть заглавная: [true/false]
Есть спецсимвол: [true/false]
Вердикт: [НАДЕЖНЫЙ / СЛАБЫЙ]
\`\`\``,
    exampleInput: "Java2026!",
    exampleOutput: "Длина >= 8: true\nЕсть цифра: true\nЕсть заглавная: true\nЕсть спецсимвол: true\nВердикт: НАДЕЖНЫЙ",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String password = scanner.nextLine();
        
        // TODO: проверь 4 критерия надежности пароля
        
    }
}`,
    theory: {
      title: "Посимвольный обход и проверка символов char",
      summary: "Класс Character предоставляет удобные методы для классификации символов.",
      keyPoints: [
        "Character.isDigit(ch) — проверяет, является ли символ цифрой.",
        "Character.isUpperCase(ch) — проверяет, является ли буква заглавной.",
        "String specialChars = \"!@#$%*\"; specialChars.indexOf(ch) != -1 проверяет вхождение спецсимвола.",
        "Если все 4 флага true, вердикт 'НАДЕЖНЫЙ', иначе 'СЛАБЫЙ'."
      ],
      codeExample: `boolean hasLen = password.length() >= 8;
boolean hasDigit = false;
boolean hasUpper = false;
boolean hasSpecial = false;
String specials = "!@#$%*";

for (int i = 0; i < password.length(); i++) {
    char ch = password.charAt(i);
    if (Character.isDigit(ch)) hasDigit = true;
    if (Character.isUpperCase(ch)) hasUpper = true;
    if (specials.indexOf(ch) != -1) hasSpecial = true;
}`,
      pitfalls: [
        "Не забывай проверять длину: даже если все символы есть, при длине меньше 8 пароль слабый."
      ]
    },
    tests: [
      {
        label: "Надежный пароль: Java2026!",
        stdin: "Java2026!\n",
        expected: ["Длина >= 8: true", "Есть цифра: true", "Есть заглавная: true", "Есть спецсимвол: true", "Вердикт: НАДЕЖНЫЙ"]
      },
      {
        label: "Короткий пароль: J2!",
        stdin: "J2!\n",
        expected: ["Длина >= 8: false", "Вердикт: СЛАБЫЙ"]
      },
      {
        label: "Пароль без спецсимвола: SecretPass123",
        stdin: "SecretPass123\n",
        expected: ["Есть спецсимвол: false", "Вердикт: СЛАБЫЙ"]
      }
    ],
    hints: [
      "Используй цикл по длине строки `for (int i = 0; i < password.length(); i++)`.",
      "Проверяй спецсимволы через `\"!@#$%*\".indexOf(ch) != -1`."
    ]
  },
  {
    id: "pr_m2_tax_calculator",
    moduleId: 2,
    moduleName: "Модуль 2: Строки, условия и switch",
    topic: "Вложенные условия if-else",
    title: "Калькулятор прогрессивной шкалы НДФЛ",
    difficulty: "Средний",
    xp: 35,
    description: `В налоговой системе действует прогрессивная шкала подоходного налога:
- Доход до 2 400 000 руб включительно облагается по ставке 13%.
- Часть дохода от 2 400 000 до 5 000 000 руб облагается по ставке 15%.
- Часть дохода свыше 5 000 000 руб облагается по ставке 18%.

Напиши программу, которая считывает годовой доход (double) и рассчитывает точную сумму налога по ступеням.

Пример: доход 3 000 000 руб:
- С первых 2 400 000 налог 13% = 312 000 руб.
- С оставшихся 600 000 налог 15% = 90 000 руб.
- Итого налог = 402 000 руб.

Формат вывода:
\`\`\`text
Годовой доход: [доход] руб
Налог 13%: [сумма1] руб
Налог 15%: [сумма2] руб
Налог 18%: [сумма3] руб
Итого налог: [общий_налог] руб
Чистый доход на руки: [доход_минус_налог] руб
\`\`\``,
    exampleInput: "3000000.0",
    exampleOutput: "Годовой доход: 3000000.0 руб\nНалог 13%: 312000.0 руб\nНалог 15%: 90000.0 руб\nНалог 18%: 0.0 руб\nИтого налог: 402000.0 руб\nЧистый доход на руки: 2598000.0 руб",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double income = scanner.nextDouble();
        
        // TODO: рассчитай налог по трем ступеням прогрессивной шкалы
        
    }
}`,
    theory: {
      title: "Ступенчатые вычисления с условиями if-else",
      summary: "В прогрессивном налоге повышенная ставка применяется ТОЛЬКО к сумме превышения порога, а не ко всему доходу.",
      keyPoints: [
        "Порог 1: 2 400 000. Налог 13%.",
        "Порог 2: 5 000 000. Налог 15% на часть от 2.4М до 5М (максимум 2.6М * 0.15 = 390 000).",
        "Порог 3: свыше 5 000 000. Налог 18% на часть свыше 5М."
      ],
      codeExample: `double tax13 = 0, tax15 = 0, tax18 = 0;
if (income <= 2400000) {
    tax13 = income * 0.13;
} else if (income <= 5000000) {
    tax13 = 2400000 * 0.13;
    tax15 = (income - 2400000) * 0.15;
} else {
    tax13 = 2400000 * 0.13;
    tax15 = (5000000 - 2400000) * 0.15;
    tax18 = (income - 5000000) * 0.18;
}`,
      pitfalls: [
        "Не умножай весь доход на 15% или 18%! Повышенная ставка применяется только к превышению."
      ]
    },
    tests: [
      {
        label: "Доход 3 000 000 руб",
        stdin: "3000000.0\n",
        expected: ["Налог 13%: 312000", "Налог 15%: 90000", "Налог 18%: 0", "Итого налог: 402000", "Чистый доход на руки: 2598000"]
      },
      {
        label: "Доход 1 000 000 руб (только 13%)",
        stdin: "1000000.0\n",
        expected: ["Налог 13%: 130000", "Налог 15%: 0", "Налог 18%: 0", "Итого налог: 130000", "Чистый доход на руки: 870000"]
      },
      {
        label: "Доход 6 000 000 руб (все 3 ступени)",
        stdin: "6000000.0\n",
        expected: ["Налог 13%: 312000", "Налог 15%: 390000", "Налог 18%: 180000", "Итого налог: 882000", "Чистый доход на руки: 5118000"]
      }
    ],
    hints: [
      "Считай налог ступенчато: превышение над 2.4 млн умножай на 0.15, а превышение над 5 млн — на 0.18."
    ]
  },
  {
    id: "pr_m2_atm_cashout",
    moduleId: 2,
    moduleName: "Модуль 2: Строки, условия и switch",
    topic: "Жадный алгоритм и деление с остатком",
    title: "Банкомат: выдача минимального количества купюр",
    difficulty: "Средний",
    xp: 35,
    description: `Банкомат выдаёт наличные купюрами четырёх номиналов: 5000, 1000, 500 и 100 рублей.
Цель: выдать запрошенную сумму минимальным количеством банкнот (жадный алгоритм).

Правила:
1. Если сумма не кратна 100 рублям (остаток % 100 != 0), вывести: \`Ошибка: сумма должна быть кратна 100 руб\`.
2. Если сумма валидна, рассчитать количество купюр каждого номинала (начиная с 5000 и спускаясь к 100).

Формат вывода при успехе:
\`\`\`text
Запрошено: [сумма] руб
Купюр 5000: [кол-во] шт
Купюр 1000: [кол-во] шт
Купюр 500: [кол-во] шт
Купюр 100: [кол-во] шт
Всего банкнот: [общее_кол-во] шт
\`\`\``,
    exampleInput: "7800",
    exampleOutput: "Запрошено: 7800 руб\nКупюр 5000: 1 шт\nКупюр 1000: 2 шт\nКупюр 500: 1 шт\nКупюр 100: 3 шт\nВсего банкнот: 7 шт",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int amount = scanner.nextInt();
        
        // TODO: проверь кратность 100 и жадно рассчитай банкноты 5000, 1000, 500, 100
        
    }
}`,
    theory: {
      title: "Жадный алгоритм (Greedy Algorithm)",
      summary: "На каждом шаге мы берем максимальный доступный номинал купюры.",
      keyPoints: [
        "Количество купюр = остаток / номинал.",
        "Новый остаток = остаток % номинал.",
        "Проверка кратности: if (amount % 100 != 0) { System.out.println(\"Ошибка: сумма должна быть кратна 100 руб\"); return; }"
      ],
      codeExample: `int c5000 = rem / 5000;
rem %= 5000;
int c1000 = rem / 1000;
rem %= 1000;
int c500 = rem / 500;
rem %= 500;
int c100 = rem / 100;`,
      pitfalls: [
        "Не забудь обновить переменную остатка через оператор rem %= номинал."
      ]
    },
    tests: [
      {
        label: "Сумма 7800 руб",
        stdin: "7800\n",
        expected: ["Купюр 5000: 1 шт", "Купюр 1000: 2 шт", "Купюр 500: 1 шт", "Купюр 100: 3 шт", "Всего банкнот: 7 шт"]
      },
      {
        label: "Невалидная сумма 1250 руб (не кратна 100)",
        stdin: "1250\n",
        expected: ["Ошибка: сумма должна быть кратна 100 руб"]
      },
      {
        label: "Сумма 15000 руб (только 5000)",
        stdin: "15000\n",
        expected: ["Купюр 5000: 3 шт", "Купюр 1000: 0 шт", "Купюр 500: 0 шт", "Купюр 100: 0 шт", "Всего банкнот: 3 шт"]
      }
    ],
    hints: [
      "Дели нацело `/` для количества и бери остаток `%` для передачи следующему номиналу."
    ]
  },
  {
    id: "pr_m2_season_switch",
    moduleId: 2,
    moduleName: "Модуль 2: Строки, условия и switch",
    topic: "Конструкция switch-case",
    title: "Финансовый квартал и сезон года",
    difficulty: "Лёгкий",
    xp: 25,
    description: `Напиши модуль календарного планирования для ERP-системы.

Программа считывает номер месяца (целое число int от 1 до 12).
С помощью оператора \`switch\` программа определяет:
1. Финансовый квартал:
   - 1, 2, 3 -> "Q1"
   - 4, 5, 6 -> "Q2"
   - 7, 8, 9 -> "Q3"
   - 10, 11, 12 -> "Q4"
2. Сезон года:
   - 12, 1, 2 -> "Зима"
   - 3, 4, 5 -> "Весна"
   - 6, 7, 8 -> "Лето"
   - 9, 10, 11 -> "Осень"
3. Если введен номер меньше 1 или больше 12, вывести: \`Ошибка: неверный номер месяца\`.

Формат вывода при корректном номере:
\`\`\`text
Месяц: [номер]
Квартал: [Q1/Q2/Q3/Q4]
Сезон: [Зима/Весна/Лето/Осень]
\`\`\``,
    exampleInput: "4",
    exampleOutput: "Месяц: 4\nКвартал: Q2\nСезон: Весна",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int month = scanner.nextInt();
        
        // TODO: определи квартал и сезон через switch
        
    }
}`,
    theory: {
      title: "Множественный выбор через switch в Java",
      summary: "Объединение нескольких case для одного действия.",
      keyPoints: [
        "В switch можно перечислять несколько значений через запятую: case 1, 2, 3 -> \"Q1\";",
        "В классическом switch обязательно использовать break, иначе выполнится следующий case (fall-through).",
        "Секция default обрабатывает невалидные значения."
      ],
      codeExample: `String quarter = switch (month) {
    case 1, 2, 3 -> "Q1";
    case 4, 5, 6 -> "Q2";
    case 7, 8, 9 -> "Q3";
    case 10, 11, 12 -> "Q4";
    default -> "Unknown";
};`,
      pitfalls: [
        "Декабрь (12) относится к Зиме, поэтому в сезонах case 12 группируется с 1 и 2."
      ]
    },
    tests: [
      {
        label: "Месяц 4 (Апрель -> Q2, Весна)",
        stdin: "4\n",
        expected: ["Месяц: 4", "Квартал: Q2", "Сезон: Весна"]
      },
      {
        label: "Месяц 12 (Декабрь -> Q4, Зима)",
        stdin: "12\n",
        expected: ["Месяц: 12", "Квартал: Q4", "Сезон: Зима"]
      },
      {
        label: "Неверный месяц 15",
        stdin: "15\n",
        expected: ["Ошибка: неверный номер месяца"]
      }
    ],
    hints: [
      "Сначала проверь `if (month < 1 || month > 12)` и выведи ошибку.",
      "Для кварталов используй switch: `(month - 1) / 3 + 1` или явные case."
    ]
  },
  {
    id: "pr_m2_rgb_to_hex",
    moduleId: 2,
    moduleName: "Модуль 2: Строки, условия и switch",
    topic: "Форматирование строк и Math.min / Math.max",
    title: "Конвертер цветовых каналов RGB в HEX",
    difficulty: "Лёгкий",
    xp: 25,
    description: `В веб-дизайне цвета часто задаются в формате HEX: \`#RRGGBB\`, где каждый канал (красный, зелёный, синий) записывается двумя шестнадцатеричными цифрами от 00 до FF.

Напиши конвертер цветов:
1. Считывает 3 целых числа int: R, G, B.
2. Ограничивает каждое число диапазоном от 0 до 255 с помощью \`Math.max(0, Math.min(255, val))\`.
3. Формирует строку вида \`#RRGGBB\` заглавными буквами с помощью \`String.format("#%02X%02X%02X", r, g, b)\`.

Формат вывода:
\`\`\`text
R: [r]
G: [g]
B: [b]
HEX: #[RRGGBB]
\`\`\``,
    exampleInput: "255\n87\n51",
    exampleOutput: "R: 255\nG: 87\nB: 51\nHEX: #FF5733",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // TODO: считай R, G, B, ограничь диапазон 0..255 и сформируй HEX
        
    }
}`,
    theory: {
      title: "Форматирование шестнадцатеричных чисел (%02X)",
      summary: "Преобразование целых чисел в HEX-строки с ведущими нулями.",
      keyPoints: [
        "%02X — выводит число в 16-ричной системе счисления заглавными буквами (X), дополняя нулями до 2 символов.",
        "Число 15 -> '0F', число 255 -> 'FF', число 0 -> '00'.",
        "Метод Math.max(0, Math.min(255, val)) гарантирует, что число не выйдет за границы допустимого цвета (clamping)."
      ],
      codeExample: `int r = Math.max(0, Math.min(255, sc.nextInt()));
int g = Math.max(0, Math.min(255, sc.nextInt()));
int b = Math.max(0, Math.min(255, sc.nextInt()));
String hex = String.format("#%02X%02X%02X", r, g, b);`,
      pitfalls: [
        "Буква X в спецификаторе должна быть заглавной (%02X), чтобы получить FF, а не ff."
      ]
    },
    tests: [
      {
        label: "Цвет (255, 87, 51) -> #FF5733",
        stdin: "255\n87\n51\n",
        expected: ["R: 255", "G: 87", "B: 51", "HEX: #FF5733"]
      },
      {
        label: "Цвет (0, 0, 0) -> #000000",
        stdin: "0\n0\n0\n",
        expected: ["R: 0", "G: 0", "B: 0", "HEX: #000000"]
      },
      {
        label: "Цвет с выходом за границы (300, -10, 16) -> #FF0010",
        stdin: "300\n-10\n16\n",
        expected: ["R: 255", "G: 0", "B: 16", "HEX: #FF0010"]
      }
    ],
    hints: [
      "Используй `Math.max(0, Math.min(255, x))` для каждого канала.",
      "Спецификатор `%02X` переводит число в шестнадцатеричный вид."
    ]
  }
];

