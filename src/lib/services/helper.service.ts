export interface CompareAndExtractResult {
  toChange: {
    from: string;
    to: string;
  };
  toAdds: string[];
  toRemoves: string[];
  latestValues: string[];
}

export class HelperService {
  constructor() {}

  parseParams(param: string, exclude?: string, separator = ',') {
    return (!exclude ? param : param.replace(new RegExp(exclude, 'g'), ''))
      .split(separator)
      .map(x => x.trim())
      .filter(x => !!x);
  }

  compareAndExtract(oldValues: string[], newValues: string[] = []) {
    let toChange!: {from: string; to: string};
    const toRemoves = [] as string[];
    const toAdds = [] as string[];
    if (newValues.length) {
      // to change the default
      if (oldValues[0] !== newValues[0]) {
        toChange = {
          from: oldValues[0],
          to: newValues[0],
        };
      }
      // to add
      newValues.forEach(newValue => {
        if (
          (newValue !== toChange?.to && oldValues.indexOf(newValue) === -1) ||
          newValue === toChange?.from
        ) {
          toAdds.push(newValue);
        }
      });
      // to remove
      oldValues.forEach(oldValue => {
        if (oldValue !== toChange?.from && newValues.indexOf(oldValue) === -1) {
          toRemoves.push(oldValue);
        }
      });
    }
    // returns
    return {
      toChange,
      toAdds,
      toRemoves,
      latestValues: !newValues.length
        ? oldValues
        : [toChange?.to || newValues[0], ...toAdds],
    };
  }
}
