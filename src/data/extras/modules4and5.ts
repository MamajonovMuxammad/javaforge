import type { LessonExtras } from "../types";
import { module4SqlGitExtras } from "./module4-sql-git";
import { module5SpringDockerExtras } from "./module5-spring-docker";

export const modules4and5Extras: Record<number, LessonExtras> = {
  ...module4SqlGitExtras,
  ...module5SpringDockerExtras,
};
