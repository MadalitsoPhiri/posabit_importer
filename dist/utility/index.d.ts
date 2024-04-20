import { PosabitCustomer } from "./types.js";
export declare const getCustomerById: (customerId: number) => Promise<PosabitCustomer | void>;
export declare const extractNumberCharacters: (stringWithNumbers: string) => string;
export declare const normalizePhoneNumber: (phoneNumber: string) => string;
