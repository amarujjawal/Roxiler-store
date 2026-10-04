import React from "react";
import { useEffect, useState } from "react";
import api from "../api/api";
import Message from "../components/Message";

const initialFilters = { name: "", address: "" };

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState({ sortBy: "name", sortOrder: "asc" });
  const [ratings, setRatings] = useState({});
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/user/stores", {
        params: { ...filters, ...sort },
      });
      setStores(data.stores);
    } catch (err) {
      setState({
        error: err.response?.data?.message || "Failed to load stores",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [sort]);

  const rate = async (storeId) => {
    const rating = Number(ratings[storeId]);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setState({ error: "Please select a rating from 1 to 5" });
      return;
    }

    try {
      await api.post(`/user/stores/${storeId}/rating`, { rating });
      setState({ success: "Rating submitted successfully" });
      await load();
    } catch (err) {
      setState({
        error: err.response?.data?.message || "Could not submit rating",
      });
    }
  };

  const changeSort = (field) => {
    setSort((current) => ({
      sortBy: field,
      sortOrder:
        current.sortBy === field && current.sortOrder === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <>
      <h1>Stores</h1>
      <Message {...state} />

      <div className="filters">
        <input
          placeholder="Search store name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Search address"
          value={filters.address}
          onChange={(e) =>
            setFilters({ ...filters, address: e.target.value })
          }
        />
        <button onClick={load}>Search</button>
      </div>

      {loading ? (
        <div className="center">Loading stores...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th onClick={() => changeSort("name")}>Store Name ↕</th>
              <th onClick={() => changeSort("address")}>Address ↕</th>
              <th onClick={() => changeSort("rating")}>Overall Rating ↕</th>
              <th>Your Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr>
                <td colSpan="5">No stores found.</td>
              </tr>
            ) : (
              stores.map((store) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.address}</td>
                  <td>{Number(store.average_rating || 0).toFixed(2)}</td>
                  <td>{store.my_rating ?? "Not rated"}</td>
                  <td className="rating-action">
                    <select
                      value={ratings[store.id] ?? store.my_rating ?? ""}
                      onChange={(e) =>
                        setRatings({
                          ...ratings,
                          [store.id]: e.target.value,
                        })
                      }
                      aria-label={`Rating for ${store.name}`}
                    >
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => rate(store.id)}>
                      {store.my_rating ? "Update" : "Rate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </>
  );
}
