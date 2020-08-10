import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  Renderer2
} from '@angular/core';
import ePub, { Book, Rendition } from 'epubjs';
import Spine from 'epubjs/types/spine';
import Section from 'epubjs/types/section';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-import-epub',
  templateUrl: './import-epub.component.html',
  styleUrls: ['./import-epub.component.scss']
})
export class ImportEpubComponent implements OnInit, AfterViewInit {
  @ViewChild('epubArea', { static: true })
  renderArea: ElementRef;

  @Input()
  epubFilename = 'mwb_F_201908';

  public epubPath = '/assets/epubs/';

  public book: Book;

  public rendition: Rendition;

  public programs: Array<any> = new Array();
  public displayedProgramIndex = 0;
  public displayedProgram;

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

  constructor(private renderer: Renderer2) {}

  async ngOnInit() {
    this.book = ePub(this.epubPath + this.epubFilename + '.epub');
    console.log(
      'DATE Full data if enero ',
      new Intl.DateTimeFormat('es', { month: 'long' }).format(new Date(9e8))
    );

    // Display the whole Book object
    await this.book.ready;

    // Get language from the filename
    this.getMonthAndLangFromEpub();

    await this.extractPrograms();

    this.rendition.display(this.programs[0].sectionIndex);
    // this.renderArea.nativeElement.insertAdjacentHTML(
    //   'beforeend',
    //   this.programs[0].xhtml.innerHTML
    // );
    // const displayedProgramElement = this.renderer.createElement('input');
    // this.renderer.setProperty(displayedProgramElement, 'matInput', '');
    // this.renderer.appendChild(
    //   this.renderArea.nativeElement,
    //   displayedProgramElement
    // );

    // this.displayedProgram = this.programs[0].xhtml.innerHTML;
  }

  /**
   * Called after ngAfterContentInit when the component's view has been initialized.
   * Applies to components only.
   * Add 'implements AfterViewInit' to the class.
   */
  ngAfterViewInit(): void {
    // Display the program of first week
    this.rendition = this.book.renderTo(this.renderArea.nativeElement, {
      flow: 'scrolled'
    });

    // this.rendition.display(this.programs[0].sectionIndex);

    // Turning pages with arrow keys
    this.rendition.on('keyup', event => {
      const kc = event.keyCode || event.which;
      if (kc === 37) {
        this.prevPage();
      }
      if (kc === 39) {
        this.nextPage();
      }
      this.renderArea.nativeElement.focus();
    });
  }

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
  getMonthAndLangFromEpub(pubCode: string = 'mwb') {
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
    this.epubMonth = DateTime.fromFormat(month, 'YYYYMM');
  }

  /**
   * Searching the entire book
   * @see https://github.com/futurepress/epub.js/wiki/Tips-and-Tricks-(v0.3)#searching-the-entire-book
   */
  doSearch(q: string) {
    return Promise.all(
      this.book.spine['spineItems'].map(item =>
        item
          .load(this.book.load.bind(this.book))
          .then(item.find.bind(item, q))
          .finally(item.unload.bind(item))
      )
    ).then(results => Promise.resolve([].concat.apply([], results)));
  }

  async getXmlOfSections(): Promise<any> {
    return await Promise.all(
      this.book.spine['spineItems'].map(item =>
        item
          .load(this.book.load.bind(this.book))
          .then(xml => {
            return { index: item.index, xml: xml };
          })
          .finally(item.unload.bind(item))
      )
    ).then(results => Promise.resolve(results));
  }

  /**
   * Get the list of ministry parts for every week in the month
   * from the epub
   */
  async extractPrograms() {
    await this.book.ready;

    const allSections = await this.getXmlOfSections();

    // .then((allSections: { index: string; xml: HTMLHtmlElement }[]) => {
    allSections.forEach(section => {
      // We look for the sections containing the program
      const ministrySection = section.xml.getElementsByClassName('ministry');

      if (ministrySection.length !== 0) {
        const weekProgramUrl = section.xml
          .querySelector('link[rel="canonical"]')
          .getAttribute('href');
        // this.rendition.display(section.index);

        // Getting the week
        const week = ministrySection
          .item(0)
          .parentElement.parentElement.parentElement.getElementsByTagName(
            'header'
          )
          .item(0)
          .getElementsByTagName('h1')
          .item(0).lastChild.textContent;
        const currentWeek = {
          sectionIndex: section.index,
          week: week,
          xhtml: section.xml,
          parts: []
        };

        // We get the list of parts in the Ministry section
        const studentsParts = ministrySection
          .item(0)
          .nextElementSibling.getElementsByTagName('ul')
          .item(0)
          .getElementsByTagName('li');

        // .item(0) // Videos de presentation
        // .getElementsByTagName('p');

        // Loop through the 'li' elements = 0;
        for (let index = 0; index < studentsParts.length; index++) {
          const part = studentsParts
            .item(index)
            .getElementsByTagName('p')
            .item(0)
            .getElementsByTagName('strong')
            .item(0).innerText;
          currentWeek.parts.push(part);
        }

        this.programs.push(currentWeek);
      }
      // });
    });
  }
}
