import { useState } from "react"

export function useSaveStatus() {
  const [status, setStatus] = useState("idle") // idle | saving | saved | error

  const withSaveStatus = async (saveFn) => {
    setStatus("saving")
    try {
      await saveFn()
      setStatus("saved")
      setTimeout(() => setStatus("idle"), 2000)
    } catch (error) {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 3000)
      throw error
    }
  }

  const buttonText = (defaultText) => {
    if (status === "saving") return "Saving..."
    if (status === "saved") return "✓ Saved"
    if (status === "error") return "Error — try again"
    return defaultText
  }

  const buttonClass = (defaultClass) => {
    if (status === "saved") return "bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg transition"
    if (status === "error") return "bg-red-600 text-white font-medium px-6 py-2.5 rounded-lg transition"
    return defaultClass
  }

  const isDisabled = status === "saving"

  return { status, withSaveStatus, buttonText, buttonClass, isDisabled }
}