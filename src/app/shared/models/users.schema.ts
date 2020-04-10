import { Assignment } from './assignments.schema';
import { Part } from './parts.schema';

export class User {
  id?: string;
  // _id?: string;
  firstName: string = null;
  lastName: string = '';
  baptized: boolean = true;
  publisher: boolean = true;
  genre: string = 'man'; // "Man" | "Woman"
  child: boolean = false; // default: false
  phone?: string = ''; // phoneNumber
  email?: string = '';
  overseer?: string = null; // "Elder" | Ministerial servant
  disabled?: boolean = false;
  createdAt?: Date = new Date();
  familyMembers?: number[]; // array of users_id
  parts?: Part[] = []; // Parts names
  assignments?: Assignment[] = [];
  type?: string = null; // generated from 'man' | 'woman' | 'boy' | 'girl'
  progress?: string = null; // generated from 'unbaptized' | 'not_publisher'

  /**
   * Display the full name
   */
  // displayName = () => {
  //   return `${this.firstName} ${this.lastName}`;
  // };
}
