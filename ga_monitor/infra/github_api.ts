const API_ENDPOINT =
  "https://api.github.com/repos/{OWNER}/{REPO}/actions/workflows/{WORKFLOW_FILE}/runs";

const GH_TOKEN = PropertiesService.getScriptProperties().getProperty(
  "GITHUB_TOKEN"
) as string;

const REPO_OWNER = PropertiesService.getScriptProperties().getProperty(
  "REPOSITORY_OWNER"
) as string;

const REPO = PropertiesService.getScriptProperties().getProperty(
  "REPOSITORY"
) as string;

class GithubAPIImpl implements GithubAPI {
  getWorkflowRunAvgDuration(workflowFile: string, date: Date): number {
    const workflowRuns = this.fetchWorkflowRuns(workflowFile, date);
    const numOfRuns = workflowRuns.length;
    let durationSum = 0;

    workflowRuns.forEach((run) => {
      const createdAt = new Date(run.created_at);
      const updatedAt = new Date(run.updated_at);
      const duration = updatedAt.getTime() - createdAt.getTime();
      durationSum += duration;
    });
    const avgDuration = durationSum / numOfRuns;

    return avgDuration;
  }

  fetchWorkflowRuns(workflowFile: string, date: Date) {
    // GASではURLオブジェクトを使えないので、純粋な文字列としてURLを構築
    var url = API_ENDPOINT.replace("{OWNER}", REPO_OWNER)
      .replace("{REPO}", REPO)
      .replace("{WORKFLOW_FILE}", workflowFile);
    url += "?branch=main"; // TODO: branchは変数で管理する。
    url += "&status=success";
    url += `&created=>=${getFormattedDate(date)}`;
    url = encodeURI(url);

    const response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (response.getResponseCode() !== 200) {
      throw new Error(
        `APIリクエストが失敗しました: ${response.getResponseCode}`
      );
    }

    const data = response.getContentText();

    return JSON.parse(data) as WorkflowRun[];
  }
}

/**
 * @see https://docs.github.com/ja/rest/actions/workflow-runs?apiVersion=2022-11-28#list-workflow-runs-for-a-workflow
 */
interface WorkflowRun {
  created_at: string;
  updated_at: string;
}
