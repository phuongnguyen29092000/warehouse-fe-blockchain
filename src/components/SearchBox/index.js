import Spinner from 'components/Spinner'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select, {components} from 'react-select'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { debounce } from 'lodash';
import UserAPI from '../../apis/UserAPI'

const SearchBox = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [valueInput, setValueInput] = useState('')
  const [valueInput1, setValueInput1] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const {id} = useParams()
  const [isSearch, setIsSearch] = useState(false)
  
  const handleSearch = async() => {
    try {
      await UserAPI.getUserBySearchKey(valueInput).then((res)=> {
        if(res.status === 200){
          setResult(res?.data?.users.map((user)=> {
            return {
              label: user.companyName,
              value: user._id
            }
          }))
          setIsSearch(true)
        } else {
          setResult([])
        }
      })
    } catch (error) {
    }
  }
  const IndicatorsContainer = props => (
    <components.IndicatorsContainer {...props}>
      <div className='search-header-button' onClick={async(e)=> {
          await handleSearch()
        }}>
          <SearchIcon htmlColor='#fff' fontSize='medium'/>
          <span style={{color: '#fff', marginLeft: 3}}>Tìm kiếm</span>
          {
            isSearch && 
            <div className='close'
              onClick={(e)=> {
                e.stopPropagation()
                setResult([])
                setValueInput('')
                setSelectedOption(null)
                setIsSearch(false)
                navigate('/')
              }}
            >
              <CloseIcon htmlColor='#292929'/>
            </div>
          }
        </div>
    </components.IndicatorsContainer>
);

  return (
      <div className="search-box" style={{ width: "800px" }}>
        <div className="search-box__header">
          <Select
            name="search"
            key='search'
            options={result}
            // isDisabled={!!id}
            onChange={(option) => {
              setResult([])
              setSelectedOption(option)
              navigate(`/kho/${option.value}`)
            }}
            placeholder="Tìm kiếm công ty/doanh nghiệp"
            onInputChange={(e)=> {        
              setValueInput(e)
            }}
            onKeyDown={(e)=> {
              if(e.key === 'Enter') handleSearch()
              else return
            }}
            menuIsOpen={result?.length}
            value={selectedOption}
            inputValue={valueInput}
            styles={{
              container: (provided) => ({
                ...provided,
                width: 750
              }),
              control: (provided, state) => ({
                ...provided,
                background: '#fff',
                borderColor: '#FF6A00',
                minHeight: '55px',
                height: '55px',
                boxShadow: state.isFocused ? null : null,
                borderRadius: 35,
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
              singleValue: (provided) => ({
                ...provided,
                textAlign: 'left'
              })
            }}
            components={{
              IndicatorsContainer
            }}
          />
        </div>
      </div>
  )
}

export default SearchBox