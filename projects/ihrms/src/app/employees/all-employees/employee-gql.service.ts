import { Injectable } from '@angular/core';
import gql from "graphql-tag";
import {Query} from "apollo-angular";

@Injectable({
  providedIn: 'root'
})
export class EmployeeGQLService {

  users: [];

  constructor() { }

  getUser(id) {
    if(!this.users) {
      return false;
    } else {
      return this.users.find(
        (user: any) => user.emmpid === id);
    }

  }

  setUsers(users) {
    this.users = users;
  }
}

  export const GET_USERS_QUERY = gql`
   query getUsers(
      $pagination: Pagination!
    ) {
    users(
      query: $pagination,
    ) {
        username,
        email,
        firstname,
        lastname,
        role,
        emmpid,
        corporateid,
        mobile,
        password,
        joiningdate,
        department,
        department_ID,
        designation {
          _id
          designation
        },
        _id,
        permissions {
          holiday {
            read
            write
          }
        }
      }
  }
 `;


@Injectable({
  providedIn: 'root',
})
export class GET_USER_QUERY extends Query<Response> {
  document = gql`
   query getUser(
      $email: String!
    ) {
    user(
      email: $email,
    ) {
        username,
        email,
        firstname,
        lastname,
        role,
        emmpid,
        corporateid,
        mobile,
        joiningdate,
        department,
        department_ID,
        designation {
          _id
          designation
        },
        _id,
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
