import { stalledDefectSweep } from "./jobs/stalledDefectSweep.js";
import { overdueNextActionSweep } from "./jobs/overdueNextActionSweep.js";
import { notificationDispatch } from "./jobs/notificationDispatch.js";

const main = async () => {
  await stalledDefectSweep();
  await overdueNextActionSweep();
  await notificationDispatch();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
