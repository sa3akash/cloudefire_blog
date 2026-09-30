export type { ArticleTemplate } from "./templates/types";
import { programmingTutorialTemplate } from "./templates/tutorial-templates";
import { techReviewTemplate, changelogTemplate, comparisonTemplate } from "./templates/editorial-templates";
import type { ArticleTemplate } from "./templates/types";

export const ARTICLE_TEMPLATES: ArticleTemplate[] = [
  programmingTutorialTemplate,
  techReviewTemplate,
  changelogTemplate,
  comparisonTemplate,
];
