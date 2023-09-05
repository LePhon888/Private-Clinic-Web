import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import axios from "axios";
import { authApi, endpoints } from "../configs/Apis";

function DateTimeRange({ handleDate, handleTime }) {
  const [hours, setHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduleDetailDate, setScheduleDetailDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countPatient, setCountPatient] = useState(null);
  const [regulation, setRegulation] = useState(null);

  const currentDate = new Date();
  const dayInMillis = 24 * 60 * 60 * 1000; // One day in milliseconds
  const today = new Date();
  const tomorrow = new Date(currentDate.getTime() + dayInMillis);
  const dayAfterTomorrow = new Date(currentDate.getTime() + 2 * dayInMillis);
  const arrayDate = [today, tomorrow, dayAfterTomorrow];
  const afterTomorrow = addDays(currentDate, 3);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    return `${formattedDay}-${formattedMonth}-${year}`;
  };

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function compareTimes(time1, time2) {
    const minutes1 = timeToMinutes(time1);
    const minutes2 = timeToMinutes(time2);

    if (minutes1 < minutes2) {
      return -1;
    } else if (minutes1 > minutes2) {
      return 1;
    } else {
      return 0;
    }
  }
  function checkValidDateTime(hour) {
    if (
      compareTimes(hour.hour, getCurrentTime()) === -1 &&
      selectedDate &&
      selectedDate.toDateString() === currentDate.toDateString()
    ) {
      return true;
    }
    return false;
  }

  //Check dupplicate date time that patient registered form
  function checkDuplicateDateTime(hour) {
    if (
      scheduleDetailDate != null &&
      selectedDate.toDateString() === currentDate.toDateString()
    ) {
      console.log(scheduleDetailDate.map((s) => s.hourId.id));
      console.log("hour.id");

      console.log(hour.id);

      return scheduleDetailDate.some((e) => e.hourId.id === hour.id);
    }
    return false;
  }

  useEffect(() => {
    const fetchHours = async () => {
      try {
        setIsLoading(true);
        const res = await authApi().get(endpoints["hours"]);
        setHours(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchHours();
  }, []);

  useEffect(() => {
    const fetchScheduleDetailDate = async () => {
      try {
        // const res = await axios.get(
        //   `http://localhost:8080/Clinic/api/scheduledetails?date=${formatDate(
        //     selectedDate
        //   )}`
        // );
        const res = await authApi().get(
          `${endpoints["scheduleDetail"]}?date=${formatDate(selectedDate)}`
        );
        setScheduleDetailDate(res.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchScheduleDetailDate();
  }, [selectedDate]);

  //Check number of patients by date
  useEffect(() => {
    const fetchCountPatient = async () => {
      try {
        setIsLoading(true);
        const res = await authApi().get(
          `${endpoints["scheduleDetail"]}count?date=${formatDate(selectedDate)}`
        );
        setCountPatient(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchCountPatient();
  }, [selectedDate]);

  //Get new regulation
  useEffect(() => {
    const fetchRegulation = async () => {
      try {
        setIsLoading(true);
        const res = await authApi().get(`${endpoints["numberOfPatients"]}`);
        setRegulation(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchRegulation();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    handleDate(date);
  };

  const handleHourChange = (hour) => {
    if (!checkValidDateTime(hour)) {
      setSelectedHour(hour);
      handleTime(hour);
    }
  };

  return (
    <Container>
      <Row>
        <h5>Thời gian khám</h5>
        <div className="date">
          <p>Ngày khám (*)</p>
        </div>
        {arrayDate.map((date) => (
          <Col
            style={{
              cursor: "pointer",
              backgroundColor:
                selectedDate &&
                selectedDate.toDateString() === date.toDateString()
                  ? "#0d6efd"
                  : "",
              color:
                selectedDate &&
                selectedDate.toDateString() === date.toDateString()
                  ? "white"
                  : "",
            }}
            xs
            lg="2"
            className="my-2 mx-2 p-2 rounded-6 text-center rounded"
            key={date}
            onClick={() => handleDateChange(date)}
          >
            {formatDate(date)}
          </Col>
        ))}

        <Col
          xs
          lg="2"
          className="my-2 mx-2 p-2 rounded-6 text-center rounded date-picker-col"
        >
          <DatePicker
            selected={selectedDate}
            minDate={afterTomorrow}
            onChange={(date) => handleDateChange(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText={"Chọn ngày khám khác"}
          />
        </Col>
      </Row>
      <Row>
        <Col xs lg="12">
          <div className="timepicker">
            <p>
              Giờ khám (*)
              {isLoading && <Spinner className="mx-4" />}
            </p>
            {selectedDate && (
              <Row>
                {regulation && countPatient < regulation.numberOfPatients ? (
                  hours.map((hour) => (
                    <Col
                      xs
                      lg="2"
                      key={hour.id}
                      className="my-2 mx-2 p-2 rounded-6 text-center rounded"
                      style={{
                        cursor: "pointer",
                        backgroundColor: checkValidDateTime(hour)
                          ? // || checkDuplicateDateTime(hour)
                            "#f7f7f7"
                          : selectedHour.id === hour.id
                          ? "#0d6efd"
                          : "",
                        color: checkValidDateTime(hour)
                          ? // || checkDuplicateDateTime(hour)
                            "#d3d3d3"
                          : selectedHour.id === hour.id
                          ? "white"
                          : "",
                      }}
                      onClick={() => handleHourChange(hour)}
                    >
                      {hour.hour}
                    </Col>
                  ))
                ) : (
                  <Alert variant="danger">Vượt quá số lượng bệnh nhân</Alert>
                )}
              </Row>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default DateTimeRange;
