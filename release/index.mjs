import { execSync } from "child_process";
import { confirm } from "@inquirer/prompts";
import { select } from "@inquirer/prompts";
import chalk from "chalk";

const log = (output) => console.log(chalk.white(output.toString()));
const info = (message) => console.info(chalk.green(message));
const error = (message) => console.error(chalk.red(message));

try {
  const releaseType = await select({
    message: "Select release type",
    choices: [
      {
        name: "major",
        value: "major",
      },
      {
        name: "minor",
        value: "minor",
      },
      {
        name: "patch",
        value: "patch",
      },
    ],
  });

  const releaseOk = await confirm({
    message: `Release ${releaseType} version`,
    default: false,
  });

  if (!releaseOk) process.exit(0);

  info("--- Fetch and Checkout ---");
  log(execSync("git fetch origin release && git checkout -B release"));
  log(execSync("git checkout main && git pull origin main"));

  info("--- Merge and Add tag ---");
  log(execSync("git merge --squash release && git commit --no-edit"));
  const tagName = execSync(`cd .. && npm version ${releaseType}`)
    .toString()
    .trim();

  info("--- Push to remote ---");
  log(execSync(`git push origin main`));
  log(execSync(`git push origin ${tagName}`));

  info("--- Delete release branch ---");
  log(execSync(`git branch -D release`));
  log(execSync(`git push origin --delete release`));

  info("Release Success!!");
} catch (err) {
  error("Release Failed");
}
