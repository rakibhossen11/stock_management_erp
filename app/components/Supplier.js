import { useState } from "react";
import { FaPlus, FaSpinner } from "react-icons/fa";
import { useProducts } from "../providers/ProductContext";

function SupplierSelector({ suppliers, value, onChange }) {
  const { createSupplier } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    // console.log(newSupplier)
    try {
      await createSupplier(newSupplier);
      setIsModalOpen(false);
      // setNewSupplier({ name: '' });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add supplier");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Supplier*
      </label>
      <div className="flex items-center gap-2">
        <select
          className="w-full border rounded-md p-2 flex-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        >
          <option value="">Select Supplier</option>
          {suppliers?.map((sup) => (
            <option key={sup._id} value={sup.name}>
              {sup.name}
            </option>
          ))}
          {/* <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="office-supplies">Office Supplies</option>
          <option value="breakroom">Breakroom</option> */}
        </select>
        <button
          type="button"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          onClick={() => setIsModalOpen(true)}
          aria-label="Add new supplier"
        >
          <FaPlus className="h-5 w-5" />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Supplier</h2>
            <input
              type="text"
              className="w-full border rounded-md p-2 mb-4"
              placeholder="Enter category name"
              value={newSupplier}
              onChange={(e) => setNewSupplier(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSupplier()}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleAddSupplier}
              >
                Add Supplier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplierSelector;
