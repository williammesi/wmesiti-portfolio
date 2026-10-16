import { timelineDescriptionBlock } from "./experience";

export const ABOUT_CONTENT_ID = "aboutContent";

const richText = (name: string, title: string, description?: string) => ({
  name,
  title,
  type: "array",
  of: [timelineDescriptionBlock],
  ...(description ? { description } : {}),
});

const englishHint = "Optionnel — la version française est utilisée si vide";

// Singleton holding the "About" section tabs on the homepage
export const aboutContent = {
  name: "aboutContent",
  title: "À propos",
  type: "document",
  fieldsets: [
    { name: "presentation", title: "Présentation", options: { collapsible: true } },
    { name: "hobbies", title: "Passe-temps", options: { collapsible: true } },
    { name: "goals", title: "Objectifs", options: { collapsible: true } },
  ],
  fields: [
    { ...richText("presentation", "Présentation"), fieldset: "presentation" },
    { ...richText("presentationEn", "Présentation (English)", englishHint), fieldset: "presentation" },
    { ...richText("hobbies", "Passe-temps"), fieldset: "hobbies" },
    { ...richText("hobbiesEn", "Passe-temps (English)", englishHint), fieldset: "hobbies" },
    { ...richText("goals", "Objectifs"), fieldset: "goals" },
    { ...richText("goalsEn", "Objectifs (English)", englishHint), fieldset: "goals" },
  ],
  preview: {
    prepare: () => ({ title: "À propos" }),
  },
};
