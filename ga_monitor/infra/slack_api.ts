const SLACK_WEBHOOK_URL = PropertiesService.getScriptProperties().getProperty(
  "SLACK_WEBHOOK_URL"
) as string;

class SlackAPIImpl {
  sendAlert(workflowName: string, avgDurationDelta: number): void {
    const messgae = alertMesssae
      .replace("{WORKFLOW_NAME}", workflowName)
      .replace("{DELTA}", avgDurationDelta.toString())
      .replace("{MONITOR_LINK}", SPREAD_SHEET_URL);

    const payload = {
      text: messgae,
    };

    const response = UrlFetchApp.fetch(SLACK_WEBHOOK_URL, {
      method: "post",
      payload: JSON.stringify(payload),
    });

    if (response.getResponseCode() !== 200) {
      throw new Error(
        `APIリクエストが失敗しました: ${response.getResponseCode}`
      );
    }
  }
}
