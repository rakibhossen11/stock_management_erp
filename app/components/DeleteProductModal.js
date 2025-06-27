// app/components/DeleteProductModal.jsx
'use client';

import { useState } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function DeleteProductModal({ 
  productName,
  productCode,
  onDelete,
  onCancel
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      setIsOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Delete Button - Triggers Modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Delete
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FiAlertTriangle className="text-red-500" />
                Confirm Deletion
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isDeleting}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="mb-4">
                Are you sure you want to delete <strong>{productName}</strong>?
              </p>
              <p className="text-sm text-gray-600">
                Product Code: <code>{productCode}</code>
              </p>
              <p className="mt-2 text-sm text-red-600">
                This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="animate-spin">↻</span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiAlertTriangle />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}