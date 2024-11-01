import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import "../styles/AuthPage.scss"
import apiMethods from "../api"

export default function Login() {
  const [failedCredentials, setFailedCredentials] = useState("")
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    email: Yup.string().email("invalid email address").required("email is required"),
    password: Yup.string()
      .min(6, "password must be at least 6 characters")
      .required("password is required"),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true)
    try {
      // Login
      const response = await apiMethods.login(values.email, values.password)
      console.log("Response from API:", response)

      if (response && response.data) {
        const { token, restaurant_id, restaurant_name, email } = response.data
        localStorage.setItem("token", token)
        localStorage.setItem("restaurantId", restaurant_id)
        localStorage.setItem("restaurantName", restaurant_name)
        localStorage.setItem("email", email)
        navigate("/home")
      } else {
        console.error("Invalid response from API:", response)
        setFailedCredentials("Authentication failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setFailedCredentials("Authentication failed. Please check your credentials.")
    }
    setSubmitting(false)
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2>LOGIN</h2>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <>
              <Form className="auth-form-container">
                {failedCredentials && (
                  <div className="error-message auth-error">{failedCredentials}</div> // Muestra el mensaje de error
                )}

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

                <button type="submit" disabled={isSubmitting} className="auth-form-btn">
                  {"Login"}
                </button>
              </Form>

              <p>
                {"Don't have an account?"}{" "}
                <span className="toggle-auth-link" onClick={() => navigate("/register")}>
                  {"Register here"}
                </span>
              </p>
            </>
          )}
        </Formik>
      </div>
    </div>
  )
}
