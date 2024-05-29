import 'dotenv/config';
import { getCustomerById, handleCustomerLoyaltySync, } from "./utility/index.js";
import csvToJson from "convert-csv-to-json";
let obj = csvToJson
    .fieldDelimiter(",")
    .formatValueByType(true)
    .parseSubArray("*", ",")
    .getJsonFromCsv("./FreshBakedCustomers04-10-2024.csv");
const customers = obj.map((customer) => {
    return {
        id: customer.id,
        customer_type: customer.CustomerType,
        first_name: customer.FirstName,
        last_name: customer.LastName,
    };
});
const processCustomer = async (customerId) => {
    let customerData;
    try {
        customerData = (await getCustomerById(customerId));
    }
    catch (e) {
        console.error("failed to fetch customer", e);
    }
    if (customerData.telephone) {
        console.log('has phone number');
        await handleCustomerLoyaltySync(customerData);
    }
};
for (let i = 0; i < customers.length; i++) {
    try {
        await processCustomer(customers[i].id);
    }
    catch (e) {
        console.error("could not process customer");
    }
}
//# sourceMappingURL=index.js.map