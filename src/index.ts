import 'dotenv/config'
import {
  addToProgram,
  createCustomerCard,
  createDigitalWalletCustomer,
  createPosabitCustomer,
  findCardByCustomerId,
  findCardListByCustomerId,
  getCustomerById,
  handleCustomerLoyaltySync,
  normalizePhoneNumber,
  subtractFromProgram,
  updateCustomerNativeLoyalty,
} from "./utility/index.js";
import { PosabitCustomer, PosabitCustomerProperties } from "./utility/types.js";
import csvToJson from "convert-csv-to-json";

export interface GreenWellnessCustomer {
  phone: string;
  email: string;
  LastName: string;
  FirstName: string;
  DateOfBirth: string;
  UserID: string;
  PointBalance: number;
}
let obj: GreenWellnessCustomer[] = csvToJson
  .fieldDelimiter(",")
  .formatValueByType(true)
  .parseSubArray("*", ",")
  .getJsonFromCsv("./greenwellness.csv");
const finalObj = obj.map((item) => {
  return {
    phone: item.phone.toString(),
    email: item.email,
    LastName: item.LastName,
    FirstName: item.FirstName,
    DateOfBirth: item.DateOfBirth,
    UserID: item.UserID,
    PointBalance: item.PointBalance,
  };
});
const processCustomer = async (customer: GreenWellnessCustomer) => {
  console.log("customer", customer);
  await handleCustomerLoyaltySync(customer);
};

for (let i = 0; i < finalObj.length; i++) {
  try {
    await processCustomer(finalObj[i]);
  } catch (e: any) {
    console.error("could not process customer");
  }
} 

