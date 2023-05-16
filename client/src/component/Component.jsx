import MarksTable from "./subComponent/MarksTable/MarksTable";

function HeaderComponent({ title }) {
  return (
    <div className="top__header">
      <span>{title}</span>
    </div>
  );
}

function DashboardComponent({ title, tableHeader }) {
  return (
    <div className="faculty__dashboard">
      <HeaderComponent title={title ? title : "Your Dashboard"} />
      <div className="faculty__dashboard_main">
        <div className="faculty_recent_table">
          <span>{tableHeader}</span>
          <MarksTable isAction={true} />
        </div>
        <div className="faculty__recent_history">
          <span className="faculty__recent_history_header">Recent</span>
          <div className="recent_text">
            <span>BTech CSE Semester 3 Marks uploaded </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconButton({onClickHandler, icon, text}) {
  return (
    <button className="icon__button" onClick={onClickHandler}>
      {icon}
      {text}
    </button>
  );
}

export { HeaderComponent, DashboardComponent, IconButton };
