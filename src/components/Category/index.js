import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory } from "redux/reducers/category/action";
import Spinner from "components/Spinner";
import CategoryAPI from "apis/CategoryAPI";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const Category = ({queriesData, setQueriesData}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((store) => store.category);
  const [cateActiveHover, setCateActiveHover] = useState("");

  useEffect(() => {
    if(categories?.length) return 
    dispatch(getAllCategory());
  }, []);
  return (
    <div style={{ display: "flex", width: "100%" }}>
      {categories.loading ? (
        <Spinner />
      ) : (
        <div
          style={{ display: "flex", width: "100%", flexDirection: "column" }}
        >
          {!!categories?.length &&
            categories.map((cat, idx) => {
              return (
                <div key={idx.id} style={{display: 'flex', flexDirection: 'column'}}>
                  <div
                    style={{
                      padding: "10px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: "pointer",
                      borderLeft:
                        cateActiveHover === cat.parent._id &&
                        "3px solid #0E7AE7",
                      background:
                        cateActiveHover === cat.parent._id && "#F0F7FF",
                      color:
                        cateActiveHover === cat.parent._id
                          ? "#0072E5"
                          : "#6F7E8C",
                    }}
                    onMouseMove={() => {
                      setCateActiveHover(cat.parent._id);
                    }}
                    onClick={() => {
                      setCateActiveHover(cat.parent._id);
                      setQueriesData({...queriesData, categoryId: cat.parent._id, subCategoryId: '', skip: 1})
                    }}
                  >
                    <span>{cat?.parent.name}</span>
                    {cateActiveHover === cat.parent._id ||
                    !!cat.childrens.filter((c) => c._id === cateActiveHover)
                      ?.length ? (
                      <KeyboardArrowDownIcon sx={{ transition: "0.5s" }} />
                    ) : (
                      <KeyboardArrowRightIcon sx={{ transition: "0.5s" }} />
                    )}
                  </div>
                  {((!!cat.childrens?.length &&
                    cateActiveHover === cat.parent._id) ||
                    !!cat.childrens.filter((c) => c._id === cateActiveHover)
                      ?.length) &&
                    cat.childrens.map((cat) => {
                      return (
                        <div
                          style={{
                            padding: "10px 20px",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: 15,
                            borderLeft:
                              cateActiveHover === cat._id &&
                              "3px solid #0E7AE7",
                            background:
                              cateActiveHover === cat._id && "#F0F7FF",
                            color:
                              cateActiveHover === cat._id
                                ? "#0072E5"
                                : "#3E5060",
                            marginLeft: cateActiveHover === cat._id && "-3px",
                          }}
                          key={cat.id}
                          onClick={() => {
                            setCateActiveHover(cat._id);
                            setQueriesData({...queriesData, subCategoryId: cat._id, categoryId: '', skip: 1})
                          }}
                        >
                          <FiberManualRecordIcon
                            fontSize="small"
                            style={{ fontSize: 10, marginLeft: 15 }}
                          />
                          <span style={{ marginLeft: 10 }}>{cat.name}</span>
                        </div>
                      );
                    })}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Category;
