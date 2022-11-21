import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, InputAdornment, OutlinedInput, TextField } from '@mui/material';
import Spinner from 'components/Spinner'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBox = ({ onClose }) => {
    const [listResult, setListResult] = useState([])
    const [moreTour, setMoreTour] = useState(false)
    const [loading, setLoading] = useState(false)
    const [valueInput, setValueInput] = useState('')
    const navigate = useNavigate();

    const handleLoadSearchPage = () => {

    }

    return (
        <div className="search-box" style={{ width: "800px" }}>
          <div className="search-box__header">
            {/* <div className="btn-cancel">
              <CloseIcon className="cancel" onClick={onClose} />
            </div> */}
            <OutlinedInput
              className="search-input"
              placeholder="Tìm kiếm..."
              value={valueInput}
              color="primary"
              sx={{ borderRadius: 50, height: 50, width: 800}}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // handleLoadSearchPage();
                }
              }}
              onChange={(e) => {
                setValueInput(e.target.value)
                // handleSearchTour(e);
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleLoadSearchPage} edge="end">
                    <SearchIcon className="search-icon" />
                  </IconButton>
                </InputAdornment>
              }
            />
          </div>
          {/* <div className="search-box__result">
            {loading ? (
              <SpinnerLoading />
            ) : listResult.length > 0 ? (
              listResult.map((tour, index) => (
                <div
                  className="mini-tour-card"
                  title={tour.tourName}
                  key={index}
                  onClick={() => navigate(`/tour-chi-tiet/${tour._id}`)}
                >
                  <TourCardMini
                    name={tour.tourName}
                    img={ConvertToImageURL(tour.imageAvatar)}
                    rating={tour.ratingsAverage}
                    _id={tour._id}
                  />
                </div>
              ))
            ) : valueInput.trim() !== "" ? (
              <div className="title-not-found">
                <h4>Không tìm thấy!</h4>
              </div>
            ) : (
              <></>
            )}
            {moreTour && (
              <div className="title-more">
                <span onClick={() => handleLoadSearchPage()}>Xem tất cả</span>
              </div>
            )}
          </div> */}
        </div>
    )
}

export default SearchBox