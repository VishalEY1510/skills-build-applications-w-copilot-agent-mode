import { useCallback, useEffect, useState } from 'react';
import { getApiBaseUrl, logFetchedData, normalizeResponseData } from './apiHelper';
import DataTable from './DataTable';
import Modal from './Modal';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const endpoint = `${getApiBaseUrl()}/teams/`;

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
        setTeams(normalized);
        setFilteredTeams(normalized);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [endpoint]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterValue(value);
    setFilteredTeams(
      teams.filter((item) => JSON.stringify(item).toLowerCase().includes(value.toLowerCase()))
    );
  };

  const handleShowJson = (item) => {
    setSelectedTeam(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h2 className="h4 mb-1">Teams</h2>
          <p className="text-muted mb-0">Team data from the backend API shown in a clean table layout.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={fetchData}>
          Refresh
        </button>
      </div>
      <div className="card-body">
        <form className="mb-4">
          <div className="row g-2 align-items-center">
            <div className="col-auto flex-grow-1">
              <label htmlFor="teamFilter" className="form-label visually-hidden">
                Filter teams
              </label>
              <input
                id="teamFilter"
                type="search"
                className="form-control"
                placeholder="Search teams..."
                value={filterValue}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </form>

        {loading && <div className="alert alert-info">Loading teams...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && filteredTeams.length === 0 && (
          <div className="alert alert-warning">No teams found.</div>
        )}
        {!loading && !error && filteredTeams.length > 0 && (
          <DataTable items={filteredTeams} onShowJson={handleShowJson} />
        )}
      </div>

      <Modal show={showModal} title="Team details" onClose={handleCloseModal}>
        <pre>{JSON.stringify(selectedTeam, null, 2)}</pre>
      </Modal>
    </div>
  );
}

export default Teams;
