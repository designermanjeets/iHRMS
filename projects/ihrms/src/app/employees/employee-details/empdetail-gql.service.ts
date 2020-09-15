import { Injectable } from '@angular/core';
import gql from "graphql-tag";
import {Mutation} from "apollo-angular";

@Injectable({
  providedIn: 'root'
})
export class EmpdetailGQLService extends Mutation{

  document = gql`
    mutation EmpUpdateMutation(
      $id: ID!
      $username: String!
      $email: String!
      $firstname: String
      $lastname: String
      $role:String
      $corporateid: String
      $emmpid: String
      $mobile: String
      $joiningdate: ISODate
    ) {
    updateUser(
        id: $id,
        username: $username,
        email: $email,
        firstname: $firstname,
        lastname: $lastname,
        role: $role,
        corporateid: $corporateid,
        emmpid: $emmpid,
        mobile: $mobile,
        joiningdate: $joiningdate
    ) {
        username,
        email,
        password,
        role,
        firstname,
        lastname,
        corporateid,
        emmpid,
        mobile
        joiningdate
      }
  }
  `;
}

@Injectable({
  providedIn: 'root'
})
export class CreateUserGQL extends Mutation {
  document = gql`
    mutation SignUpMutation(
      $username: String!
      $email: String!
      $password: String!
      $role: String
      $firstname: String
      $lastname: String
      $emmpid: String!
      $corporateid: String!
      $joiningdate: ISODate
      $mobile: String
      $permissions: PermissionsInput
    ) {
    signup(
        username: $username,
        email: $email,
        password: $password,
        role: $role,
        firstname: $firstname
        lastname: $lastname,
        emmpid: $emmpid,
        corporateid: $corporateid,
        joiningdate: $joiningdate,
        mobile: $mobile,
        permissions: $permissions,
    ) {
        username,
        email,
        password,
        role,
        firstname,
        lastname,
        emmpid,
        corporateid,
        joiningdate,
        mobile,
        permissions {
          holiday {
            read
            write
          }
        }
      }
  }
  `;
}

export const GET_COMPANIES_QUERY = gql`
   query getCompanies(
      $pagination: Pagination!
    ) {
    getCompanies(
      query: $pagination,
    ) {
        corporateid,
      }
  }
`;
