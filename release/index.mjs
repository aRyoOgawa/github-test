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
  console.log(releaseType);

  const isMergeOk = await confirm({ message: "Confirm " });
  if (!isMergeOk) exit(0);

  console.log("[TODO] merge");

  // execSync("git fetch origin release && git checkout -B release");
  // execSync("git checkout main && git pull origin main");
  // execSync("git merge --squash release");

  const tagName = execSync(`cd .. && npm version ${releaseType}`)
    .toString()
    .trim();

  // execSync(`git push origin main`);
  // execSync(`git push origin ${tagName}`);

  // execSync(`git branch -d release`);
  // execSync(`git push origin --delete release`);

  console.info("release success");
} catch (err) {
  console.error(err);
  console.error("release failed");
}
