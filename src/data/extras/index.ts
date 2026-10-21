import type { LessonExtras } from "../types";
import { module1Extras } from "./module1";
import { module2Extras } from "./module2";
import { module3Extras } from "./module3";
import { modules4and5Extras } from "./modules4and5";

export { module1Extras } from "./module1";
export { module2Extras } from "./module2";
export { module3Extras } from "./module3";
export { modules4and5Extras } from "./modules4and5";

export const allExtras: Record<number, LessonExtras> = {
  ...module1Extras,
  ...module2Extras,
  ...module3Extras,
  ...modules4and5Extras,
};

export function getLessonExtras(day: number): LessonExtras | undefined {
  return allExtras[day];
}
