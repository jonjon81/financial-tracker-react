import React from 'react';
import { Invoice } from '../types/Invoice';

type ColumnHeader = keyof Invoice;

interface TableHeaderProps {
  children: React.ReactNode; // Accept children as a prop
  column: ColumnHeader;
  activeColumn: ColumnHeader | null;
  sortTable: (column: ColumnHeader) => void;
  renderSortIcon: (column: ColumnHeader) => React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, column, activeColumn, sortTable, renderSortIcon }) => {
  return (
    <th scope="col" className={activeColumn === column ? 'active' : ''}>
      <button className="btn btn-primary" onClick={() => sortTable(column)}>
        {children} {activeColumn === column && renderSortIcon(column)}
      </button>
    </th>
  );
};

export default TableHeader;
