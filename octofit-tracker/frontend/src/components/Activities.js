import { useCallback, useEffect, useState } from 'react';
import { getApiBaseUrl, logFetchedData, normalizeResponseData } from './apiHelper';
import DataTable from './DataTable';
import Modal from './Modal';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const endpoint = `${getApiBaseUrl()}/activities/`;

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
        setActivities(normalized);
        setFilteredActivities(normalized);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);
    setFilteredActivities(
      activities.filter((item) => JSON.stringify(item).toLowerCase().includes(value.toLowerCase()))
    );
  };

  const handleShowJson = (item) => {
    setSelectedActivity(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h2 className="h4 mb-1">Activities</h2>
          <p className="text-muted mb-0">Live activity data pulled from the backend REST API.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={fetchData}>
          Refresh
        </button>
      </div>
      <div className="card-body">
        <form className="mb-4">
          <div className="row g-2 align-items-center">
            <div className="col-auto flex-grow-1">
              <label htmlFor="activityFilter" className="form-label visually-hidden">
                Filter activities
              </label>
              <input
                id="activityFilter"
                type="search"
                className="form-control"
                placeholder="Search activities..."
                value={filterValue}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </form>

        {loading && <div className="alert alert-info">Loading activities...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && filteredActivities.length === 0 && (
          <div className="alert alert-warning">No activities found.</div>
        )}
        {!loading && !error && filteredActivities.length > 0 && (
          <DataTable items={filteredActivities} onShowJson={handleShowJson} />
        )}
      </div>

      <Modal show={showModal} title="Activity details" onClose={handleCloseModal}>
        <pre>{JSON.stringify(selectedActivity, null, 2)}</pre>
      </Modal>
    </div>
  );
}

export default Activities;
