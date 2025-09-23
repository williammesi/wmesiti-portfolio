import { init } from "astro/virtual-modules/prefetch.js";
import { validation } from "sanity";

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
      name: "summary",
      title: "Résumé",
      type: "text",
      rows: 3,
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
      name: "status",
      title: "Statut du projet",
      type: "string",
      options: {
        list: [
          { title: "Complété", value: "completed" },
          { title: "En cours", value: "inProgress" },
        ],
      },
      initialValue: "indigo",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "year",
      title: "Année du projet",
      type: "number",
      validation: (Rule: any) =>
        Rule.required().min(2000).max(new Date().getFullYear()),
      initialValue: new Date().getFullYear(),
    },

    {
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "image1",
      title: "Image principale",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "image2",
      title: "Image secondaire",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "image3",
      title: "Image secondaire 2",
      type: "image",
      options: {
        hotspot: true,
      },
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
      name: "features",
      title: "Fonctionnalités",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "name",
              title: "Nom de la fonctionnalité",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "description",
              title: "Description de la fonctionnalité",
              type: "string",
              validation: (Rule: any) => Rule.required(),
              options: {
                rows: "3",
              },
            },

            {
              name: "image",
              title: "Image de la fonctionnalité",
              type: "image",
              description:
                "Image de la fonctionnalité (format SVG recommandé, ratio 1:1)",
            },
          ],
          preview: {
            select: {
              title: "name",
              media: "image",
            },
          },
        },
      ],
    },
    {
      name: "challenges",
      title: "Défis et solutions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "challengeName",
              title: "Nom du défi",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "challengeDescription",
              title: "Description du défi",
              type: "string",
              validation: (Rule: any) => Rule.required(),
              options: {
                rows: "3",
              },
            },
            {
              name: "solutionName",
              title: "Nom de la solution",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "solutionDescription",
              title: "Description de la solution",
              type: "string",
              validation: (Rule: any) => Rule.required(),
              options: {
                rows: "3",
              },
            },
          ],
          preview: {
            select: {
              title: "name",
              media: "image",
            },
          },
        },
      ],
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
