// entry point
function gaMonitor() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const durationAvg = getWorkflowRunDurationAvg("1", new Date());

  // logWorkflowDuration(today, durationAvg);
}
