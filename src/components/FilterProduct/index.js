import { Controller, useForm } from "react-hook-form";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import RegardPrice from "LogicResolve/RegardPrice";
import { Container } from "@mui/system";
import { debounce } from "lodash";
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";

const FilterProduct = ({ queriesData, setQueriesData }) => {
  const [search, setSearch] = useState('')
  const { register, handleSubmit, reset, control } = useForm();
  const onHandleSubmit = (data) => {
    console.log({ data });
    setQueriesData({
      ...queriesData,
      min: data?.value[0],
      max: data?.value[1],
    });
    reset();
  };

  const debouncedFilter = debounce(async (value) => {
    setQueriesData({
      ...queriesData,
      min: value[0],
      max: value[1],
      skip: 1
    });
  }, 400);

  const handleSearchName =async() => {
    setQueriesData({
      ...queriesData,
      s: search?.toLowerCase(),
      skip: 1
    });
  }

  return (
    <div
      style={{
        borderBottom: "2px solid rgb(244, 244, 244)",
        paddingBottom: 30,
        margin: "20px 0px 20px 0px",
      }}
    >
      <Container>
        <h3
          className='filter-header'
        >
          Bạn đang tìm kiếm ?
        </h3>
        <form action="" onSubmit={handleSubmit(onHandleSubmit)}>
          <Grid
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <div
              className="filter-item-wrapper"
              style={{ display: "flex", width: "100%", marginBottom: 25 }}
            >
              <div
                className="filter-item-label"
                style={{ display: "flex", alignItems: "center" }}
              >
                <label
                  className="filter-label"
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "rgb(62, 80, 96)",
                    whiteSpace: 'nowrap'
                  }}
                >
                  Mức giá:
                </label>
                <div
                  className="filter-detail"
                  style={{
                    width: 130,
                    marginLeft: 30,
                  }}
                >
                  <Controller
                    name="price"
                    control={control}
                    defaultValue={[0, 50000000]}
                    render={({ field }) => (
                      <Slider
                        {...field}
                        onChange={(_, value) => {
                          field.onChange(value);
                          debouncedFilter(value);
                        }}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${RegardPrice(value)}`}
                        max={50000000}
                        min={0}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div
              className="filter-item-wrapper"
              style={{ display: "flex", width: "100%" }}
            >
              <div
                className="filter-item-label"
                style={{ display: "flex", alignItems: "center" }}
              >
                <label
                  className="filter-label"
                  htmlFor="discountCheck"
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "rgb(62, 80, 96)",
                  }}
                >
                  Giảm giá:
                </label>
                <section style={{ marginLeft: 7 }}>
                  <Controller
                    name="discount"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        id="discountCheck"
                        name="discountCheck"
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                          setQueriesData({
                            ...queriesData,
                            isDiscount: e.target.checked,
                            skip: 1
                          });
                        }}
                        checked={queriesData?.isDiscount}
                        style={{ padding: 0, paddingLeft: 5 }}
                      />
                    )}
                  />
                </section>
              </div>
            </div>
            <div style={{ display: "flex", width: "100%", marginTop: 20, alignItems: 'center'}} className='select-perpage'>
              <label
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  color: "rgb(62, 80, 96)",
                  marginRight: 10
                }}
              >
                Số lượng:
              </label>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={queriesData?.limit}
                onChange={(e) => {
                  setQueriesData({ ...queriesData, limit: e.target.value, skip: 1 });
                }}
              >
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </div>
            <div style={{ display: "flex", width: "100%", marginTop: 20, alignItems: 'center'}} className='search-product-name'>
              <TextField 
                id="standard-basic" 
                label="Tên sản phẩm" 
                variant="standard" 
                style={{width: '100%'}}
                value={search}
                className={search && 'hidden-label'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                        <div onClick={handleSearchName}>
                          <SearchIcon sx={{cursor: 'pointer'}}/>
                        </div>
                    </InputAdornment>
                  )
                }}
                onChange={(e)=> {
                  setSearch(e.target.value)
                }}
                />
            </div>
          </Grid>
        </form>
      </Container>
    </div>
  );
};

export default FilterProduct;
