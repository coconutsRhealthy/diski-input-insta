import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiscountsService {
  private url = 'assets/discounts.json';

  constructor(private http: HttpClient) {}

  getDiscounts(): Observable<string[]> {
    return this.http.get<string[]>(this.url);
  }

  public getCompanyFromBaseInputLine(baseInputLine) {
    var company = baseInputLine.substring(0, baseInputLine.indexOf(","));
    return company;
  }

  public getDiscountCodeFromBaseInputLine(baseInputLine) {
    var firstIndexOfComma = this.getPosition(baseInputLine, ", ", 1);
    var secondIndexOfComma = this.getPosition(baseInputLine, ", ", 2);
    var discountCode = baseInputLine.substring(firstIndexOfComma + 2, secondIndexOfComma);
    return discountCode;
  }

  public getDiscountPercentageFromBaseInputLine(baseInputLine) {
    var secondIndexOfComma = this.getPosition(baseInputLine, ", ", 2);
    var thirdIndexOfComma = this.getPosition(baseInputLine, ", ", 3);
    var discountCode = baseInputLine.substring(secondIndexOfComma + 2, thirdIndexOfComma);
    return discountCode;
  }

  public getInfluencerFromBaseInputLine(baseInputLine) {
    var thirdIndexOfComma = this.getPosition(baseInputLine, ", ", 3);
    var fourthIndexOfComma = this.getPosition(baseInputLine, ", ", 4);
    var influencer = baseInputLine.substring(thirdIndexOfComma + 2, fourthIndexOfComma);
    return influencer;
  }

  public getDateFromBaseInputLine(baseInputLine) {
    var fourthIndexOfComma = this.getPosition(baseInputLine, ", ", 4);
    var date = baseInputLine.substring(fourthIndexOfComma + 2, baseInputLine.length);
    return date;
  }

  public getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
  }
}
