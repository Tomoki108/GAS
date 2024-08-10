const DATE_COLUMN = 1;
const DURATION_COLUMN = 2;
const DURATION_DELTA_COLUMN = 3;

// const sheet = SpreadsheetApp.getActiveSheet();

// 平均実行時間ログ
type AvgDurationLog = {
  date: Date;
  avgDuration: number; // 平均実行時間（秒）
  avgDurationDelta: number; // 前日比（%）
};

/**
 * スプレッドシートの操作を行うインターフェース
 */
interface SheetResoisitory {
  /**
   * 最新の平均実行時間ログを取得する
   */
  readLastAvgDurationLog(): AvgDurationLog;

  /**
   * 平均実行時間ログを書き込む
   */
  writeAvgDurationLog(log: AvgDurationLog): void;
}

class SheetResoisitoryImpl implements SheetResoisitory {
  private sheet: GoogleAppsScript.Spreadsheet.Sheet;

  constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    this.sheet = sheet;
  }

  readLastAvgDurationLog(): AvgDurationLog {
    const rangeToRead = this.sheet.getRange(
      this.sheet.getLastRow(),
      DATE_COLUMN,
      1,
      3
    );
    const [date, avgDuration, avgDurationDelta] = rangeToRead.getValues()[0];

    return {
      date: date,
      avgDuration: avgDuration,
      avgDurationDelta: avgDurationDelta,
    } as AvgDurationLog;
  }

  writeAvgDurationLog(log: AvgDurationLog): void {
    const rangeToWrite = this.sheet.getRange(
      this.sheet.getLastRow() + 1,
      DATE_COLUMN,
      1,
      3
    );
    rangeToWrite.setValue([log.date, log.avgDuration, log.avgDurationDelta]);
  }
}
