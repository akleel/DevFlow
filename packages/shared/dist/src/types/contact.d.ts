export type ContactRequest = {
  name: string;
  email: string;
  message: string;
  /**
   * Honeypot field: real users should never fill it.
   * If it’s filled, the server intentionally returns success without processing.
   */
  company?: string;
};
export type ContactSuccessResponse = {
  ok: true;
};
export type ContactIssue = {
  path: Array<string | number>;
  message: string;
};
export type ContactErrorResponse = {
  ok: false;
  error: string;
  requestId?: string;
  issues?: ContactIssue[];
};
export type ContactResponse = ContactSuccessResponse | ContactErrorResponse;
