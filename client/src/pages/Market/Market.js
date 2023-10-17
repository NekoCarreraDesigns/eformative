import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Market.css";
import {
  Card,
  CardHeader,
  CardMedia,
  Typography,
  CardContent,
  CardActions,
  IconButton,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import SearchBar from "../../components/SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Market = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedItems, setDisplayedItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("market/items");
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching items");
        setLoading(false);
      }
    };

    fetchData(); // Call the fetch function inside useEffect
  }, []);

  const fetchItems = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await axios.get("market/items", {
        params: { search: searchTerm },
      });
      setItems(res.data);
      setDisplayedItems(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage("Error fetching items");
    }
    fetchItems(""); // Pass an empty string to fetch all items
  };

  const handleSave = async (itemId) => {
    setLoading(true);
    <CircularProgress aria-busy='true' />;
    try {
      await axios.post("items/saved", { itemId: itemId });
      setSavedItems([...savedItems, itemId]);
      setSuccessMessage("Item saved successfully");
    } catch (error) {
      console.log(error);
      setErrorMessage("Error saving item");
    }
  };

  const fetchItemDetails = async (itemId) => {
    try {
      const res = await axios.get(`market/${itemId}`);
      setSelectedItem(res.data);
    } catch (error) {
      console.log(error);
      setErrorMessage("error retrieving item details");
    }
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <div className='hero-section'>
        <h1 className='market-page-header'>Market</h1>
        <div className='market-filter-div'>
          <SearchBar onSearch={fetchItems} />
        </div>
      </div>
      {selectedItem ? (
        <div className='item-details-container'>
          <Card elevation={6} className='item-card'>
            <CardHeader
              title={selectedItem.product}
              subheader={selectedItem.sellerName}
            />
            <CardMedia
              image='http://placehold.jp/150x150.png'
              title={selectedItem.product}
            />
            <CardContent>
              <Typography variant='body2' color='textSecondary' component='p'>
                {selectedItem.description}
                {selectedItem.price}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton onClick={closeItemDetails}>Close</IconButton>
            </CardActions>
          </Card>
        </div>
      ) : displayedItems.length > 0 ? (
        <div className='card-container'>
          {displayedItems.map((item, index) => (
            <Card elevation={6} className='item-card' key={index}>
              <CardHeader
                title={item.product}
                subheader={item.sellerName}
                onClick={() => fetchItemDetails(item.id)}
              />
              <CardMedia
                image='http://placehold.jp/150x150.png'
                title={item.product}
              />
              <CardContent>
                <Typography variant='body2' color='textSecondary' component='p'>
                  {item.description}
                  {item.price}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleSave(item.id)}>
                  <FontAwesomeIcon icon={faStar} size='1x' color='gold' />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </div>
      ) : (
        <div className='alert-div'>
          <Typography variant='body1' className='alert-paragraph'>
            No results found! Could be a misspelling or it is not here
          </Typography>
        </div>
      )}
      {successMessage && (
        <Snackbar
          open={!!successMessage}
          autoHideDuration={3000}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
        />
      )}
      {errorMessage && (
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={3000}
          onClose={() => setErrorMessage("")}
          message={errorMessage}
        />
      )}
      {/* <div className='page-pagination-container'>
        <Pagination
          className='page-pagination'
          color='primary'
          variant='outlined'
          count={20}></Pagination>
      </div> */}
    </>
  );
};

export default Market;
