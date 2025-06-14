type PromptType = 'local' | 'nai';

type AppConfig = {
    promptType: PromptType;
    removeUnderbar: boolean;
    removeArtistPrefix: boolean;
}

type AppConfigKey = keyof AppConfig;
type AppConfigValue = AppConfig[AppConfigKey];


type Prev = [never, 0, 1, 2, 3, 4, 5];

type Join<K, P> =
  P extends '' ? K :
  K extends string | number ?
  P extends string | number ?
  `${K}.${P}` :
  never :
  never;

type NestedPaths<T, D extends number = 3> = D extends 0
  ? ''
  : {
      [K in keyof T & (string | number)]: T[K] extends object
        ? Join<K, NestedPaths<T[K], Prev[D]>> | `${K & string}`
        : `${K & string}`;
    }[keyof T & (string | number)];