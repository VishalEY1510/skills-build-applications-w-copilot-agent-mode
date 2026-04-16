import React from 'react';

function formatValue(value) {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

function DataTable({ items, onShowJson }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const columns = Array.from(
    items.reduce((keys, item) => {
      Object.keys(item).forEach((key) => keys.add(key));
      return keys;
    }, new Set())
  );

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-light">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
            {onShowJson && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id ?? index}>
              {columns.map((column) => (
                <td key={`${item.id ?? index}-${column}`}>
                  {formatValue(item[column])}
                </td>
              ))}
              {onShowJson && (
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onShowJson(item)}
                  >
                    View JSON
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
