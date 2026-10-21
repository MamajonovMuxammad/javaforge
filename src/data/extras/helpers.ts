import type { Resource, TheoryBlock } from "../types";

/* ---------------- Theory block builders ---------------- */

export const h = (text: string): TheoryBlock => ({ type: "h", text });
export const p = (text: string): TheoryBlock => ({ type: "p", text });
/** Code block. Use String.raw for the source so `\n` inside Java strings is preserved. */
export const code = (src: string, caption?: string, lang?: string): TheoryBlock => ({
  type: "code",
  code: src.replace(/^\n+|\s+$/g, ""),
  caption,
  lang,
});
export const list = (...items: string[]): TheoryBlock => ({ type: "list", items });
export const table = (head: string[], ...rows: string[][]): TheoryBlock => ({ type: "table", head, rows });
export const tip = (title: string, text: string): TheoryBlock => ({ type: "callout", variant: "tip", title, text });
export const warn = (title: string, text: string): TheoryBlock => ({ type: "callout", variant: "warning", title, text });
export const info = (title: string, text: string): TheoryBlock => ({ type: "callout", variant: "info", title, text });
export const analogy = (title: string, text: string): TheoryBlock => ({ type: "callout", variant: "analogy", title, text });

/**
 * Helpers for building self-study resource links.
 * Only stable, long-lived URLs are used; for everything else we link to a search page
 * so a link never turns into a 404.
 */

/** Official Oracle Java Tutorial page, e.g. "java/nutsandbolts/datatypes.html" */
export const oracle = (path: string, title: string, note?: string): Resource => ({
  kind: "docs",
  title,
  url: `https://docs.oracle.com/javase/tutorial/${path}`,
  note,
  lang: "en",
});

/** Java 21 API Javadoc, e.g. "java/util/ArrayList" */
export const javadoc = (classPath: string, note?: string): Resource => ({
  kind: "docs",
  title: `Javadoc: ${classPath.split("/").pop()}`,
  url: `https://docs.oracle.com/en/java/javase/21/docs/api/java.base/${classPath}.html`,
  note: note ?? "Официальная документация класса — все методы и их контракты",
  lang: "en",
});

/** Baeldung article by slug, e.g. "java-hashmap" */
export const baeldung = (slug: string, title: string, note?: string): Resource => ({
  kind: "article",
  title,
  url: `https://www.baeldung.com/${slug}`,
  note,
  lang: "en",
});

/** Habr search (RU articles) — always resolves, never 404 */
export const habr = (query: string, note?: string): Resource => ({
  kind: "article",
  title: `Статьи на Хабре: «${query}»`,
  url: `https://habr.com/ru/search/?q=${encodeURIComponent(query)}&target_type=posts&order=relevance`,
  note: note ?? "Подборка русскоязычных статей по теме",
  lang: "ru",
});

/** LeetCode problem by slug */
export const leetcode = (slug: string, title: string, note?: string): Resource => ({
  kind: "practice",
  title: `LeetCode: ${title}`,
  url: `https://leetcode.com/problems/${slug}/`,
  note,
  lang: "en",
});

/** CodingBat Java section, e.g. "Logic-1" */
export const codingbat = (section: string, note?: string): Resource => ({
  kind: "practice",
  title: `CodingBat: ${section}`,
  url: `https://codingbat.com/java/${section}`,
  note: note ?? "Короткие задачи с мгновенной автопроверкой прямо в браузере",
  lang: "en",
});

/** PostgreSQL official docs page, e.g. "tutorial-join.html" */
export const pgdocs = (page: string, title: string, note?: string): Resource => ({
  kind: "docs",
  title,
  url: `https://www.postgresql.org/docs/current/${page}`,
  note,
  lang: "en",
});

export const book = (title: string, note?: string): Resource => ({ kind: "book", title, note, lang: "ru" });

export const link = (
  kind: Resource["kind"],
  title: string,
  url: string,
  note?: string,
  lang: "ru" | "en" = "ru",
): Resource => ({ kind, title, url, note, lang });

/* ---------------- Frequently reused resources ---------------- */

export const JAVA_INTERVIEW_RU = link(
  "article",
  "enhorse/java-interview — вопросы и ответы к собеседованию",
  "https://github.com/enhorse/java-interview",
  "Самый популярный русскоязычный сборник вопросов на Java Junior/Middle",
);

export const PYTHON_TUTOR_JAVA = link(
  "tool",
  "Java Visualizer (Python Tutor)",
  "https://pythontutor.com/java.html",
  "Пошагово показывает стек, кучу и значения переменных — идеально для понимания",
  "en",
);

export const ROADMAP_JAVA = link("article", "roadmap.sh — Java Developer Roadmap", "https://roadmap.sh/java", "Карта навыков Java-разработчика", "en");
export const ROADMAP_BACKEND = link("article", "roadmap.sh — Backend Roadmap", "https://roadmap.sh/backend", "Что учить бэкендеру после Java Core", "en");
export const DEV_JAVA = link("docs", "dev.java — официальные уроки от Oracle", "https://dev.java/learn/", "Современный учебник по Java 17–21", "en");
export const METANIT_JAVA = link("docs", "Metanit: Руководство по Java", "https://metanit.com/java/tutorial/", "Подробный русскоязычный учебник — найди раздел по теме дня", "ru");
export const EXERCISM_JAVA = link("practice", "Exercism: Java track", "https://exercism.org/tracks/java/exercises", "Задачи с ревью от менторов", "en");
export const VISUALGO = (path: string, title: string) =>
  link("tool", `VisuAlgo: ${title}`, `https://visualgo.net/en/${path}`, "Анимированная визуализация структуры данных", "en");
export const REFACTORING_GURU = (pattern: string, title: string) =>
  link("article", `Refactoring.Guru: ${title}`, `https://refactoring.guru/ru/design-patterns/${pattern}`, "Паттерн с картинками и примерами на Java", "ru");
