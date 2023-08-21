import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <header>
        <nav class="navbar navbar-expand-lg p-3 text-dark" id="headerNav">
          <div class="container-fluid">
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class=" collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="navbar-nav mx-auto ">
                <Link to="/" class="nav-link mx-2" href="#">
                  Trang chủ
                </Link>
                <li class="nav-item">
                  <Link to="/department" class="nav-link mx-2">
                    Chuyên khoa
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to="/patientlist" class="nav-link mx-2">
                    Xem danh sách bệnh nhân đăng kí khám
                  </Link>
                </li>
                <Link to="/login" class="nav-link mx-2">
                  Đăng nhập
                </Link>
                <li class="nav-item">
                  <Link to="/register" class="nav-link mx-2">
                    Đăng ký
                  </Link>
                </li>

                <Link
                  class="text-dark text-decoration-none"
                  to="/medicalregister"
                >
                  <button className="btn btn-primary">Đăng ký khám</button>
                </Link>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
