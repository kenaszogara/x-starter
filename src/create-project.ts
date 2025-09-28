import path from "path";
import fs from "fs-extra";
import ora from "ora";
import { execa } from "execa";
import { fileURLToPath } from "url";
import { ProjectOptions } from "./prompts.js";
import { copyTemplate, processTemplateFiles } from "./template-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createProject(
  projectName: string,
  options: ProjectOptions
): Promise<void> {
  const projectPath = path.join(process.cwd(), projectName);

  // Create project directory
  let spinner = ora("Creating project directory...").start();
  await fs.ensureDir(projectPath);
  spinner.succeed("Project directory created");

  // Copy base template
  spinner = ora("Setting up project files...").start();
  const templateName =
    options.framework === "nextjs" ? "nextjs-base" : "vite-base";
  const templatePath = path.join(__dirname, "..", "templates", templateName);

  await copyTemplate(templatePath, projectPath);

  // Process template variables
  await processTemplateFiles(projectPath, {
    projectName,
    ...options,
  });

  spinner.succeed("Project files set up");

  // Install base dependencies first
  spinner = ora("Installing dependencies...").start();
  const packageManager = "pnpm";

  try {
    await execa(packageManager, ["install"], {
      cwd: projectPath,
      stdio: "pipe",
    });
    spinner.succeed("Dependencies installed");
  } catch (error) {
    spinner.fail("Failed to install dependencies");
    throw new Error(`Failed to install dependencies: ${error}`);
  }

  // ADDONS SETUP START:
  // PRIORITY: ZUSTAND > TANSTACK QUERY

  // Setup Tanstack Query
  if (options.addons.includes("tanstack-query")) {
    await setupTanstackQuery({
      projectPath,
      packageManager,
      framework: options.framework,
    });
  }

  if (options.addons.includes("zustand")) {
    await setupZustandStore({
      projectPath,
      packageManager,
      framework: options.framework,
    });
  }

  // ADDONS SETUP EN

  // git init step
  spinner = ora("Initializing Git repository...").start();
  try {
    await execa("git", ["init"], { cwd: projectPath, stdio: "pipe" });
    spinner.succeed("Git repository initialized");
  } catch (error) {
    spinner.fail("Git initialization failed (git may not be installed)");
  }

  // format all files with prettier
  spinner = ora("Formatting files with prettier...").start();
  try {
    await execa("prettier", ["--write", "."], {
      cwd: projectPath,
      stdio: "pipe",
    });
    spinner.succeed("Files formatted with prettier");
  } catch (error) {
    spinner.fail("Failed to format files with prettier");
  }
}

/**
 *  Setup Tanstack Query
 */
async function setupTanstackQuery({
  projectPath,
  packageManager,
  framework,
}: {
  projectPath: string;
  packageManager: string;
  framework: string;
}) {
  const spinner = ora("Setting up Tanstack Query...").start();

  // install dev dependencies
  await execa(
    packageManager,
    ["add", "@tanstack/react-query", "@tanstack/react-query-devtools"],
    {
      cwd: projectPath,
      stdio: "pipe",
    }
  );

  // create directory if it doesn't exist
  await fs.ensureDir(path.join(projectPath, "src/components/providers"));
  await fs.copy(
    path.join(__dirname, "..", "stubs", "query-provider.tsx"),
    path.join(projectPath, "src/components/providers/query-provider.tsx")
  );

  // if framework is nextjs, add <QueryProvider> to src/app/layout.tsx
  if (framework === "nextjs") {
    let layout = "";
    layout = fs.readFileSync(
      path.join(projectPath, "src/app/layout.tsx"),
      "utf-8"
    );

    // add import statement for QueryProvider after the "import "./globals.css";" line
    const globalsCssRegex = /import ['"]\.\/globals\.css['"];/;
    const matchGlobalsCss = layout.match(globalsCssRegex);
    if (matchGlobalsCss) {
      const content = matchGlobalsCss[0];
      const newMainContent = `${content}\nimport { QueryProvider } from '@/components/providers/query-provider';`;
      layout = layout.replace(globalsCssRegex, newMainContent);
    }

    // modify the app/layout.tsx and insert <QueryProvider> after the body tag
    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/;
    const match = layout.match(bodyRegex);
    if (match) {
      const bodyContent = match[1];
      const bodyAttributes = layout.match(/<body([^>]*)>/)?.[1] || "";
      const newBodyContent = `<QueryProvider>${bodyContent}</QueryProvider>`;
      layout = layout.replace(
        bodyRegex,
        `<body${bodyAttributes}>${newBodyContent}</body>`
      );
    }
    await fs.writeFile(path.join(projectPath, "src/app/layout.tsx"), layout);
  }

  // if framework is vite, add <QueryProvider> to src/routes/__root.tsx
  if (framework === "vite") {
    let root = "";
    root = fs.readFileSync(
      path.join(projectPath, "src/routes/__root.tsx"),
      "utf-8"
    );

    // add import statement for QueryProvider after the first line of the file
    root =
      "import { QueryProvider } from '@/components/providers/query-provider'\n" +
      root;

    // modify the root element and insert <QueryProvider>
    const rootElementRegex = /<[^>]*>([\s\S]*?)<\/>/;
    const match = root.match(rootElementRegex);
    if (match) {
      const content = match[1];
      const newMainContent = `<QueryProvider>${content}</QueryProvider>`;
      root = root.replace(rootElementRegex, `<>${newMainContent}</>`);
    }
    await fs.writeFile(path.join(projectPath, "src/routes/__root.tsx"), root);
  }

  spinner.succeed(`Tanstack query setup with dependencies:
    - @tanstack/react-query
    - @tanstack/react-query-devtools
    `);
}

/**
 * Setup zustand store
 */
async function setupZustandStore({
  projectPath,
  packageManager,
  framework,
}: {
  projectPath: string;
  packageManager: string;
  framework: string;
}) {
  const spinner = ora("Setting up Zustand store...").start();

  // Step 1: install zustand & immer
  await execa(packageManager, ["add", "zustand", "immer"], {
    cwd: projectPath,
    stdio: "pipe",
  });

  // Step 2: copy stub files to project
  await fs.ensureDir(path.join(projectPath, "src/store"));
  await copyTemplate(
    path.join(__dirname, "..", "stubs", "store"),
    path.join(projectPath, "src/store")
  );

  // Step 3: inject provider to layout/root
  if (framework === "nextjs") {
    let layout = "";
    layout = fs.readFileSync(
      path.join(projectPath, "src/app/layout.tsx"),
      "utf-8"
    );

    // add import statement for RootStoreProvider after the "import "./globals.css";" line
    const globalsCssRegex = /import ['"]\.\/globals\.css['"];/;
    const matchGlobalsCss = layout.match(globalsCssRegex);
    if (matchGlobalsCss) {
      const content = matchGlobalsCss[0];
      const newMainContent = `${content}\nimport { RootStoreProvider } from '@/store/store-provider';`;
      layout = layout.replace(globalsCssRegex, newMainContent);
    }

    // modify the app/layout.tsx and insert <RootStoreProvider> after the body tag
    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/;
    const match = layout.match(bodyRegex);
    if (match) {
      const bodyContent = match[1];
      const bodyAttributes = layout.match(/<body([^>]*)>/)?.[1] || "";
      const newBodyContent = `<RootStoreProvider>${bodyContent}</RootStoreProvider>`;
      layout = layout.replace(
        bodyRegex,
        `<body${bodyAttributes}>${newBodyContent}</body>`
      );
    }
    await fs.writeFile(path.join(projectPath, "src/app/layout.tsx"), layout);
  }

  if (framework === "vite") {
    let root = "";
    root = fs.readFileSync(
      path.join(projectPath, "src/routes/__root.tsx"),
      "utf-8"
    );

    // add import statement for RootStoreProvider after the first line of the file
    root =
      "import { RootStoreProvider } from '@/store/store-provider';\n" + root;

    // modify the root element and insert <RootStoreProvider>
    const rootElementRegex = /<[^>]*>([\s\S]*?)<\/>/;
    const match = root.match(rootElementRegex);
    if (match) {
      const content = match[1];
      const newMainContent = `<RootStoreProvider>${content}</RootStoreProvider>`;
      root = root.replace(rootElementRegex, `<>${newMainContent}</>`);
    }
    await fs.writeFile(path.join(projectPath, "src/routes/__root.tsx"), root);
  }

  spinner.succeed(`Zustand store setup with dependencies:
    - zustand
    - immer
    `);
}
