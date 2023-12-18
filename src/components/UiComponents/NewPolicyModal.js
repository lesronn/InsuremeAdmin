// NewPolicyModal.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";
import "./NewPolicy.css";
import colors from "../../config/colors";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./LoadingSpinner";
const NewPolicyModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const acaciaImgs = [
    "https://firebasestorage.googleapis.com/v0/b/insureme-c2e0f.appspot.com/o/logos%2Facaialogo.png?alt=media&token=704df49f-d2c5-4785-a015-9e0f6d87e322",
    "https://firebasestorage.googleapis.com/v0/b/insureme-c2e0f.appspot.com/o/logos%2Facaciastars.png?alt=media&token=9454bbc1-5c26-458e-a948-068f3b990c14",
  ];
  const glicoImgs = [
    "https://firebasestorage.googleapis.com/v0/b/insureme-c2e0f.appspot.com/o/logos%2Fglicologo.png?alt=media&token=2c7275a5-1428-4b5c-bc70-4f0facf364b6",
    "https://firebasestorage.googleapis.com/v0/b/insureme-c2e0f.appspot.com/o/logos%2Fglicostars.png?alt=media&token=4be42b0a-4458-4d34-9da8-9c2d759bdf16",
  ];
  const enterpriseImgs = [
    "https://firebasestorage.googleapis.com/v0/b/insureme-c2e0f.appspot.com/o/logos%2Fenterpriselogo.png?alt=media&token=8c882e3a-2058-4342-88c9-00647d336e1d",
    "https://firebasestorage.googleapis.com/v0/b/insureme-c2e0f.appspot.com/o/logos%2Fenterpricestars.png?alt=media&token=1029b0f5-967e-4b12-9e24-f3154272bbb0",
  ];
  const phoenixImgs = [
    "https://firebasestorage.googleapis.com/v0/b/insureme-c2e0f.appspot.com/o/logos%2Fphoenixlogo.png?alt=media&token=eb5e19cb-b9d3-4f7b-88b8-b455e712eadf",
    "https://firebasestorage.googleapis.com/v0/b/insureme-c2e0f.appspot.com/o/logos%2Fphoenixstars.png?alt=media&token=59bba764-5d92-4a5b-b65b-4431800bab3b",
  ];

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    motherCompany: Yup.string().required("Mother Company is required"),
    benefits: Yup.string().required("Benefits are required"),
    policyType: Yup.string().required("Policy Type is required"),
    features: Yup.array()
      .of(Yup.string())
      .required("At least one feature is required"),
    requirements: Yup.array()
      .of(Yup.string())
      .required("At least one requirement is required"),
    amount: Yup.string().required("Amount is required"),
    // generalInsuranceType: Yup.string().when("policyType", {
    //   is: "General",
    //   then: Yup.string().required("General Insurance Type is required"),
    // }),

    generalInsuranceType: Yup.string(),
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // Set imageUrls based on the selected motherCompany
      const imageUrls = getImageUrls(values.motherCompany);

      // Add imageUrls to the values object
      const updatedValues = { ...values, imageUrls };

      // Add the form values to the 'policies' collection in Firestore
      const docRef = await addDoc(collection(db, "policies"), updatedValues);

      console.log("Document written with ID: ", docRef.id);
      setLoading(false);
      onClose();
      // Show success toast
      toast.success("Policy added successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });

      // Close the modal after successful submission
    } catch (error) {
      console.log("Error adding document: ", error);
      setLoading(false);
      // Check for specific types of errors
      if (error.code === "permission-denied") {
        toast.error(
          "Permission denied. You do not have the necessary permissions.",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      } else if (error.message.includes("Failed to fetch")) {
        toast.error(
          "Unable to connect to the internet. Please check your connection.",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      } else {
        toast.error("Error adding policy. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      // Handle the error as needed (e.g., show an error message to the user)
    }
  };

  const getImageUrls = (selectedMotherCompany) => {
    switch (selectedMotherCompany) {
      case "Phoenix Insurance":
        return phoenixImgs;
      case "Glico Insurance":
        return glicoImgs;
      case "Acacia Insurance":
        return acaciaImgs;
      case "Enterprise Insurance":
        return enterpriseImgs;
      default:
        return [];
    }
  };

  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        motherCompany: "",
        benefits: "",
        policyType: "",
        features: [""],
        requirements: [""],
        amount: "",
        generalInsuranceType: "",
        imageUrls: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form>
          <Row>
            <Col>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message"
                />
              </div>
            </Col>
            <Col>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <Field
                  type="text"
                  id="description"
                  name="description"
                  className="form-control"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="error-message"
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="form-group">
                <label htmlFor="motherCompany">Mother Company:</label>
                <Field
                  as="select"
                  id="motherCompany"
                  name="motherCompany"
                  className="form-control"
                >
                  <option value="" disabled>
                    Select Mother Company
                  </option>
                  <option value="Phoenix Insurance">Phoenix Insurance</option>
                  <option value="Glico Insurance">Glico Insurance</option>
                  <option value="Acacia Insurance">Acacia Insurance</option>
                  <option value="Enterprise Insurance">
                    Enterprise Insurance
                  </option>
                  {/* Add more options as needed */}
                </Field>
                <ErrorMessage
                  name="motherCompany"
                  component="div"
                  className="error-message"
                />
              </div>
            </Col>
            <Col>
              <div className="form-group">
                <label htmlFor="policyType">Policy Type:</label>
                <Field
                  as="select"
                  id="policyType"
                  name="policyType"
                  className="form-control"
                >
                  <option value="" disabled>
                    Select Policy Type
                  </option>
                  <option value="Life">Life</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Health">Health</option>
                  <option value="General">General</option>
                  {/* Add more options as needed */}
                </Field>
                <ErrorMessage
                  name="policyType"
                  component="div"
                  className="error-message"
                />
              </div>
            </Col>
          </Row>

          {/* Check the value of policyType and conditionally render the additional field */}
          {values.policyType === "General" && (
            <div className="form-group">
              <label htmlFor="generalInsuranceType">
                General Insurance Type:
              </label>
              <Field
                as="select"
                id="generalInsuranceType"
                name="generalInsuranceType"
                className="form-control"
              >
                <option value="" disabled>
                  Select General Insurance Type
                </option>
                <option value="Travel">Travel</option>
                <option value="Home">Home</option>
                {/* Add more options as needed */}
              </Field>
              <ErrorMessage
                name="generalInsuranceType"
                component="div"
                className="error-message"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="benefits">Benefits:</label>
            <Field
              type="text"
              id="benefits"
              name="benefits"
              className="form-control"
            />
            <ErrorMessage
              name="benefits"
              component="div"
              className="error-message"
            />
          </div>

          {/* Features */}
          <div className="form-group">
            <label>Features:</label>
            <FieldArray name="features">
              {({ push, remove, form }) => (
                <div>
                  {form.values.features.map((feature, index) => (
                    <div key={index}>
                      <Field
                        type="text"
                        name={`features[${index}]`}
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="remove-button"
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <div
                    style={{
                      width: "100%",
                      // backgroundColor: colors.danger,
                      justifyContent: "flex-end",
                      display: "flex",
                      // paddingTop: -20,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => push("")}
                      className="add-button"
                      style={{ marginTop: -25 }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </FieldArray>
            <ErrorMessage
              name="features"
              component="div"
              className="error-message"
            />
          </div>

          {/* Requirements */}
          <div className="form-group">
            <label>Requirements:</label>
            <FieldArray name="requirements">
              {({ push, remove, form }) => (
                <div>
                  {form.values.requirements.map((requirement, index) => (
                    <div key={index}>
                      <Field
                        type="text"
                        name={`requirements[${index}]`}
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="remove-button"
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <div
                    style={{
                      width: "100%",

                      justifyContent: "flex-end",
                      display: "flex",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => push("")}
                      className="add-button"
                      style={{ marginTop: -25 }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </FieldArray>
            <ErrorMessage
              name="requirements"
              component="div"
              className="error-message"
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount:</label>
            <Field
              type="text"
              id="amount"
              name="amount"
              className="form-control"
            />
            <ErrorMessage
              name="amount"
              component="div"
              className="error-message"
            />
          </div>
          <div
            style={{
              // backgroundColor: colors.danger,
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <button
              type="submit"
              style={{
                width: "80%",
                height: 45,
                outline: "none",
                border: "none",
                backgroundColor: colors.primary,
                color: colors.white,
                fontFamily: "SoraBold",
                borderRadius: 7,
              }}
              className="submit-button"
            >
              {loading ? <LoadingSpinner /> : "Submit"}
            </button>
            <button
              style={{
                width: "15%",
                height: 45,
                outline: "none",
                border: "none",
                backgroundColor: colors.primary,
                color: colors.white,
                fontFamily: "SoraBold",
                borderRadius: 7,
              }}
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

NewPolicyModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default NewPolicyModal;
