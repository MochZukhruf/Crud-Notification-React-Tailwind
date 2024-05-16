import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase-config";

export const Hero = () => {
  const navigate = useNavigate();
  const [newTitle, setTitle] = useState("");
  const [newImage, setImage] = useState(null);
  const [newAudio, setAudio] = useState(null);
  const [newDate, setDate] = useState("");
  const [newDetail, setDetail] = useState("");
  const [newStatus, setStatus] = useState("Null");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const notificationsCollectionRef = collection(db, "notifications");

  const { id_data } = useParams();
  console.log(id_data);

  useEffect(() => {
    if (id_data) {
      const getNotification = async () => {
        const docRef = doc(db, "notifications", id_data);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.eventName);
          setDate(data.dateNotification);
          setDetail(data.detailNotification);
          setStatus(data.statusNotification);
          setImage(data.imageNotification);
          setAudio(data.audioNotification);
        }
      };
      getNotification();
    }
  }, [id_data]);

  const uploadFile = async (file, filePath) => {
    const fileRef = ref(storage, filePath);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let newImageURL = newImage;
      let newAudioURL = newAudio;
      let oldImageURL = null;
      let oldAudioURL = null;

      // Jika id_data ada, artinya sedang melakukan update
      if (id_data) {
        // Dapatkan dokumen lama untuk mendapatkan URL gambar dan audio lama
        const docRef = doc(db, "notifications", id_data);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          oldImageURL = data.imageNotification;
          oldAudioURL = data.audioNotification;
        }
      }

      if (newImage && typeof newImage === "object") {
        const imageFilePath = `images/${newImage.name}`;
        newImageURL = await uploadFile(newImage, imageFilePath);
      }

      if (newAudio && typeof newAudio === "object") {
        const audioFilePath = `audio/${newAudio.name}`;
        newAudioURL = await uploadFile(newAudio, audioFilePath);
      }

      const notificationData = {
        eventName: newTitle,
        imageNotification: newImageURL,
        audioNotification: newAudioURL,
        dateNotification: newDate,
        detailNotification: newDetail,
        statusNotification: newStatus,
      };

      if (id_data) {
        // Perbarui dokumen Firestore dengan data baru
        await updateDoc(doc(db, "notifications", id_data), notificationData);

        // Hapus file lama dari storage jika ada
        if (oldImageURL) {
          const oldImageRef = ref(storage, oldImageURL);
          await deleteObject(oldImageRef);
        }
        if (oldAudioURL) {
          const oldAudioRef = ref(storage, oldAudioURL);
          await deleteObject(oldAudioRef);
        }
      } else {
        await addDoc(notificationsCollectionRef, notificationData);
      }

      // Clear form fields
      setTitle("");
      setImage(null);
      setAudio(null);
      setDate("");
      setDetail("");
      setStatus("Null");

      // Set status message
      setStatusMessage("Data submitted successfully!");

      // Refresh page after 2 seconds
      setTimeout(() => {
        navigate(0);
      }, 2000);
    } catch (error) {
      setStatusMessage("Error submitting data. Please try again.");
    } finally {
      setLoading(false); // Set loading state to false after submission
    }
  };

  return (
    <div>
      <div className="py-5 flex justify-center items-center h-max">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text text-lg font-bold">Event Name</span>
          </div>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            id="eventName"
            value={newTitle}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
      </div>
      <div className="flex justify-center items-center h-max">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text text-lg font-bold">Event Image</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            id="imageNotification"
            onChange={(event) => setImage(event.target.files[0])}
          />
        </label>
      </div>
      <div className="flex justify-center items-center h-max">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text text-lg font-bold">Event Audio</span>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
            id="audioNotification"
            onChange={(event) => setAudio(event.target.files[0])}
          />
        </label>
      </div>
      <div className="flex justify-center items-center h-max">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text text-lg font-bold">Date</span>
          </div>
          <input
            type="datetime-local"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            id="eventDate"
            value={newDate}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
      </div>
      <div className="flex justify-center items-center h-max">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text text-lg font-bold">Event Detail</span>
          </div>
          <textarea
            className="textarea textarea-bordered h-24 w-full max-w-xs"
            placeholder="Detail"
            id="eventDetail"
            value={newDetail}
            onChange={(event) => setDetail(event.target.value)}
          ></textarea>
        </label>
      </div>
      <div className="flex justify-center items-center">
        <div className="form-control">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              className="toggle"
              id="statusToggle"
              checked={newStatus === "Active"}
              onChange={(event) =>
                setStatus(event.target.checked ? "Active" : "Null")
              }
            />
            <span className="label-text pl-3 text-lg font-bold">
              Status : {newStatus}
            </span>
          </label>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4">
        <input
          className="btn btn-success w-24"
          id="submit"
          type="submit"
          value="Submit"
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
      {loading ? "Submitting..." : ""}
      {statusMessage && (
        <div className="flex justify-center items-center mt-4">
          <span className="text-lg font-bold">{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
