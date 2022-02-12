export class LinkTree {
  // tslint:disable-next-line: variable-name
  id?: number;
  title: string;
  description: string;
  buttonColor?: string;
  buttonTextColor?: string;
  links?: {
    url: string;
    label: string;
  }[]
}