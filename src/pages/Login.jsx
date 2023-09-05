import { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import cookie from "react-cookies";
import { Navigate, useNavigate } from "react-router-dom";
import { MyUserContext, UserContext } from "../App";
import Apis, { authApi, endpoints } from "../configs/Apis";

const Login = () => {
  const [user, dispatch] = useContext(UserContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const login = (e) => {
    e.preventDefault();

    const processLogin = async () => {
      try {
        let res = await Apis.post(endpoints["login"], {
          username: username,
          password: password,
        });

        cookie.save("token", res.data);

        let { data } = await authApi().get(endpoints["currentUser"]);
        cookie.save("user", data);

        dispatch({
          type: "login",
          payload: data,
        });
      } catch (error) {
        console.error(error);
      }
    };
    processLogin();
  };

  if (user !== null) return <Navigate to="/" />;

  return (
    <>
      <Container>
        <h1 className="text-center text-info">ĐĂNG NHẬP NGƯỜI DÙNG</h1>

        <Form onSubmit={login}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Tên đăng nhập"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Button variant="info" type="submit">
              Đăng nhập
            </Button>
          </Form.Group>
        </Form>
      </Container>
    </>
  );
};

export default Login;
