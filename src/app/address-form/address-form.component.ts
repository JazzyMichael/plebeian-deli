import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit, OnDestroy {

  @Output() valid: EventEmitter<boolean> = new EventEmitter(false);

  states: any[];
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<any>;
  addressForm: FormGroup;
  validitySub: Subscription;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.states = this.getStates().map((state: string) => ({
      abbreviation: state.split(' ')[0],
      name: state.split(' ')[state.split(' ').length - 1],
      full: state
    }));

    this.createAddressForm();
  }

  createAddressForm() {
    this.addressForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      streetExtended: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', [Validators.pattern(/(^\d{5}$)|(^\d{5}-\d{4}$)/), Validators.required]]
    });

    this.filteredOptions = this.addressForm.controls.state.valueChanges.pipe(
      startWith(''),
      map((value: string) => this.filterStates(value))
    );

    this.validitySub = this.addressForm.statusChanges.subscribe(() => {
      this.valid.emit(this.addressForm.valid ? this.addressForm.value : null);
    });
  }

  filterStates(state: string) {
    const filterValue = state.toLowerCase();

    const reg = new RegExp(filterValue);

    return this.states.filter(x => {
      const fullStateString = x.full.toLowerCase();
      return reg.test(fullStateString);
    });
  }

  ngOnDestroy() {
    this.validitySub.unsubscribe();
  }

  getStates() {
    return [
      'AK - Alaska',
      'AL - Alabama',
      'AR - Arkansas',
      'AS - American Samoa',
      'AZ - Arizona',
      'CA - California',
      'CO - Colorado',
      'CT - Connecticut',
      'DC - District of Columbia',
      'DE - Delaware',
      'FL - Florida',
      'GA - Georgia',
      'GU - Guam',
      'HI - Hawaii',
      'IA - Iowa',
      'ID - Idaho',
      'IL - Illinois',
      'IN - Indiana',
      'KS - Kansas',
      'KY - Kentucky',
      'LA - Louisiana',
      'MA - Massachusetts',
      'MD - Maryland',
      'ME - Maine',
      'MI - Michigan',
      'MN - Minnesota',
      'MO - Missouri',
      'MS - Mississippi',
      'MT - Montana',
      'NC - North Carolina',
      'ND - North Dakota',
      'NE - Nebraska',
      'NH - New Hampshire',
      'NJ - New Jersey',
      'NM - New Mexico',
      'NV - Nevada',
      'NY - New York',
      'OH - Ohio',
      'OK - Oklahoma',
      'OR - Oregon',
      'PA - Pennsylvania',
      'PR - Puerto Rico',
      'RI - Rhode Island',
      'SC - South Carolina',
      'SD - South Dakota',
      'TN - Tennessee',
      'TX - Texas',
      'UT - Utah',
      'VA - Virginia',
      'VI - Virgin Islands',
      'VT - Vermont',
      'WA - Washington',
      'WI - Wisconsin',
      'WV - West Virginia',
      'WY - Wyoming'
    ];
  }

}
