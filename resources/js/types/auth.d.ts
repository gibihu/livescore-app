import { UserType } from "./user";

export interface AuthType {
    user?: UserType;
    retrieval_at: string;
}
