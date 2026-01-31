// Blog Post document type with category reference and Portable Text content
export const blogPost = {
    name: "blogPost",
    title: "Article de Blog",
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
            name: "category",
            title: "Catégorie",
            type: "reference",
            to: [{ type: "blogCategory" }],
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "excerpt",
            title: "Extrait",
            type: "text",
            rows: 3,
            description: "Court résumé de l'article affiché dans les listes",
            validation: (Rule: any) => Rule.required().max(300),
        },
        {
            name: "coverImage",
            title: "Image de couverture",
            type: "image",
            options: {
                hotspot: true,
            },
        },
        {
            name: "content",
            title: "Contenu",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "H2", value: "h2" },
                        { title: "H3", value: "h3" },
                        { title: "H4", value: "h4" },
                        { title: "Quote", value: "blockquote" },
                    ],
                    marks: {
                        decorators: [
                            { title: "Bold", value: "strong" },
                            { title: "Italic", value: "em" },
                            { title: "Code", value: "code" },
                        ],
                        annotations: [
                            {
                                name: "link",
                                type: "object",
                                title: "Lien",
                                fields: [
                                    {
                                        name: "href",
                                        type: "url",
                                        title: "URL",
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    type: "image",
                    options: {
                        hotspot: true,
                    },
                    fields: [
                        {
                            name: "alt",
                            type: "string",
                            title: "Texte alternatif",
                        },
                        {
                            name: "caption",
                            type: "string",
                            title: "Légende",
                        },
                    ],
                },
                {
                    type: "code",
                    title: "Code",
                    options: {
                        language: "javascript",
                        languageAlternatives: [
                            { title: "JavaScript", value: "javascript" },
                            { title: "TypeScript", value: "typescript" },
                            { title: "Python", value: "python" },
                            { title: "HTML", value: "html" },
                            { title: "CSS", value: "css" },
                            { title: "Bash", value: "bash" },
                            { title: "JSON", value: "json" },
                        ],
                    },
                },
            ],
        },
        {
            name: "publishedAt",
            title: "Date de publication",
            type: "datetime",
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: "featured",
            title: "Article mis en avant",
            type: "boolean",
            initialValue: false,
        },
        {
            name: "order",
            title: "Ordre d'affichage",
            type: "number",
            description: "Ordre d'affichage (plus petit = affiché en premier)",
        },
    ],
    orderings: [
        {
            title: "Date de publication (plus récent)",
            name: "publishedAtDesc",
            by: [{ field: "publishedAt", direction: "desc" }],
        },
        {
            title: "Ordre d'affichage",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            category: "category.title",
            media: "coverImage",
            publishedAt: "publishedAt",
        },
        prepare(selection: Record<string, any>) {
            const { title, category, media, publishedAt } = selection;
            const date = publishedAt
                ? new Date(publishedAt).toLocaleDateString("fr-FR")
                : "Non publié";
            return {
                title: title,
                subtitle: `${category || "Sans catégorie"} • ${date}`,
                media: media,
            };
        },
    },
};
