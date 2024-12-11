export interface GetContacts {
  _id: string;
  firstName: string;
  lastName: string;
  owner: string;
  __v: number;
}

export interface addContact {
  firstName: string;
  lastName: string;
  birthdate: string;
  email: string;
  phone: string;
  street1: string;
  street2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

export interface addContactResponse extends addContact {
  _id: string;
  owner: string;
  __v: number;
}

export interface addUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface addUserResponse {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    __v: number;
  };
  token: string;
}
