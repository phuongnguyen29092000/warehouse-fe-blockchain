import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MenuItem, Select } from "@mui/material";


export default function CategoryForm({
  handleAddCategory,
  handleUpdateCategory,
  category,
  submit = false,
  isSub,
  setSubmit = () => {},
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const formRef = useRef(null);
  const { account } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const { categories } = useSelector((store) => store.category);
  const [selectedCate, setSelectedCate] = useState('')

  useEffect(()=> {
    if(!isSub) return 
    setSelectedCate(category?.category._id)
  }, [category])

  useEffect(() => {
    if (submit) {
      formRef.current.click();
    }
  }, [submit]);

  const onHandleSubmit = (data) => {
    if(isSub) {
      Object.assign(data, {category: selectedCate})
    }
    if (category) handleUpdateCategory(category?._id.toString(), data);
    else handleAddCategory(data);
    setSubmit(false);
  };
  return (
    <div className="create-tour-form-wrapper">
      <form
        className="create-tour-formbody"
        action=" "
        onSubmit={handleSubmit(onHandleSubmit)}
      >
        <div className="form-group col-1" style={{ width: "100%" }}>
          <label>Tên danh mục</label>
          <input
            {...register("name", {
              required: "* Nhập tên danh mục.",
              maxLength: {
                value: 100,
                message: "* Nhập tên danh mục quá dài.",
              },
            })}
            defaultValue={category && category.name}
            style={{ width: "250px" }}
          />
          {errors.category && (
            <div className="alert">{errors.title.message}</div>
          )}
        </div>

        <div className="form-group col-2">
          <label>Mô tả danh mục: </label>
          <textarea
            style={{ height: "150px" }}
            {...register("description", {
              required: "* Nhập mô tả danh mục.",
              maxLength: {
                value: 1024,
                message: "*Nội dung mô tả danh mục quá dài!",
              },
            })}
            defaultValue={category && category.description}
          />
          {errors.description && (
            <div className="alert">{errors.category.message}</div>
          )}
        </div>

        {
            isSub && 
            <div className="form-group col-1">
                <label>Danh mục cha:</label>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    name="category"
                    placeholder='Chọn...'
                    variant='standard'
                    value={selectedCate}
                    onChange={(e)=> {
                        setSelectedCate(e.target.value)
                    }}
                    style={{width: 170, fontSize:12}}
                >
                    {
                        categories?.map((value, index) => (
                            <MenuItem key={index} value={value.parent._id}>{value?.parent.name}</MenuItem>
                        ))
                    }
                </Select>
                {errors.category && <div className="alert">{errors.category.message}</div>}
            </div>
        }  

        <button type="submit" ref={formRef} style={{ display: "none" }}>
          SUBMIT
        </button>
      </form>
    </div>
  );
}
