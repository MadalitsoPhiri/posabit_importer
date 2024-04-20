import axios from "axios";
export const getCustomerById = async (customerId) => {
    try {
        const { data } = await axios({
            method: 'get',
            url: `${process.env.POSABIT_BASE_URL}/v2/venue/customers/${customerId}`,
            headers: {
                Authorization: `Bearer ${process.env.POSABIT_API_TOKEN}`,
                Accept: 'application/json',
            },
        });
        return data === null || data === void 0 ? void 0 : data.customer;
    }
    catch (error) {
        return error;
    }
};
export const extractNumberCharacters = (stringWithNumbers) => {
    const extractedNumberCharacters = stringWithNumbers.replace(/\D/g, '');
    return extractedNumberCharacters;
};
export const normalizePhoneNumber = (phoneNumber) => {
    let formattedPhoneNumber = extractNumberCharacters(phoneNumber);
    const alreadyStartsWithOne = formattedPhoneNumber.charAt(0) === '1';
    if (!alreadyStartsWithOne) {
        formattedPhoneNumber = '1' + formattedPhoneNumber;
    }
    return formattedPhoneNumber;
};
//# sourceMappingURL=index.js.map