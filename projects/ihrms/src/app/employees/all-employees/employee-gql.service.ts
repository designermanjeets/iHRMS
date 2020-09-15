import { Injectable } from '@angular/core';
import gql from "graphql-tag";

@Injectable({
  providedIn: 'root'
})
export class EmployeeGQLService {

  users: [];

  constructor() { }

  getUser(id) {
    console.log(this.users)
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
        joiningdate,
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
