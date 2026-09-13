export interface Competition {
  id: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  location: string;
  verein_id: number;

  verein: {
    id: number;
    name: string;
    email: string;
  };

  createdAt: string;
  updatedAt: string;
}
