import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IncomeDto} from '../income-dto';
import {IncomeService} from '../income.service';
import {Recurrence} from '../../shared/interfaces/recurrence';
import {ConfigurationConstants} from '../../shared/configuration-constants';
import {localStorageKeys} from '../../auth/constants';


@Component({
  selector: 'app-income-form',
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.css']
})
export class IncomeFormComponent implements OnInit {

  displayedColumns: string[] = ['type', 'recurrence', 'currentAmount', 'goalAmount', 'yearlyAmount', 'delete'];
  displayedHead: string[] = ['Type', 'Recurrence', 'Current Amount', 'Goal Amount', 'Yearly Amount'];
  displayedFields: string[] = ['type', 'recurrence', 'currentAmount', 'goalAmount', 'yearlyAmount'];
  columnsWithSelect: string[] = ['recurrence'];
  columnSelect = -1;
  formArray = new FormArray([]);
  dataSource = this.formArray.controls;
  columns: number = this.displayedFields.length;
  recurrence = Object.keys(Recurrence);
  @Input() incomeList: IncomeDto[];

  constructor(private incomeService: IncomeService) {
  }

  ngOnInit(): void {
    console.log(this.incomeList);
    this.addDataInTable();
  }

  addRow() {
    const newGroup = new FormGroup({});
    this.displayedFields.forEach( field => {
      newGroup.addControl(field, new FormControl('', Validators.required));
    });
    newGroup.addControl('userId', new FormControl(localStorage.getItem(localStorageKeys.sub)));
    this.formArray.push(newGroup);
    this.dataSource = [...this.formArray.controls];
  }

  addDataInTable() {
      for (const income of this.incomeList) {
        const newGroup = new FormGroup({});
        this.displayedFields.forEach(field => {
          newGroup.addControl(field, new FormControl(income[field], Validators.required));
        });
        this.formArray.push(newGroup);
      }
  }


  deleteRow(index: number) {
    this.formArray.removeAt(index);
    this.dataSource = [...this.formArray.controls];
  }

  onSubmit() {
    console.log('submit: ', this.formArray.controls);
    const updatedIncome: IncomeDto[] = [];
    for ( const field of this.formArray.controls) {
      if (field.dirty) {
        updatedIncome.push(field.value);
      }
    }

    this.incomeService.saveIncomeList(updatedIncome).subscribe(
      resp => {
        console.log('save income api responded: ', resp);
      }
    );

  }

  hasSelectDropdown(column: string) {
    return column === 'recurrence';
  }
}
