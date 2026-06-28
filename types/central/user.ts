export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  roles: any[]; // Replace 'any' with a proper Role type if defined
  permissions: any[]; // Replace 'any' with a proper Permission type if defined
  created_at: string;
}