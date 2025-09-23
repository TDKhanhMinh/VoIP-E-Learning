import { Link, Outlet, useOutletContext, useParams } from "react-router-dom";

const coursesBySemester = {
  "HK2_2425": [
    { id: "504077", name: "Mẫu thiết kế" },
    { id: "504087", name: "Điện toán đám mây" },
  ],
  "HK1_2425": [
    { id: "501122", name: "Lập trình Web" },
    { id: "501133", name: "Cơ sở dữ liệu" },
  ],
};

export default function Sidebar() {
  const outletType = useOutletContext();
  const { semesterId } = useParams();

  if (outletType !== "sidebar") return null;

  const courses = coursesBySemester[semesterId] || [];

  return (
    <div>
      <h2 className="p-2 font-bold">Học kỳ: {semesterId}</h2>
      <ul>
        {courses.map((c) => (
          <li key={c.id} className="p-2 hover:bg-gray-200">
            <Link to={`course/${c.id}`}>{c.name}</Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
}
