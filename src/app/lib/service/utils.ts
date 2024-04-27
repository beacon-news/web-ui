export function urlSearchParamsFromObject(obj: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(obj)
  .forEach(([key, value]) => {
    if (value === undefined || value == null) {
      return;
    }

    if (Array.isArray(value)) {
      for (const val of value) {

        if (val === undefined || val == null) {
          continue;
        }

        params.append(key, paramToString(val));
      }
    } else {
      params.append(key, paramToString(value));
    }
  });

  return params;
}

function paramToString(param: any) {
  if (param instanceof Date) {
    return param.toISOString();
  }
  return param.toString();
}