import React, { useState, useEffect } from "react";
import axios from "axios";

function Department() {
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Set the number of items to display per page

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/Clinic/api/departments"
        );
        setDepartments(res.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchDepartment();
  }, []);

  // Calculate the index of the last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calculate the index of the first item on the current page
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Get the current items to display based on the pagination
  const currentItems = departments.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <ul>
        {currentItems.map((department) => (
          <li key={department.id}>
            <strong>{department.name}</strong>
            <p>{department.detail}</p>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
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
