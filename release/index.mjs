import { execSync } from "child_process";
import { confirm } from "@inquirer/prompts";
import { select } from "@inquirer/prompts";

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

  let output;

  console.info("fetch and checkout");
  output = execSync("git fetch origin release && git checkout -B release");
  console.log(output.toString());
  output = execSync("git checkout main && git pull origin main");
  console.log(output.toString());

  console.info("merge and add tag");
  output = execSync("git merge --squash release && git commit");
  console.log(output.toString());
  output = execSync(`cd .. && npm version ${releaseType}`);
  const tagName = output.toString().trim();
  console.log(tagName);

  console.info("remote push");
  output = execSync(`git push origin main`);
  console.log(output.toString());
  output = execSync(`git push origin ${tagName}`);
  console.log(output.toString());

  console.info("delete release branch");
  output = execSync(`git branch -d release`);
  console.log(output.toString());
  output = execSync(`git push origin --delete release`);
  console.log(output.toString());

  console.info("Release Success");
} catch (err) {
  console.error("Release Failed");
  console.error(err.toString());
}
