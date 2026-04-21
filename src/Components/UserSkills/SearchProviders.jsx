import { useState } from "react";
import { authFetch } from "../jwt-storage/authFetch";

export default function SearchProviders() {

  const [searchForm, setSearchForm] = useState({
    skill: "",
    minRate: "",
    maxRate: "",
    serviceMode: "",
    minExperience: ""
  });

  const [providers, setProviders] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setSearchForm({
      ...searchForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      params.append("skill", searchForm.skill);
      
      if (searchForm.minRate) params.append("minRate", searchForm.minRate);
      if (searchForm.maxRate) params.append("maxRate", searchForm.maxRate);
      if (searchForm.serviceMode) params.append("serviceMode", searchForm.serviceMode);
      if (searchForm.minExperience) params.append("minExperience", searchForm.minExperience);

      const data = await authFetch(`/user-skills/search?${params.toString()}`);
      setProviders(data.content || []);
      setMessage(data.content?.length ? "" : "No providers found");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Search failed");
    }
  };

  return (
    <div>
      <h3>Search Skill Providers</h3>

      <form onSubmit={handleSearch}>
        <input
          name="skill"
          placeholder="Skill name (required)"
          value={searchForm.skill}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="minRate"
          type="number"
          placeholder="Min Rate"
          value={searchForm.minRate}
          onChange={handleChange}
        />
        <br />

        <input
          name="maxRate"
          type="number"
          placeholder="Max Rate"
          value={searchForm.maxRate}
          onChange={handleChange}
        />
        <br />

        <select
          name="serviceMode"
          value={searchForm.serviceMode}
          onChange={handleChange}
        >
          <option value="">Any Mode</option>
          <option value="REMOTE">REMOTE</option>
          <option value="LOCAL">LOCAL</option>
        </select>
        <br />

        <input
          name="minExperience"
          type="number"
          placeholder="Min Experience (years)"
          value={searchForm.minExperience}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Search</button>
      </form>

      {message && <p>{message}</p>}

      {providers.length > 0 && (
        <div>
          <h4>Search Results:</h4>
          {providers.map((provider) => (
            <div key={`${provider.id}-${provider.skillName}`}>
              <b>Provider: {provider.username}</b> (ID: {provider.id})<br />
              <b>Skill: {provider.skillName}</b><br />
              Rate: ${provider.rate}/hr<br />
              Experience: {provider.experience} years<br />
              Mode: {provider.serviceMode}<br />
              Description: {provider.description}
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}