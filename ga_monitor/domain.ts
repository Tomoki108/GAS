// 平均実行時間ログ
type AvgDurationLog = {
  date: Date;
  avgDuration: number; // 平均実行時間（秒）
  avgDurationDelta: number; // 前日比（%）
};

//////////////////
// spread sheet
//////////////////

interface SheetResoisitory {
  /**
   * 直近の平均実行時間ログを取得する
   */
  readLastAvgDurationLog(): AvgDurationLog | null;

  /**
   * 平均実行時間ログを書き込む
   */
  writeAvgDurationLog(log: AvgDurationLog): void;

  /**
   * 平均実行時間ログの折れ線グラフを更新する
   */
  updateAvgDurationLogLineChart(): void;
}

function newSheetRepository(
  sheet: GoogleAppsScript.Spreadsheet.Sheet
): SheetResoisitory {
  return new SheetResoisitoryImpl(sheet);
}

//////////////////
// Github
//////////////////

interface GithubAPI {
  /**
   * 指定したworkflowの実行時間の平均を取得する
   */
  getWorkflowRunAvgDuration(workflowFile: string, date: Date): number;
}

function newGithubAPI(): GithubAPI {
  return new GithubAPIImpl();
}

//////////////////
// Slack
//////////////////
interface SlackAPI {
  /**
   * メッセージを送信する
   */
  sendAlert(workflowName: string, avgDurationDelta: number): void;
}

function newSlackAPI(): SlackAPI {
  return new SlackAPIImpl();
}

const alertMesssae =
  "{WORKFLOW_NAME}の実行時間が前日比で{DELTA}%増加しました。予期せぬ変更を加えていないか適宜ソースコードを確認してください。 {MONITOR_LINK}";
