import { input, select, checkbox, confirm } from "@inquirer/prompts";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";

export interface ProjectOptions {
  framework: "nextjs" | "vite";
  addons: string[];
}

export async function getProjectName(): Promise<string> {
  const projectName = await input({
    message: "What is your project name?",
    validate: (input: string) => {
      if (!input.trim()) {
        return "Project name is required";
      }

      // Check if directory already exists
      const projectPath = path.join(process.cwd(), input.trim());
      if (fs.existsSync(projectPath)) {
        return `Directory "${input}" already exists. Please choose a different name.`;
      }

      // Validate project name (basic npm package name rules)
      const validName = /^[a-z0-9-_]+$/i.test(input.trim());
      if (!validName) {
        return "Project name can only contain letters, numbers, hyphens, and underscores";
      }

      return true;
    },
    transformer: (input: string) => input.trim(),
  });

  return projectName.trim();
}

export async function getProjectOptions(): Promise<ProjectOptions> {
  console.log(chalk.gray("Let's configure your project:\n"));

  const framework = await select<"nextjs" | "vite">({
    message: "Which framework would you like to use?",
    choices: [
      {
        name: "Next.js",
        value: "nextjs",
      },
      {
        name: "Vite",
        value: "vite",
      },
    ],
    default: "nextjs",
  });

  const addons = await checkbox({
    message: "Which addons you like to use?",
    choices: [
      { name: "TanStack Query", value: "tanstack-query" },
      { name: "better-auth", value: "better-auth" },
      { name: "zustand", value: "zustand" },
    ],
  });

  return {
    framework,
    addons,
  };
}
