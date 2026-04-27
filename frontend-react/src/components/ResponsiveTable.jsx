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
                  className="bg-accent-gold text-black border-2 border-black px-2 md:px-4 py-2 text-xs md:text-sm font-black text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b-2 border-black hover:bg-slate-800/20">
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="border-r border-black/30 px-2 md:px-4 py-2 text-xs md:text-sm font-medium text-white"
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
