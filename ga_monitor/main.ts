const workflowFiles = ["publish_preview.yml"];

// メインの処理のentry point
function main() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // シート名のvalidate
  const sheets = spreadsheet.getSheets();
  const sheetNames = sheets.map(function (sheet) {
    return sheet.getName();
  });
  if (!arraysEqualIgnoreOrder(sheetNames, workflowFiles)) {
    throw new Error(
      "シート名のリストが、workflowファイル名のリストと一致しません"
    );
  }

  const today = new Date();
  workflowFiles.forEach(async (workflowFile) => {
    // GitHubから、指定したworkflowの平均実行時間を取得
    const githubAPI = newGithubAPI();
    const avgDuration = githubAPI.getWorkflowRunAvgDuration(
      workflowFile,
      today
    );

    console.log("avg duration: " + avgDuration);

    const sheet = spreadsheet.getSheetByName(
      workflowFile
    ) as GoogleAppsScript.Spreadsheet.Sheet;
    const seetRepository = newSheetRepository(sheet);

    // spread sheetから直近のログを読み取り、平均実行時間の変化率を計算
    const mostRecentLog = seetRepository.readLastAvgDurationLog();
    const avgDurationDelta = mostRecentLog
      ? avgDuration - mostRecentLog.avgDuration / mostRecentLog.avgDuration
      : 0;

    seetRepository.writeAvgDurationLog({
      date: today,
      avgDuration: avgDuration,
      avgDurationDelta: avgDurationDelta,
    });

    seetRepository.updateAvgDurationLogLineChart();
  });
}
