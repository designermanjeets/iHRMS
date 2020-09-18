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
      $title: String,
      $date: ISODate,
      $day: String,
      $paid: String
    ) {
    updateHoliday(
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
export class DeleteHolidayGQL extends Mutation {
  document = gql`
    mutation deleteHoliday(
      $date: ISODate
    ) {
    deleteHoliday(
      date: $date
    ) {
        date
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
        title,
        date,
        day,
        paid
      }
  }
`;
