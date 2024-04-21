export function urlSearchParamsFromObject(obj: Record<string, any>): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(obj)
  .forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      for (const val of value) {
        params.append(key, val.toString());
      }
    } else {
      params.append(key, value.toString());
    }
  });

  return params;
}