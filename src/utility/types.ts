export interface PosabitCustomer {
    id: number;
    first_name: string;
    terms_agreed: boolean;
    points: number;
    last_name: string;
    birth_year: number;
    gender: string;
    telephone: string;
    email: string;
    active: boolean;
    sms_opt_out: boolean;
    sms_opt_in: boolean;
    address: string;
    zipcode: string;
    city: string;
    state: string;
    birthday: string;
    customer_type: string;
    drivers_license: string;
    id_expiration?: string;
    medical_card_expiration?: string;
  }

  export interface PosabitCustomer {
    id: number;
    first_name: string;
    terms_agreed: boolean;
    points: number;
    last_name: string;
    birth_year: number;
    gender: string;
    telephone: string;
    email: string;
    active: boolean;
    sms_opt_out: boolean;
    sms_opt_in: boolean;
    address: string;
    zipcode: string;
    city: string;
    state: string;
    birthday: string;
    customer_type: string;
    drivers_license: string;
    id_expiration?: string;
    medical_card_expiration?: string;
  }
  
  export interface PosabitCustomerProperties {
    first_name?: string;
    terms_agreed?: boolean;
    points?: number;
    last_name?: string;
    birth_year?: number;
    gender?: string;
    telephone?: string;
    email?: string;
    active?: boolean;
    sms_opt_out?: boolean;
    sms_opt_in?: boolean;
    address?: string;
    zipcode?: string;
    city?: string;
    state?: string;
    birthday?: string;
    customer_type?: string;
    drivers_license?: string;
    id_expiration?: string;
    medical_card_expiration?: string;
    points_adjustment?: number;
  }
  