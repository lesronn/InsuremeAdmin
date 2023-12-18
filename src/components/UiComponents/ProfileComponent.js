import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./Profile.css";
import { toast } from "react-toastify";
import { db } from "../../config/firebaseConfig";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const ProfilePage = ({
  user,
  extraData,
  policyType,
  policy,
  status,
  userPolicy,
}) => {
  console.log(userPolicy, "Main");
  const [entries, setEntries] = useState([]);

  const [actionloader, setActionLoader] = useState(false);
  const [declineloader, setDeclineLoader] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [internetError, setInternetError] = useState(false);
  const handleActionClick = async (userPolicy, action) => {
    console.log("User Policy", userPolicy, "action", action);
    console.log(`Action ${action} clicked for row with id ${userPolicy.id}`);
    try {
      if (action === "Accept") {
        setActionLoader(true);
        console.log("Accept Clicked");
        // Update the status to 'accepted' on the server
        const userPolicyRef = doc(db, "userPolicies", userPolicy.id);
        await updateDoc(userPolicyRef, { status: "accepted" });
        // If the server update is successful, remove the entry from the array
        setCurrentStatus("accepted");
        // Update the state with the modified entries
        sendNotification(userPolicy.policy, userPolicy.user.uid, "accepted");
        setActionLoader(false);
        toast.success("Policy Accepted!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (action === "Decline") {
        console.log("Declined Clicked");
        setDeclineLoader(true);
        console.log("Accept Clicked");
        // Update the status to 'accepted' on the server
        const userPolicyRef = doc(db, "userPolicies", userPolicy.id);
        await updateDoc(userPolicyRef, { status: "declined" });
        // If the server update is successful, remove the entry from the array
        setCurrentStatus("declined");
        // Update the state with the modified entries
        sendNotification(userPolicy.policy, userPolicy.user.uid, "declined");

        setDeclineLoader(false);
        toast.success("Policy Declined!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      setActionLoader(false);
      setDeclineLoader(false);
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
  const renderExtraData = () => {
    switch (policyType) {
      case "Life":
        return (
          <div>
            <p>
              <b>Address</b> : {extraData.address}
            </p>
            <p>
              <b>Occupation</b>: {extraData.occupation}
            </p>
          </div>
        );
      case "Health":
        return (
          <div>
            <p>
              <b>Address</b> : {extraData.address}
            </p>

            <p>
              <b>Medical History</b> :
              <a
                href={extraData.medicalhistory}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Medical History
              </a>
            </p>
            <p>
              <b>Valid ID</b> <br /> <br />{" "}
              <img src={extraData.validId} alt="Valid ID" />
            </p>
          </div>
        );
      case "Vehicle":
        return (
          <div>
            {/* <p><b>Policy Type</b>: {policyType}</p> */}
            <p>
              <b>Primary Driver</b> : {extraData.primaryDriver}
            </p>

            <p>
              <b>Vehicle Usage</b> : {extraData.vehicleUsage}
            </p>
            <p>
              <b>Vehicle Price</b> : {extraData.vehiclePrice}
            </p>
            <Row>
              <Col>
                <p>
                  <b> License</b> <br />
                  <br />
                  <img src={extraData.license} alt="License" />
                </p>
              </Col>
              <Col>
                <p>
                  <b>Vehicle Image</b> <br />
                  <br />
                  <img src={extraData.vehicleImage} alt="Vehicle Image" />
                </p>
              </Col>
            </Row>
          </div>
        );
      case "General":
        if (policy.generalInsuranceType === "Travel") {
          return (
            <div>
              <p>
                <b>Trip Itinerary</b> :{" "}
                <a
                  href={extraData.tripItinerary}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Trip Itinerary
                </a>
              </p>
              <p>
                <b>Passport</b> <br /> <br />
                <img src={extraData.passport} alt="Passport" />
              </p>
            </div>
          );
        } else if (policy.generalInsuranceType === "Home") {
          return (
            <div>
              <p>
                <b> Ownership Proof</b> :{" "}
                <a
                  href={extraData.ownershipProof}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Ownership Proof
                </a>
              </p>
              <p>
                <b>Property Valuation</b> :{" "}
                <a
                  href={extraData.propertyValuation}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Property Valuation
                </a>
              </p>
              <p>
                <b> Risk Assessment</b> :{" "}
                <a
                  href={extraData.riskAssessment}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Risk Assessment
                </a>
              </p>
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div style={{ paddingTop: 20 }}>
      {/* <h1 className="mt-4">User Profile</h1> */}
      <Row>
        <Col md={6}>
          <Card className="mb-4" style={{ marginLeft: 10 }}>
            <Card.Body>
              <h2>User Information</h2>
              <p>
                <b>Name</b> : {user.name}
              </p>
              <p>
                <b>Email</b> : {user.email}
              </p>
              <p>
                <b>Phone</b> : {user.phone}
              </p>
              <p>
                <b>Gender</b> : {user.gender}
              </p>
              <p>
                <b>Date Of Birth</b> : {user.dob}
              </p>

              {/* Add more user information fields as needed */}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4" style={{ marginRight: 10 }}>
            <Card.Body>
              <h2>Policy Information</h2>
              <p>
                <b>Policy id</b> : {policy.id}
              </p>
              <p>
                <b>Policy Name</b> : {policy.name}
              </p>
              <p>
                <b>Policy Type</b> : {policyType}
              </p>
              {/* Add more policy information fields as needed */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-4" style={{ marginLeft: 10 }}>
            <Card.Body>
              <h2>Extra Data</h2>
              {renderExtraData()}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          {currentStatus === "inProgress" && (
            <Card className="mb-4" style={{ marginRight: 10 }}>
              <Card.Body>
                <div className="d-grid gap-5">
                  <Button
                    onClick={() => handleActionClick(userPolicy, "Accept")}
                    variant="success"
                    size="lg"
                  >
                    {actionloader ? <LoadingSpinner /> : "Accept"}
                  </Button>
                  <Button
                    onClick={() => handleActionClick(userPolicy, "Decline")}
                    variant="danger"
                    size="lg"
                  >
                    {declineloader ? <LoadingSpinner /> : "Decline"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
