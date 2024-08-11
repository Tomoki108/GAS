function getFormattedDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function arraysEqualIgnoreOrder<T>(arr1: T[], arr2: T[]): boolean {
  // 長さが異なる場合は、異なると判定
  if (arr1.length !== arr2.length) return false;

  // 配列をソートする
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  // 各要素を比較する
  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
}

function subtractArrays<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter((value) => !arr2.includes(value));
}
