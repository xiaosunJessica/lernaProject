const clone = require('./shallow-clone');
const {typeOf, isPlainObject} = require('./type-of')

const cloneObjectDeep = (val: any, instanceClone: any) => {
  if (typeof instanceClone === 'function') {
    return instanceClone(val)
  }

  if (instanceClone || isPlainObject(val)) {
    const res = new val.constructor();
    for (let key in val) {
      res[key] = cloneDeep(val[key], instanceClone)
    }
    return res;
  }
  return val;
}

const cloneArrayDeep  = (val: any, instanceClone: any) => {
  const res = new val.constructor(val.length);
  for (let i = 0; i < val.length; i++) {
    res[i] = cloneDeep(val[i], instanceClone)
  }
  return res
}

const cloneDeep = (val: any, instanceClone: any) => {
  switch(typeOf(val)) {
    case 'object':
      return cloneObjectDeep(val, instanceClone);
    case 'array':
      return cloneArrayDeep(val, instanceClone);
    default:
      return clone(val)
  }
}
