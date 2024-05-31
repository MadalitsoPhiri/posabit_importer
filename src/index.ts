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

let obj = csvToJson
  .fieldDelimiter(",")
  .formatValueByType(true)
  .parseSubArray("*", ",")
  .getJsonFromCsv("./FreshBakedCustomers04-10-2024.csv");
const customers = obj.map((customer: any) => {
  return {
    id: customer.id,
    customer_type: customer.CustomerType,
    first_name: customer.FirstName,
    last_name: customer.LastName,
  } as PosabitCustomer;
});

const processCustomer = async (customerId: number) => {
  let customerData;
  try {
    customerData = (await getCustomerById(customerId)) as PosabitCustomer;
  } catch (e: any) {
    console.error("failed to fetch customer", e);
  }

  if (customerData.telephone) {
    console.log('has phone number')
    const response = await handleCustomerLoyaltySync(customerData);
    console.log("response", response);
  }
};

for (let i = 0; i < customers.length; i++) {
  try {
    await processCustomer(customers[i].id);
  } catch (e: any) {
    console.error("could not process customer");
  }
} 