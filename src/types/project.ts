// Project document type
export const project = {
  name: "project",
  title: "Projet",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "image",
      title: "Image principale",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "technologies",
      title: "Technologies utilisées",
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
      name: "githubUrl",
      title: "URL GitHub",
      type: "url",
      validation: (Rule: any) =>
        Rule.uri({
          scheme: ["http", "https"],
        }),
    },
    {
      name: "liveUrl",
      title: "URL du projet en ligne",
      type: "url",
      validation: (Rule: any) =>
        Rule.uri({
          scheme: ["http", "https"],
        }),
    },
    {
      name: "featured",
      title: "Projet mis en avant",
      type: "boolean",
      description: "Afficher ce projet en premier",
      initialValue: false,
    },
    {
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      description:
        "Ordre d'affichage du projet (plus petit = affiché en premier)",
    },
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Date de création",
      name: "createdAtDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      subtitle: "description",
    },
  },
};
