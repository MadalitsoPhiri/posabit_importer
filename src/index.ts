import 'dotenv/config'
import { addToProgram, createCustomerCard, createDigitalWalletCustomer, createPosabitCustomer, getCustomerById, normalizePhoneNumber, updateCustomerNativeLoyalty } from "./utility/index.js";
import { PosabitCustomer, PosabitCustomerProperties } from "./utility/types.js";
import csvToJson from "convert-csv-to-json"




let obj = csvToJson.fieldDelimiter(',')
.formatValueByType(true)
.parseSubArray("*",',')
.getJsonFromCsv("./FreshBakedCustomers04-10-2024.csv");
const customers = obj.map((customer:any)=>{
  return {id:customer.id,customer_type:customer.CustomerType,first_name:customer.FirstName,last_name:customer.LastName} as PosabitCustomer
})



const processCustomer =  async(customerId:  number
)=>{ 
  let customerData ;
  try{

     customerData = (await getCustomerById(
      customerId
    )) as PosabitCustomer;
  }catch(e:any){
 console.error('failed to fetch customer',e)
  }

  if(customerData.telephone){

    const cardIdExtractedFromEmail = customerData?.email?.split?.('@')?.[0];
    
    const cardIdRegexPattern = /^\d{6}-\d{3}-\d{3}$/;
    
    const isValidCardId =
      cardIdExtractedFromEmail?.match?.(cardIdRegexPattern);
    
    if (!isValidCardId) {
    
    
        const customerCreationPayload = {
          phone: normalizePhoneNumber(customerData.telephone),
          firstName: customerData.first_name ,
          surname: customerData.last_name ,
          dateOfBirth:customerData.birthday,
          gender:customerData.gender,
          email:customerData.email
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
    
    await  addToProgram(newDigitalWalletCard.id,customerData.points)
      } };
  }



for(let i=0;i < customers.length ;i++){
  try{
   await  processCustomer(customers[i].id)
  }catch(e:any){
    console.error('could not process customer')
  }
} 