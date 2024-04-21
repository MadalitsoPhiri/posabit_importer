import 'dotenv/config';
import { addToProgram, createCustomerCard, createDigitalWalletCustomer, createPosabitCustomer, getCustomerById, normalizePhoneNumber, updateCustomerNativeLoyalty } from "./utility/index.js";
import csvToJson from "convert-csv-to-json";
let obj = csvToJson.fieldDelimiter(',')
    .formatValueByType(true)
    .parseSubArray("*", ',')
    .getJsonFromCsv("./FreshBakedCustomers04-10-2024.csv");
const customers = obj.map((customer) => {
    return { id: customer.id, customer_type: customer.CustomerType, first_name: customer.FirstName, last_name: customer.LastName };
});
const processCustomer = async (customerId) => {
    var _a, _b, _c, _d;
    let customerData;
    try {
        customerData = (await getCustomerById(customerId));
    }
    catch (e) {
        console.error('failed to fetch customer', e);
    }
    if (customerData.telephone) {
        const cardIdExtractedFromEmail = (_c = (_b = (_a = customerData === null || customerData === void 0 ? void 0 : customerData.email) === null || _a === void 0 ? void 0 : _a.split) === null || _b === void 0 ? void 0 : _b.call(_a, '@')) === null || _c === void 0 ? void 0 : _c[0];
        const cardIdRegexPattern = /^\d{6}-\d{3}-\d{3}$/;
        const isValidCardId = (_d = cardIdExtractedFromEmail === null || cardIdExtractedFromEmail === void 0 ? void 0 : cardIdExtractedFromEmail.match) === null || _d === void 0 ? void 0 : _d.call(cardIdExtractedFromEmail, cardIdRegexPattern);
        if (!isValidCardId) {
            const customerCreationPayload = {
                phone: normalizePhoneNumber(customerData.telephone),
                firstName: customerData.first_name,
                surname: customerData.last_name,
                dateOfBirth: customerData.birthday,
                gender: customerData.gender,
                email: customerData.email
            };
            const newDigitalWalletCustomer = await createDigitalWalletCustomer(customerCreationPayload);
            const newDigitalWalletCard = await createCustomerCard(newDigitalWalletCustomer.id, process.env.CARD_TEMPLATE_ID);
            const newPosabitCustomerData = {
                first_name: customerData.first_name,
                last_name: customerData.last_name,
                email: `${newDigitalWalletCard.id}@stickycards.co`,
            };
            let newPosabitCustomer = (await createPosabitCustomer(newPosabitCustomerData));
            if (customerData.points && customerData.points !== 0) {
                const updatedPosabitCustomer = (await updateCustomerNativeLoyalty(newPosabitCustomer.id));
                if (updatedPosabitCustomer.id) {
                    newPosabitCustomer = updatedPosabitCustomer;
                }
            }
            console.log('customerData.points', customerData.points);
            console.log('newPosabitCustomer', newPosabitCustomer);
            const response = await addToProgram(newDigitalWalletCard.id, customerData.points);
            console.log('response', response);
        }
    }
    ;
};
for (let i = 0; i < customers.length; i++) {
    try {
        await processCustomer(customers[i].id);
    }
    catch (e) {
        console.error('could not process customer');
    }
}
//# sourceMappingURL=index.js.map