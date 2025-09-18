#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { createProject } from "./create-project.js";
import { getProjectName, getProjectOptions } from "./prompts.js";

const program = new Command();

program
  .name("x-starter")
  .description("Create a new React project with Next.js or Vite")
  .version("1.0.0")
  .argument("[project-name]", "Name of the project")
  .option("--framework <framework>", "Framework to use (nextjs|vite)")
  .option("--no-tailwind", "Skip Tailwind CSS")
  .option("--no-shadcn", "Skip shadcn/ui")
  .option("--no-pnpm", "Use npm instead of pnpm")
  .option("--no-git", "Skip git initialization")
  .action(async (projectName?: string, options?: any) => {
    console.log(chalk.blue.bold("\n🚀 Welcome to X-Starter!\n"));

    try {
      // Get project name if not provided
      const finalProjectName = projectName || (await getProjectName());

      // Get project configuration
      const projectOptions = options.framework
        ? {
            framework: options.framework as "nextjs" | "vite",
            addons: [],
          }
        : await getProjectOptions();

      // Create the project
      await createProject(finalProjectName, projectOptions);

      console.log(chalk.green.bold("\n✨ Project created successfully!\n"));
      console.log(chalk.cyan("Next steps:"));
      console.log(chalk.gray(`  cd ${finalProjectName}`));
      console.log(chalk.gray("  pnpm dev"));
      console.log(chalk.gray("\nHappy coding! 🎉\n"));
    } catch (error) {
      console.error(chalk.red.bold("\n❌ Error creating project:"));
      console.error(
        chalk.red(error instanceof Error ? error.message : String(error))
      );
      process.exit(1);
    }
  });

program.parse();
