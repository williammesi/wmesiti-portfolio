import { timelineDescriptionBlock } from "./experience";

// Education document type — mirrors the experience format
export const education = {
  name: "education",
  title: "Formation",
  type: "document",
  fields: [
    {
      name: "institution",
      title: "Établissement",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "program",
      title: "Programme / Diplôme",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "programEn",
      title: "Programme / Diplôme (English)",
      type: "string",
      description: "Optionnel — le programme en français est utilisé si vide",
    },
    {
      name: "logo",
      title: "Logo de l'établissement",
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
      description: "Laisser vide si la formation est toujours en cours",
    },
    {
      name: "current",
      title: "Formation en cours",
      type: "boolean",
      description: "Cocher si c'est votre formation actuelle",
      initialValue: false,
    },
    {
      name: "description",
      title: "Description",
      type: "array",
      of: [timelineDescriptionBlock],
    },
    {
      name: "descriptionEn",
      title: "Description (English)",
      type: "array",
      description: "Optionnel — la description en français est utilisée si vide",
      of: [timelineDescriptionBlock],
    },
    {
      name: "skills",
      title: "Compétences acquises",
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
        "Ordre d'affichage de la formation (plus petit = affiché en premier)",
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
      title: "program",
      subtitle: "institution",
      media: "logo",
    },
  },
};
