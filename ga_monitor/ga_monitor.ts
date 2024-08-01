// entry point
async function gaMonitor() {
  const today = new Date();
  const avgDuration = await getWorkflowRunAvgDuration("1", new Date());
  const avgDurationLastTime = readLastAvgDurationLog().avgDuration;

  writeAvgDurationLog({
    date: today,
    avgDuration: avgDuration,
    avgDurationDelta: avgDuration - avgDurationLastTime / avgDurationLastTime,
  });
}
