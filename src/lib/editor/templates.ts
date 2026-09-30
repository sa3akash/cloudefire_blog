export type { ArticleTemplate } from "./templates/types";
import { programmingTutorialTemplate } from "./templates/tutorial-templates";
import {
  techReviewTemplate,
  changelogTemplate,
  comparisonTemplate,
} from "./templates/editorial-templates";
import {
  architectureDeepDiveTemplate,
  apiDocTemplate,
} from "./templates/deep-dive-templates";
import {
  incidentPostMortemTemplate,
  caseStudyTemplate,
} from "./templates/devops-templates";
import type { ArticleTemplate } from "./templates/types";

export const ARTICLE_TEMPLATES: ArticleTemplate[] = [
  programmingTutorialTemplate,
  architectureDeepDiveTemplate,
  apiDocTemplate,
  techReviewTemplate,
  comparisonTemplate,
  changelogTemplate,
  caseStudyTemplate,
  incidentPostMortemTemplate,
];
