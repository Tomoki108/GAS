const workflowFiles = ["publish_preview.yml"];

// entry point
async function main() {
  const today = new Date();

  workflowFiles.forEach(async (workflowFile) => {
    const avgDuration = await getWorkflowRunAvgDuration(workflowFile, today);

    const seetRepository = new SheetResoisitoryImpl(
      SpreadsheetApp.getActiveSheet()
    );

    // シートから前回実行時のworkflowの平均実行時間を取得
    const avgDurationLastTime =
      seetRepository.readLastAvgDurationLog().avgDuration;

    // 今日のworkflowの平均実行時間をログに書き込む
    seetRepository.writeAvgDurationLog({
      date: today,
      avgDuration: avgDuration,
      avgDurationDelta: avgDuration - avgDurationLastTime / avgDurationLastTime,
    });

    // 平均実行時間ログの折れ線グラフを更新
    seetRepository.updateAvgDurationLogLineChart();
  });
}
