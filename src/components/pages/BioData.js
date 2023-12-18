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
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import ProfilePage from "../UiComponents/ProfileComponent";

export const BioData = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionloader, setActionLoader] = useState(false);

  const [internetError, setInternetError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  console.log("location", location.state);
  const userPolicy = location.state.userPolicy;

  return (
    <div className="page">
      <button
        style={{
          margin: 10,
          background: colors.primary,
          color: colors.white,
          outline: "none",
          border: "none",
          borderRadius: 5,
        }}
        onClick={() => {
          navigate(-1);
        }}
      >
        Go back
      </button>

      <ProfilePage
        user={userPolicy.user}
        extraData={userPolicy.ExtraData}
        policyType={userPolicy.policy.policyType}
        policy={userPolicy.policy}
        status={userPolicy.status}
        userPolicy={userPolicy}
      />
    </div>
  );
};
