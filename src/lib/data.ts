type User = {
  username: string,
  pwd: string,
  bio?: string,
};

type Task = {
  title: string;
  description: string;
  status: "doned" | "pending";
  createdAt: Date;
  userId: string;
};

export {
  User,
  Task
}