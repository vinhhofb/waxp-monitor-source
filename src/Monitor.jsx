import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const Monitor = () => {
  const [accounts, setAccounts] = useState(''); // Input accounts string
  const [mineData, setMineData] = useState([]); // Store mining data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch mining data for accounts
  const fetchMineData = async () => {
    setLoading(true);
    setError(null);
    const accountArray = accounts.split(' ').filter(account => account); // Split accounts by space
    const fetchedData = [];

    try {
      // Use Promise.all to fetch data for all accounts
      const results = await Promise.all(
        accountArray.map(async (account) => {
          const afterDate = '2024-10-06T00:00:00.000Z';
          const beforeDate = '2024-10-06T23:59:59.999Z';

          // Call API with the new endpoint
          const response = await axios.get('https://wax.dapplica.io/v2/history/get_actions', {
            params: {
              account: account,        // Account to retrieve
              'act.name': 'mine',      // Action 'mine'
              skip: 0,                 // Skip 0 records (do not skip)
              limit: 1,                // Get 1 record
              sort: 'desc',             // Sort ascending
              after: afterDate,        // Start date
              before: beforeDate       // End date
            }
          });

          // Check the result
          const action = response.data.actions[0]; // Get the first action
          return {
            account,
            last_mine: action ? action.timestamp : 'N/A',  // Get timestamp of the action if exists
            amount: action && action.data ? action.data.quantity : 'N/A', // Get the TLM amount if exists
          };
        })
      );
      setMineData(results);
    } catch (error) {
      setError('Failed to fetch mining data. Please try again.');
      console.error(error);
    }
    setLoading(false);
  };

  console.log(mineData);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Mine TLM Dashboard</h1>
  
      {/* Input for entering wallet addresses */}
      <textarea
        className="border border-gray-300 p-2 w-full rounded-md"
        rows="3"
        value={accounts}
        onChange={(e) => setAccounts(e.target.value)}
        placeholder="Enter multiple WAX wallet addresses separated by spaces..."
      />
  
      {/* Button to fetch data */}
      <button
        onClick={fetchMineData}
        className={`bg-blue-500 text-white px-4 py-2 mt-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        disabled={loading}
      >
        {loading ? 'Fetching Data...' : 'Fetch Mine Data'}
      </button>
  
      {/* Display error if any */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
  
      {/* Results table */}
      {!loading && mineData.length > 0 && (
        <table className="table-auto w-full mt-4 border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">Account</th>
              <th className="px-4 py-2 text-left">Last Mine</th>
              <th className="px-4 py-2 text-left">TLM Amount</th>
            </tr>
          </thead>
          <tbody>
            {mineData.map((data, index) => {
              const lastMineTime = new Date(data.last_mine);
              const currentTime = new Date();
              const timeDiff = (currentTime - new Date(lastMineTime.getTime() + 7 * 60 * 60 * 1000)) / (1000 * 60 * 60); // Difference in hours
  
              // Determine text color based on time difference
              const textColorClass = timeDiff > 1 ? 'text-red-500' : 'text-green-500';
  
              return (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{data.account}</td>
                  <td className={`px-4 py-2 ${textColorClass}`}>
                    {data.last_mine !== 'N/A'
                      ? new Date(lastMineTime.getTime() + 7 * 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-2">
                    {data.amount !== 'N/A' ? data.amount : 'N/A'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
  
};

export default Monitor;
