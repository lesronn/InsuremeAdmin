import { useEffect, useState } from "react";
import { AuthData } from "../../auth/AuthWrapper";
import colors from "../../config/colors";
import Card from "../UiComponents/Card";
import Table from "../UiComponents/Table";
import { db } from "../../config/firebaseConfig";
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
import axios from "axios";
export const Entries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionloader, setActionLoader] = useState(false);
  const navigate = useNavigate();
  const [internetError, setInternetError] = useState(false);
  const fetchData = async () => {
    try {
      const q = query(
        collection(db, "userPolicies"),
        where("status", "==", "inProgress")
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
        sendNotification(data.policy, data.user.uid, "accepted");
        setEntries(updatedEntries);
        setActionLoader(false);
        toast.success("Policy Accepted!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (action === "Decline") {
        console.log("Declined Clicked");
        setActionLoader(true);
        console.log("Accept Clicked");
        // Update the status to 'accepted' on the server
        const userPolicyRef = doc(db, "userPolicies", data.id);
        await updateDoc(userPolicyRef, { status: "declined" });

        // If the server update is successful, remove the entry from the array
        const updatedEntries = entries.filter((entry) => entry.id !== data.id);
        // Update the state with the modified entries
        sendNotification(data.policy, data.user.uid, "declined");
        setEntries(updatedEntries);
        setActionLoader(false);
        toast.success("Policy Declined!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (action === "View") {
        navigate("/bioData", {
          state: {
            userPolicy: data,
          },
        });
        console.log("View Clicked");
        // Implement logic for viewing the signup
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

  async function sendNotification(policy, userId, status) {
    console.log(policy, userId);
    try {
      // FCM endpoint
      const fcmEndpoint = "https://fcm.googleapis.com/fcm/send";

      // FCM server key (replace with your server key)
      const serverKey =
        "AAAAQp__skY:APA91bFf2M3m2apVH3RiD4nLi_aGPao08MBT35GGv_b8ruNtNfEpro4VbM27ey9tX1R_rUQJedpEltsIl-dz_3RIGKVBxsjq9flwDLBhrZlQKmQA4LXtbvtqdCBiDZp7qfhi36QvEV5M";
      // Topic name to send the notification
      const topic = `user-${userId}`;
      let notificationTitle;
      let notificationBody;
      status === "accepted"
        ? (notificationTitle = "Policy Accepted")
        : (notificationTitle = "Policy Declined");
      status === "accepted"
        ? (notificationBody = `Your signup request for ${policy.name} has been accepted. With a fee of ${policy.amount}`)
        : (notificationBody = `Your signup request for ${policy.name} has been declined.`);

      // Notification payload
      const payload = {
        to: `/topics/${topic}`, // Specify the topic here
        // notification: { title: "Breaking News" },
        data: {
          title: notificationTitle,
          body: notificationBody,
          policy: policy,
        },
        android: {
          contentAvailable: true,
          priority: "high",
        },
      };
      // Send the notification using Axios
      const response = await axios.post(fcmEndpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `key=${serverKey}`,
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        console.log("Notification sent successfully");
      } else {
        console.log(response.data);
        console.error("Failed to send notification:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending notification:", error.message);
    }
  }

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
          isprogress={true}
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
            No new signups found!
          </h2>
        </div>
      )}
    </div>
  );
};
