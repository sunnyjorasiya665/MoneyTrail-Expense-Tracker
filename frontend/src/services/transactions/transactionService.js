import axios from "axios";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
import { BASE_URL } from "../../utils/url";

//! Get the token
const token = getUserFromStorage();

//! Add Transaction API
export const addTransactionAPI = async ({
  type,
  date,
  description,
  category,
  amount,
}) => {
  const response = await axios.post(
    `${BASE_URL}/transactions/create`,
    {
      type,
      date,
      description,
      category,
      amount,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

//! Update Category API
export const updateTransactionAPI = async ({
  type,
  date,
  description,
  category,
  amount,
  id,
}) => {
  const response = await axios.put(
    `${BASE_URL}/transactions/update-transaction/${id}`,
    {
      type,
      date,
      description,
      category,
      amount,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  //Return a promise
  return response.data;
};

//! Delete Category API
export const deleteTransactionAPI = async (id) => {
  const response = await axios.delete(`${BASE_URL}/transactions/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//! List Transactions API (Fixed)
export const listTransactionsAPI = async ({
  category,
  startDate,
  endDate,
  type,
}) => {
  const response = await axios.get(`${BASE_URL}/transactions/lists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Pass filters as query parameters
    params: {
      startDate,
      endDate,
      type,
      category,
    },
  });
  return response.data;
};
