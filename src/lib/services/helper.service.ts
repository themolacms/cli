export class HelperService {
  constructor() {}

  parseParams(param: string, exclude?: string, separator = ',') {
    return (!exclude ? param : param.replace(new RegExp(exclude, 'g'), ''))
      .split(separator)
      .map(x => x.trim())
      .filter(x => !!x);
  }
}
