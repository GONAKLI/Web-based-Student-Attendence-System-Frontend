import { Link } from "react-router-dom";
import '../css/selection.css'

function Selection() {
  const student_img =
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F054%2F720%2F352%2Fnon_2x%2Fstudent-3d-icon-for-education-projects-on-transparent-background-png.png&f=1&nofb=1&ipt=1d0319d7469011641ababfe457e2a5a0c679782b4cdbf92f27a5f3fe907dfbdf";
  const teacher_img =
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.vecteezy.com%2Fsystem%2Fresources%2Fpreviews%2F026%2F837%2F227%2Fnon_2x%2Fteacher-icon-symbol-image-illustration-of-the-training-business-school-classroom-icon-design-image-vector.jpg&f=1&nofb=1&ipt=9181e9944269321750d4b7bdc3eccf0e938a649f880c13a8ff0fa2ff66498fd7"
  const admin_img =
    "https://static.vecteezy.com/system/resources/previews/015/145/649/original/man-with-the-inscription-admin-icon-color-outline-vector.jpg";

  const options = [
    { label: "Student", img: student_img, link: "/student" },
    { label: "Teacher", img: teacher_img, link: "/teacher" },
    { label: "Admin", img: admin_img, link: "/admin" },
  ];

  return (
    <section className="selection-container">
      <h2 className="selection-title">Choose Your Role</h2>
      <div className="selection-grid">
        {options.map((opt, idx) => (
          <Link to={opt.link} key={idx} className="selection-card">
            <img className="selection-image" src={opt.img} alt={opt.label} />
            <p className="selection-label">{opt.label}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Selection;
