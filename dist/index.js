import 'dotenv/config';
import { addToProgram, createCustomerCard, createDigitalWalletCustomer, createPosabitCustomer, getCustomerById, normalizePhoneNumber, updateCustomerNativeLoyalty } from "./utility/index.js";
import csvToJson from "convert-csv-to-json";
let obj = csvToJson.fieldDelimiter(',')
    .formatValueByType(true)
    .parseSubArray("*", ',')
    .getJsonFromCsv("./FreshBakedCustomers04-10-2024.csv");
const customers = obj.filter((customer) => customer.Email.length >= 10).map((customer) => {
    return { id: customer.id, customer_type: customer.CustomerType, first_name: customer.FirstName, last_name: customer.LastName };
});
console.log('customers', customers);
const processCustomer = async (customerId) => {
    var _a, _b, _c, _d, _e, _f;
    let customerData;
    try {
        customerData = (await getCustomerById(customerId));
    }
    catch (e) {
        console.log('failed to fetch customer');
    }
    console.log('customerData', customerData);
    if (customerData.telephone) {
        const cardIdExtractedFromEmail = (_c = (_b = (_a = customerData === null || customerData === void 0 ? void 0 : customerData.email) === null || _a === void 0 ? void 0 : _a.split) === null || _b === void 0 ? void 0 : _b.call(_a, '@')) === null || _c === void 0 ? void 0 : _c[0];
        const cardIdRegexPattern = /^\d{6}-\d{3}-\d{3}$/;
        const isValidCardId = (_d = cardIdExtractedFromEmail === null || cardIdExtractedFromEmail === void 0 ? void 0 : cardIdExtractedFromEmail.match) === null || _d === void 0 ? void 0 : _d.call(cardIdExtractedFromEmail, cardIdRegexPattern);
        if (!isValidCardId) {
            const customerCreationPayload = {
                phone: normalizePhoneNumber(customerData.telephone),
                firstName: (_e = customerData.first_name) !== null && _e !== void 0 ? _e : customerData.last_name,
                surname: (_f = customerData.last_name) !== null && _f !== void 0 ? _f : customerData.first_name,
            };
            const newDigitalWalletCustomer = await createDigitalWalletCustomer(customerCreationPayload);
            const newDigitalWalletCard = await createCustomerCard(newDigitalWalletCustomer.id, process.env.CARD_TEMPLATE_ID);
            console.log('newDigitalWalletCard', newDigitalWalletCard);
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
processCustomer(1026913).then(customer => console.log('customer', customer)).catch((e) => { console.log('error', e); });
//# sourceMappingURL=index.js.map