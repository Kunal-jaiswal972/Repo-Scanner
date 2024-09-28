import { exec } from "child_process";
import path from "path";
import fs from "fs/promises";
import chalk from "chalk";

export const checkVulnerabilities = async (req, res) => {
  const gitUrl = req.body.gitUrl;

  if (!gitUrl) {
    return res.status(400).send("Git URL is required");
  }

  const idMatch = gitUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!idMatch) {
    return res.status(400).send("Invalid GitHub URL");
  }

  const id = `${idMatch[1]}_${idMatch[2]}`;
  const outputDir = path.resolve(process.cwd(), "output");
  const reportPath = path.join(outputDir, `report_${id}.json`);

  try {
    await fs.access(outputDir);
  } catch {
    await fs.mkdir(outputDir, { recursive: true });
  }

  const cmd = `docker run --rm -v "${outputDir}:/app/output" --entrypoint sh repo-scanner -c "git clone ${gitUrl} /app/repo && gitleaks detect --source=/app/repo --report-format=json --report-path=/app/output/report_${id}.json"`;

  const task = exec(cmd);

  task.stdout.on("data", (data) => {
    data
      .toString()
      .split("\n")
      .forEach((line) => {
        if (line) {
          console.log(chalk.green(`[STDOUT DATA] ${line}`));
        }
      });
  });

  task.stderr.on("data", (data) => {
    data
      .toString()
      .split("\n")
      .forEach((line) => {
        if (line) {
          console.error(chalk.red(`[STDERR DATA] ${line}`));
        }
      });
  });

  task.on("error", (error) => {
    console.error(chalk.red(`Error executing command: ${error.message}`));
    return res.status(500).send("Error executing command");
  });

  task.on("close", async (code) => {
    console.log(chalk.blue(`Process exited with code ${code}`));
    console.log(chalk.cyan(`Task completed successfully for ${gitUrl}`));
    try {
      const report = await fs.readFile(reportPath, "utf-8");
      return res.status(200).json({
        message: "success",
        repo: gitUrl,
        report: JSON.parse(report),
      });
    } catch (readError) {
      console.error(chalk.red(`Error reading report: ${readError.message}`));
      return res.status(500).send("Error reading the report");
    }
  });
};
