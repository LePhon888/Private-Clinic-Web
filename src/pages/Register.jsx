import { useEffect, useRef, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Apis, { authApi, endpoints } from "../configs/Apis";
import MySpinner from "../components/MySpinner";
import DatePicker from "react-datepicker";
import moment from "moment/moment";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    birthday: "",
    address: "",
    gender: "",
    image: "",
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
  const [isDuplicatePhoneNumber, setIsDuplicatePhoneNumber] = useState(false);

  const image = useRef();
  const nav = useNavigate();
  const register = (e) => {
    e.preventDefault();

    const processRegister = async () => {
      let form = new FormData();

      for (let field in user)
        if (field !== "confirmPassword") form.append(field, user[field]);

      form.append("image", image.current.files[0]);

      setLoading(true);

      let res = await Apis.post(endpoints["register"], form);
      if (res.status === 201) {
        nav("/login");
      } else setErr("Error");
    };
    if (user.password === user.confirmPassword) processRegister();
    else setErr("Mật khẩu không khớp");
  };

  const change = (value, field) => {
    setUser((current) => {
      return { ...current, [field]: value };
    });
  };

  useEffect(() => {
    const fetchUserByEmail = async () => {
      try {
        const res = await authApi().get(
          `${endpoints["userByEmail"]}?email=${email}`
        );
        setIsDuplicateEmail(true);
      } catch (error) {
        setIsDuplicateEmail(false);
        console.error("Error checking email duplicate:", error);
      }
    };
    fetchUserByEmail();
  }, [email]);

  useEffect(() => {
    const fetchUserByPhoneNumber = async () => {
      try {
        const res = await authApi().get(
          `${endpoints["userByPhoneNumber"]}?phoneNumber=${phoneNumber}`
        );
        setIsDuplicatePhoneNumber(true);
      } catch (error) {
        setIsDuplicatePhoneNumber(false);
        console.error("Error checking phone number duplicate:", error);
      }
    };
    fetchUserByPhoneNumber();
  }, [phoneNumber]);

  return (
    <Container>
      <h1 className="text-center text-info mt-2">ĐĂNG KÝ NGƯỜI DÙNG</h1>
      {err === null ? "" : <Alert variant="danger">{err}</Alert>}

      <Form onSubmit={register}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            onChange={(e) => change(e.target.value, "name")}
            placeholder="Họ và tên (*)"
            required
          />
        </Form.Group>
        <DatePicker
          required
          selected={user.birthday}
          onChange={(date) => change(date, "birthday")}
          dateFormat="dd-MM-yyyy"
          maxDate={moment().subtract(18, "years")._d}
          minDate={moment().subtract(100, "years")._d} // Convert moment object to Date
          showYearDropdown
          scrollableYearDropdown
          placeholderText={"Chọn ngày sinh (*)"}
          className="my-3"
        />
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            onChange={(e) => change(e.target.value, "address")}
            placeholder="Địa chỉ (*)"
            required
          />
        </Form.Group>
        <Form.Check
          name="gender"
          required
          inline
          label="Nam"
          value="male"
          type="radio"
          checked={user.gender === "male"}
          onChange={(e) => change(e.target.value, "gender")}
        />
        <Form.Check
          name="gender"
          required
          inline
          label="Nữ"
          value="female"
          type="radio"
          checked={user.gender === "female"}
          onChange={(e) => change(e.target.value, "gender")}
        />

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={user.username}
            onChange={(e) => change(e.target.value, "username")}
            placeholder="Username (*)"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="tel"
            onChange={(e) => {
              change(e.target.value, "phoneNumber");
              setPhoneNumber(e.target.value);
            }}
            placeholder="Điện thoại (*)"
          />
        </Form.Group>
        {isDuplicatePhoneNumber && (
          <Alert variant="danger">
            Số điện thoại đã được đăng ký với tài khoản khác
          </Alert>
        )}
        <Form.Group className="mb-3">
          <Form.Control
            onChange={(e) => {
              change(e.target.value, "email");
              setEmail(e.target.value);
            }}
            type="email"
            placeholder="Email (*)"
            required
          />
        </Form.Group>
        {isDuplicateEmail && (
          <Alert variant="danger">
            Email đã được đăng ký với tài khoản khác
          </Alert>
        )}
        <Form.Group className="mb-3">
          <Form.Control
            value={user.password}
            onChange={(e) => change(e.target.value, "password")}
            type="password"
            placeholder="Mật khẩu (*)"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            value={user.confirmPass}
            onChange={(e) => change(e.target.value, "confirmPassword")}
            type="password"
            placeholder="Xác nhận mật khẩu (*)"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Ảnh đại diện</Form.Label>
          <Form.Control type="file" ref={image} />
        </Form.Group>
        <Form.Group className="mb-3">
          {loading === true ? (
            <MySpinner />
          ) : (
            <Button variant="info" type="submit">
              Đăng ký
            </Button>
          )}
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Register;
