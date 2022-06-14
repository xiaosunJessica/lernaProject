const cloneDeep = require('./deep-clone');
const { isRegex, isArray, isFunction } = require('./type-of');
type Key = string;

type Customize = (a: any, b: any, key: Key) => any;

interface ICustomizeOptions {
  customizeArray?: Customize;
  customizeObject?: Customize;
}



function mergeWith(objects: object[], customizer: any) {
  const [first, ...rest] = objects;
  let ret = first;

  rest.forEach((b) => {
    ret = mergeTo(ret, b, customizer);
  });

  return ret;
}

function mergeTo(a: any, b: any, customizer:any) {
  const ret: any = {};

  Object.keys(a)
    .concat(Object.keys(b))
    .forEach((k) => {
      const v = customizer(a[k], b[k], k);

      ret[k] = typeof v === "undefined" ? a[k] : v;
    });

  return ret;
}

function joinArrays({
  customizeArray,
  customizeObject,
  key,
}: {
  customizeArray?: Customize;
  customizeObject?: Customize;
  key?: Key;
} = {}) {
  return function _joinArrays(a: any, b: any, k: Key): any {
    const newKey = key ? `${key}.${k}` : k;

    if (isFunction(a) && isFunction(b)) {
      return (...args: any[]) => _joinArrays(a(...args), b(...args), k);
    }

    if (isArray(a) && isArray(b)) {
      const customResult = customizeArray && customizeArray(a, b, newKey);

      return customResult || [...a, ...b];
    }

    if (isRegex(b)) {
      return b;
    }

    if (isPlainObject(a) && isPlainObject(b)) {
      const customResult = customizeObject && customizeObject(a, b, newKey);

      return (
        customResult ||
        mergeWith(
          [a, b],
          joinArrays({
            customizeArray,
            customizeObject,
            key: newKey,
          })
        )
      );
    }

    if (isPlainObject(b)) {
      return cloneDeep(b);
    }

    if (isArray(b)) {
      return [...b];
    }

    return b;
  };
}

function merge<Configuration extends object>(
  firstConfiguration: Configuration | Configuration[],
  ...configurations: Configuration[]
): Configuration {
  return mergeWithCustomize<Configuration>({})(
    firstConfiguration,
    ...configurations
  );
}

function mergeWithCustomize<Configuration extends object>(
  options: ICustomizeOptions
) {
  return function mergeWithOptions(
    firstConfiguration: Configuration | Configuration[],
    ...configurations: Configuration[]
  ): Configuration {
    // No configuration at all
    if (!firstConfiguration) {
      return {} as Configuration;
    }

    if (configurations.length === 0) {
      if (Array.isArray(firstConfiguration)) {
        // Empty array
        if (firstConfiguration.length === 0) {
          return {} as Configuration;
        }

        return mergeWith(
          firstConfiguration,
          joinArrays(options)
        ) as Configuration;
      }

      return firstConfiguration;
    }

    return mergeWith(
      [firstConfiguration].concat(configurations),
      joinArrays(options)
    ) as Configuration;
  };
}

export default merge
