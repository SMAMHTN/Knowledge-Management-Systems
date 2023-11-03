export function HandleSortParams(fieldname, IsAscending) {
  return encodeURIComponent(JSON.stringify([{
    field: fieldname,
    asc: IsAscending,
  }]));
}

export function HandleQueryParams(fieldname, operatorUsed, logicUsed, valuesUsed) {
  return encodeURIComponent(JSON.stringify([{
    field: fieldname,
    operator: operatorUsed,
    logic: logicUsed,
    values: valuesUsed,
  }]));
}

export function URLParamsBuilder(url, page, num, query, sort) {
  let apiEndpoint = url;
  const queryParams = [];

  if (page != null) {
    queryParams.push(`page=${page}`);
  }

  if (num != null) {
    queryParams.push(`num=${num}`);
  }

  if (query) {
    queryParams.push(`query=${query}`);
  }

  if (sort) {
    queryParams.push(`sort=${sort}`);
  }

  if (queryParams.length > 0) {
    apiEndpoint += `?${queryParams.join('&')}`;
  }

  return apiEndpoint;
}
