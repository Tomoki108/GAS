const API_ENDPOINT =
  "https://api.github.com/repos/OWNER/REPO/actions/workflows/WORKFLOW_ID/runs";

async function getWorkflowRunDurationAvg(workflowID: string, date: Date) {
  const workflowRuns = await fetchWorkflowRuns(workflowID, date);

  const numOfRuns = workflowRuns.length;
  let durationSum = 0;

  workflowRuns.forEach((run) => {
    const createdAt = new Date(run.created_at);
    const updatedAt = new Date(run.updated_at);
    const duration = updatedAt.getTime() - createdAt.getTime();
    durationSum += duration;
  });
  const durationAvg = durationSum / numOfRuns;

  return durationAvg;
}

async function fetchWorkflowRuns(workflowID: string, date: Date) {
  const properties = PropertiesService.getScriptProperties();
  const ghToken = properties.getProperty("GITHUB_TOKEN");

  const url = new URL(API_ENDPOINT.replace("WORKFLOW_ID", workflowID));
  url.searchParams.append("branch", "dev");
  url.searchParams.append("status", "success");
  url.searchParams.append("created", `>=${getFormattedDate(date)}`);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ghToken}`,
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

/**
 * @see https://docs.github.com/ja/rest/actions/workflow-runs?apiVersion=2022-11-28#list-workflow-runs-for-a-workflow
 */
interface WorkflowRun {
  created_at: string;
  updated_at: string;
}
