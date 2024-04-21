import 'dotenv/config'
import { addToProgram, createCustomerCard, createDigitalWalletCustomer, createPosabitCustomer, getCustomerById, normalizePhoneNumber, updateCustomerNativeLoyalty } from "./utility/index.js";
import { PosabitCustomer, PosabitCustomerProperties } from "./utility/types.js";
import { readFileSync } from 'fs';
import csvToJson from "convert-csv-to-json"




let obj = csvToJson.fieldDelimiter(',')
.formatValueByType(true)
.parseSubArray("*",',')
.getJsonFromCsv("./FreshBakedCustomers04-10-2024.csv");
const customers = obj.filter((customer:any)=>customer.Email.length >= 10).map((customer:any)=>{
  return {id:customer.id,customer_type:customer.CustomerType,first_name:customer.FirstName,last_name:customer.LastName} as PosabitCustomer
})
console.log('customers',customers)


const processCustomer =  async(customerId:  number
)=>{ 
  let customerData ;
  try{

     customerData = (await getCustomerById(
      customerId
    )) as PosabitCustomer;
  }catch(e:any){
 console.log('failed to fetch customer')
  }
  console.log('customerData',customerData)
  if(customerData.telephone){

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
    
        const newDigitalWalletCustomer =
          await createDigitalWalletCustomer(
            customerCreationPayload,
          );
    
    
        const newDigitalWalletCard =
          await createCustomerCard(
            newDigitalWalletCustomer.id,
            process.env.CARD_TEMPLATE_ID,
          );
          console.log('newDigitalWalletCard',newDigitalWalletCard)
    
    
    
        const newPosabitCustomerData: PosabitCustomerProperties = {
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          email: `${newDigitalWalletCard.id}@stickycards.co`,
        };
    
        let newPosabitCustomer = (await createPosabitCustomer(
          newPosabitCustomerData,
        )) as PosabitCustomer;
    
       
        if (customerData.points && customerData.points !== 0) {
          const updatedPosabitCustomer =
            (await updateCustomerNativeLoyalty(
              newPosabitCustomer.id,
            )) as PosabitCustomer;
    
          if (updatedPosabitCustomer.id) {
            newPosabitCustomer = updatedPosabitCustomer;
          }
        }
        console.log('customerData.points',customerData.points)
        console.log('newPosabitCustomer',newPosabitCustomer)
    
       const response =  await  addToProgram(newDigitalWalletCard.id,customerData.points)
       console.log('response',response)
      } };
  }
 processCustomer(1026913).then(customer=>console.log('customer',customer))