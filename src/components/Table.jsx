import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase-config";
import { Link } from "react-router-dom";

export const Table = () => {
  const [notifications, setNotifications] = useState([]);
  const notificationsCollectionRef = collection(db, "notifications");

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const querySnapshot = await getDocs(notificationsCollectionRef);
        const notificationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(notificationsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    getNotifications();

    // Call getNotifications every 5 seconds
    const interval = setInterval(getNotifications, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id, audioUrl) => {
    try {
      // Delete the Firestore document
      await deleteDoc(doc(db, "notifications", id));
      // Delete the audio file from Firebase Storage
      const audioRef = ref(storage, audioUrl);
      await deleteObject(audioRef);

      // Update state to remove the deleted notification
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="overflow-x-auto text-center px-48">
      <div className="table-container mx-auto">
        <div>
          <table className="table text-center" style={{}}>
            {/* head */}
            <thead className="bold">
              <tr className="mx-8">
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>No</th>
                <th>Event Name</th>
                <th>Notification Image</th>
                <th>Notification Audio</th>
                <th>Notification Date</th>
                <th>Notification Detail</th>
                <th>Status</th>
                <th>Action</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="notification-list">
              {notifications.map((item, index) => (
                <tr key={item.id} className="mx-8">
                  <td></td>
                  <td>{index + 1}</td>
                  <td>{item.eventName}</td>
                  <td style={{ display: "flex", justifyContent: "center" }}>
                    <img
                      src={item.imageNotification}
                      alt="notification"
                      style={{ maxWidth: "100px", maxHeight: "100px" }}
                    />
                  </td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <audio
                        controls
                        src={item.audioNotification}
                        type="audio/mpeg"
                      ></audio>
                    </div>
                  </td>
                  <td>{item.dateNotification}</td>
                  <td>{item.detailNotification}</td>
                  <td>{item.statusNotification}</td>
                  <td>
                    <button
                      className="btn btn-error"
                      onClick={() =>
                        handleDelete(item.id, item.audioNotification)
                      }
                    >
                      Delete
                    </button>
                    <Link to={`/edit/${item.id} `} className="btn btn-warning">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
