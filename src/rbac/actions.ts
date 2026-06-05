/** Action a user can perform on a resource. */
export enum Action {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
}

export const ACTIONS = Object.values(Action);
