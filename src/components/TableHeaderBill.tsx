import React from 'react';
import { Bill } from '../types/Bill';

type ColumnBillHeader = keyof Bill;

interface TableHeaderProps {
  children?: React.ReactNode;
  column: ColumnBillHeader;
  activeColumn: ColumnBillHeader | null;
  sortTable: (column: ColumnBillHeader) => void;
  renderSortIcon: (column: ColumnBillHeader) => React.ReactNode;
  setShouldUpdateChart: React.Dispatch<React.SetStateAction<boolean>>;
}

const TableHeaderBill: React.FC<TableHeaderProps> = ({
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

export default TableHeaderBill;
