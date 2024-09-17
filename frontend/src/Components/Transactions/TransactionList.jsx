import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { listCategoriesAPI } from "../../services/category/categoryService";
import {
  deleteTransactionAPI,
  listTransactionsAPI,
} from "../../services/transactions/transactionService";

const TransactionList = () => {
  //!Filtering state
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    category: "",
  });

  //!Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Fetching categories
  const {
    data: categoriesData,
    isLoading: categoryLoading,
    error: categoryErr,
  } = useQuery({
    queryFn: listCategoriesAPI,
    queryKey: ["list-categories"],
  });

  // Fetching transactions
  const {
    data: transactions,
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryFn: () => listTransactionsAPI(filters),
    queryKey: ["list-transactions", filters],
  });

  // Deleting category
  const navigate = useNavigate();
  const {
    mutateAsync,
    isPending, // This indicates delete mutation is in progress
    error: txnErr,
    isSuccess,
  } = useMutation({
    mutationFn: deleteTransactionAPI,
    mutationKey: ["delete-transaction"],
  });

  // Delete handler
  const handleDelete = (id) => {
    mutateAsync(id)
      .then(() => {
        // Refetch categories after deletion
        refetch();
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className="my-4 p-4 shadow-lg rounded-lg bg-white">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Start Date */}
        <div className="flex flex-col">
          <label
            htmlFor="startDate"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            From:
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label
            htmlFor="endDate"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            To:
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>

        {/* Type */}
        <div className="relative flex flex-col">
          <label
            htmlFor="type"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Type
          </label>
          <select
            name="type"
            id="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        {/* Category */}
        <div className="relative flex flex-col">
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            name="category"
            id="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none"
          >
            <option value="">All Categories</option>
            <option value="Uncategorized">Uncategorized</option>
            {categoriesData?.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name || Uncategorized}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Category
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Type
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Amount
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Description
              </th>
              <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions?.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions?.map((transaction) => (
                <tr key={transaction._id} className="border-t">
                  <td className="py-2 px-4 text-gray-600">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-gray-600">
                    {transaction.category || "Uncategorized"}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.type.charAt(0).toUpperCase() +
                        transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-gray-800">
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-600 italic">
                    {transaction.description || "N/A"}
                  </td>
                  <td className="py-2 px-4 flex space-x-3">
                    <Link to={`/update-transaction/${transaction._id}`}>
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Edit Transaction"
                      >
                        <FaEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete Transaction"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
