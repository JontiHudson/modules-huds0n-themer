import { assignEnumerableGetters } from '@huds0n/utilities';

import * as Types from '../types';

export function formatStyle<cT extends Types.CustomTheme>(
  Themer: Types.ThemerClass<cT>,
  style: Record<string, any>,
  repo: any,
) {
  function styleReducer(acc: any, [key, prop]: [string, any]) {
    if (style[key] !== undefined && typeof repo[key] === 'function') {
      const repoStyle = repo[key](style[key], Themer);

      assignEnumerableGetters(acc, repoStyle);
      return acc;
    }

    acc[key] = prop;
    return acc;
  }

  return Object.entries(style).reduce(styleReducer, {});
}
