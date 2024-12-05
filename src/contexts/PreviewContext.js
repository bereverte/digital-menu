import React, { createContext, useState } from "react"

export const PreviewContext = createContext()

export const PreviewProvider = ({ children }) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  return (
    <PreviewContext.Provider value={{ isPreviewMode, setIsPreviewMode }}>
      {children}
    </PreviewContext.Provider>
  )
}
