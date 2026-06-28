export interface Plan {
  id: string;
  name: string;
  price: number;
  status: "active" | "inactive";
}