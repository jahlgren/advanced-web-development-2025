import { timelog } from "@/models/timelog";

export type Category = {
  id: string;
  projectId: string;
  name: string;
  createdAt: Date|string;
}

export type Project = {
  id: string;
  userId: string;
  title: string;
  description?: string|null;
  createdAt: Date|string;
  categories?: Category[];
};

export type Timelog = {
  id: string;
  projectId: string;
  categoryId: string;
  description?: string | null;
  start: Date;
  end?: Date | null;
  createdAt: Date;
};
