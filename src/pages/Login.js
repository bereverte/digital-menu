import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import "../styles/AuthPage.scss"
import { AuthContext } from "../contexts/AuthContext" // Importa el context d'autenticació

export default function Login() {
  const [failedCredentials, setFailedCredentials] = useState("")
  const navigate = useNavigate()
  const { login } = useContext(AuthContext) // Extreu la funció `login` del context

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true)
    try {
      await login(values.email, values.password) // Utilitza la funció `login` del context
      navigate("/home") // Redirigeix a Home després d'iniciar sessió correctament
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
                  <div className="error-message auth-error">{failedCredentials}</div>
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
