"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Code2,
  Terminal,
  Cpu,
  Boxes,
  Zap,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { youtubeSearchUrl } from "@/data/curriculum";

interface ModuleZeroViewProps {
  isCompleted?: boolean;
  onComplete: () => void;
  onNext: () => void;
}

interface CodeToken {
  id: string;
  label: string;
  keyword: string;
  category: "access" | "structure" | "type" | "method" | "io";
  title: string;
  simpleExplanation: string;
  analogy: string;
  whatIfRemoved: string;
}

const TOKENS: Record<string, CodeToken> = {
  import: {
    id: "import",
    label: "import",
    keyword: "import",
    category: "structure",
    title: "Ключевое слово import",
    simpleExplanation:
      "Указывает компилятору, из какого пакета (папки) нужно взять инструмент. Без этой строчки Java не знает, где искать класс Scanner.",
    analogy:
      "Заказ доставки инструмента из гаража: «Привези мне Scanner из коробки java.util».",
    whatIfRemoved:
      "Ошибка компиляции: «cannot find symbol: class Scanner». Java откажется собирать программу.",
  },
  "java.util.Scanner": {
    id: "java.util.Scanner",
    label: "java.util.Scanner",
    keyword: "java.util.Scanner",
    category: "io",
    title: "Пакет java.util и класс Scanner",
    simpleExplanation:
      "Полный адрес класса в иерархии Java. `java.util` — пакет полезных утилит, `Scanner` — сам инструмент чтения данных.",
    analogy: "Почтовый адрес: страна Java, город Утилиты (util), дом Сканер.",
    whatIfRemoved:
      "Придётся писать полное имя везде в коде: `java.util.Scanner sc = new java.util.Scanner(System.in);`.",
  },
  public_class: {
    id: "public_class",
    label: "public (класс)",
    keyword: "public",
    category: "access",
    title: "Модификатор доступа public",
    simpleExplanation:
      "Делает класс открытым для всех. Виртуальная машина JVM сможет запустить его из любого места.",
    analogy: "Открытая входная дверь офиса — любой посетитель может войти.",
    whatIfRemoved:
      "Класс станет доступен только внутри текущего пакета (package-private).",
  },
  class: {
    id: "class",
    label: "class",
    keyword: "class",
    category: "structure",
    title: "Ключевое слово class",
    simpleExplanation:
      "Объявляет класс — главный строительный блок в Java. В Java ни одна строчка кода не может быть написана вне класса.",
    analogy: "Чертёж здания или контейнер, в который мы складываем все инструменты и функции.",
    whatIfRemoved:
      "Синтаксическая ошибка. В Java нет функций без классов, как в Python или C++.",
  },
  Main: {
    id: "Main",
    label: "Main",
    keyword: "Main",
    category: "structure",
    title: "Имя класса Main",
    simpleExplanation:
      "Имя нашего главного класса. Правило Java: имя публичного класса обязано СТРОГО совпадать с именем файла на диске (`Main.java`).",
    analogy: "Название коробки совпадает с надписью на ценнике.",
    whatIfRemoved:
      "Если класс `public`, а файл называется `App.java`, компилятор откажется работать.",
  },
  public_method: {
    id: "public_method",
    label: "public (метод)",
    keyword: "public",
    category: "access",
    title: "Модификатор public у main",
    simpleExplanation:
      "JVM запускает твою программу «снаружи» класса из терминала. Метод `main` обязан быть общедоступным.",
    analogy: "Кнопка «Пуск» на внешней панели станка, чтобы оператор мог её нажать.",
    whatIfRemoved:
      "Ошибка при запуске: `Main method not found in class Main`.",
  },
  static: {
    id: "static",
    label: "static",
    keyword: "static",
    category: "structure",
    title: "Ключевое слово static (Главный ступор новичков)",
    simpleExplanation:
      "Означает, что метод принадлежит самому КЛАССУ, а не отдельному объекту. JVM может вызвать `Main.main()` сразу при старте, не создавая экземпляр через `new Main()`.",
    analogy:
      "Главный рубильник электричества на фасаде здания: чтобы его включить, не нужно заходить в конкретную квартиру и создавать жильца.",
    whatIfRemoved:
      "Ошибка: `Main method is not static in class Main, please define the main method as: public static void main`.",
  },
  void: {
    id: "void",
    label: "void",
    keyword: "void",
    category: "type",
    title: "Тип возвращаемого значения void",
    simpleExplanation:
      "В переводе с английского — «пустота». Означает, что метод выполняет действия, но ничего не возвращает назад операционной системе (не делает `return число;`).",
    analogy: "Дворник подмёл улицу: работа сделана, но никакого материального предмета в руки он тебе не отдаёт.",
    whatIfRemoved:
      "Любой метод в Java обязан объявлять тип возвращаемого значения (int, String или void). Без него код не скомпилируется.",
  },
  main: {
    id: "main",
    label: "main",
    keyword: "main",
    category: "method",
    title: "Имя точки входа main",
    simpleExplanation:
      "Зафиксированное соглашение: JVM запрограммирована искать метод строго с именем `main` с маленькой буквы.",
    analogy: "Дверь с табличкой «ВХОД». Если переименовать её в `start`, робот-JVM пройдёт мимо.",
    whatIfRemoved:
      "Программа скомпилируется, но JVM не поймёт, с чего начинать выполнение.",
  },
  args: {
    id: "args",
    label: "String[] args",
    keyword: "String[] args",
    category: "type",
    title: "Параметры String[] args",
    simpleExplanation:
      "`String[]` — массив строк (текстов). `args` — имя переменной (arguments). Сюда попадают аргументы командной строки при запуске.",
    analogy: "Почтовый ящик на входе: если при запуске программы ей передать флаги, они попадут в этот список.",
    whatIfRemoved:
      "Сигнатура перестанет соответствовать стандарту точки входа Java.",
  },
  System_out_println: {
    id: "System_out_println",
    label: "System.out.println",
    keyword: "System.out.println",
    category: "io",
    title: "Команда вывода System.out.println",
    simpleExplanation:
      "`System` — встроенный системный класс, `.out` — стандартный поток вывода (экран/консоль), `println` — напечатать строку и перевести курсор на новую строку (Print Line).",
    analogy: "Печатная машинка: напечатала буквы и автоматически сделала «дзынь» с переводом каретки вниз.",
    whatIfRemoved:
      "Программа отработает молча в памяти, а на экране ничего не появится.",
  },
  new_Scanner: {
    id: "new_Scanner",
    label: "new Scanner(System.in)",
    keyword: "new Scanner(System.in)",
    category: "io",
    title: "Создание сканера для ввода",
    simpleExplanation:
      "`new` выделяет память в компьютере под новый объект. `Scanner(System.in)` подключает созданный сканер к клавиатуре (`System.in` = System Input).",
    analogy: "Включить микрофон и направить его на говорящего пользователя.",
    whatIfRemoved:
      "Программа не сможет «слушать» клавиатуру и получать числа или текст от пользователя.",
  },
};

interface QuizQuestion {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Почему метод main обязан быть помечен как static?",
    options: [
      "Чтобы программа работала быстрее",
      "Чтобы JVM могла вызвать его без предварительного создания объекта через new",
      "Потому что в Java все методы обязаны быть static",
      "Чтобы метод нельзя было изменить",
    ],
    correctIdx: 1,
    explanation:
      "Правильно! JVM не создаёт экземпляр класса `new Main()`. Слово `static` даёт возможность вызвать метод напрямую у самого класса `Main.main()`.",
  },
  {
    question: "Что означает возвращаемый тип void у метода?",
    options: [
      "Метод возвращает число 0",
      "Метод ничего не возвращает вызывающей стороне",
      "Метод может упасть с ошибкой",
      "Метод доступен только внутри класса",
    ],
    correctIdx: 1,
    explanation:
      "Именно! `void` буквально переводится как «пустота». Метод делает полезную работу (например, печатает текст), но не отдаёт обратно никакой объект или число.",
  },
  {
    question: "Почему для System.out.println нам НЕ нужно писать import, а для Scanner нужно?",
    options: [
      "Потому что System — это не класс, а переменная",
      "Потому что пакет java.lang подключается автоматически ко всем Java-файлам",
      "Потому что Scanner платный",
      "Потому что System написан на C++, а не на Java",
    ],
    correctIdx: 1,
    explanation:
      "Точно в цель! Классы базового пакета `java.lang` (System, String, Math) Java импортирует сама по умолчанию. А всё остальное (например, утилиты из `java.util`) нужно импортировать явно.",
  },
  {
    question: "Что происходит в буфере ввода после вызова scanner.nextInt()?",
    options: [
      "Буфер полностью очищается",
      "Остаётся символ перевода строки \\n (нажатый Enter), который может случайно считать следующий nextLine()",
      "Сканер закрывается и выключается",
      "В буфер записывается число 0",
    ],
    correctIdx: 1,
    explanation:
      "Классика! `nextInt()` считывает только само число, а символ `\\n` остаётся в очереди. Если сразу вызвать `nextLine()`, он моментально «съест» этот остаток Enter и вернёт пустую строку.",
  },
];

export function ModuleZeroView({ isCompleted = false, onComplete, onNext }: ModuleZeroViewProps) {
  const [selectedTokenId, setSelectedTokenId] = useState<string>("static");
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [completedState, setCompletedState] = useState(isCompleted);

  const selectedToken = TOKENS[selectedTokenId] || TOKENS["static"];

  const handleSelectQuiz = (qIdx: number, optIdx: number) => {
    if (quizAnswers[qIdx] !== undefined) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleFinish = () => {
    setCompletedState(true);
    onComplete();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* 1. Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-b from-sky-950/30 via-zinc-900/60 to-zinc-950/80 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>МОДУЛЬ 0 • ВВЕДЕНИЕ С НУЛЯ ДЛЯ НАЧИНАЮЩИХ</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Анатомия Java: понимаем каждое слово без зубрежки
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            Новички часто бросают Java на первой неделе из-за странных заклинаний:{" "}
            <code className="text-sky-300 font-mono text-xs bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
              public static void main
            </code>
            ,{" "}
            <code className="text-sky-300 font-mono text-xs bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
              String[] args
            </code>{" "}
            и{" "}
            <code className="text-sky-300 font-mono text-xs bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
              new Scanner(System.in)
            </code>
            . Здесь мы разберём, <strong>зачем нужно каждое слово</strong>, и докажем, что в Java всё
            логично и последовательно.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-sky-400" /> ~40 минут вдумчивого чтения
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-400" /> +50 XP за завершение
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Без компилятора — чистый интерактивный фундамент
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Code Anatomy Inspector (Ключевая фича) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="h-5 w-5 text-sky-400" />
              Интерактивная анатомия первой программы
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Кликай на любое слово в коде ниже, чтобы мгновенно узнать, зачем оно нужно и что будет, если его стереть.
            </p>
          </div>
        </div>

        {/* The Code Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0d0d11] p-4 sm:p-5 font-mono text-xs sm:text-sm shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-white/5 text-[11px] text-zinc-500">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-2 text-zinc-400">Main.java</span>
              <span className="ml-auto text-[10px] text-sky-400/80 uppercase tracking-widest">
                Нажимай на слова
              </span>
            </div>

            <div className="space-y-2 leading-relaxed select-none">
              {/* Line 1: import */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedTokenId("import")}
                  className={`rounded px-1.5 py-0.5 transition font-bold ${
                    selectedTokenId === "import"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105"
                      : "text-purple-400 hover:bg-white/10"
                  }`}
                >
                  import
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTokenId("java.util.Scanner")}
                  className={`rounded px-1.5 py-0.5 transition ${
                    selectedTokenId === "java.util.Scanner"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105"
                      : "text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  java.util.Scanner;
                </button>
              </div>

              <div className="h-2" />

              {/* Line 2: public class Main */}
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedTokenId("public_class")}
                  className={`rounded px-1.5 py-0.5 transition font-bold ${
                    selectedTokenId === "public_class"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105"
                      : "text-orange-400 hover:bg-white/10"
                  }`}
                >
                  public
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTokenId("class")}
                  className={`rounded px-1.5 py-0.5 transition font-bold ${
                    selectedTokenId === "class"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105"
                      : "text-purple-400 hover:bg-white/10"
                  }`}
                >
                  class
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTokenId("Main")}
                  className={`rounded px-1.5 py-0.5 transition font-bold ${
                    selectedTokenId === "Main"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105"
                      : "text-yellow-300 hover:bg-white/10"
                  }`}
                >
                  Main
                </button>
                <span className="text-zinc-500">{"{"}</span>
              </div>

              {/* Line 3: public static void main */}
              <div className="flex items-center gap-1 pl-4 sm:pl-6 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedTokenId("public_method")}
                  className={`rounded px-1.5 py-0.5 transition font-bold ${
                    selectedTokenId === "public_method"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105"
                      : "text-orange-400 hover:bg-white/10"
                  }`}
                >
                  public
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTokenId("static")}
                  className={`rounded px-1.5 py-0.5 transition font-bold ${
                    selectedTokenId === "static"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105"
                      : "text-rose-400 hover:bg-white/10"
                  }`}
                >
                  static
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTokenId("void")}
                  className={`rounded px-1.5 py-0.5 transition font-bold ${
                    selectedTokenId === "void"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105"
                      : "text-emerald-400 hover:bg-white/10"
                  }`}
                >
                  void
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTokenId("main")}
                  className={`rounded px-1.5 py-0.5 transition font-bold ${
                    selectedTokenId === "main"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105"
                      : "text-blue-300 hover:bg-white/10"
                  }`}
                >
                  main
                </button>
                <span className="text-zinc-400">(</span>
                <button
                  type="button"
                  onClick={() => setSelectedTokenId("args")}
                  className={`rounded px-1.5 py-0.5 transition ${
                    selectedTokenId === "args"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105"
                      : "text-amber-300 hover:bg-white/10"
                  }`}
                >
                  String[] args
                </button>
                <span className="text-zinc-400">)</span>
                <span className="text-zinc-500">{"{"}</span>
              </div>

              {/* Line 4: Scanner */}
              <div className="flex items-center gap-1 pl-8 sm:pl-12 flex-wrap">
                <span className="text-yellow-300 font-semibold">Scanner</span>
                <span className="text-zinc-200">scanner</span>
                <span className="text-purple-400">=</span>
                <button
                  type="button"
                  onClick={() => setSelectedTokenId("new_Scanner")}
                  className={`rounded px-1.5 py-0.5 transition ${
                    selectedTokenId === "new_Scanner"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105"
                      : "text-emerald-300 hover:bg-white/10"
                  }`}
                >
                  new Scanner(System.in);
                </button>
              </div>

              {/* Line 5: System.out.println */}
              <div className="flex items-center gap-1 pl-8 sm:pl-12 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedTokenId("System_out_println")}
                  className={`rounded px-1.5 py-0.5 transition ${
                    selectedTokenId === "System_out_println"
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 scale-105"
                      : "text-cyan-300 hover:bg-white/10"
                  }`}
                >
                  System.out.println
                </button>
                <span className="text-zinc-400">(</span>
                <span className="text-emerald-400">"Привет, Java!"</span>
                <span className="text-zinc-400">);</span>
              </div>

              {/* Closes */}
              <div className="pl-4 sm:pl-6 text-zinc-500">{"}"}</div>
              <div className="text-zinc-500">{"}"}</div>
            </div>
          </div>

          {/* Right Explanation Card */}
          <div className="lg:col-span-5 rounded-2xl border border-sky-500/30 bg-zinc-900/90 p-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {selectedToken.keyword}
                </span>
                <span className="text-[11px] text-zinc-500">Разбор элемента</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  {selectedToken.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {selectedToken.simpleExplanation}
                </p>
              </div>

              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>Аналогия из жизни:</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  {selectedToken.analogy}
                </p>
              </div>

              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Что будет, если стереть?</span>
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  {selectedToken.whatIfRemoved}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Кликни на другое слово в коде слева ➔</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Deep-Dive Section: Путь байткода и JVM */}
      <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="h-5 w-5 text-orange-400" />
          Как Java превращается в работающую программу
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl bg-zinc-900 border border-white/5 p-4 space-y-2">
            <span className="font-mono text-orange-400 font-bold">1. Main.java</span>
            <p className="text-zinc-300">
              Исходный файл на английском языке, который написал программист в IDE или блокноте.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900 border border-white/5 p-4 space-y-2">
            <span className="font-mono text-amber-400 font-bold">2. javac (Компилятор)</span>
            <p className="text-zinc-300">
              Проверяет типы и синтаксис. Если всё верно, превращает исходник в байт-код.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900 border border-white/5 p-4 space-y-2">
            <span className="font-mono text-sky-400 font-bold">3. Main.class (Байт-код)</span>
            <p className="text-zinc-300">
              Универсальный промежуточный набор инструкций. Одинаков на любой операционной системе.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-900 border border-white/5 p-4 space-y-2">
            <span className="font-mono text-emerald-400 font-bold">4. JVM (Виртуальная машина)</span>
            <p className="text-zinc-300">
              Запускает байт-код на конкретном «железе» (Mac, Linux, Windows, Cloud).
            </p>
          </div>
        </div>
      </section>

      {/* 4. Scanner and the classic Enter Trap */}
      <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <Boxes className="h-5 w-5 text-emerald-400" />
          Scanner: методы чтения и главная ловушка новичка
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-zinc-900/80 border border-white/5 p-4 space-y-2">
            <h4 className="font-semibold text-zinc-100 text-sm">Таблица методов Scanner:</h4>
            <ul className="space-y-1.5 text-xs text-zinc-300 font-mono">
              <li>
                <span className="text-orange-400">scanner.nextInt()</span> — целое число (`int`)
              </li>
              <li>
                <span className="text-amber-400">scanner.nextDouble()</span> — дробное число (`double`)
              </li>
              <li>
                <span className="text-sky-400">scanner.next()</span> — одно слово (до пробела)
              </li>
              <li>
                <span className="text-emerald-400">scanner.nextLine()</span> — вся строка до нажатия Enter
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 space-y-2">
            <h4 className="font-semibold text-rose-300 text-sm flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              Ловушка с зависшим Enter:
            </h4>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              Когда ты вводишь число <code>25</code> и жмёшь <kbd className="bg-black/40 px-1 py-0.5 rounded">Enter</kbd>,{" "}
              метод <code>nextInt()</code> забирает число, но символ <code>\n</code> остаётся в очереди!
              Если следом вызвать <code>nextLine()</code>, он сразу проглотит этот остаток и вернёт пустоту.
            </p>
            <div className="rounded bg-black/40 p-2 font-mono text-[11px] text-zinc-300">
              <span className="text-zinc-500">// Лекарство: холостой вызов</span>
              <br />
              int age = scanner.nextInt();
              <br />
              <span className="text-emerald-400 font-bold">scanner.nextLine();</span> // очищаем буфер!
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Quiz: Закрепление знаний */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-amber-400" />
            Интерактивный экспресс-квиз (4 вопроса)
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Проверь, всё ли ты понял. Нажимай на правильный ответ — компилятор не нужен!
          </p>
        </div>

        <div className="space-y-3">
          {QUIZ_QUESTIONS.map((q, qIdx) => {
            const chosen = quizAnswers[qIdx];
            const isAnswered = chosen !== undefined;
            const isCorrect = chosen === q.correctIdx;

            return (
              <div
                key={qIdx}
                className="rounded-2xl border border-white/5 bg-zinc-900/60 p-4 sm:p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-zinc-400">Вопрос {qIdx + 1} из 4</span>
                  {isAnswered && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isCorrect
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {isCorrect ? "Верно! 🎉" : "Не совсем так 🤔"}
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-white">{q.question}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = "border-white/5 bg-zinc-950/60 text-zinc-300 hover:bg-white/5";
                    if (isAnswered) {
                      if (optIdx === q.correctIdx) {
                        btnStyle = "border-emerald-500/50 bg-emerald-500/15 text-emerald-200 font-semibold";
                      } else if (optIdx === chosen) {
                        btnStyle = "border-rose-500/50 bg-rose-500/15 text-rose-200";
                      } else {
                        btnStyle = "border-white/5 bg-zinc-950/30 text-zinc-600 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectQuiz(qIdx, optIdx)}
                        className={`text-left rounded-xl border p-3 text-xs transition duration-200 flex items-start gap-2 ${btnStyle}`}
                      >
                        <span className="font-mono text-zinc-500 shrink-0">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <p className="text-xs text-zinc-400 pt-2 border-t border-white/5 leading-relaxed">
                    {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Finish & Move to Day 1 Action Button */}
      <section className="rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/15 p-6 sm:p-8 text-center space-y-4 shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-lg">
          <CheckCircle2 className="h-6 w-6" />
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Фундамент заложен! Ты готов писать код
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto mt-1">
            Теперь, когда ты знаешь назначение каждого слова в Java, переходи к Дню 1: там тебя ждут
            живой запуск кода, консоль и первые практические задачи.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleFinish}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 text-sm transition shadow-lg shadow-orange-500/20 active:scale-95"
          >
            <span>Завершить Модуль 0 (+50 XP) и перейти к Дню 1</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 font-medium px-4 py-3 text-sm transition"
          >
            <span>Перейти к Дню 1 без сохранения</span>
          </button>
        </div>
      </section>
    </div>
  );
}
