import React from 'react';
import { Invoice } from '../types/Invoice';

type ColumnHeader = keyof Invoice;

interface TableHeaderProps {
  children?: React.ReactNode;
  column: ColumnHeader;
  activeColumn: ColumnHeader | null;
  sortTable: (column: ColumnHeader) => void;
  renderSortIcon: (column: ColumnHeader) => React.ReactNode;
  setShouldUpdateChart: React.Dispatch<React.SetStateAction<boolean>>;
}

const TableHeaderInvoice: React.FC<TableHeaderProps> = ({
  children,
  column,
  activeColumn,
  sortTable,
  renderSortIcon,
  // setShouldUpdateChart,
}) => {
  const handleSortClick = () => {
    sortTable(column);
    // setShouldUpdateChart(false);
  };

  return (
    <th scope="col" className={activeColumn === column ? 'active' : ''}>
      <button className="btn btn-outline-primary" onClick={handleSortClick}>
        {children} {activeColumn === column && renderSortIcon(column)}
      </button>
    </th>
  );
};

export default TableHeaderInvoice;
