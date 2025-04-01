/** @type {import('prettier').Config} */
module.exports = {
  semi: true, // có dấu chấm phẩy
  singleQuote: true, // dùng dấu nháy đơn
  trailingComma: 'all', // thêm dấu phẩy cuối cùng
  printWidth: 80, // tối đa 100 ký tự 1 dòng
  tabWidth: 2, // 2 space
  useTabs: false, // dùng space, không dùng tab
  bracketSpacing: true, // dấu cách trong object { a: 1 }
  arrowParens: 'avoid', // arrow fn: (x) => x thành x => x
  endOfLine: 'auto', // hỗ trợ mọi OS
};
