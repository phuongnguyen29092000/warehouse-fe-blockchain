import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MenuItem, Select } from "@mui/material";


export default function ChangePassForm({
  handleChangePass,
  info,
  submit = false,
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
  const { accountUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  useEffect(()=> {
    //
  }, [])

  useEffect(() => {
    if (submit) {
      formRef.current.click();
    }
  }, [submit]);

  const onHandleSubmit = (data) => {
    handleChangePass(Object.assign(data, {email: accountUser?.email}));
    setSubmit(false);
  };
  return (
    <div className="create-tour-form-wrapper">
      <form
        className="create-tour-formbody"
        action=" "
        onSubmit={handleSubmit(onHandleSubmit)}
      >
        <div className="form-group col-1" style={{ width: "100%", marginBottom: 20}}>
          <label style={{width: 160}}>Mật khẩu cũ</label>
          <input
            {...register("oldpass", {
              required: "* Nhập mật khẩu cũ.",
            })}
            style={{ width: "250px" }}
            type='password'
          />
          {errors.oldpass && (
            <div className="alert">{errors.title.message}</div>
          )}
        </div>
        <div className="form-group col-1" style={{ width: "100%" , marginBottom: 20}}>
          <label style={{width: 160}}>Mật khẩu mới</label>
          <input
            {...register("newpass", {
              required: "* Nhập mật khẩu mới.",
            })}
            style={{ width: "250px" }}
            type='password'
          />
          {errors.newpass && (
            <div className="alert">{errors.title.message}</div>
          )}
        </div>
        <div className="form-group col-1" style={{ width: "100%", marginBottom: 20}}>
          <label style={{width: 160}}>Xác nhận mật khẩu mới</label>
          <input
            {...register("confirmpass", {
              required: "* Nhập xác nhận mật khẩu mới.",
            })}
            style={{ width: "250px" }}
            type='password'
          />
          {errors.confirmpass && (
            <div className="alert">{errors.title.message}</div>
          )}
        </div>
        <button type="submit" ref={formRef} style={{ display: "none" }}>
          SUBMIT
        </button>
      </form>
    </div>
  );
}
