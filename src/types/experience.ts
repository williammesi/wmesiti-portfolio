// Experience document type
export const experience = {
  name: "experience",
  title: "Expérience",
  type: "document",
  fields: [
    {
      name: "company",
      title: "Entreprise",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "position",
      title: "Poste",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "logo",
      title: "Logo de l'entreprise",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "startDate",
      title: "Date de début",
      type: "date",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "endDate",
      title: "Date de fin",
      type: "date",
      description: "Laisser vide si le poste est toujours en cours",
    },
    {
      name: "current",
      title: "Poste actuel",
      type: "boolean",
      description: "Cocher si c'est votre poste actuel",
      initialValue: false,
    },
    {
      name: "description",
      title: "Description",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
          },
        },
      ],
    },
    {
      name: "skills",
      title: "Compétences utilisées",
      type: "array",
      of: [
        {
          type: "string",
        },
      ],
      options: {
        layout: "tags",
      },
    },
    {
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      description:
        "Ordre d'affichage de l'expérience (plus petit = affiché en premier)",
    },
  ],
  orderings: [
    {
      title: "Date de début (plus récent)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
    {
      title: "Ordre d'affichage",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "position",
      subtitle: "company",
      media: "logo",
    },
  },
};
