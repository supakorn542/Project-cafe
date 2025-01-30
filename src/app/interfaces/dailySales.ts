import { Timestamp } from "firebase/firestore";

export interface DailySales {
    id?: string;
    salesDate: Timestamp;
    totalSales: number;
}