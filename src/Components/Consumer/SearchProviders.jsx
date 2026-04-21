import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api';
import { getErrorMessage } from '../../utils/errorHandler';

function ProviderCard({ provider, trustCache, setTrustCache, onPlaceOrder }) {
  const [loadingTrust, setLoadingTrust] = useState(false);
  const trust = trustCache[provider.username];

  useEffect(() => {
    if (!trust && !loadingTrust && provider.username) {
      setLoadingTrust(true);
      api.get(`/trust/provider/${provider.username}`)
        .then(res => setTrustCache(c => ({ ...c, [provider.username]: res.data })))
        .catch(() => setTrustCache(c => ({ ...c, [provider.username]: { trustBadge: '—' } })))
        .finally(() => setLoadingTrust(false));
    }
  }, [provider.username, trust, loadingTrust]);

  const badgeClass = trust?.trustBadge === 'TRUSTED' ? 'status-completed' :
    trust?.trustBadge === 'NEUTRAL' ? 'status-accepted' :
      trust?.trustBadge === 'RISKY' ? 'status-cancelled' : 'status-pending';

  return (
    <div className="provider-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
        <h4>{provider.username}</h4>
        {trust && (
          <span className={`status-badge ${badgeClass}`} title={`Completion: ${trust.completionRate?.toFixed(0)}%`}>
            {trust.trustBadge}
          </span>
        )}
      </div>
      <p><strong>Skill:</strong> {provider.skillName}</p>
      <p><strong>Rate:</strong> ₹{provider.rate}/hr</p>
      <p><strong>Experience:</strong> {provider.experience} years</p>
      <p><strong>Mode:</strong> {provider.serviceMode}</p>
      {provider.description && <p><strong>Description:</strong> {provider.description}</p>}
      <button className="btn-primary mt-sm" style={{ width: '100%' }} onClick={onPlaceOrder}>
        Place Order
      </button>
    </div>
  );
}

export default function SearchProviders() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSkill = searchParams.get('skill') || '';
  const [searchForm, setSearchForm] = useState({
    skill: initialSkill,
    minRate: '',
    maxRate: '',
    serviceMode: '',
    minExperience: ''
  });
  const [providers, setProviders] = useState([]);
  const [message, setMessage] = useState('');
  const [trustCache, setTrustCache] = useState({});

  useEffect(() => {
    if (initialSkill) {
      setSearchForm(f => ({ ...f, skill: initialSkill }));
    }
  }, [initialSkill]);

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
      params.append('skill', searchForm.skill);
      if (searchForm.minRate) params.append('minRate', searchForm.minRate);
      if (searchForm.maxRate) params.append('maxRate', searchForm.maxRate);
      if (searchForm.serviceMode) params.append('serviceMode', searchForm.serviceMode);
      if (searchForm.minExperience) params.append('minExperience', searchForm.minExperience);

      const response = await api.get(`/user-skills/search?${params.toString()}`);
      const data = response.data.content || response.data;
      setProviders(data);
      setMessage(data?.length ? '' : 'No providers found');
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h3>Search Providers</h3>
      <div className="card">
        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            name="skill"
            placeholder="Skill name (required)"
            value={searchForm.skill}
            onChange={handleChange}
            required
          />
          <input
            name="minRate"
            type="number"
            placeholder="Min Rate (₹)"
            value={searchForm.minRate}
            onChange={handleChange}
          />
          <input
            name="maxRate"
            type="number"
            placeholder="Max Rate (₹)"
            value={searchForm.maxRate}
            onChange={handleChange}
          />
          <select name="serviceMode" value={searchForm.serviceMode} onChange={handleChange}>
            <option value="">Any Mode</option>
            <option value="REMOTE">REMOTE</option>
            <option value="LOCAL">LOCAL</option>
          </select>
          <input
            name="minExperience"
            type="number"
            placeholder="Min Experience (years)"
            value={searchForm.minExperience}
            onChange={handleChange}
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>
      {message && (
        <div className={`message ${message.includes('found') ? 'message-info' : 'message-error'} mt-md`}>
          {message}
        </div>
      )}
      {providers.length > 0 && (
        <div className="provider-grid">
          {providers.map((provider) => (
            <ProviderCard
              key={`${provider.id}-${provider.skillName}`}
              provider={provider}
              trustCache={trustCache}
              setTrustCache={setTrustCache}
              onPlaceOrder={() => {
                const prefill = {
                  providerId: provider.providerId || provider.userId || provider.user?.id || provider.id,
                  providerName: provider.username || provider.user?.username,
                  skillId: provider.skillId || provider.skill?.id || provider.userSkillId,
                  skillName: provider.skillName || provider.skill?.skillName,
                  raw: provider // Keep full object for debugging
                };
                console.log("Saving prefillOrder:", prefill);
                localStorage.setItem('prefillOrder', JSON.stringify(prefill));
                navigate('/consumer/place-order');
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
