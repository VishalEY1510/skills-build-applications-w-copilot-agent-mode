import { useCallback, useEffect, useState } from 'react';
import { getApiBaseUrl, logFetchedData, normalizeResponseData } from './apiHelper';
import DataTable from './DataTable';
import Modal from './Modal';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const endpoint = `${getApiBaseUrl()}/workouts/`;

  const fetchData = useCallback(() => {
    console.log('Fetching endpoint:', endpoint);
    setLoading(true);
    setError(null);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API error ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        logFetchedData(endpoint, data);
        const normalized = normalizeResponseData(data);
        setWorkouts(normalized);
        setFilteredWorkouts(normalized);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);
    setFilteredWorkouts(
      workouts.filter((item) => JSON.stringify(item).toLowerCase().includes(value.toLowerCase()))
    );
  };

  const handleShowJson = (item) => {
    setSelectedWorkout(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedWorkout(null);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h2 className="h4 mb-1">Workouts</h2>
          <p className="text-muted mb-0">Workout records displayed in a polished Bootstrap table.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={fetchData}>
          Refresh
        </button>
      </div>
      <div className="card-body">
        <form className="mb-4">
          <div className="row g-2 align-items-center">
            <div className="col-auto flex-grow-1">
              <label htmlFor="workoutFilter" className="form-label visually-hidden">
                Filter workouts
              </label>
              <input
                id="workoutFilter"
                type="search"
                className="form-control"
                placeholder="Search workouts..."
                value={filterValue}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </form>

        {loading && <div className="alert alert-info">Loading workouts...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && filteredWorkouts.length === 0 && (
          <div className="alert alert-warning">No workouts found.</div>
        )}
        {!loading && !error && filteredWorkouts.length > 0 && (
          <DataTable items={filteredWorkouts} onShowJson={handleShowJson} />
        )}
      </div>

      <Modal show={showModal} title="Workout details" onClose={handleCloseModal}>
        <pre>{JSON.stringify(selectedWorkout, null, 2)}</pre>
      </Modal>
    </div>
  );
}

export default Workouts;
