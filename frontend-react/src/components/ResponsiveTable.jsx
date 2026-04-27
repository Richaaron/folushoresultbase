import React from "react";

const ResponsiveTable = ({ headers, rows, className = "" }) => {
  return (
    <div className="w-full overflow-x-auto -mx-4 md:mx-0">
      <div className="inline-block min-w-full px-4 md:px-0">
        <table className={`w-full border-collapse ${className}`}>
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="bg-slate-800/60 text-accent-gold border-b border-slate-700/50 px-2 md:px-4 py-3 text-xs md:text-sm font-semibold text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="px-2 md:px-4 py-2.5 text-xs md:text-sm font-medium text-slate-200"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponsiveTable;
