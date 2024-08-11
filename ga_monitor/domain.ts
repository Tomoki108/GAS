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
   * 最新の平均実行時間ログを取得する
   */
  readLastAvgDurationLog(): AvgDurationLog;

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
// github
//////////////////

interface GithubAPI {
  /**
   * 指定したworkflowの実行時間の平均を取得する
   */
  getWorkflowRunAvgDuration(workflowFile: string, date: Date): Promise<number>;
}

function newGithubAPI(): GithubAPI {
  return new GithubAPIImpl();
}
