// Weekly Log document type for structured internship reports
export const weeklyLog = {
    name: "weeklyLog",
    title: "Journal Hebdomadaire",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Titre",
            type: "string",
            description: "Ex: Semaine 1 - 5 février 2024",
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
            name: "weekNumber",
            title: "Numéro de semaine",
            type: "number",
            description: "Numéro de la semaine de stage",
            validation: (Rule: any) => Rule.required().min(1),
        },
        {
            name: "publishedAt",
            title: "Date de publication",
            type: "datetime",
            validation: (Rule: any) => Rule.required(),
        },

        // Part 1: Tasks of the week
        {
            name: "part1Tasks",
            title: "Partie 1 : Tâches de la semaine",
            description: "Liste des tâches prévues dans la semaine",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "taskName",
                            title: "Tâche",
                            type: "string",
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: "completed",
                            title: "Complétée",
                            type: "boolean",
                            initialValue: false,
                        },
                    ],
                    preview: {
                        select: {
                            title: "taskName",
                            completed: "completed",
                        },
                        prepare(selection: Record<string, any>) {
                            const { title, completed } = selection;
                            return {
                                title: title,
                                subtitle: completed ? "✅ Complétée" : "⏳ En cours",
                            };
                        },
                    },
                },
            ],
        },

        // Part 2: Supervisor Q&A
        {
            name: "part2SupervisorQA",
            title: "Partie 2 : Questions au responsable de stage",
            description: "Questions posées au responsable et réponses obtenues",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "question",
                            title: "Question",
                            type: "text",
                            rows: 2,
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: "answer",
                            title: "Réponse",
                            type: "text",
                            rows: 3,
                        },
                    ],
                    preview: {
                        select: {
                            title: "question",
                            answer: "answer",
                        },
                        prepare(selection: Record<string, any>) {
                            const { title, answer } = selection;
                            return {
                                title: title?.substring(0, 50) + (title?.length > 50 ? "..." : ""),
                                subtitle: answer ? "✅ Répondu" : "❓ En attente",
                            };
                        },
                    },
                },
            ],
        },

        // Part 3: Teacher Q&A
        {
            name: "part3TeacherQA",
            title: "Partie 3 : Questions au superviseur-enseignant",
            description: "Questions posées à l'enseignant et réponses obtenues",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "question",
                            title: "Question",
                            type: "text",
                            rows: 2,
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: "answer",
                            title: "Réponse",
                            type: "text",
                            rows: 3,
                        },
                    ],
                    preview: {
                        select: {
                            title: "question",
                            answer: "answer",
                        },
                        prepare(selection: Record<string, any>) {
                            const { title, answer } = selection;
                            return {
                                title: title?.substring(0, 50) + (title?.length > 50 ? "..." : ""),
                                subtitle: answer ? "✅ Répondu" : "❓ En attente",
                            };
                        },
                    },
                },
            ],
        },

        // Part 4: Personal notes (Portable Text)
        {
            name: "part4Notes",
            title: "Partie 4 : Notes personnelles",
            description: "Notes, rappels, checklist et actions à accomplir",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "H3", value: "h3" },
                        { title: "H4", value: "h4" },
                    ],
                    lists: [
                        { title: "Bullet", value: "bullet" },
                        { title: "Numbered", value: "number" },
                        { title: "Checklist", value: "checkbox" },
                    ],
                    marks: {
                        decorators: [
                            { title: "Bold", value: "strong" },
                            { title: "Italic", value: "em" },
                            { title: "Strikethrough", value: "strike-through" },
                        ],
                    },
                },
            ],
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
            title: "Semaine (plus récent)",
            name: "weekDesc",
            by: [{ field: "weekNumber", direction: "desc" }],
        },
        {
            title: "Date de publication",
            name: "publishedAtDesc",
            by: [{ field: "publishedAt", direction: "desc" }],
        },
    ],
    preview: {
        select: {
            title: "title",
            category: "category.title",
            weekNumber: "weekNumber",
        },
        prepare(selection: Record<string, any>) {
            const { title, category, weekNumber } = selection;
            return {
                title: title,
                subtitle: `${category || "Sans catégorie"} • Semaine ${weekNumber}`,
            };
        },
    },
};
