import { stalledDefectSweep } from "./jobs/stalledDefectSweep.js";
import { overdueNextActionSweep } from "./jobs/overdueNextActionSweep.js";
import { notificationDispatch } from "./jobs/notificationDispatch.js";

const DEFAULT_POLL_INTERVAL_MS = 60_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const runJobs = async () => {
  await stalledDefectSweep();
  await overdueNextActionSweep();
  await notificationDispatch();
};

const main = async () => {
  const pollIntervalMs = Number(process.env.WORKER_POLL_INTERVAL_MS ?? DEFAULT_POLL_INTERVAL_MS);
  let shouldStop = false;

  const stop = () => {
    shouldStop = true;
  };

  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  while (!shouldStop) {
    await runJobs();

    if (!shouldStop) {
      await sleep(pollIntervalMs);
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
