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

  /**
   * 平均実行時間ログの折れ線グラフを更新する
   */
  updateAvgDurationLogLineChart(): void;
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

  updateAvgDurationLogLineChart(): void {
    // 既存のチャートを削除
    var charts = this.sheet.getCharts();
    for (var i = 0; i < charts.length; i++) {
      this.sheet.removeChart(charts[i]);
    }

    // 直近30日のログをグラフのデータ範囲として指定
    var dataRange: GoogleAppsScript.Spreadsheet.Range;
    const lastRow = this.sheet.getLastRow();
    if (lastRow < 30) {
      dataRange = this.sheet.getRange(
        1,
        DATE_COLUMN,
        lastRow,
        DURATION_DELTA_COLUMN
      );
    } else {
      dataRange = this.sheet.getRange(
        lastRow - 30,
        DATE_COLUMN,
        lastRow,
        DURATION_DELTA_COLUMN
      );
    }

    // 新しいチャートを作成
    var chart = this.sheet
      .newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(dataRange)
      .setPosition(5, 5, 0, 0)
      .setOption("title", "Updated Line Chart")
      .build();

    // シートにチャートを挿入
    this.sheet.insertChart(chart);
  }
}
