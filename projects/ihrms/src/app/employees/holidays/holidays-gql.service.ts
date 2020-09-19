import { Injectable } from '@angular/core';
import { Mutation } from "apollo-angular";
import gql from "graphql-tag";

@Injectable({
  providedIn: 'root',
})
export class RegisterHolidayGQL extends Mutation {
  document = gql`
    mutation CreateHoliday(
      $title: String,
      $date: ISODate,
      $day: String,
      $paid: String
    ) {
    createHoliday(
      title: $title,
      date: $date,
      day: $day,
      paid: $paid
    ) {
      title,
      date,
      day,
      paid
      }
  }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateHolidayGQL extends Mutation {
  document = gql`
    mutation updateHoliday(
      $id: ID!,
      $title: String,
      $date: ISODate,
      $day: String,
      $paid: String
    ) {
    updateHoliday(
      id: $id,
      title: $title,
      date: $date,
      day: $day,
      paid: $paid
    ) {
      _id,
      title,
      date,
      day,
      paid
      }
  }
  `;
}


@Injectable({
  providedIn: 'root',
})
export class DeleteHolidayGQL extends Mutation {
  document = gql`
    mutation deleteHoliday(
      $id: ID!
    ) {
    deleteHoliday(
      id: $id
    ) {
        _id
      }
  }
  `;
}

export const GET_HOLIDAYS_QUERY = gql`
   query getHolidays(
      $pagination: Pagination!
    ) {
    getHolidays(
      query: $pagination,
    ) {
        _id,
        title,
        date,
        day,
        paid
      }
  }
`;
