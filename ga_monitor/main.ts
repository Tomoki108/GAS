const workflowFiles = ["publish_preview.yml"];

// entry point
async function main() {
  const today = new Date();

  workflowFiles.forEach(async (workflowFile) => {
    const githubAPI = newGithubAPI();

    const avgDuration = await githubAPI.getWorkflowRunAvgDuration(
      workflowFile,
      today
    );

    const seetRepository = newSheetRepository(SpreadsheetApp.getActiveSheet());

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
