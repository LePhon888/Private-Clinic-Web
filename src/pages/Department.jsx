import React, { useState, useEffect } from "react";
import axios from "axios";
import Apis, { endpoints } from "../configs/Apis";
import { Spinner } from "react-bootstrap";

function Department() {
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Set the number of items to display per page
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchDepartment = async () => {
      setIsLoading(true);
      try {
        const res = await Apis.get(endpoints["departments"]);
        setDepartments(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchDepartment();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = departments.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      {isLoading && <Spinner />}
      <ul>
        {currentItems.map((department) => (
          <li key={department.id}>
            <strong>{department.name}</strong>
            <p>{department.detail}</p>
          </li>
        ))}
      </ul>

      <nav style={{ display: "flex", justifyContent: "center" }}>
        <ul className="pagination">
          {Array.from({
            length: Math.ceil(departments.length / itemsPerPage),
          }).map((_, index) => (
            <li key={index} className="page-item">
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Department;
