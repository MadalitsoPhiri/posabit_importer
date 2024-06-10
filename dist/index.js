import 'dotenv/config';
import { handleCustomerLoyaltySync, } from "./utility/index.js";
import csvToJson from "convert-csv-to-json";
let obj = csvToJson
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
        PointBalance: 51,
    };
});
const processCustomer = async (customer) => {
    console.log("customer", customer);
    await handleCustomerLoyaltySync(customer);
};
for (let i = 0; i < finalObj.length; i++) {
    try {
        await processCustomer(finalObj[i]);
    }
    catch (e) {
        console.error("could not process customer");
    }
}
//# sourceMappingURL=index.js.map