import { execSync } from "child_process";
import { confirm } from "@inquirer/prompts";
import { select } from "@inquirer/prompts";
import chalk from "chalk";

const log = (msg) => console.log(chalk.white(msg));
const info = (msg) => console.info(chalk.green(msg));
const error = (msg) => console.error(chalk.red(msg));

const cmdExec = (cmd) => {
  log(cmd);
  const output = execSync(cmd).toString().trim();
  log(output);
  return output;
};

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
  cmdExec("git fetch origin release && git checkout -B release");
  cmdExec("git checkout main && git pull origin main");

  info("--- Merge and Add tag ---");
  cmdExec("git merge --squash release && git commit --no-edit");
  const tagName = cmdExec(`cd .. && npm version ${releaseType}`);

  info("--- Push to remote ---");
  cmdExec(`git push origin main`);
  cmdExec(`git push origin ${tagName}`);

  info("--- Delete release branch ---");
  cmdExec(`git branch -D release`);
  cmdExec(`git push origin --delete release`);

  info("Release Success!!");
} catch (err) {
  error(err);
  error("Release Failed");
}
