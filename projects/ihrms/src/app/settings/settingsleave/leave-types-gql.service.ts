import { Injectable } from '@angular/core';
import { Mutation } from "apollo-angular";
import gql from "graphql-tag";

@Injectable({
  providedIn: 'root',
})
export class RegisterLeaveTypeGQL extends Mutation {
  document = gql`
    mutation createLeaveType(
      $leavetype: String!,
      $leavedays: String!,
      $carryforward: String
      $status: String
    ) {
      createLeaveType(
        leavetype: $leavetype,
        leavedays: $leavedays,
        carryforward: $carryforward,
        status: $status,
      ) {
        leavetype
        leavedays
        carryforward
        status
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateLeaveTypeGQL extends Mutation {
  document = gql`
    mutation updateLeaveType(
      $id: ID!
      $leavetype: String!,
      $leavedays: String!,
      $carryforward: String
      $status: String
    ) {
      updateLeaveType(
        id: $id,
        leavetype: $leavetype,
        leavedays: $leavedays,
        carryforward: $carryforward,
        status: $status,
      ) {
        _id
        leavetype
        leavedays
        carryforward
        status
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteLeaveTypeGQL extends Mutation {
  document = gql`
    mutation deleteLeaveType(
      $id: ID!
    ) {
      deleteLeaveType(
        id: $id
      ) {
        _id
      }
    }
  `;
}

export const GET_LEAVETYPES_QUERY = gql`
   query getLeaveTypes(
      $pagination: Pagination!
    ) {
      getLeaveTypes(
        query: $pagination
      ) {
        _id
        leavetype
        leavedays
        carryforward
        status
      }
    }
`;
