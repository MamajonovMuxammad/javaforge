import type { PracticeTask } from "./types";

export const module5PracticeTasks: PracticeTask[] = [
  {
    id: "pr_m5_bank_account",
    moduleId: 5,
    moduleName: "Модуль 5: Объектно-ориентированное программирование (ООП)",
    topic: "Инкапсуляция и геттеры/сеттеры",
    title: "Класс BankAccount с защитой баланса",
    difficulty: "Лёгкий",
    xp: 30,
    description: `Реализуй класс \`BankAccount\` с правильной инкапсуляцией:

Поля (приватные):
- \`private String owner;\` — имя владельца счета
- \`private double balance;\` — текущий баланс

Конструктор:
- \`public BankAccount(String owner, double initialBalance)\` (если начальный баланс отрицательный, баланс устанавливается в 0.0).

Методы:
- \`public void deposit(double amount)\` — пополняет счет, если amount > 0.
- \`public boolean withdraw(double amount)\` — снимает деньги, если amount > 0 и amount <= balance. Возвращает true при успехе, false при отказе (недостаточно средств).
- \`public double getBalance()\` — геттер баланса.
- \`public String getOwner()\` — геттер владельца.

В main():
Считай владельца, начальный баланс, сумму пополнения и сумму списания. Выполни операции и выведи статус.

Формат вывода:
\`\`\`text
Владелец: [owner]
Начальный баланс: [balance]
Пополнение: [depositAmount] -> Баланс: [newBalance]
Списание: [withdrawAmount] -> Успех: [true/false] -> Баланс: [finalBalance]
\`\`\``,
    exampleInput: "Алексей\n1000.0\n500.0\n300.0",
    exampleOutput: "Владелец: Алексей\nНачальный баланс: 1000.0\nПополнение: 500.0 -> Баланс: 1500.0\nСписание: 300.0 -> Успех: true -> Баланс: 1200.0",
    starterCode: `import java.util.Scanner;

class BankAccount {
    // TODO: объяви приватные поля, конструктор и методы deposit, withdraw, getBalance, getOwner
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String owner = scanner.nextLine();
        double initial = scanner.nextDouble();
        double dep = scanner.nextDouble();
        double with = scanner.nextDouble();
        
        // TODO: создай счет и вызови методы
        
    }
}`,
    theory: {
      title: "Инкапсуляция (Encapsulation)",
      summary: "Сокрытие внутреннего состояния объекта и защита от некорректных изменений.",
      keyPoints: [
        "Поля класса помечаются модификатором private, чтобы защитить их от прямого доступа снаружи.",
        "Доступ к данным и их модификация происходят только через методы (геттеры, сеттеры, бизнес-методы).",
        "Бизнес-методы deposit и withdraw инкапсулируют правила проверки допустимости операций."
      ],
      codeExample: `class BankAccount {
    private String owner;
    private double balance;

    public BankAccount(String owner, double initial) {
        this.owner = owner;
        this.balance = Math.max(0.0, initial);
    }
    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
    public double getBalance() { return balance; }
    public String getOwner() { return owner; }
}`,
      pitfalls: [
        "Никогда не делай поле balance публичным (public), иначе любой внешний код сможет установить balance = -999999!"
      ]
    },
    tests: [
      {
        label: "Успешное пополнение и списание",
        stdin: "Алексей\n1000.0\n500.0\n300.0\n",
        expected: ["Владелец: Алексей", "Начальный баланс: 1000", "Пополнение: 500", "Баланс: 1500", "Списание: 300", "Успех: true", "Баланс: 1200"]
      },
      {
        label: "Попытка овердрафта (недостаточно средств)",
        stdin: "Мария\n200.0\n0.0\n500.0\n",
        expected: ["Списание: 500", "Успех: false", "Баланс: 200"]
      }
    ],
    hints: [
      "Проверяй `amount <= balance` перед списанием.",
      "В withdraw возвращай `true` только при успешном списании."
    ]
  },
  {
    id: "pr_m5_static_counter",
    moduleId: 5,
    moduleName: "Модуль 5: Объектно-ориентированное программирование (ООП)",
    topic: "Ключевое слово static и счетчики",
    title: "Генератор уникальных ID заказов (static counter)",
    difficulty: "Лёгкий",
    xp: 25,
    description: `Ключевое слово \`static\` означает, что переменная или метод принадлежат самому классу, а не отдельному экземпляру. Все объекты делят одно общее статическое поле.

Реализуй класс \`Order\`:
- Статическое поле: \`private static int sequence = 1000;\`
- Поля экземпляра:
  - \`private String id;\` (формат: "ORD-1001", "ORD-1002"...)
  - \`private String item;\`
  - \`private double price;\`

Конструктор:
- \`public Order(String item, double price)\` — инкрементирует \`sequence\` и присваивает уникальный id.

Методы:
- \`public String getId()\`
- \`public static int getTotalOrders()\` — возвращает количество созданных заказов (\`sequence - 1000\`).
- \`public String toString()\` — возвращает строку \`"Заказ [id]: [item] ([price] руб)"\`.

В main(): считай 3 заказа, создай их и выведи информацию и общее количество созданных заказов.

Формат вывода:
\`\`\`text
Заказ ORD-1001: Ноутбук (75000.0 руб)
Заказ ORD-1002: Мышь (2500.0 руб)
Заказ ORD-1003: Монитор (21000.0 руб)
Всего создано заказов: 3
\`\`\``,
    exampleInput: "Ноутбук\n75000.0\nМышь\n2500.0\nМонитор\n21000.0",
    exampleOutput: "Заказ ORD-1001: Ноутбук (75000.0 руб)\nЗаказ ORD-1002: Мышь (2500.0 руб)\nЗаказ ORD-1003: Монитор (21000.0 руб)\nВсего создано заказов: 3",
    starterCode: `import java.util.Scanner;

class Order {
    // TODO: объяви static sequence и поля id, item, price
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // TODO: считай 3 заказа, создай объекты Order и выведи результат
        
    }
}`,
    theory: {
      title: "Переменные и методы static",
      summary: "Общее состояние для всех объектов класса.",
      keyPoints: [
        "Статическое поле создается один раз при загрузке класса в память.",
        "Инкремент sequence++ в конструкторе гарантирует уникальный ID каждому новому объекту.",
        "Статический метод вызывается через имя класса: Order.getTotalOrders()."
      ],
      codeExample: `class Order {
    private static int sequence = 1000;
    private String id;
    private String item;
    private double price;

    public Order(String item, double price) {
        sequence++;
        this.id = "ORD-" + sequence;
        this.item = item;
        this.price = price;
    }
    public static int getTotalOrders() {
        return sequence - 1000;
    }
}`,
      pitfalls: [
        "В статических методах нельзя обращаться к ключевому слову this и нестатическим полям!"
      ]
    },
    tests: [
      {
        label: "3 заказа (Ноутбук, Мышь, Монитор)",
        stdin: "Ноутбук\n75000.0\nМышь\n2500.0\nМонитор\n21000.0\n",
        expected: ["Заказ ORD-1001: Ноутбук", "Заказ ORD-1002: Мышь", "Заказ ORD-1003: Монитор", "Всего создано заказов: 3"]
      }
    ],
    hints: [
      "В конструкторе увеличивай `sequence++` и формируй `this.id = \"ORD-\" + sequence`.",
      "Для подсчета общего количества заказов возвращай `sequence - 1000`."
    ]
  },
  {
    id: "pr_m5_inheritance_vehicle",
    moduleId: 5,
    moduleName: "Модуль 5: Объектно-ориентированное программирование (ООП)",
    topic: "Наследование и ключевое слово super",
    title: "Иерархия транспорта: Car и ElectricCar",
    difficulty: "Средний",
    xp: 35,
    description: `Реализуй иерархию классов транспорта:

1. Базовый класс \`Vehicle\`:
   - Поля: \`protected String brand;\`, \`protected int maxSpeed;\`
   - Конструктор: \`public Vehicle(String brand, int maxSpeed)\`
   - Метод: \`public String getInfo()\` -> возвращает \`"[brand], макс. скорость: [maxSpeed] км/ч"\`

2. Класс наследник \`Car extends Vehicle\`:
   - Дополнительное поле: \`private double fuelConsumption;\` (расход л/100км)
   - Конструктор: \`public Car(String brand, int maxSpeed, double fuelConsumption)\` (вызывает \`super(brand, maxSpeed)\`)
   - Переопределяет \`getInfo()\` -> \`super.getInfo() + ", расход: [fuelConsumption] л/100км"\`

3. Класс наследник \`ElectricCar extends Vehicle\`:
   - Дополнительное поле: \`private int batteryCapacity;\` (емкость кВт·ч)
   - Конструктор: \`public ElectricCar(String brand, int maxSpeed, int batteryCapacity)\`
   - Переопределяет \`getInfo()\` -> \`super.getInfo() + ", батарея: [batteryCapacity] кВт·ч"\`

В main(): считай данные для бензинового автомобиля и электромобиля, создай их и выведи инфо.

Формат вывода:
\`\`\`text
Автомобиль 1: [brand], макс. скорость: [speed] км/ч, расход: [fuel] л/100км
Автомобиль 2: [brand], макс. скорость: [speed] км/ч, батарея: [bat] кВт·ч
\`\`\``,
    exampleInput: "Toyota 200 7.5\nTesla 250 85",
    exampleOutput: "Автомобиль 1: Toyota, макс. скорость: 200 км/ч, расход: 7.5 л/100км\nАвтомобиль 2: Tesla, макс. скорость: 250 км/ч, батарея: 85 кВт·ч",
    starterCode: `import java.util.Scanner;

class Vehicle {
    // TODO: объяви поля brand, maxSpeed и метод getInfo()
}

class Car extends Vehicle {
    // TODO: добавь fuelConsumption и вызов super()
}

class ElectricCar extends Vehicle {
    // TODO: добавь batteryCapacity и вызов super()
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // TODO: считай данные и выведи getInfo() для обоих авто
        
    }
}`,
    theory: {
      title: "Наследование и вызов конструктора предка super()",
      summary: "Ключевое слово super позволяет вызывать конструктор и методы родительского класса.",
      keyPoints: [
        "extends задает отношение 'является' (is-a): ElectricCar является Vehicle.",
        "Вызов super(...) обязан быть ПЕРВОЙ строкой в конструкторе класса-наследника.",
        "super.getInfo() вызывает реализацию метода из родительского класса."
      ],
      codeExample: `class ElectricCar extends Vehicle {
    private int batteryCapacity;
    public ElectricCar(String brand, int maxSpeed, int battery) {
        super(brand, maxSpeed);
        this.batteryCapacity = battery;
    }
    @Override
    public String getInfo() {
        return super.getInfo() + ", батарея: " + batteryCapacity + " кВт·ч";
    }
}`,
      pitfalls: [
        "Если не вызвать super(...) явно, Java попытается вызвать super() без параметров. Если в родительском классе нет конструктора по умолчанию, будет ошибка компиляции."
      ]
    },
    tests: [
      {
        label: "Toyota 200 7.5 и Tesla 250 85",
        stdin: "Toyota 200 7.5\nTesla 250 85\n",
        expected: ["Автомобиль 1: Toyota, макс. скорость: 200 км/ч, расход: 7.5 л/100км", "Автомобиль 2: Tesla, макс. скорость: 250 км/ч, батарея: 85 кВт·ч"]
      }
    ],
    hints: [
      "В конструкторах наследников пиши `super(brand, maxSpeed)` первой строкой.",
      "В `getInfo()` возвращай `super.getInfo() + ...`."
    ]
  },
  {
    id: "pr_m5_polymorphism_payment",
    moduleId: 5,
    moduleName: "Модуль 5: Объектно-ориентированное программирование (ООП)",
    topic: "Интерфейсы и динамический полиморфизм",
    title: "Полиморфная система платежей (PaymentProcessor)",
    difficulty: "Средний",
    xp: 35,
    description: `Полиморфизм позволяет работать с разными реализациями через единый общий интерфейс.

Создай:
1. Интерфейс \`PaymentMethod\`:
   - \`double calculateFee(double amount);\` — рассчитывает комиссию
   - \`String getName();\` — название платежного метода

2. Реализацию \`CreditCardPayment implements PaymentMethod\`:
   - Название: "Банковская карта"
   - Комиссия: 2.5% от суммы (\`amount * 0.025\`).

3. Реализацию \`SbpPayment implements PaymentMethod\`:
   - Название: "Система быстрых платежей (СБП)"
   - Комиссия: 0% (всегда 0.0).

4. Реализацию \`CryptoPayment implements PaymentMethod\`:
   - Название: "Криптовалюта"
   - Фиксированная комиссия: 150.0 руб независимо от суммы.

В main():
Считай сумму платежа (double).
Создай массив платежных методов \`PaymentMethod[] methods = { new CreditCardPayment(), new SbpPayment(), new CryptoPayment() };\`.
В цикле for-each полиморфно рассчитай комиссию и итоговую сумму к списанию (сумма + комиссия) для каждого метода.

Формат вывода:
\`\`\`text
Сумма заказа: [amount] руб
Метод: [name] | Комиссия: [fee] руб | К списанию: [total] руб
...
\`\`\``,
    exampleInput: "2000.0",
    exampleOutput: "Сумма заказа: 2000.0 руб\nМетод: Банковская карта | Комиссия: 50.0 руб | К списанию: 2050.0 руб\nМетод: Система быстрых платежей (СБП) | Комиссия: 0.0 руб | К списанию: 2000.0 руб\nМетод: Криптовалюта | Комиссия: 150.0 руб | К списанию: 2150.0 руб",
    starterCode: `import java.util.Scanner;

interface PaymentMethod {
    // TODO: объяви методы calculateFee и getName
}

// TODO: реализуй CreditCardPayment, SbpPayment и CryptoPayment

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double amount = scanner.nextDouble();
        
        // TODO: создай массив PaymentMethod[] и полиморфно обработай платежи
        
    }
}`,
    theory: {
      title: "Полиморфизм через интерфейсы",
      summary: "Код работает с абстрактным типом PaymentMethod, а конкретное поведение определяется объектом во время выполнения.",
      keyPoints: [
        "Интерфейс задает контракт: ЧТО должен уметь делать объект, но не КАК.",
        "Все методы интерфейса по умолчанию public abstract.",
        "Полиморфный массив: PaymentMethod[] methods = { ... } позволяет обрабатывать разнородные объекты одинаковым циклом."
      ],
      codeExample: `PaymentMethod[] methods = {
    new CreditCardPayment(),
    new SbpPayment(),
    new CryptoPayment()
};
for (PaymentMethod pm : methods) {
    double fee = pm.calculateFee(amount);
    double total = amount + fee;
    System.out.printf("Метод: %s | Комиссия: %.1f руб | К списанию: %.1f руб%n",
        pm.getName(), fee, total);
}`,
      pitfalls: [
        "Класс, реализующий интерфейс (implements), обязан реализовать ВСЕ его методы, иначе он должен быть объявлен abstract."
      ]
    },
    tests: [
      {
        label: "Сумма 2000.0 руб",
        stdin: "2000.0\n",
        expected: [
          "Метод: Банковская карта | Комиссия: 50",
          "Метод: Система быстрых платежей (СБП) | Комиссия: 0",
          "Метод: Криптовалюта | Комиссия: 150"
        ]
      },
      {
        label: "Сумма 10000.0 руб",
        stdin: "10000.0\n",
        expected: [
          "Метод: Банковская карта | Комиссия: 250",
          "К списанию: 10250",
          "Метод: Криптовалюта | Комиссия: 150",
          "К списанию: 10150"
        ]
      }
    ],
    hints: [
      "Объяви интерфейс `PaymentMethod` с двумя методами.",
      "В цикле вызывай `pm.getName()` и `pm.calculateFee(amount)`."
    ]
  },
  {
    id: "pr_m5_custom_exception",
    moduleId: 5,
    moduleName: "Модуль 5: Объектно-ориентированное программирование (ООП)",
    topic: "Обработка исключений: try-catch и throw",
    title: "Бизнес-исключение InsufficientFundsException",
    difficulty: "Средний",
    xp: 35,
    description: `В корпоративных приложениях недопустимо просто возвращать boolean или печатать в консоль при возникновении критических бизнес-ошибок. Вместо этого выбрасывают специальные проверяемые исключения.

Создай:
1. Класс собственного проверяемого исключения:
   \`class InsufficientFundsException extends Exception\`
   - Конструктор: \`public InsufficientFundsException(String message)\` -> вызывает \`super(message)\`.

2. Метод списания:
   \`public static void processWithdrawal(double balance, double amount) throws InsufficientFundsException\`
   - Если amount <= 0, выбрасывает \`IllegalArgumentException("Сумма списания должна быть больше нуля")\`.
   - Если amount > balance, выбрасывает \`new InsufficientFundsException("Недостаточно средств: запрошено " + amount + ", доступно " + balance)\`.
   - Иначе печатает: \`"Успешное списание: " + amount + " руб. Остаток: " + (balance - amount) + " руб"\`.

В main():
Считай баланс и сумму к списанию. Оберни вызов в блок \`try-catch\` и перехвати оба типа исключений, выводя сообщение об ошибке.

Формат вывода при ошибке:
\`\`\`text
Ошибка: [текст_ошибки]
\`\`\``,
    exampleInput: "500.0\n800.0",
    exampleOutput: "Ошибка: Недостаточно средств: запрошено 800.0, доступно 500.0",
    starterCode: `import java.util.Scanner;

class InsufficientFundsException extends Exception {
    // TODO: конструктор
}

public class Main {
    public static void processWithdrawal(double balance, double amount) throws InsufficientFundsException {
        // TODO: проверки и выброс исключений
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        double balance = scanner.nextDouble();
        double amount = scanner.nextDouble();
        
        // TODO: вызови processWithdrawal внутри try-catch
        
    }
}`,
    theory: {
      title: "Создание собственных исключений (Custom Exceptions)",
      summary: "Как разделять нормальный ход программы и аварийные ситуации.",
      keyPoints: [
        "Класс наследуется от Exception (Checked) или RuntimeException (Unchecked).",
        "Оператор throw new MyException(...) выбрасывает ошибку.",
        "В сигнатуре метода обязано присутствовать throws MyException для проверяемых исключений.",
        "Конструктор вызывает super(message), чтобы сохранить текст ошибки."
      ],
      codeExample: `class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String msg) {
        super(msg);
    }
}
try {
    processWithdrawal(balance, amount);
} catch (InsufficientFundsException | IllegalArgumentException e) {
    System.out.println("Ошибка: " + e.getMessage());
}`,
      pitfalls: [
        "Не глуши исключения пустым блоком catch {}! Всегда логируй или выводи e.getMessage()."
      ]
    },
    tests: [
      {
        label: "Недостаточно средств (500 и 800)",
        stdin: "500.0\n800.0\n",
        expected: ["Ошибка: Недостаточно средств: запрошено 800", "доступно 500"]
      },
      {
        label: "Успешное списание (1000 и 300)",
        stdin: "1000.0\n300.0\n",
        expected: ["Успешное списание: 300", "Остаток: 700"]
      },
      {
        label: "Отрицательная сумма списания (-50)",
        stdin: "1000.0\n-50.0\n",
        expected: ["Ошибка: Сумма списания должна быть больше нуля"]
      }
    ],
    hints: [
      "Класс исключения: `class InsufficientFundsException extends Exception { public InsufficientFundsException(String m) { super(m); } }`.",
      "В main() лови: `catch (Exception e) { System.out.println(\"Ошибка: \" + e.getMessage()); }`."
    ]
  },
  {
    id: "pr_m5_equals_hashcode",
    moduleId: 5,
    moduleName: "Модуль 5: Объектно-ориентированное программирование (ООП)",
    topic: "Контракт equals и hashCode",
    title: "Правильная реализация equals и hashCode для User",
    difficulty: "Средний",
    xp: 35,
    description: `Оператор \`==\` сравнивает ссылки на объекты в памяти, а метод \`equals()\` сравнивает логическое состояние сущностей.

Реализуй класс \`User\`:
- Поля: \`private int id;\`, \`private String email;\`, \`private String name;\`
- Конструктор: \`public User(int id, String email, String name)\`
- Переопредели метод \`equals(Object o)\`:
  - Два пользователя считаются одинаковыми, если у них совпадает \`id\` и \`email\` (без учета регистра email).
- Переопредели \`hashCode()\`:
  - Вычисляется от \`id\` и \`email.toLowerCase()\` с помощью \`java.util.Objects.hash(...)\`.

В main():
Считай данные для user1 и user2.
Сравни их через оператор \`==\` и через метод \`.equals()\`, а также сравни их hashCode.

Формат вывода:
\`\`\`text
Сравнение по ссылке (user1 == user2): [true/false]
Сравнение по equals (user1.equals(user2)): [true/false]
Хеш-коды совпадают: [true/false]
\`\`\``,
    exampleInput: "1 alex@dev.ru Алексей\n1 ALEX@DEV.RU Алекс",
    exampleOutput: "Сравнение по ссылке (user1 == user2): false\nСравнение по equals (user1.equals(user2)): true\nХеш-коды совпадают: true",
    starterCode: `import java.util.Scanner;
import java.util.Objects;

class User {
    private int id;
    private String email;
    private String name;

    public User(int id, String email, String name) {
        this.id = id;
        this.email = email;
        this.name = name;
    }

    // TODO: переопредели equals и hashCode
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        User u1 = new User(scanner.nextInt(), scanner.next(), scanner.next());
        User u2 = new User(scanner.nextInt(), scanner.next(), scanner.next());
        
        // TODO: выведи сравнение ==, equals и равенство hashCode
        
    }
}`,
    theory: {
      title: "Контракт equals и hashCode в Java",
      summary: "Золотое правило: если объекты равны по equals, их hashCode ОБЯЗАНЫ быть одинаковыми.",
      keyPoints: [
        "Если не переопределить equals, то будет использоваться реализация из Object, которая сравнивает ссылки (==).",
        "Шаги equals: 1) this == o -> true, 2) o == null || getClass() != o.getClass() -> false, 3) приведение типов, 4) сравнение полей.",
        "Для безопасного вычисления хеша: Objects.hash(id, email.toLowerCase())."
      ],
      codeExample: `@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;
    return id == user.id && email.equalsIgnoreCase(user.email);
}

@Override
public int hashCode() {
    return Objects.hash(id, email.toLowerCase());
}`,
      pitfalls: [
        "Если переопределить equals, но забыть hashCode, то объект сломается при добавлении в HashSet и HashMap!"
      ]
    },
    tests: [
      {
        label: "Одинаковые пользователи с разным регистром email",
        stdin: "1 alex@dev.ru Алексей\n1 ALEX@DEV.RU Алекс\n",
        expected: ["Сравнение по ссылке (user1 == user2): false", "Сравнение по equals (user1.equals(user2)): true", "Хеш-коды совпадают: true"]
      },
      {
        label: "Разные пользователи (разный id)",
        stdin: "1 user@mail.ru User1\n2 user@mail.ru User2\n",
        expected: ["Сравнение по equals (user1.equals(user2)): false", "Хеш-коды совпадают: false"]
      }
    ],
    hints: [
      "Используй `Objects.hash(id, email.toLowerCase())`.",
      "В `equals` сравнивай `id == user.id && email.equalsIgnoreCase(user.email)`."
    ]
  },
  {
    id: "pr_m5_immutable_user",
    moduleId: 5,
    moduleName: "Модуль 5: Объектно-ориентированное программирование (ООП)",
    topic: "Неизменяемые классы (Immutability)",
    title: "Неизменяемый класс (Immutable) StudentRecord",
    difficulty: "Средний",
    xp: 35,
    description: `Неизменяемые (immutable) объекты потокобезопасны и защищены от непреднамеренной модификации из других частей программы (как класс \`String\` в Java).

Создай неизменяемый класс \`StudentRecord\`:
1. Класс объявлен как \`final\` (запрет наследования).
2. Все поля объявлены как \`private final\`:
   - \`private final String name;\`
   - \`private final int id;\`
   - \`private final int[] grades;\` (массив оценок)
3. Конструктор:
   - Делает защитное глубокое копирование (defensive copy) входящего массива: \`this.grades = grades.clone();\`.
4. Геттеры:
   - \`getName()\`, \`getId()\`
   - \`getGrades()\` — возвращает копию массива: \`grades.clone()\`, чтобы вызывающий код не мог изменить внутреннее состояние объекта!
5. Метод \`getAverageGrade()\` — рассчитывает средний балл (double).

В main(): создай запись, измени внешний массив и убедись, что средний балл студента внутри объекта не изменился.

Формат вывода:
\`\`\`text
Студент: [name] (ID: [id])
Оценки: [оценки]
Средний балл: [avg]
Защита от изменений: true
\`\`\``,
    exampleInput: "Дмитрий\n101\n5 4 5 5 4",
    exampleOutput: "Студент: Дмитрий (ID: 101)\nОценки: [5, 4, 5, 5, 4]\nСредний балл: 4.6\nЗащита от изменений: true",
    starterCode: `import java.util.Scanner;
import java.util.Arrays;

// TODO: создай final класс StudentRecord с защитным копированием

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        int id = scanner.nextInt();
        int[] grades = new int[5];
        for (int i = 0; i < 5; i++) {
            grades[i] = scanner.nextInt();
        }
        
        // TODO: создай StudentRecord и проверь неизменяемость
        
    }
}`,
    theory: {
      title: "Правила создания Immutable классов в Java",
      summary: "5 правил создания неизменяемых классов.",
      keyPoints: [
        "1. Объяви класс final, чтобы предотвратить создание изменяемых наследников.",
        "2. Сделай все поля private final.",
        "3. Не создавай никаких сеттеров (set-методов).",
        "4. Защитное копирование в конструкторе: если поле мутабельно (массив, Date), клонируй его.",
        "5. Защитное копирование в геттере: возвращай grades.clone(), а не прямую ссылку на массив."
      ],
      codeExample: `final class StudentRecord {
    private final String name;
    private final int id;
    private final int[] grades;

    public StudentRecord(String name, int id, int[] grades) {
        this.name = name;
        this.id = id;
        this.grades = grades != null ? grades.clone() : new int[0];
    }
    public int[] getGrades() {
        return grades.clone();
    }
}`,
      pitfalls: [
        "Если в getGrades() просто вернуть return grades, внешний код сможет написать record.getGrades()[0] = 0 и сломать внутреннее состояние объекта!"
      ]
    },
    tests: [
      {
        label: "Студент Дмитрий [5, 4, 5, 5, 4]",
        stdin: "Дмитрий\n101\n5 4 5 5 4\n",
        expected: ["Студент: Дмитрий (ID: 101)", "Оценки: [5, 4, 5, 5, 4]", "Средний балл: 4.6", "Защита от изменений: true"]
      }
    ],
    hints: [
      "Используй `this.grades = grades.clone()` в конструкторе.",
      "В `getGrades()` возвращай `grades.clone()`."
    ]
  },
  {
    id: "pr_m5_notification_service",
    moduleId: 5,
    moduleName: "Модуль 5: Объектно-ориентированное программирование (ООП)",
    topic: "Интерфейсы и фабричный метод (Factory)",
    title: "Сервис уведомлений: интерфейс Notifier и фабрика",
    difficulty: "Средний",
    xp: 35,
    description: `В реальных backend-системах отправка уведомлений (email, sms, push) проектируется через интерфейс \`Notifier\` и фабрику создания провайдеров.

Создай:
1. Интерфейс \`Notifier\`:
   - \`void send(String recipient, String message);\`
   - \`String getChannel();\`

2. Реализацию \`EmailNotifier implements Notifier\`:
   - Канал: "EMAIL"
   - Печатает: \`"[EMAIL -> recipient]: message"\`

3. Реализацию \`SmsNotifier implements Notifier\`:
   - Канал: "SMS"
   - Печатает: \`"[SMS -> recipient]: message"\`

4. Реализацию \`PushNotifier implements Notifier\`:
   - Канал: "PUSH"
   - Печатает: \`"[PUSH -> recipient]: message"\`

5. Фабричный метод \`public static Notifier createNotifier(String type)\`:
   - При "email" -> \`new EmailNotifier()\`
   - При "sms" -> \`new SmsNotifier()\`
   - При "push" -> \`new PushNotifier()\`

В main(): считай тип канала, получателя и текст сообщения. Создай уведомитель через фабрику и отправь сообщение.

Формат вывода:
\`\`\`text
Канал: [канал]
[КАНАЛ -> получатель]: текст_сообщения
\`\`\``,
    exampleInput: "email\nsupport@javaforge.ru\nСервер успешно запущен",
    exampleOutput: "Канал: EMAIL\n[EMAIL -> support@javaforge.ru]: Сервер успешно запущен",
    starterCode: `import java.util.Scanner;

interface Notifier {
    // TODO: контракт
}

// TODO: реализации EmailNotifier, SmsNotifier, PushNotifier

public class Main {
    public static Notifier createNotifier(String type) {
        // TODO: фабричный метод
        return null;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String channel = scanner.nextLine().trim();
        String to = scanner.nextLine().trim();
        String message = scanner.nextLine().trim();
        
        // TODO: создай нотификатор через фабрику и отправь
        
    }
}`,
    theory: {
      title: "Паттерн Фабричный Метод (Factory Method)",
      summary: "Изолирует создание объектов от бизнес-логики их использования.",
      keyPoints: [
        "Клиентский код зависит от интерфейса Notifier, а не от конкретных классов EmailNotifier или SmsNotifier.",
        "Добавление нового канала (например TelegramNotifier) не требует изменения существующего кода отправки сообщений (принцип Open/Closed).",
        "Фабричный метод инкапсулирует switch по типу создаваемого объекта."
      ],
      codeExample: `public static Notifier createNotifier(String type) {
    return switch (type.toLowerCase()) {
        case "email" -> new EmailNotifier();
        case "sms" -> new SmsNotifier();
        case "push" -> new PushNotifier();
        default -> throw new IllegalArgumentException("Unknown channel: " + type);
    };
}`,
      pitfalls: [
        "Не забудь перевести тип в lowerCase перед сопоставлением в switch."
      ]
    },
    tests: [
      {
        label: "Канал email",
        stdin: "email\nsupport@javaforge.ru\nСервер успешно запущен\n",
        expected: ["Канал: EMAIL", "[EMAIL -> support@javaforge.ru]: Сервер успешно запущен"]
      },
      {
        label: "Канал sms",
        stdin: "sms\n+79991234567\nКод подтверждения: 8492\n",
        expected: ["Канал: SMS", "[SMS -> +79991234567]: Код подтверждения: 8492"]
      }
    ],
    hints: [
      "В `createNotifier` используй switch по `type.toLowerCase()`.",
      "Вызови `notifier.send(to, message)`."
    ]
  }
];

