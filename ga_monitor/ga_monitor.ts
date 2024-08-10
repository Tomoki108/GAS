// entry point
async function gaMonitor() {
  const today = new Date();
  const avgDuration = await getWorkflowRunAvgDuration("1", today);

  const seetRepository = new SheetResoisitoryImpl(
    SpreadsheetApp.getActiveSheet()
  );

  const avgDurationLastTime =
    seetRepository.readLastAvgDurationLog().avgDuration;

  seetRepository.writeAvgDurationLog({
    date: today,
    avgDuration: avgDuration,
    avgDurationDelta: avgDuration - avgDurationLastTime / avgDurationLastTime,
  });
}
