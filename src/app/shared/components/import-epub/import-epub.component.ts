import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// import { Book, Rendition } from 'epubjs';
import * as epubjs from 'epubjs';
import { DateTime } from 'luxon';

import { BackendService } from '@src/app/core/services/backend.service';
import { EpubService } from '@src/app/core/services/epub.service';

@Component({
  selector: 'app-import-epub',
  templateUrl: './import-epub.component.html',
  styleUrls: ['./import-epub.component.scss'],
})
export class ImportEpubComponent implements OnInit {
  @ViewChild('epubArea', { static: true })
  renderArea: ElementRef;

  @Input()
  epubFilename = 'mwb_E_202101';

  // public epubPath = '/assets/epubs/';

  public book: epubjs.Book;

  public rendition: epubjs.Rendition;

  public displayedProgramIndex = 0;
  public displayedProgram;

  public programs: Array<any>;
  /**
   * Language of the book,
   * taken from the filename
   */
  public epubLangCode: string;

  /**
   * Month of the epub,
   * taken from the filename
   */
  public epubMonth: DateTime;

  constructor(
    protected backendService: BackendService,
    private epubService: EpubService
  ) {}

  async ngOnInit() {
    // this.book = ePub(this.epubFilename);
    // this.book = ePub(this.epubPath + this.epubFilename + '.epub');
    // console.log(
    //   'DATE Full data if enero ',
    //   new Intl.DateTimeFormat('es', { month: 'long' }).format(new Date(9e8))
    // );

    // // Display the whole Book object
    // await this.book.ready;

    // // Get language from the filename
    // this.getMonthAndLangFromEpub();

    // await this.extractPrograms();

    this.programs = await this.epubService.getProgramsFromEpub(
      this.epubFilename,
      this.backendService.getSignedInUser()._id
    );

    this.book = this.epubService.book;

    // Display the program of first week
    this.rendition = this.book.renderTo(this.renderArea.nativeElement, {
      flow: 'scrolled',
    });
    this.rendition.display(this.programs[0].sectionIndex);
  }

  /**
   * Called after ngAfterContentInit when the component's view has been initialized.
   * Applies to components only.
   * Add 'implements AfterViewInit' to the class.
   */
  // ngAfterViewInit() {
  //   await this.book.ready;

  //   // Display the program of first week
  //   this.rendition = this.book.renderTo(this.renderArea.nativeElement, {
  //     flow: 'scrolled',
  //   });

  //   // this.rendition.display(this.programs[0].sectionIndex);

  //   // Turning pages with arrow keys
  //   this.rendition.on('keyup', (event) => {
  //     const kc = event.keyCode || event.which;
  //     if (kc === 37) {
  //       this.prevPage();
  //     }
  //     if (kc === 39) {
  //       this.nextPage();
  //     }
  //     this.renderArea.nativeElement.focus();
  //   });
  // }

  /**
   * Go to previous week's program
   */
  prevPage() {
    if (this.displayedProgramIndex > 0) {
      this.displayedProgramIndex--;
      this.rendition.display(
        this.programs[this.displayedProgramIndex].sectionIndex
      );
    }
    // this.rendition.prev();
  }

  /**
   * Go to next week's program
   */
  nextPage() {
    if (this.displayedProgramIndex < this.programs.length - 1) {
      this.displayedProgramIndex++;
      this.rendition.display(
        this.programs[this.displayedProgramIndex].sectionIndex
      );
    }
    // this.rendition.next();
  }

  /**
   * Extract the language code from the epub filename
   * mwb_F_201908
   */
  // getMonthAndLangFromEpub(pubCode: string = 'mwb') {
  //   const startLanguage =
  //     this.epubFilename.lastIndexOf(pubCode + '_') + pubCode.length + 1;
  //   const endLanguage = this.epubFilename.length - 7;
  //   this.epubLangCode = this.epubFilename.substring(startLanguage, endLanguage);

  //   const startMonth =
  //     this.epubFilename.lastIndexOf(pubCode + '_' + this.epubLangCode + '_') +
  //     pubCode.length +
  //     this.epubLangCode.length +
  //     2;

  //   const month = this.epubFilename.substring(startMonth);
  //   this.epubMonth = DateTime.fromFormat(month, 'YYYYMM');
  // }

  /**
   * Searching the entire book
   * @see https://github.com/futurepress/epub.js/wiki/Tips-and-Tricks-(v0.3)#searching-the-entire-book
   */
  // doSearch(q: string) {
  //   return Promise.all(
  //     this.book.spine['spineItems'].map(item =>
  //       item
  //         .load(this.book.load.bind(this.book))
  //         .then(item.find.bind(item, q))
  //         .finally(item.unload.bind(item))
  //     )
  //   ).then(results => Promise.resolve([].concat.apply([], results)));
  // }

  // async getXmlOfSections(): Promise<any> {
  //   return await Promise.all(
  //     this.book.spine['spineItems'].map(item =>
  //       item
  //         .load(this.book.load.bind(this.book))
  //         .then(xml => {
  //           return { index: item.index, xml: xml };
  //         })
  //         .finally(item.unload.bind(item))
  //     )
  //   ).then(results => Promise.resolve(results));
  // }

  /**
   * Get the list of parts for every week in the month
   * from the epub
   */
  // async extractPrograms() {
  //   await this.book.ready;

  //   const weekPages = await this.getXmlOfSections();

  //   weekPages.forEach((weekPage) => {
  //     // We look for the sections containing the program
  //     const ministrySection = weekPage.xml.getElementsByClassName('ministry');

  //     if (ministrySection.length !== 0) {
  //       // Getting the week
  //       const week = weekPage.xml.querySelector("[id='p1']").lastElementChild
  //         .innerHTML;

  //       const program = {
  //         sectionIndex: weekPage.index,
  //         week: week,
  //         xhtml: weekPage.xml,
  //         assignments: [],
  //       };

  //       const parts = weekPage.xml
  //         .querySelectorAll('ul:not(.noMarker) > li > p');

  //       for (let index = 0; index < parts.length; index++) {
  //         const partTitle: string = parts
  //           .item(index)
  //           .textContent;

  //         program.assignments.push({
  //           week: week,
  //           position: index,
  //           title: partTitle.trim(),
  //         });
  //       }

  //       this.programs.push(program);
  //     }
  //   });
  // }
}
