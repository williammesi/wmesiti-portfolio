export const articleTag = {
  name: "articleTag",
  title: "Étiquette d'article",
  type: "document",
  fields: [
    {
      name: "titleFr",
      title: "Nom français",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "titleEn",
      title: "Nom anglais",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Identifiant URL",
      type: "slug",
      options: { source: "titleFr", maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: { title: "titleFr", subtitle: "titleEn" },
  },
};
