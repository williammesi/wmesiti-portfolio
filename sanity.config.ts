import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { experience } from "./src/types/experience";
import { project } from "./src/types/project";
import { skillCategory } from "./src/types/skillcategory";
import { blogCategory } from "./src/types/blogCategory";
import { blogPost } from "./src/types/blogPost";
import { weeklyLog } from "./src/types/weeklyLog";

export default defineConfig({
  name: "wmesiti-portfolio-cms",
  title: "Wmesiti Portfolio CMS",
  projectId: "9bdbnjzy",
  dataset: "production",
  plugins: [structureTool(), visionTool(), codeInput()],
  schema: {
    types: [experience, project, skillCategory, blogCategory, blogPost, weeklyLog],
  },
});
