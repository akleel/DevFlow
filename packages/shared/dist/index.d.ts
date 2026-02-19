export type ContactRequest = {
  name: string;
  email: string;
  message: string;
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

export type AdminContactItem = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  message: string;
};

export type AdminContactsSuccessResponse = {
  ok: true;
  items: AdminContactItem[];
};

export type AdminContactsErrorResponse = {
  ok: false;
  error: string;
  requestId?: string;
};

export type AdminContactsResponse =
  | AdminContactsSuccessResponse
  | AdminContactsErrorResponse;

export {};
