import { useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js';

const selectedPlaceID = JSON.parse(
  localStorage.getItem('selectedPlaces'))
  .map(id => AVAILABLE_PLACES.find(i => i.id === id)) || []

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [availablePlace, setAvailablePlace] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(selectedPlaceID);
  const [isOpenModal, setIsOpenModal] = useState(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlace = sortPlacesByDistance(AVAILABLE_PLACES, position.coords.latitude, position.coords.longitude)
      setAvailablePlace(sortedPlace)
    })
  }, [])

  function handleStartRemovePlace(id) {
    // modal.current.open();
    setIsOpenModal(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    // modal.current.close();
    setIsOpenModal(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || []
    if (storeIds.indexOf(id) === -1)
      localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storeIds]))
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    // modal.current.close();
    setIsOpenModal(false)
    const storeIds = JSON.parse(localStorage.getItem('selectedPlaces')) || []
    localStorage.setItem('selectedPlaces', JSON.stringify(storeIds.filter(i => i !== selectedPlace.current)))
  }


  return (
    <>
      <Modal ref={modal} isOpenModal={isOpenModal} onClose={handleStopRemovePlace} >
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlace}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
