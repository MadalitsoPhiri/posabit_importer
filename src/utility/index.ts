import axios from "axios";
import { PosabitCustomer } from "./types.js";

 export const getCustomerById = async (
    customerId: number,
  ): Promise<PosabitCustomer | void> =>{
    try {
      const { data }: { data: { customer: PosabitCustomer } } = await axios({
        method: 'get',
        url: `${process.env.POSABIT_BASE_URL}/v2/venue/customers/${customerId}`,
        headers: {
          Authorization: `Bearer ${process.env.POSABIT_API_TOKEN}`,
          Accept: 'application/json',
        },
      });

      return data?.customer as PosabitCustomer;
    } catch (error) {
     
      return error;
    }
  }

  export const extractNumberCharacters = (stringWithNumbers: string) => {
    const extractedNumberCharacters = stringWithNumbers.replace(/\D/g, '');
    return extractedNumberCharacters;
  };

  export const normalizePhoneNumber = (phoneNumber: string) => {
    let formattedPhoneNumber = extractNumberCharacters(phoneNumber);
  
    const alreadyStartsWithOne = formattedPhoneNumber.charAt(0) === '1';
    if (!alreadyStartsWithOne) {
      formattedPhoneNumber = '1' + formattedPhoneNumber;
    }
  
    return formattedPhoneNumber;
  };
  