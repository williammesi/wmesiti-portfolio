// Skill category document type
export const skillCategory = {
  name: "skillCategory",
  title: "Catégorie de compétences",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Nom de la catégorie",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    },
    {
      name: "skills",
      title: "Compétences",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Nom de la compétence",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "colorScheme",
              title: "Couleur de la catégorie",
              type: "string",
              options: {
                list: [
                  { title: "Indigo/Violet", value: "indigo" },
                  { title: "Silver/Black", value: "silver" },
                  { title: "Bleu/Cyan", value: "blue" },
                  { title: "Vert/Émeraude", value: "green" },
                  { title: "Orange/Rouge", value: "orange" },
                  { title: "Rose/Violet", value: "pink" },
                  { title: "Jaune/Ambre", value: "yellow" },
                ],
              },
              initialValue: "indigo",
            },
            {
              name: "icon",
              title: "Icône",
              type: "image",
              description: "Icône de la technologie (format SVG recommandé)",
            },
            {
              name: "iconUrl",
              title: "URL de l'icône",
              type: "url",
              description:
                "Alternative: URL vers une icône externe (ex: devicons)",
            },
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "level",
              media: "icon",
            },
          },
        },
      ],
    },
    {
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      description:
        "Ordre d'affichage de la catégorie (plus petit = affiché en premier)",
    },
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
    },
  },
};
