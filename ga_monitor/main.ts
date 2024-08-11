const workflowFiles = ["publish_preview.yml"];

const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

// entry point
async function main() {
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
    // GitHubから、指定したworkflowの実行時間の平均を取得
    const githubAPI = newGithubAPI();
    const avgDuration = await githubAPI.getWorkflowRunAvgDuration(
      workflowFile,
      today
    );

    // スプレッドシートにログを書き込み
    const sheet = spreadsheet.getSheetByName(
      workflowFile
    ) as GoogleAppsScript.Spreadsheet.Sheet;
    const seetRepository = newSheetRepository(sheet);

    const avgDurationLastTime =
      seetRepository.readLastAvgDurationLog().avgDuration;

    seetRepository.writeAvgDurationLog({
      date: today,
      avgDuration: avgDuration,
      avgDurationDelta: avgDuration - avgDurationLastTime / avgDurationLastTime,
    });

    seetRepository.updateAvgDurationLogLineChart();
  });
}
