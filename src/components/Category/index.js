import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategory } from "redux/reducers/category/action";
import Spinner from "components/Spinner";
import CategoryAPI from "apis/CategoryAPI";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { isEmpty } from "lodash";

const CategoryParent = ({cat, cateActiveHover, setCateActiveHover, queriesData, setQueriesData}) => {
  const [expand, setExpand] = useState(false)
  const [hover, setHover] = useState('')

  const style = {
    display: 'flex',
    alignItems: 'cetner',
    justifyContent: 'center'
  }

  return <div style={{display: 'flex', flexDirection: 'column'}}>
    <div
      style={{
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: 700,
        fontSize: 15,
        height: 24,
        cursor: "pointer",
        borderLeft:
          cateActiveHover === cat.parent._id &&
          "3px solid #0E7AE7",
        background:
          (cateActiveHover === cat.parent._id || hover === cat.parent._id) && "#F0F7FF",
        color:
          (cateActiveHover === cat.parent._id || hover === cat.parent._id)
            ? "#0072E5"
            : "#6F7E8C",
      }}
      onMouseMove={() => {
        setHover(cat.parent._id);
      }}
      onMouseOut={() => {
        setHover('');
      }}
      onClick={() => {
        if(cat.parent._id === 'all') {
          setCateActiveHover('all');
          setQueriesData({...queriesData, categoryId: '', subCategoryId: '', skip: 1})
          return
        }
        setCateActiveHover(cat.parent._id);
        setQueriesData({...queriesData, categoryId: cat.parent._id, subCategoryId: '', skip: 1})
      }}
    >
      <span>{cat?.parent.name}</span>
      {
        cat.parent._id !== 'all' &&
        (
          expand ? 
          <div style={style} onClick={(e)=> {
            e.stopPropagation()
            setExpand(!expand)
          }}>
            <KeyboardArrowDownIcon sx={{ transition: "0.5s" }}/>
          </div> : 
          <div style={style} onClick={(e)=> {
            e.stopPropagation()
            if(isEmpty(cat.childrens)) return
            setExpand(!expand)
          }}>
            <KeyboardArrowRightIcon sx={{ transition: "0.5s" }} />
          </div>
        )
      }
    </div>
    {(!isEmpty(cat.childrens) && expand) &&
      cat.childrens.map((cat, idx) => {
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
              (cateActiveHover === cat._id || hover === cat._id) && "#F0F7FF",
              color:
              (cateActiveHover === cat._id || hover === cat._id)
                  ? "#0072E5"
                  : "#3E5060",
              marginLeft: cateActiveHover === cat._id && "-3px",
            }}
            onMouseMove={() => {
              setHover(cat._id);
            }}
            onMouseOut={() => {
              setHover('');
            }}
            key={idx}
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
}

const Category = ({queriesData, setQueriesData}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((store) => store.category);
  const [cateActiveHover, setCateActiveHover] = useState("all");
  const [data, setData] = useState([])

  useEffect(() => {
    // if(categories?.length) return 
    dispatch(getAllCategory((res)=>{
      if(res) setData([{parent: { _id: 'all', name: 'Tất cả danh mục'}, childrens: []}, ...res])
    }));
  }, []);

  return (
    <div style={{ display: "flex", width: "100%" }}>
      {categories.loading ? (
        <Spinner />
      ) : (
        <div
          style={{ display: "flex", width: "100%", flexDirection: "column" }}
        >
          {!!data?.length &&
            data.map((cat, idx) => {
              return (
                <CategoryParent key={idx} cat={cat} cateActiveHover={cateActiveHover} setCateActiveHover={setCateActiveHover} queriesData={queriesData} setQueriesData={setQueriesData}/>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Category;
