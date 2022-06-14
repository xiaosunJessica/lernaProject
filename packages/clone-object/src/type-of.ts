const ctorName = (val: any) => {
  return typeof val.constructor === 'function' ? val.constructor.name : null
}
const isGeneratorFn = (val: any) => {
  return ctorName(val) === 'GeneratorFunction'
}

const isArray = (val: any) => {
  if (Array.isArray) return Array.isArray(val);
  return val instanceof Array;
}

const isBuffer = (val: any) => {
  if (val.constructor && typeof val.constructor.isBuffer === 'function') {
    return val.constructor.isBuffer(val);
  }
  return false;
}

const isArguments = (val: any) => {
  try {
    if (typeof val.length === 'number' && typeof val.callee === 'function') {
      return true;
    }
  } catch (err: any) {
    if (err?.message?.indexOf('callee') !== -1) {
      return true;
    }
  }
  return false;
}

const isDate = (val: any) => val instanceof Date

const isError = (val: any) => val instanceof Error

const isRegexp =(val: any) => val instanceof RegExp

const isObject = (val: any) =>  Object.prototype.toString.call(val) === '[object Object]'



const typeOf = (val: any) => {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';

  let type: any = typeof val;
  if (type === 'boolean') return 'boolean';
  if (type === 'string' ) return 'string';
  if (type === 'number') return 'number';
  if (type === 'symbol') return 'symbol';
  
  if (type === 'function') {
    return isGeneratorFn(val) ? 'generatorfunction': 'function'
  }

  if (isArray(val)) return 'array';
  if (isBuffer(val)) return 'buffer';
  if (isArguments(val)) return 'arguments';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    case 'Symbol': return 'symbol';
    case 'Promise': return 'promise';

    // Set, Map, WeakSet, WeakMap
    case 'WeakMap': return 'weakmap';
    case 'WeakSet': return 'weakset';
    case 'Map': return 'map';
    case 'Set': return 'set';

    // 8-bit typed arrays
    case 'Int8Array': return 'int8array';
    case 'Uint8Array': return 'uint8array';
    case 'Uint8ClampedArray': return 'uint8clampedarray';

    // 16-bit typed arrays
    case 'Int16Array': return 'int16array';
    case 'Uint16Array': return 'uint16array';

    // 32-bit typed arrays
    case 'Int32Array': return 'int32array';
    case 'Uint32Array': return 'uint32array';
    case 'Float32Array': return 'float32array';
    case 'Float64Array': return 'float64array';
  }

  type = toString.call(val);
  switch (type) {
    case '[object Object]': return 'object';
    // iterators
    case '[object Map Iterator]': return 'mapiterator';
    case '[object Set Iterator]': return 'setiterator';
    case '[object String Iterator]': return 'stringiterator';
    case '[object Array Iterator]': return 'arrayiterator';
  }

  // other
  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
}

const isPlainObject = (val: any) => {
  if (!isObject(val)) return false

  let ctor = val.constructor;
  if (typeOf(ctor) === 'undefined') return true;

  let proto = ctor.prototype;
  if (!isObject(proto)) return false;

  if (proto.hasOwnProperty('isPrototypeOf') === false) {
    return false
  }

  return true
}

export {
  typeOf,
  isPlainObject
}
