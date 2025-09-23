import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { experience } from "./src/types/experience";
import { project } from "./src/types/project";
import { skillCategory } from "./src/types/skillcategory";

export default defineConfig({
  name: "wmesiti-portfolio-cms",
  title: "Wmesiti Portfolio CMS",
  projectId: "9bdbnjzy",
  dataset: "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [experience, project, skillCategory],
  },
});
