const languageOptions = [
  { title: "Français (Canada)", value: "fr-CA" },
  { title: "English", value: "en" },
];

export const article = {
  name: "article",
  title: "Article technique",
  type: "document",
  groups: [
    { name: "editorial", title: "Contenu", default: true },
    { name: "organization", title: "Organisation" },
    { name: "seo", title: "SEO et partage" },
    { name: "translation", title: "Traduction" },
  ],
  initialValue: {
    language: "fr-CA",
    featured: false,
    author: "William Mesiti",
  },
  fields: [
    {
      name: "language",
      title: "Langue",
      type: "string",
      group: "editorial",
      options: { list: languageOptions, layout: "radio" },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "title",
      title: "Titre",
      type: "string",
      group: "editorial",
      validation: (Rule: any) => Rule.required().max(100),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      description: "Stable après la première publication.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "Résumé",
      type: "text",
      rows: 3,
      group: "editorial",
      description: "Résumé utilisé dans les listes et comme description SEO par défaut.",
      validation: (Rule: any) => Rule.required().min(40).max(240),
    },
    {
      name: "coverImage",
      title: "Image de couverture",
      type: "image",
      group: "editorial",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Texte alternatif",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        { name: "caption", title: "Légende", type: "string" },
      ],
    },
    {
      name: "body",
      title: "Contenu",
      type: "array",
      group: "editorial",
      validation: (Rule: any) => Rule.required().min(1),
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Titre 2", value: "h2" },
            { title: "Titre 3", value: "h3" },
            { title: "Titre 4", value: "h4" },
            { title: "Citation", value: "blockquote" },
          ],
          lists: [
            { title: "Puces", value: "bullet" },
            { title: "Numérotée", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                title: "Lien externe",
                type: "object",
                fields: [
                  {
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (Rule: any) => Rule.required().uri({ scheme: ["http", "https", "mailto"] }),
                  },
                ],
              },
              {
                name: "internalLink",
                title: "Article interne",
                type: "object",
                fields: [
                  {
                    name: "reference",
                    title: "Article",
                    type: "reference",
                    to: [{ type: "article" }],
                    validation: (Rule: any) => Rule.required(),
                  },
                ],
              },
              {
                name: "inlineEquation",
                title: "Formule LaTeX en ligne",
                type: "object",
                fields: [
                  { name: "latex", title: "LaTeX", type: "string", validation: (Rule: any) => Rule.required() },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Texte alternatif",
              type: "string",
              validation: (Rule: any) => Rule.required(),
            },
            { name: "caption", title: "Légende", type: "string" },
          ],
        },
        {
          type: "code",
          title: "Code source",
          options: {
            withFilename: true,
            language: "typescript",
            languageAlternatives: [
              { title: "TypeScript", value: "typescript" },
              { title: "JavaScript", value: "javascript" },
              { title: "Python", value: "python" },
              { title: "Java", value: "java" },
              { title: "C#", value: "csharp" },
              { title: "C/C++", value: "cpp" },
              { title: "HTML", value: "html" },
              { title: "CSS", value: "css" },
              { title: "Shell", value: "bash" },
              { title: "JSON", value: "json" },
              { title: "SQL", value: "sql" },
              { title: "Plain text", value: "text" },
            ],
          },
        },
        {
          name: "equation",
          title: "Équation LaTeX",
          type: "object",
          fields: [
            { name: "latex", title: "LaTeX", type: "text", rows: 3, validation: (Rule: any) => Rule.required() },
            { name: "display", title: "Équation sur une ligne séparée", type: "boolean", initialValue: true },
          ],
          preview: { select: { title: "latex" }, prepare: ({ title }: any) => ({ title: title || "Équation" }) },
        },
        {
          name: "table",
          title: "Tableau",
          type: "object",
          fields: [
            { name: "caption", title: "Légende", type: "string" },
            { name: "hasHeader", title: "Première ligne comme en-tête", type: "boolean", initialValue: true },
            {
              name: "rows",
              title: "Lignes",
              type: "array",
              validation: (Rule: any) => Rule.required().min(1),
              of: [{ type: "object", name: "tableRow", fields: [{ name: "cells", title: "Cellules", type: "array", of: [{ type: "string" }], validation: (Rule: any) => Rule.required().min(1) }] }],
            },
          ],
        },
        { name: "divider", title: "Séparateur", type: "object", fields: [{ name: "label", title: "Libellé accessible (optionnel)", type: "string" }] },
      ],
    },
    {
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
      group: "editorial",
      validation: (Rule: any) => Rule.required(),
    },
    { name: "updatedAt", title: "Dernière mise à jour", type: "datetime", group: "editorial" },
    {
      name: "author",
      title: "Auteur",
      type: "string",
      group: "editorial",
      validation: (Rule: any) => Rule.required(),
    },
    { name: "category", title: "Catégorie principale", type: "reference", to: [{ type: "articleCategory" }], group: "organization" },
    { name: "tags", title: "Étiquettes", type: "array", of: [{ type: "reference", to: [{ type: "articleTag" }] }], group: "organization" },
    { name: "featured", title: "Article en vedette", type: "boolean", group: "organization" },
    { name: "seoTitle", title: "Titre SEO", type: "string", group: "seo", validation: (Rule: any) => Rule.max(70) },
    { name: "seoDescription", title: "Description SEO", type: "text", rows: 2, group: "seo", validation: (Rule: any) => Rule.max(170) },
    { name: "socialImage", title: "Image de partage", type: "image", group: "seo", options: { hotspot: true } },
    { name: "externalCanonicalUrl", title: "URL canonique externe", type: "url", group: "seo" },
    {
      name: "translation",
      title: "Version traduite",
      type: "reference",
      to: [{ type: "article" }],
      group: "translation",
      description: "L'article indépendant correspondant dans l'autre langue.",
      options: {
        filter: ({ document }: any) => ({
          filter: "language != $language && _id != $id",
          params: { language: document.language, id: document._id.replace(/^drafts\./, "") },
        }),
      },
    },
  ],
  orderings: [{ title: "Publication récente", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", language: "language", date: "publishedAt", media: "coverImage" },
    prepare: ({ title, language, date, media }: any) => ({
      title,
      subtitle: `${language === "fr-CA" ? "FR" : "EN"} · ${date ? new Date(date).toLocaleDateString("fr-CA") : "Brouillon"}`,
      media,
    }),
  },
};
