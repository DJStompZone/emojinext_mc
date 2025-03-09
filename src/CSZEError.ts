interface CSZEErrorFunction {
  (e: Error): void;
}
export const CSZEError: CSZEErrorFunction = function (e: Error): void {
  console.error(`CSZE - Error ${e}\n${e?.stack ?? ""}`);
};
