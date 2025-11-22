export interface AuthFormData {
  username: string;
  password: string;
}

export interface CreatePostData {
  value: number;
}

export interface ReplyData {
  op: OperationType;
  rightValue: number;
}

export interface User {
  id: number;
  username: string;
}

export type OperationType = "ADD" | "SUB" | "MUL" | "DIV";

export interface Operation {
  value: number;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  parentId?: number;
  op?: OperationType;
  rightValue?: number;
  userId: number;
  path?: string;
  user: User;
  _count: {
    children: number;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  nextCursor?: number;
}
