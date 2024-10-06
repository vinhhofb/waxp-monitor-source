// src/components/Transaction.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transaction = ({ transactionId }) => {
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'https://wax.eosphere.io/v1/history/get_transaction';

    const getTransaction = async (id) => {
        try {
            const response = await axios.post(API_URL, { id });
            return response.data;
        } catch (error) {
            console.error('Error fetching transaction:', error);
            throw error; // Handle the error as needed
        }
    };

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const data = await getTransaction(transactionId);
                setTransaction(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [transactionId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Transaction Details</h2>
            {transaction && (
                <div>
                    <p><strong>ID:</strong> {transaction.id}</p>
                    <p><strong>Block Time:</strong> {transaction.block_time}</p>
                    {/* Add more transaction details as needed */}
                </div>
            )}
        </div>
    );
};

// Usage example within the same file
const App = () => {
    const transactionId = 'cc270e7bdb20a25097dbfae3e8a143853a28234629f6b459fef3c3f5e42baac2'; // Replace with the actual transaction ID

    return (
        <div>
            <h1>Wax Transaction Viewer</h1>
            <Transaction transactionId={transactionId} />
        </div>
    );
};

export default App;
