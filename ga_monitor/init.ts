// シートを初期化するentry point
function init() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();

  const existSheetNames = sheets.map(function (sheet) {
    return sheet.getName();
  });
  const nonExistSheetNames = subtractArrays(workflowFiles, existSheetNames);

  nonExistSheetNames.forEach((sheetName) => {
    spreadsheet.insertSheet(sheetName);
  });
  nonExistSheetNames.forEach((sheetName) => {
    const sheet = spreadsheet.getSheetByName(
      sheetName
    ) as GoogleAppsScript.Spreadsheet.Sheet;
    sheet.appendRow(["Date", "Avetage Duration (Sec)", "Delta (%)"]);
  });
}
