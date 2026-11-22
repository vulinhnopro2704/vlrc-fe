export interface TypeBase {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface Employee extends TypeBase {
  name: string;
  avatarUrl?: string;
  email?: string;
  title?: string;
}

export interface Project extends TypeBase {
  name: string;
  key: string;
  description?: string;
  iconUrl?: string;
  leadId?: string;
  lead?: Employee;
}

export type DateTime = string | number | Date;
