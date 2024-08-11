const API_ENDPOINT =
  "https://api.github.com/repos/OWNER/REPO/actions/workflows/{WORKFLOW_FILE}/runs";

const GH_TOKEN =
  PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");

class GithubAPIImpl implements GithubAPI {
  async getWorkflowRunAvgDuration(
    workflowFile: string,
    date: Date
  ): Promise<number> {
    const workflowRuns = await this.fetchWorkflowRuns(workflowFile, date);

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

  async fetchWorkflowRuns(workflowFile: string, date: Date) {
    const url = new URL(API_ENDPOINT.replace("{WORKFLOW_FILE}", workflowFile));
    url.searchParams.append("branch", "dev");
    url.searchParams.append("status", "success");
    url.searchParams.append("created", `>=${getFormattedDate(date)}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      throw new Error(`APIリクエストが失敗しました: ${response.status}`);
    }

    const data = await response.json();

    return data.workflow_runs as Array<WorkflowRun>;
  }
}

/**
 * @see https://docs.github.com/ja/rest/actions/workflow-runs?apiVersion=2022-11-28#list-workflow-runs-for-a-workflow
 */
interface WorkflowRun {
  created_at: string;
  updated_at: string;
}
