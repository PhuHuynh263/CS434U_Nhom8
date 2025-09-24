import { useEffect } from "react";
import { useApp } from "../../context/AppContext";
import SimpleAlert from "./SimpleAlert";

const GlobalNotifications = () => {
  const { error, successMessage, clearError, clearSuccessMessage } = useApp();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccessMessage();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccessMessage]);

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 10000,
        maxWidth: "400px",
      }}
    >
      {error && (
        <SimpleAlert type="error" message={error} onClose={clearError} />
      )}
      {successMessage && (
        <SimpleAlert
          type="success"
          message={successMessage}
          onClose={clearSuccessMessage}
        />
      )}
    </div>
  );
};

export default GlobalNotifications;
