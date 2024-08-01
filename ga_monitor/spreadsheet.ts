const DATE_COLUMN = 1;
const DURATION_COLUMN = 2;
const DURATION_DELTA_COLUMN = 3;

const sheet = SpreadsheetApp.getActiveSheet();

type AvgDurationLog = {
  date: Date;
  avgDuration: number; // 平均実行時間（秒）
  avgDurationDelta: number; // 前日比（%）
};

function readLastAvgDurationLog() {
  const rangeToRead = sheet.getRange(sheet.getLastRow(), DATE_COLUMN, 1, 3);
  const [date, avgDuration, avgDurationDelta] = rangeToRead.getValues()[0];

  return {
    date: date,
    avgDuration: avgDuration,
    avgDurationDelta: avgDurationDelta,
  } as AvgDurationLog;
}

function writeAvgDurationLog(log: AvgDurationLog) {
  const rangeToWrite = sheet.getRange(
    sheet.getLastRow() + 1,
    DATE_COLUMN,
    1,
    3
  );
  rangeToWrite.setValue([log.date, log.avgDuration, log.avgDurationDelta]);
}

function updateAvgDurationChart() {}
