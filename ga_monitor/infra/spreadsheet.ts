const DATE_COLUMN = 1;
const DURATION_COLUMN = 2;
const DURATION_DELTA_COLUMN = 3;

class SheetResoisitoryImpl implements SheetResoisitory {
  private sheet: GoogleAppsScript.Spreadsheet.Sheet;

  constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    this.sheet = sheet;
  }

  readLastAvgDurationLog(): AvgDurationLog | null {
    const lastRow = this.sheet.getLastRow();
    // ヘッダー行のみの場合、ログが存在しないのでnullを返す
    if (lastRow === 1) {
      return null;
    }

    const rangeToRead = this.sheet.getRange(lastRow, DATE_COLUMN, 1, 3);
    const [date, avgDuration, avgDurationDelta] = rangeToRead.getValues()[0];

    console.log("date: " + date);
    console.log("avgDuration: " + avgDuration);
    console.log("avgDurationDelta: " + avgDurationDelta);

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
    rangeToWrite.setValues([
      [log.date, log.avgDuration.toString(), log.avgDurationDelta.toString()],
    ]);
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
