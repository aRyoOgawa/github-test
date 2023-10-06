import fs from "fs";
import open from "open";
import { execSync } from "child_process";
import { confirm } from "@inquirer/prompts";
import { select } from "@inquirer/prompts";
import chalk from "chalk";

const outlog = (msg) => console.log(chalk.white(msg));
const cmdlog = (msg) => console.log(chalk.blueBright(msg));
const info = (msg) => console.info(chalk.green(msg));
const error = (msg) => console.error(chalk.red(msg));

const cmdExec = (cmd) => {
  cmdlog(cmd);
  const output = execSync(cmd).toString().trim();
  outlog(output);
  return output;
};

try {
  cmdExec("git checkout main && git pull origin main");
  const data = fs.readFileSync("../package.json", "utf8");
  const packageJson = JSON.parse(data);
  info(`current version: ${packageJson.version}`);

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

  cmdExec("git fetch origin release && git checkout -B release");
  cmdExec("git checkout main");
  info("[Success] Fetch and Checkout");

  cmdExec("git merge release");
  info("[Success] Merge release branch");

  const tagName = cmdExec(`cd .. && npm version ${releaseType}`);
  info("[Success] Create version tag");

  cmdExec(`git push origin main`);
  cmdExec(`git push origin ${tagName}`);
  info("[Success] Push to remote");

  cmdExec(`git branch -D release`);
  cmdExec(`git push origin --delete release`);
  info("[Success] Delete release branch");

  info(`updated version: ${tagName}`);
  info("All Completed");

  await open(
    `https://app.circleci.com/pipelines/github/access-company/Dalmatian?branch=${tagName}`
  );
} catch (err) {
  error(err);
  error("Release Failed");
}
