import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { Button } from "react-bootstrap";

function Header() {
  const [user, dispatch] = useContext(UserContext);
  const nav = useNavigate();

  const logout = () => {
    dispatch({
      type: "logout",
    });
    nav("/");
  };

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
                {user && user.userRole === "ROLE_NURSE" && (
                  <li class="nav-item">
                    <Link to="/patient-list" class="nav-link mx-2">
                      Xem danh sách bệnh nhân đăng kí khám
                    </Link>
                  </li>
                )}

                {user === null ? (
                  <>
                    <Link className="nav-link text-info" to="/login">
                      Đăng nhập
                    </Link>
                    <Link to="/register" class="nav-link mx-2">
                      Đăng ký
                    </Link>
                  </>
                ) : (
                  <>
                    {user && (
                      <>
                        {user.userRole === "ROLE_PATIENT" && (
                          <>
                            <Link
                              className="nav-link text-success"
                              to="/schedule-detail"
                            >
                              Quản lý lịch khám
                            </Link>
                            <Link className="nav-link text-success" to="/">
                              Chào {user.username}
                            </Link>
                            <Link
                              class="text-dark text-decoration-none mx-3"
                              to="/medical-register"
                            >
                              <button className="btn btn-primary">
                                Đăng ký khám
                              </button>
                            </Link>
                          </>
                        )}
                        <Button variant="secondary" onClick={logout}>
                          Đăng xuất
                        </Button>
                      </>
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
