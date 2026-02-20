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
