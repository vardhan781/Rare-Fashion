import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { backendUrl } from "../../App";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import {
  Trash2,
  Image as ImageIcon,
  X,
  Package,
  Tag,
  DollarSign,
  Award,
} from "lucide-react";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    product: null,
  });

  const fetchlist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success("Product deleted successfully");
        setDeleteModal({ show: false, product: null });
        await fetchlist();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (product) => {
    setDeleteModal({ show: true, product });
  };

  useEffect(() => {
    fetchlist();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="list-page">
      <div className="list-header">
        <h1>Product List</h1>
        <p>Manage your products ({list.length} items)</p>
      </div>

      {list.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <h3>No products found</h3>
          <p>Add your first product to get started</p>
        </div>
      ) : (
        <div className="products-grid">
          {list.map((item) => (
            <div className="product-card" key={item._id}>
              <div className="card-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="no-image">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h3 className="product-title">{item.name}</h3>
                  {item.bestseller && (
                    <span className="best-seller">
                      <Award size={14} />
                    </span>
                  )}
                </div>

                <div className="card-details">
                  <div className="detail">
                    <Tag size={16} />
                    <span>{item.category}</span>
                  </div>
                  <div className="detail price">
                    <DollarSign size={16} />
                    <span>{item.price}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => confirmDelete(item)}
                className="delete-btn"
                title="Delete product"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {deleteModal.show && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            role="dialog"
            aria-labelledby="delete-modal-title"
          >
            <div className="modal-header">
              <h2 id="delete-modal-title">Confirm Delete</h2>
              <button
                onClick={() => setDeleteModal({ show: false, product: null })}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to delete{" "}
                <strong>"{deleteModal.product?.name}"</strong>?
              </p>
              <p className="modal-note">This action cannot be undone.</p>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setDeleteModal({ show: false, product: null })}
                className="modal-btn modal-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => removeProduct(deleteModal.product?._id)}
                className="modal-btn modal-btn-primary"
                autoFocus
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
