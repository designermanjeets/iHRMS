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


@Injectable({
  providedIn: 'root',
})
export class UpdateCompanyGQL extends Mutation {
  document = gql`
    mutation updateCompany(
      $companyname: String,
      $address1: String,
      $address2: String,
      $countryid: String,
      $corporateid: String
    ) {
    updateCompany(
      companyname: $companyname,
      address1: $address1,
      address2: $address2,
      countryid: $countryid,
      corporateid: $corporateid
    ) {
        companyname,
        address1,
        address2,
        countryid,
        corporateid
      }
  }
  `;
}


@Injectable({
  providedIn: 'root',
})
export class DeleteCompanyGQL extends Mutation {
  document = gql`
    mutation deleteCompany(
      $corporateid: String
    ) {
    deleteCompany(
      corporateid: $corporateid
    ) {
        corporateid
      }
  }
  `;
}

export const GET_COMPANY_QUERY = gql`
   query getCompany(
      $corporateid: String!
    ) {
    getCompany(
      corporateid: $corporateid
    ) {
        corporateid,
        companyname
      }
  }
`;

export const GET_COMPANIES_QUERY = gql`
   query getCompanies(
      $pagination: Pagination!
    ) {
    getCompanies(
      query: $pagination,
    ) {
        corporateid
      }
  }
`;
