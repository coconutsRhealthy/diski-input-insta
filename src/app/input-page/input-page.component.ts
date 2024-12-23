import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormArray } from '@angular/forms';

import { DataDirective } from '../data/data-input-insta.directive';

@Component({
  selector: 'input-page',
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.css']
})
export class InputComponent implements OnInit {

  newInput = [];
  existingInput = [];
  multipleOccurrencesInData = [];
  isTiktokInput = false;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit(): void {
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

  beforeUnloadHandler(event: BeforeUnloadEvent): void {
    event.returnValue = 'Are you sure you want to leave? Your changes may not be saved.';
  }

  profileForm = this.fb.group({
    discount_companies: this.fb.array([
      this.fb.control('')
    ]),
    discount_codes: this.fb.array([
      this.fb.control('')
    ]),
    influencers: this.fb.array([
      this.fb.control('')
    ]),
    percentages: this.fb.array([
      this.fb.control('')
    ])
  });

  get discount_companies() {
    return this.profileForm.get('discount_companies') as FormArray;
  }

  get discount_codes() {
    return this.profileForm.get('discount_codes') as FormArray;
  }

  get influencers() {
    return this.profileForm.get('influencers') as FormArray;
  }

  get percentages() {
    return this.profileForm.get('percentages') as FormArray;
  }

  addDiscountCompany() {
    this.discount_companies.push(this.fb.control(''));
  }

  addDiscountCode() {
    this.discount_codes.push(this.fb.control(''));
  }

  addInfluencer() {
    this.influencers.push(this.fb.control(''));
  }

  addPercentage() {
    this.percentages.push(this.fb.control(''));
  }

  addAll() {
    this.discount_companies.push(this.fb.control(''));
    this.discount_codes.push(this.fb.control(''));
    this.influencers.push(this.fb.control(''));
    this.percentages.push(this.fb.control(''));
  }

  getDiscountCompany(index) {
    var formArray = this.profileForm.get('discount_companies') as FormArray;
    return formArray.at(index).value;
  }

  getDiscountCode(index) {
    var formArray = this.profileForm.get('discount_codes') as FormArray;
    return formArray.at(index).value;
  }

  getInfluencer(index) {
    var formArray = this.profileForm.get('influencers') as FormArray;
    return formArray.at(index).value;
  }

  getPercentage(index) {
    var formArray = this.profileForm.get('percentages') as FormArray;
    return formArray.at(index).value;
  }

  getDate() {
    return new Date().toISOString().slice(5, 10);
  }

  deleteRow(index) {
    this.discount_companies.removeAt(index);
    this.discount_codes.removeAt(index);
    this.influencers.removeAt(index);
    this.percentages.removeAt(index);
  }

  //tot hier...
  displayInput() {
    this.existingInput = [];
    this.newInput = [];

    var influencers = this.profileForm.get('influencers') as FormArray;
    var companies = this.profileForm.get('discount_companies') as FormArray;
    var codes = this.profileForm.get('discount_codes') as FormArray;
    var percentages = this.profileForm.get('percentages') as FormArray;

    var existing = this.getExistingCodesWithoutDateAndPercentage();

    for(var i = 0; i < influencers.length; i++) {
      var company = companies.at(i).value.replace(/\s/g, "");
      var code = codes.at(i).value.replace(/\s/g, "");
      var percentage = percentages.at(i).value.replace(/\s/g, "");
      var influencer = influencers.at(i).value.replace(/\s/g, "");
      var fullNewCodeEntryNoPercentage = company + ", " + code + ", " + influencer;
      var fullNewCodeEntry = company + ", " + code + ", " + percentage + ", " + influencer;
      var isExistingInput = false;

      if(this.includesIgnoreCase(fullNewCodeEntryNoPercentage, existing)) {
        if(!this.includesIgnoreCase(fullNewCodeEntry, this.existingInput)) {
          this.existingInput.push("\"" + fullNewCodeEntryNoPercentage + ", " + this.getDateOfAlreadyExistingInput(fullNewCodeEntryNoPercentage) + "\",");
          this.newInput.push("\"..." + fullNewCodeEntry + ", " + this.getDate() + "\",");
          isExistingInput = true;
        }
      } else {
        if(!this.includesIgnoreCase(fullNewCodeEntry, this.newInput)) {
          this.newInput.push("\"" + fullNewCodeEntry + ", " + this.getDate() + "\",");
        }
      }
    }

    this.existingInput.reverse();
    this.newInput.reverse();
  }

  stringInArrayContainsStringPart(stringPart, array) {
    for(var i = 0; i < array.length; i++) {
      if(this.includesIgnoreCase(stringPart, array)) {
        return true;
      }
    }

    return false;
  }

  includesIgnoreCase(stringToCheck, arrayToCheck) {
    var dummyFilterArray = arrayToCheck.filter((str) => str.toLowerCase().includes(stringToCheck.toLowerCase()));
    return dummyFilterArray.length > 0;
  }

  getExistingCodesWithoutDateAndPercentage() {
    var existingCodeEntries = DataDirective.getDataArray();
    var existingCodesNoDateAndPercentages = [];

    for(var i = 0; i < existingCodeEntries.length; i++) {
      var lineWithoutDateAndPercentage = this.removeDateAndPercentageFromBaseCodeEntry(existingCodeEntries[i]);

      if(lineWithoutDateAndPercentage.replace(/\s/g, '').length) {
        existingCodesNoDateAndPercentages.push(lineWithoutDateAndPercentage);
      }
    }

    return existingCodesNoDateAndPercentages;
  }

  getDateOfAlreadyExistingInput(inputThatAlreadyExists) {
    var dateOfExistingInputEntry = "?";
    var existingCodeEntries = DataDirective.getDataArray();

    for(var i = 0; i < existingCodeEntries.length; i++) {
      if(dateOfExistingInputEntry === "?") {
        var existingBaseCodeEntryNoPercentage = this.removeDateAndPercentageFromBaseCodeEntry(existingCodeEntries[i].toLowerCase());

        if(existingBaseCodeEntryNoPercentage.includes(inputThatAlreadyExists.toLowerCase())) {
          dateOfExistingInputEntry = existingCodeEntries[i].substring
            (existingCodeEntries[i].lastIndexOf(", ") + 2, existingCodeEntries[i].length);
        }
      } else {
        break;
      }
    }

    return dateOfExistingInputEntry;
  }

  removeDateAndPercentageFromBaseCodeEntry(baseCodeEntry) {
    var lineWithoutDate = baseCodeEntry.substring(0, baseCodeEntry.lastIndexOf(", "));
    var codegiver = lineWithoutDate.substring(lineWithoutDate.lastIndexOf(", ") + 2, lineWithoutDate.length);
    var firstpart = lineWithoutDate.substring(0, lineWithoutDate.lastIndexOf(", "));
    firstpart = firstpart.substring(0, firstpart.lastIndexOf(", "));
    var lineWithoutDateAndPercentage = firstpart + ", " + codegiver;
    return lineWithoutDateAndPercentage;
  }

  toggleTiktokInput() {
    const influencersArray = this.influencers;
    var tiktokAddition = "_tiktok";
    for(let i = 0; i < influencersArray.length; i++) {
      let value = influencersArray.at(i).value;
      if(this.isTiktokInput) {
        if(!value.endsWith(tiktokAddition)) {
          influencersArray.at(i).setValue(value + tiktokAddition);
        }
      } else {
        if(value.endsWith(tiktokAddition)) {
          influencersArray.at(i).setValue(value.slice(0, -7));
        }
      }
    }
  }
}
