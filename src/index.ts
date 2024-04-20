import 'dotenv/config'
import { getCustomerById, normalizePhoneNumber } from "./utility/index.js";
import { PosabitCustomer, PosabitCustomerProperties } from "./utility/types.js";


(async function() { 	let customerData = (await getCustomerById(
    1026706
  )) as PosabitCustomer;
  console.log('customerData',customerData)
const cardIdExtractedFromEmail = customerData?.email?.split?.('@')?.[0];

const cardIdRegexPattern = /^\d{6}-\d{3}-\d{3}$/;

const isValidCardId =
  cardIdExtractedFromEmail?.match?.(cardIdRegexPattern);

if (!isValidCardId) {


    const customerCreationPayload = {
      phone: normalizePhoneNumber(customerData.telephone),
      firstName: customerData.first_name ?? customerData.last_name,
      surname: customerData.last_name ?? customerData.first_name,
    };

    // const newDigitalWalletCustomer =
    //   await this.digitalWalletService.createCustomer(
    //     customerCreationPayload,
    //   );


    // const newDigitalWalletCard =
    //   await this.digitalWalletService.createCustomerCard(
    //     newDigitalWalletCustomer.id,
    //     process.env.CARD_TEMPLATE_ID,
    //   );



    // const newPosabitCustomerData: PosabitCustomerProperties = {
    //   first_name: customerData.first_name,
    //   last_name: customerData.last_name,
    //   email: `${newDigitalWalletCard.id}@stickycards.co`,
    // };

    // let newPosabitCustomer = (await this.createCustomer(
    //   newPosabitCustomerData,
    // )) as PosabitCustomer;

   
    // if (customerData.points && customerData.points !== 0) {
    //   const updatedPosabitCustomer =
    //     (await this.updateCustomerNativeLoyalty(
    //       newPosabitCustomer.id,
    //     )) as PosabitCustomer;

    //   if (updatedPosabitCustomer.id) {
    //     newPosabitCustomer = updatedPosabitCustomer;
    //   }
    // }

    // customerData = newPosabitCustomer;
  } })();
