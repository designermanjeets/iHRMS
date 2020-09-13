import {Injectable} from '@angular/core';
import {Mutation} from 'apollo-angular';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class RegisterCompanyGQL extends Mutation {
  document = gql`
    mutation CreateCompany(
      $companyname: String,
      $address1: String,
      $address2: String,
      $countryid: String,
    ) {
    createCompany(
      companyname: $companyname,
      address1: $address1,
      address2: $address2,
      countryid: $countryid,
    ) {
        companyname,
        address1,
        address2,
        countryid
      }
  }
  `;
}

export const GET_COMPANY_QUERY = gql`
   query getCompany(
      $id: ID!
    ) {
    getCompany(
      id: $id
    ) {
        corporateid
      }
  }
`;
