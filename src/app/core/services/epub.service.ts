import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  Renderer2,
  Injectable,
} from '@angular/core';
import ePub, { Book, Rendition } from 'epubjs';
import Spine from 'epubjs/types/spine';
import Section from 'epubjs/types/section';
import { DateTime } from 'luxon';
import { indexOfElementNode } from 'epubjs/types/utils/core';

@Injectable({
  providedIn: 'root',
})
export class EpubService {
  epubFilename = '';

  public epubPath = '/assets/epubs/';

  public book: Book;

  public rendition: Rendition;

  public programs: Array<any> = new Array();

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

  constructor() {}

  async getProgramsFromEpub(epubFilename: string) {
    this.epubFilename = epubFilename;
    this.getMonthFromEpubFilename();

    this.book = ePub(this.epubPath + epubFilename + '.epub');
    console.log(
      'DATE Full data if enero ',
      new Intl.DateTimeFormat('es', { month: 'long' }).format(new Date(9e8))
    );

    // Populate this.programs
    await this.extractMwbPrograms();

    return this.programs;
  }

  /**
   * Load the sections/pages of the epub
   *
   */
  async getXmlOfSections(): Promise<any> {
    return await Promise.all(
      this.book.spine['spineItems'].map((item) =>
        item
          .load(this.book.load.bind(this.book))
          .then((xml) => {
            return { index: item.index, xml: xml };
          })
          .finally(item.unload.bind(item))
      )
    ).then((results) => Promise.resolve(results));
  }

  /**
   * Get the list of parts for every week in the month
   * from the epub
   */
  async extractMwbPrograms() {
    // Fetch book
    await this.book.ready;

    const weekPages = await this.getXmlOfSections();

    // Store the current week
    let currentWeek: DateTime;

    weekPages.forEach((weekPage) => {
      // We look for the sections/pages containing the program
      const ministrySection = weekPage.xml.getElementsByClassName('ministry');

      if (ministrySection.length !== 0) {
        // Get the week
        const weekString = weekPage.xml.querySelector("[id='p1']")
          .lastElementChild.innerHTML;

        if (currentWeek === undefined) {
          // First week
          currentWeek = this.convertWeekToDatetime(weekString);
        } else {
          // subsequent weeks just get calculated
          // so that they can cross the months easily
          currentWeek = currentWeek.plus({ days: 7 });
        }

        // Prepare the Program object
        const program = {
          sectionIndex: weekPage.index,
          week: currentWeek,
          xhtml: weekPage.xml,
          assignments: [],
        };

        // The details for assignments are in ul.noMarker tags
        // We do not need them
        const parts: NodeList = weekPage.xml.querySelectorAll(
          'ul:not(.noMarker) > li > p'
        );

        for (let index = 0; index < parts.length; index++) {
          // get the meeting section of this part
          let partSection = 'chairman';
          const partSectionDiv = parts
            .item(index)
            .parentElement.parentElement.parentElement.parentElement.getElementsByTagName(
              'h2'
            );

          if (partSectionDiv.length) {
            const classes = partSectionDiv.item(0).getAttribute('class');

            partSection = classes.substr(classes.indexOf(' ')).trim();
          }

          // The part title is separated with a column,
          // so we can split and extract the description
          const partTitle: string[] = parts.item(index).textContent.split(':');

          program.assignments.push({
            week: currentWeek,
            position: index,
            partSection,
            title: partTitle[0].trim(),
            // part with a description (separated by column :)
            ...(partTitle.length > 1
              ? { description: partTitle[1].trim() }
              : null),
          });
        }

        this.programs.push(program);
      }
    });
  }

  /**
   * Convert the first day of a week string to
   * Luxon DateTime Object
   * @param week
   */
  convertWeekToDatetime(
    weekString: string,
    separatorSameMonth = '-',
    separatorDiffMonth = '–'
  ) {
    let firstPart: string;

    let separatorIndex = weekString.indexOf(separatorSameMonth);

    if (separatorIndex !== -1) {
      // week start and end in the same month
      firstPart = weekString.substr(0, separatorIndex);
    } else {
      // week start and end in differents month
      separatorIndex = weekString.indexOf(separatorDiffMonth);
      firstPart = weekString.substr(0, separatorIndex);
    }

    // Extract the day number from the string
    var matches = firstPart.match(/(\d+)/);

    if (matches) {
      return this.epubMonth.set({ day: parseInt(matches[0]) });
    } else {
      throw 'No day in the week string provided';
    }
  }

  /**
   * Extract the month from the epub filename
   * ex: mwb_F_201908 => 201908
   */
  getMonthFromEpubFilename(pubCode: string = 'mwb') {
    const startLanguage =
      this.epubFilename.lastIndexOf(pubCode + '_') + pubCode.length + 1;
    const endLanguage = this.epubFilename.length - 7;
    this.epubLangCode = this.epubFilename.substring(startLanguage, endLanguage);

    const startMonth =
      this.epubFilename.lastIndexOf(pubCode + '_' + this.epubLangCode + '_') +
      pubCode.length +
      this.epubLangCode.length +
      2;

    const month = this.epubFilename.substring(startMonth);
    this.epubMonth = DateTime.fromISO(month);
  }

  /**
   * Searching the entire book
   * @see https://github.com/futurepress/epub.js/wiki/Tips-and-Tricks-(v0.3)#searching-the-entire-book
   */
  search(q: string) {
    return Promise.all(
      this.book.spine['spineItems'].map((item) =>
        item
          .load(this.book.load.bind(this.book))
          .then(item.find.bind(item, q))
          .finally(item.unload.bind(item))
      )
    ).then((results) => Promise.resolve([].concat.apply([], results)));
  }
}
