import React from "react"
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import "../styles/AuthPage.scss"
import apiMethods from "../api"

export default function Register() {
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    email: Yup.string().email("invalid email address").required("email is required"),
    password: Yup.string()
      .min(6, "password must be at least 6 characters")
      .required("password is required"),
    restaurant_name: Yup.string().required("Restaurant's name is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "passwords must match")
      .required("confirm password is required"),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true)
    try {
      const response = await apiMethods.register(
        values.restaurant_name,
        values.email,
        values.password
      )
      console.log("Register response data:", response.data)

      alert("Your account has been successfully created! You can now log in.")
      navigate("/accounts/login")
    } catch (error) {
      if (error.response && error.response.data.error) {
        alert(error.response.data.error)
      } else {
        alert("An error occurred during registration. Please try again.")
      }
      console.error("Authentication error:", error)
    }
    setSubmitting(false)
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>REGISTER</h2>
        <Formik
          initialValues={{
            email: "",
            password: "",
            restaurant_name: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, resetForm }) => (
            <>
              <Form className="auth-form-container">
                <div className="auth-form-group">
                  <Field
                    type="text"
                    name="restaurant_name"
                    placeholder="Restaurant's Name"
                    className="auth-form-input"
                  />
                  <ErrorMessage name="restaurant_name" component="div" className="error-message" />
                </div>

                <div className="auth-form-group">
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="auth-form-input"
                    autoComplete="email"
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>

                <div className="auth-form-group">
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="auth-form-input"
                  />
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>

                <div className="auth-form-group">
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="auth-form-input"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="error-message" />
                </div>

                <button type="submit" disabled={isSubmitting} className="auth-form-btn">
                  {"Create account"}
                </button>
              </Form>

              <p>
                {"Already have an account?"}{" "}
                <span className="toggle-auth-link" onClick={() => navigate("/accounts/login")}>
                  {"Login"}
                </span>
              </p>
            </>
          )}
        </Formik>
      </div>
    </div>
  )
}
