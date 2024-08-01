// entry point
function gaMonitor() {
  const sheet = SpreadsheetApp.getActiveSheet();

  const today = getFormattedTodayDate();
  const durationAvg = getWorkflowDurationAvg(today, "1");

  // logWorkflowDuration(today, durationAvg);
}
