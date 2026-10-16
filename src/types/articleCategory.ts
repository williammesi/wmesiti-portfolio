export const articleCategory = {
  name: "articleCategory",
  title: "Catégorie d'article",
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
    {
      name: "descriptionFr",
      title: "Description française",
      type: "text",
      rows: 2,
    },
    {
      name: "descriptionEn",
      title: "Description anglaise",
      type: "text",
      rows: 2,
    },
  ],
  preview: {
    select: { title: "titleFr", subtitle: "titleEn" },
  },
};
