import html2canvas from 'html2canvas';

import { Component } from '@angular/core';

import { DiscountsService } from '../services/discounts.service';

import {firstBy} from "thenby";

@Component({
  selector: 'influ-table',
  templateUrl: './insta.component.html',
  styleUrls: ['./insta.component.css']
})
export class InstaComponent {

  tableHeight = 500;
  tableWidth = 500;
  tableFontSize = 18;
  tableRowHeight = 0.0004;
  tableRowLineHeight = 0.0004;
  tableRowMinHeight = 0.0004;
  tableLineAndFontColor = "brown";
  tableBackgroundColor = "green";
  kortingDate = "1 jan";
  kortingDateFontSize = 10;
  headerFontSize = 16;
  bodyFontSize = 16;
  startDateForPostString = "2021-07-05";
  maxAmountForPost = "3";

  tiktokSize = false;
  tablePaddingLeft = "12px";
  tablePaddingTop = "12px";
  tablePaddingRight = "12px";

  instaDiscountEntries = [];

  aspectRatio = "-1";

  rowStyles = {
    'height.px': this.tableRowHeight,
    'line-height.px': this.tableRowLineHeight,
    'min-height.px': this.tableRowMinHeight,
    'border-color': this.tableLineAndFontColor,
    'font-size.px': 40,
    'padding-left': this.tablePaddingLeft,
    'padding-right': this.tablePaddingRight
  };

  showExtraBottomLine = true;
  extraBottomLineValue = "*download Temu app via link in bio en ontvang €200 shoptegoed en 30% korting";
  giftCardBottomLineValue = "**€5 gift cards voor heel veel shops! (o.a. zalando, myjewellery) Zie link in bio";
  isEditing: boolean = false;
  rowToDelete: number = 0;
  selectedRowToChangeColour: number;
  rgbRed: number;
  rgbGreen: number;
  rgbBlue: number;
  showRgbInputs: boolean = false;
  splitOption;

  constructor(private discountsService: DiscountsService) { }

  setTableBackgroundColour(hex) {
    this.tableBackgroundColor = hex;
  }

  toggleTableLayout() {
    this.tiktokSize = !this.tiktokSize;

    if(this.tiktokSize) {
      this.tablePaddingLeft = "30px";
      this.tablePaddingTop = "45px";
      this.tablePaddingRight = "30px";

      var element = document.querySelector('#insta-table') as HTMLElement;
      var tableWidth = element.offsetWidth;

      var desiredTiktokTableHeight = ((tableWidth / 9) * 16);
      this.tableHeight = desiredTiktokTableHeight;
      this.extraBottomLineValue = "*download Temu app via link in bio voor €200 shoptegoed en 30% off";
    } else {
      this.tablePaddingLeft = "12px";
      this.tablePaddingTop = "12px";
      this.tablePaddingRight = "12px";

      this.tableWidth = 500;
      this.tableHeight = 500;
      this.extraBottomLineValue = "*download Temu app via link in bio en ontvang €200 shoptegoed en 30% korting";
    }
  }

  setAspectRatio45() {
      var element = document.querySelector('#insta-table') as HTMLElement;
      var tableHeight = element.offsetHeight;
      var desiredTableWidth = ((tableHeight / 5) * 4);
      this.tableWidth = desiredTableWidth;
  }

  setAspectRatio(ratio: string) {
      var element = document.querySelector('#insta-table') as HTMLElement;
      var tableHeight = element.offsetHeight;
      var desiredTableWidth;

      if (ratio === '4:5') {
          desiredTableWidth = (tableHeight / 5) * 4;
      } else if (ratio === '3:4') {
          desiredTableWidth = (tableHeight / 4) * 3;
      } else if (ratio === '9:16') {
          desiredTableWidth = (tableHeight / 16) * 9;
      } else {
          return;
      }

      this.tableWidth = desiredTableWidth;
  }

  setAspectRatio1on1() {
      var element = document.querySelector('#insta-table') as HTMLElement;
      var tableHeight = element.offsetHeight;
      var desiredTableWidth = ((tableHeight / 5) * 4);
      this.tableWidth = desiredTableWidth;
  }

  calculateAspectRatio() {
      var element = document.querySelector('#insta-table') as HTMLElement;
      var tableHeight = element.offsetHeight;
      var tableWidth = element.offsetWidth;
      var calcTableWidth = 4 as const;
      var calcTableHeight = (tableHeight / tableWidth) * 4;
      this.aspectRatio = "" + calcTableWidth + " : " + calcTableHeight;
  }

  defaultSizeTable() {
    this.tableWidth = 500;
    this.tableHeight = 500;
  }

  generateInstaPost() {
    this.discountsService.getDiscounts().subscribe((data) => {
      var baseData = [];

      data.forEach((line: string) => {
        baseData.push(line);
      });

      this.instaDiscountEntries = [];
      var baseKortingEntries = [];

      for(var i = 0; i < baseData.length; i++) {
        baseKortingEntries.push(baseData[i]);
      }

      baseKortingEntries.reverse();
      var startDate = this.getDateFromDateString(this.startDateForPostString);

      for(var i = 0; i < baseKortingEntries.length; i++) {
        var dateString = this.getDateFromBaseInputLine(baseKortingEntries[i]);
        var date = this.getDateFromDateString(dateString);

        if(date >= startDate) {
          this.instaDiscountEntries.push({
             "company": this.getCompanyFromBaseInputLine(baseKortingEntries[i]),
             "code": this.getDiscountCodeFromBaseInputLine(baseKortingEntries[i]),
             "via": this.getInfluencerFromBaseInputLine(baseKortingEntries[i]),
             "percentage": this.getDiscountPercentageFromBaseInputLine(baseKortingEntries[i]),
             "tracker": i,
             });
        }
      }

      this.instaDiscountEntries = this.instaDiscountEntries.slice(0, parseInt(this.maxAmountForPost));
      this.addRowNumbers();

      if(this.splitOption) {
        this.sortTable();
        const halfLength = Math.floor(this.instaDiscountEntries.length / 2);
        const oneThirdLength = Math.floor(this.instaDiscountEntries.length / 3);

        if(this.splitOption === '1') {
            this.instaDiscountEntries = this.instaDiscountEntries.slice(0, halfLength);
        } else if(this.splitOption === '2') {
            this.instaDiscountEntries = this.instaDiscountEntries.slice(halfLength);
        } else if (this.splitOption === '3.1') {
            this.instaDiscountEntries = this.instaDiscountEntries.slice(0, oneThirdLength);
        } else if (this.splitOption === '3.2') {
            this.instaDiscountEntries = this.instaDiscountEntries.slice(oneThirdLength, oneThirdLength * 2);
        } else if (this.splitOption === '3.3') {
            this.instaDiscountEntries = this.instaDiscountEntries.slice(oneThirdLength * 2);
        }
      }
    });
  }

  getDateFromDateString(dateString: string): Date {
      const [monthStr, dayStr] = dateString.split("-");
      const month = parseInt(monthStr, 10) - 1;
      const day = parseInt(dayStr, 10);

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();

      let year = currentYear;

      if (month > currentMonth + 2) {
          year -= 1;
      }

      return new Date(year, month, day);
  }

  getCompanyFromBaseInputLine(baseInputLine) {
    return this.discountsService.getCompanyFromBaseInputLine(baseInputLine);
  }

  getDiscountCodeFromBaseInputLine(baseInputLine) {
    return this.discountsService.getDiscountCodeFromBaseInputLine(baseInputLine);
  }

  getInfluencerFromBaseInputLine(baseInputLine) {
    return this.discountsService.getInfluencerFromBaseInputLine(baseInputLine);
  }

  getDateFromBaseInputLine(baseInputLine) {
    return this.discountsService.getDateFromBaseInputLine(baseInputLine);
  }

  getPosition(string, subString, index) {
    return this.discountsService.getPosition(string, subString, index);
  }

  getDiscountPercentageFromBaseInputLine(baseInputLine) {
    return this.discountsService.getDiscountPercentageFromBaseInputLine(baseInputLine);
  }

  sortTable() {
      this.instaDiscountEntries.sort(
          firstBy("company")
          //firstBy("company", { direction: -1 })
          .thenBy("tracker", "desc")
      );
      this.addRowNumbers();
  }

  toggleExtraBottomLine() {
    this.showExtraBottomLine = !this.showExtraBottomLine;
  }

  addRowNumbers(): void {
    let rowNumber = 1;
    this.instaDiscountEntries.forEach(entry => {
      entry.rowNumber = rowNumber;
      rowNumber++;
    });
  }

  captureScreenshotFromTable() {
    const element = document.getElementById('insta-table');

    html2canvas(element).then(canvas => {
      canvas.toBlob(blob => {
        const screenshotFile = new File([blob], 'screenshot.png', { type: 'image/png' });
        this.saveScreenshot(screenshotFile);
      }, 'image/png');
    });
  }

  saveScreenshot(file: File) {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  }

  editCellContent(event: MouseEvent) {
    const cell = event.target as HTMLElement;
    this.isEditing = true;

    cell.addEventListener('blur', () => {
      this.isEditing = false;
    });
  }

  deleteRow(): void {
    const indexToDelete = this.rowToDelete - 1;
    if (indexToDelete >= 0 && indexToDelete < this.instaDiscountEntries.length) {
      this.instaDiscountEntries.splice(indexToDelete, 1);
      this.rowToDelete = 0;
      this.addRowNumbers();
    } else {
      alert('Invalid row number');
    }
  }

  changeRowBackgroundColor() {
    if (!this.showRgbInputs) {
      this.showRgbInputs = true;
      return;
    }

    const tableElement = document.getElementById('insta-table') as HTMLTableElement;

    if (tableElement) {
      const rowIndex = this.selectedRowToChangeColour;

      if (rowIndex >= 0 && rowIndex < tableElement.rows.length) {
        const tableRow = tableElement.rows[rowIndex];
        const rgbColor = "rgb(" + this.rgbRed + ", " + this.rgbGreen + ", " + this.rgbBlue + ")";
        tableRow.style.backgroundColor = rgbColor;
      }
    }
  }
}
