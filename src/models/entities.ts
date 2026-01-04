export type Role = "USER" | "ADMIN";
export type ArticleStatus = "DRAFT" | "PUBLISHED";

export interface CurrentUser {
  id: number;
  email: string;
  role: Role;
}
