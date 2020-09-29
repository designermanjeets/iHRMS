import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'uniqueBy',
  pure: false
})

export class UniqueByPipe implements PipeTransform {
  transform(value: any): any{
    if(value!== undefined && value!== null){
      return _.uniqBy(value, 'name');
    }
    return value;
  }
}
