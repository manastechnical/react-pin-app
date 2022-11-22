import { useState, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';
import 'mapbox-gl/dist/mapbox-gl.css';
import './app.css';
import { axiosInstance } from './config';

function App() {
  const myStorage = window.localStorage;
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user'));
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewPort, setViewport] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4
  })

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewPort, latitude: lat, longitude: long })
  }

  const handleAddClick = (e) => {
    setNewPlace({
      lat: e.lngLat.lat,
      long: e.lngLat.lng
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    }
    try {
      const res = await axiosInstance.post('/pins', newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }


  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axiosInstance.get('/pins');
        console.log(res.data);
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    getPins();

  }, []);


  return (
    <div className="App">
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX}
        initialViewState={{ ...viewPort }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
        onDblClick={handleAddClick}
      >
        <NavigationControl position='top-left' />
        <FullscreenControl position='bottom-left' />
        {pins.map(p => (
          <>
            <Marker longitude={p.long} latitude={p.lat}>
              <Room style={{ fontSize: viewPort.zoom * 7, color: p.username === currentUser ? "tomato" : "slateblue", cursor: "pointer" }} onClick={() => handleMarkerClick(p._id, p.lat, p.long)} />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup longitude={p.long} latitude={p.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className='card'>
                  <label>Place</label>
                  <h3 className='place'>{p.title}</h3>
                  <label>Review</label>
                  <p className='desc'>{p.desc}</p>
                  <label>Rating</label>
                  <div className='stars'>
                    {Array(p.rating).fill(<Star className='star' />)}

                  </div>
                  <label>Information</label>
                  <span className='username'>Created by <b>{p.username}</b></span>
                  <span className='date'>{format(p.createdAt)}</span>
                </div>
              </Popup>)}
          </>
        ))}

        {currentUser && newPlace && (<Popup longitude={newPlace.long} latitude={newPlace.lat}
          anchor="left"
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input type="text" placeholder='Enter a title' onChange={(e) => setTitle(e.target.value)} />
              <label>Review</label>
              <textarea name="review" id="review" placeholder='Tell us something about this place' onChange={(e) => setDesc(e.target.value)}></textarea>
              <label>Ratings</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className='submitButton' type='submit'>Add a pin</button>
            </form>
          </div>
        </Popup>
        )}
        {currentUser ? (<button className='loutBtn' onClick={handleLogout}>Logout</button>) : (<div className='buttons'>
          <button className='linBtn' onClick={() => { setShowLogin(!showLogin), setShowRegister(false) }}>LogIn</button>
          <button className='registerBtn' onClick={() => { setShowRegister(!showRegister), setShowLogin(false) }}>Register</button>
        </div>)}

        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}
      </Map>
    </div>
  )
}

export default App
