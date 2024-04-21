import axios from "axios";
import { Card, DigitalWalletCreateCustomerDto, DigitalWalletCustomerObjectDto, PROGRAM_ENDPOINTS, PROGRAM_TYPES_PROPERTY, PosabitCustomer, PosabitCustomerProperties, changePointsInProgramResponseDto } from "./types.js";

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
  export const createDigitalWalletCustomer = async(
    payload: DigitalWalletCreateCustomerDto,
  ): Promise<DigitalWalletCustomerObjectDto>=> {
    try {
      const { data }: { data: { data: DigitalWalletCustomerObjectDto } } =
        await axios({
          method: 'post',
          url: `${process.env.DIGITAL_WALLET_URL}/customers`,
          headers: {
            'X-API-Key':process.env.DIGITAL_WALLET_API_KEY,
          },
          data: payload,
        });

      return data?.data;
    } catch (error) {
       console.log('failed to create digitalwallet customer',error);
      return null;
    }
  }

  export const createCustomerCard = async(
    customerId: string,
    templateId: number | string,
  ): Promise<Card> =>{
    try {
      const { data }: { data: { data: Card } } = await axios({
        method: 'post',
        url: `${process.env.DIGITAL_WALLET_URL}/cards`,
        headers: {
          'X-API-Key': process.env.DIGITAL_WALLET_API_KEY,
        },
        data: {
          templateId,
          customerId,
        },
      });

      return data?.data;
    } catch (error) {
     console.log('failed to create card',error)
      return null;
    }
  }

  export const createPosabitCustomer = async(
    customer: PosabitCustomerProperties,
  ): Promise<PosabitCustomer | void> => {
    try {
      const { data }: { data: { customer: PosabitCustomer } } = await axios({
        method: 'post',
        url: `${process.env.POSABIT_BASE_URL}/v2/venue/customers`,
        headers: {
          Authorization: `Bearer ${process.env.POSABIT_API_TOKEN}`,
          Accept: 'application/json',
        },
        data: { customer: customer },
      });

      return data?.customer as PosabitCustomer;
    } catch (error) {
console.log('failed to create posabit customer',error)

      return null;
    }
  }

export const updateCustomerNativeLoyalty = async(
    customerId: number,
    pointsToUpdate = 0,
  ): Promise<PosabitCustomer | void> =>{
    try {
      const { data }: { data: { customer: PosabitCustomer } } = await axios({
        method: 'put',
        url: `${process.env.POSABIT_BASE_URL}/v2/venue/customers/${customerId}`,
        headers: {
          Authorization: `Bearer ${process.env.POSABIT_API_TOKEN}`,
          Accept: 'application/json',
        },
        data: {
          customer: {
            points_adjustment: pointsToUpdate,
          },
        },
      });

      return data?.customer;
    } catch (error) {
    console.log('updateCustomerNativeLoyalty failed',error)
    
    }
  }

 export  const addToProgram = async (cardId: string, amountToAdd: number) => {
    if (amountToAdd <= 0) {
      return;
    }
     console.log('amountToAdd',amountToAdd)
     console.log('cardId',cardId)
    //  https://api.digitalwallet.cards/api/v2/cards/{id}/add-transaction-amount
    const axiosCall = await axios({
      method: 'post',
      url: `${process.env.DIGITAL_WALLET_URL}/cards/${cardId}/add-reward`,
      headers: {
        'X-API-Key': process.env.DIGITAL_WALLET_API_KEY,
      },
      data: {
        rewards: amountToAdd,
      },
    });
    const { data }: { data: { data: changePointsInProgramResponseDto } } =
      axiosCall;
  console.log('data',data)
    return data;
  }