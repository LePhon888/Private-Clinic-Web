import React, { useEffect } from "react";
import { useState } from "react";
import { authApi, endpoints } from "../configs/Apis";
import { Button } from "react-bootstrap";

const MedicineGroup = ({ onMedicineListener }) => {
  const [categories, setCategories] = useState(null);
  const [categoryClick, setCategoryClick] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [medicines, setMedicines] = useState(null);

  const fetchCategory = async () => {
    try {
      const res = await authApi().get(endpoints["category"]);
      setCategories(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const fetchMedicine = async (category) => {
    try {
      let e = `${endpoints["medicine"]}?cateId=${category.id}`;
      console.info(e);
      let res = await authApi().get(e);
      setMedicines(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const onCategoryClick = async (c) => {
    setCategoryClick(true);
    setMedicines(null);
    fetchMedicine(c);
    setActiveCategory(c.id);
  };

  const handle = (medicine) => {
    onMedicineListener(medicine);
  };

  return (
    <div>
      <div>
        <p className="mx-1">
          <strong> Danh sách nhóm thuốc</strong>
        </p>
        <hr></hr>
        <div style={{ maxHeight: "20rem", overflow: "auto" }}>
          {categories === null ? (
            <p>loading...</p>
          ) : (
            categories
              .sort((a, b) => {
                return a.name.length - b.name.length;
              })
              .map((c) => (
                <Button
                  variant={
                    activeCategory === c.id ? "success" : "outline-success"
                  }
                  size="sm"
                  className="mx-1 my-1"
                  onClick={() => onCategoryClick(c)}
                  key={c.id}
                >
                  {c.name}
                </Button>
              ))
          )}
        </div>
        <hr></hr>
      </div>
      <div>
        <p className="mx-1">
          <strong> Danh sách thuốc</strong>
        </p>
        <hr></hr>
        <div style={{ maxHeight: "10rem", overflowY: "auto" }}>
          {categoryClick === false ? (
            <p>Chọn thuốc...</p>
          ) : medicines === null ? (
            <p>Loading...</p>
          ) : medicines.length === 0 ? (
            <p>Không tồn tại thuốc</p>
          ) : (
            medicines
              .sort((a, b) => {
                return a.name.length - b.name.length;
              })
              .map((medicine) => (
                <Button
                  variant="outline-success"
                  size="sm"
                  className="mx-1 my-1"
                  onClick={() => handle(medicine)}
                  key={medicine.id}
                >
                  {medicine.name}
                </Button>
              ))
          )}
        </div>
        <hr></hr>
      </div>
    </div>
  );
};

export default MedicineGroup;
