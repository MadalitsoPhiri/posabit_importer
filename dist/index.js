import 'dotenv/config';
import { getCustomerById, normalizePhoneNumber } from "./utility/index.js";
(async function () {
    var _a, _b, _c, _d, _e, _f;
    let customerData = (await getCustomerById(1026706));
    console.log('customerData', customerData);
    const cardIdExtractedFromEmail = (_c = (_b = (_a = customerData === null || customerData === void 0 ? void 0 : customerData.email) === null || _a === void 0 ? void 0 : _a.split) === null || _b === void 0 ? void 0 : _b.call(_a, '@')) === null || _c === void 0 ? void 0 : _c[0];
    const cardIdRegexPattern = /^\d{6}-\d{3}-\d{3}$/;
    const isValidCardId = (_d = cardIdExtractedFromEmail === null || cardIdExtractedFromEmail === void 0 ? void 0 : cardIdExtractedFromEmail.match) === null || _d === void 0 ? void 0 : _d.call(cardIdExtractedFromEmail, cardIdRegexPattern);
    if (!isValidCardId) {
        const customerCreationPayload = {
            phone: normalizePhoneNumber(customerData.telephone),
            firstName: (_e = customerData.first_name) !== null && _e !== void 0 ? _e : customerData.last_name,
            surname: (_f = customerData.last_name) !== null && _f !== void 0 ? _f : customerData.first_name,
        };
    }
})();
//# sourceMappingURL=index.js.map