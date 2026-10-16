import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { experience } from "./src/types/experience";
import { education } from "./src/types/education";
import { project } from "./src/types/project";
import { skillCategory } from "./src/types/skillcategory";
import { article } from "./src/types/article";
import { articleCategory } from "./src/types/articleCategory";
import { articleTag } from "./src/types/articleTag";
import { aboutContent, ABOUT_CONTENT_ID } from "./src/types/aboutContent";

export default defineConfig({
  name: "wmesiti-portfolio-cms",
  title: "Wmesiti Portfolio CMS",
  projectId: "9bdbnjzy",
  dataset: "production",
  plugins: [
    structureTool({
      // "À propos" is a singleton: one fixed document instead of a list
      structure: (S) =>
        S.list()
          .title("Contenu")
          .items([
            S.listItem()
              .title("À propos")
              .id(ABOUT_CONTENT_ID)
              .child(S.document().schemaType("aboutContent").documentId(ABOUT_CONTENT_ID)),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => item.getId() !== "aboutContent"),
          ]),
    }),
    visionTool(),
    codeInput(),
  ],
  schema: {
    types: [aboutContent, experience, education, project, skillCategory, article, articleCategory, articleTag],
    templates: (templates) => templates.filter((template) => template.schemaType !== "aboutContent"),
  },
  document: {
    actions: (actions, { schemaType }) =>
      schemaType === "aboutContent"
        ? actions.filter(({ action }) => action !== "duplicate" && action !== "delete" && action !== "unpublish")
        : actions,
  },
});
