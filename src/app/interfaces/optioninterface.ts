import {Product} from './product'

export interface OptionInterface {
  id: string; 
  name?: string;
  require?: boolean;
  products?: string[];
 }