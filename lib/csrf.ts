export function validateCsrf(request: Request): boolean {
  return request.headers.get("x-csrf-token") === "1";
}
