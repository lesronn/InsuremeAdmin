import { AuthData } from "../../auth/AuthWrapper";
import colors from "../../config/colors";
import BarChart from "../UiComponents/Barchart";
import Card from "../UiComponents/Card";
import "./Home.css";
import { MdAdd, MdClose } from "react-icons/md";
import Modal from "../UiComponents/Modal";
import { useEffect, useState } from "react";
import NewPolicyModal from "../UiComponents/NewPolicyModal";
import { db } from "../../config/firebaseConfig";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
export const Home = () => {
  const { user } = AuthData();

  const [isModalOpen, setModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  const [documentCounts, setDocumentCounts] = useState({
    accepted: 0,
    declined: 0,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(false);
  const [actionloader, setActionLoader] = useState(false);
  console.log(documentCounts);
  const [internetError, setInternetError] = useState(false);
  const [MotherCompanyCounts, setMotherCompanyCounts] = useState({
    phoenix: 0,
    glico: 0,
    acacia: 0,
    enterprise: 0,
  });
  const [motherCompanyLoading, setMotherCompanyLoading] = useState(false);
  const fetchData = async () => {
    try {
      const acceptedQuery = query(
        collection(db, "userPolicies"),
        where("status", "==", "accepted")
      );
      const acceptedSnapshot = await getDocs(acceptedQuery);
      const acceptedCount = acceptedSnapshot.size;

      const declinedQuery = query(
        collection(db, "userPolicies"),
        where("status", "==", "declined")
      );
      const declinedSnapshot = await getDocs(declinedQuery);
      const declinedCount = declinedSnapshot.size;

      const inProgressQuery = query(
        collection(db, "userPolicies"),
        where("status", "==", "inProgress")
      );
      const inProgressSnapshot = await getDocs(inProgressQuery);
      const inProgressCount = inProgressSnapshot.size;

      // Mother Companies
      const PhoenixCompany = query(
        collection(db, "userPolicies"),
        where("policy.motherCompany", "==", "Phoenix Insurance")
      );
      const PhoenixCompanyRes = await getDocs(PhoenixCompany);
      const phoenixCount = PhoenixCompanyRes.size;
      console.log(phoenixCount, "Phoenic COunt");

      const GlicoCompany = query(
        collection(db, "userPolicies"),
        where("policy.motherCompany", "==", "Glico Insurance")
      );
      const GlicoCompanyRes = await getDocs(GlicoCompany);
      const glicoCount = GlicoCompanyRes.size;
      console.log(glicoCount, "glico COunt");

      const AcaciaCompany = query(
        collection(db, "userPolicies"),
        where("policy.motherCompany", "==", "Acacia Insurance")
      );
      const AcaciaCompanyRes = await getDocs(AcaciaCompany);
      const AcaciaCount = AcaciaCompanyRes.size;
      console.log(AcaciaCount, "Acacia Count");

      const EnterpriseCompany = query(
        collection(db, "userPolicies"),
        where("policy.motherCompany", "==", "Enterprise Insurance")
      );
      const EnterpriseCompanyRes = await getDocs(EnterpriseCompany);
      const EnterpriseCount = EnterpriseCompanyRes.size;
      console.log(EnterpriseCount, "EnterpriseCount");

      setDocumentCounts({
        accepted: acceptedCount,
        declined: declinedCount,
        inProgress: inProgressCount,
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching document counts:", error);
    }
  };
  const fetchMotherCompanyCount = async () => {
    setMotherCompanyLoading(true);
    try {
      // Mother Companies
      const PhoenixCompany = query(
        collection(db, "userPolicies"),
        where("policy.motherCompany", "==", "Phoenix Insurance")
      );
      const PhoenixCompanyRes = await getDocs(PhoenixCompany);
      const phoenixCount = PhoenixCompanyRes.size;
      console.log(phoenixCount, "Phoenic COunt");

      const GlicoCompany = query(
        collection(db, "userPolicies"),
        where("policy.motherCompany", "==", "Glico Insurance")
      );
      const GlicoCompanyRes = await getDocs(GlicoCompany);
      const glicoCount = GlicoCompanyRes.size;
      console.log(glicoCount, "glico COunt");

      const AcaciaCompany = query(
        collection(db, "userPolicies"),
        where("policy.motherCompany", "==", "Acacia Insurance")
      );
      const AcaciaCompanyRes = await getDocs(AcaciaCompany);
      const AcaciaCount = AcaciaCompanyRes.size;
      console.log(AcaciaCount, "Acacia Count");

      const EnterpriseCompany = query(
        collection(db, "userPolicies"),
        where("policy.motherCompany", "==", "Enterprise Insurance")
      );
      const EnterpriseCompanyRes = await getDocs(EnterpriseCompany);
      const EnterpriseCount = EnterpriseCompanyRes.size;
      console.log(EnterpriseCount, "EnterpriseCount");

      setMotherCompanyCounts({
        phoenix: phoenixCount,
        glico: glicoCount,
        acacia: AcaciaCount,
        enterprise: EnterpriseCount,
      });
      setMotherCompanyLoading(false);
    } catch (error) {
      setMotherCompanyLoading(false);
      console.error("Error fetching document counts:", error);
    }
  };
  const data = [
    {
      label: "New Entries",
      value: documentCounts.inProgress,
    },
    {
      label: "Accepted ",
      value: documentCounts.accepted,
    },
    {
      label: "Declined ",
      value: documentCounts.declined,
    },
  ];
  useEffect(() => {
    fetchMotherCompanyCount();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);
  return (
    <div className="page" style={{ backgroundColor: colors.primaryBg }}>
      <div className="cardsContainer">
        <Card
          title="Phoenix Insurance"
          subTitle={
            motherCompanyLoading ? "loading.." : MotherCompanyCounts?.phoenix
          }
        />
        <Card
          title="Glico Insurance"
          subTitle={
            motherCompanyLoading ? "loading.." : MotherCompanyCounts?.glico
          }
        />
        <Card
          title="Acacia Insurance"
          subTitle={
            motherCompanyLoading ? "loading.." : MotherCompanyCounts?.acacia
          }
        />
        <Card
          title="Enterprise Insurance"
          subTitle={
            motherCompanyLoading ? "loading.." : MotherCompanyCounts?.enterprise
          }
        />
      </div>

      <div
        style={{
          width: "100%",
          justifyContent: "center",
          display: "flex",
          marginTop: 50,
        }}
      >
        <div
          style={{
            width: "60%",
            backgroundColor: colors.white,
            padding: 30,
            borderRadius: 15,
          }}
        >
          {loading && <p>Loading Bar chart Data.....</p>}
          <BarChart data={data} />
        </div>
      </div>
      <button
        onClick={openModal}
        style={{
          backgroundColor: colors.primary,
          display: "flex",
          position: "absolute",
          bottom: 20,
          right: 20,
          padding: 20,
          borderRadius: 2000,
          outline: "none",
          border: "none",
        }}
        className="floatingBtn"
      >
        <MdAdd size={25} style={{ color: "white" }} />
      </button>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {/* Content of your modal, e.g., form to post a new policy */}
          {/* Ensure that your modal is positioned on the right side and fills half of the screen */}
          <div
            className={`modal-container ${
              isModalOpen ? "slide-in" : "slide-out"
            }`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <button
                style={{
                  backgroundColor: "transparent",
                  outline: "none",
                  border: "none",
                  borderRadius: 10,
                  padding: 10,
                }}
                onClick={closeModal}
              >
                <MdClose size={30} style={{ color: colors.primary }} />
              </button>
              <h2
                style={{
                  paddingLeft: 30,
                  fontFamily: "SoraBold",
                }}
              >
                Add new Insurance Policy
              </h2>
            </div>

            <NewPolicyModal onClose={closeModal} />
          </div>
        </Modal>
      )}
    </div>
  );
};
