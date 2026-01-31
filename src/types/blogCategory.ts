// Blog Category document type with optional password protection
export const blogCategory = {
    name: "blogCategory",
    title: "Catégorie de Blog",
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
        },
        {
            name: "isProtected",
            title: "Catégorie protégée",
            type: "boolean",
            description: "Activer la protection par mot de passe pour cette catégorie",
            initialValue: false,
        },
        {
            name: "passwordHash",
            title: "Mot de passe (haché)",
            type: "string",
            description: "Hash SHA-256 du mot de passe. Utilisez un générateur de hash SHA-256 pour créer le hash.",
            hidden: ({ parent }: { parent: { isProtected?: boolean } }) => !parent?.isProtected,
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
            title: "Ordre d'affichage",
            name: "orderAsc",
            by: [{ field: "order", direction: "asc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            isProtected: "isProtected",
        },
        prepare(selection: Record<string, any>) {
            const { title, isProtected } = selection;
            return {
                title: title,
                subtitle: isProtected ? "🔒 Protégé" : "🌐 Public",
            };
        },
    },
};
