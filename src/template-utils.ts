import path from "path";
import fs from "fs-extra";

interface TemplateVariables {
  projectName: string;
  framework: string;
}

export async function copyTemplate(
  templatePath: string,
  targetPath: string
): Promise<void> {
  if (!(await fs.pathExists(templatePath))) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  await fs.copy(templatePath, targetPath, {
    filter: (src) => {
      // Skip node_modules and other unnecessary files
      const relativePath = path.relative(templatePath, src);
      return (
        !relativePath.includes("node_modules") && !relativePath.includes("dist")
      );
    },
  });
}

export async function processTemplateFiles(
  projectPath: string,
  variables: TemplateVariables
): Promise<void> {
  const filesToProcess = [
    "package.json",
    "README.md",
    ".cta.json",
    "index.html",
  ];

  for (const fileName of filesToProcess) {
    const filePath = path.join(projectPath, fileName);

    if (await fs.pathExists(filePath)) {
      let content = await fs.readFile(filePath, "utf-8");

      // Replace template variables
      content = content.replace(/{{projectName}}/g, variables.projectName);
      content = content.replace(/{{framework}}/g, variables.framework);

      await fs.writeFile(filePath, content);
    }
  }
}
