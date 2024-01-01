const NetIncomeSummaryWidget = () => {
  return (
    <div className="card d-inline-block bg-light mb-2 me-2">
      <div className="card-body">
        <h2 className="card-title fs-5">Financial Summary</h2>
        <p className="card-text">
          Total Amount:
          <span className="ms-1">
            <strong>net income amount</strong>
          </span>
        </p>
        <p className="card-text">
          <strong>additional info</strong>
        </p>
      </div>
    </div>
  );
};

export default NetIncomeSummaryWidget;
