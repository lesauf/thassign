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

import { CommonService } from '@src/app/core/services/common.service';
import { MessageService } from '@src/app/core/services/message.service';

@Injectable({
  providedIn: 'root',
})
export class EpubService extends CommonService<any> {
  epubFilename = '';

  public epubPath = '/assets/epubs/';

  public book: Book;

  public rendition: Rendition;

  /**
   * English program coming straight from the epub.
   * It will be used to create all the other programs
   */
  public referencePrograms: Array<any> = new Array();

  /**
   * Language of the book,
   * taken from the filename
   */
  public epubLangCode: string;

  /**
   * Month of the epub,
   * taken from the filename
   */
  public epubMonth: string;

  constructor(protected messageService: MessageService) {
    super();
  }

  /**
   * Extract the meeting parts from the epub
   * @param epubFilename
   */
  async getProgramsFromEpub(epubFilename: string, ownerId: string) {
    this.epubFilename = epubFilename;
    this.getMonthFromEpubFilename(epubFilename);

    this.book = new Book();
    // this.book = ePub(this.epubPath + epubFilename + '.epub');
    try {
      await this.book.open(this.epubPath + epubFilename + '.epub');
    } catch (error) {
      if (error.status === 404) {
        // No epub, notify the dev
        this.messageService.log('Please provide the epub for ' + epubFilename);
      } else {
        this.messageService.log(error.message, error);
      }
      this.messageService.presentToast(
        'Sorry, you cannot create the program for now: ' + this.epubMonth
      );
      // Return empty array as reference program
      return [];
    }
    // console.log('Book', this.book);
    // Extract the programs
    const referencePrograms = await this.extractMwbPrograms(ownerId);
    // console.log('Ref Program', referencePrograms);

    return referencePrograms;
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
  async extractMwbPrograms(ownerId: string) {
    const referencePrograms = [];

    // Fetch book
    await this.book.ready;

    const weekPages = await this.getXmlOfSections();
    // console.log('weekPages', weekPages);
    // Store the current week
    let currentWeek: DateTime;

    weekPages.forEach((weekPage) => {
      // We look for the sections/pages containing the referenceProgram
      const ministrySection = weekPage.xml.getElementsByClassName(
        'mwbHeadingIcon and ministry--rev2021'
      );

      if (ministrySection.length !== 0) {
        // console.log(ministrySection);
        // Get the week
        const weekString = weekPage.xml.querySelector("[id='p1']")
          .lastElementChild.innerHTML;

        const weekStringFull = this.convertWeekToDateString(weekString);

        if (weekStringFull !== null) {
          if (currentWeek === undefined) {
            // First week
            currentWeek = DateTime.fromISO(weekStringFull);
          } else {
            // subsequent weeks just get calculated
            // so that they can cross the months easily
            currentWeek = currentWeek.plus({ days: 7 });
          }

          // ------------------------------------
          // Prepare the Program object         -
          // ------------------------------------
          const referenceProgram = {
            // referenceProgram reference key is week + userId
            _id: currentWeek.toFormat('yyyyMMdd') + ownerId,
            meeting: 'midweek',
            week: currentWeek.toFormat('yyyyMMdd'),
            month: currentWeek.toFormat('yyyyMM'), // also store the month
            // xhtml: weekPage.xml.toString(),
            // sectionIndex: weekPage.index,
            assignments: [],
            ownerId: ownerId,
          };

          // The details for assignments are in ul.noMarker tags
          // We do not need them
          const parts: NodeList = weekPage.xml.querySelectorAll('ul > li > p'); // 'ul:not(.noMarker) > li > p'
          // console.log('Parts', parts);
          for (let index = 0; index < parts.length; index++) {
            // get the meeting section of this part
            let partSection = 'chairman';
            const partSectionDiv = parts
              .item(index)
              .parentElement.parentElement.parentElement.parentElement.getElementsByTagName(
                'div'
              );
            // console.log('partSectionDiv: ', partSectionDiv);
            if (partSectionDiv.length) {
              const classes = partSectionDiv.item(0).getAttribute('class');

              partSection = classes
                .substring(classes.lastIndexOf(' '), classes.indexOf('-'))
                .trim();
              // console.log('Classes: ', partSection);
            }

            const partTitle: string[] = this.extractPartTitleAndDescription(
              parts.item(index).textContent
            );

            referenceProgram.assignments.push({
              meeting: 'midweek',
              week: currentWeek.toFormat('yyyyMMdd'),
              position: index,
              partSection,
              ownerId: '',
              assignee: '',
              title: partTitle[0].trim(),
              // part with a description (separated by column :)
              ...(partTitle.length > 1
                ? { description: partTitle[1].trim() }
                : null),
            });
          }

          referencePrograms.push(referenceProgram);
        }
      }
    });

    return referencePrograms;
  }

  /**
   * The part title is separated from the description with a column,
   * or an opening bracket so we can split and extract the description
   * @param partText Coming from the epub part description
   * @param separators list of known separators
   */
  extractPartTitleAndDescription(
    partText: string,
    separators = [':', '(']
  ): string[] {
    let fsPos = 500; // great value so that the first separator update it
    let firstSeparator = separators[0];
    separators.forEach((sep) => {
      const sIndex = partText.indexOf(sep);
      if (sIndex !== -1 && fsPos > sIndex) {
        // Separator found before the default
        firstSeparator = sep;
        fsPos = sIndex;
      }
    });

    // get the position of each separator and then keep the first appearing
    // return partText.split(firstSeparator);
    return [partText.substr(0, fsPos), partText.substr(fsPos)];
  }

  /**
   * Convert the first day of a week string to
   * a complete date string of type yyyymmdd
   * @param week
   */
  convertWeekToDateString(
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
      // If day number is only one character convert it to 2 char
      const dayAsNumber = parseInt(matches[0]);
      const day = matches[0].length === 1 ? '0' + dayAsNumber : dayAsNumber;

      return this.epubMonth + day;
    } else {
      console.log('No day in the week string provided');
      return null;
    }
  }

  /**
   * Extract the month from the epub filename
   * ex: mwb_F_201908 => 201908
   */
  getMonthFromEpubFilename(epubFilename?: string, pubCode: string = 'mwb') {
    if (epubFilename === undefined) {
      epubFilename = this.epubFilename;
    }

    this.epubLangCode = this.getLanguageFromEpubFilename(epubFilename, pubCode);

    const startMonth =
      epubFilename.lastIndexOf(pubCode + '_' + this.epubLangCode + '_') +
      pubCode.length +
      this.epubLangCode.length +
      2;

    this.epubMonth = epubFilename.substring(startMonth);

    // const month = epubFilename.substring(startMonth);

    // UTC date used here
    // const refDate = DateTime.utc();
    // this.epubMonth = DateTime.fromISO(month, {
    //   zone: refDate.zone,
    //   locale: refDate.locale,
    // });
  }

  /**
   * Extract the month from the epub filename
   * ex: mwb_F_201908 => F
   */
  getLanguageFromEpubFilename(epubFilename?: string, pubCode: string = 'mwb') {
    if (epubFilename === undefined) {
      epubFilename = this.epubFilename;
    }

    const startLanguage =
      epubFilename.lastIndexOf(pubCode + '_') + pubCode.length + 1;
    const endLanguage = epubFilename.length - 7;

    return epubFilename.substring(startLanguage, endLanguage);
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
