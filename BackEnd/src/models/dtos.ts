import { ArticleStatus, Role } from "./entities";

export interface RegisterInput {
  email: string;
  password: string;
  role?: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  role?: Role;
}

export interface FishInput {
  name: string;
  description: string;
}

export interface ArticleInput {
  title: string;
  content: string;
  status?: ArticleStatus;
  fishIds?: number[];
  authorId?: number;
}

export interface ArticleUpdateInput {
  title?: string;
  content?: string;
  status?: ArticleStatus;
  fishIds?: number[];
}

export interface MessageInput {
  content: string;
  senderRole: Role;
}
