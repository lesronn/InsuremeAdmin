import { AuthData } from "../../auth/AuthWrapper";

import colors from "../../config/colors";
import { db } from "../../config/firebaseConfig";
import Card from "../UiComponents/Card";
import Table from "../UiComponents/Table";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import Lottie from "lottie-react";
import NoContent from "../../assets/nocontent.json";
import { toast } from "react-toastify";
import { useNavigate, createSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
export const DeclinedEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionloader, setActionLoader] = useState(false);
  const navigate = useNavigate();
  const [internetError, setInternetError] = useState(false);
  const fetchData = async () => {
    try {
      const q = query(
        collection(db, "userPolicies"),
        where("status", "==", "declined")
      );
      const snapshot = await getDocs(q);

      const entriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(entriesData);

      setEntries(entriesData);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      erroHandler(error);
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const handleActionClick = async (data, action) => {
    console.log(`Action ${action} clicked for row with id ${data.id}`);
    try {
      if (action === "Accept") {
        setActionLoader(true);
        console.log("Accept Clicked");
        // Update the status to 'accepted' on the server
        const userPolicyRef = doc(db, "userPolicies", data.id);
        await updateDoc(userPolicyRef, { status: "accepted" });

        // If the server update is successful, remove the entry from the array
        const updatedEntries = entries.filter((entry) => entry.id !== data.id);

        // Update the state with the modified entries
        setEntries(updatedEntries);
        setActionLoader(false);
        toast.success("Policy Accepted!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (action === "Decline") {
        console.log("Declined Clicked");
        // Implement logic for declining the signup
      } else if (action === "View") {
        navigate("/bioData", {
          state: {
            userPolicy: data,
          },
        });
        console.log("View Clicked");

        console.log("View Clicked");
      }
    } catch (error) {
      setActionLoader(false);
      erroHandler(error);
      console.error("Error updating status:", error);
    }
  };

  const erroHandler = (error) => {
    // console.log('Error getting news data: ', error);
    if (error.code && error.code === "firestore/unavailable") {
      console.log("internet Error");
      setInternetError(true);
      toast.error("Internet Error!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      toast.error("Something went wrong. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  return (
    <div className="page">
      {loading ? (
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Loading...</h2>
        </div>
      ) : entries.length > 0 ? (
        <Table
          data={entries}
          onActionClick={handleActionClick}
          loading={actionloader}
          isprogress={false}
        />
      ) : (
        <div
          style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Lottie
            style={{ height: 250, width: 250 }}
            animationData={NoContent}
          />
          <h2 style={{ color: colors.primaryText, fontFamily: "SoraMedium" }}>
            No Declined signups found!
          </h2>
        </div>
      )}
    </div>
  );
};
