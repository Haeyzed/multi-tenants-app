export interface Project {
  id: string;
  title: string;
  status: "active" | "inactive";
  budget: number;
}