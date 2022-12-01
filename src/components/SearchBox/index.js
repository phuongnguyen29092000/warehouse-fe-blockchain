import Spinner from 'components/Spinner'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select, {components} from 'react-select'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { debounce } from 'lodash';
import UserAPI from '../../apis/UserAPI'

const SearchBox = () => {
  const [result, setResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [valueInput, setValueInput] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const navigate = useNavigate();
  
  useEffect(()=> {
    setValueInput('')
  }, [])

  useEffect(()=> {
    // debounce(async()=> {
      console.log({valueInput});
      if(!valueInput) {
        setResult([])
        return
      }
      try {
        UserAPI.getUserBySearchKey(valueInput).then((res)=> {
          if(res.status === 200){
            setResult(res?.data?.users.map((user)=> {
              return {
                label: user.companyName,
                value: user._id
              }
            }))
          } else {
            setResult(false)
          }
        })
      } catch (error) {
      }
    // }, 400)
  }, [valueInput])
  
  const handleSearch = async(value) => {
    if(!value) {
      setResult([])
      return
    }
    try {
      await UserAPI.getUserBySearchKey(value).then((res)=> {
        if(res.status === 200){
          setResult(res?.data?.users.map((user)=> {
            return {
              label: user.companyName,
              value: user._id
            }
          }))
        } else {
          setResult(false)
        }
      })
    } catch (error) {
    }
  }

  return (
      <div className="search-box" style={{ width: "800px" }}>
        <div className="search-box__header">
          <Select
            name="search"
            key='search'
            options={result}
            onChange={(option) => {
              setResult([])
              setSelectedOption(option.value)
              navigate(`/kho/${option.value}`)
            }}
            placeholder="Tìm kiếm công ty/doanh nghiệp"
            onInputChange={(e)=> {
              setValueInput(e)
            }}
            menuIsOpen={valueInput?.length}
            selec 
            inputValue={valueInput}
            styles={{
              container: (provided) => ({
                ...provided,
                width: 650
              }),
              control: (provided, state) => ({
                ...provided,
                background: '#fff',
                borderColor: '#FF6A00',
                minHeight: '55px',
                height: '55px',
                boxShadow: state.isFocused ? null : null,
                borderTopLeftRadius: 35,
                borderBottomLeftRadius: 35,
                '&:hover': {
                  border: '1px solid #FF6A00',
              }
              }),
              valueContainer: (provided) => ({
                ...provided,
                paddingLeft: 30
              }),
              placeholder: (provided) => ({
                ...provided, 
                textAlign: 'left'
              }),
              menu: (provided) => ({
                ...provided,
                background: '#fff',
                zIndex: 10000
              }),
              option: (provided) => ({
                ...provided,
                padding: '15px 0',
                color: '#292929',
                cursor: 'pointer'
              }),
              indicatorSeparator: (provided) => ({
                ...provided,
                display: 'none',
              }),
              dropdownIndicator: (provided) => ({
                ...provided,
                display: "none"
              }),
              singleValue: (provided) => ({
                ...provided,
                textAlign: 'left'
              })
            }}
          />
          <div className='search-header-button' onClick={handleSearch}>
            <SearchIcon htmlColor='#fff' fontSize='medium'/>
            <span style={{color: '#fff', marginLeft: 3}}>Tìm kiếm</span>
            {
              selectedOption && 
              <div className='close'
                onClick={(e)=> {
                  e.stopPropagation()
                  setResult([])
                  setValueInput('')
                  setSelectedOption('')
                  navigate('/')
                }}
              >
                <CloseIcon htmlColor='#292929'/>
              </div>
            }
          </div>
        </div>
      </div>
  )
}

export default SearchBox