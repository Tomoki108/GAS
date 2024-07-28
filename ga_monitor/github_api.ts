const API_ENDPOINT =
  "https://api.github.com/repos/OWNER/REPO/actions/workflows/WORKFLOW_ID/runs";

async function getWorkflowDurationAvg(date: string, workflowID: string) {
  const workflowRuns = await fetchWorkflows(date, workflowID);

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

/**
 * @param date "YYYY-MM-DD"
 * @param workflowID
 * @returns
 */
async function fetchWorkflows(workflowID: string, date: string) {
  const properties = PropertiesService.getScriptProperties();
  const ghToken = properties.getProperty("GITHUB_TOKEN");

  const url = new URL(API_ENDPOINT.replace("WORKFLOW_ID", workflowID));
  url.searchParams.append("branch", "dev");
  url.searchParams.append("status", "success");
  url.searchParams.append("created", `>=${date}`);

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
 * @see https://github.com/googleworkspace/apps-script-samples/blob/main/sheets/removingDuplicates/removingDuplicates.gs
 */
interface WorkflowRun {
  created_at: string;
  updated_at: string;
}
