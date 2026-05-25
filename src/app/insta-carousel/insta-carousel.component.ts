import html2canvas from 'html2canvas';

import { Component, OnInit } from '@angular/core';

import { DiscountsService } from '../services/discounts.service';

interface DiscountEntry {
  company: string;
  code: string;
  via: string;
  percentage: string;
  tracker: number;
}

/**
 * Instagram-carousel friendly view of the discount list.
 *
 * This is intentionally separate from InstaComponent: it shares the same data
 * source (DiscountsService) but renders the entries as fixed-aspect-ratio
 * slides (4:5 / 3:4 / 1:1) that are paginated into ~25 lines per slide so the
 * whole list can be posted as a multi-image Instagram carousel.
 */
@Component({
  selector: 'insta-carousel',
  templateUrl: './insta-carousel.component.html',
  styleUrls: ['./insta-carousel.component.css']
})
export class InstaCarouselComponent implements OnInit {

  // ---- Layout / carousel controls -------------------------------------
  startDate = '01-01';          // MM-DD; only entries on/after this date are shown
  linesPerPage = 25;            // max discount lines per carousel slide
  columnsPerSlide = 1;          // columns inside a single slide
  aspectRatio: '4:5' | '3:4' | '1:1' = '4:5';   // 4:5 is Instagram's recommended portrait
  bodyFontSize = 26;            // font size of the discount lines (design px)
  previewScale = 0.4;           // on-screen zoom only — exports are always full resolution

  // ---- Slide text -----------------------------------------------------
  headerTitle = 'Kortingscodes';
  headerSubtitle = 'diski.nl';
  footerNote = 'Meer codes? Link in bio ✨';

  // ---- Date shown on every slide --------------------------------------
  // A carousel is always made for one single date; defaults to today.
  postDate = this.todayMMDD();   // MM-DD

  private dutchMonths = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december'
  ];

  // ---- Slide design dimensions (the exported pixel size) --------------
  slideWidth = 1080;

  // ---- Data -----------------------------------------------------------
  allEntries: DiscountEntry[] = [];
  pages: DiscountEntry[][] = [];

  constructor(private discountsService: DiscountsService) { }

  ngOnInit(): void {
    this.loadAndBuild();
  }

  /** Fetch + filter + sort the discount list, then paginate it. */
  loadAndBuild(): void {
    this.discountsService.getDiscounts().subscribe((data) => {
      const lines = [...data].reverse();   // newest first, same convention as InstaComponent
      const startDate = this.getDateFromDateString(this.startDate);

      const entries: DiscountEntry[] = [];
      for (let i = 0; i < lines.length; i++) {
        const dateString = this.getDateFromBaseInputLine(lines[i]);
        const date = this.getDateFromDateString(dateString);

        if (date >= startDate) {
          entries.push({
            company: this.getCompanyFromBaseInputLine(lines[i]),
            code: this.getDiscountCodeFromBaseInputLine(lines[i]),
            via: this.getInfluencerFromBaseInputLine(lines[i]),
            percentage: this.getDiscountPercentageFromBaseInputLine(lines[i]),
            tracker: i,
          });
        }
      }

      entries.sort((a, b) => a.company.localeCompare(b.company));
      this.allEntries = entries;
      this.buildPages();
    });
  }

  /** Split the already-loaded entries into slide-sized pages. */
  buildPages(): void {
    const perPage = Math.max(1, this.linesPerPage || 1);
    const pages: DiscountEntry[][] = [];

    for (let i = 0; i < this.allEntries.length; i += perPage) {
      const slice = this.allEntries.slice(i, i + perPage);
      pages.push(this.reorderForColumns(slice, this.columnsPerSlide));
    }

    this.pages = pages;
  }

  /** Reorder a page so a left-to-right CSS grid reads top-to-bottom per column. */
  reorderForColumns(data: DiscountEntry[], columns: number): DiscountEntry[] {
    const cols = Math.max(1, columns);
    if (cols === 1) return data;

    const rows = Math.ceil(data.length / cols);
    const reordered: DiscountEntry[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const index = c * rows + r;
        if (index < data.length) {
          reordered.push(data[index]);
        }
      }
    }

    return reordered;
  }

  /** Height of one slide in design pixels, derived from the chosen aspect ratio. */
  get slideHeight(): number {
    switch (this.aspectRatio) {
      case '3:4': return (this.slideWidth / 3) * 4;
      case '1:1': return this.slideWidth;
      case '4:5':
      default:    return (this.slideWidth / 4) * 5;
    }
  }

  trackByTracker(_index: number, entry: DiscountEntry): number {
    return entry.tracker;
  }

  /** Today's date as an "MM-DD" string. */
  private todayMMDD(): string {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${mm}-${dd}`;
  }

  /** The post date formatted in Dutch, e.g. "05-22" -> "22 mei". */
  get dutchDate(): string {
    const [mm, dd] = (this.postDate || '').split('-');
    const month = parseInt(mm, 10) - 1;
    const day = parseInt(dd, 10);
    if (isNaN(month) || isNaN(day) || month < 0 || month > 11) return '';
    return `${day} ${this.dutchMonths[month]}`;
  }

  // ---- Export ---------------------------------------------------------

  /** Render a single slide to a full-resolution PNG and download it. */
  async exportSlide(index: number): Promise<void> {
    const slide = document.getElementById('carousel-slide-' + index);
    if (!slide) return;

    // Neutralise the on-screen preview zoom so html2canvas captures at 1:1.
    const scaler = slide.parentElement;
    const previousTransform = scaler ? scaler.style.transform : '';
    if (scaler) scaler.style.transform = 'none';

    try {
      const canvas = await html2canvas(slide, { scale: 2, backgroundColor: null });
      await new Promise<void>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) this.download(blob, `diski-carousel-${index + 1}.png`);
          resolve();
        }, 'image/png');
      });
    } finally {
      if (scaler) scaler.style.transform = previousTransform;
    }
  }

  /** Export every slide in order. */
  async exportAll(): Promise<void> {
    for (let i = 0; i < this.pages.length; i++) {
      await this.exportSlide(i);
    }
  }

  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  // ---- Input-line parsing (delegated to the shared service) -----------

  getCompanyFromBaseInputLine(baseInputLine) {
    return this.discountsService.getCompanyFromBaseInputLine(baseInputLine);
  }

  getDiscountCodeFromBaseInputLine(baseInputLine) {
    return this.discountsService.getDiscountCodeFromBaseInputLine(baseInputLine);
  }

  getInfluencerFromBaseInputLine(baseInputLine) {
    return this.discountsService.getInfluencerFromBaseInputLine(baseInputLine);
  }

  getDiscountPercentageFromBaseInputLine(baseInputLine) {
    return this.discountsService.getDiscountPercentageFromBaseInputLine(baseInputLine);
  }

  getDateFromBaseInputLine(baseInputLine) {
    return this.discountsService.getDateFromBaseInputLine(baseInputLine);
  }

  /** Parse an "MM-DD" string into a Date, mirroring InstaComponent's logic. */
  getDateFromDateString(dateString: string): Date {
    const [monthStr, dayStr] = dateString.split('-');
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
}
