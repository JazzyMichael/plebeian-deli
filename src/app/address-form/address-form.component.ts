import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  states: string[];
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<any>;

  constructor() { }

  ngOnInit() {
    this.states = this.getStates();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: string) => this.filterStates(value))
    );
  }

  filterStates(value: string) {
    const filterValue = value.toLowerCase();

    const reg = new RegExp(filterValue);

    return this.states.filter(x => {
      const state = x.toLowerCase();
      return reg.test(state);
    });
  }

  getStates() {
    return [
      "AK - Alaska", 
      "AL - Alabama", 
      "AR - Arkansas", 
      "AS - American Samoa", 
      "AZ - Arizona", 
      "CA - California", 
      "CO - Colorado", 
      "CT - Connecticut", 
      "DC - District of Columbia", 
      "DE - Delaware", 
      "FL - Florida", 
      "GA - Georgia", 
      "GU - Guam", 
      "HI - Hawaii", 
      "IA - Iowa", 
      "ID - Idaho", 
      "IL - Illinois", 
      "IN - Indiana", 
      "KS - Kansas", 
      "KY - Kentucky", 
      "LA - Louisiana", 
      "MA - Massachusetts", 
      "MD - Maryland", 
      "ME - Maine", 
      "MI - Michigan", 
      "MN - Minnesota", 
      "MO - Missouri", 
      "MS - Mississippi", 
      "MT - Montana", 
      "NC - North Carolina", 
      "ND - North Dakota", 
      "NE - Nebraska", 
      "NH - New Hampshire", 
      "NJ - New Jersey", 
      "NM - New Mexico", 
      "NV - Nevada", 
      "NY - New York", 
      "OH - Ohio", 
      "OK - Oklahoma", 
      "OR - Oregon", 
      "PA - Pennsylvania", 
      "PR - Puerto Rico", 
      "RI - Rhode Island", 
      "SC - South Carolina", 
      "SD - South Dakota", 
      "TN - Tennessee", 
      "TX - Texas", 
      "UT - Utah", 
      "VA - Virginia", 
      "VI - Virgin Islands", 
      "VT - Vermont", 
      "WA - Washington", 
      "WI - Wisconsin", 
      "WV - West Virginia", 
      "WY - Wyoming"
    ];
  }

}
